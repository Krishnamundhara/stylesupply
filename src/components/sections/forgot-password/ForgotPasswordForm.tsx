"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const otpRefs = [ref0, ref1, ref2, ref3];

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(24);
    setCanResend(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      // TODO: call send OTP API with email
      await new Promise((r) => setTimeout(r, 800));
      setStep("otp");
      startCountdown();
      setTimeout(() => ref0.current?.focus(), 100);
      toast.success("Verification code sent!");
    } catch {
      toast.error("Failed to send code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    setIsSubmitting(true);
    try {
      // TODO: call resend OTP API
      await new Promise((r) => setTimeout(r, 800));
      startCountdown();
      setTimeout(() => ref0.current?.focus(), 100);
      toast.success("Code resent!");
    } catch {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.every((d) => d.length === 1)) return;
    setIsSubmitting(true);
    try {
      // TODO: call verify OTP API
      await new Promise((r) => setTimeout(r, 800));
      // TODO: redirect to reset-password page
    } catch {
      toast.error("Invalid code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-[8.333vw] md:py-[3.906vw] lg:py-[2.083vw]">
      <div className="w-[89.444vw] md:w-[55vw] lg:w-[22.222vw] flex flex-col gap-[9.722vw] md:gap-[3.906vw] lg:gap-[1.389vw]">

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo/ss_red_logo.svg"
            alt="StyleSupply"
            width={120}
            height={150}
            className="w-[18.056vw] h-[22.222vw] md:w-[10.417vw] md:h-[13.021vw] lg:w-[8.333vw] lg:h-[10.417vw] object-contain"
          />
        </div>

        {/* Intro */}
        <div className="flex flex-col items-center gap-[4.167vw] md:gap-[1.953vw] lg:gap-[0.833vw] text-center">
          <h1 className="font-[var(--font-manrope)] font-medium text-[#0c1421] text-[9.444vw] md:text-[4.427vw] lg:text-[3.056vw] leading-none tracking-[-0.05em]">
            Forgot Password
          </h1>
          <p className="font-[var(--font-manrope)] font-normal text-[#313957] text-[3.889vw] md:text-[2.344vw] lg:text-[0.972vw] leading-[1.6] tracking-[-0.02em] w-full">
            {step === "email"
              ? <>Secure your account with a verification code.<br />You may reset your password in Account Settings.</>
              : <>{`We sent a code to ${email}.`}<br />{" Enter it below."}</>}
          </p>
        </div>

        {/* Step 1 — Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-[5.556vw] md:gap-[3.255vw] lg:gap-[1.389vw]">
            <div className="flex flex-col gap-[2.222vw] md:gap-[1.953vw] lg:gap-[0.556vw]">
              <label className="font-[var(--font-manrope)] font-normal text-[#0c1421] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] leading-none tracking-[0.01em]">
                Enter Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@email.com"
                className="w-full h-[13.889vw] md:h-[6.51vw] lg:h-[3.472vw] rounded-full border border-[#d4d7e3] bg-white px-[5.556vw] md:px-[3.255vw] lg:px-[1.458vw] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] text-[#0c1421] placeholder:text-[#8897ad] outline-none focus:border-[#7a021d] transition-colors"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="w-full lg:w-[16.667vw] h-[13.889vw] md:h-[6.51vw] lg:h-[5.556vw] flex items-center justify-center bg-[#6b0b23] rounded-full text-white font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.344vw] lg:text-[1.389vw] tracking-[0.01em] disabled:bg-[#A0A0A0] disabled:cursor-not-allowed"
              >
                Send Code
              </button>
            </div>

            <p className="text-center font-[var(--font-manrope)] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] text-[#313957] leading-[1.6] tracking-[0.01em]">
              Remember your password?{" "}
              <Link href="/login" className="text-[#7a021d]">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-[5.556vw] md:gap-[3.255vw] lg:gap-[1.389vw]">
            <div className="flex flex-col gap-[2.222vw] md:gap-[1.302vw] lg:gap-[0.556vw]">
              <label className="font-[var(--font-manrope)] font-normal text-[#0c1421] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] leading-none tracking-[0.01em]">
                Enter Verification Code
              </label>
              <div className="flex gap-[2.778vw] md:gap-[1.628vw] lg:gap-[0.694vw] justify-center">
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
                    className="w-[20vw] h-[13.889vw] md:w-[11.719vw] md:h-[8.138vw] lg:w-[5vw] lg:h-[3.472vw] rounded-full border border-[#d4d7e3] bg-white text-center text-[4.444vw] md:text-[2.604vw] lg:text-[1.111vw] text-[#0c1421] outline-none focus:border-[#7a021d] transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Resend row */}
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isSubmitting}
                className={`font-[var(--font-manrope)] font-normal text-[#7a021d] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] tracking-[0.01em] transition-opacity ${!canResend ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                Resend
              </button>
              {countdown > 0 && (
                <span className="font-[var(--font-manrope)] font-normal text-[#0c1421] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] tracking-[0.01em]">
                  {countdown} seconds
                </span>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!otp.every((d) => d.length === 1) || isSubmitting}
                className="w-full lg:w-[16.667vw] h-[13.889vw] md:h-[6.51vw] lg:h-[5.556vw] flex items-center justify-center bg-[#6b0b23] rounded-full text-white font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.604vw] lg:text-[1.389vw] tracking-[0.01em] disabled:bg-[#A0A0A0] disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setStep("email"); setOtp(["", "", "", ""]); }}
              className="text-center font-[var(--font-manrope)] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] text-[#7a021d]"
            >
              Use a different email?
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
