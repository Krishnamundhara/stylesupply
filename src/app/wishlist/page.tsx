import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SavedPageClient from "@/components/sections/wishlist/SavedPageClient";

export const metadata: Metadata = {
  title: "Favourites - StyleSupply",
  description:
    "View your saved items and curated picks on StyleSupply.",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type WishlistForUI = {
  id: string;
  name: string;
  count: number;
  images: string[];
};

async function getWishlistData(): Promise<WishlistForUI[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const wlRes = await fetch(`${BACKEND_URL}/api/wishlist`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate: 0 },
    });
    if (!wlRes.ok) return [];
    const wlData = await wlRes.json();

    return ((wlData.wishlists ?? []) as Array<{
      id: string; name: string; item_count: number; preview_images: string[];
    }>).map((w) => ({
      id: w.id,
      name: w.name === "All Saved" ? "All Favourites" : w.name,
      count: w.item_count,
      images: w.preview_images.slice(0, 4) as string[],
    }));
  } catch {
    return [];
  }
}

export default async function SavedPage() {
  const rawWishlists = await getWishlistData();
  const wishlists = rawWishlists.filter((w) => w.count > 0);

  return (
    <>
      <Header />
      <main>
        <SavedPageClient initialCollections={wishlists} />
      </main>
      <Footer />
    </>
  );
}
