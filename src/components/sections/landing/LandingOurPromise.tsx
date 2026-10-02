"use client";

import Image from "next/image";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface PromiseSlide {
  headline: string;
  image: string;
  imageAlt: string;
  description: string;
}

const DEFAULT_SLIDES: PromiseSlide[] = [
  {
    headline: "Curated, not Catalogued",
    image: "/images/landing/carousel-1.webp",
    imageAlt: "Curated designer pieces laid flat",
    description: "We curate the supply. You\ncurate the style.",
  },
  {
    headline: "24 hour\nDelivery",
    image: "/images/landing/carousel-2.webp",
    imageAlt: "StyleSupply box being opened",
    description: "Your taste is expensive, and\nso is your time.",
  },
  {
    headline: "Try without Commitment",
    image: "/images/landing/carousel-3.webp",
    imageAlt: "Woman unboxing StyleSupply delivery at home",
    description: "Never pay for anything you\ndon't like.",
  },
];

const CARD = {
  pt: "calc(100vw * 40 / 360)",
  labelToTitle: "calc(100vw * 10 / 360)",
  titleToImage: "calc(100vw * 20 / 360)",
  imageToDescription: "calc(100vw * 20 / 360)",
  descriptionToDots: "calc(100vw * 30 / 360)",
  pb: "calc(100vw * 40 / 360)",
  imageWDesktop: 352,
  imageHDesktop: 494,
} as const;

const IMAGE_INTRINSIC = {
  w: Math.round(CARD.imageWDesktop),
  h: Math.round(CARD.imageHDesktop),
} as const;

interface LandingOurPromiseProps {
  slides?: PromiseSlide[];
}

const AUTO_SCROLL_INTERVAL_MS = 4000;
const MANUAL_PAUSE_MS = 2000;

