type EventCoverImageProps = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

/** Supabase storage URLs — plain img avoids Next image domain config issues. */
export function EventCoverImage({
  src,
  alt = "",
  className,
  priority,
}: EventCoverImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}
