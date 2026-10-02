"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const tabs: { label: string; href: string; match: (path: string) => boolean }[] = [
  {
    label: "Membership",
    href: "/accounts/membership",
    match: (p) => p.startsWith("/accounts/membership"),
  },
  {
    label: "My Wardrobe",
    href: "/accounts/wardrobe",
    match: (p) => p.startsWith("/accounts/wardrobe"),
  },
  {
    label: "My Reviews",
    href: "/accounts/reviews",
    match: (p) => p.startsWith("/accounts/reviews"),
  },
  {
    label: "Past Boxes",
    href: "/accounts/orders",
    match: (p) => p.startsWith("/accounts/orders"),
  },
  {
    label: "Account Settings",
    href: "/accounts/settings",
    match: (p) => p.startsWith("/accounts/settings"),
  },
  {
    label: "Help Centre",
    href: "/accounts/help",
    match: (p) => p.startsWith("/accounts/help"),
  },
];

export default function ProfileLandingTabs() {
  const pathname = usePathname();
  const mobileTabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.match(pathname));
    if (!activeTab) return;

    const scrollActiveTab = () => {
      mobileTabRefs.current[activeTab.href]?.scrollIntoView({
        inline: "nearest",
        block: "nearest",
      });
    };
    requestAnimationFrame(scrollActiveTab);
  }, [pathname]);

  return (
    <nav aria-label="Account sections" className="w-full min-w-0">
      {/* Mobile: horizontal scroll — equal gap, content-width tabs */}
      <div className="md:hidden relative border-b-2 border-black">
        <div className="flex flex-nowrap gap-[8.333vw] overflow-x-auto scrollbar-hide touch-pan-x">
          {tabs.map((tab) => {
            const isActive = tab.match(pathname);

            return (
              <Link
                key={tab.label}
                ref={(el) => {
                  mobileTabRefs.current[tab.href] = el;
                }}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  "relative flex w-auto shrink-0 items-center pb-[3.889vw] font-[var(--font-manrope)] text-[3.889vw] tracking-[-0.04em] transition-colors focus-visible:outline-none whitespace-nowrap text-left " +
                  (isActive
                    ? "font-semibold text-[#6b0b23]"
                    : "font-medium text-black")
                }
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 z-10 h-[5px] w-full rounded-none bg-[#6b0b23]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tablet + Desktop: underline tab style */}
      <div className="hidden md:flex items-center justify-between w-full border-b-2 border-black">
        {tabs.map((tab) => {
          const isActive = tab.match(pathname);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={
                "relative pb-[18px] font-[var(--font-manrope)] text-[1.823vw] lg:text-[1.25vw] tracking-[-0.04em] transition-colors focus-visible:outline-none whitespace-nowrap " +
                (isActive
                  ? "font-semibold text-[#6b0b23] after:absolute after:bottom-0 after:left-0 after:h-[5px] after:w-full after:rounded-none after:bg-[#6b0b23]"
                  : "font-medium text-black")
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
