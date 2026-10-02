"use client";

import { useState } from "react";
import Image from "next/image";
import { useBox, type BoxItemDisplay } from "@/context/BoxContext";

const ACCENT = "#7A021D";
const TEXT_PRIMARY = "#2C0505";

const RETURN_REASONS = [
  "Didn't fit",
  "Not my size",
  "Damaged item",
  "Not my style",
  "Poor quality",
  "Other",
] as const;

type ReturnReason = (typeof RETURN_REASONS)[number];

interface ItemFeedback {
  reasons: ReturnReason[];
  comment: string;
}

function ProgressDots({ current, total, onSelect }: { current: number; total: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex w-[55.556vw] md:w-[14.583vw] lg:w-[10.417vw] items-center gap-[6px]">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className="h-[1.667vw] md:h-[0.781vw] lg:h-[0.417vw] flex-1 rounded-none cursor-pointer"
          style={{ backgroundColor: ACCENT, opacity: i === current ? 1 : 0.2 }}
        />
      ))}
    </div>
  );
}

function ItemCard({ item }: { item: BoxItemDisplay }) {
  return (
    <div className="flex flex-col md:w-[26.042vw] lg:w-[18.056vw]">
      {/* image */}
      <div className="relative overflow-hidden bg-[#F7F4EF] w-full h-[40.278vw] md:w-[26.042vw] md:h-[36.458vw] lg:w-[18.056vw] lg:h-[26.667vw]">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes="(max-width:768px) 50vw, 18vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
      </div>
      {/* label */}
      <div className="mt-[5.556vw] md:mt-[1.389vw] flex flex-col items-center gap-[2.778vw] md:gap-[0.911vw] lg:gap-[0.694vw]">
        <p
          className="font-medium uppercase leading-none text-[#4e4e4e] text-center text-[2.778vw] md:text-[1.823vw] lg:text-[0.972vw]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {item.brand || "error"}
        </p>
        <p
          className="font-semibold capitalize leading-[1.15] break-words text-center text-[3.889vw] md:text-[2.344vw] lg:text-[1.25vw] text-black"
          style={{ letterSpacing: "-0.04em" }}
        >
          {item.name}
        </p>
      </div>
    </div>
  );
}

