"use client";

import Script from "next/script";
import { useEffect, useId } from "react";
import {
  lightWidgetScriptSrc,
  parseLightWidgetId,
  resolveLightWidgetIframeSrc,
} from "@/lib/lightwidget";
import {
  INSTAGRAM_PROFILE,
  instagramPostPermalinks,
} from "@/lib/instagram-posts";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const beholdId = process.env.NEXT_PUBLIC_INSTAGRAM_BEHOLD_ID?.trim();

const widgetEnv =
  process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_SRC?.trim() ||
  process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ID?.trim() ||
  "";

const lightWidgetId = widgetEnv ? parseLightWidgetId(widgetEnv) : null;
const lightWidgetSrc = widgetEnv ? resolveLightWidgetIframeSrc(widgetEnv) : null;

function MiniProfileHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]"
        aria-hidden
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          L
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-white">@{INSTAGRAM_PROFILE.handle}</p>
        <p className="text-[10px] text-white/45">Instagram</p>
      </div>
      <a
        href={INSTAGRAM_PROFILE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-black transition hover:bg-white/90"
      >
        Follow
      </a>
    </div>
  );
}

function FeedPlaceholder() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md bg-gradient-to-br from-white/10 to-white/[0.03] ring-1 ring-white/10"
            aria-hidden
          />
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-white/45">
        Set{" "}
        <code className="rounded bg-white/5 px-1 text-white/55">NEXT_PUBLIC_INSTAGRAM_BEHOLD_ID</code>{" "}
        in Vercel to show your Behold feed.
      </p>
      <a
        href={INSTAGRAM_PROFILE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
      >
        View @{INSTAGRAM_PROFILE.handle} →
      </a>
    </div>
  );
}

function PostEmbeds() {
  const feedId = useId();

  useEffect(() => {
    const process = () => window.instgrm?.Embeds.process();
    process();
    const t = window.setTimeout(process, 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <div
        id={feedId}
        className="instagram-mini-feed max-h-[min(52vh,420px)] flex-1 overflow-y-auto overscroll-y-contain px-2 py-2"
      >
        <div className="flex flex-col gap-3">
          {instagramPostPermalinks.map((permalink) => (
            <blockquote
              key={permalink}
              className="instagram-media !m-0 !max-w-full !min-w-0 !w-full"
              data-instgrm-permalink={permalink}
              data-instgrm-version="14"
              data-instgrm-captioned
              style={{
                background: "#0a0a0a",
                border: 0,
                borderRadius: "12px",
                boxShadow: "none",
                margin: 0,
                maxWidth: "100%",
                minWidth: 0,
                padding: 0,
                width: "100%",
              }}
            >
              <a href={permalink} target="_blank" rel="noopener noreferrer" className="sr-only">
                View post on Instagram
              </a>
            </blockquote>
          ))}
        </div>
      </div>
    </>
  );
}

/** Behold feed — connected once in behold.so, no env auth on the site */
function BeholdEmbed({ id }: { id: string }) {
  return (
    <div className="behold-feed min-h-[min(52vh,420px)] flex-1 overflow-hidden px-1 py-2">
      <div data-behold-id={id} data-behold-theme="dark" className="min-h-[min(50vh,400px)]" />
      <Script
        id={`behold-widget-${id}`}
        src="https://w.behold.so/widget.js"
        type="module"
        strategy="afterInteractive"
        data-id={id}
      />
    </div>
  );
}

function LightWidgetEmbed({ widgetId, iframeSrc }: { widgetId: string; iframeSrc: string }) {
  return (
    <div className="lightwidget-container min-h-[min(52vh,420px)] flex-1 overflow-hidden">
      <Script src={lightWidgetScriptSrc(widgetId)} strategy="lazyOnload" />
      <iframe
        src={iframeSrc}
        title={`Instagram feed @${INSTAGRAM_PROFILE.handle}`}
        className="lightwidget-widget h-[min(52vh,420px)] w-full border-0 bg-transparent"
        scrolling="no"
        loading="lazy"
        style={{ width: "100%", border: 0, overflow: "hidden" }}
      />
    </div>
  );
}

export function InstagramFeed() {
  const hasBehold = Boolean(beholdId);
  const hasLightWidget = Boolean(lightWidgetId && lightWidgetSrc);
  const hasPosts = instagramPostPermalinks.length > 0;

  return (
    <div className="glass-panel flex min-h-full flex-col overflow-hidden rounded-3xl ring-1 ring-white/10">
      <MiniProfileHeader />

      {hasBehold ? (
        <BeholdEmbed id={beholdId!} />
      ) : hasLightWidget ? (
        <LightWidgetEmbed widgetId={lightWidgetId!} iframeSrc={lightWidgetSrc!} />
      ) : hasPosts ? (
        <PostEmbeds />
      ) : (
        <FeedPlaceholder />
      )}

      <a
        href={INSTAGRAM_PROFILE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="border-t border-white/10 px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45 transition hover:bg-white/5 hover:text-white/70"
      >
        View profile on Instagram
      </a>
    </div>
  );
}
