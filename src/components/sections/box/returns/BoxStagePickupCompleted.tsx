"use client";

import Link from "next/link";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";

export default function BoxStagePickupCompleted() {
  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="flex flex-col items-center pt-[8.333vw] md:pt-[2.778vw]">

        {/* Item grid */}
        <div className="w-full">
          <BoxItemGrid compact mobileScrollable />
        </div>

        {/* CTAs */}
        <div className="mt-[8.333vw] md:mt-[2.778vw] flex flex-col items-center gap-[8.333vw] md:gap-[2.083vw]">
          <Link
            href="/box/my-box"
            className="flex items-center justify-center rounded-full font-semibold text-white h-[16.667vw] w-[55.556vw] text-[3.889vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
            style={{ backgroundColor: "#7A021D", letterSpacing: "-0.02em" }}
          >
            Build Your Next Box
          </Link>
          <Link
            href="/"
            className="font-semibold text-[#7A021D] leading-[1.2] underline decoration-solid text-center text-[3.889vw] md:text-[1.823vw] lg:text-[1.25vw]"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
