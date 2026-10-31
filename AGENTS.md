# Project rules

- Use semantic HSL tokens in global CSS for all themes; never inject theme colors from JavaScript, because legacy RGB theme values break HSL utilities.
- Use one typed manual theme registry for assets, typography, icons and appearance; save device-local selection and never override it with a calendar, so partners can keep different looks year-round.
- Keep optional intake details in the local profile context, never in partner Sync or quiz scoring; demographic answers must not change scoring or leave the device.
- Guest partner Sync uses random device capabilities hashed by a public edge endpoint and checked in service-only atomic database operations; never grant anonymous direct access or create anonymous auth accounts.
- Preserve the existing account-based partner path for already-linked signed-in users rather than replacing or exposing their data.