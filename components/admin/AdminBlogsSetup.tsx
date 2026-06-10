"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BLOGS_TABLE_SETUP_MESSAGE } from "@/lib/supabase/table-errors";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

type SetupStatus = {
  configured?: boolean;
  projectRef?: string | null;
  hasServiceRole?: boolean;
  tableReady?: boolean;
  tableMissing?: boolean;
  supabaseError?: string | null;
  sqlEditorUrl?: string | null;
  tableEditorUrl?: string | null;
};

async function getAccessToken(): Promise<string | null> {
  const supabase = createAdminBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function AdminBlogsSetup({ onReady }: { onReady?: () => void }) {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const onReadyRef = useRef(onReady);
  const didNotifyReady = useRef(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await fetch("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as SetupStatus & { code?: string; error?: string };

      const tableReady = res.ok;
      const tableMissing = json.code === "TABLE_MISSING";

      setStatus({
        configured: tableReady || tableMissing,
        tableReady,
        tableMissing,
        supabaseError: tableReady ? null : (json.error ?? null),
      });

      if (tableReady && !didNotifyReady.current) {
        didNotifyReady.current = true;
        onReadyRef.current?.();
      }
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  if (checking && !status) {
    return (
      <div className="mb-6 text-sm text-white/40">Checking database connection…</div>
    );
  }

  if (status?.tableReady) return null;

  return (
    <div className="mb-6 space-y-4 rounded border border-amber-500/30 bg-amber-950/30 px-4 py-4 text-sm text-amber-100/90">
      <p className="font-medium text-amber-100">{BLOGS_TABLE_SETUP_MESSAGE}</p>

      {status?.supabaseError && (
        <p className="rounded bg-black/25 px-3 py-2 font-mono text-xs text-rose-200/90">
          {status.supabaseError}
        </p>
      )}

      <ol className="list-decimal space-y-2 pl-5 text-amber-100/75">
        <li>Open SQL Editor in your Supabase dashboard</li>
        <li>
          Paste and run{" "}
          <code className="text-amber-50">supabase/blogs-schema.sql</code>
        </li>
        <li>
          Confirm the <code className="text-amber-50">blogs</code> table in Table Editor
        </li>
        <li>Click Check again below (wait ~30s after running SQL)</li>
      </ol>

      <button
        type="button"
        onClick={() => void check()}
        disabled={checking}
        className="test-btn-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] disabled:opacity-50"
      >
        {checking ? "Checking…" : "Check again"}
      </button>
    </div>
  );
}
