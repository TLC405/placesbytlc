

# InPerson OKC — Premium Rebrand & Enhancement Plan

## Overview
Rename the app to **InPerson OKC**, add professional branding with "Powered by TLC" throughout, rename quizzes to "Psychology Quizzes", enhance all icons and micro-interactions to a 100x premium level, and remove the background from the Cupid image using canvas-based processing at build time.

---

## 1. Global Rebrand — "InPerson OKC"

**Files:** `index.html`, `src/components/AppLogo.tsx`, `src/pages/HackerHome.tsx`, `src/pages/Home.tsx`, `src/pages/EnhancedOKCLegend.tsx`, `src/pages/AIRecommender.tsx`, `src/pages/Quizzes.tsx`, `src/pages/Auth.tsx`, `src/pages/PeriodTracker.tsx`, `src/components/BottomTabBar.tsx`, `public/manifest.json`

- Change all instances of "Places by TLC", "PLACES", "INPERSON.TLC" to **"InPerson OKC"**
- Add "Powered by TLC" badge/footer on every page — a subtle, elegant branded chip
- Update `index.html` title, meta tags, and Open Graph to "InPerson OKC"
- Update `manifest.json` name and short_name
- Redesign `AppLogo.tsx` with new name and "Powered by TLC" tagline

## 2. Quizzes → "Psychology Quizzes"

**Files:** `src/pages/Quizzes.tsx`, `src/pages/HackerHome.tsx`, `src/pages/Home.tsx`, `src/components/BottomTabBar.tsx`

- Rename "Quizzes" tab to "Psych" in bottom tab bar
- Update Quizzes page header: "Psychology Quizzes" with subtitle about relationship psychology
- Update descriptions to emphasize psychological depth (e.g., "Based on Dr. Chapman's research" for Love Language, "Myers-Briggs psychological profiling" for MBTI)
- Add a `GraduationCap` or `FlaskConical` icon for the psychology theme

## 3. Premium Icon System & Micro-interactions

**Files:** `src/index.css`, all page files

- Add premium animated icon containers with glassmorphism backgrounds, subtle glow effects, and hover micro-animations
- Add shimmer effects on feature cards using CSS `@keyframes shimmer`
- Add staggered entrance animations with spring-based easing
- Add a "Powered by TLC" watermark component that appears on every page as a refined footer badge
- Add premium dividers, section transitions, and scroll-reveal animations
- Enhance feature cards with hover lift, border glow, and icon pulse effects
- Add particle/sparkle effects on key interactions using CSS-only techniques

## 4. Cupid Background Removal

**File:** `src/components/DetailedCupid.tsx`

- Use an HTML Canvas approach at runtime to remove the white/solid background from `cupid-icon-original.png`
- Load the image into a canvas, scan pixels, and make background-colored pixels transparent
- This avoids needing any external API or premium service — pure client-side processing
- Apply a threshold-based alpha removal (detect near-white pixels and set alpha to 0)
- Cache the processed transparent image as a data URL in state so it only processes once
- The result: Cupid floats with no background box, just the character itself

## 5. Enhanced CSS Design Tokens

**File:** `src/index.css`

- Add `@keyframes shimmer` for card shine effects
- Add `@keyframes glow-pulse` for icon containers
- Add `.card-premium` class with enhanced shadow, border glow, and hover transforms
- Add `.icon-premium` with glassmorphism circle, inner glow, and scale animation on hover
- Add `.powered-by-tlc` badge component styles
- Add `.section-divider-premium` with gradient line and diamond accent
- Add `.text-brand` for the InPerson OKC brand color treatment

## Technical Approach
- All changes are CSS + React — no new dependencies needed
- Cupid background removal uses native Canvas API (no Hugging Face model needed for this simpler task)
- Premium effects use CSS animations and transforms for 60fps performance
- "Powered by TLC" becomes a shared component used across all pages

