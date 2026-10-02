"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeProductSection } from "@/types/home";
import { useBox } from "@/context/BoxContext";

interface BoxProps {
  data: HomeProductSection;
  hideSubtitle?: boolean;
}

const SLOT_DESCRIPTION = "Curate styles to create a look or try the same style in different sizes.";

function ProductSlot({
  brand,
  name,
  image,
  href,
  originalPrice,
  size,
  onRemove,
}: {
  brand: string;
  name: string;
  image: string;
  href: string;
  originalPrice?: string;
  size?: string;
  onRemove?: () => void;
}) {
  return (
    <div className="group relative flex shrink-0 flex-col font-[var(--font-manrope)] w-[265px] md:w-[38vw] lg:w-[18.4vw]">
      {/* Image */}
      <div className="relative w-full overflow-hidden bg-white h-[319px] md:h-[45vw] lg:h-[22.222vw]">
        <Link href={href} className="block w-full h-full">
          <Image
            src={image || "/image/image 1054.png"}
            alt={`${brand} ${name}`}
            fill
            sizes="(max-width:768px) 265px, (max-width:1024px) 17vw, 18.4vw"
            className="object-cover object-top"
          />
        </Link>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="absolute top-[12px] right-[12px] md:top-[20px] md:right-[20px] flex items-center justify-center size-[18px] transition-opacity hover:opacity-70 z-10"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="1" y1="1" x2="17" y2="17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
              <line x1="17" y1="1" x2="1" y2="17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {/* Text below image */}
      <Link href={href}>
        <div className="pt-[10px] md:pt-[15px] flex flex-col">
          <p className="font-medium uppercase text-[#4e4e4e] text-[2.778vw] md:text-[2.083vw] lg:text-[0.972vw] tracking-[-0.02em] leading-[1.2]">
            {brand || "error"}
          </p>
          <p className="mt-[5px] md:mt-[10px] font-semibold capitalize text-black text-[3.889vw] md:text-[2.604vw] lg:text-[1.389vw] tracking-[-0.04em] leading-[1.2] truncate max-w-[70%]">
            {name || "error"}
          </p>
          <p className="mt-[5px] md:mt-[1.302vw] lg:mt-[0.694vw] font-medium text-black text-[3.333vw] md:text-[2.344vw] lg:text-[1.111vw] tracking-[-0.02em] leading-[1.2]">
            {size ? `Size: ${size}` : "error"}
          </p>
          <p className="mt-[5px] md:mt-[10px] font-medium text-black text-[3.333vw] md:text-[2.344vw] lg:text-[1.111vw] tracking-[-0.02em] leading-[1.2]">
            {originalPrice ? (originalPrice.startsWith("MRP") ? originalPrice : `MRP ${originalPrice}`) : "error"}
          </p>
        </div>
      </Link>
    </div>
  );
}

function EmptySlot({ description }: { description: string }) {
  return (
    <Link href="/products" className="relative flex shrink-0 flex-col items-center justify-center bg-[#7A021D] font-[var(--font-manrope)] text-white text-center px-[22px] w-[265px] h-[319px] md:w-[38vw] md:h-[45vw] lg:w-[18.4vw] lg:h-[22.15vw]">
      <span className="font-normal text-[49px] md:text-[6vw] lg:text-[3.37vw] leading-[1.2] tracking-[-0.04em]">+</span>
      <p className="mt-[20px] md:mt-[2vw] lg:mt-[1.39vw] font-medium text-[15px] md:text-[2.083vw] lg:text-[1.05vw] leading-[1.4] tracking-[-0.02em]">
        Add items to complete<br />your box
      </p>
    </Link>
  );
}

