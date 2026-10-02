"use client";

import { useState } from "react";
import Image from "next/image";

/* ── Types ───────────────────────────────────────────────────────────────── */
export interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  body: string;
  fitNotes: string[];
  name: string;
  memberSince: string;
  productImage: string;
}

/* ── Default Data ────────────────────────────────────────────────────────── */
const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    rating: 4,
    title: "Loved the shirt, def needs something underneath but very cute.",
    body: "I wore this to a galentine's girl's night and got lots of compliments! I wore a nude camisole underneath.",
    fitNotes: ["True To Size", "Vacation"],
    name: "Denis Slavska",
    memberSince: "Style Supply member since 2 months",
    productImage: "/image/image 1068-2.png",
  },
  {
    id: "r2",
    rating: 4,
    title: "Loved the shirt, def needs something underneath but very cute.",
    body: "I wore this to a galentine's girl's night and got lots of compliments! I wore a nude camisole underneath.",
    fitNotes: ["True To Size", "Vacation"],
    name: "Denis Slavska",
    memberSince: "Style Supply member since 2 months",
    productImage: "/image/image 1068-2.png",
  },
  {
    id: "r3",
    rating: 4,
    title: "Loved the shirt, def needs something underneath but very cute.",
    body: "I wore this to a galentine's girl's night and got lots of compliments! I wore a nude camisole underneath.",
    fitNotes: ["True To Size", "Vacation"],
    name: "Denis Slavska",
    memberSince: "Style Supply member since 2 months",
    productImage: "/image/image 1068-2.png",
  },
  {
    id: "r4",
    rating: 4,
    title: "Loved the shirt, def needs something underneath but very cute.",
    body: "I wore this to a galentine's girl's night and got lots of compliments! I wore a nude camisole underneath.",
    fitNotes: ["True To Size", "Vacation"],
    name: "Denis Slavska",
    memberSince: "Style Supply member since 2 months",
    productImage: "/image/image 1068-2.png",
  },
  {
    id: "r5",
    rating: 4,
    title: "Loved the shirt, def needs something underneath but very cute.",
    body: "I wore this to a galentine's girl's night and got lots of compliments! I wore a nude camisole underneath.",
    fitNotes: ["True To Size", "Vacation"],
    name: "Denis Slavska",
    memberSince: "Style Supply member since 2 months",
    productImage: "/image/image 1068-2.png",
  },
  {
    id: "r6",
    rating: 4,
    title: "Loved the shirt, def needs something underneath but very cute.",
    body: "I wore this to a galentine's girl's night and got lots of compliments! I wore a nude camisole underneath.",
    fitNotes: ["True To Size", "Vacation"],
    name: "Denis Slavska",
    memberSince: "Style Supply member since 2 months",
    productImage: "/image/image 1068-2.png",
  },
];

const ITEMS_PER_PAGE = 5;

