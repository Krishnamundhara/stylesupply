"use client";

import { useState } from "react";
import Image from "next/image";

const QR_IMAGE = "/images/payment/qr-stylesupply.jpg";

export default function BoxStagePayment({ onConfirm }: { onConfirm: () => void }) {
  const [accessCode, setAccessCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [showQR, setShowQR] = useState(false);
  const isConfirmEnabled = Boolean(appliedCode) || showQR;
  const membershipFee = 5000;
  const discount = appliedCode ? 5000 : 0;
  const total = Math.max(membershipFee - discount, 0);

  const applyAccessCode = () => {
    const trimmed = accessCode.trim();
    if (!trimmed) return;
    setAppliedCode(trimmed.toUpperCase());
  };

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
    <div className="mx-auto flex flex-col items-center px-[5.556vw] md:px-[2.604vw] lg:px-[1.389vw] pt-[11.111vw] pb-0 md:pt-[3.472vw] md:pb-0">

      <h1 className="font-normal leading-[1.2] tracking-[-0.04em] text-black text-[11.111vw] text-center md:text-[5.139vw]">
        Confirm My Box
      </h1>

      <div className="mt-[8.333vw] flex w-[33.333vw] md:w-[8.333vw] items-center gap-[1.528vw] md:mt-[1.389vw] md:gap-[0.382vw]">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-[1.667vw] flex-1 md:h-[0.417vw] rounded-none"
            style={{ backgroundColor: i === 1 ? "#7A021D" : "rgba(122,2,29,0.2)" }}
          />
        ))}
      </div>

    <div className="mt-[8.333vw] md:mt-[1.389vw] flex flex-col items-center gap-[8.333vw] md:gap-[3.906vw] lg:gap-[2.083vw] w-full max-w-[88.889vw] md:max-w-[52.083vw] lg:max-w-[27.778vw] mx-auto">

      {/* Payment Info header */}
      <p className="font-semibold text-[5.556vw] md:text-[1.823vw] lg:text-[1.389vw] text-black tracking-[-0.02em] text-center">
        Payment Info
      </p>

      <div className="w-full flex flex-col gap-[5.556vw] md:gap-[2.083vw]">
        {/* Fee row */}
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black leading-[1.1]">Membership Fee</span>
          <span className="font-semibold text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black tracking-[-0.02em] leading-[1.1]">₹5,000</span>
        </div>

        {/* Access code */}
        <div className="flex flex-col gap-[6.944vw] md:gap-[3.255vw] lg:gap-[1.736vw] w-full">
          {!appliedCode ? (
            <>
              <input
                type="text"
                placeholder="Enter Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyAccessCode();
                  }
                }}
                className="w-full font-medium text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black placeholder:text-[#a0a0a0] tracking-[-0.02em] bg-transparent outline-none"
              />
              <div className="w-full h-px bg-black/15" />
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black leading-[1.1]">
                Access Code [{appliedCode}]
              </span>
              <div className="flex items-center gap-[2vw] md:gap-[0.694vw]">
                <span className="font-semibold text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black tracking-[-0.02em] leading-[1.1]">
                  -₹5000
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedCode("")}
                  aria-label="Remove access code"
                  className="shrink-0"
                >
                  <svg viewBox="0 0 14 14" fill="none" className="w-[3.889vw] h-[3.889vw] md:w-[1.823vw] md:h-[1.823vw] lg:w-[0.972vw] lg:h-[0.972vw]">
                    <line x1="1" y1="1" x2="13" y2="13" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="1" x2="1" y2="13" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-[5.556vw] md:text-[2.083vw] lg:text-[1.736vw] text-black leading-[1.2] tracking-[-0.02em]">Total</span>
          <span className="font-semibold text-[5.556vw] md:text-[2.083vw] lg:text-[1.736vw] text-black tracking-[-0.02em] leading-[1.1]">₹{total}</span>
        </div>
      </div>

      {/* Pay here + QR */}
      <div className="flex flex-col items-center gap-[4.444vw] md:gap-[2.083vw] lg:gap-[1.111vw] w-full">
        <p className="font-semibold text-[5vw] md:text-[2.344vw] lg:text-[1.25vw] text-black text-center tracking-[-0.04em]">
          Pay here
        </p>
        <div className="relative w-[70.556vw] h-[70.556vw] md:w-[33.073vw] md:h-[33.073vw] lg:w-[17.639vw] lg:h-[17.639vw]">
          <Image src={QR_IMAGE} alt="QR Code" fill className="object-cover" unoptimized />
          {!showQR && (
            <div className="absolute inset-0 bg-[#260303]/80 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowQR(true)}
                disabled={Boolean(appliedCode)}
                className="flex items-center justify-center rounded-full border font-semibold tracking-[-0.04em] transition-opacity h-[16.667vw] w-[38.889vw] text-[3.889vw] md:h-[7.813vw] md:w-[18.229vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]"
                style={{
                  borderColor: appliedCode ? "#BFBFBF" : "#7A021D",
                  backgroundColor: appliedCode ? "#BFBFBF" : "#FFFFFF",
                  color: appliedCode ? "#000000" : "#7A021D",
                  cursor: appliedCode ? "not-allowed" : "pointer",
                }}
              >
                <span className="md:hidden">Download QR</span>
                <span className="hidden md:inline">Scan QR</span>
              </button>
            </div>
          )}
        </div>
        <p className="font-semibold text-[5vw] md:text-[2.344vw] lg:text-[1.25vw] text-black text-center tracking-[-0.04em] max-w-[79.167vw] md:max-w-[37.109vw] lg:max-w-[19.792vw]">
          How to Pay: Scan the QR above, make a payment and press confirm.
        </p>
      </div>

      {/* Confirm Payment CTA */}
      <button
        type="button"
        onClick={onConfirm}
      className="flex items-center justify-center rounded-full font-semibold text-white h-[16.667vw] w-[55.556vw] text-[3.889vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw] tracking-[-0.04em]"
        style={{
        backgroundColor: isConfirmEnabled ? "#7A021D" : "#a0a0a0",
        }}
      >
        Confirm Payment
      </button>

    </div>
    </div>
    </div>
  );
}
