# LUDZY — event DJ microsite

Monochrome promotional site inspired by the LUDZY flyer: floating navigation with a logo that fades on scroll, interactive service cards with detail modals, and a booking form wired to Supabase.

## Contact form (Formspree)

The contact form uses [Formspree](https://formspree.io) via `@formspree/react`. Submissions are emailed to the address configured in your Formspree dashboard.

- Default form ID: `xpqelvge` (`https://formspree.io/f/xpqelvge`)
- Optional override: `NEXT_PUBLIC_FORMSPREE_FORM_ID` in `.env.local` and Vercel

In Formspree → **Settings**, set notification email to `info@ajeventspromotions.com` and enable reply-to from the submitter’s `email` field.

## Mixcloud auto-sync

The homepage **Listen** section pulls the latest uploads from [Mixcloud](https://www.mixcloud.com/DJ-Ludzy/) via the public API. No API key is required.

- Homepage fetches Mixcloud live on each request (always up to date after deploy)
- Vercel Cron hits `/api/cron/mixcloud` once daily (`0 8 * * *` — Hobby plan limit)
- Optional env: `MIXCLOUD_USERNAME` (default `DJ-Ludzy`), `MIXCLOUD_SHOW_LIMIT` (default `6`, max `12`)
- Optional `CRON_SECRET` to protect manual cron triggers
- If Mixcloud is unreachable, the site falls back to a small static list of mixes
