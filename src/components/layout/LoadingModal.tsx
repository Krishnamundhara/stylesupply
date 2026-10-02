"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoadingModalProps {
  open: boolean;
  message?: string;
}

const RED = "#7A021D";
const DARK = "#292D32";

// Clockwise order: top (starts red) → bottom-right → bottom-left → top
// Each box is active for 1/3 of the cycle then hands off to the next.
// Total cycle = 1.2s. Each box is lit for 0.4s (33.33%).
const css = `
@keyframes box-top {
  0%        { stroke: ${RED};  }
  33.33%    { stroke: ${DARK}; }
  66.66%    { stroke: ${DARK}; }
  100%      { stroke: ${RED};  }
}
@keyframes box-bottom-right {
  0%        { stroke: ${DARK}; }
  33.33%    { stroke: ${RED};  }
  66.66%    { stroke: ${DARK}; }
  100%      { stroke: ${DARK}; }
}
@keyframes box-bottom-left {
  0%        { stroke: ${DARK}; }
  33.33%    { stroke: ${DARK}; }
  66.66%    { stroke: ${RED};  }
  100%      { stroke: ${DARK}; }
}
.box-top    { animation: box-top          1.2s step-start infinite; }
.box-br     { animation: box-bottom-right 1.2s step-start infinite; }
.box-bl     { animation: box-bottom-left  1.2s step-start infinite; }
`;

const DOT_SEQUENCE = [".", "..", "...", "..", "."];

export default function LoadingModal({ open, message = "Loading" }: LoadingModalProps) {
  const [dotIdx, setDotIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDotIdx(0);
    const id = setInterval(() => setDotIdx((i) => (i + 1) % DOT_SEQUENCE.length), 400);
    return () => clearInterval(id);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <style>{css}</style>
      <div
        className="flex flex-col items-center justify-center gap-[5.556vw] md:gap-[2.604vw] lg:gap-[1.389vw] w-[77.778vw] md:w-[36.458vw] lg:w-[19.444vw] h-[50vw] md:h-[23.438vw] lg:h-[12.5vw] rounded-[4.444vw] md:rounded-[2.083vw] lg:rounded-[1.111vw]"
        style={{ backgroundColor: "#F7F4EF" }}
      >
        <svg viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[20vw] h-[17.778vw] md:w-[9.375vw] md:h-[8.333vw] lg:w-[5vw] lg:h-[4.444vw]">
          {/* Top box — starts red */}
          <g className="box-top">
            <path d="M20 11.5L35.7167 20.5167L50.3332 12.0499" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M35.7168 35.6196V20.5029" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M44.3332 15.9693L28.5166 6.83594" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M20.0879 11.3212L35.4173 3.14551L50.7469 11.3212V26.6507L35.4173 35.8483L20.0879 26.6507V11.3212Z" strokeWidth="1.76289"/>
          </g>
          {/* Bottom-right box — second in clockwise order */}
          <g className="box-br">
            <path d="M36 35.5L51.7167 44.5167L66.3332 36.0499" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M51.7168 59.6196V44.5029" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M60.3332 39.9693L44.5166 30.8359" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M36.0879 35.3212L51.4173 27.1455L66.7469 35.3212V50.6507L51.4173 59.8483L36.0879 50.6507V35.3212Z" strokeWidth="1.76289"/>
          </g>
          {/* Bottom-left box — third in clockwise order */}
          <g className="box-bl">
            <path d="M4 35.5L19.7167 44.5167L34.3332 36.0499" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M19.7168 59.6196V44.5029" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M28.3332 39.9693L12.5166 30.8359" strokeWidth="1.76289" strokeLinejoin="round"/>
            <path d="M4.08789 35.3212L19.4173 27.1455L34.7469 35.3212V50.6507L19.4173 59.8483L4.08789 50.6507V35.3212Z" strokeWidth="1.76289"/>
          </g>
        </svg>
        <p className="font-[var(--font-manrope)] text-[4.444vw] md:text-[2.083vw] lg:text-[1.111vw] font-medium tracking-[-0.02em] text-black">
          {message}<span className="inline-block w-[5vw] md:w-[2.344vw] lg:w-[1.25vw] text-left">{DOT_SEQUENCE[dotIdx]}</span>
        </p>
      </div>
    </div>,
    document.body
  );
}
