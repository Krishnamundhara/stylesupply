"use client";

import Image from "next/image";
import { useBox, type BoxItemDisplay } from "@/context/BoxContext";

function formatPrice(minor: number) {
  const rupees = Math.round(minor / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function ItemCardDesktop({
  item,
  compact,
  brandColor = "#4e4e4e",
  nameColor = "#000000",
  priceColor = "#000000",
}: {
  item: BoxItemDisplay;
  compact?: boolean;
  brandColor?: string;
  nameColor?: string;
  priceColor?: string;
}) {
  return (
    <div
      className={compact ? "flex flex-col" : "flex flex-1 min-w-0 flex-col"}
      style={compact ? { width: "11.111vw" } : undefined}
    >
      <div
        className="relative bg-[#F7F4EF] overflow-hidden"
        style={
          compact
            ? { width: "11.111vw", height: "12.5vw" }
            : { width: "100%", height: "22.222vw" }
        }
      >
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes={compact ? "11.111vw" : "18.75vw"}
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
      </div>
      <div
        className={`flex flex-col${compact ? "" : " pt-[1.953vw] lg:pt-[15px]"}`}
        style={{
          paddingTop: compact ? "2.083vw" : undefined,
          width: compact ? "11.111vw" : "100%",
        }}
      >
        <p
          className={`font-medium uppercase leading-[1.2] w-full tracking-[-0.02em] ${compact ? "text-[max(10px,0.833vw)]" : "text-[1.823vw] lg:text-[0.972vw]"}`}
          style={{ color: brandColor }}
        >
          {item.brand || "error"}
        </p>
        <p
          className={`font-semibold capitalize tracking-[-0.04em] leading-[1.2] truncate max-w-[70%] ${compact ? "text-[max(12px,1.042vw)]" : "mt-[0.911vw] lg:mt-[10px] text-[2.344vw] lg:text-[1.389vw]"}`}
          style={{ marginTop: compact ? "0.694vw" : undefined, color: nameColor }}
        >
          {item.name || "error"}
        </p>
        <p
          className={`font-medium tracking-[-0.02em] leading-[1.2] ${compact ? "text-[max(10px,0.833vw)]" : "text-[2.083vw] lg:text-[1.111vw] mt-[0.911vw] lg:mt-[0.694vw]"}`}
          style={{ marginTop: compact ? "0.347vw" : undefined, color: priceColor }}
        >
          {item.size ? `Size: ${item.size}` : ""}
        </p>
        {!compact && (
          <p className="font-medium tracking-[-0.02em] leading-[1.2] text-[2.083vw] lg:text-[1.111vw] mt-[0.911vw] lg:mt-[0.694vw]" style={{ color: priceColor }}>
            {item.retailPrice ? `MRP ${formatPrice(item.retailPrice)}` : "error"}
          </p>
        )}
      </div>
    </div>
  );
}

function ItemCardMobile({
  item,
  compact,
  figmaCarousel = false,
  brandColor = "#4e4e4e",
  nameColor = "#000000",
  priceColor = "#000000",
}: {
  item: BoxItemDisplay;
  compact?: boolean;
  figmaCarousel?: boolean;
  brandColor?: string;
  nameColor?: string;
  priceColor?: string;
}) {
  const width = compact ? (figmaCarousel ? "34.596vw" : "18.056vw") : "270px";
  const height = compact ? (figmaCarousel ? "40.362vw" : "22.222vw") : "320px";
  const textBlockWidth = compact && figmaCarousel ? "33.731vw" : "100%";
  const textTopPadding = compact
    ? figmaCarousel
      ? "5.766vw"
      : "10px"
    : "5.556vw";
  const textGap = compact && figmaCarousel ? "1.441vw" : compact ? "6px" : "4.167vw";
  const brandSize = compact ? (figmaCarousel ? "3.333vw" : "1.667vw") : "2.778vw";
  const nameSize = compact ? (figmaCarousel ? "4.336vw" : "2.5vw") : "3.889vw";
  const priceSize = "3.333vw";
  return (
    <div className="shrink-0 flex flex-col items-start" style={{ width }}>
      <div
        className="relative bg-[#F7F4EF] overflow-hidden"
        style={{ width, height }}
      >
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.name}
            fill
            sizes={compact ? "65vw" : "75vw"}
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7F4EF]" />
        )}
      </div>
      <div className="flex flex-col items-start" style={{ width: textBlockWidth, paddingTop: compact ? textTopPadding : "10px" }}>
        <p
          className="font-medium uppercase tracking-[-0.02em] leading-[1.2] text-left"
          style={{ fontSize: brandSize, color: brandColor }}
        >
          {item.brand || "error"}
        </p>
        <p
          className="font-semibold capitalize tracking-[-0.04em] leading-[1.2] text-left truncate max-w-[70%]"
          style={{ fontSize: nameSize, color: nameColor, marginTop: compact ? undefined : "5px" }}
        >
          {item.name || "error"}
        </p>
        <p className="font-medium tracking-[-0.02em] leading-[1.2] text-left" style={{ fontSize: compact ? brandSize : priceSize, color: priceColor, marginTop: compact ? "3px" : "5px" }}>
          {item.size ? `Size: ${item.size}` : ""}
        </p>
        {!compact && (
          <p className="font-medium tracking-[-0.02em] leading-[1.2] text-left" style={{ fontSize: priceSize, color: priceColor, marginTop: "5px" }}>
            {item.retailPrice ? `MRP ${formatPrice(item.retailPrice)}` : "error"}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BoxItemGrid({
  items: itemsProp,
  compact,
  mobileScrollable = false,
  brandColor = "#4e4e4e",
  nameColor = "#000000",
  priceColor = "#000000",
}: {
  items?: BoxItemDisplay[];
  compact?: boolean;
  mobileScrollable?: boolean;
  brandColor?: string;
  nameColor?: string;
  priceColor?: string;
}) {
  const { items: contextItems } = useBox();
  const items = itemsProp ?? contextItems;

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden md:flex w-full items-start overflow-hidden${compact ? " justify-center" : ""}`}
        style={compact
          ? { gap: "5px" }
          : { gap: "5px", paddingLeft: "2.78vw", paddingRight: "2.78vw", paddingBottom: "2.22vw" }}
      >
        {items.map((item) => (
          <ItemCardDesktop key={item.id} item={item} compact={compact} brandColor={brandColor} nameColor={nameColor} priceColor={priceColor} />
        ))}
      </div>

      {/* Mobile */}
      {compact ? (
        mobileScrollable ? (
          <div className="md:hidden w-full overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex" style={{ width: "max-content", gap: "5.189px", padding: "0 10px" }}>
              {items.map((item) => (
                <ItemCardMobile key={item.id} item={item} compact figmaCarousel brandColor={brandColor} nameColor={nameColor} priceColor={priceColor} />
              ))}
            </div>
          </div>
        ) : (
          <div className="md:hidden w-full flex justify-center" style={{ gap: "5px" }}>
            {items.map((item) => (
              <ItemCardMobile key={item.id} item={item} compact brandColor={brandColor} nameColor={nameColor} priceColor={priceColor} />
            ))}
          </div>
        )
      ) : (
        <div className="md:hidden w-full overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex" style={{ width: "max-content", gap: "5px", padding: "0 10px" }}>
            {items.map((item) => (
              <ItemCardMobile key={item.id} item={item} brandColor={brandColor} nameColor={nameColor} priceColor={priceColor} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
