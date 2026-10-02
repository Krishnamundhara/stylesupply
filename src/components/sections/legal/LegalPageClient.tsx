"use client";

import { useState } from "react";
import Image from "next/image";

/* ─── copy ─────────────────────────────────────────────────────────────── */
const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/* ─── tabs ──────────────────────────────────────────────────────────────── */
type Tab = "terms" | "privacy" | "accessibility";

const TABS: { id: Tab; label: string }[] = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "accessibility", label: "Accessibility Statement" },
];

/* ─── content ───────────────────────────────────────────────────────────── */
type Section = { heading: string; paragraphs: string[] };

const CONTENT: Record<Tab, { intro: string; sections: Section[] }> = {
  terms: {
    intro: LOREM_LONG,
    sections: [
      { heading: "Scope", paragraphs: [LOREM_LONG, LOREM_SHORT] },
      { heading: "Definitions", paragraphs: [LOREM_LONG, LOREM_SHORT] },
      {
        heading: "Applicability & Relationship with other policies",
        paragraphs: [LOREM_LONG, LOREM_SHORT],
      },
    ],
  },
  privacy: {
    intro: LOREM_LONG,
    sections: [
      { heading: "Information We Collect", paragraphs: [LOREM_LONG, LOREM_SHORT] },
      { heading: "How We Use Your Data", paragraphs: [LOREM_LONG, LOREM_SHORT] },
      { heading: "Your Rights", paragraphs: [LOREM_LONG, LOREM_SHORT] },
    ],
  },
  accessibility: {
    intro: LOREM_LONG,
    sections: [
      { heading: "Our Commitment", paragraphs: [LOREM_LONG, LOREM_SHORT] },
      { heading: "Standards We Follow", paragraphs: [LOREM_LONG, LOREM_SHORT] },
      { heading: "Contact Us", paragraphs: [LOREM_LONG, LOREM_SHORT] },
    ],
  },
};

const TAB_HEADINGS: Record<Tab, string> = {
  terms: "Style Supply Terms & Conditions",
  privacy: "Privacy Policy",
  accessibility: "Accessibility Statement",
};

