"use client";

import { useState } from "react";
import { StepEmblem, ProgressDots, SaveButton } from "./RequestAccessForm";

interface Field {
  key: FitFieldKey;
  label: string;
  units?: readonly [string, string];
}

type FitFieldKey = "height" | "bust" | "hips" | "shoulder" | "waist" | "extra";

export interface FitProfileData {
  values: Record<FitFieldKey, string>;
  unitMap: Record<FitFieldKey, 0 | 1>;
}

/* Mobile order — single column, top-to-bottom */
const MOBILE_FIELDS: Field[] = [
  { key: "extra",    label: "Age" },
  { key: "height",   label: "Height",   units: ["cm", "ft"] as const },
  { key: "shoulder", label: "Shoulder", units: ["cm", "in"] as const },
  { key: "bust",     label: "Bust",     units: ["cm", "in"] as const },
  { key: "waist",    label: "Waist",    units: ["cm", "in"] as const },
  { key: "hips",     label: "Hips",     units: ["cm", "in"] as const },
];

/* Desktop two-column split */
const DESKTOP_LEFT: Field[] = [
  { key: "extra",    label: "Age" },
  { key: "shoulder", label: "Shoulder", units: ["cm", "in"] as const },
  { key: "waist",    label: "Waist",    units: ["cm", "in"] as const },
];

const DESKTOP_RIGHT: Field[] = [
  { key: "height",   label: "Height",   units: ["cm", "ft"] as const },
  { key: "bust",     label: "Bust",     units: ["cm", "in"] as const },
  { key: "hips",     label: "Hips",     units: ["cm", "in"] as const },
];

interface Step3Props {
  onContinue: (data: FitProfileData) => void;
  onStepSelect: (step: 1 | 2 | 3) => void;
}

const normalizeDecimalValue = (rawValue: string) => {
  const cleaned = rawValue.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  if (!cleaned) return "";

  const [wholePart, ...decimalParts] = cleaned.split(".");
  if (decimalParts.length === 0) return wholePart;

  const decimalPart = decimalParts.join("").slice(0, 2);
  const normalizedWhole = wholePart.length > 0 ? wholePart : "0";
  return `${normalizedWhole}.${decimalPart}`;
};

