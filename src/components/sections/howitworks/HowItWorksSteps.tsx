"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const STEP_IMAGES = {
  "01": "/images/how_it_works/01.webp",
  "02": "/images/how_it_works/02.webp",
  "03": "/images/how_it_works/03.webp",
  "04": "/images/how_it_works/04.webp",
  "05": "/images/how_it_works/05.webp",
} as const;

interface Step {
  number: string;
  titleLine1: string;
  titleLine2: string;
  image: string;
  stepLabel: string;
  body: ReactNode;
  subLabel: string;
  headline: ReactNode;
  ctaLabel: string;
  ctaHref: string;
}

const steps: Step[] = [
  {
    number: "01",
    titleLine1: "Become a",
    titleLine2: "Member",
    image: STEP_IMAGES["01"],
    stepLabel: "STEP 01",
    body: (
      <>
        Subscribe for ₹5,000/month. This isn&apos;t a fee,
        <br />
        it&apos;s your monthly fashion credit, redeemable
        <br />
        against anything you choose to keep.
      </>
    ),
    subLabel: "YOUR MEMBERSHIP",
    headline: (
      <>
        <span className="block text-black">No Fees.</span>
        <span className="block text-[#7A021D]">Full Credit.</span>
      </>
    ),
    ctaLabel: "Join Now",
    ctaHref: "/accounts/membership",
  },
  {
    number: "02",
    titleLine1: "Explore the",
    titleLine2: "Collection",
    image: STEP_IMAGES["02"],
    stepLabel: "STEP 02",
    body: (
      <>
        Access and browse our curated edit of
        <br />
        premium contemporary brands.
      </>
    ),
    subLabel: "WHAT YOU GET",
    headline: (
      <>
        <span className="block text-black">Quick. Curated.</span>
        <span className="block text-[#7A021D]">Designer.</span>
      </>
    ),
    ctaLabel: "Explore",
    ctaHref: "/products",
  },
  {
    number: "03",
    titleLine1: "Build Your",
    titleLine2: "Box",
    image: STEP_IMAGES["03"],
    stepLabel: "STEP 03",
    body: (
      <>
        Choose up to 5 pieces with intention.
        <br />
        Mix brands, silhouettes, and occasions.
        <br />
        Your box, your instinct.
      </>
    ),
    subLabel: "YOUR BOX",
    headline: (
      <>
        <span className="text-[#7A021D]">5 pieces.</span>
        <br />
        <span className="text-black">Your Curation.</span>
      </>
    ),
    ctaLabel: "Build Your Box",
    ctaHref: "/box/my-box",
  },
  {
    number: "04",
    titleLine1: "Try at",
    titleLine2: "Home",
    image: STEP_IMAGES["04"],
    stepLabel: "STEP 04",
    body: (
      <>
        Your box is delivered to your door within
        <br />
        24 hours. Try everything with your own
        <br />
        wardrobe, within 48 hours.
      </>
    ),
    subLabel: "YOUR WINDOW",
    headline: (
      <>
        <span className="text-[#7A021D]">48 hours to decide.</span>
        <br />
        <span className="text-black">Take your time.</span>
      </>
    ),
    ctaLabel: "Learn More",
    ctaHref: "/faq",
  },
  {
    number: "05",
    titleLine1: "Keep or",
    titleLine2: "Return",
    image: STEP_IMAGES["05"],
    stepLabel: "STEP 05",
    body: (
      <>
        Your ₹5,000 credit applies to anything
        <br />
        you buy. We collect the rest from your door.
      </>
    ),
    subLabel: "YOUR CHOICE",
    headline: (
      <>
        <span className="text-black">Pay only for</span>
        <br />
        <span className="text-[#7A021D]">what you keep.</span>
      </>
    ),
    ctaLabel: "Get Started",
    ctaHref: "/products",
  },
];

function useInViewOnce(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
}

function fadeUp(visible: boolean, delayMs = 0): string {
  const delayClass = delayMs > 0 ? `[transition-delay:${delayMs}ms]` : "";
  return [
    "transition-all duration-500 ease-out",
    delayClass,
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
  ].join(" ");
}

