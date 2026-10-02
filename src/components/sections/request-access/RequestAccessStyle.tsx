"use client";

import { useState } from "react";
import { StepEmblem, ProgressDots, SaveButton } from "./RequestAccessForm";
import type { Step2Data } from "./RequestAccessForm";
import type { FitProfileData } from "./RequestAccessFitProfile";

interface StyleOption {
  key: string;
  title: string;
  mobileTitle?: string;
  desc: string;
}

/* Order follows the mobile Figma — left column top-to-bottom, then right column */
const STYLE_OPTIONS: StyleOption[] = [
  { key: "plan", title: "I plan ahead", desc: "Laid out the night before, sometimes a week ahead." },
  { key: "instinct", title: "I go on instinct", desc: "Grab what feels right. Mood decides everything." },
  { key: "uniform", title: "I have a uniform", mobileTitle: "I have a uniform", desc: "Same formula, different colours. Effortless by design." },
  { key: "guide", title: "I need a guide", desc: "Style isn't my strong suit — yet. Here to learn." },
  { key: "occasion", title: "Occasion decides", mobileTitle: "Occasion\ndecides", desc: "Office, or event — the context sets the look." },
  { key: "scroll", title: "I scroll, then decide", mobileTitle: "I scroll, then\ndecide", desc: "Instagram or Pinterest sets the tone for the day." },
  { key: "chaos", title: "Organised chaos", mobileTitle: "Organised\nchaos", desc: "It looks random. There's actually a system, trust." },
  { key: "rewear", title: "I rewear faithfully", mobileTitle: "I rewear\nfaithfully", desc: "Fewer pieces, worn more. Quality over quantity." },
];

const MOBILE_STYLE_ORDER = ["plan", "instinct", "uniform", "guide", "occasion", "scroll", "chaos", "rewear"] as const;

const getOptionByKey = (key: string) => STYLE_OPTIONS.find((option) => option.key === key);

interface Step4Props {
  s1Data: Step2Data | null;
  s2Data: FitProfileData | null;
  onContinue: () => void;
  onStepSelect: (step: 1 | 2 | 3) => void;
}

