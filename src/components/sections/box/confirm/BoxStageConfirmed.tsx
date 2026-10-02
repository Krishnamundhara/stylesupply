"use client";

import Link from "next/link";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";

export default function BoxStageConfirmed({ onCompleteSession }: { onCompleteSession: () => void }) {
  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="flex flex-col items-center pt-[11.111vw] md:pt-[3.472vw]">

        {/* Heading */}
        <div className="flex flex-col items-center text-center px-[5.556vw] md:px-[2.604vw] lg:px-[1.389vw]">
          <h1 className="font-normal leading-[1.2] text-black tracking-[-0.04em] text-[11.111vw] md:text-[5.139vw]">
            Your box is confirmed.
          </h1>
          <p className="mt-[5.556vw] md:mt-[2.604vw] lg:mt-[1.389vw] font-medium text-black tracking-[-0.02em] leading-[1.2] text-[4.167vw] md:text-[1.823vw] lg:text-[1.389vw]">
            We&apos;ll have it at your door within 24 hours.
          </p>
        </div>

        {/* Item grid */}
        <div className="mt-[5.556vw] md:mt-[2.604vw] lg:mt-[1.389vw] w-full">
          <BoxItemGrid compact mobileScrollable />
        </div>

        {/* CTAs */}
        <div className="mt-[11.111vw] md:mt-[2.778vw] flex flex-col items-center gap-[5.556vw] md:gap-[1.389vw]">
          <button
            type="button"
            onClick={onCompleteSession}
            className="flex items-center justify-center rounded-full font-semibold text-white h-[16.667vw] w-[55.556vw] text-[3.889vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
            style={{
              backgroundColor: "#7A021D",
              letterSpacing: "-0.4px",
            }}
          >
            Track My Box
          </button>

          <Link
            href="/"
            className="font-semibold text-[#7A021D] text-[3.889vw] md:text-[1.823vw] lg:text-[0.972vw] leading-[1.2] underline decoration-solid text-center"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
