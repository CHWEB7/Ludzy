"use client";

import Link from "next/link";
import { BLOG_TAGS } from "@/lib/blog-tags";

type BlogTagFilterProps = {
  activeTag?: string | null;
};

export function BlogTagFilter({ activeTag }: BlogTagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition ${
          !activeTag
            ? "border-white/40 bg-white/[0.06] text-white"
            : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/70"
        }`}
      >
        All
      </Link>
      {BLOG_TAGS.map((tag) => (
        <Link
          key={tag.id}
          href={`/blog?tag=${tag.id}`}
          className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition ${
            activeTag === tag.id
              ? "border-white/40 bg-white/[0.06] text-white"
              : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/70"
          }`}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}
