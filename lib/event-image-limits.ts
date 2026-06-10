/** Shared limits for event image uploads (cover + gallery). */

export type EventImageUploadKind = "cover" | "gallery";

export const EVENT_IMAGE_SPECS: Record<
  EventImageUploadKind,
  { aspectRatio: number; maxWidth: number; maxHeight: number; label: string }
> = {
  cover: {
    aspectRatio: 16 / 10,
    maxWidth: 1600,
    maxHeight: 1000,
    label: "16:10 landscape (event tiles)",
  },
  gallery: {
    aspectRatio: 16 / 9,
    maxWidth: 1920,
    maxHeight: 1080,
    label: "16:9 landscape (recap gallery)",
  },
};

export const EVENT_IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/** Max size before browser optimisation (original file from camera/phone). */
export const EVENT_IMAGE_MAX_INPUT_BYTES = 15 * 1024 * 1024;

/** Max size accepted by the upload API after compression. */
export const EVENT_IMAGE_MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export const EVENT_IMAGE_WEBP_QUALITY = 0.82;

export const EVENT_IMAGE_MIN_DIMENSION = 640;

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
