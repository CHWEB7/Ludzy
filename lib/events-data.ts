export type PreviousEvent = {
  slug: string;
  title: string;
  date: string;
  venue: string;
  excerpt: string;
  body: string[];
  imageUrl?: string;
  galleryImages?: string[];
};

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  mapsUrl?: string;
  imageUrl?: string;
  setType: string;
  summary: string;
  details: string;
};

/** Template posts — edit copy or add entries later */
export const previousEvents: PreviousEvent[] = [
  {
    slug: "lakeside-sunset-session",
    title: "Lakeside sunset session",
    date: "12 April 2026",
    venue: "Willow Lake Club",
    excerpt:
      "A slow-opening organic house set as the sun dropped — template recap you can replace with photos and track highlights.",
    body: [
      "Guests arrived to downtempo edits and soulful vocal cuts, building gently toward deeper rollers as the light faded.",
      "Replace this paragraph with your own recap, crowd notes, or a link to a Mixcloud recording.",
      "Template only — swap dates, venue, and imagery when you publish the real write-up.",
    ],
  },
  {
    slug: "corporate-summer-launch",
    title: "Corporate summer launch",
    date: "3 March 2026",
    venue: "Riverside Pavilion",
    excerpt:
      "Polished warm-up through to confident dancefloor energy for a brand launch — placeholder blog card.",
    body: [
      "The brief called for approachable daytime soul, transitioning into upbeat house as teams mixed after presentations.",
      "Template content: add client name, room layout, and any special requests you fulfilled on the night.",
      "Ideal spot for embedding event photography once assets are ready.",
    ],
  },
  {
    slug: "terrace-opening-weekend",
    title: "Terrace opening weekend",
    date: "18 January 2026",
    venue: "The Copper Terrace",
    excerpt:
      "Open-air grooves across a two-part terrace slot — editable template for your events blog.",
    body: [
      "Afternoon rare groove and nu-disco, evening shift into classic house for the terrace crowd.",
      "Use this space for weather notes, guest DJ mentions, or cocktail/bar collaborations.",
      "Remember to update the slug in this file if you change the URL path.",
    ],
  },
  {
    slug: "winter-wedding-celebration",
    title: "Winter wedding celebration",
    date: "9 November 2025",
    venue: "Ashford Manor",
    excerpt:
      "Ceremony warmth through to dancefloor peaks — template wedding recap for the blog carousel.",
    body: [
      "Template timeline: ceremony instrumental edits, drinks reception soul, first dance, then party house.",
      "Replace with your real set highlights, must-plays, and moments that landed with the couple.",
      "Optional: link to a private recording or photo gallery.",
    ],
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "up-1",
    title: "Garden party — Bank Holiday",
    date: "Saturday 24 May 2026",
    time: "14:00 – 20:00",
    location: "Hartley Hall gardens, Kent",
    setType: "Organic house & soulful edits",
    summary: "Day-to-dusk terrace energy with restrained peaks and open-air acoustics.",
    details:
      "Template slot: afternoon welcome grooves, sunset build, early evening dancefloor. Replace with client contact, access notes, and technical rider when confirmed. No separate page — expand card only.",
  },
  {
    id: "up-2",
    title: "Thursday night residency",
    date: "Thursday 5 June 2026",
    time: "21:00 – 01:00",
    location: "The Velvet Room, London",
    setType: "UK garage & house blend",
    summary: "Weekly residency placeholder — soulful garage rollers into classic house.",
    details:
      "Template details for dress code, door times, and guest list policy. Update set type if the brief changes to pure house or rare groove.",
  },
  {
    id: "up-3",
    title: "Corporate summer party",
    date: "Friday 20 June 2026",
    time: "18:30 – 23:30",
    location: "Skyline Atrium, Manchester",
    setType: "Sophisticated house & disco",
    summary: "Upscale corporate template — polished pacing for networking then celebration.",
    details:
      "Expand with AV specs, breakout areas, and whether speech mic support is required. Content is editable in lib/events-data.ts.",
  },
  {
    id: "up-4",
    title: "Festival warm-up stage",
    date: "Sunday 6 July 2026",
    time: "16:00 – 18:00",
    location: "North Coast Festival, Dorset",
    setType: "Dancefloor house & edits",
    summary: "Template festival slot — breezy open-air build into peak-time energy.",
    details:
      "Add billing order, backstage access, and green room timings when confirmed. This card expands inline; no blog page needed.",
  },
];

export function getPreviousEvent(slug: string): PreviousEvent | undefined {
  return previousEvents.find((e) => e.slug === slug);
}
