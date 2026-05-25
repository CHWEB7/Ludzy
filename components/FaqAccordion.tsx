"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

function FaqRow({ item, open, toggle }: { item: FaqItem; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition md:py-8"
        aria-expanded={open}
      >
        <span className="text-sm font-bold uppercase tracking-[0.12em] text-white/90 transition group-hover:text-white md:text-base">
          {item.question}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center border transition-all duration-300 ${
            open
              ? "rotate-45 border-white/40 text-white"
              : "border-white/15 text-white/40"
          }`}
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="8" y1="3" x2="8" y2="13" />
            <line x1="3" y1="8" x2="13" y2="8" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-sm leading-relaxed text-white/55 md:pb-8 md:text-base md:leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <FaqRow
          key={i}
          item={item}
          open={openIndex === i}
          toggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
