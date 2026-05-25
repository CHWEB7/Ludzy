"use client";

import { useEffect } from "react";
import Script from "next/script";
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
      <Script id="convora-widget-config" strategy="lazyOnload">
        {`window.ConvoraWidget={"phone":"447592262525","brand":"Ludzy","color":"#ffffff","size":"small","buttonText":"Chat with us","shape":"square","message":"Hey! 👋 Got a question about booking or availability? Drop us a message.","prefill":"","brandImage":"https://www.ludzy.online/images/ludzy-logo.png","autoOpen":3,"headerGradient":"linear-gradient(135deg, #374151 0%, #111827 100%)"};`}
      </Script>
      <Script
        src="https://convora.io/api/widget/loader.js"
        strategy="lazyOnload"
      />
    </>
  );
}
