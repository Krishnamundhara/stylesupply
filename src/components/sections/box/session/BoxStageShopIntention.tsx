"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useBox, type BoxItemDisplay } from "@/context/BoxContext";

type Decision = "keep" | "return";

const MEMBERSHIP_CREDIT_RUPEES = 5000;
const MEMBERSHIP_CREDIT_MINOR = MEMBERSHIP_CREDIT_RUPEES * 100;
const TEXT_PRIMARY = "#000000";
const ACCENT_MAROON = "#7A021D";
const CARD_BG = "#F7F4EF";

function formatPrice(minor: number, currency = "INR") {
  const amount = minor / 100;
  if (currency === "INR") return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

/* â"€â"€ Keep / Return pill toggle â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
function KeepReturnToggle({
  decision,
  onDecision,
  compact,
}: {
  decision: Decision;
  onDecision: (d: Decision) => void;
  compact?: boolean;
}) {
  const toggleHeight = compact ? "60px" : "5.556vw";
  const toggleFontSize = compact ? undefined : "1.111vw";
  const toggleFontClass = compact ? "text-[3.889vw] md:text-[2.083vw] lg:text-[1.111vw]" : "";

  return (
    <div
      className="relative flex w-full rounded-full p-[3px]"
      style={{ backgroundColor: CARD_BG, height: `calc(${toggleHeight} + 6px)` }}
      role="group"
      aria-label="Keep or return this item"
    >
      <div
        className="absolute left-[3px] top-[3px] rounded-full transition-transform duration-300 ease-out"
        style={{
          width: "calc(50% - 3px)",
          height: toggleHeight,
          backgroundColor: ACCENT_MAROON,
          transform: decision === "return" ? "translateX(100%)" : "translateX(0)",
        }}
      />
      <button
        type="button"
        onClick={() => onDecision("keep")}
        className={`relative z-[1] flex flex-1 items-center justify-center rounded-full font-semibold tracking-[-0.02em] transition-colors duration-300 ${toggleFontClass}`}
        style={{
          color: decision === "keep" ? "#FAFAFA" : TEXT_PRIMARY,
          height: toggleHeight,
          fontSize: toggleFontSize,
        }}
      >
        Keep
      </button>
      <button
        type="button"
        onClick={() => onDecision("return")}
        className={`relative z-[1] flex flex-1 items-center justify-center rounded-full font-semibold tracking-[-0.02em] transition-colors duration-300 ${toggleFontClass}`}
        style={{
          color: decision === "return" ? "#FAFAFA" : ACCENT_MAROON,
          height: toggleHeight,
          fontSize: toggleFontSize,
        }}
      >
        Return
      </button>
    </div>
  );
}

/* â"€â"€ Desktop decision card â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
function DecisionCard({
  item,
  decision,
  onDecision,
}: {
  item: BoxItemDisplay;
  decision: Decision;
  onDecision: (d: Decision) => void;
}) {
  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <div
        className="relative overflow-hidden w-full"
        style={{ backgroundColor: CARD_BG, height: "22.222vw" }}
      >
        {item.thumbnailUrl ? (
          <Image src={item.thumbnailUrl} alt={item.name} fill sizes="18.75vw" className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: CARD_BG }} />
        )}
      </div>
      <div className="flex flex-col pt-[1.042vw]">
        <p className="font-medium uppercase leading-[1.2] text-[#4e4e4e] text-[0.972vw] tracking-[-0.02em]">
          {item.brand || "error"}
        </p>
        <p className="mt-[0.694vw] font-semibold capitalize leading-[1.2] truncate max-w-[70%] text-[1.389vw] tracking-[-0.04em] text-black">
          {item.name || "error"}
        </p>
        <p className="mt-[0.694vw] font-medium leading-[1.2] text-[1.111vw] tracking-[-0.02em] text-black">
          {item.size ? `Size: ${item.size}` : "error"}
        </p>
        <p className="mt-[0.694vw] font-medium leading-[1.2] text-[1.111vw] tracking-[-0.02em] text-black">
          {item.retailPrice ? `MRP ${formatPrice(item.retailPrice, item.currency)}` : "error"}
        </p>
      </div>
      <div className="mt-auto pt-[2.083vw]">
        <KeepReturnToggle decision={decision} onDecision={onDecision} />
      </div>
    </div>
  );
}

/* â"€â"€ Mobile decision card â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
function DecisionCardMobile({
  item,
  decision,
  onDecision,
}: {
  item: BoxItemDisplay;
  decision: Decision;
  onDecision: (d: Decision) => void;
}) {
  return (
    <div className="flex w-[75vw] md:w-full shrink-0 flex-col">
      <div className="relative overflow-hidden w-full h-[88.889vw] md:h-auto md:aspect-[3/4]" style={{ backgroundColor: CARD_BG }}>
        {item.thumbnailUrl ? (
          <Image src={item.thumbnailUrl} alt={item.name} fill sizes="75vw" className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: CARD_BG }} />
        )}
      </div>
      <div className="flex flex-col pt-[2.778vw] md:pt-[1.953vw]">
        <p className="font-medium uppercase leading-[1.2] text-[#4e4e4e] text-[2.778vw] md:text-[1.823vw] tracking-[-0.02em]">
          {item.brand || "error"}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] font-semibold capitalize leading-[1.2] truncate max-w-[70%] text-[3.889vw] md:text-[2.344vw] tracking-[-0.04em] text-black">
          {item.name || "error"}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] font-medium leading-[1.2] text-[3.333vw] md:text-[2.083vw] tracking-[-0.02em] text-black">
          {item.size ? `Size: ${item.size}` : "error"}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] font-medium leading-[1.2] text-[3.333vw] md:text-[2.083vw] tracking-[-0.02em] text-black">
          {item.retailPrice ? `MRP ${formatPrice(item.retailPrice, item.currency)}` : "error"}
        </p>
      </div>
      <div style={{ marginTop: "4.167vw" }}>
        <KeepReturnToggle decision={decision} onDecision={onDecision} compact />
      </div>
    </div>
  );
}

/* â"€â"€ Small kept-item card in summary section â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
function KeptItemCard({ item }: { item: BoxItemDisplay }) {
  return (
    <div className="relative shrink-0 w-[36.111vw] md:w-[16vw] lg:w-[9.722vw]">
      {/* image */}
      <div
        className="relative w-full overflow-hidden h-[38.889vw] md:h-auto md:aspect-[3/4]"
        style={{ backgroundColor: CARD_BG }}
      >
        {item.thumbnailUrl ? (
          <Image src={item.thumbnailUrl} alt={item.name} fill sizes="(max-width:768px) 36.111vw, 16vw" className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: CARD_BG }} />
        )}
      </div>

      {/* info */}
      <div className="flex flex-col pt-[1.389vw] md:pt-[0.911vw] lg:pt-[1.042vw]">
        <p className="font-medium uppercase leading-[1.2] text-[#4e4e4e] text-[1.563vw] md:text-[1.823vw] lg:text-[0.833vw] tracking-[-0.02em]">
          {item.brand || "error"}
        </p>
        <p className="mt-[0.694vw] md:mt-[0.911vw] lg:mt-[0.694vw] font-semibold capitalize leading-[1.2] truncate max-w-[70%] text-black text-[2.083vw] md:text-[2.344vw] lg:text-[1.111vw] tracking-[-0.04em]">
          {item.name || "error"}
        </p>
        <p className="mt-[0.694vw] md:mt-[0.911vw] lg:mt-[0.694vw] font-medium leading-[1.2] text-black text-[1.823vw] md:text-[2.083vw] lg:text-[0.972vw] tracking-[-0.02em]">
          {item.size ? `Size: ${item.size}` : "error"}
        </p>
        <p className="mt-[1.302vw] md:mt-[0.911vw] lg:mt-[0.694vw] font-medium leading-[1.2] text-black text-[1.823vw] md:text-[2.083vw] lg:text-[0.972vw]">
          {item.retailPrice ? `MRP ${formatPrice(item.retailPrice, item.currency)}` : "error"}
        </p>
      </div>
    </div>
  );
}

