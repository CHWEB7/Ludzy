import type { Metadata } from "next";
import Link from "next/link";
import { TestContactForm } from "@/components/TestContactForm";
import { siteSocials } from "@/lib/site-socials";

export const metadata: Metadata = {
  title: "Contact | DJ Ludzy — Book a DJ in Suffolk",
  description:
    "Get in touch with DJ Ludzy. Grounded in Suffolk, available worldwide for weddings, private parties, corporate events, and venue residencies.",
};

const contactMethods = [
  { label: "Phone", value: "07592 262525", href: "tel:07592262525", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /> },
  { label: "Email", value: "info@ajeventspromotions.com", href: "mailto:info@ajeventspromotions.com", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /> },
  { label: "Instagram", value: "@dj_ludzy", href: "https://www.instagram.com/dj_ludzy", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /> },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen text-white">
      <section className="relative px-6 pb-20 pt-28 md:px-12 md:pb-32 md:pt-36 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-12">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
              <li><Link href="/" className="transition hover:text-white/60">Home</Link></li>
              <li aria-hidden>/</li>
              <li className="text-white/55">Contact</li>
            </ol>
          </nav>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">Get in touch</p>
              <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-5xl lg:text-6xl">Let&apos;s talk</h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
                Grounded in Suffolk, covering the globe — send a brief with your venue, date,
                and vibe and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="mt-12 space-y-4">
                {contactMethods.map((m) => (
                  <a key={m.label} href={m.href} target={m.href.startsWith("http") ? "_blank" : undefined} rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined} className="group flex items-center gap-4 border-b border-white/10 pb-4 transition hover:border-white/25">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-white/50 transition group-hover:border-white/40 group-hover:text-white">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>{m.icon}</svg>
                    </span>
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{m.label}</span>
                      <span className="text-sm text-white/75 transition group-hover:text-white">{m.value}</span>
                    </span>
                  </a>
                ))}
              </div>
              <div className="mt-12">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Follow</p>
                <div className="flex flex-col gap-2">
                  {siteSocials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45 transition hover:text-white"
                    >
                      {s.icon}
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Areas covered</p>
                <p className="text-sm leading-relaxed text-white/50">
                  Based in Suffolk — available across the UK and internationally for the right
                  event.
                </p>
              </div>
            </div>
            <div>
              <div className="border border-white/10 p-6 md:p-10">
                <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Send an enquiry</p>
                <TestContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-white/10 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/30">Weekend dates move quickly</p>
          <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-white md:text-3xl">Book early to secure your date</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45">Send your venue, date, timings, and vibe. We&apos;ll respond within 24 hours with availability and a transparent quote — no hidden fees.</p>
        </div>
      </section>
    </main>
  );
}
