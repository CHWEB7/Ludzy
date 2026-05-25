export type LocalArea = {
  slug: string;
  county: string;
  region: string;
  towns: string[];
  heroHeading: string;
  heroSub: string;
  intro: string[];
  /** Comma-separated string for meta keywords / alt text */
  areaKeywords: string;
  /** FAQ pairs — strong SEO signal for featured snippets & AI answers */
  faqs: { q: string; a: string }[];
};

export const localAreas: LocalArea[] = [
  {
    slug: "suffolk",
    county: "Suffolk",
    region: "East Anglia",
    towns: [
      "Ipswich",
      "Woodbridge",
      "Framlingham",
      "Southwold",
      "Diss",
      "Eye",
    ],
    heroHeading: "DJ hire in Suffolk",
    heroSub: "House & dance music for weddings, parties, and events across Suffolk",
    intro: [
      "Looking for a DJ in Suffolk? Ludzy brings sophisticated house, soulful edits, and organic grooves to venues across the county — from heritage barns in Framlingham to waterfront celebrations in Southwold.",
      "Whether it's a wedding reception in Woodbridge, a corporate summer party in Ipswich, a milestone birthday in Diss, or a garden party near Eye — every set is built around your brief, your crowd, and your venue's acoustics.",
      "Ludzy covers Ipswich, Woodbridge, Framlingham, Southwold, Diss, Eye, and surrounding villages throughout Suffolk. Weekend and midweek availability.",
    ],
    areaKeywords:
      "DJ Suffolk, DJ hire Ipswich, wedding DJ Woodbridge, party DJ Framlingham, DJ Southwold, DJ Diss, DJ Eye, house music DJ Suffolk, event DJ East Anglia",
    faqs: [
      {
        q: "How much does a DJ cost in Suffolk?",
        a: "Rates vary by event length, venue, and requirements. Ludzy offers transparent pricing with no hidden fees — get in touch for a personalised quote based on your date and brief.",
      },
      {
        q: "What areas of Suffolk does Ludzy cover?",
        a: "Ludzy is available for hire across all of Suffolk including Ipswich, Woodbridge, Framlingham, Southwold, Diss, Eye, and surrounding villages throughout East Anglia.",
      },
      {
        q: "What type of music does Ludzy play?",
        a: "Ludzy specialises in house, soulful edits, organic grooves, UK garage, nu disco, and rare groove — always tailored to the crowd and occasion. Sets range from laid-back daytime sessions to high-energy late-night dancefloors.",
      },
      {
        q: "Can Ludzy DJ at a wedding in Suffolk?",
        a: "Absolutely. Ludzy has experience DJing weddings across Suffolk — from ceremony instrumentals and drinks receptions through to the evening party. Every wedding set is bespoke to the couple's brief.",
      },
      {
        q: "Does Ludzy bring their own equipment?",
        a: "Yes. Ludzy arrives with a professional sound and lighting setup suitable for your venue size. Specific technical requirements can be discussed during the booking process.",
      },
      {
        q: "How far in advance should I book a DJ in Suffolk?",
        a: "Popular dates — especially summer Saturdays — book months ahead. Get in touch as early as possible to secure your preferred date.",
      },
    ],
  },
];

export function getLocalArea(slug: string): LocalArea | undefined {
  return localAreas.find((a) => a.slug === slug);
}
