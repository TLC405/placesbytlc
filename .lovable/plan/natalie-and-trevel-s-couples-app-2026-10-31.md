# Natalie and Trevel’s Couples App

## Same app, a complete new identity
Continue the upgrade underway and rename the app **Natalie and Trevel’s Couples App**. Design it for both of you without adding unrelated features. Keep Home, Mind, Dates, Cycle and Sync, the existing quizzes, Cupid and places search.

**Your choices:** no sign-in for normal use or partner Sync; connect with a code. Themes are always manual. Spooky stays until you switch it, even after Halloween. These choices replace the earlier seasonal-only behavior.

## 1. Couples branding everywhere
- Use a carefully typeset “Natalie & Trevel” wordmark with “Couples App” beneath it. Use the full requested name in the browser title and installed-app name.
- Update the first-visit page and active screens; replace men-only introductions with thoughtful, natural language for both partners.
- Keep “Powered by TLC” discreetly. Preserve existing quiz names and scoring rather than silently rewriting assessments.
- Keep all saved profiles, quizzes, cycle information and partner data. Do not rename hidden storage keys merely for branding.

## 2. Four complete visual worlds
Keep Spooky and replace the other legacy looks entirely. I’ll choose **Love Letters** as the default for new visitors; preserve Spooky for your current experience.

| Theme | Visual direction |
| --- | --- |
| **Spooky** | Charcoal, coral pumpkins and blush ghosts; sculptural Halloween artwork; pumpkin, bat and moon navigation; gentle drifting details. |
| **Love Letters** | White, ink black and raspberry pink; expressive serif headings; original paper-and-ribbon artwork; heart details; outlined controls and soft page reveals. |
| **Midnight Cinema** | Near-black, pearl white, icy blue and red accents; film-inspired imagery; refined sans-serif lettering; precise dividers and cinematic transitions. |
| **Garden Studio** | White, deep green and soft pink; original botanical artwork; literary headings; airy spacing; leaf-inspired icons and quiet motion. |

Each changes **artwork, lettering, icons, surfaces, borders, shadows, buttons, bottom navigation and animation**, not just colors. No gradients. Keep page destinations and familiar control order stable.

## 3. A working appearance chooser
- Place a clearly labeled appearance control in the existing home/profile area—not another tab.
- Show four visual previews with a clear selected state. Apply immediately and remember the choice on that device after refresh.
- Spooky is available year-round; remove automatic calendar overrides.
- Each partner controls their own look without changing the other partner’s screen or shared information.
- Migrate old theme preferences safely to the replacement designs; fall back predictably for invalid saved values.

## 4. Finish the ongoing upgrade
- Finish and verify the optional first-visit questions and profile editing; details stay on-device and do not affect quiz scores.
- Complete private **code-only partner Sync without accounts**: invites, joining, moods, date plans, notes and unlinking. No extra sharing categories.
- Keep Cycle separate from Sync, correct the remaining “Sync” cycle heading, and carry the chosen theme into forecasts and settings.
- Apply each theme end to end: home, quizzes and results, Dates, search, Cupid, Cycle, Sync, forms, loading states and errors.
- Preserve public app access and existing admin protection. No couple-only entry gate or new login requirement.

## Technical details
- The inspected theme context saves legacy selections but does not apply their colors. Replace it with one typed theme registry and semantic HSL tokens; do not duplicate the app into four implementations.
- Theme assets, font pairs, icons and motion settings come from the shared registry. Load only needed artwork/fonts, avoid a flash of the wrong theme, and respect reduced-motion settings.
- Guest linking uses random device credentials checked by Lovable Cloud functions and stored as hashes server-side. Keep guest tables inaccessible directly from browsers. Validate invite expiry, single-use joins, two-partner capacity, authorship and unlinking through atomic operations; use authorized polling rather than public data channels.
- Preserve existing account-linked data and its protections; never expose old private tables just to remove sign-in.
- Use current supported Lovable tooling, asset generation, Cloud deployment and browser verification where relevant. Do not add unrelated integrations, change AI models or migrate the entire framework just to claim “latest.” Framework migration is separate work, not required for detailed themes.
- Fix the reported missing `bun:test` type support. Investigate the reported missing service-worker response and resolve registration for the existing preview/installed-app setup.
- On approval, update the task list and saved preferences first: corrected **Trevel** spelling, couples identity, manual-only themes and code-only Sync. Update architecture rules to match.

## Verification
- Check all four themes on small and large screens, including long names, buttons, artwork, navigation and readable contrast.
- Switch from Home, confirm every existing screen matches, refresh, and confirm the choice persists.
- Test that Spooky remains selected outside October and no timer overrides it.
- Verify first-visit skip/save/edit and unchanged quiz scores.
- In two separate browsers without accounts, link by code and confirm a mood, date plan and note appear on the other device. Test expired/invalid/reused codes, a third-device join and access after unlinking.
- Run relevant tests and check current app diagnostics before reporting completion.

## Scope and teaching
No new games, subscriptions, social feeds, notifications or unrelated sections. Brief milestone updates explain the changes simply: themes are different outfits for the same familiar app. Nothing is published automatically.

