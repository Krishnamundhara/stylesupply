"use client";

import { useBox } from "@/context/BoxContext";

const TOTAL_SLOTS = 5;

export default function BoxHero({
  stage,
}: {
  stage: "builder" | "confirmation" | "arrived" | "sessionEnded" | "boutique" | "shopIntention" | "schedulePickup" | "pickupTracking" | "returnFeedback" | "returnCompleted";
}) {
  const { items } = useBox();
  const isFull = items.length >= TOTAL_SLOTS;

  const heading =
    stage === "confirmation"
      ? "Arriving Soon"
      : stage === "arrived"
      ? "Arrived"
      : stage === "sessionEnded"
      ? "Your Session Has Ended"
      : stage === "boutique"
      ? "Boutique Session"
      : stage === "shopIntention"
      ? "Shop with Intention"
      : stage === "schedulePickup"
      ? "Schedule Pickup"
    : stage === "pickupTracking"
      ? "Pick up Tracking"
      : stage === "returnFeedback"
      ? "Returns"
      : stage === "returnCompleted"
      ? "Your box was returned."
      : isFull
      ? "You're All Set!"
      : "Build Your Box";

  const showSubtitle = stage === "builder";
  const showSchedulePickupSubtitle = stage === "schedulePickup";
  const showConfirmationSubtitle = stage === "confirmation";
  const showArrivedSubtitle = stage === "arrived";
  const showSessionEndedSubtitle = stage === "sessionEnded";
  const showBoutiqueSubtitle = stage === "boutique";
  const showShopIntentionSubtitle = stage === "shopIntention";
  const showPickupTrackingSubtitle = stage === "pickupTracking";
  const showReturnFeedbackSubtitle = stage === "returnFeedback";
  const showReturnCompletedSubtitle = stage === "returnCompleted";
  return (
    <section
      className={`w-full ${stage === "sessionEnded" ? "bg-[#7A021D]" : "bg-white"} text-center ${
        stage === "pickupTracking" || stage === "returnCompleted" || stage === "schedulePickup"
          ? "px-[8.333vw] pt-[8.333vw] pb-0 md:px-[3.906vw] md:pt-[3.906vw] md:pb-0"
          : stage === "returnFeedback"
          ? "px-[8.333vw] pt-[8.333vw] pb-0 md:px-[3.906vw] md:pt-[3.906vw] md:pb-0"
          : `px-[8.333vw] md:px-[3.906vw] lg:px-[1.389vw] pt-[8.333vw] md:pt-[3.906vw] lg:pt-[3.472vw] ${
              stage === "builder"
                ? "pb-[8.333vw] md:pb-[3.906vw] lg:pb-[2.22vw]"
                : stage === "confirmation" || stage === "boutique" || stage === "sessionEnded"
                ? "pb-[8.333vw] md:pb-[3.906vw] lg:pb-[2.083vw]"
                : "pb-[8.333vw] md:pb-[3.906vw] lg:pb-[2.083vw]"
            }`
      }`}
    >
      <h1
        className={
          stage === "schedulePickup"
            ? "mx-auto font-[var(--font-manrope)] font-normal leading-[1.2] text-black tracking-[-0.04em] text-[11.111vw] md:text-[7.813vw] lg:text-[5.139vw]"
            : stage === "pickupTracking"
            ? "mx-auto lg:max-w-[42.5vw] font-[var(--font-manrope)] font-normal leading-[1.2] text-black tracking-[-0.04em] text-[11.111vw] md:text-[7.813vw] lg:text-[5.139vw]"
            : stage === "returnCompleted"
            ? "mx-auto font-[var(--font-manrope)] font-normal leading-[1.2] text-black tracking-[-0.04em] text-[11.111vw] md:text-[5.833vw]"
            : stage === "shopIntention"
            ? "font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-[10vw] md:text-[5.139vw] text-black"
            : stage === "returnFeedback"
            ? "mx-auto lg:max-w-[42.5vw] font-[var(--font-manrope)] font-normal leading-[1.2] text-black tracking-[-0.04em] text-[11.111vw] md:text-[5.139vw]"
            : `font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-[11.111vw] md:text-[5.139vw] ${
                stage === "sessionEnded" ? "text-[#FBF9F9]" : "text-black"
              }`
        }
      >
        {stage === "sessionEnded" ? (
          <>
            <span className="md:hidden">
              Your Session
              <br />
              Has Ended
            </span>
            <span className="hidden md:inline">{heading}</span>
          </>
        ) : (
          heading
        )}
      </h1>

      {showSubtitle && (
        <div className="mt-[4.167vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center md:mt-[1.39vw]">
          <p className="text-[4.167vw] tracking-[-0.02em] md:text-[2.344vw] md:tracking-[-0.36px] md:whitespace-nowrap lg:text-[1.25vw]">
            You&rsquo;re not buying anything yet.
          </p>
          <p className="text-[4.167vw] tracking-[-0.02em] md:text-[2.344vw] md:tracking-[-0.36px] md:whitespace-nowrap lg:text-[1.25vw]">
            This confirms your try-at-home session.
          </p>
        </div>
      )}

      {showBoutiqueSubtitle && (
        <div className="mt-[5.556vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center md:mt-[2.083vw]">
          <p className="tracking-[-0.02em] text-[4.167vw] md:hidden">
            Your try-at-home session is active.
            <br />
            You have 48 hours to try your items
            <br />
            – take your time.
          </p>
          <p className="hidden md:block tracking-[-0.02em] text-[2.344vw] whitespace-nowrap lg:text-[1.389vw]">
            Your try-at-home session is active.
            <br />
            You have 48 hours to try your items – take your time.
          </p>
        </div>
      )}

      {showShopIntentionSubtitle && (
        <p
          className="mx-auto mt-[5.556vw] md:mt-[2.604vw] lg:mt-[2.083vw] lg:max-w-[42.5vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-[4.167vw] md:text-[2.344vw] lg:text-[1.389vw] text-center"
          style={{ letterSpacing: "-0.02em" }}
        >
          Keep what you love.
          <br />
          We&rsquo;ll take care of the rest.
        </p>
      )}

      {showPickupTrackingSubtitle && (
        <div className="mx-auto mt-[5.556vw] md:mt-[2.604vw] lg:mt-[1.389vw] max-w-[93.75vw] md:max-w-[56.25vw] lg:max-w-[37.5vw] font-medium leading-[1.4] text-black text-center" style={{ letterSpacing: "-0.02em" }}>
          <p className="text-[4.167vw] md:hidden">
            Your Return is scheduled. We&apos;ll handle
            <br />
            everything from here. Expect your pickup
            <br />
            within 24 hours.
          </p>
          <p className="hidden md:block text-[2.083vw] lg:text-[1.25vw]">
            Your Return is scheduled. We&apos;ll handle everything from here.
            <br />
            Expect your pickup within 24 hours.
          </p>
        </div>
      )}

      {showReturnCompletedSubtitle && (
        <p
          className="mx-auto mt-[5.556vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center text-[4.167vw] md:text-[2.083vw] lg:text-[1.25vw] max-w-[81.667vw] md:max-w-[38.281vw] lg:max-w-[20.417vw]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Thank you for shopping intentionally
        </p>
      )}

      {showSchedulePickupSubtitle && (
        <p
          className="mx-auto mt-[5.556vw] md:mt-[2.083vw] lg:mt-[1.389vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center text-[4.167vw] md:text-[2.083vw] lg:text-[1.25vw] max-w-[81.667vw] md:max-w-[46.875vw] lg:max-w-[23.194vw]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Your items will be picked up before 8pm tomorrow, May 30
        </p>
      )}

      {showReturnFeedbackSubtitle && (
        <div className="mt-[6.944vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center md:mt-[2.083vw]">
          <p className="text-[4.167vw] md:text-[2.083vw] lg:text-[1.25vw]" style={{ letterSpacing: "-0.02em" }}>
            Didn&rsquo;t love these items? We&rsquo;ll take<br className="md:hidden" /> care of it. Tell us more, so we can<br />
            build on your preferences.
          </p>
        </div>
      )}

      {showConfirmationSubtitle && (
        <div className="mx-auto mt-[5.556vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center">
          <p className="tracking-[-0.02em] text-[4.167vw] md:hidden">
            Your box is on the way. Get ready to try on your curated styles. Our Promise – You&rsquo;ll have it within 24 hours.
          </p>
          <p className="hidden md:block tracking-[-0.02em] text-[2.344vw] lg:text-[1.389vw]">
            Your box is on the way. Get ready to try on your curated styles.
            <br />
            Our Promise – You&rsquo;ll have it within 24 hours.
          </p>
        </div>
      )}

      {showArrivedSubtitle && (
        <div className="mx-auto mt-[5.556vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-black text-center">
          <p className="tracking-[-0.02em] text-[4.167vw] md:hidden">
            Your boutique session has begun.
            <br />
            Let us know if you&rsquo;ve received your items.
          </p>
          <p className="hidden md:block tracking-[-0.02em] text-[2.344vw] lg:text-[1.389vw]">
            Your boutique session has begun.
            <br />
            Let us know if you&rsquo;ve received your items.
          </p>
        </div>
      )}

      {showSessionEndedSubtitle && (
        <div className="mx-auto mt-[5.556vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium leading-[1.4] text-[#FBF9F9] text-center">
          <p className="tracking-[-0.02em] text-[4.167vw] md:text-[2.344vw] lg:text-[1.389vw]">
            <span className="md:hidden">
              Your trial period is complete. Return your
              <br />
              items to avoid late charges of ₹1000 per day.
            </span>
            <span className="hidden md:inline">
              Your trial period is complete.
              <br />
              Return your items to avoid late charges of ₹1000 per day.
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
