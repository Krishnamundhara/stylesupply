"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────── STEP 2: Tell us about yourself ─────────────────────── */

export interface Step2Data {
  fullName: string;
  phone: string;
  email: string;
  apartment: string;
  locality: string;
  city: string;
  zip: string;
}

const CITY_OPTIONS = ["Mumbai", "Thane", "Navi Mumbai"] as const;

const CITY_PIN_CODES: Record<(typeof CITY_OPTIONS)[number], string[]> = {
  Mumbai: [
    "400001", "400002", "400003", "400004", "400005", "400006", "400007", "400008", "400009", "400010",
    "400011", "400012", "400013", "400014", "400015", "400016", "400017", "400018", "400019", "400020",
    "400021", "400022", "400023", "400024", "400025", "400026", "400027", "400028", "400029", "400030",
    "400031", "400032", "400033", "400034", "400035", "400036", "400037", "400038", "400039", "400040",
    "400050", "400051", "400052", "400054", "400055", "400056", "400057", "400058", "400059", "400060",
    "400061", "400062", "400063", "400064", "400065", "400066", "400067", "400068", "400069", "400070",
    "400071", "400072", "400073", "400074", "400075", "400076", "400077", "400078", "400079", "400080",
    "400081", "400082", "400083", "400084", "400085", "400086", "400087", "400088", "400089", "400090",
    "400091", "400092", "400093", "400094", "400095", "400096", "400097", "400098", "400099", "400101",
    "400102", "400103", "400104", "400105",
  ],
  Thane: [
    "400601", "400602", "400603", "400604", "400605", "400606", "400607", "400608",
  ],
  "Navi Mumbai": [
    "400701", "400702", "400703", "400614", "400706", "400707", "400709", "400710", "410210", "410206",
  ],
};

interface Step2Props {
  onContinue: (data: Step2Data) => void;
  onStepSelect: (step: 1 | 2 | 3) => void;
}

type RequiredField = "fullName" | "phone" | "email" | "apartment" | "zip";

const PHONE_PREFIX = "+91 ";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatPhoneValue = (rawValue: string) => {
  const valueWithoutPrefix = rawValue.replace(/^\+91\s?/, "");
  const digits = valueWithoutPrefix.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 5) return `${PHONE_PREFIX}${digits}`;
  return `${PHONE_PREFIX}${digits.slice(0, 5)} ${digits.slice(5)}`;
};

