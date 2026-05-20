# Brand assets

## Header logo (required) — **not** stored in Supabase

The logo is a **normal website file**, like a photo on any site:

| Location on disk | URL in the browser |
|------------------|-------------------|
| `public/images/ludzy-logo.png` | `/images/ludzy-logo.png` |

**Supabase** is only for **booking form** enquiries (`booking_inquiries` table). The logo does **not** go in Supabase.

Save **your** LUDZY wordmark PNG here as **`ludzy-logo.png`**.

**Tip:** Export with a **transparent** background if you can — looks cleaner on the glass header. A solid black PNG still works (we use blend mode on the header).

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
