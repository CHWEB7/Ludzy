/** Comma-separated admin emails in ADMIN_EMAILS env (server) or NEXT_PUBLIC_ADMIN_EMAILS (client check only). */
export function getAdminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS ??
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
    "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(email.trim().toLowerCase());
}

/** Parse JWT payload without verification (token already validated by Supabase getUser). */
export function getJwtClaim(token: string, claim: string): unknown {
  try {
    const part = token.split(".")[1];
    if (!part) return undefined;
    const json = Buffer.from(part, "base64url").toString("utf8");
    const payload = JSON.parse(json) as Record<string, unknown>;
    return payload[claim];
  } catch {
    return undefined;
  }
}

export function hasMfaSession(token: string): boolean {
  return getJwtClaim(token, "aal") === "aal2";
}

/** Idle timeout for admin sessions (30 minutes). */
export const ADMIN_IDLE_MS = 30 * 60 * 1000;

export const ADMIN_SESSION_KEY = "ludzy_admin_last_activity";
