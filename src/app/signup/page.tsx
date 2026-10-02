import Link from "next/link";
import LoginArtPanel from "@/components/sections/login/LoginArtPanel";
import SignupForm from "@/components/sections/signup/SignupForm";
import { Suspense } from "react";

export const metadata = {
  title: "Create Account - StyleSupply",
  description: "Join StyleSupply and open the doors to your infinite closet.",
};

export default function SignupPage() {
  return (
    <>
      {/* DESKTOP (lg+) */}
      <div className="hidden lg:flex h-screen w-full bg-[#fcf6f4] font-[var(--font-manrope)] overflow-hidden relative">
        <LoginArtPanel />
        <div className="flex-1 h-full bg-[#fcf6f4] flex items-stretch overflow-y-auto relative">
          <Link href="/" className="absolute top-5 right-5 text-[#7A021D] text-[50px] leading-none z-10 font-light">&times;</Link>
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </div>

      {/* MOBILE (< lg) */}
      <div className="lg:hidden min-h-screen w-full bg-[#fcf6f4] font-[var(--font-manrope)] overflow-auto relative">
        <Link href="/" className="absolute top-5 right-5 text-[#7A021D] text-[50px] leading-none z-10 font-light">&times;</Link>
        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </div>
    </>
  );
}
