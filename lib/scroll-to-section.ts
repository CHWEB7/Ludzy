/** Sticky header + top padding — keeps section titles visible after hash nav (Safari/macOS). */
export const HEADER_SCROLL_OFFSET = 132;

const SECTION_ALIASES: Record<string, string> = {
  mission: "philosophy",
  book: "enquire",
};

export function resolveSectionId(hash: string) {
  const id = hash.replace(/^#/, "").trim();
  return SECTION_ALIASES[id] ?? id;
}

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const targetId = resolveSectionId(id);
  const el = document.getElementById(targetId);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}