export default function LandingOurPromise({
  slides = DEFAULT_SLIDES,
}: LandingOurPromiseProps = {}) {
  const [activeSlide, setActiveSlide] = useState(0);
  // Ref mirrors activeSlide to avoid stale closures inside the setInterval callback.
  const activeSlideRef = useRef(0);
  const autoPausedUntilRef = useRef(0);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const desktopScrollerRef = useRef<HTMLDivElement>(null);

  const pauseAutoAdvance = useCallback((durationMs: number = MANUAL_PAUSE_MS) => {
    autoPausedUntilRef.current = Date.now() + durationMs;
  }, []);

  const scrollToSlide = useCallback(
    (
      ref: RefObject<HTMLDivElement | null>,
      index: number,
      behavior: ScrollBehavior = "smooth",
    ) => {
      const el = ref.current;
      if (!el) return;
      if (el.clientWidth <= 0) return;

      el.scrollTo({
        left: index * el.clientWidth,
        behavior,
      });
    },
    [],
  );

  const goToSlide = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const next = (index + slides.length) % slides.length;
    activeSlideRef.current = next;
    setActiveSlide(next);
    scrollToSlide(mobileScrollerRef, next, behavior);
    scrollToSlide(desktopScrollerRef, next, behavior);
  }, [scrollToSlide, slides.length]);


  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      goToSlide(0, "auto");
    });
    return () => window.cancelAnimationFrame(id);
  }, [goToSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const id = window.setInterval(() => {
      if (Date.now() < autoPausedUntilRef.current) return;

      const next = (activeSlideRef.current + 1) % slides.length;
      goToSlide(next, next === 0 ? "auto" : "smooth");
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [goToSlide, slides.length]);

  useEffect(() => {
    const scrollers = [mobileScrollerRef.current, desktopScrollerRef.current].filter(
      Boolean,
    ) as HTMLDivElement[];

    const updateActive = (el: HTMLDivElement) => {
      if (el.clientWidth <= 0) return;

      const next = Math.round(el.scrollLeft / el.clientWidth);
      const bounded = Math.min(Math.max(next, 0), slides.length - 1);
      activeSlideRef.current = bounded;
      setActiveSlide(bounded);
    };

    const cleanups = scrollers.map((el) => {
      const onScroll = () => updateActive(el);
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [slides.length]);

  return (
    <section className="w-full mt-[40px] lg:mt-[8px] bg-[#F7F4EF] font-[var(--font-manrope)]">
      {/* Mobile layout (< md) */}
      <div className="md:hidden flex w-full justify-center px-[5vw]">
        <div
          className="flex w-full max-w-[324px] flex-col items-center"
          style={{ paddingTop: CARD.pt, paddingBottom: CARD.pb }}
        >
          <p className="w-full text-center font-medium leading-[1.2] tracking-[-0.02em] text-black text-[0.97rem]">
            Our Promise
          </p>

          <div
            ref={mobileScrollerRef}
            onPointerDown={() => pauseAutoAdvance()}
            className="flex w-full snap-x snap-mandatory overflow-x-auto touch-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((slide, i) => (
              <article
                key={slide.headline}
                className="flex w-full shrink-0 snap-center flex-col items-center"
              >
                <h2
                  className="min-h-[calc(100vw*75/360)] w-full whitespace-pre-line text-center font-medium leading-[1.1] tracking-[-0.04em] text-black text-[clamp(1.875rem,9.444vw,2.5rem)]"
                  style={{ marginTop: CARD.labelToTitle }}
                >
                  {slide.headline}
                </h2>

                <div
                  className="flex h-[309.84px] w-[218.48px] shrink-0 items-center justify-center overflow-hidden"
                  style={{ marginTop: CARD.titleToImage }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    width={IMAGE_INTRINSIC.w}
                    height={IMAGE_INTRINSIC.h}
                    sizes="218px"
                    className="h-full w-full object-contain"
                    priority={i === 0}
                  />
                </div>

                <p
                  className="min-h-[calc(100vw*43/360)] w-full whitespace-pre-line text-center font-medium leading-[1.2] tracking-[-0.02em] text-black text-[clamp(1rem,5vw,1.375rem)]"
                  style={{ marginTop: CARD.imageToDescription }}
                >
                  {slide.description}
                </p>
              </article>
            ))}
          </div>

          <div
            className="flex items-center gap-[0.375rem]"
            style={{ marginTop: CARD.descriptionToDots }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  pauseAutoAdvance();
                  goToSlide(i);
                }}
                className={`h-[3px] w-[2.75rem] cursor-pointer transition-colors duration-300 ${
                  i === activeSlide ? "bg-black" : "bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tablet + Desktop layout (md+) */}
      <div className="hidden md:flex w-full flex-col items-center px-[2.5rem] pt-[50px] pb-[50px]">
        <p className="text-center font-medium leading-[1.2] text-black text-[2.344vw] lg:text-[1.667vw]">
          Our Promise
        </p>

        <div
          ref={desktopScrollerRef}
          onPointerDown={() => pauseAutoAdvance()}
          className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-contain touch-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => (
            <article
              key={slide.headline}
              className="flex w-full shrink-0 snap-center flex-col items-center"
            >
              <h2 className="mt-[15px] whitespace-nowrap text-center font-medium leading-[1.1] tracking-[-0.04em] text-black text-[5.859vw] lg:text-[4.444vw]">
                {slide.headline.replace(/\s*\n\s*/g, " ")}
              </h2>

              <div className="mt-[30px] relative flex h-[min(45vw,494px)] w-[min(32vw,352px)] shrink-0 items-center justify-center">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={IMAGE_INTRINSIC.w}
                  height={IMAGE_INTRINSIC.h}
                  sizes="(max-width: 1024px) 32vw, 352px"
                  className="block h-full w-full object-cover"
                  priority={i === 0}
                />
              </div>

              <p className="mt-[20px] whitespace-pre-line text-center font-medium leading-[1.2] tracking-[-0.02em] text-black text-[2.344vw] lg:text-[1.667vw]">
                {slide.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-[40px] flex items-center gap-[10px]">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                pauseAutoAdvance();
                goToSlide(i);
              }}
              className={`h-[5px] w-[70px] cursor-pointer transition-colors duration-300 ${
                i === activeSlide ? "bg-black" : "bg-black/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
