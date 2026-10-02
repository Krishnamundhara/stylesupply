"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/layout/ProductCard";
import type { HomeProductSection } from "@/types/home";

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
      className="relative h-[4px] w-full bg-black/20"
    >
      <div
        className="absolute h-full bg-[#7A021D]"
        style={{ left: thumb.left, width: thumb.width }}
      />
    </div>
  );
}

interface HomeDiveRightInProps {
  data: HomeProductSection;
}

export default function HomeDiveRightIn({ data }: HomeDiveRightInProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefDesktop = useRef<HTMLDivElement>(null);

  return (
    <section className="flex flex-col items-center font-[var(--font-manrope)]">
      <h2 className="text-center font-normal tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] md:leading-[1.05] lg:text-[5.139vw]">
        {data.title}
      </h2>

      {/* Mobile: 2×2 grid pages scrolling horizontally */}
      <div
        ref={scrollRef}
        className="mt-[30px] md:hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <div className="flex gap-[5px] pl-[10px] pr-[10px]">
          {Array.from({ length: Math.ceil(data.products.length / 2) }, (_, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-[20px] shrink-0 w-[47vw]">
              {data.products.slice(colIdx * 2, colIdx * 2 + 2).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden" style={{ width: "50vw", marginTop: "5.556vw" }}>
        <HorizontalScrollbar scrollRef={scrollRef} />
      </div>

      {/* Desktop: single row scrolling */}
      <div
        ref={scrollRefDesktop}
        className="mt-[60px] hidden md:block overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <div className="flex gap-[5px] pl-[10px] pr-[10px]">
          {data.products.map((product) => (
            <div key={product.id} className="w-[calc(25%-4px)] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:block" style={{ width: "50vw", marginTop: "2.083vw" }}>
        <HorizontalScrollbar scrollRef={scrollRefDesktop} />
      </div>

      {data.viewAllHref && data.viewAllLabel && (
        <Link
          href={data.viewAllHref}
          className="mt-[8.333vw] md:mt-[3.906vw] lg:mt-[2.083vw] flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium leading-[1.1] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          {data.viewAllLabel}
        </Link>
      )}
    </section>
  );
}
