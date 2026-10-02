import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SavedInsideClient, {
  type SavedInsideInitialCollection,
  type SavedInsideOtherCollection,
} from "@/components/sections/wishlist/SavedInsideClient";

export const metadata: Metadata = {
  title: "Collection - StyleSupply",
  description: "View your saved collection on StyleSupply.",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const PLACEHOLDER_IMAGE = "/image/image 1054.png";

function formatPrice(minor: number): string {
  const rupees = Math.round(minor / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

const PREVIEW_IMAGES = [
  "/image/image 1054.png",
  "/image/image 1069.png",
  "/image/image 1068.png",
  "/image/image 1066.png",
  "/image/image 1067.png",
  "/image/image 1068-1.png",
  "/image/image 1053.png",
  "/image/image 1058.png",
];

/** Dev-only: `/wishlist/[id]?preview=filled` shows sample products without the API. */
function buildPreviewCollection(collectionId: string): SavedInsideInitialCollection {
  return {
    id: collectionId,
    name: "Birthday Fits",
    products: PREVIEW_IMAGES.map((image, i) => ({
      id: `preview-${i + 1}`,
      productId: `preview-${i + 1}`,
      name: "RALPH LAUREN",
      subtitle: "COAT JACKET",
      image,
      retailPrice: "₹20,000",
      rentPrice: "₹0 to try",
    })),
  };
}

async function getCollectionFromBackend(
  collectionId: string,
  cookieHeader: string,
): Promise<SavedInsideInitialCollection | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/wishlist/${collectionId}`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate: 0 },
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    const products = ((data.products ?? []) as Array<{
      id: string;
      name: string;
      brand: { name: string } | null;
      retail_price_minor: number;
      rent_price_minor: number | null;
      thumbnail_url: string | null;
    }>).map((p) => ({
      id: p.id,
      productId: p.id,
      name: p.brand?.name ?? "Unknown",
      subtitle: p.name,
      image: p.thumbnail_url ?? PLACEHOLDER_IMAGE,
      retailPrice: formatPrice(p.retail_price_minor),
      rentPrice:
        p.rent_price_minor != null && p.rent_price_minor > 0
          ? formatPrice(p.rent_price_minor)
          : "₹0 to try",
    }));
    return {
      id: data.wishlist?.id ?? collectionId,
      name: (data.wishlist?.name === "All Saved" ? "All Favourites" : data.wishlist?.name) ?? "Collection",
      products,
    };
  } catch {
    return undefined;
  }
}

async function getOtherCollections(
  currentId: string,
  cookieHeader: string,
): Promise<SavedInsideOtherCollection[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/wishlist`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const data = await res.json() as {
      wishlists: Array<{ id: string; name: string; item_count: number; preview_images: string[] }>;
    };
    return (data.wishlists ?? [])
      .filter((w) => w.id !== currentId && w.name !== "All Saved")
      .map((w) => {
        const fill = (i: number) => w.preview_images[i] ?? "/images/wardrobe-sample.webp";
        return {
          id: w.id,
          name: w.name,
          count: w.item_count,
          images: [fill(0), fill(1), fill(2), fill(3)] as [string, string, string, string],
        };
      });
  } catch {
    return [];
  }
}

type PageProps = {
  params: Promise<{ collectionId: string }>;
  searchParams?: Promise<{ preview?: string }>;
};

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { collectionId } = await params;
  const sp = searchParams ? await searchParams : {};
  const useDevPreview =
    process.env.NODE_ENV === "development" && sp.preview === "filled";

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let initialCollection: SavedInsideInitialCollection | undefined;
  let otherCollections: SavedInsideOtherCollection[] = [];
  if (useDevPreview) {
    initialCollection = buildPreviewCollection(collectionId);
  } else {
    const [collection, others] = await Promise.all([
      getCollectionFromBackend(collectionId, cookieHeader),
      getOtherCollections(collectionId, cookieHeader),
    ]);
    initialCollection = collection;
    otherCollections = others;
  }

  return (
    <>
      <Header />
      <main>
        <SavedInsideClient
          initialCollection={initialCollection}
          otherCollections={otherCollections}
        />
      </main>
      <Footer />
    </>
  );
}
