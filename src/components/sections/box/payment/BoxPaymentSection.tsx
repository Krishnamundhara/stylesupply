"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBox } from "@/context/BoxContext";
import BoxItemGrid from "@/components/sections/box/BoxItemGrid";

const QR_IMAGE = "/images/payment/qr-stylesupply.jpg";

export default function BoxPaymentSection({ onConfirm }: { onConfirm?: () => void }) {
  const { items } = useBox();
  const [showQR, setShowQR] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const isConfirmEnabled = showQR;
  const itemsTotal = 20000;
  const discount = 5000;
  const total = Math.max(itemsTotal - discount, 0);
  const keptItems = items;

  const handleConfirmPayment = () => {
    if (!isConfirmEnabled) return;
    setIsPaid(true);
    onConfirm?.();
  };

  if (isPaid) {
    return (
      <div className="w-full bg-white font-[var(--font-manrope)]">
        <div className="mx-auto flex flex-col items-center px-[2.778vw] pt-[11.111vw] pb-0 md:px-[0.694vw] md:pt-[2.778vw] md:pb-[2.778vw]">
          <h1 className="font-normal leading-[1.2] tracking-[-0.04em] text-black text-center text-[11.111vw] md:text-[5.139vw]">
            Yours to keep.
          </h1>
          <p className="mt-[4.444vw] md:mt-[1.389vw] text-center font-medium leading-[1.2] tracking-[-0.02em] text-black text-[4.167vw] md:text-[1.823vw] lg:text-[1.25vw]">
            We&apos;re glad you loved your items.
          </p>

          <div className="mt-[8.333vw] md:mt-[1.389vw] w-full">
            <BoxItemGrid items={keptItems} compact mobileScrollable />
          </div>

          <Link
            href="/box/returns"
            className="mt-[11.111vw] md:mt-[2.778vw] flex items-center justify-center rounded-full bg-[#7A021D] text-white h-[16.667vw] w-[55.556vw] text-[3.889vw] md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw] font-semibold tracking-[-0.04em]"
          >
            Proceed to Returns
          </Link>

          <Link
            href="/"
            className="mt-[6.944vw] md:mt-[1.736vw] text-[#7A021D] font-semibold underline underline-offset-2 tracking-[-0.02em] text-[4.167vw] md:text-[1.823vw] lg:text-[1.111vw]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="mx-auto flex flex-col items-center px-[2.778vw] pt-[11.111vw] pb-0 md:px-[0.694vw] md:pt-[2.778vw] md:pb-0">
        <h1 className="font-normal leading-[1.2] tracking-[-0.04em] text-black text-[11.111vw] text-center md:text-[5.139vw]">
          Confirm My Box
        </h1>

        <div className="mt-[8.333vw] md:mt-[1.389vw] flex flex-col items-center gap-[8.333vw] md:gap-[3.906vw] lg:gap-[2.083vw] w-full max-w-[88.889vw] md:max-w-[52.083vw] lg:max-w-[27.778vw] mx-auto">
          {/* Payment Info header */}
          <p className="font-semibold text-[5.556vw] md:text-[1.389vw] text-black tracking-[-0.02em] text-center">
            Payment Info
          </p>

          <div className="w-full flex flex-col gap-[5.556vw] md:gap-[2.083vw]">
            {/* Items Total row */}
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black leading-[1.1]">Items Total</span>
              <span className="font-semibold text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black tracking-[-0.02em] leading-[1.1]">₹20,000</span>
            </div>

            {/* Membership credit (pre-applied) */}
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black leading-[1.1]">
                Membership Credit
              </span>
              <span className="font-semibold text-[4.444vw] md:text-[1.823vw] lg:text-[1.25vw] text-black tracking-[-0.02em] leading-[1.1]">
                -₹5000
              </span>
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
                    className="flex items-center justify-center rounded-full border font-semibold tracking-[-0.04em] transition-opacity h-[16.667vw] w-[38.889vw] text-[3.889vw] md:h-[7.813vw] md:w-[18.229vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]"
                    style={{
                      borderColor: "#7A021D",
                      backgroundColor: "#FFFFFF",
                      color: "#7A021D",
                      cursor: "pointer",
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
            onClick={handleConfirmPayment}
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
