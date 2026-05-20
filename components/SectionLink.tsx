"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll-to-section";

type SectionLinkProps = {
  sectionId: string;
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionLink({ sectionId, href, className, children }: SectionLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (pathname !== "/") return;
        e.preventDefault();
        window.setTimeout(() => {
          scrollToSection(sectionId);
          window.history.replaceState(null, "", href);
        }, 50);
      }}
    >
      {children}
    </Link>
  );
}
