"use client";

import BoxItemGrid from "@/components/sections/box/BoxItemGrid";

import BoxProgressBar from "@/components/sections/box/BoxProgressBar";

const SESSION_STEPS = ["Session Start", "24h Until Decision", "Session Complete"] as const;

export default function BoxStageBoutique({ onDecideNow }: { onDecideNow: () => void }) {
  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">

      {/* ── Session tracker ── */}
      <div className="w-full px-5 pb-5 md:px-[2.78vw] md:pb-5">
        <BoxProgressBar steps={SESSION_STEPS} currentStep={1} />
      </div>

      {/* ── Item grid ── */}
      <BoxItemGrid />

      {/* Bottom row */}
      <div className="w-full px-4 md:px-[2.78vw] pt-[8.33vw] md:pt-[2.22vw] pb-0 md:flex md:items-center md:justify-between">
        <p className="font-medium text-black tracking-[-0.04em] leading-[1.2] text-center md:text-left text-[9.444vw] md:text-[3.056vw]">
          <span className="md:hidden">
            Ready to make
            <br />
            a decision?
          </span>
          <span className="hidden md:inline">Ready to make a decision?</span>
        </p>

        <div className="mt-[8.33vw] md:mt-0 flex items-center justify-center md:justify-end gap-[2.778vw] md:gap-4">
          <button
            type="button"
            onClick={onDecideNow}
            className="inline-flex h-[16.667vw] w-[55.556vw] md:h-[7.813vw] md:w-[20.833vw] lg:h-[5.556vw] lg:w-[16.667vw] items-center justify-center rounded-full bg-[#7A021D] font-semibold text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] leading-[1.1] tracking-[-0.04em] text-white"
          >
            Decide Now
          </button>
        </div>
      </div>

      <div className="h-[27.778vw] md:h-[8.333vw]" />

    </div>
  );
}
