import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Dancing_Script, Outfit } from "next/font/google";
import { CrispChatWidget } from "@/components/CrispChatWidget";
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
        <CrispChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
