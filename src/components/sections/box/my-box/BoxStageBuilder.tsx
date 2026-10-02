"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorStateCtaButton from "@/components/ui/ErrorStateCtaButton";
import { useBox, type BoxItemDisplay } from "@/context/BoxContext";

/**
 * BuildYourBoxSteps — 3 states:
 *   empty:   0 items → all 5 red empty slots
 *   partial: 1–4 items → filled slots + remaining red empty slots
 *   full:    5 items → all 5 filled slots, Proceed enabled
 */

const TOTAL_SLOTS = 5;
const MEMBERSHIP_CREDIT = 5000;

function formatPrice(minor: number, currency = "INR") {
  const rupees = Math.round(minor / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/* ── Filled slot (desktop) ── */
function FilledSlotDesktop({ item, onRemove }: { item: BoxItemDisplay; onRemove: () => void }) {
  return (
    <div className="w-[18.75vw] shrink-0 flex flex-col">
      {/* Image area: explicit vw frame */}
      <div className="relative w-[18.75vw] h-[20.833vw] bg-white overflow-hidden">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes="(max-width:1440px) 18.4vw, 265px"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name}`}
          className="absolute top-[1.389vw] right-[1.389vw] flex items-center justify-center size-[1.25vw] transition-opacity hover:opacity-70"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="1" y1="1" x2="17" y2="17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="1" x2="1" y2="17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Text below image */}
      <div className="pt-[1.042vw] flex flex-col">
        <p className="font-medium uppercase text-[#4e4e4e] text-[0.972vw] tracking-[-0.02em] leading-[1.2]">
          {item.brand || "error"}
        </p>
        <p className="mt-[0.694vw] font-semibold capitalize text-black text-[1.389vw] tracking-[-0.04em] leading-[1.2] truncate max-w-[70%]">
          {item.name || "error"}
        </p>
        <p className="mt-[0.694vw] font-medium text-black text-[1.111vw] tracking-[-0.02em] leading-[1.2]">
          {item.size ? `Size: ${item.size}` : "error"}
        </p>
        <p className="mt-[0.694vw] font-medium text-black text-[1.111vw] tracking-[-0.02em] leading-[1.2]">
          {item.retailPrice ? `MRP ${formatPrice(item.retailPrice, item.currency)}` : "error"}
        </p>
      </div>
    </div>
  );
}

/* ── Empty slot (desktop) ── */
function EmptySlotDesktop() {
  return (
    <Link
      href="/products"
      className="w-[18.75vw] h-[20.833vw] shrink-0 bg-[#7A021D] border border-black flex flex-col items-center justify-center gap-[1.389vw]"
    >
      <span className="text-white font-normal leading-[1.2] tracking-[-0.04em] text-[3.375vw]">
        +
      </span>
      <span className="text-white font-medium leading-[1.4] tracking-[-0.02em] text-center px-[0.833vw] text-[1.056vw] max-w-[12.65vw]">
        Add items to complete your box
      </span>
    </Link>
  );
}

/* ── Filled slot (mobile) ── */
function FilledSlotMobile({ item, onRemove }: { item: BoxItemDisplay; onRemove: () => void }) {
  return (
    <div className="shrink-0 flex flex-col" style={{ width: "clamp(265px, 73.611vw, 38vw)" }}>
      <div className="relative bg-white overflow-hidden" style={{ width: "clamp(265px, 73.611vw, 38vw)", height: "clamp(319px, 87.5vw, 45vw)" }}>
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes="73.611vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name}`}
          className="absolute top-[4.444vw] md:top-[2.083vw] right-[4.444vw] md:right-[2.083vw] flex items-center justify-center size-[5vw] md:size-[2.344vw] transition-opacity hover:opacity-70"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="1" y1="1" x2="17" y2="17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="1" x2="1" y2="17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="w-full pt-[10px] md:pt-[1.953vw] flex flex-col">
        <p className="font-medium uppercase text-[#4e4e4e] text-[2.778vw] md:text-[1.823vw] lg:text-[0.972vw] tracking-[-0.02em] leading-[1.2]">
          {item.brand || "error"}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] font-semibold capitalize text-black text-[3.889vw] md:text-[2.344vw] lg:text-[1.389vw] tracking-[-0.04em] leading-[1.2] truncate max-w-[70%]">
          {item.name || "error"}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] font-medium text-black text-[3.333vw] md:text-[2.083vw] lg:text-[1.111vw] tracking-[-0.02em] leading-[1.2]">
          {item.size ? `Size: ${item.size}` : "error"}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] font-medium text-black text-[3.333vw] md:text-[2.083vw] lg:text-[1.111vw] tracking-[-0.02em] leading-[1.2]">
          {item.retailPrice ? `MRP ${formatPrice(item.retailPrice, item.currency)}` : "error"}
        </p>
      </div>
    </div>
  );
}

/* ── Empty slot (mobile) ── */
function EmptySlotMobile() {
  return (
    <Link
      href="/products"
      className="shrink-0 bg-[#7A021D] border border-black flex flex-col items-center justify-center gap-[31px]"
      style={{ width: "clamp(265px, 73.611vw, 38vw)", height: "clamp(319px, 87.5vw, 45vw)" }}
    >
      <span className="text-white font-normal leading-[1.2] tracking-[-0.04em] text-[14.3vw] md:text-[6vw]">
        +
      </span>
      <span className="text-white font-medium leading-[1.4] tracking-[-0.02em] text-center text-[4.47vw] md:text-[2.604vw] px-6">
        Add items to complete your box
      </span>
    </Link>
  );
}

