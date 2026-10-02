"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import ProductCard from "@/components/layout/ProductCard";
import ProductsBar from "@/components/layout/ProductsBar";
import type { HomeProduct } from "@/types/home";

export type SavedInsideInitialCollection = {
  id: string;
  name: string;
  products: {
    id: string;
    productId?: string;
    name: string;
    subtitle: string;
    image: string;
    retailPrice?: string;
    rentPrice?: string;
  }[];
};

export type SavedInsideOtherCollection = {
  id: string;
  name: string;
  count: number;
  images: [string, string, string, string];
};

const MOCK_PRODUCTS: HomeProduct[] = [
  { id: "1", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/1" },
  { id: "2", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/2" },
  { id: "3", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/3" },
  { id: "4", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/4" },
  { id: "5", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/5" },
  { id: "6", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/6" },
  { id: "7", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/7" },
  { id: "8", brand: "TWO EXTRA LIVES", name: "Baobab Dress", image: "/images/wardrobe-sample.webp", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try", href: "/products/8" },
];

function OtherCollectionCard({ col }: { col: SavedInsideOtherCollection }) {
  return (
    <Link href={`/wishlist/${col.id}`} className="flex flex-col bg-[#fbf9f9] w-full">
      {/* Header: name + count */}
      <div className="flex items-center justify-between px-[2.222vw] md:px-[2.222vw] pt-[4.722vw] md:pt-[1.389vw] pb-[2.778vw] md:pb-[1.042vw]">
        <span className="font-[var(--font-manrope)] font-semibold text-black text-[5vw] md:text-[2.083vw] lg:text-[1.528vw] tracking-[-0.04em] leading-[1.1]">
          {col.name}
        </span>
        <span className="font-[var(--font-manrope)] font-semibold text-black text-[3.333vw] md:text-[1.302vw] lg:text-[0.833vw] tracking-[-0.02em]">
          {col.count} Products
        </span>
      </div>
      {/* 2×2 image grid */}
      <div className="grid grid-cols-2 gap-[1.667vw] md:gap-[1.042vw] p-[1.944vw] md:p-[1.042vw]">
        {col.images.map((src, i) => (
          <div key={i} className="relative w-full aspect-[160/121] md:aspect-[314/218] overflow-hidden bg-white">
            <Image src={src} alt="" fill className="object-cover object-top" sizes="(max-width: 767px) 45vw, 22vw" />
          </div>
        ))}
      </div>
    </Link>
  );
}

export default function SavedInsideClient({
  initialCollection,
  otherCollections = [],
}: {
  initialCollection?: SavedInsideInitialCollection;
  otherCollections?: SavedInsideOtherCollection[];
}) {
  const [view, setView] = useState<"grid" | "large">("grid");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [collectionName, setCollectionName] = useState(initialCollection?.name ?? "All Favourites");
  const inputRef = useRef<HTMLInputElement>(null);

  const products: HomeProduct[] = initialCollection && initialCollection.products.length > 0
    ? initialCollection.products.map((p) => ({
        id: p.id,
        productId: p.productId,
        brand: p.name,
        name: p.subtitle,
        image: p.image,
        originalPrice: p.retailPrice ? `MRP ${p.retailPrice}` : undefined,
        currentPrice: p.rentPrice ?? "₹0 to try",
        href: `/products/${p.productId ?? p.id}`,
        isSaved: true,
      }))
    : MOCK_PRODUCTS;

  return (
    <section className="bg-white w-full">

      {/* Collection title */}
      <div className="px-[2.778vw] md:px-[1.736vw] pt-[8.333vw] md:pt-[3.906vw] lg:pt-[4.861vw] pb-[8.333vw] md:pb-[3.906vw] lg:pb-[4.861vw] flex items-center gap-[2.778vw] md:gap-[1.042vw]">
        {isEditing ? (
          <input
            ref={inputRef}
            autoFocus
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setIsEditing(false); }}
            className="font-[var(--font-manrope)] font-medium text-black text-[8.333vw] md:text-[3.906vw] lg:text-[3.056vw] tracking-[-0.04em] leading-[1.1] bg-transparent outline-none border-b border-black w-full max-w-[80vw] md:max-w-[50vw]"
          />
        ) : (
          <h2 className="font-[var(--font-manrope)] font-medium text-black text-[8.333vw] md:text-[3.906vw] lg:text-[3.056vw] tracking-[-0.04em] leading-[1.1]">
            {collectionName}
          </h2>
        )}
        <button
          type="button"
          onClick={() => { setIsEditing(true); setTimeout(() => inputRef.current?.focus(), 0); }}
          aria-label="Edit collection name"
          className="shrink-0 flex items-center"
        >
          <Image src="/icon/vuesax/linear/Mode edit.svg" alt="Edit" width={20} height={20} className="w-[5vw] h-[5vw] md:w-[2.083vw] md:h-[2.083vw] lg:w-[1.389vw] lg:h-[1.389vw]" />
        </button>
      </div>

      {/* Products bar */}
      <ProductsBar
        totalCount={products.length}
        label="All Products"
        activeCategory={activeCategory}
        onCategoryChange={(cat) => setActiveCategory(cat || undefined)}
        view={view}
        onViewChange={setView}
      />

      {/* Product grid */}
      <div className="px-[2.778vw] md:px-[1.736vw] pt-[4.167vw] md:pt-[1.389vw]">
        {view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[1.389vw] md:gap-x-[0.347vw] gap-y-[5.556vw] md:gap-y-[2.778vw]">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} variant="saved" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0.694vw] gap-y-[5.556vw] md:gap-y-[2.778vw]">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} variant="saved" />
            ))}
          </div>
        )}
      </div>

      {/* Other Favourites */}
      {otherCollections.length > 0 && (
        <>
        <div className="h-[27.778vw] md:h-[13.021vw] lg:h-[7.639vw]" />
        <div className="px-[2.778vw] md:px-[1.736vw]">
          <h2 className="font-[var(--font-manrope)] font-normal text-black text-[12.222vw] md:text-[5.859vw] lg:text-[4.444vw] tracking-[-0.04em] leading-[1.2] text-center md:text-left mb-[5.556vw] md:mb-[2.083vw]">
            Other Favourites
          </h2>
          <div className="flex flex-col gap-[4.167vw] md:hidden">
            {otherCollections.map((col) => (
              <OtherCollectionCard key={col.id} col={col} />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-2 gap-[1.736vw]">
            {otherCollections.map((col) => (
              <OtherCollectionCard key={col.id} col={col} />
            ))}
          </div>
        </div>
        </>
      )}

      {/* Looking for inspiration */}
      <div className="h-[27.778vw] md:h-[13.021vw] lg:h-[7.639vw]" />
      <div className="flex flex-col items-center text-center pb-[27.778vw] md:pb-[8.333vw] px-[2.778vw] md:px-[0.694vw]">
        <h2 className="font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] lg:text-[4.444vw]">
          Looking for<br className="md:hidden" /> inspiration?
        </h2>
        <p className="mt-[2.778vw] md:mt-[2.083vw] font-[var(--font-manrope)] font-medium text-black tracking-[-0.04em] text-[4.167vw] md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[1.667vw] leading-[1.4] md:leading-[1.2] max-w-[80vw] md:max-w-none lg:max-w-[31.181vw]">
          Browse our curation to start building your<br />outfit for any occasion.
        </p>
        <div className="flex items-center justify-between w-full md:w-auto md:justify-center gap-[2.778vw] md:gap-[0.694vw] mt-[8.333vw] md:mt-[2.083vw]">
          <Link
            href="/collections"
            className="flex items-center justify-center rounded-full border border-[#7A021D] font-[var(--font-manrope)] font-medium text-[#7A021D] tracking-[-0.04em] whitespace-nowrap w-[44.444vw] h-[16.667vw] text-[4.167vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[16.667vw] lg:h-[5.556vw] lg:text-[1.389vw]"
          >
            Browse Collections
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-medium text-white tracking-[-0.04em] whitespace-nowrap w-[44.444vw] h-[16.667vw] text-[4.167vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[16.667vw] lg:h-[5.556vw] lg:text-[1.389vw]"
          >
            Browse All
          </Link>
        </div>
      </div>

    </section>
  );
}
