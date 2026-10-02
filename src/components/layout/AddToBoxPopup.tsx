"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AddToBoxPopupProps {
  brand: string;
  name: string;
  displayPrice: string;
  thumbnailUrl: string | null;
  onClose: () => void;
}

export default function AddToBoxPopup({
  brand,
  name,
  displayPrice,
  thumbnailUrl,
  onClose,
}: AddToBoxPopupProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const closeBtn = (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Close"
      className="absolute right-[35px] text-[#7A021D] flex items-center justify-center z-10"
      style={{ top: "calc(112px + 20px)" }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L17 17M17 1L1 17" stroke="#7A021D" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );

  const productImage = (isMobile: boolean) => (
    <div
      className="relative bg-white overflow-hidden shrink-0"
      style={isMobile
        ? { width: "61.111vw", height: "72.222vw", marginTop: "8.333vw" }
        : { width: "15.278vw", height: "18.056vw", marginTop: "2.778vw" }
      }
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={name}
          fill
          sizes={isMobile ? "61.111vw" : "15.278vw"}
          className="object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-[#F7F4EF]" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/60" onClick={handleClose} />

      {/* Desktop panel — right side, below header */}
      <div
        className="relative z-10 ml-auto hidden md:flex h-full w-[clamp(340px,37.292vw,537px)] flex-col overflow-hidden bg-[#F7F4EF]"
        style={{ paddingTop: "112px", animation: `${closing ? "slideOutRight" : "slideInRight"} 0.35s cubic-bezier(0.4,0,0.2,1) both` }}
      >
        {closeBtn}
        <div className="flex flex-1 flex-col items-center justify-center min-h-0 px-[40px] py-[30px]">
          <p
            className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] shrink-0"
            style={{ fontSize: "max(20px, 2.361vw)" }}
          >
            Selection added to<br />your Box
          </p>

          <div
            className="relative bg-white overflow-hidden shrink-1 min-h-0 w-[15.278vw]"
            style={{ aspectRatio: "15.278 / 18.056", marginTop: "clamp(10px, 2.778vw, 40px)", maxHeight: "32vh" }}
          >
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} alt={name} fill sizes="15.278vw" className="object-cover object-top" />
            ) : (
              <div className="absolute inset-0 bg-[#F7F4EF]" />
            )}
          </div>

          <p className="font-[var(--font-manrope)] font-medium text-[#4E4E4E] tracking-[-0.02em] uppercase shrink-0" style={{ marginTop: "clamp(6px, 1.389vw, 20px)", fontSize: "max(11px, 0.833vw)" }}>
            {brand}
          </p>
          <p className="font-[var(--font-manrope)] font-semibold text-black tracking-[-0.04em] capitalize shrink-0" style={{ marginTop: "clamp(4px, 0.694vw, 10px)", fontSize: "max(14px, 1.25vw)" }}>
            {name}
          </p>
          <p className="font-[var(--font-manrope)] font-medium text-black tracking-[-0.04em] shrink-0" style={{ marginTop: "clamp(4px, 0.694vw, 10px)", fontSize: "max(11px, 0.833vw)" }}>
            {displayPrice}
          </p>

          <Link
            href="/box/my-box"
            className="shrink-0 flex items-center justify-center rounded-full border-2 border-[#7A021D] font-[var(--font-manrope)] font-semibold text-[#7A021D] tracking-[-0.02em]"
            style={{ marginTop: "clamp(10px, 1.736vw, 25px)", width: "clamp(140px, 16.667vw, 240px)", height: "clamp(50px, 5.556vw, 80px)", fontSize: "max(13px, 1.389vw)" }}
          >
            Open My Box
          </Link>
        </div>
      </div>

      {/* Mobile panel — full width, full height */}
      <div className="relative z-10 flex md:hidden h-full w-full flex-col bg-[#F7F4EF]" style={{ animation: `${closing ? "slideOutRight" : "slideInRight"} 0.35s cubic-bezier(0.4,0,0.2,1) both` }}>
        <div className="flex flex-1 flex-col items-center justify-start" style={{ paddingTop: "calc(60px + 13.889vw)" }}>
          {/* Close button row */}
          <div className="flex w-full justify-end px-[5.556vw]">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="text-[#7A021D] flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L17 17M17 1L1 17" stroke="#7A021D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Heading */}
          <p
            className="font-[var(--font-manrope)] font-normal text-black text-center leading-[1.2] tracking-[-0.04em] shrink-0"
            style={{ fontSize: "9.444vw", marginTop: "2.778vw" }}
          >
            Selection added to<br />your Box
          </p>

          {productImage(true)}

          <p className="font-[var(--font-manrope)] font-medium text-[#4E4E4E] tracking-[-0.02em] uppercase" style={{ marginTop: "5.556vw", fontSize: "3.333vw" }}>
            {brand}
          </p>
          <p className="font-[var(--font-manrope)] font-semibold text-black tracking-[-0.04em] capitalize" style={{ marginTop: "2.778vw", fontSize: "4.167vw" }}>
            {name}
          </p>
          <p className="font-[var(--font-manrope)] font-medium text-black tracking-[-0.04em]" style={{ marginTop: "2.778vw", fontSize: "3.333vw" }}>
            {displayPrice}
          </p>

          <Link
            href="/box/my-box"
            className="shrink-0 flex items-center justify-center rounded-full border-2 border-[#7A021D] font-[var(--font-manrope)] font-semibold text-[#7A021D] tracking-[-0.02em]"
            style={{ marginTop: "6.944vw", width: "55.556vw", height: "16.667vw", fontSize: "3.889vw" }}
          >
            Open My Box
          </Link>
        </div>
      </div>
    </div>
  );
}
