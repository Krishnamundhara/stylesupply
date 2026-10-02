"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { FilterValues } from "./FilterSortPopup";

const FilterSortPopup = dynamic(() => import("./FilterSortPopup"), { ssr: false });

const DEFAULT_CATEGORIES = [
  "Accessories",
  "Bottoms",
  "Dresses",
  "Shoes",
  "Tops",
  "Outerwear",
  "Co-ords",
  "Jumpsuits",
  "Bags",
];

type ProductsBarProps = {
  totalCount?: number;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
  view?: "grid" | "large";
  onViewChange?: (v: "grid" | "large") => void;
  label?: string;
  /** When true, Filters / Sort / view icons have no hover styling (e.g. individual brand page). */
  suppressBarHover?: boolean;
  /** Current filter/sort values, when this bar is wired to the API. */
  filterValues?: FilterValues;
  /** Apply handler. When provided, the popup mutates state via this callback. */
  onApplyFilters?: (next: FilterValues) => void;
  /** Hide the brand filter inside the popup (useful on individual brand pages). */
  hideBrandFilter?: boolean;
};

const DEFAULT_FILTER_VALUES: FilterValues = {
  sort: "-created_at",
  brands: [],
  sizes: [],
  materials: [],
  colours: [],
};

export default function ProductsBar({
  totalCount = 25,
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onCategoryChange,
  view = "grid",
  onViewChange,
  label = "All Products",
  suppressBarHover = false,
  filterValues,
  onApplyFilters,
  hideBrandFilter = false,
}: ProductsBarProps) {
  const barHover = suppressBarHover
    ? ""
    : "hover:text-[#6b0b23] transition-colors";
  const [selected, setSelected] = useState<string | null>(activeCategory ?? null);
  const [filterOpen, setFilterOpen] = useState(false);

  function handleSelect(cat: string | null) {
    setSelected(cat);
    onCategoryChange?.(cat ?? "");
  }

  return (
    <div className="w-full font-[var(--font-manrope)] px-[4.167vw] lg:px-[1.736vw]">

      {/* ── Row 1: all tabs (label included) ── */}
      <div className="w-full overflow-x-auto scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="flex items-baseline justify-between min-w-max w-full gap-[9.722vw] md:gap-[4.557vw] lg:gap-[2.431vw] pb-[4.167vw] md:pb-[1.667vw]"
        >
          {/* "All Products" as a clickable tab */}
          <button
            onClick={() => handleSelect(null)}
            className="relative shrink-0 whitespace-nowrap leading-normal transition-colors text-[3.889vw] md:text-[1.823vw] lg:text-[1.25vw]"
            style={{ letterSpacing: "-0.04em", color: selected === null ? "#6b0b23" : "#000000" }}
          >
            <span style={{ fontWeight: 500 }}>{label}</span>
            {selected === null && (
              <span
                className="absolute left-0 right-0 bottom-[-4.167vw] md:bottom-[-1.667vw]"
                style={{
                  height: "4px",
                  backgroundColor: "#7A021D",
                }}
              />
            )}
          </button>

          {/* ── scrollable category tabs (now inline) ── */}
          {[...categories].map((cat) => {
              const isActive = selected !== null && cat === selected;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelect(cat)}
                  className="relative shrink-0 whitespace-nowrap leading-normal transition-colors text-[3.889vw] md:text-[1.823vw] lg:text-[1.25vw]"
                  style={{ letterSpacing: "-0.04em", color: isActive ? "#6b0b23" : "#000000" }}
                >
                  <span style={{ fontWeight: 500 }}>{cat}</span>
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 bottom-[-4.167vw] md:bottom-[-1.667vw]"
                      style={{
                        height: "4px",
                        backgroundColor: "#7A021D",
                      }}
                    />
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* ── Full-width divider (2px — matches settings row dividers) ── */}
      <div className="h-[2px] w-full shrink-0 bg-black" />

      {/* ── Row 2: count + grid icon (mobile) / count + Filters + Sort By + icon (desktop) ── */}
      <div className="flex items-center justify-between pt-[20px] pb-0 lg:pb-[30px]">

        <p
          className="font-[var(--font-manrope)] font-semibold text-black leading-normal m-0 whitespace-nowrap opacity-60 text-[3.333vw] md:text-[1.823vw] lg:text-[0.972vw]"
        >
          {totalCount} PRODUCTS
        </p>

        <div className="flex items-center">
          <button
            onClick={() => setFilterOpen(true)}
            className={`hidden md:block font-[var(--font-manrope)] font-semibold text-black capitalize leading-normal md:text-[1.823vw] lg:text-[0.972vw] underline ${barHover}`}
            style={{ letterSpacing: "0.28px", marginRight: "40px" }}
          >
            Sort &amp; Filter
          </button>

          {/* Grid view icon */}
          <button
            aria-label="Grid view"
            onClick={() => onViewChange?.("grid")}
            className="flex items-center justify-center mr-3"
          >
            <Image
              src="/images/individual_Brandlanding/Frame 2087328047.png"
              alt=""
              width={23}
              height={23}
              className="object-contain w-[4.444vw] h-[4.444vw] md:w-[2.604vw] md:h-[2.604vw] lg:w-[1.597vw] lg:h-[1.597vw]"
              style={{ opacity: view === "grid" ? 1 : 0.4 }}
            />
          </button>

          {/* Two-col view icon */}
          <button
            aria-label="Two column view"
            onClick={() => onViewChange?.("large")}
            className="flex items-center justify-center"
          >
            <svg
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[4.444vw] h-[4.444vw] md:w-[2.604vw] md:h-[2.604vw] lg:w-[1.597vw] lg:h-[1.597vw]"
            >
              <rect x="0" y="0" width="10" height="23" rx="1.5" fill="#7a021d" fillOpacity={view === "large" ? 1 : 0.4} />
              <rect x="13" y="0" width="10" height="23" rx="1.5" fill="#7a021d" fillOpacity={view === "large" ? 1 : 0.4} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Row 3 (mobile only): Filter & Sort By ── */}
      <div className="flex items-center pt-[20px] pb-[20px] md:hidden">
        <button
          onClick={() => setFilterOpen(true)}
          className={`font-[var(--font-manrope)] font-semibold text-black capitalize leading-normal text-[3.333vw] underline ${barHover}`}
          style={{ letterSpacing: "0.28px" }}
        >
          Sort &amp; Filter
        </button>
      </div>

      {filterOpen && (
        <FilterSortPopup
          onClose={() => setFilterOpen(false)}
          initial={filterValues ?? DEFAULT_FILTER_VALUES}
          onApply={(next) => onApplyFilters?.(next)}
          hideBrandFilter={hideBrandFilter}
        />
      )}
    </div>
  );
}
