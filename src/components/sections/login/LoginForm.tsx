"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/api-client";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val && !isValidEmail(val)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Signing you in…");
    try {
      await login(email, password);
      toast.success("Signed in successfully!", { id: toastId });
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message, { id: toastId });
      } else {
        toast.error("Something went wrong. Please try again.", { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col items-center justify-center py-[3vh]"
    >
      <div className="w-[89.444vw] md:w-[55vw] lg:w-full lg:max-w-[22.431vw] lg:px-0 flex flex-col gap-[2.5vh]">

        {/* Logo ornament */}
        <div className="flex justify-center">
          <Image
            src="/logo/ss_red_logo.svg"
            alt="StyleSupply"
            width={120}
            height={150}
            className="w-[22.222vw] h-[29.167vw] md:w-[13.021vw] md:h-[17.448vw] lg:w-[6.25vw] lg:h-[7.813vw] object-contain"
          />
        </div>

        {/* Intro */}
        <div className="flex flex-col items-center gap-[5.556vw] md:gap-[2.604vw] lg:gap-[1.389vw] text-center">
          <h1 className="font-[var(--font-manrope)] font-medium text-[#0c1421] text-[9.444vw] md:text-[4.427vw] lg:text-[3.056vw] leading-none tracking-[-0.05em] whitespace-nowrap">
            Access Your Supply
          </h1>
          <p className="font-[var(--font-manrope)] font-normal text-[#313957] text-[3.889vw] md:text-[2.344vw] lg:text-[0.972vw] leading-[1.6] tracking-[-0.02em] w-full">
            Sign in below to access your membership.<br />
            If you are not a member, you may request access.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-[2vh] w-full">
          <div className="flex flex-col gap-[4.167vw] md:gap-[1.953vw] lg:gap-[1.042vw]">
            <label className="font-[var(--font-manrope)] font-normal text-[#0c1421] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] leading-none tracking-[0.01em]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Example@email.com"
              className={`w-full h-[5.924vh] lg:h-[3.472vw] rounded-full border bg-white px-[5.556vw] md:px-[3.255vw] lg:px-[1.458vw] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] text-[#0c1421] placeholder:text-[#8897ad] outline-none transition-colors ${emailError ? "border-red-500" : "border-[#d4d7e3] focus:border-[#7a021d]"}`}
            />
            {emailError && <p className="text-[3.333vw] lg:text-[0.833vw] text-red-500 pl-2">{emailError}</p>}
          </div>

          <div className="flex flex-col gap-[4.167vw] md:gap-[1.953vw] lg:gap-[1.042vw]">
            <label className="font-[var(--font-manrope)] font-normal text-[#0c1421] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] leading-none tracking-[0.01em]">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full h-[5.924vh] lg:h-[3.472vw] rounded-full border border-[#d4d7e3] bg-white px-[5.556vw] md:px-[3.255vw] lg:px-[1.458vw] pr-[16.667vw] md:pr-[9.766vw] lg:pr-[4.167vw] text-[3.333vw] md:text-[2.083vw] lg:text-[0.972vw] text-[#0c1421] placeholder:text-[#8897ad] outline-none focus:border-[#7a021d] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-[4.444vw] md:right-[2.604vw] lg:right-[1.111vw] top-1/2 -translate-y-1/2 font-[var(--font-manrope)] font-semibold text-[3.333vw] md:text-[1.953vw] lg:text-[0.833vw] tracking-[-0.02em] transition-colors"
                style={{ color: showPassword ? "#757575" : "#7a021d" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-[calc(2vh-10px)]">
            <Link
              href="/forgot-password"
              className="font-[var(--font-manrope)] text-[#7a021d] text-[3.333vw] md:text-[2.344vw] lg:text-[0.972vw] tracking-[0.01em]"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isValidEmail(email) || !password.trim() || isSubmitting}
              className={`w-full lg:w-full h-[5.924vh] lg:h-[4.167vw] flex items-center justify-center rounded-full text-white font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.344vw] lg:text-[1.25vw] tracking-[-0.04em] cursor-pointer disabled:cursor-not-allowed ${
                !isValidEmail(email) || !password.trim() ? "bg-[#A0A0A0]" : "bg-[#6b0b23]"
              }`}
            >
              Sign in
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-[3.333vw] md:gap-[1.953vw] lg:gap-[0.833vw] w-full">
            <div className="flex-1 h-px bg-[#d4d7e3]" />
            <span className="font-[var(--font-manrope)] text-[3.333vw] md:text-[1.953vw] lg:text-[0.972vw] text-[#313957] whitespace-nowrap">
              Or
            </span>
            <div className="flex-1 h-px bg-[#d4d7e3]" />
          </div>

          {/* Request Access */}
          <div className="flex justify-center">
            <Link
              href="/request-access"
              className="w-full lg:w-full h-[5.924vh] lg:h-[4.167vw] flex items-center justify-center rounded-full border border-[#6b0b23] text-[#6b0b23] bg-transparent font-[var(--font-manrope)] font-normal text-[3.889vw] md:text-[2.344vw] lg:text-[1.25vw] tracking-[-0.04em]"
              >
              Request Access
            </Link>
          </div>

        </div>

      </div>
    </form>
  );
}
