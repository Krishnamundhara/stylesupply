"use client";

import Image from "next/image";
import Link from "next/link";
import { useBox, type BoxItemDisplay } from "@/context/BoxContext";
import BoxProgressBar from "@/components/sections/box/BoxProgressBar";

const ACCENT_MAROON = "#7A021D";
const TEXT_PRIMARY = "#2C0505";

const TRACKING_STEPS = [
  "Pickup Scheduled",
  "Pickup In Transit",
  "Pickup Completed",
  "Received at Style Supply",
] as const;

function ProductCard({ item }: { item: BoxItemDisplay }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div
        className="relative w-full overflow-hidden bg-[#F7F4EF]"
        style={{ height: "22.222vw" }}
      >
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes="(max-width:768px) 75vw, 18.4vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
      </div>
      <div className="flex flex-col pt-[1.953vw] lg:pt-[1.042vw]">
        <p className="font-medium uppercase leading-[1.2] tracking-[-0.02em] text-[#4e4e4e] text-[1.823vw] lg:text-[0.972vw]">
          {item.brand || "error"}
        </p>
        <p className="mt-[0.911vw] lg:mt-[0.694vw] font-semibold capitalize leading-[1.2] tracking-[-0.04em] text-black truncate max-w-[70%] text-[2.344vw] lg:text-[1.389vw]">
          {item.name || "error"}
        </p>
        {item.size && (
          <p className="mt-[0.911vw] lg:mt-[0.694vw] font-medium leading-[1.2] tracking-[-0.02em] text-black text-[2.083vw] lg:text-[1.111vw]">
            Size: {item.size}
          </p>
        )}
        {item.retailPrice && (
          <p className="mt-[0.911vw] lg:mt-[0.694vw] font-medium leading-[1.2] tracking-[-0.02em] text-black text-[2.083vw] lg:text-[1.111vw]">
            MRP ₹{Math.round(item.retailPrice / 100).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

function ProductCardMobile({ item }: { item: BoxItemDisplay }) {
  return (
    <div className="flex w-[75vw] shrink-0 flex-col">
      <div className="relative overflow-hidden bg-[#F7F4EF]" style={{ width: "75vw", height: "88.889vw" }}>
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes="75vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
      </div>
      <div className="flex flex-col items-center text-center gap-[1.667vw] max-w-[75vw]" style={{ paddingTop: "2.778vw" }}>
        <p
          className="font-medium uppercase leading-none text-[#4e4e4e]"
          style={{ fontSize: "2.778vw", letterSpacing: "-0.02em" }}
        >
          {item.brand || "error"}
        </p>
        <p
          className="font-semibold capitalize leading-[1.2] w-full truncate"
          style={{ fontSize: "4.167vw", letterSpacing: "-0.04em", color: "#000000" }}
        >
          {item.name || "error"}
        </p>
        {item.size && (
          <p
            className="font-medium leading-[1.2] text-black"
            style={{ fontSize: "3.333vw", letterSpacing: "-0.02em" }}
          >
            Size: {item.size}
          </p>
        )}
        {item.retailPrice && (
          <p
            className="font-medium leading-[1.2] text-black"
            style={{ fontSize: "3.333vw", letterSpacing: "-0.02em" }}
          >
            MRP ₹{Math.round(item.retailPrice / 100).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BoxStagePickupTracking({
  currentStep = 2,
  showDevButton = false,
  onDevNext,
}: {
  currentStep?: number;
  showDevButton?: boolean;
  onDevNext?: () => void;
}) {
  const { items } = useBox();

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="mx-auto w-full px-[5.556vw] md:px-[2.604vw] lg:px-[1.389vw] pt-[4.444vw] md:pt-[2.083vw] lg:pt-[1.944vw] pb-0">
        {/* Tracking progress bar */}
        <BoxProgressBar steps={TRACKING_STEPS} currentStep={currentStep} />

        {/* Product grid â€" desktop */}
        {items.length > 0 && (
          <>
            <div className="mt-[2.604vw] lg:mt-[1.389vw] hidden w-full md:flex" style={{ gap: "5px" }}>
              {items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>

            {/* Product grid â€" mobile */}
            <div className="mt-[6.667vw] md:hidden w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-[5px]">
                {items.map((item) => (
                  <ProductCardMobile key={item.id} item={item} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* CTA row */}
        <div className="mt-[11.111vw] md:mt-[2.778vw] flex items-center justify-between gap-[2.778vw] md:gap-[1.302vw] lg:gap-[0.694vw]">
          <Link
            href="/"
            className="inline-flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border font-semibold tracking-[-0.04em] text-[3.889vw] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
            style={{
              borderColor: ACCENT_MAROON,
              color: ACCENT_MAROON,
            }}
          >
            Back to Home
          </Link>
          <button
            type="button"
            className="inline-flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full font-semibold tracking-[-0.04em] text-white text-[3.889vw] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
            style={{
              backgroundColor: ACCENT_MAROON,
            }}
          >
            Get Help
          </button>
        </div>

        {showDevButton && (
          <div className="mt-[4.444vw] md:mt-[2.083vw] lg:mt-[1.111vw] flex justify-center">
            <button
              type="button"
              onClick={onDevNext}
              className="rounded border border-[#7A021D] px-3 py-1 text-xs font-semibold text-[#7A021D]"
            >
              DEV: Next Stage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
