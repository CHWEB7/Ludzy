import Image from "next/image";

type HeroPhotoCardProps = {
  title: string;
  caption?: string;
  /** Portrait-ish thumbnails stack tighter vertically — taller hero stacks welcome */
  minHeightClass?: string;
  src: string;
  alt: string;
};

/**
 * Grayscale hero tile with hover “bump” (inner image only — avoids rounding glitches),
 * rotating white/grey surround.
 */
export function HeroPhotoCard({
  title,
  caption,
  minHeightClass = "min-h-[180px]",
  src,
  alt,
}: HeroPhotoCardProps) {
  /* Fixed outer radius — do not scale the outer shell (safari/gpu used to flicker square corners). */
  const shell = "rounded-[2rem]";

  return (
    <div
      className={`group relative isolate flex-1 ${minHeightClass} transform-gpu ${shell}`}
    >
      {/* Animated surround — clipped to same radius throughout hover */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${shell} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden
      >
        <div
          className="absolute inset-[-45%] animate-spin-orbit bg-[conic-gradient(from_45deg,_rgba(163,163,163,0.15)_0deg,_rgba(255,255,255,0.95)_72deg,_rgba(82,82,82,0.55)_144deg,_rgba(255,255,255,0.55)_216deg,_rgba(212,212,212,0.75)_288deg,_rgba(163,163,163,0.15)_360deg)] motion-reduce:animate-none"
        />
      </div>

      {/* Inner tile — bumped scale only on imagery inside overflow-hidden */}
      <div
        className={`absolute inset-[2px] z-[1] overflow-hidden ${shell} border border-white/15 bg-neutral-950 shadow-[0_18px_48px_-24px_rgba(0,0,0,0.95)] ring-1 ring-white/10 transition-[box-shadow,border-color] duration-300 group-hover:border-white/40 group-hover:shadow-[0_22px_60px_-18px_rgba(255,255,255,0.14)]`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 34vw"
            className="object-cover grayscale brightness-[0.9] contrast-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:z-[4] motion-reduce:group-hover:scale-100 group-hover:scale-[1.06]"
            priority
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/72 via-black/25 to-transparent"
          aria-hidden
        />
        <span className="absolute left-5 top-5 z-[2] rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/15">
          <span className="title-impact-sm">{title}</span>
        </span>
        {caption ? (
          <span className="absolute bottom-5 right-5 z-[2] max-w-[55%] text-right text-[10px] uppercase leading-relaxed tracking-[0.28em] text-white/55">
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}
