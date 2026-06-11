"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

function removeConvoraWidget() {
  document.querySelector<HTMLElement>("#convora-widget-root")?.remove();
  document
    .querySelectorAll<HTMLScriptElement>('script[src*="convora.io"]')
    .forEach((script) => script.remove());
  delete (window as Window & { ConvoraWidget?: unknown }).ConvoraWidget;
}

export function CrispChatWidget() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    removeConvoraWidget();
    const observer = new MutationObserver(removeConvoraWidget);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isAdmin]);

  if (isAdmin || !websiteId) return null;

  return (
    <Script id="crisp-chat" strategy="afterInteractive">
      {`window.$crisp=[];window.CRISP_WEBSITE_ID="${websiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
    </Script>
  );
}
