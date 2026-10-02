"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/layout/ProductCard";
import ProductCardLayoutTwo from "@/components/layout/ProductCardLayoutTwo";
import ProductsBar from "@/components/layout/ProductsBar";
import Box from "@/components/layout/Box";
import { productsApi } from "@/services/products";
import { categoriesApi } from "@/services/categories";
import { cardHref } from "@/lib/url";
import { formatRupees } from "@/lib/price";
import type { BrowseResponse, ProductCard as ProductCardType } from "@/types/product";
import type { CategoryTreeNode } from "@/types/category";
import type { HomeProduct, HomeProductSection } from "@/types/home";
import type { FilterValues } from "@/components/layout/FilterSortPopup";

const PLACEHOLDER_IMAGE = "/images/collection/Prod_image.png";
const PAGE_SIZE = 20;
const ALL_TAB = "All";
const PAGES_PER_SET = 4;

function Pagination({ totalPages, page, onPageChange }: { totalPages: number; page: number; onPageChange: (p: number) => void }) {
  const [pageSetStart, setPageSetStart] = useState(() => Math.floor((page - 1) / PAGES_PER_SET) * PAGES_PER_SET);

  const visiblePages = Array.from(
    { length: Math.min(PAGES_PER_SET, totalPages - pageSetStart) },
    (_, i) => pageSetStart + i + 1
  );
  const hasNext = pageSetStart + PAGES_PER_SET < totalPages;
  const hasPrev = pageSetStart > 0;

  const btnClass = "flex items-center justify-center rounded-full font-[var(--font-manrope)] font-medium transition-colors duration-200 text-[3.889vw] md:text-[1.823vw] lg:text-[1.111vw] size-[11.111vw] md:size-[5.208vw] lg:size-[3.333vw]";

  return (
    <div className="mt-[40px] flex items-center justify-center gap-[10px] md:mt-[60px]">
      {hasPrev && (
        <button type="button" onClick={() => setPageSetStart(pageSetStart - PAGES_PER_SET)} className={`${btnClass} border border-[#7A021D] text-[#7A021D]`}>
          ‹
        </button>
      )}
      {visiblePages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`${btnClass} ${p === page ? "bg-[#7A021D] text-white" : "border border-[#7A021D] text-[#7A021D]"}`}
        >
          {p}
        </button>
      ))}
      {hasNext && (
        <button type="button" onClick={() => setPageSetStart(pageSetStart + PAGES_PER_SET)} className={`${btnClass} border border-[#7A021D] text-[#7A021D]`}>
          ›
        </button>
      )}
    </div>
  );
}

type LayoutMode = "grid" | "two-col";

interface Props {
  initialCategoryType?: string;
  initialSubcategory?: string;
  initialSubSubcategory?: string;
  initialSort?: string;
  initialPage?: number;
}

function cardToHomeProduct(card: ProductCardType): HomeProduct {
  const subPrice = !card.rent_price_minor ? "₹0 to try" : formatRupees(card.rent_price_minor);
  return {
    id: card.card_id,
    productId: card.product_id,
    brand: card.brand?.name ?? "",
    name: card.name,
    image: card.thumbnail_url ?? PLACEHOLDER_IMAGE,
    originalPrice: `MRP ${formatRupees(card.retail_price_minor)}`,
    currentPrice: subPrice,
    href: cardHref(card.product_id, card.colour?.slug ?? null, card.custom_colour),
    isSaved: card.is_saved,
  };
}

