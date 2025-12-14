"use client";

import Image from "next/image";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/backgroundStockholm-2.png"
        alt="City with restaurant location pins"
        fill
        className="object-cover"
        priority
        quality={100}
        unoptimized
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-50/70 via-cream-50/60 to-orange-100/70" />
    </div>
  );
}
