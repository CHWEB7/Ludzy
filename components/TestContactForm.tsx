"use client";

import { useEnquiryForm } from "@/lib/use-enquiry-form";

const inputClass =
  "mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white";

const selectClass = `${inputClass} cursor-pointer [color-scheme:dark]`;

export function TestContactForm() {
  const { submitting, succeeded, error, handleSubmit } = useEnquiryForm();

  if (succeeded) {
    return (
      <p className="text-center text-sm leading-relaxed text-emerald-400" role="status">
        Thank you — enquiry received. We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="test-contact-form space-y-8">
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
          Name *
          <input
            id="name"
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
            id="email"
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
            id="phone"
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
            id="event_type"
            name="event_type"
            required
            className={selectClass}
            defaultValue=""
          >
            <option value="" disabled className="bg-black text-white/40">
              Select…
            </option>
            <option value="wedding" className="bg-black text-white">
              Wedding
            </option>
            <option value="private-party" className="bg-black text-white">
              Private party
            </option>
            <option value="corporate" className="bg-black text-white">
              Corporate event
            </option>
            <option value="residency" className="bg-black text-white">
              Venue residency
            </option>
            <option value="terrace" className="bg-black text-white">
              Terrace / garden party
            </option>
            <option value="festival" className="bg-black text-white">
              Festival
            </option>
            <option value="other" className="bg-black text-white">
              Other
            </option>
          </select>
        </label>
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Event date
        <input id="event_date" name="event_date" type="date" className={inputClass} />
      </label>

      <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Tell us about your event *
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-y`}
          placeholder="Venue, timings, guest count, vibe, must-plays…"
        />
      </label>

      <input type="hidden" name="_subject" value="New Ludzy enquiry from ludzy.online" />

      <button
        type="submit"
        disabled={submitting}
        className="test-btn-primary w-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>

      {error && (
        <p className="text-center text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
