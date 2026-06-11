import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { staticFaqs } from "@/lib/faqs-data";
import { fetchPublishedFaqs, toFaqItem } from "@/lib/faqs-db";

export const metadata: Metadata = {
  title: "FAQ | DJ Ludzy — Frequently Asked Questions",
  description:
    "Common questions about booking DJ Ludzy for weddings, private parties, corporate events, and venue residencies across Suffolk and East Anglia.",
};

export const revalidate = 60;

export default async function FaqPage() {
  const records = await fetchPublishedFaqs();
  const faqs = records && records.length > 0 ? records.map(toFaqItem) : staticFaqs;

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <main className="relative min-h-screen text-white">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

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
          <div className="mt-10 w-full border border-white/10 bg-black/30 p-4 md:p-8">
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