function DesktopStep({ step, isLast }: { step: Step; isLast?: boolean }) {
  const [ref, visible] = useInViewOnce(0.05);
  const { isAuthenticated } = useAuth();

  return (
    <section ref={ref} className="hidden w-full font-[var(--font-manrope)] md:block">
      <div className="relative h-[4px] w-full overflow-hidden" aria-hidden>
        <div
          className="h-full w-full bg-[#7A021D]"
          style={{
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left center",
            transition: "transform 0.8s ease-out",
          }}
        />
      </div>

      <div
        className={`w-full px-[2.71vw] pt-[4.44vw] ${isLast ? "pb-0" : "pb-[4.17vw]"}`}
      >
        <div
          className={`grid grid-cols-[max-content_1fr] grid-rows-[auto_auto] gap-x-[11.81vw] md:gap-x-[5vw] lg:gap-x-[11.81vw] gap-y-0 text-black ${fadeUp(visible, 100)}`}
        >
          <span className="row-start-1 col-start-1 flex items-start self-start font-medium leading-none tracking-[-0.04em] text-[10.764vw] md:text-[10.417vw] lg:text-[10.764vw] -mt-[0.12em] -mb-[0.12em] w-[10.764vw] md:w-[10.417vw] lg:w-[10.764vw]">
            {step.number}
          </span>

          <h2 className="row-start-1 col-start-2 self-start font-normal text-[5.139vw] md:text-[5.208vw] lg:text-[5.139vw] leading-none tracking-[-0.04em] text-black whitespace-nowrap -mt-[0.12em]">
            {step.titleLine1} {step.titleLine2}
          </h2>

          <div className={`row-start-2 col-start-2 flex items-start gap-[8.33vw] md:gap-[4vw] lg:gap-[8.33vw]`}>
            <div
              className={`relative shrink-0 overflow-hidden ${fadeUp(visible, 220)}`}
              style={{ width: "clamp(180px, 35.28vw, 35.28vw)", aspectRatio: "508 / 462" }}
            >
              <Image
                src={step.image}
                alt={`Step ${step.number} illustration`}
                fill
                className="object-cover"
                sizes="35vw"
              />
            </div>

            <div
              className={`flex flex-1 flex-col justify-between h-full ${fadeUp(visible, 300)}`}
              style={{}}
            >
              <p className="font-semibold text-[0.97vw] md:text-[1.563vw] lg:text-[0.97vw] leading-[1.1] tracking-[-0.04em] uppercase text-black/80">
                {step.stepLabel}
              </p>
              <p className="mt-[1.39vw] font-medium text-[1.389vw] md:text-[1.823vw] lg:text-[1.389vw] leading-[1.6] tracking-[-0.04em] text-black [&_br]:hidden lg:[&_br]:inline">
                {step.body}
              </p>

              <div className="mt-[3.47vw] flex flex-col gap-[1.39vw]">
                <p className="font-semibold text-[0.97vw] md:text-[1.563vw] lg:text-[0.97vw] leading-[1.1] tracking-[-0.04em] uppercase text-black/80">
                  {step.subLabel}
                </p>
                <p className="font-medium text-[2.5vw] md:text-[2.604vw] lg:text-[2.5vw] leading-[1.22] tracking-[-0.04em]">
                  {step.headline}
                </p>
              </div>

              <Link
                href={isAuthenticated ? step.ctaHref : "/request-access"}
                className="mt-auto md:mt-[3.906vw] lg:mt-auto inline-flex h-[5.556vw] md:h-[7.813vw] lg:h-[5.556vw] w-[20.833vw] md:w-[26.042vw] lg:w-[13.889vw] items-center justify-center rounded-full bg-[#7A021D] text-[1.389vw] md:text-[2.083vw] lg:text-[1.389vw] font-medium leading-[1.25] tracking-[-0.04em] text-white"
              >
                {isAuthenticated ? step.ctaLabel : "Request Access"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStep({ step, isLast }: { step: Step; isLast?: boolean }) {
  const [ref, visible] = useInViewOnce(0.05);
  const { isAuthenticated } = useAuth();

  return (
    <section ref={ref} className="w-full font-[var(--font-manrope)] md:hidden">
      <div className="relative h-[2px] w-full overflow-hidden" aria-hidden>
        <div
          className="h-full w-full bg-[#7A021D]"
          style={{
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left center",
            transition: "transform 0.8s ease-out",
          }}
        />
      </div>

      <div
        className={`w-full px-[2.78vw] pt-[5.56vw] sm:px-6 ${isLast ? "pb-0" : "pb-[8.33vw]"}`}
      >
        <div className={`flex items-start gap-[3vw] ${fadeUp(visible, 100)}`}>
          <span className="shrink-0 font-medium text-[22.222vw] leading-none tracking-[-0.04em] text-black -mt-[0.12em]">
            {step.number}
          </span>
          <h2 className="self-start font-normal text-[9.444vw] leading-[1] tracking-[-0.04em] text-black -mt-[0.12em]">
            <span className="block">{step.titleLine1}</span>
            <span className="block">{step.titleLine2}</span>
          </h2>
        </div>

        <div
          className={`relative mt-[2.78vw] w-full overflow-hidden ${fadeUp(visible, 200)}`}
          style={{ aspectRatio: "335 / 309" }}
        >
          <Image
            src={step.image}
            alt={`Step ${step.number} illustration`}
            fill
            className="object-cover"
            sizes="94vw"
          />
        </div>

        <div className={`mt-[5.56vw] ${fadeUp(visible, 280)}`}>
          <p className="font-semibold text-[3.33vw] leading-[1.1] tracking-[-0.04em] uppercase text-black/80">
            {step.stepLabel}
          </p>
          <p className="mt-[2.78vw] font-medium text-[4.44vw] leading-[1.6] tracking-[-0.04em] text-black">
            {step.body}
          </p>

          <div className="mt-[8.33vw] flex flex-col gap-[3.33vw]">
            <p className="font-semibold text-[3.33vw] leading-[1.1] tracking-[-0.04em] uppercase text-black/80">
              {step.subLabel}
            </p>
            <p className="font-medium text-[8.33vw] leading-[1.18] tracking-[-0.04em]">
              {step.headline}
            </p>
          </div>

          <Link
            href={isAuthenticated ? step.ctaHref : "/request-access"}
            className="mt-[7.78vw] inline-flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium leading-[1.25] tracking-[-0.04em] text-white"
          >
            {isAuthenticated ? step.ctaLabel : "Request Access"}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorksSteps() {
  return (
    <div className="w-full bg-white">
      {steps.map((step, index) => (
        <div key={step.number}>
          <DesktopStep step={step} isLast={index === steps.length - 1} />
          <MobileStep step={step} isLast={index === steps.length - 1} />
        </div>
      ))}
    </div>
  );
}
