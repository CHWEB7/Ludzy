"use client";

import { openCrispChat } from "@/lib/crisp";

function ChatIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h8M8 14h5M21 12c0 3.866-3.582 7-8 7a8.9 8.9 0 01-3.48-.7L3 21l1.7-5.2A7.96 7.96 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
      />
    </svg>
  );
}

export function CrispChatLauncher() {
  return (
    <button
      id="ludzy-crisp-launcher"
      type="button"
      onClick={openCrispChat}
      className="fixed bottom-6 right-6 z-[90] flex items-center gap-2.5 rounded-sm bg-[#6B7280] px-3.5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-black/30 transition hover:bg-[#7b8494] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
      aria-label="Chat with us"
    >
      <ChatIcon />
      <span className="hidden sm:inline">Chat with us</span>
    </button>
  );
}
