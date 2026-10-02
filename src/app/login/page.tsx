import { Suspense } from "react";
import Link from "next/link";
import LoginArtPanel from "@/components/sections/login/LoginArtPanel";
import LoginForm from "@/components/sections/login/LoginForm";

export const metadata = {
  title: "Sign In - StyleSupply",
  description: "Sign in to your StyleSupply account and access your personal closet.",
};

export default function LoginPage() {
  return (
    <>
      {/* DESKTOP (lg+) */}
      <div className="hidden lg:flex h-screen w-full bg-[#fcf6f4] font-[var(--font-manrope)] overflow-hidden relative">
        <LoginArtPanel />
        {/* Right cream panel */}
        <div className="flex-1 h-full bg-[#fcf6f4] flex items-stretch overflow-hidden relative">
          <Link href="/" className="absolute top-[1.389vw] right-[1.389vw] text-[#7A021D] text-[3.472vw] leading-none z-10 font-light">&times;</Link>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      {/* MOBILE (< lg) */}
      <div className="lg:hidden h-screen w-full bg-[#f7f4ef] font-[var(--font-manrope)] overflow-auto relative">
        <Link href="/" className="absolute top-[5.556vw] right-[5.556vw] md:top-[2.604vw] md:right-[2.604vw] text-[#7A021D] text-[13.889vw] md:text-[6.51vw] leading-none z-10 font-light">&times;</Link>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
