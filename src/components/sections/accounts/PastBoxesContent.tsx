"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AccountEmptyState from "@/components/sections/accounts/AccountEmptyState";
import LoadingModal from "@/components/layout/LoadingModal";
import ErrorStateCtaButton from "@/components/ui/ErrorStateCtaButton";
import { useAccountDevPreview } from "@/hooks/useAccountDevPreview";
import { boxApi } from "@/services/box";
import type { Box } from "@/types/box";
import { mockPastBoxes } from "@/utils/accountDevMockData";

export interface PastBoxProduct {
  id: string;
  image: string;
  brand: string;
  productName: string;
  kept?: boolean;
}

export interface PastBox {
  id: string;
  date: string;
  orderNumber: string;
  products: PastBoxProduct[];
}

const PRODUCT_IMAGE = "/images/individual_Collectionlanding/image 814.png";

function PastBoxProductCard({ product }: { product: PastBoxProduct }) {
  return (
    <div className="flex shrink-0 flex-col snap-start w-[75.543vw] md:w-auto">
      {/* Card image */}
      <div
        className={`relative w-[75.543vw] h-[90.543vw] md:w-[18.403vw] md:h-[22.083vw] overflow-hidden bg-white flex-shrink-0 ${
          product.kept ? "border-[0.853vw] md:border-[3px] border-[#7a021d]" : ""
        }`}
      >
        <Image
          src={product.image}
          alt={product.productName}
          fill
          className="object-cover object-top"
          sizes="(max-width: 767px) 76vw, 19vw"
          unoptimized
        />
        {product.kept && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center bg-[#7a021d] h-[13.807%]">
            <span className="font-[var(--font-manrope)] font-semibold text-white capitalize tracking-[-0.04em] text-[5.174vw] md:text-[1.563vw] lg:text-[1.2vw]">
              Kept
            </span>
          </div>
        )}
      </div>

      {/* Text below card */}
      <div className="flex flex-col mt-[2.778vw] md:mt-[1.953vw] lg:mt-[1.042vw]">
        <p className="font-[var(--font-manrope)] font-medium text-[#4e4e4e] tracking-[-0.02em] uppercase text-[2.778vw] md:text-[1.823vw] lg:text-[0.972vw] leading-[1.1]">
          {product.brand}
        </p>
        <p className="font-[var(--font-manrope)] font-semibold text-black tracking-[-0.04em] capitalize text-[4.444vw] md:text-[2.344vw] lg:text-[1.389vw] leading-[1.1] w-[70%] truncate mt-[1.389vw] md:mt-[0.911vw] lg:mt-[0.694vw]">
          {product.productName}
        </p>
      </div>
    </div>
  );
}

function PastBoxRow({ box }: { box: PastBox }) {
  return (
    <div className="w-full">
      {/* Header: date + order number */}
      <div className="flex items-center justify-between mb-[3.333vw] md:mb-[1.667vw] px-[4.167vw] md:px-0">
        <p className="font-[var(--font-manrope)] font-normal text-black tracking-[-0.04em] leading-[1.2] text-[5vw] md:text-[2.344vw] lg:text-[2.361vw]">
          {box.date}
        </p>
        <p className="font-[var(--font-manrope)] font-normal text-black tracking-[-0.04em] leading-none text-[5vw] md:text-[2.344vw] lg:text-[2.361vw]">
          {box.orderNumber}
        </p>
      </div>

      {/* Product area */}
      <div className="bg-[#F7F4EF] w-full px-[4.167vw] md:px-[2.569vw] py-[4.167vw] md:py-[1.944vw] flex flex-col">
        <div className="flex gap-[1.421vw] md:gap-[1.25vw] overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-auto md:grid md:grid-cols-5 md:overflow-visible md:snap-none">
          {box.products.map((product) => (
            <PastBoxProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PastBoxesContent() {
  const { preview: devPreview, ready: devReady } = useAccountDevPreview();
  const [boxes, setBoxes] = useState<PastBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!devReady || devPreview) return;

    async function fetchHistory() {
      try {
        setIsLoading(true);
        const { boxes: apiBoxes } = await boxApi.getHistory();

        // Map API response to PastBox format
        const mappedBoxes: PastBox[] = apiBoxes.map((box, index) => ({
          id: box.id,
          date: new Date(box.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          orderNumber: `Order #SS${String(2345 - index).padStart(4, '0')}`,
          products: [], // Products would need to be fetched separately or included in API
        }));

        setBoxes(mappedBoxes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [devReady, devPreview]);

  if (!devReady) return null;

  if (devPreview === "filled") {
    return (
      <div className="w-full min-w-0 flex flex-col gap-[11.111vw] md:gap-[7.813vw] lg:gap-[4.167vw] px-[0] md:px-[1.042vw]">
        {mockPastBoxes.map((box) => (
          <PastBoxRow key={box.id} box={box} />
        ))}
      </div>
    );
  }

  if (devPreview === "error") {
    return (
      <div className="w-full min-w-0 flex flex-col items-center py-12 gap-4">
        <p className="text-red-600">Failed to load history (dev preview)</p>
        <ErrorStateCtaButton />
      </div>
    );
  }

  if (devPreview === "empty") {
    return (
      <AccountEmptyState
        heading={
          <>
            <span className="md:hidden">
              No Past
              <br />
              Boxes
            </span>
            <span className="hidden md:inline">No Past Boxes</span>
          </>
        }
      />
    );
  }

  if (isLoading) {
    return <LoadingModal open />;
  }

  if (error) {
    return (
      <div className="w-full min-w-0 flex flex-col items-center py-12 gap-4">
        <p className="text-red-600">{error}</p>
        <ErrorStateCtaButton />
      </div>
    );
  }

  if (boxes.length === 0) {
    return (
      <AccountEmptyState
        heading={
          <>
            <span className="md:hidden">
              No Past
              <br />
              Boxes
            </span>
            <span className="hidden md:inline">No Past Boxes</span>
          </>
        }
      />
    );
  }

  return (
    <div className="w-full min-w-0 flex flex-col gap-[11.111vw] md:gap-[7.813vw] lg:gap-[4.167vw] px-[0] md:px-[1.042vw]">
      {boxes.map((box) => (
        <PastBoxRow key={box.id} box={box} />
      ))}
    </div>
  );
}

