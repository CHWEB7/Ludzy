/** Comma-separated admin emails in ADMIN_EMAILS (server). */
function parseAdminEmailList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminEmails(): string[] {
  const combined = [
    ...parseAdminEmailList(process.env.ADMIN_EMAILS),
    ...parseAdminEmailList(process.env.ADDITIONAL_ADMIN_EMAILS),
    ...parseAdminEmailList(process.env.NEXT_PUBLIC_ADMIN_EMAILS),
  ];
  return [...new Set(combined)];
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(email.trim().toLowerCase());
}

/** Supabase Auth app_metadata.admin — set via create-admin script or Supabase dashboard. */
export function hasAdminAppMetadata(user: {
  app_metadata?: Record<string, unknown> | null;
}): boolean {
  return user.app_metadata?.admin === true;
}

/** Email allowlist or Supabase admin flag (no Vercel env change needed when metadata is set). */
export function isAdminAuthorized(user: {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
}): boolean {
  if (hasAdminAppMetadata(user)) return true;
  return isAdminEmail(user.email);
}

export function getAdminAllowlistStatus(): "ok" | "empty" {
  return getAdminEmails().length === 0 ? "empty" : "ok";
}

/** True when at least one authorisation path exists (env list is not the only option). */
export function hasAdminAuthConfigured(): boolean {
  return getAdminAllowlistStatus() === "ok";
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

