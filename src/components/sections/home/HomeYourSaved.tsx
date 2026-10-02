"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeCollectionBanner } from "@/types/home";

interface Props {
  data: HomeCollectionBanner;
}

const AUTO_INTERVAL = 4000;
const MANUAL_PAUSE = 2000;

export default function HomeCollectionBannerSection({ data }: Props) {
  const { slides } = data;
  // Current active slide index for title/subtitle and dot state.
  const [active, setActive] = useState(0);
  // Ref mirrors active index so interval callback always has latest value.
  const activeRef = useRef(0);
  // Used to temporarily pause autoplay after user interaction.
  const pausedUntilRef = useRef(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Pause autoplay for a short period when user interacts manually.
  const pauseAuto = useCallback((ms = MANUAL_PAUSE) => {
    pausedUntilRef.current = Date.now() + ms;
  }, []);

  // Scrolls to a target slide and updates state/ref together.
  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const next = (index + slides.length) % slides.length;
      activeRef.current = next;
      setActive(next);
      const el = scrollerRef.current;
      if (!el || el.clientWidth <= 0) return;
      el.scrollTo({ left: next * el.clientWidth, behavior });
    },
    [slides.length],
  );

  useEffect(() => {
    // Ensure initial scroll position and active state are synced on mount.
    const id = requestAnimationFrame(() => goTo(0, "auto"));
    return () => cancelAnimationFrame(id);
  }, [goTo]);

  useEffect(() => {
    // Autoplay loop advances slides unless user recently interacted.
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      const next = (activeRef.current + 1) % slides.length;
      goTo(next, next === 0 ? "auto" : "smooth");
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [goTo, slides.length]);

  useEffect(() => {
    // Sync active dot/title when the user swipes or scrolls manually.
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.clientWidth <= 0) return;
      const next = Math.min(
        Math.max(Math.round(el.scrollLeft / el.clientWidth), 0),
        slides.length - 1,
      );
      activeRef.current = next;
      setActive(next);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    // Dot navigation should pause autoplay first, then jump to selected slide.
    pauseAuto();
    goTo(index);
  };

  const slide = slides[active];

  return (
    <section className="flex w-full flex-col items-center font-[var(--font-manrope)]">

      {/* Eyebrow */}
      <p className="font-medium text-black text-[5vw] md:text-[2.2vw] lg:text-[1.667vw] text-center tracking-[-0.04em]">
        {slides[0]?.eyebrow}
      </p>

      {/* 15px gap then heading */}
      <h2 className="mt-[5.556vw] md:mt-[1.953vw] lg:mt-[1.042vw] font-normal tracking-[-0.04em] text-black text-[9.444vw] leading-none md:text-[5.859vw] md:leading-none lg:text-[5.139vw] text-center">
        {slide?.title}
      </h2>

      {/* Subtitle — below heading, above image */}
      <p className="mt-[4.167vw] md:mt-[3.906vw] lg:mt-[2.083vw] font-medium text-center leading-none tracking-[-0.02em] text-black text-[4.444vw] md:text-[2vw] lg:text-[1.389vw] lg:whitespace-nowrap mx-auto">
        {slide?.subtitle}
      </p>

      {/* 30px gap then slides */}
      <div
        ref={scrollerRef}
        onPointerDown={() => pauseAuto()}
        className="mt-[8.333vw] md:mt-[3.906vw] lg:mt-[2.083vw] relative flex w-full snap-x snap-mandatory overflow-x-auto touch-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div key={i} className="relative w-full shrink-0 snap-center">
            {/* Mobile image */}
            <div className="relative w-full aspect-[3/4] md:hidden">
              <Image
                src={s.imageMobile ?? s.image}
                alt={s.imageAlt ?? s.title}
                fill
                sizes="100vw"
                className="object-cover object-top"
                priority={i === 0}
              />
            </div>
            {/* Desktop image */}
            <div className="relative hidden w-full md:block" style={{ aspectRatio: "1440/480" }}>
              <Image
                src={s.image}
                alt={s.imageAlt ?? s.title}
                fill
                sizes="100vw"
                className="object-cover object-top"
                priority={i === 0}
              />
            </div>
            {/* CTA — outline only, no fill. Mobile: 180×80 bottom-80, Desktop: 200×80 bottom-60 */}
            <div className="absolute bottom-[11.111vw] md:bottom-[7.111vw] lg:bottom-[4.167vw] left-1/2 -translate-x-1/2 z-10">
              <Link
                href={s.ctaHref ?? "/collections"}
                className="flex h-[16.667vw] w-[50vw] items-center justify-center rounded-full border border-white bg-transparent text-[3.889vw] font-medium tracking-[-0.04em] leading-[1.1] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]"
              >
                {s.ctaLabel ?? "View Collection"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* State indicator bars */}
      <div className="mt-[8.333vw] md:mt-[3.906vw] lg:mt-[2.083vw] flex items-center gap-[10px]">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => handleDotClick(i)}
            className={`h-[5px] w-[70px] cursor-pointer transition-colors duration-300 ${
              i === active ? "bg-[#7A021D]" : "bg-black/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
