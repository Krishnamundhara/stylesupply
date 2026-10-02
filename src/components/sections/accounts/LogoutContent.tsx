"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutContent() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleCancel() {
    router.back();
  }

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="flex w-full flex-col items-center gap-[4.167vw] md:gap-[2.778vw] px-[5.556vw] md:px-[15.278vw] py-[11.111vw] md:py-[4.444vw] text-center">
      {/* Text */}
      <div className="flex flex-col items-center gap-[4.167vw] md:gap-[1.389vw]">
        <h2 className="font-[var(--font-manrope)] font-normal leading-[1.3] md:leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] lg:text-[4.444vw]">
          Are you logging out?
        </h2>
        <p className="font-[var(--font-manrope)] font-medium leading-[1.4] md:leading-[1.6] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.344vw] lg:text-[1.389vw] w-full md:max-w-[500px]">
          We&apos;ll miss you! You can log back in at any time.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-[2.778vw] md:gap-[0.694vw]">
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-[16.667vw] md:h-[7.813vw] lg:h-[5.556vw] w-[38.889vw] md:w-[20.833vw] lg:w-[13.889vw] items-center justify-center rounded-full border border-[#7a021d] font-[var(--font-manrope)] font-semibold text-[#7a021d] text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[16.667vw] md:h-[7.813vw] lg:h-[5.556vw] w-[38.889vw] md:w-[20.833vw] lg:w-[13.889vw] items-center justify-center rounded-full bg-[#7a021d] font-[var(--font-manrope)] font-semibold text-white text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw]"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
