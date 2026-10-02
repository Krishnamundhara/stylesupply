"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { HomeProduct } from "@/types/home";
import { wishlistApi } from "@/services/wishlist";
import SavedPopup from "./SavedPopup";

interface ProductCardProps {
  product: HomeProduct;
  variant?: "default" | "saved";
}

const HEART_ICON = "/icon/favourite.svg";
const HEART_ICON_FILLED = "/icon/favourite-filled.svg";

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const imageBg = variant === "saved" ? "bg-[#F7F4EF]" : "bg-white";
  const initialSaved = product.isSaved ?? variant === "saved";
  const [saved, setSaved] = useState(initialSaved);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  async function handleToggle() {
    if (pending || !product.productId) {
      // No backing product id (mock/legacy card) — fall back to local state only.
      if (!product.productId) {
        if (saved) setSaved(false);
        else { setSaved(true); setShowSavedPopup(true); }
      }
      return;
    }
    setPending(true);
    const next = !saved;
    setSaved(next); // optimistic
    try {
      const result = await wishlistApi.toggleSaved(product.productId);
      setSaved(result.saved);
      if (result.saved) setShowSavedPopup(true);
    } catch {
      setSaved(!next); // revert
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="relative flex w-full flex-col font-[var(--font-manrope)]">
        <div className={`relative aspect-[176/203] md:aspect-[350/420] w-full overflow-hidden pt-[5.556vw] md:pt-[2.604vw] lg:pt-[0px] ${imageBg}`}>
          <Link href={product.href} className="absolute inset-0" suppressHydrationWarning>
            <Image
              src={product.image || "/images/collection/Prod_image.png"}
              alt={`${product.brand} ${product.name}`}
              fill
              className="object-cover object-top"
            />
          </Link>

          <div
            className="absolute z-10 flex flex-col bottom-[2.222vw] md:bottom-[1.042vw] lg:bottom-[1.667vw] right-[1.389vw] md:right-[0.521vw] lg:right-[0.903vw] gap-[1.389vw] md:gap-[0.521vw] lg:gap-[0.694vw]"
          >
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              onClick={handleToggle}
              disabled={pending}
              className="relative flex shrink-0 aspect-square w-[11.111vw] md:w-[5.208vw] lg:w-[3.472vw] items-center justify-center bg-white"
              style={{ borderRadius: "9999px" }}
            >
              <Image src={saved ? HEART_ICON_FILLED : HEART_ICON} alt="" fill className="object-contain pointer-events-none" />
            </button>
          </div>
        </div>

        <Link href={product.href} className="pt-[2.778vw] md:pt-[1.953vw] lg:pt-[1.042vw] w-full min-w-0 block">
          <p className="text-[2.778vw] md:text-[1.823vw] lg:text-[0.972vw] font-medium uppercase leading-[1.2] tracking-[-0.02em] text-[#4E4E4E]">
            {product.brand}
          </p>
          <p className="mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw] text-[3.889vw] md:text-[2.344vw] lg:text-[1.389vw] font-semibold capitalize leading-[1.2] tracking-[-0.04em] text-black truncate max-w-[70%]">
            {product.name}
          </p>
          {product.originalPrice && (
            <p className="mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw] leading-[1.2] text-[3.333vw] md:text-[2.083vw] lg:text-[1.111vw] font-medium tracking-[-0.02em] text-black">
              {product.originalPrice.startsWith("MRP") ? product.originalPrice : `MRP ${product.originalPrice}`}
            </p>
          )}
          <p className="mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw] text-[3.333vw] md:text-[2.083vw] lg:text-[1.111vw] font-medium leading-[1.2] tracking-[-0.02em] text-[#4E4E4E]">
            ₹0 to try
          </p>
        </Link>
      </div>

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
