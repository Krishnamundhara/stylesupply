"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const animate = (delayMs: number): CSSProperties => ({
  opacity: 0,
  animation: `fade-in-up 0.9s ease-out ${delayMs}ms forwards`,
});

export default function RequestAccessConfirmation() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-4 py-16 min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh]">
      {/* Ornamental emblem — animates in first */}
      <Image
        src="/logo/ss_red_logo.svg"
        alt="StyleSupply"
        width={260}
        height={312}
        className="w-[120px] h-[145px] sm:w-[172px] sm:h-[207px] lg:w-[220px] lg:h-[264px] shrink-0 object-contain"
        style={animate(0)}
      />

      {/* Final state title */}
      <h1
        className="mt-6 sm:mt-8 lg:mt-10 font-[var(--font-manrope)] font-normal text-[13.333vw] md:text-[7.813vw] lg:text-[6.667vw] leading-[1.2] tracking-[-0.04em] text-black text-center whitespace-nowrap"
        style={animate(0)}
      >
        You&rsquo;re on the list
      </h1>

      {/* Subtitle */}
      <p
        className="mt-3 sm:mt-4 lg:mt-6 font-[var(--font-manrope)] font-medium text-[3.889vw] md:text-[2.083vw] lg:text-[1.528vw] leading-[1.2] tracking-[-0.04em] text-[#000000] text-center max-w-[181px] sm:max-w-[260px] lg:max-w-[340px]"
        style={animate(0)}
      >
        We&rsquo;ll let you know when you&rsquo;re ready to shop.
      </p>

      {/* CTA — 192×60 mobile, larger on desktop */}
      <Link
        href="/"
        className="mt-6 sm:mt-8 lg:mt-10 inline-flex items-center justify-center font-[var(--font-manrope)] font-bold text-[3.889vw] lg:text-[1.389vw] text-white text-center tracking-[-0.04em] leading-[1.1] bg-[#7A021D] active:scale-[0.98] transition-all duration-200 h-[16.667vw] w-[55.556vw] lg:h-[5.556vw] lg:w-[16.667vw] rounded-full whitespace-nowrap"
        style={animate(0)}
      >
        Return to Homepage
      </Link>
    </section>
  );
}
