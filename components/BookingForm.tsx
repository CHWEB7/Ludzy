"use client";

import { FormEvent, useState } from "react";

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = new FormData(ev.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Could not submit");
      }

      setStatus("ok");
      setMessage("Thank you — enquiry received.");
      ev.currentTarget.reset();
    } catch {
      setStatus("err");
      setMessage("Something went wrong. Please call or email directly.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-white/15 bg-black/60 p-6 backdrop-blur md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Name
          <input
            name="name"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
            placeholder="Your name"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Phone
          <input
            name="phone"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
            placeholder="Optional"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Event type
          <select
            name="event_type"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="gathering">The Gathering</option>
            <option value="resident">The Resident</option>
            <option value="corporate">The Corporate</option>
            <option value="terrace">The Terrace Session</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Event date (optional)
        <input
          name="event_date"
          type="date"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
        />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Message
        <textarea
          name="message"
          required
          rows={4}
          className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
          placeholder="Venue, timings, vibe, must-plays…"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            status === "ok" ? "text-emerald-300" : "text-rose-300"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
