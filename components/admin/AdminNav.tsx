"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

type AdminNavProps = {
  title: string;
  description?: string;
};

export function AdminNav({ title, description }: AdminNavProps) {
  const router = useRouter();

  async function signOut() {
    const supabase = createAdminBrowserClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    router.replace("/admin/login");
  }

  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-8">
      <div>
        <Link
          href="/admin"
          className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 transition hover:text-white/60"
        >
          ← Admin home
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-[0.08em]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/events"
          className="test-btn-ghost px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          View events page
        </Link>
        <button
          type="button"
          onClick={() => void signOut()}
          className="test-btn-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
