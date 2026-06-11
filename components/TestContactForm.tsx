"use client";

import { useForm, ValidationError } from "@formspree/react";
import { FORMSPREE_FORM_ID } from "@/lib/formspree";

const inputClass =
  "mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white";

const fieldErrorClass = "mt-1 block text-xs text-rose-400";

export function TestContactForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

  if (state.succeeded) {
    return (
      <p className="text-center text-sm leading-relaxed text-emerald-400" role="status">
        Thank you — enquiry received. We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          <ValidationError prefix="Name" field="name" errors={state.errors} className={fieldErrorClass} />
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
          <ValidationError prefix="Email" field="email" errors={state.errors} className={fieldErrorClass} />
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
          <ValidationError
            prefix="Event type"
            field="event_type"
            errors={state.errors}
            className={fieldErrorClass}
          />
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
        <ValidationError prefix="Message" field="message" errors={state.errors} className={fieldErrorClass} />
      </label>

      <input type="hidden" name="_subject" value="New Ludzy enquiry from ludzy.online" />

      <button
        type="submit"
        disabled={state.submitting}
        className="test-btn-primary w-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state.submitting ? "Sending…" : "Send enquiry"}
      </button>

      <ValidationError errors={state.errors} className="text-center text-sm text-rose-400" />
    </form>
  );
}
