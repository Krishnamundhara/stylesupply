"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";

import BoxProgressBar from "@/components/sections/box/BoxProgressBar";

const ORDER_STEPS = ["Order Received", "Order Packed", "Order Dispatched", "Order Delivered"] as const;

export default function BoxStageDelivery() {
  const router = useRouter();

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">

      {/* ── Order progress tracker ── */}
      <div className="w-full px-[15px] pb-5 md:px-[2.78vw] md:pb-5">
        <BoxProgressBar steps={ORDER_STEPS} currentStep={2} />
      </div>

      {/* ── Item grid ── */}
      <BoxItemGrid />

      {/* ── Desktop CTAs ── */}
      <div className="hidden md:flex w-full px-[2.78vw] pt-[2.22vw] pb-0 items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.02em] bg-white border border-[#7A021D] text-[#7A021D] h-[7.813vw] w-[20.833vw] text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
          style={{ minWidth: "13.889vw" }}
        >
          Back to Home
        </Link>
        <div className="flex items-center gap-[1.389vw]">
          {/* DEV only — simulates box arriving */}
          <button
            onClick={() => router.push("/box/delivery?stage=arrived")}
            className="text-[0.972vw] font-medium text-[#999] underline underline-offset-2 hover:text-[#7A021D] transition-colors"
          >
            [Dev] Mark Arrived
          </button>
          <Link
            href="/accounts/help"
            className="inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.02em] bg-[#7A021D] text-white h-[7.813vw] w-[20.833vw] text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
            style={{ minWidth: "13.889vw" }}
          >
            Get Help
          </Link>
        </div>
      </div>

      {/* ── Mobile CTAs ── */}
      <div className="md:hidden w-full px-4 pt-[11.111vw] pb-0 flex flex-col items-center gap-[4.444vw]">
        <div className="flex flex-row items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex h-[16.667vw] w-[38.889vw] shrink-0 items-center justify-center rounded-full border border-[#7A021D] bg-white font-semibold text-[3.889vw] leading-[1.1] tracking-[-0.04em] text-[#7A021D]"
          >
            Back to Home
          </Link>
          <Link
            href="/accounts/help"
            className="inline-flex h-[16.667vw] w-[38.889vw] shrink-0 items-center justify-center rounded-full bg-[#7A021D] font-semibold text-[3.889vw] leading-[1.1] tracking-[-0.04em] text-white"
          >
            Get Help
          </Link>
        </div>
        {/* DEV only — simulates box arriving */}
        <button
          onClick={() => router.push("/box/delivery?stage=arrived")}
          className="text-[3.333vw] font-medium text-[#999] underline underline-offset-2"
        >
          [Dev] Mark Arrived
        </button>
      </div>

    </div>
  );
}