export default function LegalPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("terms");
  const { intro, sections } = CONTENT[activeTab];

  return (
    <div className="font-[var(--font-manrope)] w-full bg-white">

      {/* ── "Legal" heading ────────────────────────────────────────────── */}
      <div className="py-[8.333vw] text-center md:py-[3.906vw] lg:py-[4.861vw]">
        <h1 className="text-[12.222vw] font-normal leading-[1.3] tracking-[-0.05em] text-[#25080a] md:text-[7vw] md:leading-none md:tracking-[-0.04em] lg:text-[4.444vw]">
          Legal
        </h1>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 w-full bg-white">
        {/* full-width grey rule */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-black" aria-hidden />

        {/* Mobile: left-aligned, horizontally scrollable */}
        <nav
          className="flex items-center gap-[9.722vw] overflow-x-auto px-5 md:hidden"
          aria-label="Legal sections"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative shrink-0 pb-[14px] pt-[10px] text-[3.889vw] font-medium leading-[1.2] tracking-[-0.04em] whitespace-nowrap transition-colors",
                  isActive ? "text-[#6b0b23]" : "text-black",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#6b0b23]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tablet + Desktop: centered */}
        <nav
          className="mx-auto hidden max-w-[1400px] items-center justify-center gap-[8vw] px-10 md:flex lg:gap-[8.819vw]"
          aria-label="Legal sections"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative pb-[18px] pt-[14px] text-[2vw] font-medium leading-[1.2] tracking-[-0.04em] whitespace-nowrap transition-colors lg:text-[1.25vw]",
                  isActive ? "text-[#6b0b23]" : "text-black",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#6b0b23]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Mobile layout ──────────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Ornament centered */}
        <div className="flex justify-center pt-[13.889vw]">
          <Image
            src="/logo/ss_red_logo.svg"
            alt=""
            width={162}
            height={194}
            className="h-auto"
            style={{ width: 162, height: 194 }}
            priority
          />
        </div>

        {/* Content: single column */}
        <div className="flex flex-col gap-[6.111vw] px-5 pb-[27.778vw] pt-[13.889vw]">
          {/* Section heading + intro */}
          <div className="flex flex-col gap-[3.056vw]">
            <h2 className="text-[4.444vw] font-bold leading-[1.2] tracking-[-0.04em] text-black">
              {TAB_HEADINGS[activeTab]}
            </h2>
            <p className="text-[3.889vw] font-medium leading-[1.6] tracking-[-0.04em] text-black">
              {intro}
            </p>
          </div>

          {/* Remaining sections */}
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-[3.056vw]">
              <h2 className="text-[4.444vw] font-bold leading-[1.2] tracking-[-0.04em] text-black">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-[4.444vw]">
                {section.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-[3.889vw] font-medium leading-[1.6] tracking-[-0.04em] text-black"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tablet layout (768–1023px): single centered column ─────────── */}
      <div className="mx-auto hidden w-full max-w-[700px] flex-col px-[5vw] pb-[13.021vw] pt-[6.510vw] md:flex lg:hidden">
        {/* Ornament centered */}
        <div className="flex justify-center pb-[6.510vw]">
          <Image
            src="/logo/ss_red_logo.svg"
            alt=""
            width={160}
            height={160}
            className="h-auto w-[20.833vw]"
            priority
          />
        </div>

        {/* First section */}
        <div className="flex flex-col gap-[1.302vw]">
          <h2 className="text-[2.604vw] font-bold leading-[1.2] tracking-[-0.04em] text-black">
            {TAB_HEADINGS[activeTab]}
          </h2>
          <p className="text-[1.953vw] font-medium leading-[1.6] tracking-[-0.02em] text-black">
            {intro}
          </p>
        </div>

        {/* Remaining sections */}
        {sections.map((section) => (
          <div key={section.heading} className="flex flex-col gap-[2.604vw]">
            <h2 className="text-[2.604vw] font-bold leading-[1.2] tracking-[-0.04em] text-black">
              {section.heading}
            </h2>
            <div className="flex flex-col gap-[2.083vw]">
              {section.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-[1.953vw] font-medium leading-[1.6] tracking-[-0.02em] text-black"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop layout (1024px+): two-column side-by-side ──────────── */}
      <div className="hidden w-full pr-[1.389vw] pb-[7.639vw] pt-[4.861vw] lg:flex">

        {/* Left — 40% — ornament, sticky */}
        <div className="flex w-[40%] items-start justify-center pt-2">
          <div className="sticky" style={{ top: "calc(var(--header-h, 0px) + 80px)" }}>
            <Image
              src="/logo/ss_red_logo.svg"
              alt=""
              width={248}
              height={300}
              className="h-auto w-[17.222vw]"
              priority
            />
          </div>
        </div>

        {/* Right — 60% — content */}
        <div className="flex w-[60%] flex-col gap-[3.333vw] pl-0">
          {/* First section: heading + intro, tighter gap */}
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-[2.5vw] font-bold leading-[1.2] tracking-[-0.04em] text-black lg:text-[1.528vw]">
              {TAB_HEADINGS[activeTab]}
            </h2>
            <p className="text-[1.8vw] font-medium leading-[1.6] tracking-[-0.02em] text-black lg:text-[1.042vw]">
              {intro}
            </p>
          </div>

          {/* Remaining sections */}
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-[2.5vw] lg:gap-[1.389vw]">
              <h2 className="text-[2.5vw] font-bold leading-[1.2] tracking-[-0.04em] text-black lg:text-[1.528vw]">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-[2vw] lg:gap-[1.111vw]">
                {section.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-[1.8vw] font-medium leading-[1.6] tracking-[-0.02em] text-black lg:text-[1.042vw]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
