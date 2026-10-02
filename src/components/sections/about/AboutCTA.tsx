"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AboutCTA() {
  const { isAuthenticated } = useAuth();
  const ctaLabel = isAuthenticated ? "Explore" : "Request Access";
  const ctaHref = isAuthenticated ? "/products" : "/request-access";

  return (
    <section className="w-full bg-white font-[var(--font-manrope)] text-black">
      {/* MOBILE */}
      <div className="flex justify-center px-5 pt-0 md:hidden">
        <div className="mx-auto flex w-full max-w-[320px] flex-col items-center justify-center gap-[30px] text-center sm:max-w-[400px] sm:gap-8">
          <p
            className="w-full text-center font-[var(--font-manrope)] font-normal leading-[1.1] tracking-[-0.04em] text-black"
            style={{ fontSize: "9.444vw" }}
          >
            <span className="whitespace-nowrap">You&apos;re allowed to</span>
            <br />
            change.
            <br />
            <span className="whitespace-nowrap">Your wardrobe</span>
            <br />
            <span className="whitespace-nowrap">should too.</span>
          </p>
          <Link
            href={ctaHref}
            className="inline-flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium leading-[1.1] tracking-[-0.04em] text-white"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* DESKTOP */}
      <div
        className="hidden w-full flex-col items-center md:flex"
        style={{ gap: "3.472vw" }}
      >
        <p
          className="text-center font-normal text-black text-[5.859vw] lg:text-[5.139vw] leading-[1.2] tracking-[-0.04em] whitespace-nowrap font-[var(--font-manrope)]"
        >
          You&apos;re allowed to change.
          <br />
          Your wardrobe should too.
        </p>
        <Link
          href={ctaHref}
          className="inline-flex h-[7.813vw] w-[20.833vw] lg:h-[5.556vw] lg:w-[13.889vw] items-center justify-center rounded-full bg-[#7A021D] text-[1.823vw] lg:text-[1.389vw] font-medium tracking-[-0.04em] text-white"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