export default function ProductLandingContent({
  initialCategoryType,
  initialSubcategory,
  initialSubSubcategory,
  initialSort,
  initialPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const categoryType = searchParams.get("category_type") ?? initialCategoryType ?? "";
  const subcategory = searchParams.get("subcategory") ?? initialSubcategory ?? "";
  const sort = searchParams.get("sort") ?? initialSort ?? "-created_at";
  const page = Number(searchParams.get("page") ?? initialPage ?? 1);

  // Multi-select filter URL params (CSV slugs).
  const brandsParam = searchParams.get("brands") ?? "";
  const sizesParam = searchParams.get("sizes") ?? "";
  const materialsParam = searchParams.get("materials") ?? "";
  const coloursParam = searchParams.get("colours") ?? "";

  const filterValues: FilterValues = useMemo(() => ({
    sort,
    brands: brandsParam ? brandsParam.split(",").filter(Boolean) : [],
    sizes: sizesParam ? sizesParam.split(",").filter(Boolean) : [],
    materials: materialsParam ? materialsParam.split(",").filter(Boolean) : [],
    colours: coloursParam ? coloursParam.split(",").filter(Boolean) : [],
  }), [sort, brandsParam, sizesParam, materialsParam, coloursParam]);

  const [tree, setTree] = useState<CategoryTreeNode[]>([]);
  const [data, setData] = useState<BrowseResponse>({ cards: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("grid");

  // Fetch the category tree once
  useEffect(() => {
    categoriesApi.tree().then((r) => setTree(r.tree)).catch(() => setTree([]));
  }, []);

  // Fetch products whenever filters/page change.
  // Backend supports a single value per filter — fan out & union when the user picks multiple.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    const baseParams = {
      category_type: categoryType || undefined,
      subcategory: subcategory || undefined,
      sub_subcategory: initialSubSubcategory || undefined,
      sort,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    };

    const multiFilters = {
      brand: filterValues.brands,
      size: filterValues.sizes,
      material: filterValues.materials,
      colour: filterValues.colours,
    };

    const activeKeys = (Object.keys(multiFilters) as Array<keyof typeof multiFilters>)
      .filter((k) => multiFilters[k].length > 0);

    // No multi-select filters → single request
    if (activeKeys.length === 0) {
      productsApi.browse(baseParams)
        .then((res) => { setData(res); setLoading(false); })
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Failed to load products");
          setLoading(false);
        });
      return;
    }

    // Multi-select: fan out, then merge & dedupe by card_id. Backend pagination still
    // applies per-request, so we fetch up to limit per combo and slice client-side.
    const combos: Array<Partial<Record<"brand" | "size" | "material" | "colour", string>>> = [{}];
    for (const key of activeKeys) {
      const next: typeof combos = [];
      for (const combo of combos) {
        for (const value of multiFilters[key]) {
          next.push({ ...combo, [key]: value });
        }
      }
      combos.length = 0;
      combos.push(...next);
    }

    Promise.all(
      combos.map((combo) =>
        productsApi.browse({
          ...baseParams,
          ...combo,
          limit: 100,
          offset: 0,
        })
      )
    ).then((responses) => {
      const seen = new Set<string>();
      const cards: ProductCardType[] = [];
      for (const r of responses) {
        for (const c of r.cards) {
          if (!seen.has(c.card_id)) {
            seen.add(c.card_id);
            cards.push(c);
          }
        }
      }
      const offset = (page - 1) * PAGE_SIZE;
      const paged = cards.slice(offset, offset + PAGE_SIZE);
      setData({ cards: paged, total: cards.length });
      setLoading(false);
    }).catch((e) => {
      setError(e instanceof Error ? e.message : "Failed to load products");
      setLoading(false);
    });
  }, [
    categoryType, subcategory, initialSubSubcategory, sort, page,
    // Stringify the arrays so we don't depend on a memo identity that flips each render.
    filterValues.brands.join(","),
    filterValues.sizes.join(","),
    filterValues.materials.join(","),
    filterValues.colours.join(","),
  ]);

  // Active level-1 node and its level-2 children
  const activeLevel1 = useMemo(
    () => (categoryType ? tree.find((n) => n.slug === categoryType) ?? null : null),
    [tree, categoryType],
  );
  const subTabs = useMemo(() => activeLevel1?.children ?? [], [activeLevel1]);
  const activeTopTab = activeLevel1?.name ?? ALL_TAB;

  function pushParams(next: Record<string, string | number | undefined | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    startTransition(() => {
      router.replace(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function handleSubTab(slug: string | null) {
    pushParams({ subcategory: slug ?? "", sub_subcategory: "", page: 1 });
  }

  function handlePageChange(p: number) {
    pushParams({ page: p });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleApplyFilters(next: FilterValues) {
    pushParams({
      sort: next.sort,
      brands: next.brands.join(",") || "",
      sizes: next.sizes.join(",") || "",
      materials: next.materials.join(",") || "",
      colours: next.colours.join(",") || "",
      page: 1,
    });
  }

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const products = data.cards.map(cardToHomeProduct);

  // Build Box section out of the first two real products (replaces the old hardcoded BOX_DATA)
  const boxData: HomeProductSection = {
    title: "Build Your Box",
    subtitle: "Curate styles to create a look or try the same style in different sizes.",
    products: products.slice(0, 2),
    viewAllHref: "/box/my-box",
    viewAllLabel: "View Box",
  };

  return (
    <div className="font-[var(--font-manrope)]">
      <div className="py-[8.333vw] md:py-[3.906vw] lg:py-[4.861vw]">
        <h1 className="text-center text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
          {activeTopTab === ALL_TAB ? "All Products" : `All ${activeTopTab}`}
        </h1>
      </div>

      <div>
        <ProductsBar
          categories={subTabs.map((n) => n.name)}
          activeCategory={subcategory ? subTabs.find((n) => n.slug === subcategory)?.name : undefined}
          onCategoryChange={(catName) => {
            if (!catName) return handleSubTab(null);
            const node = subTabs.find((n) => n.name === catName);
            handleSubTab(node?.slug ?? null);
          }}
          totalCount={data.total}
          label={activeTopTab === ALL_TAB ? "All Products" : `All ${activeTopTab}`}
          view={layout === "grid" ? "grid" : "large"}
          onViewChange={(v) => setLayout(v === "grid" ? "grid" : "two-col")}
          filterValues={filterValues}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-[1440px] px-4 text-center text-sm text-[#7A021D]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-x-[5px] gap-y-[20px] px-[10px] md:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="aspect-[176/203] w-full animate-pulse bg-neutral-100 md:aspect-[350/420]" />
          ))}
        </div>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-2 gap-x-[5px] gap-y-[20px] px-[10px] md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-[5px] gap-y-[20px] px-[10px] sm:grid-cols-2">
          {products.map((product) => (
            <ProductCardLayoutTwo key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} page={page} onPageChange={handlePageChange} />
      )}

      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />

      {boxData.products.length > 0 && <Box data={boxData} />}

      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
      <section className="flex w-full min-w-0 flex-col items-center px-5 text-center">
        <h2 className="m-0 text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
          That&apos;s everything
        </h2>
        <span className="mt-[4.167vw] block w-fit max-w-full min-w-0 self-center text-center text-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black md:hidden">
          Come back to the wardrobe for new styles
        </span>
        <span className="block w-fit max-w-full min-w-0 self-center text-center text-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black md:hidden">
          and new brand drops every week. We&apos;re
        </span>
        <span className="block w-fit max-w-full min-w-0 self-center text-center text-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black md:hidden">
          growing, thanks to you!
        </span>
        <span className="hidden w-fit max-w-full min-w-0 self-center text-center text-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black md:mt-[2.083vw] md:block md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[1.389vw]">
          Come back to the wardrobe for new styles and new brand
        </span>
        <span className="hidden w-fit max-w-full min-w-0 self-center text-center font-medium leading-[1.4] tracking-[-0.02em] text-black md:block md:text-[2.344vw] lg:text-[1.389vw]">
          drops every week. We&apos;re growing, thanks to you!
        </span>
        <div className="mt-[11.111vw] flex flex-wrap justify-center gap-[10px] md:mt-[5.208vw] lg:mt-[2.778vw]">
          <Link
            href="/collections"
            className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border border-[#7A021D] text-[3.889vw] font-medium tracking-[-0.04em] text-[#7A021D] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
          >
            Browse Collections
          </Link>
          <Link
            href="/brands"
            className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
          >
            Browse Brands
          </Link>
        </div>
      </section>
      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
    </div>
  );
}
