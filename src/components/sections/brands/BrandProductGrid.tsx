"use client";

import ProductCard from "@/components/layout/ProductCard";
import ProductCardLayoutTwo from "@/components/layout/ProductCardLayoutTwo";
import AccountEmptyState from "@/components/sections/accounts/AccountEmptyState";
import type { HomeProduct } from "@/types/home";

type BrandProductGridProps = {
  products: HomeProduct[];
  view?: "grid" | "large";
  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
};

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-[10px] mt-[40px] lg:mt-[60px]">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex items-center justify-center rounded-full font-[var(--font-manrope)] font-medium transition-colors duration-200 text-[3.889vw] md:text-[1.823vw] lg:text-[1.111vw] size-[11.111vw] md:size-[5.208vw] lg:size-[3.333vw] ${
            p === page ? "bg-[#7A021D] text-white" : "border border-black text-black"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export default function BrandProductGrid({ products, view = "grid", page = 1, totalPages = 1, onPageChange }: BrandProductGridProps) {
  if (!products.length) {
    return <AccountEmptyState heading="No Products Yet" />;
  }

  const handlePageChange = (p: number) => {
    onPageChange?.(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "large") {
    return (
      <>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-[5px] gap-y-[20px] md:gap-y-[30px]">
          {products.map((product) => (
            <ProductCardLayoutTwo key={product.id} product={product} />
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </>
    );
  }

  return (
    <>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-x-[5px] gap-y-[20px] md:gap-y-[30px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
    </>
  );
}

export type { BrandProductGridProps };
