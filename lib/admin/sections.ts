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
    description: "Manage past recaps and upcoming diary dates on the public events page.",
    href: "/admin/events",
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
