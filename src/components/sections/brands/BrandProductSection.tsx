"use client";

import { useEffect, useMemo, useState } from "react";
import ProductsBar from "@/components/layout/ProductsBar";
import BrandProductGrid from "./BrandProductGrid";
import { productsApi } from "@/services/products";
import { cardHref } from "@/lib/url";
import { formatRupees } from "@/lib/price";
import type { HomeProduct } from "@/types/home";
import type { ProductCard } from "@/types/product";
import type { FilterValues } from "@/components/layout/FilterSortPopup";

const PLACEHOLDER_IMAGE = "/images/individual_Brandlanding/image 814.png";
const PAGE_SIZE = 20;
const PAGE_SIZE_LARGE = 6;

type BrandProductSectionProps = {
  products: HomeProduct[];
  totalCount?: number;
  brandSlug?: string;
  brandName?: string;
};

const DEFAULT_FILTERS: FilterValues = {
  sort: "-created_at",
  brands: [],
  sizes: [],
  materials: [],
  colours: [],
};

function cardToHomeProduct(card: ProductCard, fallbackBrandName?: string): HomeProduct {
  const subPrice = !card.rent_price_minor ? "₹0 to try" : formatRupees(card.rent_price_minor);
  return {
    id: card.card_id,
    productId: card.product_id,
    brand: card.brand?.name ?? fallbackBrandName ?? "",
    name: card.name,
    image: card.thumbnail_url ?? PLACEHOLDER_IMAGE,
    originalPrice: formatRupees(card.retail_price_minor),
    currentPrice: subPrice,
    href: cardHref(card.product_id, card.colour?.slug ?? null, card.custom_colour),
    badge: card.brand?.name ?? fallbackBrandName,
    isSaved: card.is_saved,
  };
}

export default function BrandProductSection({
  products: initialProducts,
  totalCount,
  brandSlug,
  brandName,
}: BrandProductSectionProps) {
  const [view, setView] = useState<"grid" | "large">("grid");
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<HomeProduct[]>(initialProducts);
  const [total, setTotal] = useState<number>(totalCount ?? initialProducts.length);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = view === "large" ? PAGE_SIZE_LARGE : PAGE_SIZE;
  const totalPages = Math.ceil(total / pageSize);

  const isFiltered = useMemo(() => {
    return (
      filters.sort !== DEFAULT_FILTERS.sort ||
      filters.sizes.length > 0 ||
      filters.materials.length > 0 ||
      filters.colours.length > 0
    );
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [filters, view]);

  useEffect(() => {
    if (!brandSlug) return;

    if (!isFiltered && page === 1) {
      setProducts(initialProducts);
      setTotal(totalCount ?? initialProducts.length);
      return;
    }

    setLoading(true);
    const offset = (page - 1) * pageSize;

    if (isFiltered) {
      const multi = {
        size: filters.sizes,
        material: filters.materials,
        colour: filters.colours,
      };
      const activeKeys = (Object.keys(multi) as Array<keyof typeof multi>).filter((k) => multi[k].length > 0);
      let combos: Array<Partial<Record<"size" | "material" | "colour", string>>> = [{}];
      for (const key of activeKeys) {
        const next: typeof combos = [];
        for (const combo of combos) {
          for (const value of multi[key]) next.push({ ...combo, [key]: value });
        }
        combos = next;
      }

      Promise.all(
        combos.map((combo) =>
          productsApi.browse({ brand: brandSlug, ...combo, sort: filters.sort, limit: 100, offset: 0 })
        )
      ).then((responses) => {
        const seen = new Set<string>();
        const cards: ProductCard[] = [];
        for (const r of responses) {
          for (const c of r.cards) {
            if (!seen.has(c.card_id)) { seen.add(c.card_id); cards.push(c); }
          }
        }
        setProducts(cards.map((c) => cardToHomeProduct(c, brandName)));
        setTotal(cards.length);
        setLoading(false);
      }).catch(() => { setProducts(initialProducts); setLoading(false); });
    } else {
      productsApi.browse({ brand: brandSlug, sort: filters.sort, limit: pageSize, offset })
        .then((r) => {
          setProducts(r.cards.map((c) => cardToHomeProduct(c, brandName)));
          setTotal(r.total ?? r.cards.length);
          setLoading(false);
        })
        .catch(() => { setProducts(initialProducts); setLoading(false); });
    }
  }, [
    brandSlug, brandName, isFiltered, initialProducts, totalCount, page, pageSize,
    filters.sort,
    filters.sizes.join(","),
    filters.materials.join(","),
    filters.colours.join(","),
  ]);

  const displayedProducts = isFiltered
    ? products.slice((page - 1) * pageSize, page * pageSize)
    : products;

  return (
    <>
      <ProductsBar
        totalCount={total}
        view={view}
        onViewChange={setView}
        suppressBarHover
        filterValues={filters}
        onApplyFilters={setFilters}
        hideBrandFilter
      />
      <div className="px-[10px]">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-[5px] gap-y-[20px] md:gap-y-[30px] lg:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="aspect-[176/203] w-full animate-pulse bg-neutral-100 md:aspect-[350/420]" />
            ))}
          </div>
        ) : (
          <BrandProductGrid
            products={displayedProducts}
            view={view}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}
