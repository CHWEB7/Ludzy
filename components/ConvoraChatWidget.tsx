"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function ConvoraChatWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Script id="convora-widget-config" strategy="lazyOnload">
        {`window.ConvoraWidget={"phone":"447592262525","brand":"Ludzy","color":"#6B7280","size":"small","buttonText":"Chat with us","shape":"square","message":"Hey! 👋 Got a question about booking or availability? Drop us a message.","prefill":"","brandImage":"https://www.ludzy.online/images/ludzy-logo.png","autoOpen":10,"headerGradient":"linear-gradient(135deg, #374151 0%, #111827 100%)"};`}
      </Script>
      <Script src="https://convora.io/api/widget/loader.js" strategy="lazyOnload" />
    </>
  );
}
