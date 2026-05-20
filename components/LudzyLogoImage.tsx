"use client";

import Image from "next/image";
import { useState } from "react";
import { LudzyWordmark } from "./LudzyWordmark";

/** Place PNG export at `public/images/ludzy-logo.png`. Falls back to stroke SVG until the file exists. */
const LOGO_PATH = "/images/ludzy-logo.png";

export function LudzyLogoImage({ className = "" }: { className?: string }) {
  const [rasterBroken, setRasterBroken] = useState(false);

  if (rasterBroken) {
    return (
      <div className={`flex h-9 w-[132px] shrink-0 items-center sm:h-10 sm:w-[152px] md:h-11 md:w-[174px] ${className}`}>
        <LudzyWordmark className="h-[38px] w-full md:h-[42px]" />
      </div>
    );
  }

  return (
    <div
      className={`relative isolate h-9 w-[130px] shrink-0 sm:h-10 sm:w-[150px] md:h-11 md:w-[172px] ${className}`}
    >
      <Image
        src={LOGO_PATH}
        alt="LUDZY"
        fill
        className="object-contain object-left contrast-[1.02]"
        sizes="172px"
        priority
        onError={() => setRasterBroken(true)}
      />
    </div>
  );
}
