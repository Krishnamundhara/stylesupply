"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/auth";
import { ApiError } from "@/services/api-client";

const GOOGLE_ICON = "/logo/Google.svg";
const FACEBOOK_ICON = "/logo/Facebook.svg";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const GoogleGLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const STATES = [
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function SignupForm() {
  const [stage, setStage] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOAuthMode = searchParams.get('oauth') === 'google';

  // Stage 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Stage 2
  const [apartment, setApartment] = useState("");
  const [locality, setLocality] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const stateRef = useRef<HTMLDivElement>(null);
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setStateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOAuthMode) {
      setStage(2);
    }
  }, [isOAuthMode]);

  const stage1Valid =
    name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8;

  const stage2Valid =
    apartment.trim().length > 0 &&
    locality.trim().length > 0 &&
    selectedState.length > 0 &&
    /^\d{6}$/.test(pincode) &&
    /^\d{10}$/.test(phone) &&
    otpSent &&
    otp.every((d) => d.length === 1);

  // Handle stage 1 submission (validate email, go to stage 2 - no DB write)
  const handleStage1Submit = async () => {
    if (!stage1Valid) return;
    setError("");
    setIsSubmitting(true);

    try {
      // Check if email is available
      const { available } = await authApi.checkEmail(email);
      if (!available) {
        setError("This email is already registered. Please sign in instead.");
        return;
      }
      setStage(2);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP send (mocked - just enables OTP input)
  const handleSendOtp = () => {
    if (phone.length !== 10) return;
    setOtpSent(true);
  };

  // Handle stage 2 submission (verify OTP, then create user or complete onboarding)
  const handleStage2Submit = async () => {
    if (!stage2Valid) return;
    setError("");
    setIsSubmitting(true);

    try {
      // Verify OTP first
      const otpCode = otp.join("");
      const { verified } = await authApi.verifyOtpMock(otpCode);

      if (!verified) {
        setError("Invalid OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (isOAuthMode) {
        // OAuth user - just complete onboarding (already authenticated)
        await authApi.completeOnboarding({
          phone,
          address: {
            apartment,
            locality,
            state: selectedState,
            pincode,
          },
        });
      } else {
        // Email/password user - full registration
        await register({
          email,
          password,
          name,
          phone,
          address: {
            apartment,
            locality,
            state: selectedState,
            pincode,
          },
        });
      }

      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) otpRefs[index + 1].current?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  }

  // Prevents iOS auto-zoom on phones while letting desktop keep its original scale.
  const inputCls =
    "w-full h-[42px] md:h-[46px] rounded-full border border-[#D4D7E3] bg-white px-5 text-[16px] md:text-[14px] text-[#0C1421] placeholder:text-[#8897AD] outline-none focus:border-[#7A021D] transition-colors";

  const labelCls =
    "text-[13px] md:text-[14px] font-normal text-[#0C1421] leading-none tracking-[0.01em]";

  /* ────────── STAGE 2 ────────── */
  if (stage === 2) {
    return (
      <div className="w-full min-h-screen md:h-full flex flex-col items-center justify-center px-5 py-6 md:px-6 md:py-10 gap-5 md:gap-7 max-w-[420px] mx-auto">

        {/* Logo + Intro */}
        <div className="flex flex-col items-center gap-4 md:gap-5 w-full text-center shrink-0">
          <Image
            src="/icon/logo-monogram.svg"
            alt="StyleSupply"
            className="w-[40px] h-[49px] md:w-[56px] md:h-[68px] object-contain shrink-0"
            width={56}
            height={68}
          />
          <div className="flex flex-col gap-3 md:gap-[14px]">
            <h1 className="text-[22px] md:text-[34px] font-semibold text-[#0C1421] leading-none tracking-[-0.02em]">
              {isOAuthMode ? "Complete Your Profile" : "Create Account"}
            </h1>
            <p className="text-[13px] md:text-[15px] text-[#313957] leading-[1.6] tracking-[0.01em]">
              {isOAuthMode
                ? "Just a few more details to get your boxes delivered."
                : "Enter Your Delivery & Contact Details here."}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-3 w-full shrink-0">
          <label className={labelCls}>Enter your delivery address</label>
          <input
            type="text"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder="Floor Number, Apartment"
            className={inputCls}
          />
          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="Road/ Locality, Nearest Landmark"
            className={inputCls}
          />
          {/* State + Pincode row */}
          <div className="flex gap-3 w-full">
            <div ref={stateRef} className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setStateOpen((o) => !o)}
                className={`w-full h-[42px] md:h-[46px] rounded-full border bg-white pl-4 pr-9 text-[16px] md:text-[14px] text-left truncate outline-none transition-colors ${
                  stateOpen ? "border-[#7A021D]" : "border-[#D4D7E3]"
                } ${selectedState ? "text-[#0C1421]" : "text-[#8897AD]"}`}
              >
                {selectedState || "State"}
              </button>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-[#2C0505] rounded-full">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d={stateOpen ? "M9 5L5 1L1 5" : "M1 1L5 5L9 1"} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {stateOpen && (
                <ul className="absolute z-50 top-[46px] left-0 w-[180px] bg-white border border-[#D4D7E3] rounded-[16px] shadow-lg max-h-[200px] overflow-y-auto overscroll-contain py-1">
                  {STATES.map((s) => (
                    <li
                      key={s}
                      onClick={() => { setSelectedState(s); setStateOpen(false); }}
                      className={`px-4 py-2 text-[13px] cursor-pointer transition-colors rounded-[8px] mx-1 ${
                        selectedState === s ? "bg-[#7A021D] text-white" : "text-[#0C1421] hover:bg-[#fcf6f4]"
                      }`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Pincode"
              className="flex-1 min-w-0 h-[42px] md:h-[46px] rounded-full border border-[#D4D7E3] bg-white px-4 text-[16px] md:text-[14px] text-[#0C1421] placeholder:text-[#8897AD] outline-none focus:border-[#7A021D] transition-colors"
            />
          </div>
        </div>

        {/* Contact + OTP */}
        <div className="flex flex-col gap-3 w-full shrink-0">
          <div className="flex flex-col gap-2">
            <label className={labelCls}>Your Contact Number</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[16px] md:text-[14px] text-[#8897AD] pointer-events-none select-none">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setOtpSent(false);
                  setOtp(["", "", "", ""]);
                }}
                className="w-full h-[42px] md:h-[46px] rounded-full border border-[#D4D7E3] bg-white pl-12 pr-[90px] md:pr-[96px] text-[16px] md:text-[14px] text-[#0C1421] outline-none focus:border-[#7A021D] transition-colors"
              />
              <button
                type="button"
                disabled={phone.length !== 10}
                onClick={handleSendOtp}
                className={`absolute right-[4px] top-1/2 -translate-y-1/2 h-[34px] px-4 rounded-full text-[12px] font-semibold text-white transition-all ${
                  phone.length === 10
                    ? "bg-[#7A021D] cursor-pointer"
                    : "bg-[#7A021D]/40 cursor-not-allowed"
                }`}
              >
                {otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="flex flex-col gap-2">
              <label className={labelCls}>Enter OTP <span className="text-[#8897AD] font-normal">(use 1234 for dev)</span></label>
              <div className="flex gap-2 w-full">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="flex-1 min-w-0 h-[42px] md:h-[48px] rounded-full border border-[#D4D7E3] bg-white text-center text-[16px] text-[#0C1421] placeholder:text-[#8897AD] outline-none focus:border-[#7A021D] transition-colors"
                    placeholder="–"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[13px] text-red-600 text-center shrink-0">{error}</p>
        )}

        {/* Create Account button */}
        <button
          type="button"
          disabled={!stage2Valid || isSubmitting}
          onClick={handleStage2Submit}
          className={`w-full h-[46px] md:h-[58px] flex items-center justify-center rounded-full text-white text-[14px] md:text-[17px] font-normal tracking-[0.01em] transition-all shrink-0 ${
            stage2Valid && !isSubmitting
              ? "bg-[#7A021D] active:scale-[0.98] cursor-pointer"
              : "bg-[#888888] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        {!isOAuthMode && (
          <p className="text-center text-[12px] md:text-[14px] text-[#313957] leading-[1.6] shrink-0">
            Already have an account?{" "}
            <Link href="/login" className="text-[#7A021D] hover:underline">
              Sign in
            </Link>
          </p>
        )}

      </div>
    );
  }

  /* ────────── STAGE 1 ────────── */
  return (
    <div className="w-full min-h-screen md:h-full flex flex-col items-center justify-center px-5 py-6 md:px-6 md:py-10 gap-5 md:gap-8 max-w-[420px] mx-auto">

      {/* Logo + Intro */}
      <div className="flex flex-col items-center gap-4 md:gap-5 w-full text-center shrink-0">
        <Image
          src="/icon/logo-monogram.svg"
          alt="StyleSupply"
          className="w-[40px] h-[49px] md:w-[56px] md:h-[68px] object-contain shrink-0"
          width={56}
          height={68}
        />
        <div className="flex flex-col gap-3 md:gap-[14px]">
          <h1 className="text-[22px] md:text-[34px] font-semibold text-[#0C1421] leading-none tracking-[-0.02em]">
            Create Account
          </h1>
          <p className="text-[13px] md:text-[15px] text-[#313957] leading-[1.6] tracking-[0.01em]">
            You&apos;ve been hand selected to be a part of our community. Let&apos;s open the doors to your infinite closet!
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-3 md:gap-4 w-full shrink-0">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Your Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Here" className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Your Email ID</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Here" className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Create Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputCls} />
        </div>
        {error && (
          <p className="text-[13px] text-red-600 text-center">{error}</p>
        )}

        <button
          type="button"
          disabled={!stage1Valid || isSubmitting}
          onClick={handleStage1Submit}
          className={`w-full h-[46px] md:h-[58px] flex items-center justify-center rounded-full text-white text-[14px] md:text-[17px] font-normal tracking-[0.01em] transition-all ${
            stage1Valid && !isSubmitting
              ? "bg-[#7A021D] active:scale-[0.98] cursor-pointer"
              : "bg-[#888888] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Creating account..." : "Continue"}
        </button>
      </div>

      {/* Social sign in */}
      <div className="flex flex-col gap-3 md:gap-4 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#D4D7E3]" />
          <span className="text-[12px] md:text-[14px] text-[#294957] whitespace-nowrap">Or</span>
          <div className="flex-1 h-px bg-[#D4D7E3]" />
        </div>
        <div className="flex gap-2 md:gap-3 w-full">
          <button
            type="button"
            onClick={() => { window.location.href = `${API_URL}/api/auth/google`; }}
            className="flex flex-1 min-w-0 items-center justify-center gap-2 md:gap-3 bg-white rounded-full py-[9px] px-3 text-[11px] md:text-[14px] text-[#313957] active:scale-[0.98] transition-all"
          >
            <Image src={GOOGLE_ICON} alt="Google" className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] shrink-0" width={24} height={24} />
            <span className="truncate">Sign up with Google</span>
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = `${API_URL}/api/auth/facebook`; }}
            className="flex flex-1 min-w-0 items-center justify-center gap-2 md:gap-3 bg-white rounded-full py-[9px] px-3 text-[11px] md:text-[14px] text-[#313957] active:scale-[0.98] transition-all"
          >
            <Image src={FACEBOOK_ICON} alt="Facebook" className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] shrink-0" width={24} height={24} />
            <span className="truncate">Sign up with Facebook</span>
          </button>
        </div>
      </div>

      <p className="text-center text-[12px] md:text-[14px] text-[#313957] leading-[1.6] shrink-0">
        Already have an account?{" "}
        <Link href="/login" className="text-[#7A021D] hover:underline">
          Sign in
        </Link>
      </p>

    </div>
  );
}
