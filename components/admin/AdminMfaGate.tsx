"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/browser-admin";
import { isAdminEmail } from "@/lib/auth/admin-access";

type Step = "loading" | "enroll" | "verify";

export function AdminMfaGate() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const finishToEvents = useCallback(() => {
    router.replace("/admin/events");
    router.refresh();
  }, [router]);

  useEffect(() => {
    async function init() {
      const supabase = createAdminBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/admin/login");
        return;
      }

      if (!isAdminEmail(session.user.email)) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal.currentLevel === "aal2") {
        finishToEvents();
        return;
      }

      const { data: factorsData, error: factorsError } =
        await supabase.auth.mfa.listFactors();
      if (factorsError) {
        setError(factorsError.message);
        setStep("verify");
        return;
      }

      const verifiedTotp = factorsData.totp.filter((f) => f.status === "verified");

      if (verifiedTotp.length === 0) {
        const { data: enrollData, error: enrollError } =
          await supabase.auth.mfa.enroll({
            factorType: "totp",
            friendlyName: "Authenticator app",
          });
        if (enrollError || !enrollData) {
          setError(enrollError?.message ?? "Could not start MFA enrolment");
          return;
        }
        setFactorId(enrollData.id);
        setQr(enrollData.totp.qr_code);
        setSecret(enrollData.totp.secret);
        setStep("enroll");
        return;
      }

      setFactorId(verifiedTotp[0].id);
      setStep("verify");
    }

    void init();
  }, [router, finishToEvents]);

  async function submitCode(mode: Step) {
    if (!factorId || code.length < 6) return;
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createAdminBrowserClient();
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });
      if (challengeError || !challenge) {
        setError(challengeError?.message ?? "MFA challenge failed");
        setSubmitting(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });

      if (verifyError) {
        setError(verifyError.message);
        setSubmitting(false);
        return;
      }

      if (mode === "enroll") {
        setError(null);
      }

      finishToEvents();
    } catch {
      setError("Verification failed");
      setSubmitting(false);
    }
  }

  if (step === "loading") {
    return (
      <p className="text-center text-sm text-white/50">Checking authentication…</p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-white">
          {step === "enroll" ? "Set up authenticator" : "Verify identity"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {step === "enroll"
            ? "Scan the QR code with Google Authenticator, Authy, or another TOTP app. Then enter the 6-digit code to complete setup."
            : "Enter the 6-digit code from your authenticator app. You must verify every time you sign in."}
        </p>
      </div>

      {step === "enroll" && qr && (
        <div className="space-y-4 rounded border border-white/10 p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="MFA QR code" className="mx-auto h-48 w-48 bg-white p-2" />
          {secret && (
            <p className="break-all text-center font-mono text-xs text-white/40">
              Manual key: {secret}
            </p>
          )}
        </div>
      )}

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Authenticator code
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-center text-2xl tracking-[0.4em] text-white outline-none focus:border-white"
          placeholder="000000"
        />
      </label>

      {error && (
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={submitting || code.length < 6}
        onClick={() => submitCode(step)}
        className="test-btn-primary w-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] disabled:opacity-50"
      >
        {submitting ? "Verifying…" : step === "enroll" ? "Complete setup" : "Verify & continue"}
      </button>

      <button
        type="button"
        onClick={async () => {
          const supabase = createAdminBrowserClient();
          await supabase.auth.signOut();
          sessionStorage.clear();
          router.replace("/admin/login");
        }}
        className="w-full text-center text-[11px] uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}
