"use client";

import { useEffect } from "react";
import { TestHeader } from "@/components/TestHeader";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const floatingHeader = document.querySelector<HTMLElement>(
      'header[role="banner"]:not([data-test-header])',
    );
    if (floatingHeader) floatingHeader.style.display = "none";
    return () => {
      if (floatingHeader) floatingHeader.style.display = "";
    };
  }, []);

  return (
    <>
      <TestHeader />
      {children}
    </>
  );
}
