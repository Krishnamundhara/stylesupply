"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMembership } from "@/context/MembershipContext";
import toast from "react-hot-toast";
import ActivateMembershipFlow from "./ActivateMembershipFlow";

const HERO_ACTIVE_DESKTOP   = "/images/subscription/active_dektop.webp";
const HERO_ACTIVE_MOBILE    = "/images/subscription/active_mobile.webp";
const HERO_INACTIVE_DESKTOP = "/images/subscription/inactive_desktop.webp";
const HERO_INACTIVE_MOBILE  = "/images/subscription/inactive_mobile.webp";
const ORNAMENT_SRC = "/logo/ss%20logomark.svg";


function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MembershipContent({ devActive = false }: { devActive?: boolean }) {
  const { membership, isActive: isActiveReal, isLoading, activate, cancel } = useMembership();
  const isActive = devActive || isActiveReal;
  const [flipped, setFlipped] = useState(false);
  const [code, setCode] = useState("");
  const [activating, setActivating] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showActivateFlow, setShowActivateFlow] = useState(false);

  async function handleActivate() {
    if (!code.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    setActivating(true);
    const result = await activate(code.trim());
    setActivating(false);
    if (result.ok) {
      toast.success("Membership activated!");
      setCode("");
      setShowCodeInput(false);
    } else {
      toast.error(result.error || "Activation failed");
    }
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your membership?")) return;
    try {
      await cancel();
      toast.success("Membership cancelled");
      setFlipped(false);
    } catch {
      toast.error("Failed to cancel membership");
    }
  }

  function handleActiveClick() {
    setFlipped((v) => !v);
  }

  const renewalDate = membership?.expires_at ? formatDate(membership.expires_at) : "date";

  if (showActivateFlow) {
    return <ActivateMembershipFlow onDone={() => setShowActivateFlow(false)} />;
  }

  return (
    <div className="w-full min-w-0">
      {/* Membership card */}
      <div className="px-[2.778vw] md:px-[0.694vw]">
        <div
          className="relative w-full h-[136.111vw] md:h-[39.931vw]"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
              transform: isActive && flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRONT face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                backgroundColor: isActive ? "#7A021D" : "#a0a0a0",
              }}
            >
              {/* Image area */}
              <div className="absolute top-[1.389vw] left-[1.389vw] right-[1.389vw] bottom-[19.444vw] md:top-[0.347vw] md:left-[0.347vw] md:right-[0.347vw] md:bottom-[7.813vw] lg:bottom-[4.861vw]">
                <Image
                  src={isActive ? HERO_ACTIVE_MOBILE : HERO_INACTIVE_MOBILE}
                  alt="Premium Membership"
                  fill
                  className="object-cover object-top md:hidden"
                  sizes="100vw"
                />
                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={isActive ? HERO_ACTIVE_DESKTOP : HERO_INACTIVE_DESKTOP}
                    alt="Premium Membership"
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                </div>

                <div className="absolute top-[5.556vw] left-[5.556vw] w-[21.003vw] h-[24.215vw] md:top-[1.823vw] md:left-[4.167vw] md:w-[7.292vw] md:h-[8.073vw] lg:top-[3.472vw] lg:left-[3.472vw] lg:w-[5.556vw] lg:h-[6.111vw]">
                  <Image src={ORNAMENT_SRC} alt="" fill className="object-contain" unoptimized />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(16.667vw+5.556vw+5.556vw+5.556vw)] md:bottom-auto md:top-[2.778vw] lg:top-[3.472vw]">
                  <p className="text-white text-center font-[var(--font-manrope)] font-normal whitespace-nowrap" style={{ fontSize: "8.92vw", lineHeight: "10.494vw", letterSpacing: "-0.357vw" }}>
                    <span className="block md:hidden">Premium</span>
                    <span className="block md:hidden">Membership</span>
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

                {/* Inactive: Activate Now section */}
                {!isActive && !isLoading && (
                  <div className="absolute bottom-[8.333vw] md:bottom-[3.472vw] left-0 right-0 flex justify-center">
                    <button
                      onClick={() => setShowActivateFlow(true)}
                      className="bg-[#7A021D] rounded-full font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] whitespace-nowrap w-[55.556vw] h-[16.667vw] md:w-[26.042vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[16.667vw] lg:h-[5.556vw] text-[3.889vw] lg:text-[1.389vw]"
                    >
                      Activate Now
                    </button>
                  </div>
                )}

                {isLoading && (
                  <div className="absolute bottom-[8.333vw] md:bottom-[3.472vw] left-0 right-0 flex justify-center">
                    <div className="text-white font-[var(--font-manrope)] text-[3.889vw] md:text-[1.389vw]">
                      Loading...
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div
                className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-[5.556vw] md:px-[2.083vw] h-[19.444vw] md:h-[7.813vw] lg:h-[4.861vw]"
                style={{ backgroundColor: isActive ? "#7A021D" : "#a0a0a0" }}
              >
                <span className="font-[var(--font-manrope)] font-semibold text-white tracking-[-0.04em] text-[5vw] md:text-[2.344vw] lg:text-[1.667vw] leading-[1.08]">
                  5 pieces per box
                </span>

                {isActive ? (
                  <button
                    onClick={handleActiveClick}
                    className="flex items-center gap-[2.778vw] md:gap-[0.694vw] cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-[var(--font-manrope)] font-semibold text-white text-[5vw] md:text-[2.344vw] lg:text-[1.667vw] tracking-[-0.04em]">
                      Active
                    </span>
                  </button>
                ) : (
                  <span className="font-[var(--font-manrope)] font-semibold text-white text-[5vw] md:text-[2.344vw] lg:text-[1.667vw] tracking-[-0.04em]">
                    ₹5,000
                  </span>
                )}
              </div>
            </div>

            {/* BACK face — active + flipped */}
            <div
              className="absolute inset-0 bg-[#7A021D] flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="font-[var(--font-manrope)] font-normal text-white text-center tracking-[-0.04em] text-[8.333vw] md:text-[5.208vw] lg:text-[4.444vw] leading-[1.2]">
                Renews on {renewalDate}
              </p>
              <Link
                href="/accounts/membership/manage"
                className="mt-[8.333vw] md:mt-[3.125vw] lg:mt-[2.778vw] bg-white rounded-full font-[var(--font-manrope)] font-semibold text-[#7a021d] tracking-[-0.02em] whitespace-nowrap px-[5.556vw] md:px-[3.125vw] lg:px-[2.083vw] h-[13.889vw] md:h-[7.813vw] lg:h-[5.556vw] text-[3.889vw] md:text-[1.823vw] lg:text-[1.25vw] flex items-center justify-center"
              >
                Manage Membership
              </Link>

              {/* Bottom bar on back */}
              <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-[5.556vw] md:px-[2.083vw] h-[19.444vw] md:h-[7.813vw] lg:h-[4.861vw] bg-[#7A021D]">
                <span className="font-[var(--font-manrope)] font-semibold text-white tracking-[-0.04em] text-[5vw] md:text-[2.344vw] lg:text-[1.667vw] leading-[1.08]">
                  5 pieces per box
                </span>
                <button
                  onClick={() => setFlipped(false)}
                  className="flex items-center gap-[2.778vw] md:gap-[0.694vw] cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-[var(--font-manrope)] font-semibold text-white text-[5vw] md:text-[2.344vw] lg:text-[1.667vw] tracking-[-0.04em]">
                    Active
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
