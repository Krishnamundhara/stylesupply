"use client";

import { useEffect } from "react";

interface RequestAccessHeroProps {
  onContinue: () => void;
}

const maskStyles = {
  WebkitMaskImage: "url('/icon/Group 1505.svg')",
  maskImage: "url('/icon/Group 1505.svg')",
  WebkitMaskRepeat: "no-repeat" as const,
  maskRepeat: "no-repeat" as const,
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

export default function RequestAccessHero({ onContinue }: RequestAccessHeroProps) {
  useEffect(() => {
    const timer = setTimeout(onContinue, 2600);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <section
      className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-160px)] px-4 cursor-pointer"
      onClick={onContinue}
      aria-label="Click to continue"
    >
      {/* Logo — animates in first */}
      <div
        role="img"
        aria-label="StyleSupply"
        className="w-[160px] h-[192px] sm:w-[200px] sm:h-[240px] md:w-[220px] md:h-[264px] lg:w-[260px] lg:h-[312px] bg-[#7A021D]"
        style={{
          opacity: 0,
          animation: "fade-in-up 0.9s ease-out 0s forwards",
          ...maskStyles,
        }}
      />

      {/* "Request Access" — animates in after logo */}
      <p
        className="mt-8 md:mt-10 font-[var(--font-manrope)] font-normal text-[8.889vw] md:text-[5.859vw] lg:text-[3.333vw] leading-[1.2] tracking-[-0.04em] text-black text-center"
        style={{
          opacity: 0,
          animation: "fade-in-up 0.9s ease-out 0.75s forwards",
        }}
      >
        Request Access
      </p>
    </section>
  );
}