export default function Box({ data, hideSubtitle = false }: BoxProps) {
  const { items: boxItems, removeItem } = useBox();
  const href = data.viewAllHref ?? "/products";
  const label = data.viewAllLabel ?? "View Box";
  const subtitle = data.subtitle ?? SLOT_DESCRIPTION;

  const BOX_MAX = 5;

  // Map real box items to slot format
  const filledSlots = boxItems.map((item) => ({
    id: item.id,
    brand: item.brand,
    name: item.name,
    image: item.thumbnailUrl ?? "",
    href: `/products/${item.productId}`,
    originalPrice: item.retailPrice ? `₹${Math.round(item.retailPrice / 100).toLocaleString("en-IN")}` : undefined,
    size: item.size || undefined,
  }));

  const emptySlotCount = Math.max(0, BOX_MAX - filledSlots.length);

  // Mobile: show all filled cards + remaining empty slots (total 4 slots)
  const MOBILE_TOTAL = 4;
  const mobileEmptyCount = Math.max(0, MOBILE_TOTAL - filledSlots.length);

  // Desktop: all filled + remaining empty up to 5
  const desktopFilled = filledSlots;

  return (
    <section className="w-full bg-[#F7F4EF] font-[var(--font-manrope)] pt-[8.333vw] pb-[8.333vw] md:pt-[3.906vw] md:pb-[3.906vw] lg:pt-[2.778vw] lg:pb-[2.778vw]">

      {/* Heading + subtitle */}
      <div className="flex flex-col items-center text-center px-[14px] lg:px-0">
        <h2 className="font-normal text-black tracking-[-0.04em] text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw] leading-[0.85]">
          {data.title}
        </h2>

        {!hideSubtitle && (
          <>
            {/* Mobile subtitle — two fixed lines */}
            <p className="mt-[8.333vw] font-medium text-black leading-[1.2] tracking-[-0.02em] text-[4.444vw] md:hidden">
              Curate styles to create a look or try<br />the same style in different sizes
            </p>

            {/* Desktop subtitle — two fixed lines */}
            <p className="mt-[3.906vw] lg:mt-[2.778vw] font-medium text-black leading-[1.4] tracking-[-0.02em] text-[1.111vw] md:text-[2.344vw] hidden md:block lg:text-[max(14px,1.25vw)]">
              Curate styles to create a look or try the same<br />style in different sizes
            </p>
          </>
        )}
      </div>

      {/* Mobile: horizontal scroll row */}
      <div className="mt-[8.333vw] w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
        <div className="flex items-start gap-[5px] px-[15px]" style={{ width: "max-content" }}>
          {filledSlots.map((slot) => (
            <ProductSlot
              key={slot.id}
              brand={slot.brand}
              name={slot.name}
              image={slot.image}
              href={slot.href}
              originalPrice={slot.originalPrice}
              size={slot.size}
              onRemove={() => removeItem(slot.id)}
            />
          ))}
          {Array.from({ length: mobileEmptyCount }, (_, i) => (
            <EmptySlot key={`empty-mobile-${i}`} description="Add items to complete your box" />
          ))}
        </div>
      </div>

      {/* Tablet: horizontal scroll row — show max 3 slots (2 full + half peek) */}
      <div className="mt-[3.906vw] w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden hidden md:block lg:hidden">
        <div className="flex items-start gap-[5px] px-[15px]" style={{ width: "max-content" }}>
          {[...filledSlots, ...Array.from({ length: emptySlotCount }, (_, i) => ({ id: `empty-tablet-${i}`, isEmpty: true }))].map((slot) =>
            "isEmpty" in slot ? (
              <EmptySlot key={slot.id} description="Add items to complete your box" />
            ) : (
              <ProductSlot
                key={slot.id}
                brand={slot.brand}
                name={slot.name}
                image={slot.image}
                href={slot.href}
                originalPrice={slot.originalPrice}
                size={slot.size}
                onRemove={() => removeItem(slot.id)}
              />
            )
          )}
        </div>
      </div>

      {/* Mobile + Tablet: CTA */}
      <div className="mt-[8.333vw] md:mt-[3.906vw] flex justify-center lg:hidden">
        <Link
          href={href}
          className="flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium leading-[1.1] tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[2.344vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          {label}
        </Link>
      </div>

      {/* Desktop: cards row */}
      <div className="mx-auto hidden w-full max-w-360 items-start justify-center gap-[0.56vw] px-[3.33vw] pt-[40px] pb-[2.778vw] lg:flex">
        {desktopFilled.map((product) => (
          <ProductSlot
            key={product.id}
            brand={product.brand}
            name={product.name}
            image={product.image}
            href={product.href}
            originalPrice={product.originalPrice}
            size={product.size}
            onRemove={() => removeItem(product.id)}
          />
        ))}
        {Array.from({ length: emptySlotCount }, (_, i) => (
          <Link key={`empty-desktop-${i}`} href="/products" className="flex aspect-[265/317] w-[17vw] lg:w-[18.4vw] shrink-0 flex-col items-center justify-center gap-[1.5vw] border border-black/60 bg-[#7A021D] px-[2vw] text-center font-[var(--font-manrope)] text-white">
            <span className="text-[3vw] lg:text-[3.33vw] font-normal leading-[1.2] tracking-[-0.04em]">+</span>
            <p className="text-[1.302vw] lg:text-[1.04vw] font-medium leading-[1.4] tracking-[-0.3px]">
              Add items to complete<br />your box
            </p>
          </Link>
        ))}
      </div>

      {/* Desktop: CTA */}
      <div className="hidden lg:flex justify-center">
        <Link
          href={href}
          className="flex h-[7.813vw] w-[20.833vw] items-center justify-center rounded-full bg-[#7A021D] text-[1.823vw] font-medium leading-[1.1] tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
