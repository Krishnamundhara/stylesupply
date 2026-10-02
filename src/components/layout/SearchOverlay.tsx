"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productsApi } from "@/services/products";
import { cardHref } from "@/lib/url";
import { formatRupees } from "@/lib/price";
import type { ProductCard } from "@/types/product";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const ICON_SEARCH = "/icon/vuesax/linear/search-normal.svg";
const ICON_CROSS = "/icon/vuesax/linear/cross.svg";
const PLACEHOLDER_IMAGE = "/images/collection/Prod_image.png";
const RECENTS_KEY = "ss:recent-searches";
const RECENTS_MAX = 5;
const DEBOUNCE_MS = 250;
const RESULTS_LIMIT = 3;

function loadRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function saveRecents(items: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota */
  }
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<ProductCard[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentSearches(loadRecents());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounced live search
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearching(false);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearching(true);
    const handle = setTimeout(() => {
      productsApi
        .browse({ q: trimmed, limit: RESULTS_LIMIT })
        .then((res) => {
          setResults(res.cards.slice(0, RESULTS_LIMIT));
          setSearching(false);
        })
        .catch(() => {
          setResults([]);
          setSearching(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query, open]);

  if (!open) return null;

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((t) => t !== term);
      saveRecents(next);
      return next;
    });
  };

  const commitRecent = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, RECENTS_MAX);
      saveRecents(next);
      return next;
    });
  };

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    commitRecent(trimmed);
    onClose();
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const onResultClick = (card: ProductCard) => {
    commitRecent(query.trim());
    onClose();
  };

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length >= 2;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[200] bg-white overflow-y-auto"
      style={{ top: "var(--header-h)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Close button — mobile: left-[7px], desktop: left-[28px] */}
      <div className="absolute left-[20px] top-[52px] lg:left-[28px] lg:top-[108px]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-[10px]"
          aria-label="Close search"
        >
          <Image src={ICON_CROSS} alt="" width={24} height={24} className="object-contain w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]" />
          <span className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.083vw] lg:text-[16px] font-medium leading-[1.1] tracking-[-0.04em] text-black">
            Close
          </span>
        </button>
      </div>

      {/* Search input row */}
      <div className="absolute top-[115px] left-[20px] right-[20px] lg:top-[100px] lg:left-[25%] lg:right-[28px] flex items-end gap-[16px] lg:items-center lg:gap-[20px]">
        <Image src={ICON_SEARCH} alt="" width={20} height={20} className="shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
          placeholder="Search..."
          className="flex-1 bg-transparent font-[var(--font-manrope)] text-[3.889vw] md:text-[2.083vw] lg:text-[20px] font-medium leading-[1.1] lg:leading-normal tracking-[-0.04em] text-black placeholder:text-black outline-none"
        />
      </div>

      {/* Divider */}
      <div className="absolute top-[165px] left-[20px] right-[20px] lg:top-[150px] lg:left-[25%] lg:right-[28px] h-px bg-black/10" />

      {/* Body — recent searches OR live results */}
      <div className="absolute top-[200px] left-[22px] right-[20px] lg:top-[178px] lg:left-[25%] lg:right-[28px] flex flex-col gap-[24px] pb-[40px]">
        {showResults ? (
          <div className="flex flex-col gap-[20px]">
            <p className="font-[var(--font-manrope)] text-[12px] lg:text-[14px] font-semibold uppercase tracking-[0.08em] text-black/60">
              {searching ? "Searching…" : results.length > 0 ? "Top Results" : "No matches"}
            </p>

            {results.map((card) => {
              const subPrice = !card.rent_price_minor ? "₹0 to try" : formatRupees(card.rent_price_minor);
              const href = cardHref(card.product_id, card.colour?.slug ?? null, card.custom_colour);
              return (
                <Link
                  key={card.card_id}
                  href={href}
                  onClick={() => onResultClick(card)}
                  className="flex items-center gap-[16px] lg:gap-[20px]"
                >
                  <div className="relative shrink-0 size-[64px] lg:size-[80px] overflow-hidden bg-[#f7f4ef]">
                    <Image
                      src={card.thumbnail_url ?? PLACEHOLDER_IMAGE}
                      alt={card.name}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-[var(--font-manrope)] text-[12px] lg:text-[14px] font-medium uppercase tracking-[-0.02em] text-[#4E4E4E] truncate">
                      {card.brand?.name ?? ""}
                    </p>
                    <p className="font-[var(--font-manrope)] text-[15px] lg:text-[18px] font-semibold leading-[1.15] tracking-[-0.04em] text-black truncate">
                      {card.name}
                    </p>
                    <p className="mt-[2px] font-[var(--font-manrope)] text-[13px] lg:text-[15px] font-medium tracking-[-0.02em] text-[#4E4E4E]">
                      MRP {formatRupees(card.retail_price_minor)} · {subPrice}
                    </p>
                  </div>
                </Link>
              );
            })}

            {!searching && results.length > 0 && (
              <button
                type="button"
                onClick={submitSearch}
                className="self-start font-[var(--font-manrope)] text-[14px] lg:text-[16px] font-medium tracking-[-0.02em] text-[#7A021D] underline underline-offset-2"
              >
                See all results for &ldquo;{trimmedQuery}&rdquo;
              </button>
            )}
          </div>
        ) : (
          recentSearches.length > 0 && (
            <div className="flex flex-col gap-[20px]">
              {recentSearches.map((term) => (
                <div key={term} className="flex items-start gap-[24px]">
                  <button
                    type="button"
                    onClick={() => removeRecent(term)}
                    className="font-[var(--font-manrope)] text-[16px] lg:text-[20px] font-medium leading-normal tracking-[-0.02em] text-black w-[11px] shrink-0 text-center"
                    aria-label={`Remove ${term}`}
                  >
                    x
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery(term)}
                    className="font-[var(--font-manrope)] text-[16px] lg:text-[20px] font-medium leading-normal tracking-[-0.04em] text-black text-left whitespace-nowrap"
                  >
                    {term}
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
