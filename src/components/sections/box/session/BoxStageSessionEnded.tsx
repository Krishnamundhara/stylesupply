"use client";

import { useRouter } from "next/navigation";
import { useBox } from "@/context/BoxContext";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";
import BoxProgressBar from "@/components/sections/box/BoxProgressBar";

const SESSION_STEPS = ["Session Start", "Session Complete"] as const;

export default function BoxStageSessionEnded({ onDecideNow }: { onDecideNow?: () => void }) {
  const { items } = useBox();
  const router = useRouter();

  return (
    <div className="w-full bg-[#7A021D] font-[var(--font-manrope)]">
      <div
        className="mx-auto w-full px-[2.78vw]"
        style={{ paddingTop: "0", paddingBottom: "0" }}
      >
        {/* Session tracker - complete */}
        <div className="w-full mb-[5.556vw] md:mb-[2.604vw] lg:mb-[1.389vw]">
          <BoxProgressBar
            steps={SESSION_STEPS}
            currentStep={1}
            accentColor="#FBF9F9"
            trackInactiveColor="#FBF9F9"
            labelColor="#FBF9F9"
            inactiveLabelColor="#FBF9F9"
          />
        </div>

        {/* Same item grid as boutique */}
        {items.length > 0 ? (
          <div className="md:-mx-[2.78vw]">
            <BoxItemGrid brandColor="#FBF9F9" nameColor="#FBF9F9" priceColor="#FBF9F9" />
          </div>
        ) : (
          <div className="h-[22.222vw] md:h-[10.417vw] lg:h-[8.333vw]" />
        )}

        {/* Bottom row */}
        <div className="hidden md:flex w-full items-center justify-between pt-[3.125vw] lg:pt-[2.778vw]">
          <p
            className="font-medium leading-[1.4] tracking-[-0.04em] text-[3.125vw] lg:text-[2.778vw]"
            style={{ color: "#FBF9F9", maxWidth: "60%" }}
          >
            Don&rsquo;t wait too long, every day counts
          </p>
          <button
            type="button"
            onClick={() => (onDecideNow ? onDecideNow() : router.push("/box/session?stage=shopIntention"))}
            className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[-0.02em] h-[7.813vw] w-[20.833vw] text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
            style={{
              border: "1.5px solid #FBF9F9",
              color: "#FBF9F9",
              backgroundColor: "#7A021D",
            }}
          >
            Decide now
          </button>
        </div>

        <div className="md:hidden flex flex-col gap-[5.56vw] pt-[8.33vw]">
          <p
            className="font-medium leading-[1.4] tracking-[-0.04em] text-center"
            style={{ color: "#FBF9F9", fontSize: "7.778vw" }}
          >
            Don&rsquo;t wait too long,
            <br />
            every day counts
          </p>
          <button
            type="button"
            onClick={() => (onDecideNow ? onDecideNow() : router.push("/box/session?stage=shopIntention"))}
            className="self-center inline-flex h-[16.667vw] w-[55.556vw] items-center justify-center rounded-full font-semibold tracking-[-0.04em] text-[3.889vw]"
            style={{
              border: "1.5px solid #FBF9F9",
              color: "#FBF9F9",
              backgroundColor: "#7A021D",
            }}
          >
            Decide now
          </button>
        </div>

        <div className="h-[27.778vw] md:h-[8.333vw]" />

      </div>
    </div>
  );
}
