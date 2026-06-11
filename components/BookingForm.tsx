"use client";

import { useEnquiryForm } from "@/lib/use-enquiry-form";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-white";

export function BookingForm() {
  const { submitting, succeeded, error, handleSubmit } = useEnquiryForm();

  if (succeeded) {
    return (
      <p className="text-center text-sm leading-relaxed text-emerald-300" role="status">
        Thank you — enquiry received. We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-white/15 bg-black/60 p-6 backdrop-blur md:p-8"
    >
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Name
          <input
            id="booking-name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Email
          <input
            id="booking-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Phone
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="Optional"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Event type
          <select
            id="booking-event_type"
            name="event_type"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="gathering">The Gathering</option>
            <option value="resident">The Resident</option>
            <option value="corporate">The Corporate</option>
            <option value="terrace">The Terrace Session</option>
            <option value="garden">Garden parties</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Event date (optional)
        <input id="booking-event_date" name="event_date" type="date" className={inputClass} />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        Message
        <textarea
          id="booking-message"
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-y`}
          placeholder="Venue, timings, vibe, must-plays…"
        />
      </label>

      <input type="hidden" name="_subject" value="New Ludzy enquiry from ludzy.online" />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>

      {error && (
        <p className="text-center text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
