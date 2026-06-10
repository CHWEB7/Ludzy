export type BlogTag = {
  id: string;
  label: string;
};

export const BLOG_TAGS: BlogTag[] = [
  { id: "house", label: "House" },
  { id: "soulful-edits", label: "Soulful edits" },
  { id: "uk-garage", label: "UK garage" },
  { id: "nu-disco", label: "Nu disco" },
  { id: "rare-groove", label: "Rare groove" },
  { id: "organic-house", label: "Organic house" },
  { id: "melodic-house", label: "Melodic house" },
  { id: "techno", label: "Techno" },
  { id: "dance-pop", label: "Dance-pop" },
];

const tagById = new Map(BLOG_TAGS.map((tag) => [tag.id, tag]));

export function isValidBlogTagId(id: string): boolean {
  return tagById.has(id);
}

export function getBlogTagLabel(id: string): string {
  return tagById.get(id)?.label ?? id;
}

export function formatBlogTags(tags: string[]): string {
  return tags.map(getBlogTagLabel).join(" · ");
}

export function normalizeBlogTagIds(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .map(String)
    .filter((id) => isValidBlogTagId(id));
}
