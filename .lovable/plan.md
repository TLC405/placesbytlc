

# Supercharge TLC Engine Search — Full Discovery Overhaul

## Problem
The search only returns results when keywords match exact titles/descriptions. With only 10 places and 50 events in the DB, and Ticketmaster limited to keyword matching, most searches feel empty. There's no way to browse by category, no auto-loading, and no AI enrichment unless everything else returns zero.

## Plan

### 1. Auto-Load Everything on Page Open
- On mount, fetch ALL upcoming events from DB + fire a broad Ticketmaster query (no keyword, just OKC lat/lng + next 30 days) to show 20+ events immediately
- Show all 10+ discovered_places grouped by category
- No typing required — user sees a full feed instantly

### 2. Expand Ticketmaster Search Strategy (Edge Function)
Current: single keyword search, `size=20`
New approach in `search-everything`:
- When user searches a **category** (e.g. "music", "food", "sports"), fire **multiple Ticketmaster queries** using `classificationName` parameter instead of `keyword` — this returns far more results
- Increase `size` to 50
- Add `sort=date,asc` for chronological browsing
- When query is empty but category is set, do a **browse** query (no keyword, just classification + location)
- Search `tags` column in events table too (currently only searches title/description)

### 3. AI-Enriched Category Discovery
- When user taps a category or searches, **always** call AI (not just on zero results) to supplement with 5-10 real OKC suggestions for that category
- Use Gemini Flash to generate places by category: "Best OKC restaurants", "Best OKC nightlife", etc.
- Show AI results in a separate "Recommended" section so the feed always feels full

### 4. Richer Category System
Replace the current 5 basic categories with 12+ tappable category cards that auto-search:
- Music, Sports, Food & Drink, Nightlife, Arts & Culture, Outdoor, Comedy, Family, Fitness, Shopping, Wellness, Date Night
- Each category maps to both a Ticketmaster `classificationName` AND an AI prompt

### 5. Vibe Match, Date Builder, Hidden Gems, Live Pulse
- **Vibe Match**: Text input like "chill sunset drinks" → AI interprets mood and returns matched events + places
- **Date Builder**: Pick vibe + budget + time → AI generates a full evening itinerary using real DB data
- **Hidden Gems**: AI-curated section of underrated OKC spots, shown on the main feed
- **Live Pulse**: Count events by area/venue and show "buzzing" indicators on category cards

### 6. Frontend Changes (EnhancedOKCLegend.tsx)
- Replace static quick-search tags with tappable category grid (2 columns, emoji + label)
- Auto-load events + places on mount
- Add "Vibe Match" input above categories
- Add "Date Builder" and "Hidden Gems" sections
- Always show results — never an empty state

### 7. Edge Function Changes (search-everything)
- Add `mode` parameter: `search` | `browse` | `vibe` | `date-builder`
- Browse mode: no keyword, uses classification + location
- Vibe mode: AI interprets natural language, maps to categories + keywords, then searches
- Always run AI enrichment (not just on zero results)
- Search events by `tags` array in addition to title/description
- Increase Ticketmaster result size to 50

## Files Changed
- `supabase/functions/search-everything/index.ts` — multi-mode search, broader TM queries, always-on AI
- `src/pages/EnhancedOKCLegend.tsx` — category grid, auto-load, vibe match, date builder, hidden gems, live pulse
- No new tables needed — uses existing events, venues, discovered_places

