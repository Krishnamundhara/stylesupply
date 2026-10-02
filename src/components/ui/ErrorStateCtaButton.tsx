"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Mobile 200×60 @ 360px; desktop 240×80 @ 1440px — error/empty-state fallback CTAs only */
export const errorStateCtaClassName =
  "inline-flex h-[16.667vw] w-[55.556vw] items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-semibold text-white tracking-[-0.02em] whitespace-nowrap text-[3.889vw] md:h-[5.556vw] md:w-[16.667vw] md:text-[1.389vw]";

type ErrorStateCtaButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children?: ReactNode;
};

export default function ErrorStateCtaButton({
  children = "Retry",
  className,
  onClick,
  ...props
}: ErrorStateCtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick ?? (() => window.location.reload())}
      className={className ? `${errorStateCtaClassName} ${className}` : errorStateCtaClassName}
      {...props}
    >
      {children}
    </button>
  );
}
