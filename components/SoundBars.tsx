"use client";

const heights = ["h-7", "h-11", "h-5", "h-14", "h-8", "h-10", "h-6"];

export function SoundBars() {
  return (
    <div className="flex h-14 shrink-0 items-end gap-[3px] pb-px" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`sound-bar-spectrum ${h}`}
          style={{ animationDelay: `0s, ${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}
