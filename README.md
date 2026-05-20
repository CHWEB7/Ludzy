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
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. `https://your-app.vercel.app`) for metadata |

Never commit `.env.local` or the **service_role** key to Git.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).  
2. In the SQL Editor, paste and run `supabase/schema.sql`.  
3. Optionally add an email/webhook automation from Supabase (e.g. [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)) when new rows arrive in `booking_inquiries`.

The API route `POST /api/booking` inserts using the anon key with an RLS policy that allows **insert only** — rows are not publicly readable.

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
