# Project rules

- Use semantic HSL tokens in global CSS for all themes; never inject theme colors from JavaScript, because legacy RGB theme values break HSL utilities.
- Determine seasonal styling with the shared local-calendar helper and recheck on focus and each minute, so Halloween turns off automatically even in an open app.
- Keep optional intake details in the local profile context, never in partner Sync or quiz scoring; demographic answers must not change scoring or leave the device.
- Guest partner Sync uses random device capabilities hashed by a public edge endpoint and checked in service-only atomic database operations; never grant anonymous direct access or create anonymous auth accounts.
- Preserve the existing account-based partner path for already-linked signed-in users rather than replacing or exposing their data.