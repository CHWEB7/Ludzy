import {
  EVENT_IMAGE_ALLOWED_TYPES,
  EVENT_IMAGE_MAX_INPUT_BYTES,
  EVENT_IMAGE_MAX_UPLOAD_BYTES,
  EVENT_IMAGE_MIN_DIMENSION,
  EVENT_IMAGE_SPECS,
  EVENT_IMAGE_WEBP_QUALITY,
  formatBytes,
  type EventImageUploadKind,
} from "@/lib/event-image-limits";

export type PreparedEventImage = {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  outputBytes: number;
};

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image file."));
    };
    img.src = url;
  });
}

function computeCenterCrop(
  sourceWidth: number,
  sourceHeight: number,
  aspectRatio: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const sourceAspect = sourceWidth / sourceHeight;
  if (sourceAspect > aspectRatio) {
    const sh = sourceHeight;
    const sw = sourceHeight * aspectRatio;
    return { sx: (sourceWidth - sw) / 2, sy: 0, sw, sh };
  }
  const sw = sourceWidth;
  const sh = sourceWidth / aspectRatio;
  return { sx: 0, sy: (sourceHeight - sh) / 2, sw, sh };
}

function scaleToMax(width: number, height: number, maxWidth: number, maxHeight: number) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

async function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

async function encodeWithQuality(
  canvas: HTMLCanvasElement,
  startQuality: number,
): Promise<{ blob: Blob; quality: number }> {
  let quality = startQuality;
  let blob = await canvasToWebpBlob(canvas, quality);

  while (blob.size > EVENT_IMAGE_MAX_UPLOAD_BYTES && quality > 0.5) {
    quality -= 0.08;
    blob = await canvasToWebpBlob(canvas, quality);
  }

  if (blob.size > EVENT_IMAGE_MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is still too large after compression (${formatBytes(blob.size)}). Try a simpler photo or smaller original.`,
    );
  }

  return { blob, quality };
}

/** Crop to site aspect ratio, resize, and compress to WebP before upload. */
export async function prepareEventImageFile(
  file: File,
  kind: EventImageUploadKind,
): Promise<PreparedEventImage> {
  if (!EVENT_IMAGE_ALLOWED_TYPES.includes(file.type as (typeof EVENT_IMAGE_ALLOWED_TYPES)[number])) {
    throw new Error("Use JPEG, PNG, or WebP only.");
  }

  if (file.size > EVENT_IMAGE_MAX_INPUT_BYTES) {
    throw new Error(`Original file must be under ${formatBytes(EVENT_IMAGE_MAX_INPUT_BYTES)}.`);
  }

  const spec = EVENT_IMAGE_SPECS[kind];
  const img = await loadImageFromFile(file);

  if (img.naturalWidth < EVENT_IMAGE_MIN_DIMENSION || img.naturalHeight < EVENT_IMAGE_MIN_DIMENSION) {
    throw new Error(`Image must be at least ${EVENT_IMAGE_MIN_DIMENSION}px on the shortest useful side.`);
  }

  const crop = computeCenterCrop(img.naturalWidth, img.naturalHeight, spec.aspectRatio);
  const scaled = scaleToMax(crop.sw, crop.sh, spec.maxWidth, spec.maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = scaled.width;
  canvas.height = scaled.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image in this browser.");

  ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, scaled.width, scaled.height);

  const { blob } = await encodeWithQuality(canvas, EVENT_IMAGE_WEBP_QUALITY);
  const baseName = file.name.replace(/\.[^.]+$/, "") || "event-image";
  const outputFile = new File([blob], `${baseName}.webp`, { type: "image/webp" });

  return {
    file: outputFile,
    width: scaled.width,
    height: scaled.height,
    originalBytes: file.size,
    outputBytes: outputFile.size,
  };
}

export function eventImageUploadHint(kind: EventImageUploadKind): string {
  const spec = EVENT_IMAGE_SPECS[kind];
  return `${spec.label}, max ${spec.maxWidth}×${spec.maxHeight}px, saved as compressed WebP (under ${formatBytes(EVENT_IMAGE_MAX_UPLOAD_BYTES)}).`;
}