export default function RequestAccessForm({ onContinue, onStepSelect }: Step2Props) {
  const [form, setForm] = useState<Step2Data>({
    fullName: "", phone: PHONE_PREFIX, email: "",
    apartment: "", locality: "", city: "", zip: "",
  });
  const [touched, setTouched] = useState<Record<RequiredField, boolean>>({
    fullName: false,
    phone: false,
    email: false,
    apartment: false,
    zip: false,
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((p) => ({ ...p, phone: formatPhoneValue(value) }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const pinOptions = useMemo(() => {
    const city = form.city as (typeof CITY_OPTIONS)[number];
    return CITY_PIN_CODES[city] ?? [];
  }, [form.city]);

  const setField = (name: keyof Step2Data, value: string) =>
    setForm((p) => ({ ...p, [name]: value }));

  const setFieldTouched = (field: RequiredField) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const touchAllRequiredFields = () =>
    setTouched({ fullName: true, phone: true, email: true, apartment: true, zip: true });

  const phoneDigits = form.phone.replace(/^\+91\s?/, "").replace(/\D/g, "");
  const trimmedEmail = form.email.trim();

  const isZipValid = form.zip.length > 0 && pinOptions.includes(form.zip);
  const isPhoneValid = phoneDigits.length === 10;
  const isEmailValid = trimmedEmail.length > 0 && EMAIL_REGEX.test(trimmedEmail);
  const isRequiredFormValid =
    form.fullName.trim().length > 0
    && form.apartment.trim().length > 0
    && isPhoneValid
    && isEmailValid
    && isZipValid;

  const fullNameError = touched.fullName && form.fullName.trim().length === 0 ? "Please enter your full name" : "";
  const phoneError = touched.phone && !isPhoneValid ? "Please enter a valid 10-digit number" : "";
  const emailError = touched.email && trimmedEmail.length === 0
    ? "Please enter your email"
    : touched.email && !isEmailValid
      ? "Please enter a valid email"
      : "";
  const apartmentError = touched.apartment && form.apartment.trim().length === 0 ? "Please enter your apartment" : "";
  const zipError = touched.zip && form.zip.length === 0
    ? "Please enter your PIN code"
    : touched.zip && !isZipValid
      ? "Please enter a valid PIN code"
      : "";

  const handleCitySelect = (city: string) => {
    setForm((p) => {
      const typedCity = city as (typeof CITY_OPTIONS)[number];
      const cityPins = CITY_PIN_CODES[typedCity] ?? [];
      const nextZip = cityPins.includes(p.zip) ? p.zip : "";
      return { ...p, city, zip: nextZip };
    });
  };

  return (
    <section className="w-full flex flex-col items-center px-4 pt-[3.6vh] pb-[3.6vh] lg:pt-[3.6vh] lg:pb-[3.6vh]">
      <StepEmblem />

      <h2 className="font-[var(--font-manrope)] font-normal text-[7.778vw] md:text-[5.859vw] lg:text-[2.5vw] leading-[1.2] tracking-[-0.04em] text-black text-center whitespace-nowrap mb-[4.167vw] md:mb-[2.083vw] lg:mb-[2.083vw]">
        Tell us about yourself
      </h2>

      <p className="font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.344vw] lg:text-[1.111vw] leading-[1.5] tracking-[-0.02em] text-[#4e4e4e] text-center mb-[8.333vw] md:mb-[2.083vw] lg:mb-[2.083vw]">
        <span className="md:hidden">This helps us know who we&apos;re<br />curating for.&nbsp; Your details are private<br />— we&apos;ll never share them.</span>
        <span className="hidden md:inline">This helps us know who we&apos;re curating for.<br />Your details are private — we&apos;ll never share them.</span>
      </p>

      <ProgressDots active={0} onSelect={(index) => onStepSelect((index + 1) as 1 | 2 | 3)} />


      <form
        onSubmit={(e) => {
          e.preventDefault();
          touchAllRequiredFields();
          if (!isRequiredFormValid) return;
          onContinue(form);
        }}
        className="w-full max-w-[694px] flex flex-col items-center mt-[11.111vw] lg:mt-[3.472vw]"
      >
        {/* ── Mobile: single column ── */}
        <div className="w-full flex flex-col gap-3 md:hidden">
          <UnderlineField name="fullName" value={form.fullName} onChange={handle} onBlur={() => setFieldTouched("fullName")} placeholder="Full Name" type="text" error={fullNameError} />
          <UnderlineField name="phone" value={form.phone} onChange={handle} onBlur={() => setFieldTouched("phone")} placeholder="00000 00000" type="tel" error={phoneError} />
          <UnderlineField name="email" value={form.email} onChange={handle} onBlur={() => setFieldTouched("email")} placeholder="Email" type="email" error={emailError} />
          <UnderlineField name="apartment" value={form.apartment} onChange={handle} onBlur={() => setFieldTouched("apartment")} placeholder="Floor Number, Apartment" error={apartmentError} />
          <UnderlineField name="locality" value={form.locality} onChange={handle} placeholder="Landmark / Locality" />
          <div className="flex gap-[10px] w-full">
            <DropdownField label="City" value={form.city} options={[...CITY_OPTIONS]} onSelect={handleCitySelect} />
            <DropdownField label="PIN Code" value={form.zip} options={pinOptions} onSelect={(value) => { setField("zip", value); setFieldTouched("zip"); }} onChange={(value) => { setField("zip", value); if (!touched.zip) setFieldTouched("zip"); }} onBlur={() => setFieldTouched("zip")} error={zipError} searchable />
          </div>
        </div>

        {/* ── Desktop: two columns ── */}
        <div className="hidden md:flex gap-[55px] w-full">
          {/* Col 1: Full Name, Phone, Email */}
          <div className="flex flex-col gap-[34px] flex-1">
            <UnderlineField name="fullName" value={form.fullName} onChange={handle} onBlur={() => setFieldTouched("fullName")} placeholder="Full Name" type="text" error={fullNameError} />
            <UnderlineField name="phone" value={form.phone} onChange={handle} onBlur={() => setFieldTouched("phone")} placeholder="00000 00000" type="tel" error={phoneError} />
            <UnderlineField name="email" value={form.email} onChange={handle} onBlur={() => setFieldTouched("email")} placeholder="Email" type="email" error={emailError} />
          </div>
          {/* Col 2: Address 1, Locality, City + PIN Code */}
          <div className="flex flex-col gap-[34px] flex-1">
            <UnderlineField name="apartment" value={form.apartment} onChange={handle} onBlur={() => setFieldTouched("apartment")} placeholder="Floor Number, Apartment" error={apartmentError} />
            <UnderlineField name="locality" value={form.locality} onChange={handle} placeholder="Landmark / Locality" />
            <div className="flex gap-5 w-full">
              <DropdownField label="City" value={form.city} options={[...CITY_OPTIONS]} onSelect={handleCitySelect} />
              <DropdownField label="PIN Code" value={form.zip} options={pinOptions} onSelect={(value) => { setField("zip", value); setFieldTouched("zip"); }} onChange={(value) => { setField("zip", value); if (!touched.zip) setFieldTouched("zip"); }} onBlur={() => setFieldTouched("zip")} error={zipError} searchable />
            </div>
          </div>
        </div>

        <SaveButton />
      </form>
    </section>
  );
}

/* ─────────────────────── Shared sub-components ─────────────────────── */

export function StepEmblem() {
  return (
    <Image
      src="/logo/ss_red_logo.svg"
      alt="StyleSupply"
      width={120}
      height={145}
      className="w-[56px] h-[67px] mb-6 md:mb-8 md:w-[75px] md:h-[90px] lg:w-[89px] lg:h-[107px] shrink-0 object-contain"
    />
  );
}

export function ProgressDots({
  active,
  onSelect,
}: {
  active: 0 | 1 | 2;
  onSelect?: (index: 0 | 1 | 2) => void;
}) {
  return (
    <div className="flex items-center gap-1.25 mb-4 lg:gap-[5.455px]">
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i as 0 | 1 | 2)}
          aria-label={`Go to step ${i + 1}`}
          className="h-1 w-11 transition-all duration-300 lg:h-[6px] lg:w-[40px]"
          style={{ background: i === active ? "#6b0b23" : "rgba(107,11,35,0.1)" }}
        />
      ))}
    </div>
  );
}

