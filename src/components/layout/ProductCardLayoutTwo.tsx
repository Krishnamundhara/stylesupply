"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { HomeProduct } from "@/types/home";
import { wishlistApi } from "@/services/wishlist";
import SavedPopup from "./SavedPopup";

const HEART_ICON = "/icon/favourite.svg";

interface Props {
  product: HomeProduct;
}

const HEART_ICON_FILLED = "/icon/favourite-filled.svg";

/*
 * Layout 2 product card — Figma node 2050:9034
 * 2-column grid: large full-bleed image (white bg), action buttons pinned
 * to the right edge of the image, text info below.
 */
export default function ProductCardLayoutTwo({ product }: Props) {
  const initialSaved = product.isSaved ?? false;
  const [saved, setSaved] = useState(initialSaved);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending || !product.productId) return;
    setPending(true);
    const next = !saved;
    setSaved(next);
    try {
      const result = await wishlistApi.toggleSaved(product.productId);
      setSaved(result.saved);
      if (result.saved) setShowSavedPopup(true);
    } catch {
      setSaved(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
    <Link href={product.href} className="group flex w-full flex-col font-[var(--font-manrope)]">
      {/* Image */}
      <div className="relative w-full overflow-hidden bg-white aspect-[706/505]">
        <Image
          src={product.image || "/images/collection/Prod_image.png"}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-contain object-top"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Action buttons — bottom-right of image */}
        <div className="absolute bottom-[2.222vw] md:bottom-[1.042vw] lg:bottom-[0.833vw] right-[2.222vw] md:right-[1.042vw] lg:right-[0.833vw] z-10 flex flex-col gap-[2.222vw] md:gap-[1.042vw] lg:gap-[0.694vw]">
          {/* Wishlist */}
          <button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={handleToggle}
            disabled={pending}
            className="relative flex aspect-square w-[11.111vw] md:w-[5.208vw] lg:w-[3.472vw] shrink-0 items-center justify-center rounded-full bg-white"
          >
            <Image src={saved ? HEART_ICON_FILLED : HEART_ICON} alt="" fill className="object-contain pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Text info */}
      <div className="flex flex-col pt-[2.778vw] md:pt-[1.953vw] lg:pt-[1.042vw]">
        <p className="text-[2.778vw] md:text-[2.083vw] lg:text-[0.972vw] font-medium uppercase leading-[1.2] tracking-[-0.02em] text-[#4E4E4E]">
          {product.brand}
        </p>
        <p className="mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw] text-[3.889vw] md:text-[2.604vw] lg:text-[1.389vw] font-semibold capitalize leading-[1.2] tracking-[-0.04em] text-black truncate max-w-[70%]">
          {product.name}
        </p>
        {product.originalPrice && (
          <p className="mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw] leading-[1.2] text-[3.333vw] md:text-[2.344vw] lg:text-[1.111vw] font-medium tracking-[-0.02em] text-black">
            {product.originalPrice.startsWith("MRP")
              ? product.originalPrice
              : `MRP ${product.originalPrice}`}
          </p>
        )}
        <p className="mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw] text-[3.333vw] md:text-[2.344vw] lg:text-[1.111vw] font-medium leading-[1.2] tracking-[-0.02em] text-[#4E4E4E]">
          {product.currentPrice}
        </p>
      </div>
    </Link>

    {showSavedPopup && typeof document !== "undefined" && createPortal(
      <SavedPopup
        brand={product.brand}
        name={product.name}
        displayPrice={product.currentPrice}
        thumbnailUrl={product.image || null}
        productId={product.productId}
        onClose={() => setShowSavedPopup(false)}
      />,
      document.body
    )}
    </>
  );
}
