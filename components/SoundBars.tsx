"use client";

const heights = ["h-6", "h-10", "h-4", "h-12", "h-7", "h-9", "h-5"];

export function SoundBars() {
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1 origin-bottom rounded-full bg-gradient-to-t from-white/30 to-white ${h} animate-sound-bar`}
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}
