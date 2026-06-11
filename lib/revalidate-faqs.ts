import { revalidatePath } from "next/cache";

/** Bust ISR cache for the public FAQ page after admin changes. */
export function revalidatePublicFaqPages() {
  revalidatePath("/faq");
}
