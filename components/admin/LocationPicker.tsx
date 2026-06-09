"use client";

import { useCallback, useEffect, useRef } from "react";
import { googleMapsPlaceUrl, googleMapsSearchUrl } from "@/lib/event-date-format";

type LocationPickerProps = {
  value: string;
  mapsUrl: string;
  onChange: (location: string, mapsUrl: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
};

type PlaceGeometry = { location?: { lat: () => number; lng: () => number } };
type PlaceResult = {
  formatted_address?: string;
  name?: string;
  place_id?: string;
  geometry?: PlaceGeometry;
};

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: { fields?: string[]; types?: string[] },
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => PlaceResult;
          };
        };
      };
    };
  }
}

let mapsScriptPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Maps failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Maps failed"));
    document.head.appendChild(script);
  });

  return mapsScriptPromise;
}

export function LocationPicker({
  value,
  mapsUrl,
  onChange,
  className,
  placeholder = "Search venue or address…",
  label = "Location",
}: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    let autocomplete: { addListener: (event: string, handler: () => void) => void; getPlace: () => PlaceResult } | null =
      null;
    let cancelled = false;

    void loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places) return;
        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "name", "place_id", "geometry"],
          types: ["establishment", "geocode"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();
          if (!place) return;
          const location = place.formatted_address ?? place.name ?? "";
          const url = place.place_id
            ? googleMapsPlaceUrl(place.place_id)
            : location
              ? googleMapsSearchUrl(location)
              : "";
          if (location) onChangeRef.current(location, url);
        });
      })
      .catch(() => {
        /* fall back to manual entry */
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  function handleBlur() {
    if (!value.trim()) {
      onChange("", "");
      return;
    }
    if (!mapsUrl) {
      onChange(value.trim(), googleMapsSearchUrl(value.trim()));
    }
  }

  const previewUrl = mapsUrl || (value.trim() ? googleMapsSearchUrl(value.trim()) : "");

  return (
    <div>
      <label className="block text-xs text-white/50">
        {label}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value, mapsUrl)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
        />
      </label>
      {!apiKey && (
        <p className="mt-1 text-[10px] text-white/35">
          Add <code className="text-white/50">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> for address
          autocomplete. Manual entry still works.
        </p>
      )}
      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-emerald-400/80 transition hover:text-emerald-300"
        >
          View on Google Maps
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2.5 6h7M6.5 2.5 10 6l-3.5 3.5" />
          </svg>
        </a>
      )}
    </div>
  );
}
