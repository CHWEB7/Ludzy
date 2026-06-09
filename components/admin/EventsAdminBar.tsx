"use client";

import Link from "next/link";
import { useAdminSession } from "@/lib/auth/use-admin-session";

export function EventsAdminBar() {
  const session = useAdminSession();

  if (session !== "admin") return null;

  return (
    <div className="border-b border-emerald-500/20 bg-emerald-950/20 px-6 py-4 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300/90">
          Admin mode — edit events below or open the full manager
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em]"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em]"
          >
            All events
          </Link>
          <Link
            href="/admin/events?type=upcoming"
            className="test-btn-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em]"
          >
            + New event
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminEditLink({ eventId, className }: { eventId: string; className?: string }) {
  const session = useAdminSession();
  if (session !== "admin") return null;

  return (
    <Link
      href={`/admin/events?edit=${eventId}`}
      className={
        className ??
        "text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400/80 transition hover:text-emerald-300"
      }
      onClick={(e) => e.stopPropagation()}
    >
      Edit
    </Link>
  );
}
