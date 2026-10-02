import { cookies } from "next/headers";
import type { HomePageData, HomeProduct } from "@/types/home";
import { homeData } from "./homeData";
import { getServerUser } from "@/services/serverProfile";
import type { BrowseResponse, ProductCard } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function productCardToHomeProduct(card: ProductCard): HomeProduct {
  const price = card.rent_price_minor != null ? card.rent_price_minor : card.retail_price_minor;
  const currency = card.currency === "INR" ? "₹" : card.currency;
  const formatted = price === 0 ? "₹0 to try" : `${currency}${(price / 100).toLocaleString("en-IN")}`;
  const original = `${currency}${(card.retail_price_minor / 100).toLocaleString("en-IN")}`;
  return {
    id: card.card_id,
    productId: card.product_id,
    brand: card.brand?.name ?? "",
    name: card.name,
    image: card.thumbnail_url ?? "/images/home/dive-right-in-figma.png",
    originalPrice: original,
    currentPrice: formatted,
    href: `/products/${card.product_id}`,
    isSaved: card.is_saved,
  };
}

async function fetchDiveProducts(cookieHeader: string): Promise<HomeProduct[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=50`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: BrowseResponse = await res.json();
    if (!data.cards?.length) return null;

    const brandCount = new Map<string, number>();
    const filtered: ProductCard[] = [];
    for (const card of data.cards) {
      const brand = card.brand?.name ?? "";
      const count = brandCount.get(brand) ?? 0;
      if (count < 2) {
        filtered.push(card);
        brandCount.set(brand, count + 1);
      }
    }

    return filtered.slice(0, 10).map(productCardToHomeProduct);
  } catch {
    return null;
  }
}

/**
 * Single data-fetching boundary for the /home page.
 * Uses getServerUser (which hits /api/auth/me) to get the authenticated user's first name.
 */
export async function getHomeData(): Promise<HomePageData> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [user, diveProducts] = await Promise.all([
    getServerUser(),
    fetchDiveProducts(cookieHeader),
  ]);

  return {
    ...homeData,
    user: { name: user?.name || "there" },
    diveRightIn: {
      ...homeData.diveRightIn,
      products: diveProducts ?? homeData.diveRightIn.products,
    },
  };
}
