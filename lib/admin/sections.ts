export type AdminSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  available: boolean;
};

export const adminSections: AdminSection[] = [
  {
    id: "events",
    title: "Events",
    description: "Manage past recaps and upcoming diary dates.",
    href: "/admin/events",
    available: true,
  },
  {
    id: "blog",
    title: "Blog",
    description: "Write and publish blog posts with genre tags.",
    href: "/admin/blog",
    available: true,
  },
  {
    id: "faq",
    title: "FAQs",
    description: "Manage frequently asked questions on the FAQ page.",
    href: "/admin/faq",
    available: true,
  },
  {
    id: "site-content",
    title: "Site content",
    description: "Homepage copy, services, and other page content.",
    href: "#",
    available: false,
  },
  {
    id: "enquiries",
    title: "Enquiries",
    description: "Review booking form submissions.",
    href: "#",
    available: false,
  },
];