/** Stage 1 of the box flow: user curates up to 5 items before proceeding. */
export default function BoxStageBuilder() {
  const { items, removeItem, isLoading, error } = useBox();
  const router = useRouter();

  const totalRetailMinor = items.reduce((sum, i) => sum + i.retailPrice, 0);
  const totalRetailDisplay = formatPrice(totalRetailMinor);
  const membershipCreditDisplay = `₹${MEMBERSHIP_CREDIT.toLocaleString("en-IN")}`;
  const isFull = items.length >= TOTAL_SLOTS;
  const emptyCount = Math.max(0, TOTAL_SLOTS - items.length);

  if (isLoading) {
    return (
      <div className="w-full bg-white font-[var(--font-manrope)] py-8">
        <div className="flex justify-center items-center h-[20.833vw]">
          <p className="text-gray-500">Loading your box...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white font-[var(--font-manrope)] py-8">
        <div className="flex flex-col justify-center items-center h-[20.833vw] gap-4">
          <p className="text-red-600">{error}</p>
          <ErrorStateCtaButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">

      {/* ── Desktop slots ── */}
      <div className="hidden lg:flex gap-[5px] w-full px-[2.78vw] pb-0 items-start" style={{ minHeight: "20.833vw" }}>
        {items.map((item) => (
          <FilledSlotDesktop
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
          />
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <EmptySlotDesktop key={`empty-${i}`} />
        ))}
      </div>

      {/* ── Mobile + Tablet slots ── */}
      <div className="lg:hidden w-full overflow-x-auto pb-0" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-[5px] px-[4.167vw] md:px-[1.953vw]" style={{ width: "max-content" }}>
          {items.map((item) => (
            <FilledSlotMobile
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
            />
          ))}
          {Array.from({ length: emptyCount }).map((_, i) => (
            <EmptySlotMobile key={`empty-mobile-${i}`} />
          ))}
        </div>
      </div>

      {/* ── Desktop bottom bar ── */}
      <div className="hidden lg:flex w-full px-[2.78vw] pt-[2.22vw] pb-0 items-center justify-between">
        <div className="flex flex-col gap-[1.389vw]">
          <div className="flex items-center justify-between w-[32vw] lg:w-[18.33vw]">
            <span className="font-medium text-black whitespace-nowrap text-[2.083vw] lg:text-[1.25vw]">Total Retail Value</span>
            <span className="font-semibold text-black tracking-[-0.02em] text-[2.083vw] lg:text-[1.25vw]">{totalRetailDisplay}</span>
          </div>
          <div className="flex items-center justify-between w-[32vw] lg:w-[18.33vw]">
            <span className="font-medium text-[#7A021D] whitespace-nowrap text-[2.083vw] lg:text-[1.25vw]">Membership Credit</span>
            <span className="font-semibold text-[#7A021D] tracking-[-0.02em] text-[2.083vw] lg:text-[1.25vw]">{membershipCreditDisplay}</span>
          </div>
        </div>
        <button
          disabled={!isFull}
          onClick={() => router.push("/box/confirm")}
          className={`inline-flex h-[7.813vw] w-[20.833vw] md:h-[7.813vw] md:w-[20.833vw] lg:h-[5.556vw] lg:w-[16.667vw] items-center justify-center rounded-full font-semibold text-[1.823vw] lg:text-[1.389vw] tracking-[-0.02em] transition-colors ${
            isFull
              ? "bg-[#7A021D] text-white cursor-pointer"
              : "bg-[#BFBFBF] text-white cursor-not-allowed"
          }`}
        >
          Proceed
        </button>
      </div>

      {/* ── Mobile + Tablet bottom bar ── */}
      <div className="lg:hidden w-full px-[4.167vw] md:px-[1.953vw] pt-[8.33vw] pb-0 flex flex-col gap-[8.333vw]">
        <div className="flex flex-col gap-[5.556vw]">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-black text-[4.167vw] md:text-[2.604vw] leading-[1.1] whitespace-nowrap">Total Retail Value</span>
            <span className="font-medium text-black text-[4.167vw] md:text-[2.604vw] leading-[1.1] tracking-[-0.02em] whitespace-nowrap">{totalRetailDisplay}</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-[#7A021D] text-[4.167vw] md:text-[2.604vw] leading-[1.1] whitespace-nowrap">Membership Credit</span>
            <span className="font-medium text-[#7A021D] text-[4.167vw] md:text-[2.604vw] leading-[1.1] tracking-[-0.02em] whitespace-nowrap">{membershipCreditDisplay}</span>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <button
            disabled={!isFull}
            onClick={() => router.push("/box/confirm")}
            className={`inline-flex h-[16.667vw] w-[55.556vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[2.344vw] items-center justify-center rounded-full font-semibold text-[3.889vw] leading-[1.1] tracking-[-0.64px] transition-colors ${
              isFull
                ? "bg-[#7A021D] text-white cursor-pointer"
                : "bg-[#BFBFBF] text-[#F7F4EF] cursor-not-allowed"
            }`}
          >
            Proceed
          </button>
        </div>
      </div>

    </div>
  );
}
