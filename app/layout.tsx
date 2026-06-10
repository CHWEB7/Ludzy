import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Dancing_Script, Outfit } from "next/font/google";
import "./globals.css";
import { TestHeader } from "@/components/TestHeader";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase:
    typeof process.env.NEXT_PUBLIC_SITE_URL !== "undefined"
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  title: "DJ Ludzy | House & Dance Music DJ — Suffolk & East Anglia",
  description:
    "Professional DJ available for hire across Suffolk — weddings, private parties, corporate events, and venue residencies. Curated house, soulful edits, and organic grooves.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "DJ Ludzy — House & Dance Music DJ",
    description:
      "Professional DJ for weddings, parties, corporate events, and residencies across Suffolk & East Anglia.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dancing.variable}`}>
      <body className="min-h-screen bg-ink antialiased">
        <TestHeader />
        {children}
        <Script id="convora-widget-config" strategy="lazyOnload">
          {`window.ConvoraWidget={"phone":"447592262525","brand":"Ludzy","color":"#6B7280","size":"small","buttonText":"Chat with us","shape":"square","message":"Hey! 👋 Got a question about booking or availability? Drop us a message.","prefill":"","brandImage":"https://www.ludzy.online/images/ludzy-logo.png","autoOpen":10,"headerGradient":"linear-gradient(135deg, #374151 0%, #111827 100%)"};`}
        </Script>
        <Script
          src="https://convora.io/api/widget/loader.js"
          strategy="lazyOnload"
        />
        <Analytics />
      </body>
    </html>
  );
}
