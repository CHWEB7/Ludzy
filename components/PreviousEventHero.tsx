import { EventCoverImage } from "@/components/EventCoverImage";

type PreviousEventHeroProps = {
  title: string;
  date: string;
  venue: string;
  imageUrl?: string;
};

export function PreviousEventHero({
  title,
  date,
  venue,
  imageUrl,
}: PreviousEventHeroProps) {
  return (
    <section className="relative min-h-[52vh] w-full overflow-hidden md:min-h-[62vh] lg:min-h-[68vh]">
      {imageUrl ? (
        <>
          <EventCoverImage
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25"
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" aria-hidden />
      )}

      <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-center px-6 py-28 md:min-h-[62vh] md:px-12 lg:min-h-[68vh] lg:px-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/50">
          Event recap
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl xl:text-7xl">
          {title}
        </h1>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-white/55">
          <span>{date}</span>
          <span>{venue}</span>
        </div>
      </div>
    </section>
  );
}
