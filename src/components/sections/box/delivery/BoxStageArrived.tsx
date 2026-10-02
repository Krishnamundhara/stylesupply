"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";

import BoxProgressBar from "@/components/sections/box/BoxProgressBar";

const ORDER_STEPS = ["Order Received", "Order Packed", "Order Dispatched", "Order Delivered"] as const;

export default function BoxStageArrived() {
  const router = useRouter();

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      {/* Progress tracker */}
      <div className="w-full px-5 pb-5 md:px-[2.78vw] md:pb-5">
        <BoxProgressBar steps={ORDER_STEPS} currentStep={3} />
      </div>

      {/* Item grid */}
      <BoxItemGrid />

      {/* Delivered time + CTAs */}
      <div className="w-full px-4 md:px-[2.78vw] pt-[8.33vw] md:pt-[2.22vw] pb-0 md:flex md:items-center md:justify-between">
        <p className="font-medium text-[#000000] tracking-[-0.04em] leading-[1.2] text-center md:text-left text-[7.778vw] md:text-[3.056vw]">
          Box delivered on
          <br className="md:hidden" />
          {" "}May 26, 2:30pm
        </p>

        <div className="mt-[8.33vw] md:mt-0 flex items-center justify-center md:justify-end gap-[2.778vw] md:gap-[0.694vw]">
          <Link
            href="/help"
            className="inline-flex h-[16.667vw] w-[38.889vw] md:h-[7.813vw] md:w-[20.833vw] lg:h-[5.556vw] lg:w-[13.889vw] items-center justify-center rounded-full border border-[#7A021D] bg-white font-semibold text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] leading-[1.1] tracking-[-0.04em] text-[#7A021D]"
          >
            Get Help
          </Link>
          <button
            onClick={() => router.push("/box/session")}
            className="inline-flex h-[16.667vw] w-[38.889vw] md:h-[7.813vw] md:w-[20.833vw] lg:h-[5.556vw] lg:w-[13.889vw] items-center justify-center rounded-full bg-[#7A021D] font-semibold text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] leading-[1.1] tracking-[-0.04em] text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
