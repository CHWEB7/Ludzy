"use client";

import { useEffect } from "react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-test-header]");
    const convora = document.querySelector<HTMLElement>("#convora-widget-root");
    if (header) header.style.display = "none";
    if (convora) convora.style.display = "none";

    return () => {
      if (header) header.style.display = "";
      if (convora) convora.style.display = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}
