/** @see https://www.instagram.com/dj_ludzy */
export const INSTAGRAM_PROFILE = {
  handle: "dj_ludzy",
  url: "https://www.instagram.com/dj_ludzy/",
} as const;

/**
 * No Instagram login required — add images you export from posts (or your own photos).
 * Put files in `public/images/instagram/` then list them here.
 */
export type ManualInstagramPost = {
  id: string;
  /** Path under public/, e.g. `/images/instagram/set-01.jpg` */
  image: string;
  /** Optional link when someone clicks the tile (e.g. the post on Instagram) */
  href?: string;
  alt?: string;
};

export const manualInstagramPosts: ManualInstagramPost[] = [
  // Example (uncomment after adding files):
  // {
  //   id: "1",
  //   image: "/images/instagram/set-01.jpg",
  //   href: "https://www.instagram.com/p/SHORTCODE/",
  //   alt: "DJ set at garden party",
  // },
];

/**
 * No login — paste public post URLs from instagram.com (open post → ⋮ → Copy link).
 * Instagram’s embed script loads each post; your site never authenticates.
 */
export const instagramPostPermalinks: string[] = [
  // "https://www.instagram.com/p/SHORTCODE/",
];
