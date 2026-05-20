# Brand assets

## Header logo (required)

Save **your** LUDZY wordmark PNG here as:

**`ludzy-logo.png`**

The header only uses this file — no SVG fallback.

Example (PowerShell), if your file is in Downloads:

```powershell
copy "C:\Users\Charly Admin\Downloads\ludzy-logo.png" "C:\Users\Charly Admin\ludzy-dj\public\images\ludzy-logo.png"
```

Use a **wide** export (black background is fine — it matches the header). Then commit and push:

```powershell
git add public/images/ludzy-logo.png
git commit -m "Add official LUDZY logo PNG"
git push origin main
```

The **Evening social** hero tile uses video — see `public/videos/README.md`.