/* ── Star ────────────────────────────────────────────────────────────────── */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#6B0B23" : "none"} stroke="#6B0B23" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ── Review Card ─────────────────────────────────────────────────────────── */
function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="bg-[#F7F4EF] rounded-[20px] lg:rounded-[34px] px-[12px] py-[20px] lg:px-[50px] lg:py-[40px]">

      {/* ── MOBILE: text top, image bottom ── */}
      <div className="flex flex-col gap-[30px] lg:hidden">
        {/* Content */}
        <div className="flex flex-col gap-[15px]">
          {/* Stars */}
          <div className="flex gap-[2px]">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-[22px] h-[22px]">
                <Star filled={i <= review.rating} />
              </div>
            ))}
          </div>

          {/* Title + Body */}
          <div className="flex flex-col gap-[10px]">
            <p className="font-[var(--font-manrope)] font-semibold text-[20px] leading-[1.3] text-black tracking-[-0.05em]">
              {review.title}
            </p>
            <p className="font-[var(--font-manrope)] font-medium text-[15px] leading-[1.3] text-black tracking-[-0.05em]">
              {review.body}
            </p>
          </div>

          {/* Fit Notes */}
          <div className="flex flex-col gap-[15px]">
            <p className="font-[var(--font-manrope)] font-semibold text-[20px] text-black tracking-[-0.06em]">
              Fit Notes
            </p>
            <div className="flex gap-[7px] flex-wrap">
              {review.fitNotes.map((note, i) => (
                <span
                  key={i}
                  className="bg-[#EAE2DF] px-[8px] py-[8px] rounded-full font-[var(--font-manrope)] font-semibold text-[12px] text-[#7A021D] tracking-[-0.02em] whitespace-nowrap"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-[17px]">
            <div className="w-px h-[52px] bg-black/20 shrink-0" />
            <div className="flex flex-col gap-[9px]">
              <p className="font-[var(--font-manrope)] font-semibold text-[17px] text-black tracking-[-0.02em]">
                {review.name}
              </p>
              <p className="font-[var(--font-manrope)] font-medium text-[13.5px] text-black/50 tracking-[-0.02em]">
                {review.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Product Image — full width at bottom */}
        <div className="relative w-full h-[386px] rounded-[14px] overflow-hidden bg-[#D9D9D9]">
          <Image
            src={review.productImage}
            alt="Product"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── DESKTOP: text left, image right ── */}
      <div className="hidden lg:flex items-start gap-12 justify-between">
        {/* Left: content */}
        <div className="flex flex-col gap-[34px] flex-1">
          <div className="flex gap-[2px]">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-[22px] h-[22px]">
                <Star filled={i <= review.rating} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-[var(--font-manrope)] font-semibold text-[27px] leading-[1.3] text-black tracking-[-0.05em] max-w-[460px]">
              {review.title}
            </p>
            <p className="font-[var(--font-manrope)] font-medium text-[16px] leading-[1.4] text-black tracking-[-0.03em] max-w-[460px]">
              {review.body}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-[var(--font-manrope)] font-semibold text-[20px] text-black tracking-[-0.05em]">Fit Notes</p>
            <div className="flex flex-wrap gap-[14px]">
              {review.fitNotes.map((note, i) => (
                <span
                  key={i}
                  className="bg-[#EAE2DF] px-[20px] py-[12px] rounded-full font-[var(--font-manrope)] font-semibold text-[14px] text-[#7A021D] tracking-[-0.02em] whitespace-nowrap"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-[30px]">
            <div className="w-px h-[62px] bg-black/20 shrink-0" />
            <div className="flex flex-col gap-[11px]">
              <p className="font-[var(--font-manrope)] font-semibold text-[22px] text-black tracking-[-0.02em]">{review.name}</p>
              <p className="font-[var(--font-manrope)] font-medium text-[20px] text-black/50 tracking-[-0.02em]">{review.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Right: product image */}
        <div className="relative w-[320px] h-[420px] rounded-[14px] overflow-hidden bg-[#D9D9D9] shrink-0">
          <Image src={review.productImage} alt="Product" fill className="object-cover" sizes="320px" />
        </div>
      </div>

    </div>
  );
}

/* ── Pagination ──────────────────────────────────────────────────────────── */
function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-[12px] lg:gap-[15px]">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-[42px] h-[42px] lg:w-[74px] lg:h-[74px] rounded-full font-[var(--font-manrope)] font-bold text-[14px] lg:text-[24px] transition-all tracking-[-0.03em] ${
            currentPage === i
              ? "bg-[#6B0B23] text-white"
              : "bg-[#F7F4EF] text-[#6B0B23] hover:bg-[#EAE2DF]"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="w-[42px] h-[42px] lg:w-[74px] lg:h-[74px] rounded-full bg-[#EAE2DF] lg:bg-[#F7F4EF] flex items-center justify-center transition-all hover:bg-[#D9CFCB] lg:hover:bg-[#EAE2DF] disabled:opacity-40"
        aria-label="Next page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B0B23" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────────────────── */
export default function TestimonialsReviews({ reviews = DEFAULT_REVIEWS }: { reviews?: ReviewItem[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  function handlePageChange(p: number) {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="flex flex-col">

      {/* Section header */}
      <div className="flex items-center justify-between px-5 lg:px-[45px] pb-5 lg:pb-6">
        <h2 className="font-[var(--font-manrope)] font-medium text-[20px] lg:text-[28px] text-black tracking-[-0.04em]">
          Reviews
        </h2>
        {/* Desktop only filter button */}
        <button className="hidden lg:flex items-center gap-[10px] h-[48px] px-[22px] rounded-full bg-[#F6F9FF] font-[var(--font-manrope)] font-semibold text-[16px] text-[#7A021D] tracking-[-0.02em]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A021D" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="10" y2="18" />
          </svg>
          Filter By Size
        </button>
      </div>

      {/* Top Divider */}
      <div className="h-px bg-black/10 mx-5 lg:mx-[45px]" />

      {/* Mobile Filter button — centered below divider */}
      <div className="flex lg:hidden justify-center pt-5 px-5">
        <button className="flex items-center gap-[12px] h-[48px] px-[18px] rounded-full bg-[#F6F9FF] font-[var(--font-manrope)] font-semibold text-[16px] text-[#7A021D] tracking-[-0.02em]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A021D" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          Filter By Size
        </button>
      </div>

      {/* Review cards */}
      {paginatedReviews.map((review, idx) => (
        <div key={review.id}>
          <div className="px-5 lg:px-[45px] py-5 lg:py-[30px]">
            <ReviewCard review={review} />
          </div>
          {idx < paginatedReviews.length - 1 && (
            <div className="h-px bg-black/10 mx-5 lg:mx-[45px]" />
          )}
        </div>
      ))}

      {/* Bottom divider */}
      <div className="h-px bg-black/10 mx-5 lg:mx-[45px]" />

      {/* Pagination */}
      <div className="px-5 lg:px-[45px] pt-8 lg:pt-[50px]">
        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
      </div>

    </section>
  );
}
