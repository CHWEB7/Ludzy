/** Client-side admin access check via server API (email allowlist or Supabase app_metadata.admin). */
export async function checkAdminEmailAllowed(
  email: string,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const res = await fetch("/api/admin/allow-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!res.ok) return { allowed: false, reason: "request_failed" };
    const data = (await res.json()) as { allowed?: boolean; reason?: string };
    return { allowed: Boolean(data.allowed), reason: data.reason };
  } catch {
    return { allowed: false, reason: "request_failed" };
  }
}

export async function verifyAdminAccessToken(
  accessToken: string,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const res = await fetch("/api/admin/verify-identity", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = (await res.json()) as { allowed?: boolean; reason?: string };
    return { allowed: Boolean(data.allowed), reason: data.reason };
  } catch {
    return { allowed: false, reason: "request_failed" };
  }
}