export default function RequestAccessStyle({ s1Data, s2Data, onContinue, onStepSelect }: Step4Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (key: string) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. Validation for required Step 1 fields
    const { fullName, phone, email, apartment, locality, city, zip } = s1Data || {};
    if (!fullName || !phone || !email || !apartment || !city || !zip) {
      alert("Please fill in all required fields on the first page.");
      return onStepSelect(1);
    }

    setIsSubmitting(true);
    try {
      // 2. Build Payload
      // Note: unitMap indices mapped: 0 -> cm, 1 -> ft/in
      const payload = {
        full_name: fullName,
        email: email,
        phone_number: phone,
        floor_apartment: `${apartment}${locality ? `, ${locality}` : ""}`,
        city: city,
        zip_code: zip,
        height_value: s2Data?.values.height ? parseFloat(s2Data.values.height) : null,
        height_unit: s2Data?.unitMap.height === 0 ? "cm" : "ft",

        shoulder_width_value: s2Data?.values.shoulder ? parseFloat(s2Data.values.shoulder) : null,
        shoulder_width_unit: s2Data?.unitMap.shoulder === 0 ? "cm" : "in",

        bust_size_value: s2Data?.values.bust ? parseFloat(s2Data.values.bust) : null,
        bust_size_unit: s2Data?.unitMap.bust === 0 ? "cm" : "in",

        waist_size_value: s2Data?.values.waist ? parseFloat(s2Data.values.waist) : null,
        waist_size_unit: s2Data?.unitMap.waist === 0 ? "cm" : "in",

        hips_size_value: s2Data?.values.hips ? parseFloat(s2Data.values.hips) : null,
        hips_size_unit: s2Data?.unitMap.hips === 0 ? "cm" : "in",

        age_value: s2Data?.values.extra ? parseInt(s2Data.values.extra, 10) : null,
        age_unit: "years",

        morning_routine_selections: selected
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-ss.vercel.app";

      const res = await fetch(`${API_URL}/api/onboarding/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data: {
        error?:
          | string
          | {
              message?: string;
              formErrors?: string[];
              fieldErrors?: Record<string, string[]>;
            };
      } = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Submission failed:", data);
        const err = data.error;
        const fieldErrors =
          typeof err === "object" && err ? err.fieldErrors : undefined;
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors)[0]?.[0]
          : undefined;
        const message =
          typeof err === "string"
            ? err
            : err?.message ||
              err?.formErrors?.[0] ||
              firstFieldError ||
              "Submission failed. Please try again.";
        alert(message);
        return;
      }

      onContinue(); // Success -> Confirmation page
    } catch (err) {
      console.error("[SUBMISSION_ERROR]", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full flex flex-col items-center px-3 sm:px-4 lg:px-5 pt-[3.6vh] pb-[3.6vh] lg:pt-[3.6vh] lg:pb-[3.6vh]">
      <StepEmblem />

      <h2 className="font-[var(--font-manrope)] font-normal text-[8.889vw] md:text-[5.859vw] lg:text-[2.5vw] leading-[1.2] tracking-[-0.04em] text-black text-center whitespace-nowrap mb-[8.333vw] md:mb-[3.906vw] lg:mb-[2.083vw]">
        <span className="md:hidden">How do you get<br />dressed?</span>
        <span className="hidden md:inline">How do you get dressed?</span>
      </h2>

      <p className="font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.344vw] lg:text-[1.111vw] leading-[1.5] tracking-[-0.02em] text-[#4e4e4e] text-center mb-[8.333vw] md:mb-[2.083vw] lg:mb-[2.083vw]">
        Pick everything that sounds like you.<br />There are no wrong answers here.
      </p>

      <ProgressDots active={2} onSelect={(index) => onStepSelect((index + 1) as 1 | 2 | 3)} />


      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[694px] flex flex-col items-center mt-[11.111vw] md:mt-[5.208vw] lg:mt-[3.472vw]"
      >
        {/* Mobile grid with exact title-wrap order */}
        <div className="grid w-full grid-cols-2 gap-[10px] md:max-w-[500px] lg:hidden">
          {MOBILE_STYLE_ORDER.map((key) => {
            const option = getOptionByKey(key);
            if (!option) return null;

            return (
              <StyleCard
                key={option.key}
                option={option}
                active={selected.includes(option.key)}
                onToggle={() => toggle(option.key)}
              />
            );
          })}
        </div>

        {/* Desktop grid keeps previous ordering */}
        <div className="hidden w-full lg:grid lg:grid-cols-4 lg:auto-rows-[150px] lg:gap-[12px] lg:justify-center lg:max-w-[636px]">
          {STYLE_OPTIONS.map((opt) => (
            <StyleCard
              key={opt.key}
              option={opt}
              active={selected.includes(opt.key)}
              onToggle={() => toggle(opt.key)}
            />
          ))}
        </div>

        <SaveButton label={isSubmitting ? "Submitting..." : "Submit"} />
      </form>
    </section>
  );
}

/* ─────────────────────── Sub-components ─────────────────────── */

interface StyleCardProps {
  option: StyleOption;
  active: boolean;
  onToggle: () => void;
}

function renderCardTitle(option: StyleOption): { mobile: string; desktop: string } {
  return {
    mobile: option.mobileTitle ?? option.title,
    desktop: option.title,
  };
}

function StyleCard({ option, active, onToggle }: StyleCardProps) {
  const title = renderCardTitle(option);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`group relative w-full aspect-square md:aspect-square md:h-auto rounded-[2px] text-left transition-all duration-200 lg:w-[150px] lg:h-[150px]
        ${active ? "ring-0" : ""}
      `}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 transition-colors
          ${active ? "bg-[#920022]" : "bg-[#F7F4EF]"}
        `}
      />

      {/* Selection indicator circle */}
      <div
        aria-hidden="true"
        className={`absolute top-[8px] left-[8px] h-[36px] w-[36px] rounded-full transition-colors lg:top-[9px] lg:left-[11px] lg:h-[25px] lg:w-[25px]
          ${active ? "bg-white" : "bg-[#D9D9D9]"}
        `}
      />

      {/* Check indicator when active */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute top-[8px] left-[8px] flex h-[36px] w-[36px] items-center justify-center lg:top-[9px] lg:left-[11px] lg:h-[25px] lg:w-[25px]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5l3 3 7-7"
              stroke="#920022"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      {/* Text content */}
      <div className="absolute inset-x-[12px] bottom-[11px] md:bottom-[31px] flex flex-col gap-[10px] lg:inset-x-[12px] lg:bottom-[11px] lg:gap-[4px]">
        <span
          className={`block whitespace-pre-line lg:hidden font-[var(--font-manrope)] font-semibold text-[5vw] md:text-[3.125vw] leading-[1.08] tracking-[-0.02em]
            ${active ? "text-white" : "text-black"}
          `}
        >
          {title.mobile}
        </span>
        <span
          className={`hidden lg:block max-w-[100px] whitespace-pre-line font-[var(--font-manrope)] font-semibold text-[14px] leading-[1.08] tracking-[-0.02em]
            ${active ? "text-white" : "text-black"}
          `}
        >
          {title.desktop}
        </span>
        <span className={`font-[var(--font-manrope)] font-normal text-[2.778vw] md:text-[1.823vw] leading-[1.1] tracking-[-0.02em] lg:max-w-[100px] lg:text-[9px] lg:leading-[1.1] ${active ? "text-white" : "text-black/80"}`}>
          {option.desc}
        </span>
      </div>
    </button>
  );
}