export default function BoxStageReturnFeedback({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { items } = useBox();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState<ItemFeedback[]>(
    items.map(() => ({ reasons: [], comment: "" }))
  );

  const current = feedbacks[currentIndex] ?? { reasons: [], comment: "" };
  const item = items[currentIndex];
  const isLastStage = currentIndex === items.length - 1;

  function toggleReason(reason: ReturnReason) {
    setFeedbacks((prev) =>
      prev.map((f, i) => {
        if (i !== currentIndex) return f;
        const exists = f.reasons.includes(reason);
        return {
          ...f,
          reasons: exists ? f.reasons.filter((r) => r !== reason) : [...f.reasons, reason],
        };
      })
    );
  }

  function setComment(comment: string) {
    setFeedbacks((prev) =>
      prev.map((f, i) => (i === currentIndex ? { ...f, comment } : f))
    );
  }

  function handleContinue() {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }

  if (!item) return null;

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="mx-auto w-full px-[5.556vw] md:px-[2.604vw] lg:px-[1.389vw] pb-0">

        {/* Returning count + dots — mobile: shown in hero, desktop: shown here */}
        <div className="mt-[6.944vw] md:mt-[2.083vw]">
          <p
            className="text-center font-semibold text-black md:font-medium text-[4.444vw] md:text-[2.083vw] lg:text-[1.389vw]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Returning {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
          <div className="mt-[6.944vw] md:mt-[2.083vw] flex justify-center">
            <ProgressDots current={currentIndex} total={items.length} onSelect={setCurrentIndex} />
          </div>
        </div>

        {/* ── MOBILE layout: stacked ── */}
        <div className="md:hidden mt-[6.667vw] flex flex-col items-center">
          {/* Item image — centered, ~35vw wide */}
          <div className="w-[35vw]">
            <ItemCard item={item} />
          </div>

          {/* "Why" label */}
          <p
            className="mt-[5.556vw] text-center font-medium text-black"
            style={{ fontSize: "5.556vw", letterSpacing: "-0.02em" }}
          >
            Why are you returning this item?
          </p>

          {/* Reason chips — 2-column grid */}
          <div className="mt-[4.444vw] grid w-max grid-cols-2 justify-items-center gap-x-[1.944vw] gap-y-[1.389vw]">
            {RETURN_REASONS.map((reason) => {
              const selected = current.reasons.includes(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => toggleReason(reason)}
                  className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border font-semibold text-[3.889vw] transition-colors"
                  style={{
                    borderColor: ACCENT,
                    backgroundColor: selected ? ACCENT : "white",
                    color: selected ? "white" : ACCENT,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {reason}
                </button>
              );
            })}
          </div>

          {/* Comment */}
          <div className="mt-[8.333vw] w-full flex flex-col items-center gap-[8.333vw]">
            <p
              className="text-center font-medium text-black"
              style={{ fontSize: "5.556vw", letterSpacing: "-0.02em" }}
            >
              Share comments if you&rsquo;d like
            </p>
            <div className="w-full border-b-2" style={{ borderColor: ACCENT }}>
              <textarea
                rows={1}
                value={current.comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="I didn't like this because..."
                className="w-full resize-none bg-transparent py-[2px] font-medium leading-[1.4] text-black outline-none placeholder:text-[#a0a0a0] text-[4.167vw]"
                style={{ letterSpacing: "-0.02em" }}
              />
            </div>
          </div>

          {/* Continue button */}
          <div className="mt-[11.111vw] flex justify-center">
            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center justify-center rounded-full border font-medium transition-opacity"
              style={{
                borderColor: ACCENT,
                backgroundColor: isLastStage ? ACCENT : "white",
                color: isLastStage ? "white" : ACCENT,
                height: "16.667vw",
                width: "55.556vw",
                fontSize: "3.889vw",
                letterSpacing: "-0.04em",
              }}
            >
              {isLastStage ? "Finish" : "Continue"}
            </button>
          </div>
        </div>

        {/* ── TABLET layout: single col ── */}
        <div className="hidden md:flex lg:hidden mt-[7.813vw] flex-col items-center gap-[3.906vw]">
          <ItemCard item={item} />
          <p className="font-medium text-black text-[2.083vw]" style={{ letterSpacing: "-0.02em" }}>
            Why are you returning this item?
          </p>
          <div className="grid grid-cols-2 gap-x-[1.302vw] gap-y-[1.302vw]">
            {RETURN_REASONS.map((reason) => {
              const selected = current.reasons.includes(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => toggleReason(reason)}
                  className="flex h-[7.813vw] w-[26.042vw] items-center justify-center rounded-full border font-semibold text-[1.823vw] transition-colors"
                  style={{ borderColor: ACCENT, backgroundColor: selected ? ACCENT : "white", color: selected ? "white" : ACCENT, letterSpacing: "-0.02em" }}
                >
                  {reason}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-[10px] w-[53.386vw]">
            <p className="font-medium text-black text-[2.083vw]" style={{ letterSpacing: "-0.02em" }}>
              Share comments if you&rsquo;d like
            </p>
            <div className="border-b-2 w-full" style={{ borderColor: ACCENT }}>
              <textarea
                rows={2}
                value={current.comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="I didn't like this because..."
                className="w-full resize-none bg-transparent font-medium leading-[1.1] text-black outline-none placeholder:text-[#a0a0a0] text-[1.563vw]"
                style={{ letterSpacing: "-0.02em" }}
              />
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout: image left, feedback right ── */}
        <div className="hidden lg:flex mt-[2.083vw] items-stretch justify-center gap-[3.472vw]">
          <ItemCard item={item} />

          <div className="flex flex-col justify-between">
            <p
              className="font-medium text-black lg:text-[1.389vw]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Why are you returning this item?
            </p>

            <div className="mt-[1.389vw] grid w-[28.125vw] grid-cols-2 gap-x-[0.347vw] gap-y-[0.694vw]">
              {RETURN_REASONS.map((reason) => {
                const selected = current.reasons.includes(reason);
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => toggleReason(reason)}
                    className="flex h-[22.222vw] w-[55.556vw] items-center justify-center rounded-full border font-semibold text-[4.167vw] transition-colors md:h-[7.813vw] md:w-[15.625vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-full lg:text-[1.389vw]"
                    style={{
                      borderColor: ACCENT,
                      backgroundColor: selected ? ACCENT : "white",
                      color: selected ? "white" : ACCENT,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>

            <div className="mt-[1.944vw] flex flex-col gap-[0.694vw]">
              <p
                className="font-medium text-black text-[1.25vw]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Share comments if you&rsquo;d like
              </p>
              <div
                className="border-b-2 w-[24vw]"
                style={{ borderColor: ACCENT }}
              >
                <textarea
                  rows={2}
                  value={current.comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="I didn't like this because..."
                  className="w-full resize-none bg-transparent font-medium leading-[1.1] text-black outline-none placeholder:text-[#a0a0a0] text-[1.111vw]"
                  style={{ letterSpacing: "-0.02em" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tablet continue button */}
        <div className="hidden md:flex lg:hidden mt-[3.906vw] justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center justify-center rounded-full border font-semibold h-[7.813vw] w-[26.042vw] text-[1.823vw]"
            style={{ borderColor: ACCENT, backgroundColor: isLastStage ? ACCENT : "white", color: isLastStage ? "white" : ACCENT, letterSpacing: "-0.04em" }}
          >
            {isLastStage ? "Finish" : "Continue"}
          </button>
        </div>

        {/* Desktop continue button */}
        <div className="hidden lg:flex mt-[5.556vw] justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center justify-center rounded-full border font-semibold md:h-[7.813vw] md:w-[18.229vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
            style={{
              borderColor: ACCENT,
              backgroundColor: isLastStage ? ACCENT : "white",
              color: isLastStage ? "white" : ACCENT,
              letterSpacing: "-0.04em",
            }}
          >
            {isLastStage ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
