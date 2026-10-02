"use client";

import { useEffect, useState } from "react";
import AccountEmptyState from "@/components/sections/accounts/AccountEmptyState";
import LoadingModal from "@/components/layout/LoadingModal";
import ErrorStateCtaButton from "@/components/ui/ErrorStateCtaButton";
import { useAccountDevPreview } from "@/hooks/useAccountDevPreview";
import { ordersApi } from "@/services/orders";
import WardrobeProductCard, { WardrobeProduct } from "./WardrobeProductCard";
import { mockWardrobeProducts } from "@/utils/accountDevMockData";

const FALLBACK_IMAGE = "/images/wardrobe-sample.webp";

export default function MyWardrobeContent() {
  const { preview: devPreview, ready: devReady } = useAccountDevPreview();
  const [products, setProducts] = useState<WardrobeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!devReady || devPreview) return;

    async function fetchWardrobe() {
      try {
        setIsLoading(true);
        const { orders } = await ordersApi.list();

        const mapped: WardrobeProduct[] = orders.map((order) => ({
          id: order.id,
          image: order.product?.thumbnail_url ?? FALLBACK_IMAGE,
          brand: order.product?.brand?.toUpperCase() ?? "UNKNOWN BRAND",
          productName: order.product?.name ?? "Unknown Product",
        }));

        setProducts(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load wardrobe");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWardrobe();
  }, [devReady, devPreview]);

  if (!devReady) return null;

  if (devPreview === "filled") {
    return (
      <div className="w-full px-[2.222vw] md:px-[1.181vw]">
        <div className="grid grid-cols-2 gap-x-[1.111vw] md:gap-x-[0.278vw] gap-y-[6.944vw] md:gap-y-[4.167vw]">
          {mockWardrobeProducts.map((product) => (
            <WardrobeProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  if (devPreview === "error") {
    return (
      <div className="w-full">
        <div className="flex w-full flex-col items-center py-12 gap-4">
          <p className="text-red-600">Failed to load wardrobe (dev preview)</p>
          <ErrorStateCtaButton />
        </div>
      </div>
    );
  }

  if (devPreview === "empty") {
    return (
      <AccountEmptyState
        heading={
          <>
            <span className="md:hidden">
              Your Wardrobe
              <br />
              is empty
            </span>
            <span className="hidden md:inline">Your Wardrobe is Empty</span>
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
      <div className="flex w-full flex-col items-center py-12 gap-4">
        <p className="text-red-600">{error}</p>
        <ErrorStateCtaButton />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <AccountEmptyState
        heading={
          <>
            <span className="md:hidden">
              Your Wardrobe
              <br />
              is empty
            </span>
            <span className="hidden md:inline">Your Wardrobe is Empty</span>
          </>
        }
      />
    );
  }

  return (
    <div className="w-full px-[4.167vw] md:px-[1.181vw]">
      <div className="grid grid-cols-2 gap-x-[2.778vw] md:gap-x-[0.278vw] gap-y-[10vw] md:gap-y-[4.167vw]">
        {products.map((product) => (
          <WardrobeProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
