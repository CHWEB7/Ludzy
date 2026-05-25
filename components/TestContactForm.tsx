"use client";

import { FormEvent, useState } from "react";

export function TestContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = ev.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      event_type: String(fd.get("event_type") ?? ""),
      event_date: String(fd.get("event_date") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };

      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      setStatus("ok");
      setMessage("Thank you — enquiry received. We'll be in touch soon.");
      form.reset();
    } catch (err) {
      setStatus("err");
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please call or email directly.",
      );
    }
  }

  const inputClass =
    "mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
          Name *
          <input
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
          Email *
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
          Phone
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="Optional"
          />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
          Event type *
          <select
            name="event_type"
            required
            className={`${inputClass} cursor-pointer`}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="wedding">Wedding</option>
            <option value="private-party">Private party</option>
            <option value="corporate">Corporate event</option>
            <option value="residency">Venue residency</option>
            <option value="terrace">Terrace / garden party</option>
            <option value="festival">Festival</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Event date
        <input
          name="event_date"
          type="date"
          className={inputClass}
        />
      </label>

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Tell us about your event *
        <textarea
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-y`}
          placeholder="Venue, timings, guest count, vibe, must-plays…"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="test-btn-primary w-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      {message && (
        <p
          className={`text-center text-sm leading-relaxed ${
            status === "ok" ? "text-emerald-400" : "text-rose-400"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
