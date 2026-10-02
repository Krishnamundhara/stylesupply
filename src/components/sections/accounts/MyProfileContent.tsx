"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profileApi } from "@/services/profile";
import { authApi } from "@/services/auth";
import { ApiError } from "@/services/api-client";
import toast from "react-hot-toast";

/* ── Typography ── */
const SECTION_TITLE =
  "font-[var(--font-manrope)] font-semibold leading-normal tracking-[-0.02em] text-black text-[5.556vw] md:text-[2.604vw] lg:text-[1.667vw]";

const FIELD_LABEL =
  "font-[var(--font-manrope)] font-medium leading-[1.1] tracking-[-0.02em] text-[#4e4e4e] text-[3.889vw] md:text-[2.083vw] lg:text-[0.972vw]";

const FIELD_VALUE =
  "font-[var(--font-manrope)] font-medium leading-[1.1] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.344vw] lg:text-[1.25vw]";

const FIELD_PLACEHOLDER =
  "font-[var(--font-manrope)] font-medium leading-[1.1] tracking-[-0.02em] text-[#a0a0a0] text-[4.444vw] md:text-[2.344vw] lg:text-[1.25vw]";

const FIELD_ERROR =
  "mt-1 font-[var(--font-manrope)] text-[2.778vw] md:text-[1.302vw] lg:text-[0.694vw] leading-[1.2] tracking-[-0.01em] text-[#7A021D]";

/* ── Field component ── */
function Field({
  label,
  value,
  placeholder,
  editable,
  onChange,
  error,
  onBlur,
}: {
  label: string;
  value: string;
  placeholder?: string;
  editable: boolean;
  onChange?: (v: string) => void;
  error?: string;
  onBlur?: () => void;
}) {
  return (
    <div className="flex w-full flex-col">
      <p className={`${FIELD_LABEL} mb-[4.167vw] md:mb-[1.302vw] lg:mb-[1.042vw]`}>{label}</p>
      <div className="flex items-center h-[44px]">
        {editable ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            className={`${FIELD_VALUE} w-full h-full bg-transparent outline-none border-0`}
          />
        ) : (
          <p className={value ? FIELD_VALUE : FIELD_PLACEHOLDER}>
            {value || placeholder || ""}
          </p>
        )}
      </div>
      <div className={`w-full border-b ${error ? "border-[#7A021D]" : "border-black/30"}`} />
      {error && <p className={FIELD_ERROR}>{error}</p>}
    </div>
  );
}

