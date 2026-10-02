"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CollectionProduct } from "./CollectionShowcase";
import ProductCard from "@/components/layout/ProductCard";
import type { HomeProduct } from "@/types/home";

function HorizontalScrollbar({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  const [canScroll, setCanScroll] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth) { setCanScroll(false); return; }
    setCanScroll(true);
    const trackW = trackRef.current?.clientWidth ?? clientWidth;
    const ratio = clientWidth / scrollWidth;
    const thumbW = Math.max(ratio * trackW, 12);
    const maxLeft = trackW - thumbW;
    const left = (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;
    setThumb({ left, width: thumbW });
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(update, 0);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { clearTimeout(t); el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [scrollRef, update]);

  if (!canScroll) return null;

  return (
    <div
      ref={trackRef}
      className="relative h-[4px] w-full bg-black/20 mt-[20px]"
    >
      <div
        className="absolute h-full bg-[#7A021D]"
        style={{ left: thumb.left, width: thumb.width }}
      />
    </div>
  );
}

interface CollectionProductScrollProps {
  products: CollectionProduct[];
  href: string;
}

function toHomeProduct(p: CollectionProduct): HomeProduct {
  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    image: p.image,
    originalPrice: p.retailPrice,
    currentPrice: p.rentPrice,
    href: `/products/${p.id}`,
  };
}

export default function CollectionProductScroll({ products }: CollectionProductScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <div className="flex gap-[5px] pl-[10px] pr-[10px]">
          {products.map((product) => (
            <div key={product.id} className="w-[170px] shrink-0">
              <ProductCard product={toHomeProduct(product)} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", paddingLeft: "10px", paddingRight: "10px" }} className="box-border">
        <HorizontalScrollbar scrollRef={scrollRef} />
      </div>
    </div>
  );
}
