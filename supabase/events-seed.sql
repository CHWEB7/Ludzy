# Optional: import template events into Supabase after running events-schema.sql
# Adjust or delete rows before running in production.

insert into public.events (
  event_type, slug, title, date_display, venue, excerpt, body, published, sort_order
) values
(
  'previous',
  'lakeside-sunset-session',
  'Lakeside sunset session',
  '12 April 2026',
  'Willow Lake Club',
  'A slow-opening organic house set as the sun dropped — template recap you can replace with photos and track highlights.',
  '["Guests arrived to downtempo edits and soulful vocal cuts, building gently toward deeper rollers as the light faded.","Replace this paragraph with your own recap, crowd notes, or a link to a Mixcloud recording."]'::jsonb,
  true,
  0
),
(
  'previous',
  'corporate-summer-launch',
  'Corporate summer launch',
  '3 March 2026',
  'Riverside Pavilion',
  'Polished warm-up through to confident dancefloor energy for a brand launch — placeholder blog card.',
  '["The brief called for approachable daytime soul, transitioning into upbeat house as teams mixed after presentations."]'::jsonb,
  true,
  0
)
on conflict (slug) do nothing;

insert into public.events (
  event_type, title, date_display, time_display, location, set_type, summary, details, published, sort_order
) values
(
  'upcoming',
  'Garden party — Bank Holiday',
  'Saturday 24 May 2026',
  '14:00 – 20:00',
  'Hartley Hall gardens, Kent',
  'Organic house & soulful edits',
  'Day-to-dusk terrace energy with restrained peaks and open-air acoustics.',
  'Template slot — replace with confirmed details when ready.',
  true,
  0
)
on conflict do nothing;
