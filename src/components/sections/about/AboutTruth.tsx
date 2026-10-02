"use client";

import Image from "next/image";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface TruthSlide {
  title: string;
  image: string;
  body: string;
  /** Optional: explicit line breaks on mobile (uses pre-line). Falls back to flattened `body` when omitted. */
  bodyMobile?: string;
}

const SLIDES: TruthSlide[] = [
  {
    title: "The Truth",
    image: "/images/about/card-1.png",
    body: `Spending ₹10,000+ on something\nyou haven't tried isn't premium`,
    bodyMobile: `Spending ₹10,000+ on something
 you haven't tried isn't premium`,
  },
  {
    title: "The Shift",
    image: "/images/about/card-2.png",
    body: `You should be able to see, feel, and try before you decide.\nSo we brought the store to you.`,
  },
  {
    title: "Core Idea",
    image: "/images/about/card-3.png",
    body: `A private boutique at your door in 24 hours. Try it at home.\nKeep what you love. We'll collect the rest.`,
  },
];

const AUTO_SCROLL_INTERVAL_MS = 4000;
/** Cooldown after manual navigation (dot click, etc.) before auto-advance resumes. */
const MANUAL_INTERACTION_COOLDOWN_MS = 2000;

export default function AboutTruth() {
  const slideLoop = useMemo(() => SLIDES.map((_, i) => i), []);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  const autoPausedUntilRef = useRef(0);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const desktopScrollerRef = useRef<HTMLDivElement>(null);

  const pauseAutoAdvance = useCallback((durationMs = MANUAL_INTERACTION_COOLDOWN_MS) => {
    autoPausedUntilRef.current = Date.now() + durationMs;
  }, []);

  const scrollToSlide = useCallback(
    (ref: RefObject<HTMLDivElement | null>, index: number, behavior: ScrollBehavior = "smooth") => {
      const el = ref.current;
      if (!el || el.clientWidth <= 0) return;
      el.scrollTo({ left: index * el.clientWidth, behavior });
    },
    [],
  );

  const goToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth", userInitiated = false) => {
      if (userInitiated) {
        pauseAutoAdvance(MANUAL_INTERACTION_COOLDOWN_MS);
      }
      const next = (index + SLIDES.length) % SLIDES.length;
      activeSlideRef.current = next;
      setActiveSlide(next);
      scrollToSlide(mobileScrollerRef, next, behavior);
      scrollToSlide(desktopScrollerRef, next, behavior);
    },
    [scrollToSlide, pauseAutoAdvance],
  );

  useEffect(() => {
    const id = window.requestAnimationFrame(() => goToSlide(0, "auto"));
    return () => window.cancelAnimationFrame(id);
  }, [goToSlide]);

  useEffect(() => {
    if (slideLoop.length <= 1) return;
    const id = window.setInterval(() => {
      if (Date.now() < autoPausedUntilRef.current) return;
      if (window.innerWidth < 768) return;
      const cur = slideLoop.indexOf(activeSlideRef.current);
      const safe = cur >= 0 ? cur : 0;
      const nextIdx = (safe + 1) % slideLoop.length;
      const next = slideLoop[nextIdx] ?? 0;
      goToSlide(next, nextIdx === 0 ? "auto" : "smooth");
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [goToSlide, slideLoop]);

  useEffect(() => {
    const scrollers = [mobileScrollerRef.current, desktopScrollerRef.current].filter(
      Boolean,
    ) as HTMLDivElement[];

    const cleanups = scrollers.map((el) => {
      const onScroll = () => {
        if (el.clientWidth <= 0) return;
        const next = Math.round(el.scrollLeft / el.clientWidth);
        const bounded = Math.min(Math.max(next, 0), SLIDES.length - 1);
        activeSlideRef.current = bounded;
        setActiveSlide(bounded);
      };
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="w-full bg-[#F7F4EF] font-[var(--font-manrope)] text-black">
      {/* ── MOBILE ── */}
      <div className="md:hidden flex w-full justify-center">
        <div className="flex w-full flex-col items-center">
          <div
            ref={mobileScrollerRef}
            onPointerDown={() => pauseAutoAdvance()}
            className="flex w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SLIDES.map((slide, i) => (
              <article
                key={slide.title}
                className="flex w-full shrink-0 snap-center flex-col items-center px-[5vw] pt-[60px]"
              >
                <h2
                  className="w-full text-center font-normal leading-[1.1] tracking-[-0.04em] text-[9.444vw] text-black"
                >
                  {slide.title}
                </h2>

                <div className="relative mt-[40px] w-[83.333vw] aspect-square shrink-0 overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="83.333vw"
                    priority={i === 0}
                  />
                </div>

                <p
                  className="mt-[40px] w-full text-center font-medium leading-[1.3] tracking-[-0.02em] text-[3.889vw] text-black"
                  style={slide.bodyMobile ? { whiteSpace: "pre-line" as const } : undefined}
                >
                  {slide.bodyMobile ?? slide.body.replace(/\n/g, " ")}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-[40px] flex items-center gap-[6px]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => { goToSlide(i, "smooth", true); }}
                className={`h-[3px] w-[44px] cursor-pointer transition-colors duration-300 ${
                  i === activeSlide ? "bg-black" : "bg-black/20"
                }`}
              />
            ))}
          </div>

          <div className="h-[60px]" />
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex w-full flex-col items-center">
        <div
          ref={desktopScrollerRef}
          onPointerDown={() => pauseAutoAdvance()}
          className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((slide, i) => (
            <article
              key={slide.title}
              className="flex w-full shrink-0 snap-center flex-col items-center pt-[80px]"
            >
              <h2
                className="text-center font-normal leading-[1.1] tracking-[-0.04em] text-[5.859vw] lg:text-[5.139vw] text-black"
              >
                {slide.title}
              </h2>

              <div className="mt-[30px] relative w-[31.944vw] aspect-square shrink-0 overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="37.5vw"
                  priority={i === 0}
                />
              </div>

              <p className="mt-[30px] text-center font-medium leading-[1.5] tracking-[-0.02em] text-[2.344vw] lg:text-[max(14px,1.111vw)] max-w-[60vw] lg:max-w-[40vw] text-black" style={{ whiteSpace: "pre-line" }}>
                {slide.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-[30px] flex items-center gap-[10px]">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => { goToSlide(i, "smooth", true); }}
              className={`h-[5px] w-[70px] cursor-pointer transition-colors duration-300 ${
                i === activeSlide ? "bg-black" : "bg-black/20"
              }`}
            />
          ))}
        </div>

        <div className="h-[80px]" />
      </div>
    </section>
  );
}
