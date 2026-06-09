import { NextResponse } from "next/server";
import { getAdminAllowlistStatus, isAdminEmail } from "@/lib/auth/admin-access";

/** Server-side allowlist check — client cannot read ADMIN_EMAILS at runtime. */
export async function POST(req: Request) {
  let email: string | undefined;
  try {
    const body = (await req.json()) as { email?: string };
    email = body.email?.trim();
  } catch {
    return NextResponse.json({ allowed: false, reason: "invalid_request" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ allowed: false, reason: "invalid_request" }, { status: 400 });
  }

  if (getAdminAllowlistStatus() === "empty") {
    return NextResponse.json({ allowed: false, reason: "allowlist_not_configured" });
  }

  return NextResponse.json({
    allowed: isAdminEmail(email),
    reason: isAdminEmail(email) ? "ok" : "not_listed",
  });
}
