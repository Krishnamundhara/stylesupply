"use client";

import Link from "next/link";

const ROW_TITLE =
  "font-[var(--font-manrope)] font-medium leading-[1.2] tracking-[-0.04em] text-black text-[5.556vw] md:text-[2.344vw] lg:text-[1.667vw]";

const DESKTOP_ROW_PAD = "md:py-[1.953vw] lg:py-[1.042vw]";

const CHEVRON_CLASS = "h-[6.667vw] w-[6.667vw] md:h-[1.667vw] md:w-[1.667vw] shrink-0 text-black";

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SettingsContent() {
  return (
    <div className="flex w-full min-w-0 max-w-full flex-col px-[5.556vw] md:px-[5.556vw] lg:px-[15.278vw]">
      <ul>
        <li className="">
          <Link
            href="/accounts/settings/profile"
            className={`flex w-full flex-row items-center justify-between gap-4 py-[4.167vw] ${DESKTOP_ROW_PAD}`}
          >
            <p className={ROW_TITLE}>My Profile</p>
            <ChevronRight className={CHEVRON_CLASS} />
          </Link>
        </li>
        <li className="">
          <Link
            href="/accounts/membership/manage"
            className={`flex w-full flex-row items-center justify-between gap-4 py-[4.167vw] ${DESKTOP_ROW_PAD}`}
          >
            <p className={ROW_TITLE}>Manage Subscription</p>
            <ChevronRight className={CHEVRON_CLASS} />
          </Link>
        </li>
        <li className="">
          <Link
            href="/accounts/settings/change-password"
            className={`flex w-full flex-row items-center justify-between gap-4 py-[4.167vw] ${DESKTOP_ROW_PAD}`}
          >
            <p className={ROW_TITLE}>Change Password</p>
            <ChevronRight className={CHEVRON_CLASS} />
          </Link>
        </li>
        <li className="">
          <Link
            href="/accounts/settings/logout"
            className={`flex w-full flex-row items-center justify-between gap-4 py-[4.167vw] ${DESKTOP_ROW_PAD}`}
          >
            <p className={ROW_TITLE}>Log Out</p>
            <ChevronRight className={CHEVRON_CLASS} />
          </Link>
        </li>
      </ul>
    </div>
  );
}
