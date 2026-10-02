import Link from "next/link";
import type { ReactNode } from "react";
import { errorStateCtaClassName } from "@/components/ui/ErrorStateCtaButton";

type AccountEmptyStateProps = {
  heading: ReactNode;
};

export default function AccountEmptyState({ heading }: AccountEmptyStateProps) {
  return (
    <div className="w-full min-w-0 flex flex-col items-center justify-center bg-white pt-[16.667vw] md:pt-[60px] gap-[8.333vw] md:gap-[2.778vw]">
      <h2 className="font-[var(--font-manrope)] font-normal text-center text-black tracking-[-0.04em] leading-[1.2] text-[11.111vw] md:text-[5.139vw]">
        {heading}
      </h2>
      <Link href="/products" className={errorStateCtaClassName}>
        Browse Products
      </Link>
    </div>
  );
}
