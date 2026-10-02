"use client";

import { useState, useRef, useEffect } from "react";
import type { ProductReview } from "@/services/reviews";

interface Props {
  reviews?: ProductReview[];
}

function HeartFilled({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path d="M14.724 24.2789C14.3273 24.4189 13.674 24.4189 13.2773 24.2789C9.89398 23.1239 2.33398 18.3055 2.33398 10.1389C2.33398 6.53385 5.23898 3.61719 8.82065 3.61719C10.944 3.61719 12.8223 4.64385 14.0007 6.23052C15.179 4.64385 17.069 3.61719 19.1807 3.61719C22.7623 3.61719 25.6673 6.53385 25.6673 10.1389C25.6673 18.3055 18.1073 23.1239 14.724 24.2789Z" fill="#7A021D" stroke="#7A021D" strokeWidth="3.10028" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PaginationDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-[5px]">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to review ${i + 1}`}
          className={`h-[6px] w-[50px] transition-colors duration-300 ${
            i === active ? "bg-[#2c0505]" : "bg-[#2c0505]/15"
          }`}
        />
      ))}
    </div>
  );
}

const AUTO_INTERVAL = 3500;

export default function ProductReviews({ reviews = [] }: Props) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => setActive(Math.max(0, Math.min(idx, Math.max(0, reviews.length - 1))));

  useEffect(() => {
    if (reviews.length <= 1) return;
    autoRef.current = setInterval(() => goTo(active + 1), AUTO_INTERVAL);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [active, reviews.length]);

  useEffect(() => {
    const applyTranslate = (ref: React.RefObject<HTMLDivElement | null>, gap: number, center?: boolean) => {
      const track = ref.current;
      if (!track) return;
      const firstCard = track.children[0] as HTMLElement | undefined;
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      if (center) {
        const containerWidth = track.parentElement?.offsetWidth ?? 0;
        const centerOffset = (containerWidth - cardWidth) / 2;
        track.style.transform = `translateX(${centerOffset - active * (cardWidth + gap)}px)`;
      } else {
        track.style.transform = `translateX(${-(active * (cardWidth + gap))}px)`;
      }
    };
    applyTranslate(mobileTrackRef, 12, true);
    applyTranslate(desktopTrackRef, 30, true);
  }, [active, reviews.length]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
      touchStartX.current = e.touches[0].clientX;
      resetAuto();
    },
    onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 40) return;
      goTo(diff > 0 ? active + 1 : active - 1);
    },
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
      mouseStartX.current = e.clientX;
      isDragging.current = true;
      resetAuto();
    },
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging.current || mouseStartX.current === null) return;
      const diff = mouseStartX.current - e.clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? active + 1 : active - 1);
      mouseStartX.current = null;
      isDragging.current = false;
    },
    onMouseLeave: () => { mouseStartX.current = null; isDragging.current = false; },
  };

  if (reviews.length === 0) return null;

  return (
    <section className="w-full font-[var(--font-manrope)] overflow-hidden">

      {/* DESKTOP */}
      <div className="hidden lg:flex lg:flex-col lg:gap-[1.667vw]">
        <h2 className="text-center font-normal text-[5.139vw] leading-[1.2] tracking-[-0.04em] text-black">
          Reviews
        </h2>
        <div
          ref={desktopTrackRef}
          {...swipeHandlers}
          className="flex gap-[30px] transition-transform duration-500 ease-in-out will-change-transform cursor-grab"
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="shrink-0 w-[93.056vw] bg-[#f8f4f1] flex items-stretch p-[2.778vw]"
            >
              <div className="flex-1 flex flex-col justify-between gap-[2.083vw]">
                <div className="flex flex-col gap-[1.875vw]">
                  <div className="flex items-center gap-[0.868vw]">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <HeartFilled key={i} size={35} />
                    ))}
                  </div>
                  <p className="font-medium text-[2.361vw] leading-[1.4] tracking-[-0.04em] text-black">
                    {review.body ?? ""}
                  </p>
                </div>
                <p className="font-semibold text-[1.96vw] leading-none tracking-[-0.04em] text-black capitalize">
                  {review.profiles?.full_name ?? "Anonymous"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 1 && (
          <PaginationDots
            count={reviews.length}
            active={active}
            onSelect={setActive}
          />
        )}
      </div>

      {/* MOBILE */}
      <div className="lg:hidden flex flex-col gap-5">
        <h2 className="text-center font-normal text-[9.444vw] leading-[1.2] tracking-[-0.04em] text-black">
          Reviews
        </h2>

        <div className="w-full overflow-hidden">
          <div
            ref={mobileTrackRef}
            {...swipeHandlers}
            className="flex items-start gap-3 transition-transform duration-500 ease-in-out will-change-transform cursor-grab touch-pan-y"
          >
            {reviews.map((review) => (
              <article
                key={review.id}
                className="box-border w-[88.889vw] shrink-0 bg-[#f8f4f1] flex flex-col overflow-hidden p-[3.333vw]"
              >
                <div className="flex flex-col gap-[6.667vw]">
                  <div className="flex items-center gap-[1.667vw]">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <HeartFilled key={i} size={28} />
                    ))}
                  </div>
                  <p className="font-medium text-[4.444vw] leading-[1.5] tracking-[-0.02em] text-black max-w-[75.833vw]">
                    {review.body ?? ""}
                  </p>
                  <p className="font-semibold text-[4.167vw] leading-normal tracking-[-0.04em] text-black capitalize">
                    {review.profiles?.full_name ?? "Anonymous"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {reviews.length > 1 && (
          <PaginationDots
            count={reviews.length}
            active={active}
            onSelect={setActive}
          />
        )}
      </div>

    </section>
  );
}
