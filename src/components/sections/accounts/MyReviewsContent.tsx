"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AccountEmptyState from "@/components/sections/accounts/AccountEmptyState";
import LoadingModal from "@/components/layout/LoadingModal";
import ErrorStateCtaButton from "@/components/ui/ErrorStateCtaButton";
import { useAccountDevPreview } from "@/hooks/useAccountDevPreview";
import { reviewsApi } from "@/services/reviews";
import { mockReviews } from "@/utils/accountDevMockData";

type Review = {
  id: string;
  brand: string;
  productName: string;
  productImage: string;
  rating: number;
  tags: string;
  reviewText: string;
  photos: string[];
};

const HEARTS = [1, 2, 3, 4, 5];

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="10.75 12.1 20.1 17.85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[8.056vw] w-[8.056vw] shrink-0 md:h-[3.906vw] md:w-[3.906vw] lg:h-[2.778vw] lg:w-[2.778vw]"
      aria-hidden
    >
      <path
        d="M21.025 28.518C20.74 28.618 20.27 28.618 19.985 28.518C17.56 27.676 12.12 24.163 12.12 18.21C12.12 15.582 14.638 13.456 17.249 13.456C18.797 13.456 20.166 14.204 21.025 15.361C21.884 14.204 23.262 13.456 24.801 13.456C27.412 13.456 29.53 15.582 29.53 18.21C29.53 24.163 24.019 27.676 21.025 28.518Z"
        fill={filled ? "#7A021D" : "none"}
        stroke="#7A021D"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div
      className="flex items-center gap-[1.722vw]"
      role="img"
      aria-label={`${safeRating} out of 5 hearts`}
    >
      {HEARTS.map((i) => (
        <HeartIcon key={i} filled={i <= safeRating} />
      ))}
    </div>
  );
}

function ProductImage({ review, className, sizes }: { review: Review; className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={review.productImage}
        alt={review.productName}
        fill
        className="object-cover object-top"
        sizes={sizes}
      />
    </div>
  );
}

function ReviewHeader({ review, className = "" }: { review: Review; className?: string }) {
  return (
    <div className={`flex flex-col gap-[3.139vw] md:gap-[0.972vw] ${className}`}>
      <p className="font-[var(--font-manrope)] font-medium uppercase leading-normal tracking-[-0.02em] text-[#4e4e4e] text-[3.139vw] md:text-[1.563vw] lg:text-[1.188vw]">
        {review.brand}
      </p>
      <h3 className="font-[var(--font-manrope)] font-semibold capitalize leading-[1.1] tracking-[-0.04em] text-black text-[6.296vw] md:text-[3.125vw] lg:text-[2.361vw]">
        {review.productName}
      </h3>
      <StarRating rating={review.rating} />
    </div>
  );
}

function ReviewCopy({ review, className = "" }: { review: Review; className?: string }) {
  return (
    <>
      <p
        className={`font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-black text-[3.939vw] md:text-[1.823vw] lg:text-[1.111vw] ${className}`}
      >
        {review.tags}
      </p>
      <p
        className={`font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.04em] text-black text-[3.939vw] md:text-[1.823vw] lg:text-[1.111vw] ${className}`}
      >
        {review.reviewText}
      </p>
    </>
  );
}

function ReviewPhotos({ review, variant }: { review: Review; variant: "mobile" | "desktop" }) {
  const isDesktop = variant === "desktop";

  return (
    <div
      className={
        isDesktop
          ? "col-start-2 row-span-2 row-start-1 flex flex-nowrap items-start gap-[0.347vw] self-start"
          : "mt-[4.167vw] flex flex-nowrap items-start gap-[1.522vw]"
      }
    >
      {review.photos.map((src, i) => (
        <div
          key={`${review.id}-photo-${variant}-${i}`}
          className={
            isDesktop
              ? "relative h-[15.625vw] w-[11.719vw] shrink-0 overflow-hidden lg:h-[12.222vw] lg:w-[9.167vw]"
              : "relative h-[38.222vw] w-[28.742vw] shrink-0 overflow-hidden"
          }
        >
          <Image src={src} alt="" fill className="object-cover" sizes={isDesktop ? "9vw" : "29vw"} />
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="w-full bg-[#f7f4ef]">
      <div className="flex flex-col px-[2.778vw] pt-[2.778vw] pb-[2.778vw] md:hidden">
        <ProductImage review={review} className="h-[72.222vw] w-full" sizes="100vw" />
        <ReviewHeader review={review} className="mt-[4.167vw]" />
        <div className="mt-[4.167vw] flex flex-col gap-[4.167vw]">
          <ReviewCopy review={review} />
        </div>
        <ReviewPhotos review={review} variant="mobile" />
      </div>

      <div className="hidden md:grid md:min-h-0 md:w-full md:grid-cols-[29.948vw_1fr] md:items-stretch md:py-[3.125vw] md:pl-[4.167vw] lg:grid-cols-[22.917vw_1fr] lg:py-[2.431vw] lg:pl-[4.861vw]">
        <ProductImage review={review} className="h-full w-[29.948vw] min-h-0 shrink-0 lg:w-[22.917vw]" sizes="(max-width: 1023px) 30vw, 23vw" />
        <div className="flex min-h-0 min-w-0 flex-col px-[2.604vw] lg:px-[2.083vw]">
          <ReviewHeader review={review} className="pt-[3.125vw] lg:pt-[2.431vw]" />
          <div className="mt-[2.083vw] grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-[2.604vw] gap-y-[1.563vw] pb-[3.125vw] lg:mt-[1.389vw] lg:gap-x-[2.083vw] lg:gap-y-[0.972vw] lg:pb-[2.431vw]">
            <ReviewCopy review={review} className="col-start-1" />
            <ReviewPhotos review={review} variant="desktop" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyReviewsContent() {
  const { preview: devPreview, ready: devReady } = useAccountDevPreview();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!devReady || devPreview) return;

    async function fetchReviews() {
      try {
        setIsLoading(true);
        const { reviews: apiReviews } = await reviewsApi.getMine();

        // Map API response to component's Review format
        const mappedReviews: Review[] = apiReviews.map((review) => ({
          id: review.id,
          brand: review.products?.brand?.toUpperCase() ?? 'UNKNOWN BRAND',
          productName: review.products?.name ?? 'Unknown Product',
          productImage: "/images/wardrobe-sample.webp", // Default image since API doesn't provide it
          rating: review.rating,
          tags: "", // API doesn't have tags
          reviewText: review.body ?? "",
          photos: [], // API doesn't have photos
        }));

        setReviews(mappedReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [devReady, devPreview]);

  if (!devReady) return null;

  if (devPreview === "filled") {
    return (
      <div className="flex w-full flex-col gap-[2.778vw] px-[2.778vw] md:gap-[0.694vw] md:px-[0.694vw]">
        {mockReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  if (devPreview === "error") {
    return (
      <div className="flex w-full flex-col items-center py-12 gap-4">
        <p className="text-red-600">Failed to load reviews (dev preview)</p>
        <ErrorStateCtaButton />
      </div>
    );
  }

  if (devPreview === "empty") {
    return <AccountEmptyState heading="No Reviews" />;
  }

  if (isLoading) {
    return <LoadingModal open />;
  }

  if (error) {
    return (
      <div className="flex w-full flex-col items-center py-12 gap-4">
        <p className="text-red-600">{error}</p>
        <ErrorStateCtaButton />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <AccountEmptyState heading="No Reviews" />;
  }

  return (
    <div className="flex w-full flex-col gap-[2.778vw] px-[2.778vw] md:gap-[0.694vw] md:px-[0.694vw]">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
