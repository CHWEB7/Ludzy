import type { Metadata } from "next";
import { Dancing_Script, Outfit } from "next/font/google";
import "./globals.css";
import { FloatingHeader } from "@/components/FloatingHeader";

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
  title: "LUDZY | Sophisticated soundscapes",
  description:
    "HOUSE & dance music DJ — curated selections for gatherings, residences, corporates & terrace sessions.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "LUDZY — Sophisticated soundscapes",
    description:
      "Curated music, considered vibes, effortless atmosphere for social spaces.",
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
        <FloatingHeader />
        {children}
      </body>
    </html>
  );
}
