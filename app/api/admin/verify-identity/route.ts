import { NextResponse } from "next/server";
import { verifyAdminIdentity } from "@/lib/auth/verify-admin-identity";

/** Check whether the current bearer token belongs to an authorised admin (before or after MFA). */
export async function GET(req: Request) {
  const auth = await verifyAdminIdentity(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json(
      { allowed: false, reason: auth.reason ?? "not_authorised" },
      { status: auth.status },
    );
  }

  return NextResponse.json({
    allowed: true,
    reason: "ok",
    viaMetadata: auth.user.app_metadata?.admin === true,
  });
}
