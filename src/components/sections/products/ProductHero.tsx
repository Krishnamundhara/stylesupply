"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useBox } from "@/context/BoxContext";
import toast from "react-hot-toast";
import AddToBoxPopup from "@/components/layout/AddToBoxPopup";
import SavedPopup from "@/components/layout/SavedPopup";
import ColourSwatchRow from "./ColourSwatchRow";
import type { ColourGroup } from "@/types/product";
import { wishlistApi } from "@/services/wishlist";

export type ProductGalleryImage = {
  id: string;
  src: string;
  alt: string;
};

export type ProductAccordionItem = {
  key: string;
  title: string;
  content: string;
};

export type ProductHeroProps = {
  brand?: string;
  brandAboutHref?: string;
  title?: string;
  displayPrice?: string;
  images?: ProductGalleryImage[];
  defaultSize?: string;
  sizeOptions?: string[];
  unavailableSizes?: string[];
  accordionItems?: ProductAccordionItem[];
  productId?: string;
  variantId?: string;
  variantIdsBySize?: Record<string, string>;
  retailPriceMinor?: number;
  currency?: string;
  thumbnailUrl?: string | null;
  isOutOfStock?: boolean;
  colours?: ColourGroup[];
  activeColourSlug?: string;
  isSaved?: boolean;
};

const DEFAULT_IMAGES: ProductGalleryImage[] = [
  {
    id: "pd-1",
    src: "/images/Product_des/pexels-andrea-yurko-364018-982585-removebg-preview 1@4x.webp",
    alt: "Ursula Black Wrap Maxi Dress – front view",
  },
  {
    id: "pd-2",
    src: "/images/Product_des/image 795.webp",
    alt: "Ursula Black Wrap Maxi Dress – styled look",
  },
  {
    id: "pd-3",
    src: "/images/Product_des/image 3095.webp",
    alt: "Ursula Black Wrap Maxi Dress – detail",
  },
];

const DEFAULT_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const DEFAULT_UNAVAILABLE: string[] = [];
const MOBILE_THUMB_COUNT = 5;

/** Figma: product name always on two lines (e.g. "Ursula Maxi" / "Strappy Dress"). */
function productTitleTwoLines(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return title;
  const mid = Math.ceil(words.length / 2);
  return (
    <>
      {words.slice(0, mid).join(" ")}
      <br />
      {words.slice(mid).join(" ")}
    </>
  );
}

const DEFAULT_ACCORDION: ProductAccordionItem[] = [
  {
    key: "description",
    title: "Description",
    content:
      "Turn every moment into a statement with the Midnight Flow Dress.\n\nCrafted for comfort and confidence, this piece blends modern minimalism with timeless sophistication.",
  },
];

