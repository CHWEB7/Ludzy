-- Optional seed — run after faqs-schema.sql to import the original static FAQs.
-- Safe to run once; skips if any rows already exist.

insert into public.faqs (question, answer, sort_order, published)
select * from (
  values
    (
      'What music do you play?',
      'Ludzy specialises in house, soulful edits, nu disco, rare groove, UK garage, and organic house. Every set is tailored to the event — from relaxed background warmth during a drinks reception to peak-time dancefloor energy later in the evening. If you have specific genres or must-play tracks in mind, just include them in your enquiry and we''ll build them into the set.',
      100,
      true
    ),
    (
      'What areas do you cover?',
      'Ludzy is based in Suffolk and regularly covers Ipswich, Woodbridge, Framlingham, Southwold, Diss, Eye, and the wider East Anglia region. We''re also happy to travel further afield across the UK for the right event — just get in touch with the details and we''ll confirm availability.',
      90,
      true
    ),
    (
      'Do you have your own sound equipment?',
      'Yes. Ludzy carries a professional-grade portable PA system suitable for intimate gatherings through to larger private parties. For bigger venues or festivals where a larger rig is needed, we work with trusted local production partners to provide a complete sound and lighting package. Equipment details can be discussed during the booking process.',
      80,
      true
    ),
    (
      'What types of events do you DJ at?',
      'Weddings, private parties, corporate events, venue residencies, garden parties, terrace sessions, festivals, and more. Whether it''s a sophisticated dinner party for 30 guests or a 300-person wedding reception, Ludzy adapts the music and energy to match the occasion perfectly.',
      70,
      true
    ),
    (
      'How far in advance should I book?',
      'As early as possible — especially for weekend dates during the summer season. Popular Saturdays can book up months in advance. That said, we always try to accommodate last-minute enquiries, so it''s always worth getting in touch even if your event is coming up soon.',
      60,
      true
    ),
    (
      'How much does it cost to hire Ludzy?',
      'Every event is different, so pricing depends on the type of event, duration, location, and any additional requirements such as extra sound equipment or lighting. Get in touch with your event details and we''ll send a transparent quote with no hidden fees.',
      50,
      true
    ),
    (
      'Can I request specific songs?',
      'Absolutely. We encourage it. Before the event we''ll discuss your must-play list, any do-not-play requests, and the general vibe you''re going for. On the night, Ludzy reads the room and blends your requests naturally into the flow of the set.',
      40,
      true
    ),
    (
      'Do you provide lighting as well?',
      'Yes — a basic lighting setup is included as standard for most bookings. For larger events or specific production requirements (uplighting, moving heads, haze), we can arrange a bespoke lighting package through our production partners. Just let us know what you have in mind.',
      30,
      true
    ),
    (
      'What happens if you''re unavailable for my date?',
      'If Ludzy is already booked for your date, we''ll let you know straight away and, where possible, recommend a trusted DJ from our network who can deliver a similar style and standard.',
      20,
      true
    ),
    (
      'How do I book?',
      'Simply head to our contact page and fill in the enquiry form with your event details — venue, date, timings, guest count, and the vibe you''re after. We''ll get back to you within 24 hours with availability and a quote. You can also call us directly on 07592 262525 or email info@ajeventspromotions.com.',
      10,
      true
    )
) as seed(question, answer, sort_order, published)
where not exists (select 1 from public.faqs limit 1);
