"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

export interface CollectionProduct {
  id: string;
  brand: string;
  name: string;
  retailPrice: string;
  rentPrice: string;
  image: string;
  href?: string;
}

export interface HeroBadge {
  logo: string;
  bg?: string; // e.g. "white" | "black" | "#hex"
}

export interface CollectionShowcaseProps {
  collectionName: string;
  description: string;
  heroImage: string;
  heroBadges?: HeroBadge[];
  products: CollectionProduct[];
  href?: string;
}

function HeartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function CollectionShowcase({
  collectionName,
  description,
  heroImage,
  heroBadges = [],
  products,
  href = "#",
}: CollectionShowcaseProps) {
  // Desktop: slide one card at a time, show 4
  const [desktopIndex, setDesktopIndex] = useState(0);
  const desktopVisible = 4;
  const desktopMax = Math.max(0, products.length - desktopVisible);

  // Mobile: scroll progress tracking
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0);
  const handleMobileScroll = useCallback(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setMobileScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);


  return (
    <div className="flex flex-col gap-[40px] md:gap-[60px] w-full">

      {/* ── Hero Banner ── */}
      <div className="relative w-full aspect-[360/521] md:aspect-auto md:h-[530px] rounded-[16px] md:rounded-[24px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={collectionName}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Desktop gradient overlay */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(224deg, rgba(255,255,255,0) 44%, rgba(0,0,0,0.78) 90%)",
          }}
        />
        {/* Mobile gradient overlay */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* — Mobile layout — */}
        <div className="md:hidden absolute inset-0 flex flex-col items-center px-[5.6%] pt-[7.7%] pb-[5%]">
          {/* Title + Description — centered */}
          <div className="flex flex-col gap-[16px] items-center text-center w-full">
            <h2 className="font-[var(--font-manrope)] font-semibold text-white text-[44px] leading-[44px] tracking-[-0.88px]">
              {collectionName}
            </h2>
            <p className="font-[var(--font-manrope)] font-semibold text-white text-[12px] leading-normal tracking-[-0.48px] max-w-[208px]">
              {description}
            </p>
          </div>

          <div className="flex-1" />

          {/* Brand logo badges — centered */}
          {heroBadges.length > 0 && (
            <div className="flex flex-row gap-[15px] items-center justify-center mb-[14px]">
              {heroBadges.map((badge, i) => (
                <div
                  key={i}
                  className="size-[45px] rounded-[15px] overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ background: badge.bg ?? "white" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={badge.logo} alt="" className="w-full h-full object-contain p-[7px]" />
                </div>
              ))}
            </div>
          )}

          {/* Shop Now button — centered, full width minus padding */}
          <a
            href={href}
            className="flex items-center justify-center w-full bg-[#6b0b23] text-[#f8f8ff] font-[var(--font-manrope)] font-normal text-[14px] tracking-[-0.56px] rounded-[36px] h-[50px]"
          >
            Shop Now
          </a>
        </div>

        {/* — Desktop layout — */}
        <div className="hidden md:flex absolute left-[50px] top-[48px] flex-col gap-[24px] w-[298px]">
          <div className="flex flex-col gap-[24px]">
            <h2 className="font-[var(--font-manrope)] font-semibold text-white text-[5.859vw] lg:text-[64px] leading-none tracking-[-2.56px] whitespace-nowrap">
              {collectionName}
            </h2>
            <p className="font-[var(--font-manrope)] font-semibold text-white text-[2.344vw] lg:text-[18px] leading-normal tracking-[-0.72px]">
              {description}
            </p>
          </div>
          <div className="mt-[180px]">
            <a
              href={href}
              className="inline-flex items-center justify-center bg-[#6b0b23] text-[#f8f8ff] font-[var(--font-manrope)] font-semibold text-[16px] tracking-[-0.32px] rounded-[53px] h-[70px] w-[220px]"
            >
              Shop Collection
            </a>
          </div>
        </div>

        {/* Desktop badges — bottom right */}
        {heroBadges.length > 0 && (
          <div className="hidden md:flex absolute bottom-[28px] right-[28px] gap-[20px] items-center">
            {heroBadges.map((badge, i) => (
              <div
                key={i}
                className="size-[59px] rounded-[20px] overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ background: badge.bg ?? "white" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={badge.logo} alt="" className="w-full h-full object-contain p-[8px]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Collection title + product section ── */}
      <div className="flex flex-col items-center w-full gap-[20px] md:gap-[41px]">

        {/* Section title — mobile: 38.8px semibold, desktop: 84px medium */}
        <h3 className="font-[var(--font-manrope)] font-semibold md:font-medium text-[#6b0b23] text-[38px] md:text-[5.859vw] lg:text-[84px] leading-[48px] md:leading-normal tracking-[-2.33px] md:tracking-[-5.04px] text-center">
          {collectionName}
        </h3>

        {/* ── MOBILE: 2-row horizontal scroll carousel (no arrows) ── */}
        <div className="flex flex-col gap-[30px] items-center w-full md:hidden">

          {/* Horizontal scrollable 2-row grid */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="w-full overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex flex-row gap-[8px] w-max px-[2px]">
              {/* Group products into columns of 2 */}
              {Array.from({ length: Math.ceil(products.length / 2) }, (_, colIdx) => {
                const colProducts = products.slice(colIdx * 2, colIdx * 2 + 2);
                return (
                  <div key={colIdx} className="flex flex-col gap-[12px]">
                    {colProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={product.href ?? `/products/${product.id}`}
                        className="relative bg-[#f7f4ef] rounded-[9px] overflow-hidden flex-shrink-0 block w-[43.9vw] max-w-[158px] md:w-[158px] h-[230px]"
                      >
                        {/* Heart button */}
                        <button className="absolute top-[11px] right-[10px] z-10 flex items-center justify-center bg-white rounded-full size-[24px] text-gray-400 hover:text-[#7a021d] transition-colors">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                        {/* Product image */}
                        <div className="absolute left-[13px] top-[24px] right-[13px] bottom-[64px] overflow-hidden flex items-end justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image || "/image/image 1054.png"}
                            alt={product.name}
                            className="w-full h-full object-contain object-bottom"
                          />
                        </div>
                        {/* Text info — inside card at bottom */}
                        <div className="absolute left-[8px] right-[8px] flex flex-col gap-[8px]" style={{ top: "166px" }}>
                          <p className="font-[var(--font-manrope)] font-bold text-black text-[14px] leading-[1.1] tracking-[-0.42px]">
                            {product.brand}
                          </p>
                          <p className="font-[var(--font-manrope)] font-normal text-black text-[12px] leading-[1.1] tracking-[-0.24px] truncate">
                            {product.name}
                          </p>
                          <p className="font-[var(--font-manrope)] font-normal text-[#666] text-[12px] leading-[1.2] truncate">
                            Retail {product.retailPrice}{" "}
                            <span className="text-[#25080a]">| Rent for {product.rentPrice}</span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar + CTA */}
          <div className="flex flex-col gap-[30px] items-center w-full">
            <div className="relative w-full h-[4px] rounded-full bg-[#e0d9d4]">
              <div
                className="absolute top-0 h-full rounded-full bg-[#6b0b23] transition-all duration-150"
                style={{
                  width: "40%",
                  left: `${mobileScrollProgress * 60}%`,
                }}
              />
            </div>
            <a
              href={href}
              className="inline-flex items-center justify-center bg-[#6b0b23] text-white font-[var(--font-manrope)] font-medium text-[15px] tracking-[-0.5px] rounded-[40px] h-[60px] w-[180px]"
            >
              Shop Collection
            </a>
          </div>
        </div>

        {/* ── DESKTOP: horizontal carousel ── */}
        <div className="hidden md:flex flex-col gap-[30px] items-center w-full">

          {/* Arrow + Cards row — fixed 1360px wide matching Figma */}
          <div className="flex gap-[7px] items-center w-full max-w-[1360px]">
            {/* Prev arrow */}
            <button
              onClick={() => setDesktopIndex((i) => Math.max(0, i - 1))}
              disabled={desktopIndex === 0}
              className="flex-shrink-0 flex items-center justify-center bg-[#6b0b23] rounded-[40px] h-[44px] w-[45px] disabled:opacity-40 transition-opacity"
              aria-label="Previous"
            >
              <ArrowLeftIcon />
            </button>

            {/* Sliding cards viewport */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex gap-[12px] transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(calc(-${desktopIndex} * (300px + 12px)))`,
                }}
              >
                {products.map((product) => (
                  <Link key={product.id} href={product.href ?? `/products/${product.id}`} className="flex-shrink-0 w-[300px] block">
                    {/* Card */}
                    <div className="relative bg-[#f7f4ef] rounded-[27px] h-[435px] w-[300px] overflow-hidden">
                      {/* Wishlist button — top right */}
                      <button className="absolute top-[25px] right-[25px] z-10 flex items-center justify-center bg-white rounded-[40px] size-[50px] text-gray-400 hover:text-[#7a021d] transition-colors">
                        <HeartIcon />
                      </button>
                      {/* Product image — fills card with padding */}
                      <div className="absolute inset-0 flex items-end justify-center pt-[60px] px-[27px] pb-[30px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image || "/image/image 1054.png"}
                          alt={product.name}
                          className="w-full h-full object-contain object-bottom"
                        />
                      </div>
                    </div>

                    {/* Product info below card */}
                    <div className="mt-[18px]">
                      <p className="font-[var(--font-manrope)] font-bold text-black text-[24px] leading-[1.1] tracking-[-0.72px] w-[218px]">
                        {product.brand}
                      </p>
                      <p className="font-[var(--font-manrope)] font-normal text-black text-[16px] leading-[1.1] tracking-[-0.32px] mt-[10px]">
                        {product.name}
                      </p>
                      <p className="font-[var(--font-manrope)] font-normal text-[#666] text-[16px] leading-[1.1] tracking-[0.32px] mt-[10px]">
                        Retail {product.retailPrice}{" "}
                        <span className="text-[#25080a]">| Rent for {product.rentPrice}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Next arrow */}
            <button
              onClick={() => setDesktopIndex((i) => Math.min(desktopMax, i + 1))}
              disabled={desktopIndex === desktopMax}
              className="flex-shrink-0 flex items-center justify-center bg-[#6b0b23] rounded-[40px] h-[44px] w-[45px] disabled:opacity-40 transition-opacity"
              aria-label="Next"
            >
              <ArrowRightIcon />
            </button>
          </div>

          {/* Decorative lines + Shop Collection CTA */}
          <div className="flex flex-col items-center gap-[50px] w-full max-w-[887px]">
            {/* Scroll progress indicator */}
            {(() => {
              const thumbWidth = desktopVisible / Math.max(products.length, desktopVisible + 4);
              const thumbLeft = products.length > desktopVisible
                ? (desktopIndex / (products.length - desktopVisible)) * (1 - thumbWidth)
                : 0;
              return (
                <div className="relative w-full h-[4px] rounded-full bg-[#e0d9d4]">
                  <div
                    className="absolute top-0 h-[4px] rounded-full bg-[#6b0b23] transition-all duration-300"
                    style={{
                      left: `${thumbLeft * 100}%`,
                      width: `${thumbWidth * 100}%`,
                    }}
                  />
                </div>
              );
            })()}
            <a
              href={href}
              className="inline-flex items-center justify-center bg-[#6b0b23] text-white font-[var(--font-manrope)] font-semibold text-[18px] rounded-[40px] h-[70px] w-[220px]"
            >
              Shop Collection
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
