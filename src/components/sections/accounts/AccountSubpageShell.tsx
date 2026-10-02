"use client";

import ProfileLandingTabs from "./ProfileLandingTabs";
import { useAuth } from "@/context/AuthContext";

export default function AccountSubpageShell({
  children,
  userName,
  title,
  subtitle = "Welcome to your profile",
}: {
  children: React.ReactNode;
  userName?: string | null;
  title?: string;
  subtitle?: string | null;
}) {
  const { user } = useAuth();
  const firstName = (userName ?? user?.name ?? "there").split(" ")[0];
  const resolvedTitle = title ?? `Hello, ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}!`;
  return (
    <div className="box-border w-full min-w-0">
      <main className="min-w-0 pb-[27.778vw] md:pb-[13.021vw] lg:pb-[8.333vw]">
        <div className="flex w-full min-w-0 flex-col items-stretch">
          {/* Page heading — 70px top + bottom padding on desktop per design system */}
          <div className="flex flex-col items-center gap-[5.556vw] md:gap-[2.604vw] lg:gap-[1.389vw] text-center px-[4.167vw] md:px-[2.604vw] lg:px-[2.5vw] pt-[8.333vw] md:pt-[3.906vw] lg:pt-[4.861vw] pb-[8.333vw] md:pb-[3.906vw] lg:pb-[4.861vw]">
            <h1 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] lg:text-[4.444vw]">
              {resolvedTitle}
            </h1>
            {subtitle && (
              <p className="font-[var(--font-manrope)] font-medium text-black text-[4.167vw] md:text-[2.344vw] lg:text-[1.389vw]">
                {subtitle}
              </p>
            )}
          </div>

          <div className="w-full min-w-0 px-[4.167vw] md:px-[1.042vw]">
            <ProfileLandingTabs />
          </div>

          <div className="w-full min-w-0 mt-[5.556vw] md:mt-[3.906vw] lg:mt-[4.167vw]">{children}</div>
        </div>
      </main>
    </div>
  );
}
