"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { adminSections } from "@/lib/admin/sections";
import { useAdminSession } from "@/lib/auth/use-admin-session";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

export function AdminDashboard() {
  const router = useRouter();
  const session = useAdminSession();

  useEffect(() => {
    if (session === "guest") {
      router.replace("/admin/login");
    }
  }, [session, router]);

  async function signOut() {
    const supabase = createAdminBrowserClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    router.replace("/admin/login");
  }

  if (session === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-white/50">
        Loading admin…
      </div>
    );
  }

  if (session === "guest") {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
            Ludzy admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.06em]">
            Dashboard
          </h1>
          <p className="mt-3 text-sm text-white/45">
            Choose an area to manage. More options will appear here as they are added.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="test-btn-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {adminSections.map((section) =>
          section.available ? (
            <Link
              key={section.id}
              href={section.href}
              className="group border border-white/10 p-6 transition hover:border-white/25 hover:bg-white/[0.03]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                Manage
              </p>
              <h2 className="mt-2 font-display text-lg font-bold uppercase tracking-[0.04em] text-white/90 transition group-hover:text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/45">{section.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition group-hover:text-white">
                Open
                <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2.5 6h7M6.5 2.5 10 6l-3.5 3.5" />
                </svg>
              </span>
            </Link>
          ) : (
            <div
              key={section.id}
              className="border border-white/5 p-6 opacity-45"
              aria-disabled
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">
                Coming soon
              </p>
              <h2 className="mt-2 font-display text-lg font-bold uppercase tracking-[0.04em] text-white/60">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/35">{section.description}</p>
            </div>
          ),
        )}
      </div>

      <div className="mt-10 border-t border-white/10 pt-8">
        <Link
          href="/events"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
        >
          View public events page →
        </Link>
      </div>
    </div>
  );
}
