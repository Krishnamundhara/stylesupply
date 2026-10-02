import { Suspense } from "react";
import Link from "next/link";
import LoginArtPanel from "@/components/sections/login/LoginArtPanel";
import ForgotPasswordForm from "@/components/sections/forgot-password/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password - StyleSupply",
  description: "Reset your StyleSupply account password.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      {/* DESKTOP (lg+) */}
      <div className="hidden lg:flex h-screen w-full bg-[#f7f4ef] font-[var(--font-manrope)] overflow-hidden relative">
        <LoginArtPanel />
        <div className="flex-1 h-full bg-[#f7f4ef] flex items-center justify-center overflow-hidden relative">
          <Link href="/" className="absolute top-[1.389vw] right-[1.389vw] text-[#7A021D] text-[3.472vw] leading-none z-10 font-light">×</Link>
          <Suspense fallback={null}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>

      {/* MOBILE + TABLET (< lg) */}
      <div className="lg:hidden min-h-screen w-full bg-[#f7f4ef] font-[var(--font-manrope)] overflow-auto relative flex items-center justify-center">
        <Link href="/" className="absolute top-[5.556vw] right-[5.556vw] md:top-[2.604vw] md:right-[2.604vw] text-[#7A021D] text-[13.889vw] md:text-[6.51vw] leading-none z-10 font-light">×</Link>
        <Suspense fallback={null}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </>
  );
}
