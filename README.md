# LUDZY — event DJ microsite

Monochrome promotional site inspired by the LUDZY flyer: floating navigation with a logo that fades on scroll, interactive service cards with detail modals, and a booking form wired to Supabase.

## Contact form email (Resend)

Enquiries are saved to Supabase `booking_inquiries` and a notification email is sent via [Resend](https://resend.com).

1. Create a Resend account and generate an API key.
2. Add to `.env.local` (local) and Vercel → **Settings → Environment Variables**:
   - `RESEND_API_KEY` — required for email delivery
   - `BOOKING_NOTIFY_EMAIL` — inbox that receives enquiries (default: `info@ajeventspromotions.com`)
   - `BOOKING_FROM_EMAIL` — sender shown on the notification (optional)
3. **Development:** omit `BOOKING_FROM_EMAIL` to use Resend’s test sender `onboarding@resend.dev` (emails only deliver to your Resend account email until you verify a domain).
4. **Production:** verify `ludzy.online` in Resend → **Domains**, then set e.g. `BOOKING_FROM_EMAIL=DJ Ludzy <bookings@ludzy.online>`.

If the database save succeeds but email fails (missing key or Resend error), the visitor still sees success; the error is logged server-side. Check the API response field `emailSent` when debugging.

## Mixcloud auto-sync

The homepage **Listen** section pulls the latest uploads from [Mixcloud](https://www.mixcloud.com/DJ-Ludzy/) via the public API. No API key is required.

- Fetches run server-side with 1-hour cache (`revalidate: 3600`)
- Vercel Cron hits `/api/cron/mixcloud` every 6 hours to refresh the homepage
- Optional env: `MIXCLOUD_USERNAME` (default `DJ-Ludzy`), `MIXCLOUD_SHOW_LIMIT` (default `6`, max `12`)
- Set `CRON_SECRET` on Vercel so only scheduled cron jobs can trigger a manual refresh
- If Mixcloud is unreachable, the site falls back to a small static list of mixes