/* ─── Description block (desktop) ──────────────────────────── */
function DescriptionBlock({
  item,
  brand,
  brandAboutHref,
}: {
  item: ProductAccordionItem;
  brand?: string;
  brandAboutHref?: string;
}) {
  const showAboutLink =
    item.key === "description" && Boolean(brand && brandAboutHref);

  return (
    <div className="flex flex-col gap-[2.604vw] lg:gap-[1.389vw]">
      <p className="font-[var(--font-manrope)] text-[2.083vw] lg:text-[1.389vw] font-semibold tracking-[-0.04em] text-black">
        {item.title}
      </p>
      <p className="max-w-[40vw] lg:max-w-[34.722vw] font-[var(--font-manrope)] text-[1.563vw] lg:text-[1.111vw] font-medium leading-[1.5] tracking-[-0.02em] text-black whitespace-pre-line">
        {item.content}
      </p>
      {showAboutLink && (
        <Link href={brandAboutHref!} className="inline-flex items-center gap-[0.521vw] lg:gap-[0.278vw] font-[var(--font-manrope)] text-[1.563vw] lg:text-[0.972vw] font-semibold tracking-[-0.02em] text-[#7A021D]">
          <span className="underline underline-offset-2">About {brand}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

/* ─── Description block (mobile) ───────────────────────────── */
function MobileDescriptionBlock({
  item,
  brand,
  brandAboutHref,
}: {
  item: ProductAccordionItem;
  brand?: string;
  brandAboutHref?: string;
}) {
  const showAboutLink =
    item.key === "description" && Boolean(brand && brandAboutHref);

  return (
    <div className="flex flex-col gap-[3.333vw] md:gap-[1.563vw]">
      <p className="font-[var(--font-manrope)] text-[5.556vw] md:text-[2.604vw] font-semibold tracking-[-0.04em] text-black">
        {item.title}
      </p>
      <p className="font-[var(--font-manrope)] text-[4.444vw] md:text-[2.083vw] font-medium leading-[1.4] tracking-[-0.04em] text-black whitespace-pre-line">
        {item.content}
      </p>
      {showAboutLink && (
        <Link href={brandAboutHref!} className="inline-flex items-center gap-[0.833vw] md:gap-[0.391vw] font-[var(--font-manrope)] text-[3.889vw] md:text-[1.823vw] font-semibold tracking-[-0.02em] text-[#7A021D]">
          <span className="underline underline-offset-2">About {brand}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

/* ─── Size button ───────────────────────────────────────────── */
function SizeBtn({
  size,
  selected,
  unavailable,
  onClick,
  mobile,
}: {
  size: string;
  selected: boolean;
  unavailable: boolean;
  onClick: () => void;
  mobile?: boolean;
}) {
  const base = mobile
    ? "flex items-center justify-center rounded-full border font-[var(--font-manrope)] text-[3.583vw] md:text-[1.693vw] font-normal tracking-[-0.02em] size-[11.944vw] md:size-[5.599vw] shrink-0 transition-colors"
    : "flex size-[4.427vw] lg:size-[2.361vw] items-center justify-center rounded-full border font-[var(--font-manrope)] text-[1.563vw] lg:text-[0.833vw] font-semibold tracking-[-0.02em] transition-colors";

  const style = unavailable
    ? "border-[#E5E5E5] text-[#E5E5E5] cursor-not-allowed"
    : selected
    ? "border-black bg-black text-white"
    : "border-[#E5E5E5] text-black hover:border-black";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={unavailable}
      className={`${base} ${style}`}
    >
      {size}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — sticky right / scrolling left
═══════════════════════════════════════════════════════════════ */
function DesktopHero({
  brand,
  brandAboutHref,
  title,
  displayPrice,
  images,
  sizeOptions,
  unavailableSizes,
  accordionItems,
  productId,
  variantId,
  variantIdsBySize,
  retailPriceMinor,
  currency,
  thumbnailUrl,
  isOutOfStock,
  colours = [],
  activeColourSlug = "",
  isSaved,
}: Required<
  Pick<
    ProductHeroProps,
    | "brand"
    | "title"
    | "displayPrice"
    | "images"
    | "sizeOptions"
    | "unavailableSizes"
    | "accordionItems"
    | "productId"
    | "variantId"
    | "variantIdsBySize"
  >
> &
  Pick<ProductHeroProps, "brandAboutHref" | "retailPriceMinor" | "currency" | "thumbnailUrl" | "colours" | "activeColourSlug" | "isSaved"> & {
    isOutOfStock: boolean;
  }) {
  const [selectedSize, setSelectedSize] = useState(
    sizeOptions.find((s) => !unavailableSizes.includes(s)) ?? sizeOptions[0] ?? "M"
  );
  const [addingToBox, setAddingToBox] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [saved, setSaved] = useState(isSaved ?? false);
  const [savePending, setSavePending] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const { addItem, items } = useBox();

  useEffect(() => {
    setSaved(isSaved ?? false);
  }, [isSaved]);

  const handleAddToBox = async () => {
    const selectedVariantId = variantIdsBySize?.[selectedSize] ?? variantId;
    if (addingToBox) return;
    if (!productId || !selectedVariantId) {
      toast.error("This product is currently unavailable");
      return;
    }
    if (items.length >= 5) {
      toast.error("Your box is full (5 items max)");
      return;
    }
    setAddingToBox(true);
    const toastId = toast.loading("Adding to box…");
    const result = await addItem({
      productId,
      variantId: selectedVariantId,
      brand,
      name: title,
      size: selectedSize,
      retailPrice: retailPriceMinor ?? 0,
      currency: currency ?? "INR",
      thumbnailUrl: thumbnailUrl ?? (images[0]?.src ?? null),
    });
    toast.dismiss(toastId);
    setAddingToBox(false);
    if (result.ok) {
      setShowPopup(true);
    } else {
      toast.error(result.error ?? "Could not add to box");
    }
  };

  return (
    <>
    {showSavedPopup && typeof document !== "undefined" && createPortal(
      <SavedPopup
        brand={brand}
        name={title}
        displayPrice={displayPrice}
        thumbnailUrl={thumbnailUrl ?? (images[0]?.src ?? null)}
        onClose={() => setShowSavedPopup(false)}
      />,
      document.body
    )}
    {showPopup && (
      <AddToBoxPopup
        brand={brand ?? ""}
        name={title ?? ""}
        displayPrice={`MRP ₹${Math.round((retailPriceMinor ?? 0) / 100).toLocaleString("en-IN")}`}
        thumbnailUrl={thumbnailUrl ?? (images[0]?.src ?? null)}
        onClose={() => setShowPopup(false)}
      />
    )}
    <div className="hidden w-full md:flex">
      {/* ── LEFT: stacked image column — 856px / 1440px = 59.444vw ── */}
      <div className="relative w-[59.444vw] flex-shrink-0">
        {/* Stacked image panels (no progress slider — Figma 2050:6874 has none) */}
        <div className="flex flex-col gap-[0.694vw]">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="relative w-full bg-white"
              style={{ height: "51.181vw" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain object-center"
                sizes="59.444vw"
                priority={i === 0}
              />
              {isOutOfStock && i === 0 && (
                <div className="absolute top-[2.083vw] left-[2.083vw] bg-white px-[1.389vw] py-[0.694vw]">
                  <span className="font-[var(--font-manrope)] font-normal text-black text-[1.25vw] tracking-[-0.02em]">Out of Stock</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: sticky panel — 584px / 1440px = 40.556vw ── */}
      <div className="w-[40.556vw] flex-shrink-0">
        <div className="sticky top-[2vh] pl-[3.2vw] pr-[2.8vw] pt-[4.2vh]">
          <div className="flex flex-col">
          {/* Brand + wishlist row */}
          <div className="flex items-center justify-between gap-3">
            <p className="font-[var(--font-manrope)] text-[1.953vw] lg:text-[1.389vw] font-medium leading-[1.1] tracking-[-0.04em] text-black">
              {brand}
            </p>
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              disabled={savePending}
              onClick={async () => {
                if (savePending || !productId) return;
                setSavePending(true);
                const next = !saved;
                setSaved(next);
                try {
                  const result = await wishlistApi.toggleSaved(productId);
                  setSaved(result.saved);
                  if (result.saved) setShowSavedPopup(true);
                } catch {
                  setSaved(!next);
                } finally {
                  setSavePending(false);
                }
              }}
              className={`flex size-[5.208vw] lg:size-[2.778vw] shrink-0 items-center justify-center rounded-full shadow-sm transition-opacity disabled:opacity-50 bg-white`}
            >
              <Image
                src={saved ? "/icon/vuesax/linear/heart-red.svg" : "/icon/vuesax/linear/heart.svg"}
                alt=""
                width={24}
                height={24}
                className="size-[3.125vw] lg:size-[1.667vw]"
              />
            </button>
          </div>

          {/* Title — forced 2-line break (Figma Product Description) */}
          <h1 className="max-w-[40vw] lg:max-w-[30vw] font-[var(--font-manrope)] text-[5.208vw] lg:text-[3.75vw] font-medium leading-[1.1] tracking-[-0.04em] text-black">
            {productTitleTwoLines(title)}
          </h1>

          {/* Price */}
          <p className="mt-[3.906vw] lg:mt-[2.083vw] font-[var(--font-manrope)] text-[1.953vw] lg:text-[1.25vw] font-medium leading-[1.34] tracking-[-0.04em] text-black">
            {displayPrice}
          </p>
          <p className="mt-[2.604vw] lg:mt-[1.389vw] font-[var(--font-manrope)] text-[1.563vw] lg:text-[1.111vw] font-medium leading-[1.34] tracking-[-0.04em] text-[#4E4E4E]">
            ₹0 to try
          </p>

          {/* Colour swatches */}
          {colours.length > 1 && (
            <div className="mt-[3vh]">
              <p className="font-[var(--font-manrope)] text-[1.563vw] lg:text-[0.972vw] font-semibold tracking-[-0.02em] text-black">
                Colour
              </p>
              <div className="mt-[1vw]">
                <ColourSwatchRow colours={colours} activeSlug={activeColourSlug} />
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mt-[3.906vw] lg:mt-[2.083vw]">
            <div className="flex items-center justify-between">
              <p className="font-[var(--font-manrope)] text-[1.563vw] lg:text-[0.972vw] font-semibold tracking-[-0.02em] text-black">
                Choose size
              </p>
              <button
                type="button"
                className="font-[var(--font-manrope)] text-[1.302vw] lg:text-[0.833vw] font-bold uppercase tracking-[-0.04em] text-black"
              >
                SIZE GUIDE
              </button>
            </div>
            <div className="mt-[1.563vw] lg:mt-[1vw] flex items-center gap-[1.302vw] lg:gap-[0.694vw]">
              {sizeOptions.map((size) => (
                <SizeBtn
                  key={size}
                  size={size}
                  selected={selectedSize === size}
                  unavailable={unavailableSizes.includes(size)}
                  onClick={() =>
                    !unavailableSizes.includes(size) && setSelectedSize(size)
                  }
                />
              ))}
            </div>
          </div>

          {/* Add to Box / Notify Me CTA */}
          <div className="mt-[3.906vw] lg:mt-[2.083vw]">
            {isOutOfStock ? (
              <button
                type="button"
                className="flex h-[7.813vw] lg:h-[5.556vw] w-[20.833vw] lg:w-[16.667vw] items-center justify-center rounded-full border border-[#7A021D] bg-transparent font-[var(--font-manrope)] text-[2.083vw] lg:text-[1.389vw] font-normal tracking-[-0.04em] text-[#7A021D]"
              >
                Notify Me
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToBox}
                disabled={addingToBox}
                className="flex h-[7.813vw] lg:h-[5.556vw] w-[20.833vw] lg:w-[16.667vw] items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] text-[2.083vw] lg:text-[1.389vw] font-normal tracking-[-0.04em] text-[#FAFAFA]"
              >
                Add to Box
              </button>
            )}
          </div>

          {/* Description */}
          <div className="mt-[3.5vh]">
            {accordionItems.map((item) => (
              <DescriptionBlock
                key={item.key}
                item={item}
                brand={brand}
                brandAboutHref={brandAboutHref}
              />
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — standard stacked layout
═══════════════════════════════════════════════════════════════ */
function MobileHero({
  brand,
  brandAboutHref,
  title,
  displayPrice,
  images,
  sizeOptions,
  unavailableSizes,
  accordionItems,
  productId,
  variantId,
  variantIdsBySize,
  retailPriceMinor,
  currency,
  thumbnailUrl,
  isOutOfStock,
  colours = [],
  activeColourSlug = "",
  isSaved,
}: Required<
  Pick<
    ProductHeroProps,
    | "brand"
    | "title"
    | "displayPrice"
    | "images"
    | "sizeOptions"
    | "unavailableSizes"
    | "accordionItems"
    | "productId"
    | "variantId"
    | "variantIdsBySize"
  >
> &
  Pick<ProductHeroProps, "brandAboutHref" | "retailPriceMinor" | "currency" | "thumbnailUrl" | "colours" | "activeColourSlug" | "isSaved"> & {
    isOutOfStock: boolean;
  }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    sizeOptions.find((s) => !unavailableSizes.includes(s)) ?? sizeOptions[0] ?? "M"
  );
  const [addingToBox, setAddingToBox] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [saved, setSaved] = useState(isSaved ?? false);
  const [savePending, setSavePending] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const { addItem, items } = useBox();

  useEffect(() => {
    setSaved(isSaved ?? false);
  }, [isSaved]);

  const mobileImages = (images.length > 0 ? images : DEFAULT_IMAGES).slice(
    0,
    MOBILE_THUMB_COUNT
  );

  while (mobileImages.length < MOBILE_THUMB_COUNT) {
    const filler = DEFAULT_IMAGES[mobileImages.length % DEFAULT_IMAGES.length];
    mobileImages.push({
      ...filler,
      id: `${filler.id}-mobile-fill-${mobileImages.length}`,
    });
  }

  const safeActiveIdx = Math.min(activeIdx, mobileImages.length - 1);
  const activeImage = mobileImages[safeActiveIdx];

  const handleAddToBox = async () => {
    const selectedVariantId = variantIdsBySize?.[selectedSize] ?? variantId;
    if (addingToBox) return;
    if (!productId || !selectedVariantId) {
      toast.error("This product is currently unavailable");
      return;
    }
    if (items.length >= 5) {
      toast.error("Your box is full (5 items max)");
      return;
    }
    setAddingToBox(true);
    const toastId = toast.loading("Adding to box…");
    const result = await addItem({
      productId,
      variantId: selectedVariantId,
      brand,
      name: title,
      size: selectedSize,
      retailPrice: retailPriceMinor ?? 0,
      currency: currency ?? "INR",
      thumbnailUrl: thumbnailUrl ?? (images[0]?.src ?? null),
    });
    toast.dismiss(toastId);
    setAddingToBox(false);
    if (result.ok) {
      setShowPopup(true);
    } else {
      toast.error(result.error ?? "Could not add to box");
    }
  };

  return (
    <>
    {showSavedPopup && typeof document !== "undefined" && createPortal(
      <SavedPopup
        brand={brand}
        name={title}
        displayPrice={displayPrice}
        thumbnailUrl={thumbnailUrl ?? (images[0]?.src ?? null)}
        onClose={() => setShowSavedPopup(false)}
      />,
      document.body
    )}
    {showPopup && (
      <AddToBoxPopup
        brand={brand ?? ""}
        name={title ?? ""}
        displayPrice={`MRP ₹${Math.round((retailPriceMinor ?? 0) / 100).toLocaleString("en-IN")}`}
        thumbnailUrl={thumbnailUrl ?? (images[0]?.src ?? null)}
        onClose={() => setShowPopup(false)}
      />
    )}
    <div className="md:hidden w-full">
      {/* Top content — brand + wishlist row, title, price (Figma Product Description_M) */}
      <div className="px-[2.778vw] md:px-[2.604vw]">
        <div className="flex items-center justify-between gap-3">
          <p className="font-[var(--font-manrope)] text-[4.167vw] md:text-[1.953vw] font-medium leading-[1.47] tracking-[-0.04em] text-black">
            {brand}
          </p>
          <button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            disabled={savePending}
            onClick={async () => {
              if (savePending || !productId) return;
              setSavePending(true);
              const next = !saved;
              setSaved(next);
              try {
                const result = await wishlistApi.toggleSaved(productId);
                setSaved(result.saved);
                if (result.saved) setShowSavedPopup(true);
              } catch {
                setSaved(!next);
              } finally {
                setSavePending(false);
              }
            }}
            className={`flex size-[11.667vw] md:size-[5.469vw] shrink-0 items-center justify-center rounded-full shadow-sm transition-opacity disabled:opacity-50 bg-white`}
          >
            <Image
              src={saved ? "/icon/vuesax/linear/heart-red.svg" : "/icon/vuesax/linear/heart.svg"}
              alt=""
              width={20}
              height={20}
              className="size-[5.556vw] md:size-[2.604vw]"
            />
          </button>
        </div>

        <h1 className="font-[var(--font-manrope)] text-[7.778vw] md:text-[3.646vw] font-medium leading-[1.2] tracking-[-0.04em] text-black">
          {productTitleTwoLines(title)}
        </h1>

        <div className="mt-[4.444vw] md:mt-[2.083vw] flex items-baseline justify-between gap-3">
          <p className="font-[var(--font-manrope)] text-[4.167vw] md:text-[1.953vw] font-medium leading-none tracking-[-0.04em] text-black">
            {displayPrice}
          </p>
          <p className="font-[var(--font-manrope)] text-[4.167vw] md:text-[1.953vw] font-medium leading-none tracking-[-0.04em] text-[#757575]">
            ₹0 to try
          </p>
        </div>
      </div>

      {/* Product image block */}
      <div
        className="relative mt-[4.444vw] md:mt-[2.083vw] h-[97.222vw] md:h-[45.573vw] w-full overflow-hidden bg-white"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as HTMLDivElement).dataset.touchX = String(touch.clientX);
        }}
        onTouchEnd={(e) => {
          const startX = Number((e.currentTarget as HTMLDivElement).dataset.touchX ?? 0);
          const endX = e.changedTouches[0].clientX;
          const diff = startX - endX;
          if (Math.abs(diff) < 30) return;
          if (diff > 0) {
            setActiveIdx((p) => Math.min(p + 1, mobileImages.length - 1));
          } else {
            setActiveIdx((p) => Math.max(p - 1, 0));
          }
        }}
      >
        <div className="absolute inset-x-0 bottom-[13.889vw] md:bottom-[6.51vw] top-[5.556vw] md:top-[2.604vw]">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-contain object-center transition-opacity duration-300"
            sizes="100vw"
            priority
          />
        </div>
        {isOutOfStock && (
          <div className="absolute top-[4.444vw] md:top-[2.083vw] left-[4.444vw] md:left-[2.083vw] bg-white px-[4.444vw] md:px-[2.083vw] py-[2.222vw] md:py-[1.042vw]">
            <span className="font-[var(--font-manrope)] font-normal text-black text-[4.167vw] md:text-[1.953vw] tracking-[-0.02em]">Out of Stock</span>
          </div>
        )}

        {/* 5 bar indicators at bottom of image area */}
        <div className="absolute inset-x-0 bottom-[3.611vw] md:bottom-[1.693vw] flex items-center justify-center gap-[1.389vw] md:gap-[0.651vw]">
          {mobileImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`h-[1.2vw] md:h-[0.563vw] w-[8.333vw] md:w-[3.906vw] ${
                i === safeActiveIdx ? "bg-[#7A021D]" : "bg-[#7A021D]/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-[2.778vw] md:px-[2.604vw]">
        {colours.length > 1 && (
          <div className="mt-[5.556vw] md:mt-[2.604vw]">
            <p className="font-[var(--font-manrope)] text-[3.333vw] md:text-[1.563vw] font-medium tracking-[-0.04em] text-black">
              Colour
            </p>
            <div className="mt-[2.778vw] md:mt-[1.302vw]">
              <ColourSwatchRow colours={colours} activeSlug={activeColourSlug} mobile />
            </div>
          </div>
        )}

        <div className="mt-[4.167vw] md:mt-[1.953vw]">
          <div className="flex items-center justify-between gap-3">
            <p className="font-[var(--font-manrope)] text-[3.333vw] md:text-[1.563vw] font-medium tracking-[-0.04em] text-black">
              Choose size
            </p>
            <button
              type="button"
              className="shrink-0 font-[var(--font-manrope)] text-[3.333vw] md:text-[1.563vw] font-bold uppercase tracking-[-0.04em] text-black"
            >
              SIZE GUIDE
            </button>
          </div>
          <div className="mt-[4.167vw] md:mt-[1.953vw] flex flex-nowrap gap-[1.667vw] md:gap-[0.781vw] overflow-x-auto pb-[0.278vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sizeOptions.map((size) => (
              <SizeBtn
                key={size}
                size={size}
                selected={selectedSize === size}
                unavailable={unavailableSizes.includes(size)}
                onClick={() =>
                  !unavailableSizes.includes(size) && setSelectedSize(size)
                }
                mobile
              />
            ))}
          </div>
        </div>

        {isOutOfStock ? (
          <button
            type="button"
            className="mt-[6.667vw] md:mt-[3.125vw] mx-auto flex h-[16.667vw] md:h-[7.813vw] w-[55.556vw] md:w-[26.042vw] items-center justify-center rounded-full border border-[#7A021D] bg-transparent font-[var(--font-manrope)] text-[3.889vw] md:text-[1.823vw] font-medium tracking-[-0.04em] text-[#7A021D]"
          >
            Notify Me
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToBox}
            disabled={addingToBox}
            className="mt-[6.667vw] md:mt-[3.125vw] mx-auto flex h-[16.667vw] md:h-[7.813vw] w-[55.556vw] md:w-[26.042vw] items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] text-[3.889vw] md:text-[1.823vw] font-medium tracking-[-0.04em] text-white"
          >
            Add to Box
          </button>
        )}

        {/* Description */}
        <div className="mt-[11.111vw] md:mt-[5.208vw]">
          {accordionItems.map((item) => (
            <MobileDescriptionBlock
              key={item.key}
              item={item}
              brand={brand}
              brandAboutHref={brandAboutHref}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT
═══════════════════════════════════════════════════════════════ */
export default function ProductHero({
  brand = "Two Extra Lives",
  brandAboutHref = "/brands",
  title = "Ursula Black Wrap Maxi Dress",
  displayPrice = "MRP ₹6,40,000/-",
  images = DEFAULT_IMAGES,
  sizeOptions = DEFAULT_SIZE_OPTIONS,
  unavailableSizes = DEFAULT_UNAVAILABLE,
  accordionItems = DEFAULT_ACCORDION,
  productId = "",
  variantId = "",
  variantIdsBySize = {},
  retailPriceMinor,
  currency,
  thumbnailUrl,
  isOutOfStock = false,
  colours = [],
  activeColourSlug = "",
  isSaved = false,
}: ProductHeroProps) {
  const commonProps = {
    brand,
    brandAboutHref,
    title,
    displayPrice,
    images,
    sizeOptions,
    unavailableSizes,
    accordionItems,
    productId,
    variantId,
    variantIdsBySize,
    retailPriceMinor,
    currency,
    thumbnailUrl,
    isOutOfStock,
    colours,
    activeColourSlug,
    isSaved,
  };

  return (
    <section className="w-full font-[var(--font-manrope)]">
      <DesktopHero {...commonProps} />
      <MobileHero {...commonProps} />
    </section>
  );
}
