import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import {
  getSupabaseProjectRef,
  getSupabaseSqlEditorUrl,
  getSupabaseTableEditorUrl,
} from "@/lib/supabase/project-ref";
import { createServerSupabase } from "@/lib/supabase/server";
import { isEventsTableMissingError } from "@/lib/supabase/table-errors";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const projectRef = getSupabaseProjectRef(url);
  const supabase = createServerSupabase();

  if (!supabase) {
    return NextResponse.json({
      configured: false,
      projectRef,
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      tableReady: false,
      supabaseError: "NEXT_PUBLIC_SUPABASE_URL or API keys are not set on the server.",
      sqlEditorUrl: getSupabaseSqlEditorUrl(url),
      tableEditorUrl: getSupabaseTableEditorUrl(url),
    });
  }

  const { error } = await supabase.from("events").select("id").limit(1);

  return NextResponse.json({
    configured: true,
    projectRef,
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    tableReady: !error,
    tableMissing: error ? isEventsTableMissingError(error.message) : false,
    supabaseError: error?.message ?? null,
    sqlEditorUrl: getSupabaseSqlEditorUrl(url),
    tableEditorUrl: getSupabaseTableEditorUrl(url),
  });
}
