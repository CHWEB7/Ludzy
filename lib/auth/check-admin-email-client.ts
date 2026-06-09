/** Client-side admin email check via server API (reads ADMIN_EMAILS). */
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
