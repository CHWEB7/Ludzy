import { revalidatePath } from "next/cache";

/** Bust ISR cache for public blog pages after admin changes. */
export function revalidatePublicBlogPages(slug?: string | null) {
  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}
