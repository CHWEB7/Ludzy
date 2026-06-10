"use client";

import { useCallback, useEffect, useState } from "react";
import { EVENTS_TABLE_SETUP_MESSAGE } from "@/lib/supabase/table-errors";
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

export function AdminEventsSetup({ onReady }: { onReady?: () => void }) {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const res = await fetch("/api/admin/setup/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as SetupStatus;
      setStatus(json);
      if (json.tableReady) onReady?.();
    } finally {
      setChecking(false);
    }
  }, [onReady]);

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
      <p className="font-medium text-amber-100">{EVENTS_TABLE_SETUP_MESSAGE}</p>

      {status?.projectRef && (
        <p className="text-amber-100/80">
          This site is connected to Supabase project:{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-amber-50">
            {status.projectRef}
          </code>
          <br />
          <span className="text-xs text-amber-200/60">
            Run the SQL in that same project (not a different one).
          </span>
        </p>
      )}

      {status?.supabaseError && (
        <p className="rounded bg-black/25 px-3 py-2 font-mono text-xs text-rose-200/90">
          {status.supabaseError}
        </p>
      )}

      {!status?.hasServiceRole && (
        <p className="text-xs text-amber-200/70">
          Tip: add <code className="text-amber-50">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel
          (Project Settings → API → service_role) and redeploy.
        </p>
      )}

      <ol className="list-decimal space-y-2 pl-5 text-amber-100/75">
        <li>
          Open SQL Editor{" "}
          {status?.sqlEditorUrl ? (
            <a
              href={status.sqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-50"
            >
              for project {status.projectRef}
            </a>
          ) : (
            "in your Supabase dashboard"
          )}
        </li>
        <li>
          Paste and run{" "}
          <code className="text-amber-50">supabase/events-schema-minimal.sql</code> (or the full{" "}
          <code className="text-amber-50">events-schema.sql</code>)
        </li>
        <li>
          Confirm the <code className="text-amber-50">events</code> table in{" "}
          {status?.tableEditorUrl ? (
            <a
              href={status.tableEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-50"
            >
              Table Editor
            </a>
          ) : (
            "Table Editor"
          )}
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
