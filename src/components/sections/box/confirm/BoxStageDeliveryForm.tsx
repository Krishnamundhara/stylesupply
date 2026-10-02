"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";
import { useBox } from "@/context/BoxContext";
import { useAuth } from "@/context/AuthContext";

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

interface UnderlineFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder: string;
  type?: string;
  error?: string;
}

function UnderlineField({ name, value, onChange, onBlur, placeholder, type = "text", error = "" }: UnderlineFieldProps) {
  const isPhoneField = name === "phone";
  const phoneDigits = isPhoneField ? value.replace(/^\+91\s?/, "").replace(/\D/g, "") : "";
  const hasValue = isPhoneField ? phoneDigits.length > 0 : value.length > 0;
  return (
    <div className="w-full">
      <div className="flex flex-col gap-[2.778vw] md:gap-[1.302vw] lg:gap-[0.694vw]">
        <div className="flex items-center gap-[1.111vw] md:gap-[0.521vw] lg:gap-[0.278vw]">
          {isPhoneField && (
            <span className={`font-[var(--font-manrope)] font-medium text-[4.167vw] md:text-[1.953vw] lg:text-[1.042vw] leading-[1.1] tracking-[-0.02em] shrink-0 transition-colors ${hasValue ? "text-black" : "text-[#a0a0a0]"}`}>
              +91
            </span>
          )}
          <input
            type={type}
            name={name}
            value={isPhoneField ? phoneDigits : value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={isPhoneField ? "Receiver's Phone Number" : placeholder}
            className={`w-full bg-transparent border-none outline-none font-[var(--font-manrope)] text-[4.167vw] md:text-[1.953vw] lg:text-[1.042vw] leading-[1.1] tracking-[-0.02em] transition-colors
              ${hasValue ? "font-medium text-black" : "font-medium text-[#a0a0a0] placeholder:text-[#a0a0a0]"}`}
          />
        </div>
        <div className={`w-full h-px transition-colors ${error ? "bg-[#7A021D]" : hasValue ? "bg-black" : "bg-[#e0e0e0]"}`} />
      </div>
      {error && (
        <p className="mt-[0.833vw] md:mt-[0.391vw] lg:mt-[0.278vw] font-[var(--font-manrope)] text-[3.056vw] md:text-[1.432vw] lg:text-[0.764vw] leading-[1.2] tracking-[-0.01em] text-[#7A021D]">{error}</p>
      )}
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

function DropdownField({ label, value, options, onSelect, onChange, onBlur, error = "", searchable = false }: DropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasValue = value.length > 0;

  const filteredOptions = useMemo(() => {
    if (!searchable || value.length === 0) return options;
    return options.filter((o) => o.startsWith(value));
  }, [options, searchable, value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-1 flex-col">
      <div className="flex flex-col gap-[2.778vw] md:gap-[1.302vw] lg:gap-[0.694vw]">
        {searchable ? (
          <div className="flex items-center justify-between w-full">
            <input
              type="text"
              value={value}
              inputMode="numeric"
              placeholder={label}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                onChange?.(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOpen(true);
              }}
              onBlur={() => onBlur?.()}
              className={`w-full bg-transparent border-none outline-none font-[var(--font-manrope)] text-[4.167vw] md:text-[1.953vw] lg:text-[1.042vw] leading-[1.1] tracking-[-0.02em] transition-colors
                ${hasValue ? "font-medium text-black" : "font-medium text-[#a0a0a0] placeholder:text-[#a0a0a0]"}`}
            />
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen((p) => !p)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? "rotate-180" : ""} ${hasValue ? "text-black" : "text-[#a0a0a0]"}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setOpen((p) => !p)} className="flex w-full items-center justify-between">
            <span className={`font-[var(--font-manrope)] text-[4.167vw] md:text-[1.953vw] lg:text-[1.042vw] leading-[1.1] tracking-[-0.02em] transition-colors ${hasValue ? "font-medium text-black" : "font-medium text-[#a0a0a0]"}`}>
              {hasValue ? value : label}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""} ${hasValue ? "text-black" : "text-[#a0a0a0]"}`}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className={`w-full h-px transition-colors ${error ? "bg-[#7A021D]" : hasValue ? "bg-black" : "bg-[#e0e0e0]"}`} />
      </div>
      {error && (
        <p className="mt-[0.833vw] md:mt-[0.391vw] lg:mt-[0.278vw] font-[var(--font-manrope)] text-[3.056vw] md:text-[1.432vw] lg:text-[0.764vw] leading-[1.2] tracking-[-0.01em] text-[#7A021D]">{error}</p>
      )}

      {open && (
        <div className="absolute z-30 top-[calc(100%+8px)] left-0 right-0 max-h-64 overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-[2.778vw] md:rounded-[1.302vw] lg:rounded-[0.694vw] border border-[#E9E9E9] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onSelect(opt); setOpen(false); }}
              className={`w-full px-[3.333vw] md:px-[1.563vw] lg:px-[0.833vw] py-[2.222vw] md:py-[1.042vw] lg:py-[0.556vw] text-left font-[var(--font-manrope)] text-[3.611vw] md:text-[1.693vw] lg:text-[0.903vw] tracking-[-0.02em] transition-colors ${value === opt ? "bg-[#FFF5F7] text-[#7A021D] font-semibold" : "text-black hover:bg-[#F7F7F7]"}`}
            >
              {opt}
            </button>
          )) : <div className="px-[3.333vw] py-[2.222vw] lg:px-[0.833vw] lg:py-[0.556vw]" />}
        </div>
      )}
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden="true" />}
    </div>
  );
}

export default function BoxStageDeliveryForm({
  onConfirm,
  onEdit,
}: {
  onConfirm: () => void;
  onEdit: () => void;
}) {
  const { items } = useBox();
  const { user } = useAuth();
  const gridCount = Math.max(items.length, 1);
  const desktopGridWidth = `calc(${gridCount} * 8.333vw + ${(gridCount - 1) * 5}px)`;
  const mobileGridWidth = `calc(${gridCount} * 18.056vw + ${(gridCount - 1) * 5}px)`;

  const PHONE_PREFIX = "+91 ";
  const formatPhoneValue = (raw: string) => {
    const digits = raw.replace(/^\+91\s?/, "").replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 5) return `${PHONE_PREFIX}${digits}`;
    return `${PHONE_PREFIX}${digits.slice(0, 5)} ${digits.slice(5)}`;
  };

  const [receiverName, setReceiverName] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmarkOrStreet, setLandmarkOrStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [touched, setTouched] = useState({ apartment: false, landmarkOrStreet: false, zip: false, phone: false });

  const pinOptions = useMemo(() => {
    const c = city as (typeof CITY_OPTIONS)[number];
    return CITY_PIN_CODES[c] ?? [];
  }, [city]);

  const phoneDigits = phone.replace(/^\+91\s?/, "").replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 10;
  const isZipValid = zip.length > 0 && pinOptions.includes(zip);
  const isValid = apartment.trim() !== "" && landmarkOrStreet.trim() !== "" && city !== "" && isZipValid && isPhoneValid;

  const apartmentError = touched.apartment && apartment.trim() === "" ? "Please enter your apartment" : "";
  const landmarkOrStreetError =
    touched.landmarkOrStreet && landmarkOrStreet.trim() === "" ? "Please enter your landmark or street" : "";
  const zipError = touched.zip && zip.length === 0
    ? "Please enter your PIN code"
    : touched.zip && !isZipValid
      ? "Please enter a valid PIN code"
      : "";
  const phoneError = touched.phone && !isPhoneValid ? "Please enter a valid 10-digit number" : "";

  const handleCitySelect = (selected: string) => {
    const typedCity = selected as (typeof CITY_OPTIONS)[number];
    const pins = CITY_PIN_CODES[typedCity] ?? [];
    setCity(selected);
    setZip((prev) => (pins.includes(prev) ? prev : ""));
  };

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="mx-auto flex flex-col items-center px-[5.556vw] md:px-[2.604vw] lg:px-[1.389vw] pt-[11.111vw] pb-0 md:pt-[3.472vw] md:pb-0">

        {/* Heading */}
        <h1 className="font-normal leading-[1.2] tracking-[-0.04em] text-black text-[11.111vw] text-center md:text-[6.51vw] lg:text-[5.139vw]">
          Confirm My Box
        </h1>

        {/* Stage dots */}
        <div className="mt-[8.333vw] flex w-[33.333vw] md:w-[8.333vw] items-center gap-[1.528vw] md:mt-[1.389vw] md:gap-[0.382vw]">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-[1.667vw] flex-1 rounded-none transition-colors md:h-[0.417vw]"
              style={{ backgroundColor: i === 0 ? "rgba(122,2,29,0.86)" : "rgba(122,2,29,0.15)" }}
            />
          ))}
        </div>

        {/* Form */}
        <div className="mt-[8.333vw] flex flex-col items-center w-full max-w-[88.889vw] md:max-w-[41.667vw] lg:max-w-[22.222vw] md:mt-[1.389vw]">
          <p className="font-medium text-[5vw] leading-[1.2] tracking-[-0.02em] text-black text-center md:text-[1.823vw] lg:text-[1.389vw]">
            Delivery
          </p>

          <div className="mt-[6.944vw] flex flex-col gap-[5.556vw] w-full md:mt-[1.736vw] md:gap-[1.389vw]">
            <UnderlineField
              name="apartment"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, apartment: true }))}
              placeholder="Floor Number, Apartment"
              error={apartmentError}
            />

            <UnderlineField
              name="landmarkOrStreet"
              value={landmarkOrStreet}
              onChange={(e) => setLandmarkOrStreet(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, landmarkOrStreet: true }))}
              placeholder="Landmark or Street"
              error={landmarkOrStreetError}
            />

            <div className="flex w-full gap-[5.556vw] md:gap-[1.389vw]">
              <DropdownField
                label="City"
                value={city}
                options={[...CITY_OPTIONS]}
                onSelect={handleCitySelect}
              />
              <DropdownField
                label="PIN Code"
                value={zip}
                options={pinOptions}
                onSelect={(v) => { setZip(v); setTouched((p) => ({ ...p, zip: true })); }}
                onChange={(v) => { setZip(v); setTouched((p) => ({ ...p, zip: true })); }}
                onBlur={() => setTouched((p) => ({ ...p, zip: true }))}
                error={zipError}
                searchable
              />
            </div>

            {/* Name row */}
            <UnderlineField
              name="receiverName"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="Receiver's Name"
            />

            {/* Phone number */}
            <UnderlineField
              name="phone"
              value={phone}
              onChange={(e) => setPhone(formatPhoneValue(e.target.value))}
              onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
              placeholder="Receiver's Phone Number"
              type="tel"
              error={phoneError}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setTouched({ apartment: true, landmarkOrStreet: true, zip: true, phone: true });
              if (isValid) onConfirm();
            }}
            className="mt-[8.333vw] flex h-[16.667vw] w-[55.556vw] items-center justify-center rounded-full font-semibold text-[3.889vw] text-white transition-opacity md:mt-[2.083vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:mt-[1.736vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
            style={{
              backgroundColor: isValid ? "#7A021D" : "#BFBFBF",
              letterSpacing: "-0.02em",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            Confirm Address
          </button>
        </div>

        <p
          className="mt-[8.333vw] font-medium text-[4.167vw] leading-[1.4] tracking-[-0.02em] text-black text-center md:mt-[1.736vw] md:text-[1.953vw] lg:text-[1.389vw] md:leading-[1.2]"
        >
          Estimated Delivery before 8pm tomorrow
        </p>
      </div>

      {/* Item Grid with Edit button */}
      <div className="mt-[11.111vw] md:mt-[2.778vw]">
        <div className="relative flex justify-end h-[8.333vw] md:h-auto mb-[2vw] md:mb-[0.694vw] px-[2.778vw] md:px-[1.302vw]"
          style={{ paddingRight: `calc(50% - ${desktopGridWidth} / 2 - 3%)` }}
        >
          <button
            type="button"
            onClick={onEdit}
            className="absolute right-[2.778vw] md:static font-medium underline text-black leading-[1.1] tracking-[-0.02em] text-[4.444vw] md:text-[1.953vw] lg:text-[1.111vw]"
          >
            Edit
          </button>
        </div>
        <BoxItemGrid compact mobileScrollable />
      </div>
    </div>
  );
}