export function SaveButton({ label = "Save & Continue" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="mt-8 md:mt-[3.6vh] font-[var(--font-manrope)] font-bold text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] text-white text-center tracking-[-0.04em] leading-[1.1] bg-[#7A021D] active:scale-[0.98] transition-all duration-200 h-[16.667vw] w-[55.556vw] md:h-[7.813vw] md:w-[20.833vw] lg:h-[5.556vw] lg:w-[16.667vw] rounded-[56px] flex items-center justify-center whitespace-nowrap"
    >
      {label}
    </button>
  );
}

interface UnderlineFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  error?: string;
}

export function UnderlineField({ name, value, onChange, onBlur, placeholder, type = "text", error = "" }: UnderlineFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isPhonePrefillOnly = name === "phone" && value.trim() === "+91";
  const hasCommittedValue = hasValue && !isPhonePrefillOnly;
  const showFilledStyle = hasValue && (!isPhonePrefillOnly || isFocused);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-[10px] lg:gap-[14px]">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`m-0 h-8 w-full border-none bg-transparent p-0 font-[var(--font-manrope)] text-[16px] lg:text-[18px] leading-[1.1] tracking-[-0.02em] outline-none transition-all
            ${showFilledStyle ? "font-medium text-black placeholder:text-black" : "font-medium text-[#a0a0a0] placeholder:text-[#a0a0a0]"}`}
        />
        <div className={`w-full h-px transition-colors ${error ? "bg-[#7A021D]" : hasCommittedValue ? "bg-black" : "bg-[#e0e0e0]"}`} />
      </div>
      <p className="mt-1 min-h-4 font-[var(--font-manrope)] text-[11px] leading-[1.2] tracking-[-0.01em] text-[#7A021D]">
        {error}
      </p>
    </div>
  );
}

interface DropdownFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  searchable?: boolean;
}

function DropdownField({
  label,
  value,
  options,
  onSelect,
  onChange,
  onBlur,
  error = "",
  searchable = false,
}: DropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasValue = value.length > 0;
  const filteredOptions = useMemo(() => {
    if (!searchable || value.length === 0) return options;
    return options.filter((option) => option.startsWith(value));
  }, [options, searchable, value]);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-1 flex-col">
      <div className="flex flex-col gap-[10px] lg:gap-[14px]">
        {searchable ? (
          <div className="flex items-center justify-between h-8 w-full">
            <input
              type="text"
              value={value}
              inputMode="numeric"
              placeholder={label}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "").slice(0, 6);
                onChange?.(numericValue);
                setOpen(true);
              }}
              onBlur={() => onBlur?.()}
              className={`m-0 h-8 w-full appearance-none bg-transparent p-0 font-[var(--font-manrope)] text-[16px] lg:text-[18px] leading-[1.1] tracking-[-0.02em] outline-none border-none transition-colors ${hasValue ? "font-medium text-black" : "font-medium text-[#a0a0a0] placeholder:text-[#a0a0a0]"}`}
            />
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setOpen((p) => !p)}
              className="flex h-8 shrink-0 items-center"
              aria-label={`Toggle ${label} dropdown`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className={`lg:w-4 lg:h-4 transition-transform ${open ? "rotate-180" : ""} text-black`}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex h-8 w-full items-center justify-between"
          >
            <span
              className={`m-0 block font-[var(--font-manrope)] text-[16px] lg:text-[18px] leading-[1.1] tracking-[-0.02em] transition-colors ${hasValue ? "font-medium text-black" : "font-medium text-[#a0a0a0]"}`}
            >
              {hasValue ? value : label}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={`shrink-0 lg:w-4 lg:h-4 transition-transform ${open ? "rotate-180" : ""} ${hasValue ? "text-black" : "text-[#a0a0a0]"}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className={`w-full h-px transition-colors ${error ? "bg-[#7A021D]" : hasValue ? "bg-black" : "bg-[#e0e0e0]"}`} />
      </div>
      <p className="mt-1 min-h-4 font-[var(--font-manrope)] text-[11px] leading-[1.2] tracking-[-0.01em] text-[#7A021D]">
        {error}
      </p>

      {open && (
        <div 
          className="absolute z-30 top-[calc(100%+8px)] left-0 right-0 max-h-64 overflow-y-scroll scrollbar-hide rounded-[10px] border border-[#E9E9E9] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left font-[var(--font-manrope)] text-[13px] lg:text-[14px] tracking-[-0.02em] transition-colors ${value === option ? "bg-[#FFF5F7] text-[#7A021D] font-semibold" : "text-black hover:bg-[#F7F7F7]"}`}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-3 py-2" />
          )}
        </div>
      )}
      {open ? (
        <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden="true" />
      ) : null}
    </div>
  );
}
