# LUDZY — event DJ microsite

Monochrome promotional site inspired by the LUDZY flyer: floating navigation with a logo that fades on scroll, interactive service cards with detail modals, and a booking form wired to Supabase.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Supabase](https://supabase.com/) for enquiry storage  

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → **anon public** key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → **service_role** secret (server-only; **recommended** for booking) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. `https://your-app.vercel.app`) for metadata |

Never commit `.env.local` or the **service_role** key to Git.

## Supabase setup (booking form)

1. Create a project at [supabase.com](https://supabase.com).  
2. In the **SQL Editor**, paste and run **`supabase/schema.sql`** (creates `booking_inquiries` + insert permissions).  
3. In **Vercel → Project → Settings → Environment Variables**, add the three Supabase vars above for **Production** (and Preview if you test there). **Redeploy** after saving env vars.  
4. Submit a test enquiry on the live site, then check **Supabase → Table Editor → booking_inquiries**.

The API route `POST /api/booking` prefers **`SUPABASE_SERVICE_ROLE_KEY`** (reliable inserts). Without it, it uses the anon key and requires the RLS policy from `schema.sql`.

### Booking form still failing?

| Symptom | Fix |
| --- | --- |
| “Booking is not configured yet” | Add `NEXT_PUBLIC_SUPABASE_URL` and keys in Vercel, redeploy |
| “Table … is missing” | Run `supabase/schema.sql` in Supabase SQL Editor |
| “Permission denied” | Re-run `schema.sql`, or add `SUPABASE_SERVICE_ROLE_KEY` in Vercel |
| Works locally, not on Vercel | Env vars only on Production — add to Preview too, redeploy |

Optionally add [Database Webhooks](https://supabase.com/docs/guides/database/webhooks) or email when new rows arrive.

## Deploy on Vercel

1. Push this folder to your GitHub repository.  
2. In Vercel: **Import** the repo → Framework Preset **Next.js**.  
3. Under **Integrations**, connect **Supabase** when prompted (or paste the same env vars manually).  
4. Add production env vars: `NEXT_PUBLIC_SUPABASE_*` and `NEXT_PUBLIC_SITE_URL`.  
5. Deploy.

[Vercel + Supabase docs](https://vercel.com/docs/storage/vercel-postgres/using-an-orm#supabase) (patterns differ slightly; env-based URL/key is enough for `@supabase/supabase-js`).

## Replacing placeholders

- **Photos:** Drop your flyer assets under `public/images/` and swap the gradient “photo” panels in `app/page.tsx` for `<Image />` components.  
- **Copy / contact:** Update phone and email in `app/page.tsx` if they change.

## Licence

Provided for AJ Events Promotions / LUDZY branding use.
