import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalLandingPage } from "@/components/LocalLandingPage";
import { getLocalArea, localAreas } from "@/lib/local-seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return localAreas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getLocalArea(slug);
  if (!area) return { title: "DJ Hire | LUDZY" };

  const title = `DJ Hire ${area.county} — Weddings, Parties & Events | LUDZY`;
  const description = `Ludzy is a professional house & dance music DJ available for hire in ${area.towns.join(", ")} and across ${area.county}. Weddings, private parties, corporate events, and venue residencies.`;

  return {
    title,
    description,
    keywords: area.areaKeywords,
    alternates: {
      canonical: `/areas/${area.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_GB",
      url: `/areas/${area.slug}`,
      siteName: "LUDZY",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "geo.region": "GB",
      "geo.placename": area.county,
    },
  };
}

function LocalBusinessJsonLd({ slug }: { slug: string }) {
  const area = getLocalArea(slug);
  if (!area) return null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ludzy.online";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/areas/${area.slug}#business`,
    name: "LUDZY — DJ",
    description: `Professional house & dance music DJ available for hire across ${area.county} — weddings, private parties, corporate events, and venue residencies in ${area.towns.join(", ")}.`,
    url: `${siteUrl}/areas/${area.slug}`,
    telephone: "+447592262525",
    email: "info@ajeventspromotions.com",
    image: `${siteUrl}/images/ludzy-logo.png`,
    priceRange: "££",
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: area.county,
      },
      ...area.towns.map((town) => ({
        "@type": "City",
        name: `${town}, ${area.county}`,
      })),
    ],
    sameAs: [
      "https://www.instagram.com/dj_ludzy/",
      "https://www.mixcloud.com/DJ-Ludzy/",
      "https://www.facebook.com/share/1BWMcvt3xe/",
    ],
    makesOffer: [
      "Wedding DJ",
      "Party DJ",
      "Corporate Event DJ",
      "Venue Residency DJ",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        areaServed: { "@type": "AdministrativeArea", name: area.county },
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getLocalArea(slug);
  if (!area) notFound();

  return (
    <>
      <LocalBusinessJsonLd slug={slug} />
      <LocalLandingPage area={area} />
    </>
  );
}
