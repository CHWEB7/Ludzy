"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminAccessToken } from "@/lib/auth/check-admin-email-client";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createAdminBrowserClient();
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const accessToken = signInData.session?.access_token;
      if (!accessToken) {
        setError("Sign in failed. Please try again.");
        setLoading(false);
        return;
      }

      const { allowed, reason } = await verifyAdminAccessToken(accessToken);
      if (!allowed) {
        await supabase.auth.signOut();
        if (reason === "not_authorised") {
          setError(
            "This account is not authorised for admin access. Ask the site owner to run npm run grant-admin:events or add ADDITIONAL_ADMIN_EMAILS in Vercel.",
          );
        } else {
          setError("This account is not authorised for admin access.");
        }
        setLoading(false);
        return;
      }

      router.push("/admin/mfa");
      router.refresh();
    } catch {
      setError("Sign in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-white">
          Admin sign in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          Session ends when you close this browser. MFA via authenticator app is required every
          time you sign in. There is no &ldquo;remember this device&rdquo; option.
        </p>
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none focus:border-white"
        />
      </label>

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none focus:border-white"
        />
      </label>

      {error && (
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="test-btn-primary w-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Continue to MFA"}
      </button>
    </form>
  );
}
