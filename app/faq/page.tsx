import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | DJ Ludzy — Frequently Asked Questions",
  description:
    "Common questions about booking DJ Ludzy for weddings, private parties, corporate events, and venue residencies across Suffolk and East Anglia.",
};

const faqs: FaqItem[] = [
  {
    question: "What music do you play?",
    answer:
      "Ludzy specialises in house, soulful edits, nu disco, rare groove, UK garage, and organic house. Every set is tailored to the event — from relaxed background warmth during a drinks reception to peak-time dancefloor energy later in the evening. If you have specific genres or must-play tracks in mind, just include them in your enquiry and we'll build them into the set.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "Ludzy is based in Suffolk and regularly covers Ipswich, Woodbridge, Framlingham, Southwold, Diss, Eye, and the wider East Anglia region. We're also happy to travel further afield across the UK for the right event — just get in touch with the details and we'll confirm availability.",
  },
  {
    question: "Do you have your own sound equipment?",
    answer:
      "Yes. Ludzy carries a professional-grade portable PA system suitable for intimate gatherings through to larger private parties. For bigger venues or festivals where a larger rig is needed, we work with trusted local production partners to provide a complete sound and lighting package. Equipment details can be discussed during the booking process.",
  },
  {
    question: "What types of events do you DJ at?",
    answer:
      "Weddings, private parties, corporate events, venue residencies, garden parties, terrace sessions, festivals, and more. Whether it's a sophisticated dinner party for 30 guests or a 300-person wedding reception, Ludzy adapts the music and energy to match the occasion perfectly.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "As early as possible — especially for weekend dates during the summer season. Popular Saturdays can book up months in advance. That said, we always try to accommodate last-minute enquiries, so it's always worth getting in touch even if your event is coming up soon.",
  },
  {
    question: "How much does it cost to hire Ludzy?",
    answer:
      "Every event is different, so pricing depends on the type of event, duration, location, and any additional requirements such as extra sound equipment or lighting. Get in touch with your event details and we'll send a transparent quote with no hidden fees.",
  },
  {
    question: "Can I request specific songs?",
    answer:
      "Absolutely. We encourage it. Before the event we'll discuss your must-play list, any do-not-play requests, and the general vibe you're going for. On the night, Ludzy reads the room and blends your requests naturally into the flow of the set.",
  },
  {
    question: "Do you provide lighting as well?",
    answer:
      "Yes — a basic lighting setup is included as standard for most bookings. For larger events or specific production requirements (uplighting, moving heads, haze), we can arrange a bespoke lighting package through our production partners. Just let us know what you have in mind.",
  },
  {
    question: "What happens if you're unavailable for my date?",
    answer:
      "If Ludzy is already booked for your date, we'll let you know straight away and, where possible, recommend a trusted DJ from our network who can deliver a similar style and standard.",
  },
  {
    question: "How do I book?",
    answer:
      "Simply head to our contact page and fill in the enquiry form with your event details — venue, date, timings, guest count, and the vibe you're after. We'll get back to you within 24 hours with availability and a quote. You can also call us directly on 07592 262525 or email info@ajeventspromotions.com.",
  },
];

export default function FaqPage() {
  return (
    <main className="relative min-h-screen text-white">
      <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pb-20 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
              <li>
                <Link href="/" className="transition hover:text-white/60">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/55">FAQ</li>
            </ol>
          </nav>
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
            Frequently asked questions
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-5xl lg:text-7xl">
            FAQs
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">
            Everything you need to know about booking Ludzy. Can&apos;t find what you&apos;re
            looking for?{" "}
            <Link
              href="/contact"
              className="text-white/75 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/60"
            >
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
            Answers
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">
            Booking &amp; music
          </h2>
          <div className="mx-auto mt-10 max-w-3xl border border-white/10 bg-black/30 p-6 md:p-10">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/30">
            Still have questions?
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45">
            Drop us a message and we&apos;ll get back to you within 24 hours with availability
            and a transparent quote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Enquire now
            </Link>
            <a
              href="tel:07592262525"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              07592 262525
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
