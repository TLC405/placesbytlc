

# TLC Engine + KHAOS Scoring — MVP Implementation Plan

## Context
The app already has an `okc_events_cache` table and an `event-discovery` edge function using AI to generate sample events. The spec calls for a full OSINT event discovery pipeline, KHAOS organizer scoring, and a TLC Engine. Given the Lovable stack constraints (React + Vite + Supabase — no Next.js, no Prisma, no Redis), here's what we can actually ship.

---

## Phase 1: Database Schema (Migration)

Create new tables to support the TLC Engine and KHAOS model:

**New tables:**
- `events` — normalized events with `source` enum (ticketmaster, eventbrite, manual, ai_generated), `source_event_id`, title, description, `starts_at`, `ends_at`, timezone, `venue_id`, `organizer_id`, ticket_url, event_url, price_min, price_max, currency, age_band (jsonb), tags (text[]), raw (jsonb), status
- `organizers` — id, name, website, claimed (bool), social_links (jsonb), raw (jsonb)
- `venues` — id, name, address, city, state, zip, lat, lng, raw (jsonb)
- `event_signals` — event_id, signal_type, source, value (numeric), captured_at, raw (jsonb)
- `organizer_signals` — organizer_id, signal_type, source, value (numeric), captured_at, raw (jsonb)
- `khaos_scores` — organizer_id (unique), score_total (numeric), components (jsonb: reliability, experience, safety, transparency, media), explain (jsonb), scored_at, confidence (text: low/medium/high)

**RLS:** All tables publicly readable (SELECT true). Insert/update/delete restricted to admin role. Signal and score tables use service role only for writes.

**Retain** existing `okc_events_cache` and `discovered_places` — migrate data into new `events`/`venues` tables via a one-time SQL migration.

## Phase 2: Ticketmaster Discovery Adapter (Edge Function)

Create `supabase/functions/tlc-engine-discover/index.ts`:
- Accepts `?source=ticketmaster` (expandable to other sources)
- Calls Ticketmaster Discovery API (`/discovery/v2/events`) with:
  - `latlong=35.4676,-97.5164` (OKC center)
  - `radius=60&unit=miles`
  - `startDateTime` / `endDateTime` for next 30 days
  - `classificationName=music,sports,arts,miscellaneous`
- Normalizes results into the `events`, `venues`, `organizers` tables
- Deduplicates by `source + source_event_id`
- Falls back to existing AI-generated events if Ticketmaster key is missing

**Requires:** A `TICKETMASTER_API_KEY` secret. Will use the `add_secret` tool to request it from you before proceeding. Ticketmaster Discovery API keys are free to obtain at [developer.ticketmaster.com](https://developer.ticketmaster.com).

## Phase 3: Manual Event Import (Edge Function + UI)

Create `supabase/functions/tlc-engine-import/index.ts`:
- Accepts POST with `{ url, source: 'eventbrite' | 'manual' }` 
- For Eventbrite URLs: fetches public page, extracts JSON-LD structured data
- For manual: accepts structured event JSON from admin form
- Upserts into `events` table

**Admin UI addition** in `AdminPanel.tsx`:
- "Import Event" form with URL paste + structured fields
- CSV import support for bulk event loading

## Phase 4: KHAOS Scoring Service (Edge Function)

Create `supabase/functions/khaos-score/index.ts`:
- Triggered on-demand or via scheduled call
- For each organizer with sufficient signals:
  - Computes weighted score: Reliability (0.30), Experience (0.25), Safety (0.20), Transparency (0.15), Media (0.10)
  - Normalizes signals 0-1 with recency weighting (6-month window)
  - Sets confidence flag (low/medium/high based on signal count)
  - Stores explainable breakdown in `khaos_scores.components` and `khaos_scores.explain`
- Uses AI (Gemini Flash) to enrich explanations from raw signal data

## Phase 5: TLC Engine Search UI

Update `src/pages/EnhancedOKCLegend.tsx` to become a full **Events + Places** discovery page:
- New "Events" tab alongside existing "Places" tab
- Events tab queries the new `events` table with filters: date range, type, price, distance
- Each event card shows venue, date, price, organizer name
- If organizer has a KHAOS score, show a badge (shield icon + score) on the card
- Clicking an event opens a detail modal with full description, organizer info, KHAOS breakdown (if premium/available), and external ticket link

**Home page update:** Add an "Upcoming Events" section using the new events table instead of `okc_events_cache`.

## Phase 6: KHAOS Dashboard (Premium Section)

New component `src/components/KhaosScoreCard.tsx`:
- Displays organizer score with radar chart (using recharts) for the 5 components
- "Why this score" expandable section showing the explain payload
- Confidence indicator (Low/Medium/High)
- "Insufficient data" state for new organizers

Add an `/organizers` route or section within the Places page showing ranked organizers with their KHAOS scores.

## Technical Constraints Addressed

- **No Meetup scraping** — only manual submission supported
- **Eventbrite** — URL import with JSON-LD extraction, no public search API
- **Ticketmaster** — official Discovery API with caching
- **No Next.js/Prisma/Redis** — everything runs on React + Supabase edge functions + Postgres
- **Scoring is organizer-level only** — no people-level social scoring
- **Data minimization** — raw snapshots stored in JSONB with TTL awareness

## Implementation Order

1. Database migration (new tables)
2. Request Ticketmaster API key from user
3. Build `tlc-engine-discover` edge function
4. Build `tlc-engine-import` edge function  
5. Build `khaos-score` edge function
6. Update Events UI + Home page
7. Build KHAOS dashboard component

