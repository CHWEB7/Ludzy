import { revalidatePath } from "next/cache";

/** Bust ISR cache for public events pages after admin changes. */
export function revalidatePublicEventsPages(slug?: string | null) {
  revalidatePath("/events");
  if (slug) {
    revalidatePath(`/events/${slug}`);
  }
}
