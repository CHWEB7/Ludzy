/** Extra gap between header bottom and section title */
const SCROLL_GAP = 20;

const SECTION_ALIASES: Record<string, string> = {
  mission: "philosophy",
  book: "enquire",
};

export function resolveSectionId(hash: string) {
  const id = hash.replace(/^#/, "").trim();
  return SECTION_ALIASES[id] ?? id;
}

/** Measure sticky header height (menu open/closed changes this). */
export function getHeaderScrollOffset() {
  if (typeof document === "undefined") return 112;
  const header = document.querySelector<HTMLElement>('header[role="banner"]');
  if (!header) return 112;
  return Math.ceil(header.getBoundingClientRect().bottom) + SCROLL_GAP;
}

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const targetId = resolveSectionId(id);
  const el = document.getElementById(targetId);
  if (!el) return false;

  const offset = getHeaderScrollOffset();
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}
