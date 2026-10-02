import type { ReactNode } from "react";
import ProductCard from "@/components/layout/ProductCard";

export interface RecentlyViewedProduct {
  id: string;
  href: string;
  image: string;
  brand: string;
  name: string;
  originalPrice?: string;
  currentPrice?: string;
}

const PLACEHOLDER_PRODUCTS: RecentlyViewedProduct[] = [
  { id: "1", href: "/products/1", image: "/images/collection/Prod_image.png", brand: "TWO EXTRA LIVES", name: "Baobab Dress", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try" },
  { id: "2", href: "/products/2", image: "/images/collection/Prod_image.png", brand: "TWO EXTRA LIVES", name: "Baobab Dress", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try" },
  { id: "3", href: "/products/3", image: "/images/collection/Prod_image.png", brand: "TWO EXTRA LIVES", name: "Baobab Dress", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try" },
  { id: "4", href: "/products/4", image: "/images/collection/Prod_image.png", brand: "TWO EXTRA LIVES", name: "Baobab Dress", originalPrice: "MRP ₹50,000", currentPrice: "₹0 to try" },
];

const HEADING_CLASS =
  "text-center font-normal text-black leading-[1.2] tracking-[-1.36px] text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw] lg:tracking-[-2.96px]";

interface RecentlyViewedProps {
  recentProducts?: RecentlyViewedProduct[];
  styleWithProducts?: RecentlyViewedProduct[];
  styleWithCta?: ReactNode;
}

export default function RecentlyViewed({
  recentProducts = PLACEHOLDER_PRODUCTS,
  styleWithProducts = PLACEHOLDER_PRODUCTS,
  styleWithCta,
}: RecentlyViewedProps) {
  return (
    <div className="w-full flex flex-col gap-[60px] lg:gap-[80px] font-[var(--font-manrope)]">
      {recentProducts.length > 0 && (
        <section className="w-full">
          <h2 className={HEADING_CLASS}>Recently Viewed</h2>

          <div className="mt-[30px] grid grid-cols-2 gap-[5px] px-[10px] md:hidden">
            {recentProducts.map((p) => (
              <div key={p.id} className="min-w-0">
                <ProductCard product={{ ...p, currentPrice: p.currentPrice ?? "₹0 to try" }} />
              </div>
            ))}
          </div>

          <div className="hidden md:mt-[40px] md:flex md:items-start md:overflow-x-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden md:gap-[5px] md:pl-[11px] md:pr-[11px]">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={{ ...p, currentPrice: p.currentPrice ?? "₹0 to try" }} />
            ))}
          </div>
        </section>
      )}

      {styleWithProducts.length > 0 && (
        <section className="w-full">
          <h2 className={HEADING_CLASS}>Style It With</h2>

          <div className="mt-[30px] grid grid-cols-2 gap-[5px] px-[10px] md:hidden">
            {styleWithProducts.map((p) => (
              <div key={p.id} className="min-w-0">
                <ProductCard product={{ ...p, currentPrice: p.currentPrice ?? "₹0 to try" }} />
              </div>
            ))}
          </div>

          <div className="hidden md:mt-[40px] md:flex md:items-start md:overflow-x-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden md:gap-[5px] md:pl-[11px] md:pr-[11px]">
            {styleWithProducts.map((p) => (
              <ProductCard key={p.id} product={{ ...p, currentPrice: p.currentPrice ?? "₹0 to try" }} />
            ))}
          </div>

          {styleWithCta && (
            <div className="mt-[40px] flex justify-center lg:mt-[57px]">
              {styleWithCta}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
