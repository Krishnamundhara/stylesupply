"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback, TouchEvent } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface FashionCardProps {
  number: string;
  title: string;
  description: string;
  image: string;
  mobile?: boolean;
}

const DEFAULT_FEATURES: FashionCardProps[] = [
  {
    number: "01",
    title: "Wear More, Own Less",
    description: "Access a constantly evolving wardrobe without filling your closet.",
    image: "/image/image 6850.png",
  },
  {
    number: "02",
    title: "Designer Fashion, Smarter",
    description: "A rotating designer wardrobe, no extra closet space.",
    image: "/image/image 6863.png",
  },
  {
    number: "03",
    title: "Change Whenever You Want",
    description: "Swap pieces as your plans, mood, or seasons change.",
    image: "/image/image 6862.png",
  },
  {
    number: "04",
    title: "Style Without the Waste",
    description: "A circular approach to fashion that keeps great pieces in motion.",
    image: "/image/image 6851.png",
  },
];

/* ─── Single Card ─────────────────────────────────────────────────────────── */
function FashionCard({ number, title, description, image, mobile = false }: FashionCardProps) {
  return (
    <div
      className={`relative w-full flex-shrink-0 overflow-hidden group ${mobile ? "aspect-[304/421] rounded-[5.556vw] md:rounded-[2.604vw] lg:rounded-[1.389vw]" : "aspect-[325/448] rounded-[5.556vw] md:rounded-[2.604vw] lg:rounded-[1.389vw]"
        }`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />

      {mobile ? (
        <>
          {/* Card title on image (mobile) */}
          <div className="absolute top-[5.556vw] left-[5vw] right-[5vw]">
            <h3 className="text-white text-[10vw] font-medium font-[var(--font-manrope)] leading-[1.28] tracking-[-0.04em] max-w-[92%]">
              {title}
            </h3>
          </div>

          {/* Info strip — bottom (mobile) */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#2C0505] px-[4.444vw] py-[3.889vw] min-h-[24%] flex items-center">
            <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-[3.333vw]">
              <div className="w-[17.222vw] h-[17.222vw] bg-[#E7E2DE] rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#2C0505] text-[9.444vw] leading-none font-medium font-[var(--font-manrope)] tracking-[-0.03em]">
                  {number}
                </span>
              </div>
              <p className="text-white text-[4.2vw] font-medium font-[var(--font-manrope)] leading-[1.08] tracking-[-0.02em] text-left max-w-[26ch]">
                {description}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Card title on image */}
          <div className="absolute top-[1.8vw] left-[1.4vw] right-[1.4vw]">
            <h3 className="text-white text-[2.222vw] font-semibold font-[var(--font-manrope)] leading-[1.4] tracking-[-0.02em] max-w-[92%]">
              {title}
            </h3>
          </div>

          {/* Info strip — bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#2C0505] px-[1.3vw] py-[1.1vw] min-h-[24.5%] flex items-center">
            <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-[0.95vw]">
              <div className="w-[4vw] h-[4vw] bg-[#E7E2DE] rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#2C0505] text-[1.7vw] leading-none font-medium font-[var(--font-manrope)] tracking-[-0.03em]">
                  {number}
                </span>
              </div>
              <p className="text-white text-[1.08vw] font-medium font-[var(--font-manrope)] leading-[1.04] tracking-[-0.02em] text-left max-w-[28ch]">
                {description}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Mobile Carousel ─────────────────────────────────────────────────────── */
/**
 * MobileCarousel
 * – Infinite looping: clones first+last items at both ends
 * – Swipe-to-navigate via touch events
 * – Dot indicators that reflect the "real" active index
 */
function MobileCarousel({ items }: { items: FashionCardProps[] }) {
  const total = items.length;
  // Build a cloned list: [last, ...items, first]  so we can loop seamlessly
  const cloned = [items[total - 1], ...items, items[0]];
  const gapPx = 22;

  const [current, setCurrent] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [slideWidth, setSlideWidth] = useState(320);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (!viewportRef.current) return;
      const width = viewportRef.current.clientWidth;
      setSlideWidth(Math.min(520, Math.max(320, width * 0.9)));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  /* ── helpers ── */
  const goTo = useCallback(
    (idx: number, animated = true) => {
      setIsTransitioning(animated);
      setCurrent(idx);
    },
    []
  );

  /* Real index (0-based) for dots */
  const realIndex = ((current - 1) % total + total) % total;

  /* Handle clone boundary  */
  useEffect(() => {
    if (!isTransitioning) return;
    if (current === 0) {
      const timer = setTimeout(() => {
        goTo(total, false);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (current === cloned.length - 1) {
      const timer = setTimeout(() => {
        goTo(1, false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [current, isTransitioning, total, cloned.length, goTo]);

  /* Re-enable transition  */
  useEffect(() => {
    if (!isTransitioning) {
      const t = setTimeout(() => setIsTransitioning(true), 20);
      return () => clearTimeout(t);
    }
  }, [isTransitioning]);

  /* Dot click */
  const handleDotClick = (i: number) => {
    goTo(i + 1);
  };

  /* Touch handlers */
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      goTo(dx > 0 ? current + 1 : current - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div ref={viewportRef} className="relative w-full max-w-[1355px] mx-auto overflow-hidden">
      {/* Track */}
      <div
        className="flex"
        style={{
          transform: `translateX(-${current * (slideWidth + gapPx)}px)`,
          transition: isTransitioning ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)" : "none",
          willChange: "transform",
          gap: `${gapPx}px`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {cloned.map((item, i) => (
          <div key={i} className="flex flex-shrink-0 justify-center" style={{ width: `${slideWidth}px` }}>
            <FashionCard {...item} mobile />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-[3.889vw]">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => handleDotClick(i)}
            className={`transition-all duration-300 ${i === realIndex
                ? "w-[8.889vw] h-[1.111vw] bg-[#2c0505]"
                : "w-[8.889vw] h-[1.111vw] bg-[#2c0505]/20"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ────────────────────────────────────────────────────────── */
export default function ExperienceFashion() {
  return (
    <section className="px-[2.778vw] md:px-[1.563vw] lg:px-[2.917vw] bg-white overflow-hidden">
      {/* Header */}
      <div className="text-center mb-[5.556vw] md:mb-[2.604vw] lg:mb-[3.472vw]">
        <h2 className="font-[var(--font-manrope)] text-[#000000] font-medium tracking-[-0.04em] text-[6.667vw] md:text-[3.906vw] lg:text-[3.125vw] leading-[1.25] lg:leading-[1.2] lg:tracking-[-0.03em]">
          <span className="md:hidden block">A new way to<br />experience fashion</span>
          <span className="hidden md:block lg:hidden">A new way to experience fashion</span>
          <span className="hidden lg:block whitespace-nowrap">A new way to</span>
          <span className="hidden lg:block whitespace-nowrap">experience fashion</span>
        </h2>
      </div>

      {/* ── Mobile: looping swipe carousel ── */}
      <div className="block md:hidden -mx-2">
        <MobileCarousel items={DEFAULT_FEATURES} />
      </div>

      {/* ── Tablet / Desktop: 2-col → 4-col grid ── */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-[1.302vw] lg:gap-[0.972vw] max-w-[1360px] mx-auto">
        {DEFAULT_FEATURES.map((item, index) => (
          <FashionCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}