/* â"€â"€ Main component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */
export default function BoxStageShopIntention() {
  const { items } = useBox();
  const router = useRouter();
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const setDecision = (id: string, d: Decision) => setDecisions((prev) => ({ ...prev, [id]: d }));

  const keptItems = useMemo(
    () => items.filter((it) => (decisions[it.id] ?? "keep") === "keep"),
    [items, decisions]
  );

  const totalKeepMinor = useMemo(
    () => keptItems.reduce((sum, it) => sum + it.retailPrice, 0),
    [keptItems]
  );

  const summaryCurrency = items[0]?.currency ?? "INR";

  const totalAfterCreditMinor = useMemo(() => {
    if (summaryCurrency !== "INR" || totalKeepMinor <= 0) return totalKeepMinor;
    return Math.max(0, totalKeepMinor - MEMBERSHIP_CREDIT_MINOR);
  }, [totalKeepMinor, summaryCurrency]);

  const handleProceed = () => {
    toast.success(`You're keeping ${keptItems.length} of ${items.length} items.`);
    router.push("/box/payment");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full px-[2.78vw] py-[8vw] text-center font-[var(--font-manrope)]">
        <p className="font-medium text-[4.167vw] md:text-[1.953vw] lg:text-[1.25vw]" style={{ color: `${TEXT_PRIMARY}b3` }}>
          No items in your box yet.
        </p>
        <Link
          href="/products"
          className="mt-[5.556vw] md:mt-[2.604vw] lg:mt-[1.389vw] inline-flex items-center justify-center rounded-full px-[5.556vw] md:px-[2.604vw] lg:px-[1.389vw] py-[2.778vw] md:py-[1.302vw] lg:py-[0.694vw] text-[3.889vw] md:text-[1.823vw] lg:text-[0.972vw] font-semibold text-white"
          style={{ backgroundColor: ACCENT_MAROON }}
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-[var(--font-manrope)]">
      <div className="mx-auto w-full pb-[27.778vw] md:pb-[13.021vw] lg:pb-[8.333vw]" style={{ paddingTop: "0" }}>

        {/* Desktop: item cards + toggles */}
        <div className="hidden w-full overflow-hidden lg:flex px-[1.389vw]" style={{ gap: "5px" }}>
          {items.map((item) => (
            <DecisionCard
              key={item.id}
              item={item}
              decision={decisions[item.id] ?? "keep"}
              onDecision={(d) => setDecision(item.id, d)}
            />
          ))}
        </div>

        {/* Tablet: horizontal carousel at 50% card width */}
        <div className="hidden md:block lg:hidden w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-[5px] pl-[1.953vw] pr-[1.953vw]">
            {items.map((item) => (
              <div key={item.id} style={{ width: "25vw" }} className="shrink-0">
                <DecisionCardMobile
                  item={item}
                  decision={decisions[item.id] ?? "keep"}
                  onDecision={(d) => setDecision(item.id, d)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: item cards + toggles */}
        <div className="md:hidden w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-[5px] pl-[2.78vw] pr-[2.78vw]">
            {items.map((item) => (
              <DecisionCardMobile
                key={item.id}
                item={item}
                decision={decisions[item.id] ?? "keep"}
                onDecision={(d) => setDecision(item.id, d)}
              />
            ))}
          </div>
        </div>

        {/* Summary section */}
        <div className="mt-[11.111vw] w-full pt-0 md:mt-[5.208vw] md:pt-0 lg:mt-[2.778vw]">
          {/* Desktop: 2-col layout */}
          <div className="hidden lg:flex w-full gap-[3.333vw] px-[1.389vw]">

            {/* Left: kept items list */}
            <div className="flex min-w-0 flex-1 flex-col gap-[2.083vw]">
              <p className="font-medium leading-[1.2] tracking-[-0.04em] text-black text-[1.944vw]">
                Keeping {keptItems.length} {keptItems.length === 1 ? "item" : "items"}
              </p>
              {keptItems.length > 0 ? (
                <div className="flex w-full flex-wrap gap-[0.833vw]">
                  {keptItems.map((item) => (
                    <KeptItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="font-medium opacity-50 text-black text-[1.042vw]">
                  No items marked to keep yet.
                </p>
              )}
            </div>

            {/* Right: order summary */}
            <div className="mt-[4.444vw] flex shrink-0 flex-col gap-[1.25vw] w-[29.167vw]">
              <p className="font-medium leading-[1.2] tracking-[-0.02em] text-black text-[1.667vw]">
                Order Summary
              </p>
              <div className="flex flex-col gap-[1.042vw]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-black text-[1.111vw]">Total Retail Value</span>
                  <span className="font-semibold tabular-nums text-black text-[1.111vw] tracking-[-0.02em]">{formatPrice(totalKeepMinor, summaryCurrency)}</span>
                </div>
                {summaryCurrency === "INR" && (
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-[1.111vw]" style={{ color: ACCENT_MAROON }}>Membership Credit</span>
                    <span className="font-semibold tabular-nums text-[1.111vw] tracking-[-0.02em]" style={{ color: ACCENT_MAROON }}>−₹{MEMBERSHIP_CREDIT_RUPEES.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 pt-[0.694vw]">
                  <span className="font-medium text-black text-[1.667vw] tracking-[-0.02em]">Total</span>
                  <span className="font-semibold tabular-nums text-black text-[1.667vw] tracking-[-0.02em]">{formatPrice(totalAfterCreditMinor, summaryCurrency)}</span>
                </div>
              </div>
              <button type="button" onClick={handleProceed} className="mt-auto flex h-[5.556vw] w-[16.667vw] items-center justify-center self-end rounded-full font-semibold tracking-[-0.04em] text-white text-[1.389vw]" style={{ backgroundColor: ACCENT_MAROON }}>
                Proceed
              </button>
            </div>
          </div>

          {/* Tablet: stacked layout */}
          <div className="hidden md:flex lg:hidden w-full flex-col gap-[3.906vw]">
            <p className="font-medium leading-[1.2] tracking-[-0.04em] text-black text-[3.125vw] px-[1.953vw]">
              Keeping {keptItems.length} {keptItems.length === 1 ? "item" : "items"}
            </p>
            {keptItems.length > 0 && (
              <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-center gap-[5px] pl-[1.953vw] pr-[1.953vw]">
                  {keptItems.map((item) => (
                    <div key={item.id} className="shrink-0" style={{ width: "16vw" }}>
                      <KeptItemCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-[1.953vw] px-[1.953vw]">
              <p className="font-medium leading-[1.2] tracking-[-0.02em] text-black text-[2.344vw]">Order Summary</p>
              <div className="flex flex-col gap-[1.302vw]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-black text-[1.823vw]">Total Retail Value</span>
                  <span className="font-semibold tabular-nums text-black text-[1.823vw] tracking-[-0.02em]">{formatPrice(totalKeepMinor, summaryCurrency)}</span>
                </div>
                {summaryCurrency === "INR" && (
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-[1.823vw]" style={{ color: ACCENT_MAROON }}>Membership Credit</span>
                    <span className="font-semibold tabular-nums text-[1.823vw] tracking-[-0.02em]" style={{ color: ACCENT_MAROON }}>−₹{MEMBERSHIP_CREDIT_RUPEES.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 pt-[1.302vw]">
                  <span className="font-medium text-black text-[2.083vw] tracking-[-0.02em]">Total</span>
                  <span className="font-semibold tabular-nums text-black text-[2.344vw] tracking-[-0.02em]">{formatPrice(totalAfterCreditMinor, summaryCurrency)}</span>
                </div>
              </div>
              <button type="button" onClick={handleProceed} className="flex h-[7.813vw] w-[26.042vw] items-center justify-center self-center rounded-full font-semibold tracking-[-0.04em] text-white text-[1.823vw]" style={{ backgroundColor: ACCENT_MAROON }}>
                Proceed
              </button>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="flex flex-col md:hidden">
            <p className="text-[5.5vw] font-medium leading-[1.2] tracking-[-0.04em] px-[2.78vw]" style={{ color: TEXT_PRIMARY }}>
              Keeping {keptItems.length} {keptItems.length === 1 ? "item" : "items"}
            </p>

            {keptItems.length > 0 && (
              <div className="mt-[8.333vw] w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max gap-[5px] pl-[2.78vw] pr-[2.78vw]">
                  {keptItems.map((item) => (
                    <div key={item.id} className="relative w-[40vw] shrink-0">
                      <div className="relative overflow-hidden" style={{ width: "40vw", height: "50vw", backgroundColor: CARD_BG }}>
                        {item.thumbnailUrl && (
                          <Image src={item.thumbnailUrl} alt={item.name} fill sizes="40vw" className="object-cover object-top" />
                        )}
                      </div>
                      <div className="flex flex-col pt-[2.778vw]">
                        <p className="font-medium uppercase leading-[1.2] text-[#4e4e4e] text-[2.778vw] tracking-[-0.02em]">{item.brand || "error"}</p>
                        <p className="mt-[1.389vw] font-semibold capitalize leading-[1.2] truncate max-w-[70%] text-black text-[3.889vw] tracking-[-0.04em]">{item.name || "error"}</p>
                        <p className="mt-[1.389vw] font-medium leading-[1.2] text-black text-[3.333vw] tracking-[-0.02em]">{item.size ? `Size: ${item.size}` : "error"}</p>
                        <p className="mt-[1.389vw] font-medium leading-[1.2] text-black text-[3.333vw] tracking-[-0.02em]">{item.retailPrice ? `MRP ${formatPrice(item.retailPrice, item.currency)}` : "error"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-[11.111vw] md:mt-[5.208vw] lg:mt-[2.778vw] flex flex-col px-[2.78vw] gap-[4.167vw] md:gap-[5.556vw]">
              <p className="text-[5.556vw] font-medium tracking-[-0.02em] text-black">Order Summary</p>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[4vw] font-medium text-black">Total Retail Value</span>
                <span className="text-[4vw] font-semibold tabular-nums text-black">{formatPrice(totalKeepMinor, summaryCurrency)}</span>
              </div>
              {summaryCurrency === "INR" && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[4vw] font-medium" style={{ color: ACCENT_MAROON }}>Membership Credit</span>
                  <span className="text-[4vw] font-semibold tabular-nums" style={{ color: ACCENT_MAROON }}>−₹{MEMBERSHIP_CREDIT_RUPEES.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4" style={{ paddingTop: "4.167vw" }}>
                <span className="text-[5vw] font-semibold text-black">Total</span>
                <span className="text-[6vw] font-semibold tabular-nums text-black">{formatPrice(totalAfterCreditMinor, summaryCurrency)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="mt-[5.556vw] flex h-[16.667vw] w-[55.556vw] self-center items-center justify-center rounded-full text-[3.889vw] font-semibold tracking-[-0.04em] text-white"
              style={{ backgroundColor: ACCENT_MAROON }}
            >
              Proceed
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
