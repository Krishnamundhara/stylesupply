"use client";

import { useState, useEffect } from "react";
import { brandsApi } from "@/services/brands";
import { taxonomyApi } from "@/services/categories";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L17 17M17 1L1 17" stroke="#7A021D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div className="shrink-0 size-[28px] rounded-full border-2 border-[#7A021D] bg-white flex items-center justify-center mr-[4px]">
      {selected && <div className="size-[14px] rounded-full bg-[#7A021D]" />}
    </div>
  );
}

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Suggested", value: "random" },
  { label: "Newest", value: "-created_at" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free"];

export interface FilterValues {
  sort: string;
  brands: string[];
  sizes: string[];
  materials: string[];
  colours: string[];
}

interface OptionItem {
  slug: string;
  name: string;
}

interface Props {
  onClose: () => void;
  initial: FilterValues;
  onApply: (next: FilterValues) => void;
  /** Hide the brand filter (e.g. on individual brand pages where the brand is implicit). */
  hideBrandFilter?: boolean;
}

export default function FilterSortPopup({ onClose, initial, onApply, hideBrandFilter = false }: Props) {
  const [closing, setClosing] = useState(false);
  const [selectedSortLabel, setSelectedSortLabel] = useState<string>(
    SORT_OPTIONS.find((o) => o.value === initial.sort)?.label ?? "Suggested"
  );
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initial.brands);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initial.sizes);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initial.materials);
  const [selectedColours, setSelectedColours] = useState<string[]>(initial.colours);

  const [brands, setBrands] = useState<OptionItem[]>([]);
  const [materials, setMaterials] = useState<OptionItem[]>([]);
  const [colours, setColours] = useState<OptionItem[]>([]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  useEffect(() => {
    Promise.all([
      hideBrandFilter ? Promise.resolve({ brands: [] as OptionItem[] }) : brandsApi.getAll(),
      taxonomyApi.materials(),
      taxonomyApi.colours(),
    ]).then(([b, m, c]) => {
      setBrands(b.brands.map((br) => ({ slug: br.slug, name: br.name })));
      setMaterials(m.items.map((it) => ({ slug: it.slug, name: it.name })));
      setColours(c.items.map((it) => ({ slug: it.slug, name: it.name })));
    }).catch(() => {});
  }, [hideBrandFilter]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    const sortValue = SORT_OPTIONS.find((o) => o.label === selectedSortLabel)?.value ?? "-created_at";
    onApply({
      sort: sortValue,
      brands: selectedBrands,
      sizes: selectedSizes,
      materials: selectedMaterials,
      colours: selectedColours,
    });
    handleClose();
  };

  const animation = closing ? "slideOutRight" : "slideInRight";

  function renderOptionList(
    items: OptionItem[],
    selected: string[],
    onToggle: (slug: string) => void,
  ) {
    if (items.length === 0) {
      return (
        <p className="font-[var(--font-manrope)] font-medium text-black text-[14px] opacity-50">
          Loading…
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-[20px]">
        {items.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => onToggle(item.slug)}
            className="flex items-center justify-between w-full"
          >
            <span className="font-[var(--font-manrope)] font-medium text-black text-[16px] leading-[1.2]">
              {item.name}
            </span>
            <RadioCircle selected={selected.includes(item.slug)} />
          </button>
        ))}
      </div>
    );
  }

  function renderSizeList() {
    return (
      <div className="flex flex-col gap-[20px]">
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggle(setSelectedSizes, size)}
            className="flex items-center justify-between w-full"
          >
            <span className="font-[var(--font-manrope)] font-medium text-black text-[16px] leading-[1.2]">
              {size}
            </span>
            <RadioCircle selected={selectedSizes.includes(size)} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex" data-lenis-prevent>
      {/* backdrop */}
      <div className="absolute inset-0 bg-white/60" onClick={handleClose} />

      {/* panel — mobile full width, desktop 537px */}
      <div
        data-lenis-prevent
        className="relative z-10 ml-auto flex h-full w-full md:w-[537px] flex-col bg-[#F7F4EF] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingTop: "112px",
          animation: `${animation} 0.35s cubic-bezier(0.4,0,0.2,1) both`,
          overscrollBehavior: "contain",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-[24px] md:right-[40px] text-[#7A021D] z-10 size-[28px] flex items-center justify-center"
          style={{ top: "calc(112px + 20px)" }}
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-stretch px-[24px] md:px-[40px] pt-[60px] pb-[40px] gap-[36px]">

          {/* ── Sort By ── */}
          <div className="flex flex-col gap-[8.333vw] md:gap-[3.906vw] lg:gap-[2.083vw]">
            <p className="font-[var(--font-manrope)] font-medium text-black text-[28px] tracking-[-0.56px] leading-[1.2]">
              Sort By
            </p>
            <div className="flex flex-col gap-[5.556vw] md:gap-[2.604vw] lg:gap-[1.389vw]">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedSortLabel(opt.label)}
                  className="flex items-center justify-between w-full"
                >
                  <span className="font-[var(--font-manrope)] font-semibold text-black text-[18px] tracking-[-0.72px] leading-[1.2]">
                    {opt.label}
                  </span>
                  <RadioCircle selected={selectedSortLabel === opt.label} />
                </button>
              ))}
            </div>
          </div>

          {/* divider */}
          <div className="h-px w-full bg-black/10" />

          {/* ── Filters ── */}
          <div className="flex flex-col gap-[8.333vw] md:gap-[3.906vw] lg:gap-[2.083vw]">
            <p className="font-[var(--font-manrope)] font-medium text-black text-[28px] tracking-[-1.12px] leading-[1.2]">
              Filters
            </p>
            <div className="flex flex-col gap-[5.556vw] md:gap-[2.604vw] lg:gap-[1.389vw]">

            {/* Size */}
            {(() => {
              const isOpen = expandedFilter === "Size";
              return (
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setExpandedFilter(isOpen ? null : "Size")}
                    className="flex items-center justify-between w-full py-[4px]"
                  >
                    <span className={`font-[var(--font-manrope)] font-semibold text-[18px] tracking-[-0.72px] transition-colors duration-300 ${isOpen ? "text-[#7A021D]" : "text-black"}`}>
                      Size
                    </span>
                    <span className={`size-[28px] flex items-center justify-center font-[var(--font-manrope)] font-normal text-[26px] tracking-[-0.8px] transition-transform duration-300 shrink-0 mr-[4px] ${isOpen ? "text-[#7A021D]" : "text-black"}`} style={{ display: "inline-flex", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                      +
                    </span>
                  </button>
                  <div className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "grid-rows-[1fr] opacity-100 mt-[12px]" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                    <div className="min-h-0">{renderSizeList()}</div>
                  </div>
                  <div className="mt-[16px] h-px w-full bg-black/10" />
                </div>
              );
            })()}

            {/* Material */}
            {(() => {
              const isOpen = expandedFilter === "Material";
              return (
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setExpandedFilter(isOpen ? null : "Material")}
                    className="flex items-center justify-between w-full py-[4px]"
                  >
                    <span className={`font-[var(--font-manrope)] font-semibold text-[18px] tracking-[-0.72px] transition-colors duration-300 ${isOpen ? "text-[#7A021D]" : "text-black"}`}>
                      Material
                    </span>
                    <span className={`size-[28px] flex items-center justify-center font-[var(--font-manrope)] font-normal text-[26px] tracking-[-0.8px] transition-transform duration-300 shrink-0 mr-[4px] ${isOpen ? "text-[#7A021D]" : "text-black"}`} style={{ display: "inline-flex", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                      +
                    </span>
                  </button>
                  <div className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "grid-rows-[1fr] opacity-100 mt-[12px]" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                    <div className="min-h-0">{renderOptionList(materials, selectedMaterials, (s) => toggle(setSelectedMaterials, s))}</div>
                  </div>
                  <div className="mt-[16px] h-px w-full bg-black/10" />
                </div>
              );
            })()}

            {/* Color */}
            {(() => {
              const isOpen = expandedFilter === "Color";
              return (
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setExpandedFilter(isOpen ? null : "Color")}
                    className="flex items-center justify-between w-full py-[4px]"
                  >
                    <span className={`font-[var(--font-manrope)] font-semibold text-[18px] tracking-[-0.72px] transition-colors duration-300 ${isOpen ? "text-[#7A021D]" : "text-black"}`}>
                      Color
                    </span>
                    <span className={`size-[28px] flex items-center justify-center font-[var(--font-manrope)] font-normal text-[26px] tracking-[-0.8px] transition-transform duration-300 shrink-0 mr-[4px] ${isOpen ? "text-[#7A021D]" : "text-black"}`} style={{ display: "inline-flex", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                      +
                    </span>
                  </button>
                  <div className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "grid-rows-[1fr] opacity-100 mt-[12px]" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                    <div className="min-h-0">{renderOptionList(colours, selectedColours, (s) => toggle(setSelectedColours, s))}</div>
                  </div>
                  <div className="mt-[16px] h-px w-full bg-black/10" />
                </div>
              );
            })()}

            {/* Brands */}
            {!hideBrandFilter && (
              <div className="flex flex-col gap-[20px]">
                <button
                  type="button"
                  onClick={() => setBrandsExpanded((p) => !p)}
                  className="flex items-center justify-between w-full"
                >
                  <span className={`font-[var(--font-manrope)] font-semibold text-[18px] tracking-[-0.72px] transition-colors duration-300 ${brandsExpanded ? "text-[#7A021D]" : "text-black"}`}>
                    Brands
                  </span>
                  <span className={`size-[28px] flex items-center justify-center font-[var(--font-manrope)] font-medium text-[20px] tracking-[-0.8px] transition-transform duration-300 shrink-0 mr-[4px] ${brandsExpanded ? "text-[#7A021D]" : "text-black"}`} style={{ display: "inline-flex", transform: brandsExpanded ? "rotate(45deg)" : "rotate(0deg)" }}>
                    +
                  </span>
                </button>

                <div className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${brandsExpanded ? "grid-rows-[1fr] opacity-100 mt-[4px]" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                  <div className="min-h-0">
                    {renderOptionList(brands, selectedBrands, (s) => toggle(setSelectedBrands, s))}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Apply button */}
          <button
            type="button"
            onClick={handleApply}
            className="w-[55.556vw] h-[16.667vw] md:w-[16.667vw] md:h-[5.556vw] rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-medium text-white text-[3.889vw] md:text-[1.389vw] tracking-[-0.04em] mt-[8px] self-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