export default function RequestAccessFitProfile({ onContinue, onStepSelect }: Step3Props) {
  const [unitMap, setUnitMap] = useState<Record<FitFieldKey, 0 | 1>>({
    height: 0, bust: 0, hips: 0, shoulder: 0, waist: 0, extra: 0,
  });
  const [values, setValues] = useState<Record<FitFieldKey, string>>({
    height: "", bust: "", hips: "", shoulder: "", waist: "", extra: "",
  });

  const setUnit = (key: FitFieldKey, index: 0 | 1) =>
    setUnitMap((p) => ({ ...p, [key]: index }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "height") {
      // Height supports decimals in cm mode and feet/inches in ft mode.
      if (unitMap.height === 0) {
        const decimalValue = normalizeDecimalValue(value);
        setValues((p) => ({ ...p, [name]: decimalValue }));
        return;
      }

      const cleaned = value
        .replace(/[^0-9']/g, "")
        .replace(/'+/g, "'")
        .replace(/^'/, "");
      const parts = cleaned.split("'");
      const normalized = parts.length > 2 ? `${parts[0]}'${parts.slice(1).join("")}` : cleaned;
      setValues((p) => ({ ...p, [name]: normalized }));
      return;
    }

    if (name === "extra") {
      const numericOnly = value.replace(/\D/g, "");
      setValues((p) => ({ ...p, [name]: numericOnly }));
      return;
    }

    // Measurement fields accept decimals (up to 2 decimal places).
    const decimalValue = normalizeDecimalValue(value);
    setValues((p) => ({ ...p, [name]: decimalValue }));
  };

  const renderRow = (f: Field) => (
    <FitRow
      key={f.key}
      fieldKey={f.key}
      label={f.label}
      units={f.units}
      activeUnitIdx={unitMap[f.key]}
      value={values[f.key]}
      onSelectUnit={(index) => setUnit(f.key, index)}
      onChange={handleChange}
    />
  );

  return (
    <section className="w-full flex flex-col items-center px-5 pt-[3.6vh] pb-[3.6vh] lg:pt-[3.6vh] lg:pb-[3.6vh]">
      <StepEmblem />

      {/* Title — 28px mobile, 36px desktop */}
      <h2 className="font-[var(--font-manrope)] font-normal text-[7.778vw] md:text-[5.859vw] lg:text-[2.5vw] leading-[1.2] tracking-[-0.04em] text-black text-center whitespace-nowrap mb-[8.333vw] md:mb-[3.906vw] lg:mb-[2.083vw]">
        Enter your Fit Profile
      </h2>

      <p className="font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.344vw] lg:text-[1.111vw] leading-[1.5] tracking-[-0.02em] text-[#4e4e4e] text-center mb-[8.333vw] md:mb-[2.083vw] lg:mb-[2.083vw]">
        So we understand what fits you best and<br />recommend accordingly.
      </p>

      <ProgressDots active={1} onSelect={(index) => onStepSelect((index + 1) as 1 | 2 | 3)} />


      <form
        onSubmit={(e) => { e.preventDefault(); onContinue({ values, unitMap }); }}
        className="w-full max-w-[694px] flex flex-col items-center mt-[11.111vw] lg:mt-[3.472vw]"
      >
        {/* Mobile — single column, all 6 fields in the order shown in Figma */}
        <div className="w-full flex flex-col gap-[12px] md:hidden">
          {MOBILE_FIELDS.map(renderRow)}
        </div>

        {/* Desktop — two columns */}
        <div className="hidden w-full md:flex md:gap-[54px]">
          <div className="flex w-[320px] shrink-0 flex-col gap-[34px]">
            {DESKTOP_LEFT.map(renderRow)}
          </div>
          <div className="flex w-[320px] shrink-0 flex-col gap-[34px]">
            {DESKTOP_RIGHT.map(renderRow)}
          </div>
        </div>

        <SaveButton />
      </form>
    </section>
  );
}

/* ─────────────────────── Sub-components ─────────────────────── */

interface FitRowProps {
  fieldKey: string;
  label: string;
  units?: readonly [string, string];
  activeUnitIdx: 0 | 1;
  value: string;
  onSelectUnit: (index: 0 | 1) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FitRow({ fieldKey, label, units, activeUnitIdx, value, onSelectUnit, onChange }: FitRowProps) {
  const filled = value.length > 0;
  const firstUnit = units?.[0];
  const secondUnit = units?.[1];
  const isHeightField = fieldKey === "height";
  const isExtraField = fieldKey === "extra";

  return (
    <div className="flex w-full flex-col gap-[15px] lg:gap-6">
      <div className="flex w-full items-center justify-between gap-3">
        <input
          type="text"
          name={fieldKey}
          value={value}
          onChange={onChange}
          placeholder={label}
          inputMode={isHeightField ? "text" : isExtraField ? "numeric" : "decimal"}
          className={`h-8 font-[var(--font-manrope)] text-[16px] lg:text-[18px] leading-[1.1] tracking-[-0.02em] bg-transparent outline-none border-none flex-1 min-w-0 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${filled
              ? "font-semibold text-black placeholder:text-black placeholder:font-semibold"
              : "font-medium text-[#a0a0a0] placeholder:text-[#a0a0a0] placeholder:font-medium"}`}
        />

        {units ? (
          <div
            role="group"
            aria-label={`Select unit for ${label}`}
            className="relative shrink-0 rounded-full bg-[#FBF4ED] h-8 w-[86px] lg:h-[30px] lg:w-20 p-[3px]"
          >
            <span
              aria-hidden="true"
              className={`absolute left-[3px] top-[3px] rounded-full bg-[#7A021D] h-[26px] w-10 lg:h-6 lg:w-[37px] transition-transform duration-200 ${activeUnitIdx === 0 ? "translate-x-0" : "translate-x-10 lg:translate-x-[37px]"}`}
            />
            <div className="relative z-[1] grid h-full grid-cols-2 items-center">
              <button
                type="button"
                onClick={() => onSelectUnit(0)}
                aria-pressed={activeUnitIdx === 0}
                className={`flex items-center justify-center font-[var(--font-manrope)] text-[10px] lg:text-[12px] tracking-[-0.02em] transition-colors ${activeUnitIdx === 0 ? "font-semibold text-white" : "font-medium text-[#7A021D]"}`}
              >
                {firstUnit}
              </button>
              <button
                type="button"
                onClick={() => onSelectUnit(1)}
                aria-pressed={activeUnitIdx === 1}
                className={`flex items-center justify-center font-[var(--font-manrope)] text-[10px] lg:text-[12px] tracking-[-0.02em] transition-colors ${activeUnitIdx === 1 ? "font-semibold text-white" : "font-medium text-[#7A021D]"}`}
              >
                {secondUnit}
              </button>
            </div>
          </div>
        ) : (
          <span
            aria-hidden="true"
            className="h-8 w-[86px] shrink-0 lg:h-[30px] lg:w-20"
          />
        )}
      </div>

      <div className={`w-full h-px transition-colors ${filled ? "bg-black" : "bg-[#e0e0e0]"}`} />
    </div>
  );
}
