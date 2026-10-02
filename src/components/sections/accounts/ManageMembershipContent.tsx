"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useMembership } from "@/context/MembershipContext";
import toast from "react-hot-toast";

const LOGO_SRC = "/logo/ss_black_logo.svg";
const IMG_ICON_BOX      = "/icon/Group 52316.svg";
const IMG_ICON_TRY      = "/icon/Group 52318.svg";
const IMG_ICON_DROPS    = "/icon/Group 52319.svg";
const IMG_ICON_PRICING  = "/icon/Group 52315.svg";
const IMG_PAUSE_D  = "/images/manage_subscription/pause_desktop.webp";
const IMG_PAUSE_M  = "/images/manage_subscription/pause_mobile.webp";
const IMG_CANCEL_D = "/images/manage_subscription/cancel_desktop.webp";
const IMG_CANCEL_M = "/images/manage_subscription/cancel_mobile.webp";

const PAUSE_DURATIONS = ["1 month", "2 months", "3 months"];
const CANCEL_REASONS = [
  "Didn't find styles",
  "Too expensive",
  "Not using it enough",
  "Service issues",
  "Prefer to buy directly",
  "Other",
];

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function ManageMembershipContent({ devActive }: { devActive?: boolean }) {
  const { membership, isActive: ctxActive, isCancelled, reactivate } = useMembership();
  const isActive = devActive ?? ctxActive;
  const nextBillingDate = membership?.expires_at ? formatDate(membership.expires_at) : "-";

  const [pauseFlipped, setPauseFlipped] = useState(false);
  const [pauseState, setPauseState] = useState<"selecting" | "confirmed">("selecting");
  const [selectedDuration, setSelectedDuration] = useState("2 months");

  const flipPause = (val: boolean) => { setPauseFlipped(val); if (val) setCancelFlipped(false); };
  const flipCancel = (val: boolean) => { setCancelFlipped(val); if (val) { setPauseFlipped(false); setPauseState("selecting"); } };

  const [cancelFlipped, setCancelFlipped] = useState(false);
  const [cancelState, setCancelState] = useState<"reason" | "confirming" | "cancelled">("reason");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reactivating, setReactivating] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isCancelled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      flipCancel(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCancelState("cancelled");
    }
  }, [isCancelled]);

  const handleReactivate = async () => {
    setReactivating(true);
    const result = await reactivate();
    setReactivating(false);
    if (!result.ok) {
      toast.error(result.error ?? "Reactivation failed");
      return;
    }
    flipCancel(false);
    setCancelState("reason");
  };

  return (
    <div className="flex w-full min-w-0 flex-col lg:px-[10px]">

      {/* 1. Manage Membership heading */}
      <section className="w-full bg-white pt-[5.556vw] md:pt-0 pb-[11.111vw] md:pb-[4.167vw]">
        <h1 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[8.889vw] md:text-[5.859vw] lg:text-[4.444vw] text-center">
          Manage Membership
        </h1>
      </section>

      {/* 2. Current plan info card */}
      <div className="relative bg-[#f7f4ef] mx-[2.778vw] md:mx-[5px] md:px-[3.403vw] md:pt-[4.167vw] md:pb-0 md:h-[39.583vw]">

        {/* Mobile layout */}
        <div className="flex md:hidden flex-col items-center text-center pt-[8.333vw] pb-[11.111vw] px-[5.556vw]">
          <div className="flex items-center justify-center w-[16.667vw] h-[16.667vw] mb-[5.556vw]">
            <img src={LOGO_SRC} alt="" aria-hidden="true" className="w-full h-full object-contain" />
          </div>
          <p className="font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-black text-[3.333vw]">
            Current Plan
          </p>
          <p className="font-[var(--font-manrope)] font-medium leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] mt-[2.778vw]">
            Premium Membership
          </p>
          <p className="font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-black text-[4.167vw] max-w-[63.889vw] mt-[3.333vw]">
            Your membership is currently active. You can pause, or cancel your membership below.
          </p>
          <div className="flex flex-col items-center mt-[8.333vw]">
            <p className="font-[var(--font-manrope)] font-semibold leading-[1.6] tracking-[-0.04em] text-black text-[2.667vw]">
              Billing Amount
            </p>
            <p className="font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-black text-[5.333vw]">
              &#8377;5,000/mo
            </p>
          </div>
        </div>

        {/* Tablet + Desktop layout */}
        <div className="hidden md:block">
          <div className="absolute top-[4.167vw] right-[3.403vw] flex shrink-0 w-[6.944vw] h-[6.944vw] items-center justify-center">
            <img src={LOGO_SRC} alt="" aria-hidden="true" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col items-start text-left">
            <p className="font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-black text-[1.823vw] lg:text-[1.667vw]">
              Current Plan
            </p>
            <p className="font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-black text-[3.906vw] lg:text-[4.444vw] mt-[0.694vw]">
              Premium Membership
            </p>
            <p className="font-[var(--font-manrope)] font-semibold leading-[1.5] tracking-[-0.04em] text-black text-[1.823vw] lg:text-[1.667vw] max-w-[32.639vw] mt-[1.389vw]">
              Your membership is currently active. You can pause, or cancel your membership below.
            </p>
          </div>
          <div className="absolute bottom-[3.472vw] left-[3.403vw] flex flex-col">
            <p className="font-[var(--font-manrope)] font-semibold leading-[1.6] tracking-[-0.04em] text-black text-[1.563vw] lg:text-[max(18px,1.389vw)]">
              Billing Amount
            </p>
            <p className="font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-black text-[3.906vw] lg:text-[3.056vw]">
              &#8377;5,000/mo
            </p>
          </div>
        </div>
      </div>

      {/* 3. Status bar */}
      <div className="bg-[#25080a] mx-[2.778vw] md:mx-[5px] flex flex-row items-center justify-between px-[5.278vw] md:px-[3.403vw] py-[5.556vw] md:py-0 md:h-[6.944vw]">
        <div className="flex flex-col md:flex-row md:items-center gap-[2.778vw] md:gap-0">
          <p className="font-[var(--font-manrope)] font-semibold leading-[1.6] tracking-[-0.04em] text-white text-[3.333vw] md:text-[1.823vw] lg:text-[1.667vw] whitespace-nowrap">
            Next Billing Date
          </p>
          <p className="font-[var(--font-manrope)] font-semibold leading-[1.6] tracking-[-0.04em] text-white text-[3.333vw] md:text-[1.823vw] lg:text-[1.667vw] md:ml-[0.35em] whitespace-nowrap">
            {nextBillingDate}
          </p>
        </div>
        <div className="flex flex-col items-end md:flex-row md:items-center gap-[2.778vw] md:gap-[1.389vw]">
          <p className="font-[var(--font-manrope)] font-semibold leading-[1.6] tracking-[-0.04em] text-white text-[3.333vw] md:text-[1.823vw] lg:text-[1.667vw] whitespace-nowrap">
            Current Box Status
          </p>
          {isActive && (
            <div className="flex items-center gap-[2.778vw] md:gap-[0.694vw]">
              <svg width="11" height="8" viewBox="0 0 20 14" fill="none" className="w-[3.056vw] h-[2.083vw] md:w-[1.389vw] md:h-[0.972vw]">
                <path d="M2 7l5 5L18 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="font-[var(--font-manrope)] font-semibold leading-[1.08] tracking-[-0.04em] text-white text-[3.889vw] md:text-[1.823vw] lg:text-[1.667vw]">
                Active
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Pause + Cancel panels */}
      <div className="flex flex-col gap-[1.389vw] md:flex-row md:gap-[5px] mt-[11.111vw] md:mt-[2.778vw] w-full h-auto md:h-[48.611vw] px-[2.778vw] md:px-[0.347vw]">

        {/* Pause panel - flip card */}
        <div
          className="relative w-full h-[133.333vw] md:w-1/2 md:h-full"
          style={{ perspective: "1200px" }}
        >
          {isCancelled && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-[5.556vw] md:px-[2.778vw] text-center">
              <p className="font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-white text-[4.444vw] md:text-[1.823vw] lg:text-[1.667vw]">
                Reactivate your membership before pausing.
              </p>
            </div>
          )}
          <div
            className="relative w-full h-[133.333vw] md:w-full md:h-full"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
              transform: pauseFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRONT - photo panel */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                pointerEvents: pauseFlipped ? "none" : "auto",
              }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <picture className="absolute inset-0 w-full h-full">
                  <source media="(max-width: 767px)" srcSet={IMG_PAUSE_M} />
                  <img src={IMG_PAUSE_D} alt="" aria-hidden="true" className="w-full h-full object-cover select-none" />
                </picture>
              </div>

              <div className="relative z-10 flex h-full w-full flex-col pl-[5.556vw] pr-[5.556vw] md:pl-[2.778vw] md:pr-[2.778vw] pt-[5.556vw] md:pt-[3.472vw]">
                <p className="font-[var(--font-manrope)] font-normal leading-[normal] tracking-[-0.04em] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw] whitespace-nowrap">
                  Pause
                </p>
                <p className="mt-[6.944vw] md:mt-[1.736vw] font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                  Need a little time away?
                </p>
                <p className="mt-[5.556vw] md:mt-[1.111vw] font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                  Pause your membership if you&apos;re travelling, taking a break, or simply don&apos;t need a box this month. You&apos;ll keep your profile and preferences, and can resume whenever you&apos;re ready.
                </p>
                <button
                  type="button"
                  onClick={() => flipPause(true)}
                  className="absolute bottom-[5.556vw] right-[5.556vw] md:bottom-[2.778vw] md:right-[2.778vw] flex items-center justify-center rounded-full bg-white border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-black whitespace-nowrap w-[50vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                >
                  Pause Membership
                </button>
              </div>
            </div>

            {/* BACK - dark panel (two sub-states) */}
            <div
              className="absolute inset-0 bg-[#25080a] flex flex-col px-[2.778vw] pt-[5.556vw] md:pt-[3.472vw] pb-[5.556vw] md:pb-[2.778vw]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                pointerEvents: pauseFlipped ? "auto" : "none",
              }}
            >
              <button
                type="button"
                onClick={() => { flipPause(false); setPauseState("selecting"); }}
                className="absolute top-[50px] right-[30px] z-10 flex items-center justify-center w-[8.333vw] h-[8.333vw] md:w-[2.778vw] md:h-[2.778vw]"
                aria-label="Close"
              >
                <img src="/icon/vuesax/linear/cross.svg" alt="" aria-hidden="true" className="w-full h-full object-contain brightness-0 invert" />
              </button>
              {pauseState === "selecting" ? (
                <>
                  <div className="flex flex-col">
                    <p className="pl-[2.778vw] md:pl-0 font-[var(--font-manrope)] font-normal leading-[normal] tracking-[-0.04em] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw] whitespace-nowrap">
                      Pause
                    </p>
                    <div className="pl-[2.778vw] md:pl-0 mt-[8.333vw] md:mt-[1.736vw] flex flex-col gap-[2.778vw] md:gap-[0.694vw]">
                      <p className="font-[var(--font-manrope)] font-semibold leading-[1.3] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                        How long would you like to pause?
                      </p>
                      <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                        Choose a pause duration below. Your membership will not renew during this time.
                      </p>
                      <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                        Your membership will automatically resume after the pause period unless cancelled before then.
                      </p>
                    </div>
                    <div className="mt-[11.111vw] md:mt-[4.167vw] flex justify-center gap-[1.667vw] md:gap-[0.694vw]">
                      {PAUSE_DURATIONS.map((d) => {
                        const active = d === selectedDuration;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDuration(d)}
                            className={[
                              "flex items-center justify-center rounded-full font-[var(--font-manrope)] font-semibold leading-[1.1] tracking-[-0.04em] whitespace-nowrap",
                              "h-[16.667vw] w-[27.778vw] text-[3.889vw] md:h-[5.556vw] md:w-[12.5vw] md:text-[1.389vw]",
                              active
                                ? "bg-white text-[#2c0505] border border-white"
                                : "bg-transparent text-white border border-white",
                            ].join(" ")}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto pt-[8.333vw] md:pt-[2.778vw] flex items-center justify-center gap-[3.333vw] md:gap-[0.694vw]">
                    <button
                      type="button"
                      onClick={() => { flipPause(false); setPauseState("selecting"); }}
                      className="flex items-center justify-center rounded-full bg-white border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-[#25080a] whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Keep Membership
                    </button>
                    <button
                      type="button"
                      onClick={() => setPauseState("confirmed")}
                      className="flex items-center justify-center rounded-full border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-white whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Confirm Pause
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <p className="pl-[2.778vw] md:pl-0 font-[var(--font-manrope)] font-normal leading-[1.15] tracking-[-0.04em] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw]">
                      Your membership has been paused.
                    </p>
                    <div className="pl-[2.778vw] md:pl-0 mt-[6.944vw] md:mt-[2.778vw] flex flex-col gap-[2.778vw] md:gap-[0.833vw]">
                      <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                        Your Style Supply membership is now on pause.
                      </p>
                      <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                        You won&apos;t be billed or receive a new box during this period.
                      </p>
                      <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                        Your style profile and preferences are saved, so you can come back whenever you&apos;re ready.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-[5.556vw] md:pt-[2.778vw] flex items-center justify-center gap-[3.333vw] md:gap-[0.694vw]">
                    <button
                      type="button"
                      onClick={() => { flipPause(false); setPauseState("selecting"); }}
                      className="flex items-center justify-center rounded-full bg-white border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-[#25080a] whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Reactivate
                    </button>
                    <Link
                      href="/accounts/help"
                      className="flex items-center justify-center rounded-full border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-white whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Get Help
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cancel panel - flip card */}
        <div
          className="relative w-full h-[133.333vw] md:w-1/2 md:h-full"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full h-[133.333vw] md:w-full md:h-full"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4,0.2,0.2,1)",
              transform: cancelFlipped
                ? // flip clockwise on mobile, preserve existing (counter) direction on desktop
                  isMobile
                  ? "rotateY(180deg)"
                  : "rotateY(-180deg)"
                : "rotateY(0deg)",
            }}
          >
            {/* FRONT - photo panel */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                pointerEvents: cancelFlipped ? "none" : "auto",
              }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <picture className="absolute inset-0 w-full h-full">
                  <source media="(max-width: 767px)" srcSet={IMG_CANCEL_M} />
                  <img src={IMG_CANCEL_D} alt="" aria-hidden="true" className="w-full h-full object-cover select-none" />
                </picture>
              </div>

              <div className="relative z-10 flex h-full w-full flex-col pl-[5.556vw] pr-[5.556vw] md:pl-[2.778vw] md:pr-[2.778vw] pt-[5.556vw] md:pt-[3.472vw]">
                <p className="font-[var(--font-manrope)] font-normal leading-[normal] tracking-[-0.04em] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw] whitespace-nowrap">
                  Cancel
                </p>
                <p className="mt-[6.944vw] md:mt-[1.736vw] font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                  Thinking of leaving?
                </p>
                <p className="mt-[5.556vw] md:mt-[1.111vw] font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                  We&apos;d be sad to see you go. Cancelling means you may lose access to early member benefits, and your current membership privileges.
                </p>
                <p className="mt-[5.556vw] md:mt-[1.111vw] font-[var(--font-manrope)] font-semibold leading-[1.4] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                  Before you cancel, you can also reach our team if there&apos;s anything we can help fix.
                </p>
                <div className="absolute bottom-[5.556vw] left-[5.556vw] right-[5.556vw] md:bottom-[2.778vw] md:left-[2.778vw] md:right-[2.778vw] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setCancelState("reason"); flipCancel(true); }}
                    className="font-[var(--font-manrope)] font-medium leading-[normal] tracking-[-0.04em] text-white text-[3.889vw] md:text-[1.823vw] underline underline-offset-2 whitespace-nowrap"
                  >
                    Cancel Membership
                  </button>
                  <Link
                    href="/accounts/help"
                    className="flex shrink-0 items-center justify-center rounded-full bg-white border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-black whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[18.229vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

            {/* BACK - dark cancel panel (two sub-states) */}
            <div
              className="absolute inset-0 bg-[#25080a] flex flex-col px-[5.556vw] md:px-[2.778vw] pt-[5.556vw] md:pt-[3.472vw] pb-[5.556vw] md:pb-[2.778vw]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(-180deg)",
                pointerEvents: cancelFlipped ? "auto" : "none",
              }}
            >
              <button
                type="button"
                onClick={() => { flipCancel(false); setCancelState("reason"); }}
                className="absolute top-[50px] right-[30px] z-10 flex items-center justify-center w-[8.333vw] h-[8.333vw] md:w-[2.778vw] md:h-[2.778vw]"
                aria-label="Close"
              >
                <img src="/icon/vuesax/linear/cross.svg" alt="" aria-hidden="true" className="w-full h-full object-contain brightness-0 invert" />
              </button>
              {cancelState === "reason" && (
                <>
                  <p className="font-[var(--font-manrope)] font-normal leading-[normal] tracking-[-0.04em] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw] whitespace-nowrap">
                    Cancel
                  </p>
                  <div className="mt-[4.167vw] md:mt-[1.736vw] flex flex-col gap-[2.778vw] md:gap-[0.694vw]">
                    <p className="font-[var(--font-manrope)] font-semibold leading-[1.3] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(14px,1.195vw)]">
                      Before you go, could you tell us why?
                    </p>
                    <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(14px,1.195vw)]">
                      This helps us improve the Style Supply experience.
                    </p>
                  </div>
                  <div className="mt-[8.333vw] md:mt-[4.167vw] grid grid-cols-3 gap-[2.778vw] md:gap-[0.694vw]">
                    {CANCEL_REASONS.map((reason) => {
                      const active = selectedReasons.includes(reason);
                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() =>
                            setSelectedReasons((prev) =>
                              active ? prev.filter((r) => r !== reason) : [...prev, reason]
                            )
                          }
                          className={[
                            "flex items-center justify-center rounded-full font-[var(--font-manrope)] font-semibold leading-[1.1] tracking-[-0.04em] whitespace-nowrap",
                            "h-[16.667vw] w-[27vw] text-[2.778vw] md:h-[7.813vw] md:w-[14.323vw] md:text-[1.302vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]",
                            active ? "bg-white text-[#2c0505] border border-white" : "bg-transparent text-white border border-white",
                          ].join(" ")}
                        >
                          {reason}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-auto flex justify-center pt-[4.167vw] md:pt-[2.778vw]">
                    <button
                      type="button"
                      onClick={() => setCancelState("confirming")}
                      className="flex items-center justify-center rounded-full border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-white whitespace-nowrap w-[50vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {cancelState === "confirming" && (
                <>
                  <p className="font-[var(--font-manrope)] font-normal leading-[1.15] tracking-[-0.04em] text-white text-[9.444vw] md:text-[3.906vw] lg:text-[4.444vw]">
                    Are you sure you want to cancel?
                  </p>
                  <div className="mt-[3.333vw] md:mt-[1.042vw] flex flex-col gap-[2.222vw] md:gap-[0.694vw]">
                    <p className="font-[var(--font-manrope)] font-semibold leading-[1.3] tracking-[-0.04em] text-white text-[3.889vw] md:text-[1.823vw] lg:text-[max(14px,1.195vw)]">
                      Once cancelled, you&apos;ll lose access to:
                    </p>
                    <div className="flex flex-col">
                      {[
                        { icon: IMG_ICON_BOX,     label: "Curated monthly boxes" },
                        { icon: IMG_ICON_TRY,     label: "Try-before-you-buy access" },
                        { icon: IMG_ICON_DROPS,   label: "Early brand drops" },
                        { icon: IMG_ICON_PRICING, label: "Your active membership pricing" },
                      ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-[2.778vw] md:gap-[0.972vw] py-[0.5vw] md:py-[0.5vw]">
                          <img src={icon} alt="" aria-hidden="true" className="shrink-0 w-[4.444vw] h-[4.444vw] md:w-[2vw] md:h-[2vw] object-contain" />
                          <p className="font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-white text-[3.611vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-white text-[3.611vw] md:text-[1.823vw] lg:text-[max(14px,1.195vw)]">
                      If you have an active box, please return all items before your cancellation is fully processed.
                    </p>
                  </div>
                  <div className="mt-auto pt-[5.556vw] md:pt-[2.778vw] flex flex-wrap items-center justify-center gap-[3.333vw] md:gap-[0.694vw]">
                    <button
                      type="button"
                      onClick={() => { flipCancel(false); setCancelState("reason"); }}
                      className="flex items-center justify-center rounded-full bg-white border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-[#25080a] whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Keep Membership
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelState("cancelled")}
                      className="flex items-center justify-center rounded-full border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-white whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Cancel Membership
                    </button>
                  </div>
                </>
              )}

              {cancelState === "cancelled" && (
                <>
                  <p className="font-[var(--font-manrope)] font-normal leading-[1.15] tracking-[-0.04em] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw]">
                    Your membership has been cancelled.
                  </p>
                  <div className="mt-[11.111vw] md:mt-[2.778vw] flex flex-col gap-[3.333vw] md:gap-[0.694vw]">
                    <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                      We&apos;re sorry to see you go, but you&apos;re always welcome back.
                    </p>
                    <p className="font-[var(--font-manrope)] font-medium leading-[1.5] tracking-[-0.04em] text-white text-[4.167vw] md:text-[1.823vw] lg:text-[max(18px,1.389vw)]">
                      Please make sure any remaining items are returned as per your return timeline. If you need help, our team is available on WhatsApp.
                    </p>
                  </div>
                  <div className="mt-auto pt-[8.333vw] md:pt-[2.778vw] flex flex-wrap items-center justify-center gap-[3.333vw] md:gap-[0.694vw]">
                    <button
                      type="button"
                      onClick={() => void handleReactivate()}
                      disabled={reactivating}
                      className="flex items-center justify-center rounded-full bg-white border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-[#25080a] whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw] disabled:opacity-60"
                    >
                      {reactivating ? "Reactivating…" : "Reactivate"}
                    </button>
                    <Link
                      href="/accounts/help"
                      className="flex items-center justify-center rounded-full border border-white font-[var(--font-manrope)] font-semibold leading-[normal] tracking-[-0.04em] text-white whitespace-nowrap w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[15.278vw] lg:h-[5.556vw] lg:text-[1.389vw]"
                    >
                      Get Help
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Questions section */}
      <div className="flex w-full flex-col items-center gap-[8.333vw] md:gap-[2.778vw] mt-[16.667vw] md:mt-[5.556vw] text-center px-[5.556vw] md:px-0">
        <div className="flex flex-col items-center gap-[4.167vw] md:gap-[2.778vw]">
          <h2 className="font-[var(--font-manrope)] font-normal leading-[1.3] tracking-[-0.04em] text-black text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw]">
            Need Help?
          </h2>
          <p className="font-[var(--font-manrope)] font-medium leading-[1.2] tracking-[-0.04em] text-black text-[4.444vw] md:text-[2.344vw] lg:text-[max(18px,1.389vw)] md:w-[41.667vw]">
            We&apos;re here to help with any questions about your membership. Our FAQs cover most things, but for anything specific, you can always write to us.
          </p>
        </div>
        <div className="flex items-center justify-center gap-[3.333vw] w-full md:gap-[0.903vw]">
          <Link
            href="/faq"
            className="flex items-center justify-center rounded-full bg-[#7a021d] font-[var(--font-manrope)] font-semibold leading-[1.1] tracking-[-0.04em] text-white whitespace-nowrap h-[16.667vw] w-[38.889vw] text-[3.889vw] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
          >
            View FAQs
          </Link>
          <Link
            href="/accounts/help"
            className="flex items-center justify-center rounded-full border border-[#7a021d] font-[var(--font-manrope)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#7a021d] whitespace-nowrap h-[16.667vw] w-[38.889vw] text-[3.889vw] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
          >
            Get Help
          </Link>
        </div>
      </div>

    </div>
  );
}
