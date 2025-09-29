# Contributor Notes
- Load and reuse the helpers exported from `client/modules/siteBuilder/core.js` when touching the admin page builder.
- Keep visual-constructor logic modular: shared registries and utilities live under `client/modules/siteBuilder/`.
- Prefer extracting reusable styling helpers instead of hardcoding colors and spacings inside templates.
- Shared preview/style helpers now live in `client/modules/siteBuilder/styles.js`—import from `window.SiteBuilder.styles` rather than redefining them.
