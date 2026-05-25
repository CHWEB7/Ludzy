import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | DJ Ludzy",
  description:
    "Privacy policy for DJ Ludzy — how we collect, use, and protect your personal data when you use our website or book our services.",
  robots: { index: true, follow: true },
};

const BUSINESS_NAME = "DJ Ludzy (AJ Events & Promotions)";
const EMAIL = "info@ajeventspromotions.com";
const UPDATED = "25 May 2026";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen text-white">
      <section className="px-6 pb-20 pt-28 md:px-12 md:pb-32 md:pt-36 lg:px-20">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-12">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
              <li>
                <Link href="/test" className="transition hover:text-white/60">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/55">Privacy Policy</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-16 md:mb-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
              Legal
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-sm text-white/40">
              Last updated: {UPDATED}
            </p>
          </header>

          {/* Content */}
          <div className="space-y-12 text-sm leading-relaxed text-white/60 md:text-base md:leading-relaxed [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-[0.08em] [&_h2]:text-white md:[&_h2]:text-xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            <section>
              <h2>Who we are</h2>
              <p>
                This website is operated by {BUSINESS_NAME}. When we refer to
                &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; in
                this policy, we mean {BUSINESS_NAME}. For any privacy-related
                queries, contact us at{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white"
                >
                  {EMAIL}
                </a>
                .
              </p>
            </section>

            <section>
              <h2>What data we collect</h2>
              <p>
                We may collect the following information when you use our
                website or submit an enquiry:
              </p>
              <ul>
                <li>
                  <strong className="text-white/80">Contact details</strong> —
                  name, email address, phone number
                </li>
                <li>
                  <strong className="text-white/80">Event details</strong> —
                  event type, date, venue, and any information you include in
                  your message
                </li>
                <li>
                  <strong className="text-white/80">Technical data</strong> —
                  IP address, browser type, device information, and pages
                  visited (collected automatically via cookies or analytics
                  tools)
                </li>
              </ul>
            </section>

            <section>
              <h2>How we use your data</h2>
              <p>We use the information you provide to:</p>
              <ul>
                <li>Respond to your booking enquiry and provide a quote</li>
                <li>Communicate with you about your event</li>
                <li>Improve our website and services</li>
                <li>
                  Comply with legal obligations where applicable
                </li>
              </ul>
              <p className="mt-4">
                We will never sell, rent, or share your personal data with third
                parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2>Legal basis for processing</h2>
              <p>We process your data on the following grounds:</p>
              <ul>
                <li>
                  <strong className="text-white/80">Consent</strong> — when you
                  voluntarily submit an enquiry form
                </li>
                <li>
                  <strong className="text-white/80">Legitimate interest</strong>{" "}
                  — to respond to enquiries and improve our services
                </li>
                <li>
                  <strong className="text-white/80">Contractual necessity</strong>{" "}
                  — to fulfil a booking agreement
                </li>
              </ul>
            </section>

            <section>
              <h2>Third-party services</h2>
              <p>
                Our website may use the following third-party services that
                process data on our behalf:
              </p>
              <ul>
                <li>
                  <strong className="text-white/80">Vercel</strong> — website
                  hosting and analytics
                </li>
                <li>
                  <strong className="text-white/80">Supabase</strong> — secure
                  database for storing enquiry submissions
                </li>
                <li>
                  <strong className="text-white/80">Instagram / Meta</strong> —
                  embedded social media content
                </li>
                <li>
                  <strong className="text-white/80">Mixcloud</strong> —
                  embedded audio players
                </li>
              </ul>
              <p className="mt-4">
                Each provider operates under their own privacy policy. We
                encourage you to review them independently.
              </p>
            </section>

            <section>
              <h2>Cookies</h2>
              <p>
                We use essential cookies to ensure the website functions
                correctly. We may also use analytics cookies to understand how
                visitors use the site. You can control cookie preferences
                through your browser settings at any time.
              </p>
            </section>

            <section>
              <h2>Data retention</h2>
              <p>
                We retain enquiry data for as long as necessary to fulfil the
                purpose for which it was collected, typically no longer than 24
                months after your last interaction with us, unless a longer
                retention period is required by law.
              </p>
            </section>

            <section>
              <h2>Your rights</h2>
              <p>
                Under UK GDPR and the Data Protection Act 2018, you have the
                right to:
              </p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
                <li>
                  Lodge a complaint with the Information Commissioner&apos;s
                  Office (ICO) at{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white"
                  >
                    ico.org.uk
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, email{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-white/80 underline decoration-white/25 underline-offset-4 transition hover:text-white"
                >
                  {EMAIL}
                </a>
                .
              </p>
            </section>

            <section>
              <h2>Changes to this policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes
                will be posted on this page with an updated revision date. We
                encourage you to review this page periodically.
              </p>
            </section>
          </div>

          {/* Back */}
          <div className="mt-16 border-t border-white/10 pt-10 text-center">
            <Link
              href="/test"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
