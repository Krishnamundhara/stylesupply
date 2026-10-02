"use client";

import Image from "next/image";
import { useState } from "react";

const MEMBERSHIP_IMAGE_ACTIVE_DESKTOP   = "/images/subscription/active_dektop.webp";
const MEMBERSHIP_IMAGE_ACTIVE_MOBILE    = "/images/subscription/active_mobile.webp";
const MEMBERSHIP_IMAGE_INACTIVE_DESKTOP = "/images/subscription/inactive_desktop.webp";
const MEMBERSHIP_IMAGE_INACTIVE_MOBILE  = "/images/subscription/inactive_mobile.webp";
const ORNAMENT_ICON = "/logo/ss%20logomark.svg";

function MembershipCard({ active }: { active: boolean }) {
  const [flipped, setFlipped] = useState(false);

  const canFlip = active;

  return (
    <div
      className="relative left-1/2 mx-auto h-[136.111vw] w-[94.444vw] -translate-x-1/2 md:left-0 md:h-[39.931vw] md:w-full md:translate-x-0"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
          transform: canFlip && flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: active ? "#7A021D" : "#a0a0a0",
          }}
        >
          <div className="absolute bottom-[19.444vw] left-[1.389vw] right-[1.389vw] top-[1.389vw] md:bottom-[4.861vw] md:left-[0.347vw] md:right-[0.347vw] md:top-[0.347vw]">
            <Image
              src={active ? MEMBERSHIP_IMAGE_ACTIVE_MOBILE : MEMBERSHIP_IMAGE_INACTIVE_MOBILE}
              alt="Premium Membership"
              fill
              className="object-cover object-top"
              sizes="(max-width: 767px) 94.444vw, 0vw"
            />
            <div className="absolute inset-0 hidden md:block">
              <Image
                src={active ? MEMBERSHIP_IMAGE_ACTIVE_DESKTOP : MEMBERSHIP_IMAGE_INACTIVE_DESKTOP}
                alt="Premium Membership"
                fill
                className="object-cover object-top"
                sizes="(max-width: 767px) 0vw, 100vw"
              />
            </div>

            <div className="absolute left-[6.944vw] top-[4.364vw] h-[24.215vw] w-[21.003vw] md:left-[4.167vw] md:top-[1.389vw] md:h-[6.111vw] md:w-[5.556vw]">
              <Image src={ORNAMENT_ICON} alt="" fill className="object-contain" unoptimized />
            </div>

            <div className="absolute bottom-[8.333vw] left-1/2 -translate-x-1/2 md:bottom-auto md:top-[2.778vw]">
              <p className="text-center font-normal whitespace-nowrap text-white font-[var(--font-manrope)]">
                <span className="block md:hidden" style={{ fontSize: "8.92vw", lineHeight: "10.494vw", letterSpacing: "-0.357vw" }}>Premium</span>
                <span className="block md:hidden" style={{ fontSize: "8.92vw", lineHeight: "10.494vw", letterSpacing: "-0.357vw" }}>Membership</span>
                <span className="hidden md:block lg:hidden" style={{ fontSize: "4.167vw", lineHeight: "4.688vw", letterSpacing: "-0.167vw" }}>
                  Premium
                  <br />
                  Membership
                </span>
                <span className="hidden lg:block" style={{ fontSize: "3.889vw", lineHeight: "3.472vw", letterSpacing: "-0.122vw" }}>
                  Premium
                  <br />
                  Membership
                </span>
              </p>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 flex h-[19.444vw] items-center justify-between px-[5.556vw] md:h-[7.813vw] lg:h-[4.861vw] md:px-[2.083vw]"
            style={{ backgroundColor: active ? "#7A021D" : "#a0a0a0" }}
          >
            <span className="font-[var(--font-manrope)] font-semibold text-white tracking-[-0.04em] text-[5vw] md:text-[1.667vw] leading-[1.08]">
              5 pieces per box
            </span>
            {active ? (
              <button type="button" onClick={() => setFlipped(true)} className="flex items-center gap-[2.778vw] md:gap-[0.694vw]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-[var(--font-manrope)] font-semibold text-white text-[5vw] md:text-[1.667vw] tracking-[-0.04em] leading-[1.08]">
                  Active
                </span>
              </button>
            ) : (
              <span className="font-[var(--font-manrope)] font-semibold text-white text-[5vw] md:text-[1.667vw] tracking-[-0.04em] leading-[1.08]">
                ₹5,000
              </span>
            )}
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#7A021D] px-[5.556vw] md:px-[4.167vw]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            gap: "8.333vw",
          }}
        >
          <p className="font-[var(--font-manrope)] font-normal text-center text-white tracking-[-0.04em] text-[8.333vw] md:text-[4.444vw] leading-[1.2]">
            Renews on 1 June 2026
          </p>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="h-[13.889vw] rounded-full border border-[#a0a0a0] bg-white px-[5.556vw] font-[var(--font-manrope)] font-semibold tracking-[-0.02em] text-[#7a021d] whitespace-nowrap text-[3.889vw] md:h-[5.556vw] md:px-[2.083vw] md:text-[1.25vw]"
          >
            Manage Membership
          </button>

          <div className="absolute bottom-0 left-0 right-0 flex h-[19.444vw] items-center justify-between bg-[#7A021D] px-[5.556vw] md:h-[4.861vw] md:px-[2.083vw]">
            <span className="font-[var(--font-manrope)] font-semibold text-white tracking-[-0.04em] text-[5vw] md:text-[1.667vw] leading-[1.08]">
              5 pieces per box
            </span>
            <button type="button" onClick={() => setFlipped(false)} className="flex items-center gap-[2.778vw] md:gap-[0.694vw]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-[var(--font-manrope)] font-semibold text-white text-[5vw] md:text-[1.667vw] tracking-[-0.04em] leading-[1.08]">
                Active
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoxStageMembership({
  isActive = false,
  onActivate,
  onConfirm,
}: {
  isActive?: boolean;
  onActivate?: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="mx-auto flex flex-col items-center px-5 pt-[11.111vw] pb-0 md:px-[2.778vw] md:pt-[3.472vw] md:pb-0">

        <h1 className="font-normal leading-[1.2] tracking-[-0.04em] text-black text-[11.111vw] text-center md:text-[5.139vw]">
          Confirm My Box
        </h1>

        <div className="mt-[8.333vw] flex w-[33.333vw] md:w-[8.333vw] items-center gap-[1.528vw] md:mt-[1.389vw] md:gap-[0.382vw]">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-[1.667vw] flex-1 md:h-[0.417vw] rounded-none transition-colors"
              style={{ backgroundColor: i === 1 ? "#7A021D" : "rgba(122,2,29,0.2)" }}
            />
          ))}
        </div>

        <p className="mt-[4.167vw] font-medium text-[5vw] leading-[1.2] tracking-[-0.02em] text-black text-center md:mt-[1.953vw] lg:mt-[1.389vw] md:text-[1.823vw] lg:text-[1.389vw]">
          My Membership
        </p>

        <div className="w-full mt-[4.167vw] md:mt-[1.953vw] lg:mt-[1.389vw]">
          <MembershipCard active={isActive} />
        </div>

        {!isActive ? (
          <button
            type="button"
            onClick={onActivate}
            className="mt-[8.333vw] md:mt-[2.083vw] flex items-center justify-center rounded-full font-semibold text-white h-[16.667vw] w-[55.556vw] text-[3.889vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
            style={{
              backgroundColor: "#7A021D",
              letterSpacing: "-0.36px",
            }}
          >
            Activate Now
          </button>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            className="mt-[8.333vw] md:mt-[2.083vw] flex items-center justify-center rounded-full font-semibold text-white h-[16.667vw] w-[55.556vw] text-[3.889vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw] tracking-[-0.04em]"
            style={{
              backgroundColor: "#7A021D",
            }}
          >
            Confirm My Box
          </button>
        )}

      </div>
    </div>
  );
}