/* ── Date field with custom calendar ── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function DateField({
  value,
  editable,
  onChange,
  error,
  onBlur,
}: {
  value: string; // YYYY-MM-DD or ""
  editable: boolean;
  onChange?: (v: string) => void;
  error?: string;
  onBlur?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parsed = value ? new Date(value + "T00:00:00") : null;
  const today = new Date();

  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear() - 20);
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());
  const [mode, setMode] = useState<"days" | "months" | "years">("days");

  const displayValue = parsed
    ? parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open, onBlur]);

  function select(year: number, month: number, day: number) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange?.(`${year}-${mm}-${dd}`);
    setOpen(false);
    onBlur?.();
  }

  function daysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }

  function firstDayOfMonth(y: number, m: number) {
    return new Date(y, m, 1).getDay();
  }

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = firstDayOfMonth(viewYear, viewMonth);

  // Year range: 100 years back from today
  const yearStart = today.getFullYear() - 100;
  const yearEnd = today.getFullYear();
  const years = Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearEnd - i);

  return (
    <div ref={ref} className="relative flex w-full flex-col">
      <p className={`${FIELD_LABEL} mb-[4.167vw] md:mb-[1.302vw] lg:mb-[1.042vw]`}>Birthday</p>
        <div className="flex items-center justify-between h-[44px]">
          {editable ? (
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className={`${displayValue ? FIELD_VALUE : FIELD_PLACEHOLDER} flex-1 text-left h-full bg-transparent`}
            >
              {displayValue || "DD / MM / YYYY"}
            </button>
          ) : (
            <p className={displayValue ? FIELD_VALUE : FIELD_PLACEHOLDER}>
              {displayValue || ""}
            </p>
          )}
          {editable && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#4e4e4e]">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      <div className={`w-full border-b ${error ? "border-[#7A021D]" : "border-black/30"}`} />
      {error && <p className={FIELD_ERROR}>{error}</p>}

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => { setOpen(false); onBlur?.(); }} aria-hidden />
          <div className="absolute z-30 top-[calc(100%+8px)] left-0 w-[300px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#f0f0f0] p-4 font-[var(--font-manrope)]">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
                  else setViewMonth(m => m - 1);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors text-[#2C0505] ${mode !== "days" ? "invisible" : ""}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMode(m => m === "months" ? "days" : "months")}
                  className="text-[13px] font-semibold text-[#2C0505] px-2 py-1 rounded-lg hover:bg-[#f5f5f5] transition-colors"
                >
                  {MONTHS[viewMonth]}
                </button>
                <button
                  type="button"
                  onClick={() => setMode(m => m === "years" ? "days" : "years")}
                  className="text-[13px] font-semibold text-[#2C0505] px-2 py-1 rounded-lg hover:bg-[#f5f5f5] transition-colors"
                >
                  {viewYear}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
                  else setViewMonth(m => m + 1);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors text-[#2C0505] ${mode !== "days" ? "invisible" : ""}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Month picker */}
            {mode === "months" && (
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setViewMonth(i); setMode("days"); }}
                    className={`py-2 rounded-lg text-[12px] font-medium transition-colors ${i === viewMonth ? "bg-[#7A021D] text-white" : "text-[#2C0505] hover:bg-[#f5f5f5]"}`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {/* Year picker */}
            {mode === "years" && (
              <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => { setViewYear(y); setMode("days"); }}
                    className={`py-2 rounded-lg text-[12px] font-medium transition-colors ${y === viewYear ? "bg-[#7A021D] text-white" : "text-[#2C0505] hover:bg-[#f5f5f5]"}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {/* Day grid */}
            {mode === "days" && (
              <>
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] font-semibold text-[#a0a0a0] py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = parsed?.getFullYear() === viewYear && parsed?.getMonth() === viewMonth && parsed?.getDate() === day;
                    const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => select(viewYear, viewMonth, day)}
                        className={`aspect-square w-full flex items-center justify-center rounded-full text-[12px] font-medium transition-colors
                          ${isSelected ? "bg-[#7A021D] text-white" : isToday ? "border border-[#7A021D] text-[#7A021D]" : "text-[#2C0505] hover:bg-[#f5f5f5]"}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Phone field ── */
function PhoneField({
  value,
  editable,
  onChange,
  error,
  onBlur,
}: {
  value: string;
  editable: boolean;
  onChange?: (v: string) => void;
  error?: string;
  onBlur?: () => void;
}) {
  const digits = value.replace(/\D/g, "").slice(-10);
  const display = value ? `+91 ${digits}` : "";

  return (
    <div className="flex w-full flex-col">
      <p className={`${FIELD_LABEL} mb-[4.167vw] md:mb-[1.302vw] lg:mb-[1.042vw]`}>Phone Number</p>
        <div className="flex items-center h-[44px] gap-[8px]">
          {editable ? (
            <>
              <span className={`${FIELD_VALUE} shrink-0`}>+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={digits}
                onChange={(e) => {
                  const num = e.target.value.replace(/\D/g, "").slice(0, 10);
                  onChange?.(num);
                }}
                onBlur={onBlur}
                placeholder="00000 00000"
                className={`${FIELD_VALUE} flex-1 h-full bg-transparent outline-none border-0 placeholder:text-[#a0a0a0]`}
              />
            </>
          ) : (
            <p className={display ? FIELD_VALUE : FIELD_PLACEHOLDER}>
              {display || ""}
            </p>
          )}
        </div>
      <div className={`w-full border-b ${error ? "border-[#7A021D]" : "border-black/30"}`} />
      {error && <p className={FIELD_ERROR}>{error}</p>}
    </div>
  );
}

/* ── Unit toggle pill ── */
function UnitToggle({ unit, unitA, unitB, onToggle }: { unit: string; unitA: string; unitB: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative flex shrink-0 items-center rounded-full bg-[#fbf4ed] p-1"
    >
      <span
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[#7a021d] transition-[left] duration-200 ease-out ${unit === unitA ? "left-1" : "left-[calc(50%+3px)]"}`}
        aria-hidden
      />
      <span className={`relative z-10 min-w-[6vw] md:min-w-[3.125vw] lg:min-w-[2rem] py-1 text-center font-[var(--font-manrope)] text-[3.333vw] md:text-[1.563vw] lg:text-[0.833vw] transition-colors duration-200 ${unit === unitA ? "font-semibold text-white" : "font-medium text-[#7a021d]"}`}>
        {unitA}
      </span>
      <span className={`relative z-10 min-w-[6vw] md:min-w-[3.125vw] lg:min-w-[2rem] py-1 text-center font-[var(--font-manrope)] text-[3.333vw] md:text-[1.563vw] lg:text-[0.833vw] transition-colors duration-200 ${unit === unitB ? "font-semibold text-white" : "font-medium text-[#7a021d]"}`}>
        {unitB}
      </span>
    </button>
  );
}

/* ── Measurement field ── */
function MeasurementField({
  label,
  value,
  unit,
  unitA,
  unitB,
  editable,
  onChange,
  onToggleUnit,
  error,
  onBlur,
}: {
  label: string;
  value: string;
  unit: string;
  unitA: string;
  unitB: string;
  editable: boolean;
  onChange?: (v: string) => void;
  onToggleUnit: () => void;
  error?: string;
  onBlur?: () => void;
}) {
  return (
    <div className="flex w-full flex-col">
      <p className={`${FIELD_LABEL} mb-[4.167vw] md:mb-[1.302vw] lg:mb-[1.042vw]`}>{label}</p>
      <div className="flex items-center justify-between h-[44px]">
        {editable ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            className={`${FIELD_VALUE} flex-1 h-full bg-transparent outline-none border-0`}
          />
        ) : (
          <p className={value ? FIELD_VALUE : FIELD_PLACEHOLDER}>{value || "—"}</p>
        )}
        <UnitToggle unit={unit} unitA={unitA} unitB={unitB} onToggle={onToggleUnit} />
      </div>
      <div className={`w-full border-b ${error ? "border-[#7A021D]" : "border-black/30"}`} />
      {error && <p className={FIELD_ERROR}>{error}</p>}
    </div>
  );
}

/* ── Edit/Save button ── */
function EditSaveButton({ editing, saving, onEdit, onSave }: { editing: boolean; saving: boolean; onEdit: () => void; onSave: () => void }) {
  return editing ? (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="font-[var(--font-manrope)] font-semibold leading-[1.1] text-[#7a021d] text-[3.889vw] md:text-[2.083vw] lg:text-[0.972vw] tracking-[-0.02em] disabled:opacity-50"
    >
      Save
    </button>
  ) : (
    <button
      type="button"
      onClick={onEdit}
      className="font-[var(--font-manrope)] font-semibold leading-[1.1] text-[#7a021d] text-[3.889vw] md:text-[2.083vw] lg:text-[0.972vw] tracking-[-0.02em]"
    >
      Edit
    </button>
  );
}

/* ── Validation helpers ── */
const PHONE_RE = /^\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUM_RE = /^\d+(\.\d+)?$/;

function validatePersonal(f: { fullName: string; phone: string; email: string }, touched: Record<string, boolean>) {
  return {
    fullName: touched.fullName && !f.fullName.trim() ? "Please enter your full name" : "",
    phone: touched.phone && !PHONE_RE.test(f.phone) ? "Please enter a valid 10-digit number" : "",
    email: touched.email
      ? !f.email.trim()
        ? "Please enter your email"
        : !EMAIL_RE.test(f.email.trim())
        ? "Please enter a valid email"
        : ""
      : "",
  };
}

function validateMeasurements(f: { age: string; height: string; shoulder: string; bust: string; waist: string; hips: string }, touched: Record<string, boolean>) {
  const numErr = (key: string, val: string, label: string) =>
    touched[key] && val.trim() && !NUM_RE.test(val.trim()) ? `${label} must be a number` : "";
  return {
    age: touched.age && f.age.trim() && !/^\d+$/.test(f.age.trim()) ? "Age must be a whole number" : "",
    height: numErr("height", f.height, "Height"),
    shoulder: numErr("shoulder", f.shoulder, "Shoulder"),
    bust: numErr("bust", f.bust, "Bust"),
    waist: numErr("waist", f.waist, "Waist"),
    hips: numErr("hips", f.hips, "Hips"),
  };
}

function validateAddress(f: { addressLine1: string; city: string; zip: string }, touched: Record<string, boolean>) {
  return {
    addressLine1: touched.addressLine1 && !f.addressLine1.trim() ? "Please enter address line 1" : "",
    city: touched.city && !f.city.trim() ? "Please enter your city" : "",
    zip: touched.zip && !f.zip.trim()
      ? "Please enter your ZIP code"
      : touched.zip && f.zip.trim() && !/^\d{6}$/.test(f.zip.trim())
      ? "Please enter a valid 6-digit PIN code"
      : "",
  };
}

/* ── Main component ── */
export default function MyProfileContent() {
  const [editPersonal, setEditPersonal] = useState(false);
  const [editMeasurements, setEditMeasurements] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const [touchedPersonal, setTouchedPersonal] = useState<Record<string, boolean>>({});
  const [touchedMeasurements, setTouchedMeasurements] = useState<Record<string, boolean>>({});
  const [touchedAddress, setTouchedAddress] = useState<Record<string, boolean>>({});

  const [units, setUnits] = useState({ height: "cm" as "cm" | "ft", shoulder: "cm" as "cm" | "in", bust: "cm" as "cm" | "in", waist: "cm" as "cm" | "in", hips: "cm" as "cm" | "in" });
  const toggleUnit = useCallback((key: "height" | "shoulder" | "bust" | "waist" | "hips") => () => {
    setUnits((prev) => {
      if (key === "height") return { ...prev, height: prev.height === "cm" ? "ft" : "cm" };
      return { ...prev, [key]: prev[key as "shoulder" | "bust" | "waist" | "hips"] === "cm" ? "in" : "cm" };
    });
  }, []);

  const [fields, setFields] = useState({
    fullName: "",
    birthday: "",
    email: "",
    phone: "",
    age: "",
    height: "",
    shoulder: "",
    bust: "",
    waist: "",
    hips: "",
    addressLine1: "",
    addressLine2: "",
    receiverName: "",
    city: "",
    zip: "",
  });

  /* Load profile from API */
  useEffect(() => {
    async function load() {
      try {
        const [data, meData] = await Promise.all([profileApi.get(), authApi.getMe().catch(() => null)]);
        if (data.profile) {
          setFields((prev) => ({
            ...prev,
            fullName: data.profile?.full_name ?? "",
            birthday: data.profile?.dob ?? "",
            email: meData?.user?.email ?? "",
            phone: (data.profile?.phone ?? "").replace(/^\+91/, ""),
            age: data.profile?.age ?? "",
            height: data.profile?.height ?? "",
            shoulder: data.profile?.shoulder ?? "",
            bust: data.profile?.bust ?? "",
            waist: data.profile?.waist ?? "",
            hips: data.profile?.hips ?? "",
          }));
        }
        if (data.address) {
          setFields((prev) => ({
            ...prev,
            addressLine1: data.address?.apartment ?? "",
            addressLine2: data.address?.locality ?? "",
            city: data.address?.state ?? "",
            zip: data.address?.pincode ?? "",
          }));
        }
      } catch {
        // Silently fail
      }
    }
    load();
  }, []);

  const set = useCallback(
    (key: keyof typeof fields) => (val: string) =>
      setFields((prev) => ({ ...prev, [key]: val })),
    []
  );

  const touch = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, key: string) =>
    setter((prev) => ({ ...prev, [key]: true }));

  const touchAll = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, keys: string[]) =>
    setter(Object.fromEntries(keys.map((k) => [k, true])));

  /* Derived errors */
  const personalErrors = validatePersonal(fields, touchedPersonal);
  const measurementErrors = validateMeasurements(fields, touchedMeasurements);
  const addressErrors = validateAddress(fields, touchedAddress);

  const personalValid = !Object.values(validatePersonal(
    fields,
    { fullName: true, phone: true, email: true }
  )).some(Boolean);

  const measurementsValid = !Object.values(validateMeasurements(
    fields,
    { age: true, height: true, shoulder: true, bust: true, waist: true, hips: true }
  )).some(Boolean);

  const addressValid = !Object.values(validateAddress(
    fields,
    { addressLine1: true, city: true, zip: true }
  )).some(Boolean);

  const handleSavePersonal = async () => {
    touchAll(setTouchedPersonal, ["fullName", "phone", "email"]);
    if (!personalValid) return;
    setLoadingPersonal(true);
    const toastId = toast.loading("Saving…");
    try {
      await profileApi.update({ full_name: fields.fullName, dob: fields.birthday, phone: fields.phone ? `+91${fields.phone}` : "" });
      toast.dismiss(toastId);
      toast.success("Personal info updated");
      setEditPersonal(false);
      setTouchedPersonal({});
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    } finally {
      setLoadingPersonal(false);
    }
  };

  const handleSaveMeasurements = async () => {
    touchAll(setTouchedMeasurements, ["age", "height", "shoulder", "bust", "waist", "hips"]);
    if (!measurementsValid) return;
    setLoadingMeasurements(true);
    const toastId = toast.loading("Saving…");
    try {
      await profileApi.update({ age: fields.age, height: fields.height, shoulder: fields.shoulder, bust: fields.bust, waist: fields.waist, hips: fields.hips });
      toast.dismiss(toastId);
      toast.success("Measurements updated");
      setEditMeasurements(false);
      setTouchedMeasurements({});
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    } finally {
      setLoadingMeasurements(false);
    }
  };

  const handleSaveAddress = async () => {
    touchAll(setTouchedAddress, ["addressLine1", "city", "zip"]);
    if (!addressValid) return;
    setLoadingAddress(true);
    const toastId = toast.loading("Saving…");
    try {
      await profileApi.updateAddress({ apartment: fields.addressLine1, locality: fields.addressLine2, state: fields.city, pincode: fields.zip });
      toast.dismiss(toastId);
      toast.success("Address updated");
      setEditAddress(false);
      setTouchedAddress({});
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err instanceof ApiError ? err.message : "Failed to update");
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col px-[5.556vw] md:px-[6.51vw] lg:px-[15.278vw]">

      {/* Heading */}
      <h1 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[8.889vw] md:text-[5.208vw] lg:text-[4.444vw] text-center pt-[8.333vw] md:pt-[3.906vw] lg:pt-0">
        My Profile
      </h1>

      {/* ── Personal Info ── */}
      <div className="flex flex-col gap-[5.556vw] md:gap-[2.604vw] lg:gap-[2.083vw] mt-[13.889vw] md:mt-[6.51vw] lg:mt-[3.472vw]">
        <div className="flex flex-col gap-[1.5vw] lg:gap-[0.556vw]">
          <div className="flex items-center justify-between">
            <p className={SECTION_TITLE}>Personal Info</p>
            <EditSaveButton editing={editPersonal} saving={loadingPersonal} onEdit={() => setEditPersonal(true)} onSave={handleSavePersonal} />
          </div>
          {editPersonal && (
            <span className="flex items-center gap-[1.111vw] lg:gap-[0.278vw] font-[var(--font-manrope)] font-normal text-[#a0a0a0] text-[3.333vw] lg:text-[0.833vw] tracking-[-0.02em]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M14.166 2.5a1.768 1.768 0 0 1 2.5 2.5L6.25 15.417l-3.333.833.833-3.333L14.166 2.5Z" stroke="#a0a0a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Currently editing
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[8.333vw] md:gap-[3.906vw] lg:grid lg:grid-cols-2 lg:gap-x-[3.819vw] lg:gap-y-[2.083vw]">
          <Field label="Full Name" value={fields.fullName} editable={editPersonal} onChange={set("fullName")} error={personalErrors.fullName} onBlur={() => touch(setTouchedPersonal, "fullName")} />
          <Field label="Email Address" value={fields.email} editable={editPersonal} onChange={set("email")} error={personalErrors.email} onBlur={() => touch(setTouchedPersonal, "email")} />
          <DateField value={fields.birthday} editable={editPersonal} onChange={set("birthday")} />
          <PhoneField value={fields.phone} editable={editPersonal} onChange={set("phone")} error={personalErrors.phone} onBlur={() => touch(setTouchedPersonal, "phone")} />
        </div>
      </div>

      {/* ── Size & Measurement ── */}
      <div className="flex flex-col gap-[5.556vw] md:gap-[2.604vw] lg:gap-[2.083vw] mt-[13.889vw] md:mt-[6.51vw] lg:mt-[3.472vw]">
        <div className="flex flex-col gap-[1.5vw] lg:gap-[0.556vw]">
          <div className="flex items-center justify-between">
            <p className={SECTION_TITLE}>Size &amp; Measurement</p>
            <EditSaveButton editing={editMeasurements} saving={loadingMeasurements} onEdit={() => setEditMeasurements(true)} onSave={handleSaveMeasurements} />
          </div>
          {editMeasurements && (
            <span className="flex items-center gap-[1.111vw] lg:gap-[0.278vw] font-[var(--font-manrope)] font-normal text-[#a0a0a0] text-[3.333vw] lg:text-[0.833vw] tracking-[-0.02em]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M14.166 2.5a1.768 1.768 0 0 1 2.5 2.5L6.25 15.417l-3.333.833.833-3.333L14.166 2.5Z" stroke="#a0a0a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Currently editing
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[8.333vw] md:gap-[3.906vw] lg:grid lg:grid-cols-2 lg:gap-x-[3.819vw] lg:gap-y-[2.083vw]">
          <Field label="Age" value={fields.age} editable={editMeasurements} onChange={set("age")} error={measurementErrors.age} onBlur={() => touch(setTouchedMeasurements, "age")} />
          <MeasurementField label="Height" value={fields.height} unit={units.height} unitA="cm" unitB="ft" editable={editMeasurements} onChange={set("height")} onToggleUnit={toggleUnit("height")} error={measurementErrors.height} onBlur={() => touch(setTouchedMeasurements, "height")} />
          <MeasurementField label="Shoulder" value={fields.shoulder} unit={units.shoulder} unitA="cm" unitB="in" editable={editMeasurements} onChange={set("shoulder")} onToggleUnit={toggleUnit("shoulder")} error={measurementErrors.shoulder} onBlur={() => touch(setTouchedMeasurements, "shoulder")} />
          <MeasurementField label="Bust" value={fields.bust} unit={units.bust} unitA="cm" unitB="in" editable={editMeasurements} onChange={set("bust")} onToggleUnit={toggleUnit("bust")} error={measurementErrors.bust} onBlur={() => touch(setTouchedMeasurements, "bust")} />
          <MeasurementField label="Waist" value={fields.waist} unit={units.waist} unitA="cm" unitB="in" editable={editMeasurements} onChange={set("waist")} onToggleUnit={toggleUnit("waist")} error={measurementErrors.waist} onBlur={() => touch(setTouchedMeasurements, "waist")} />
          <MeasurementField label="Hips" value={fields.hips} unit={units.hips} unitA="cm" unitB="in" editable={editMeasurements} onChange={set("hips")} onToggleUnit={toggleUnit("hips")} error={measurementErrors.hips} onBlur={() => touch(setTouchedMeasurements, "hips")} />
        </div>
      </div>

      {/* ── Delivery Address ── */}
      <div className="flex flex-col gap-[5.556vw] lg:gap-[2.083vw] mt-[13.889vw] md:mt-[3.906vw] lg:mt-[3.472vw]">
        <div className="flex flex-col gap-[1.5vw] lg:gap-[0.556vw]">
          <div className="flex items-center justify-between">
            <p className={SECTION_TITLE}>Delivery Address</p>
            <EditSaveButton editing={editAddress} saving={loadingAddress} onEdit={() => setEditAddress(true)} onSave={handleSaveAddress} />
          </div>
          {editAddress && (
            <span className="flex items-center gap-[1.111vw] lg:gap-[0.278vw] font-[var(--font-manrope)] font-normal text-[#a0a0a0] text-[3.333vw] lg:text-[0.833vw] tracking-[-0.02em]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M14.166 2.5a1.768 1.768 0 0 1 2.5 2.5L6.25 15.417l-3.333.833.833-3.333L14.166 2.5Z" stroke="#a0a0a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Currently editing
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[8.333vw] md:gap-[3.906vw] lg:grid lg:grid-cols-2 lg:gap-x-[3.819vw] lg:gap-y-[2.083vw]">
          <Field label="Address Line 1" value={fields.addressLine1} placeholder="Floor Number, Apartment" editable={editAddress} onChange={set("addressLine1")} error={addressErrors.addressLine1} onBlur={() => touch(setTouchedAddress, "addressLine1")} />
          <Field label="Address Line 2" value={fields.addressLine2} placeholder="Street Name, Landmark, Locality" editable={editAddress} onChange={set("addressLine2")} />
          <Field label="Receiver Name" value={fields.receiverName} editable={editAddress} onChange={set("receiverName")} />
          <div className="grid grid-cols-2 gap-[5.556vw] lg:gap-[2.778vw]">
            <Field label="City" value={fields.city} editable={editAddress} onChange={set("city")} error={addressErrors.city} onBlur={() => touch(setTouchedAddress, "city")} />
            <Field label="Zip Code" value={fields.zip} editable={editAddress} onChange={set("zip")} error={addressErrors.zip} onBlur={() => touch(setTouchedAddress, "zip")} />
          </div>
        </div>
      </div>


    </div>
  );
}
