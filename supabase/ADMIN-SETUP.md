# Admin events CMS — setup

Secure admin area at **`/admin/login`** for managing events (text + images). Public site reads published events from Supabase.

## Security model

- **No public sign-up** — create admin users manually in Supabase Dashboard only.
- **Email allowlist** — only addresses in `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS` may sign in.
- **Strong passwords** — set Supabase Auth minimum password length to **12** and require complexity (Dashboard → Authentication → Providers → Email).
- **MFA (TOTP)** — required via authenticator app (Google Authenticator, Authy, etc.). Enrolment on first login; verification on every new browser session.
- **No trusted device** — auth tokens stored in **sessionStorage** (cleared when the browser tab/window closes).
- **Idle timeout** — auto sign-out after **30 minutes** of inactivity.
- **API protection** — all write/upload routes require a valid JWT with **`aal2`** (MFA verified).

## 1. Supabase project

1. Run `supabase/schema.sql` (booking table) if not already done.
2. Run **`supabase/events-schema.sql`** (events table + image bucket).
3. Optionally run **`supabase/events-seed.sql`** for sample rows.

## 2. Enable MFA

1. Supabase Dashboard → **Authentication** → **Providers** (or **MFA** settings).
2. Enable **TOTP** multi-factor authentication.

## 3. Create admin user

1. **Authentication** → **Users** → **Add user**.
2. Use a strong password (12+ chars, mixed case, number, symbol).
3. Use an email listed in `ADMIN_EMAILS`.
4. **Disable public sign-ups**: Authentication → Providers → Email → turn off “Enable sign ups”.

## 4. Environment variables (Vercel + local)

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=info@ajeventspromotions.com
NEXT_PUBLIC_ADMIN_EMAILS=info@ajeventspromotions.com
```

## 5. Install dependencies

```bash
npm install
```

(Ensures `@supabase/ssr` is installed.)

## 6. First login

1. Open **`/admin/login`**
2. Sign in with the admin email and password
3. Scan the MFA QR code with your authenticator app
4. Enter the 6-digit code
5. Manage events at **`/admin/events`**

## Managing content

- **Previous events** — full recap pages at `/events/[slug]`; add a slug or leave blank to auto-generate.
- **Upcoming events** — expandable cards on `/events`; no separate page.
- **Images** — JPEG/PNG/WebP, max 5 MB; stored in Supabase Storage (`event-images` bucket).
- **Published** — only checked events appear on the public site (updates within ~60 seconds due to cache revalidation).

## Optional hardening (Supabase Dashboard)

- Set JWT expiry to **3600** seconds (1 hour) or lower under Auth settings.
- Enable leaked password protection if available on your plan.
