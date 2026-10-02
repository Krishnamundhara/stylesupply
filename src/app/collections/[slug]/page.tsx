import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IndividualCollectionLanding from "@/components/sections/collections/IndividualCollectionLanding";
import type { IndividualCollectionProduct } from "@/components/sections/collections/IndividualCollectionLanding";
import type { ProductCard } from "@/types/product";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const COLLECTION_SUBTITLES: Record<string, string> = {
  "everyday-icons": "The ease of good taste.",
  "daytime-soiree": "For sunlit jest and golden-hour arrivals.",
  "after-hours":    "Where the night begins.",
};
const PRODUCT_CARD_IMAGE = "/images/individual_Collectionlanding/image 814.png";
const SECTION_EDITORIAL = "/images/individual_Collectionlanding/Screen Shot 2026-04-29 at 5.15.38 AM 3.png";

const COLLECTION_HERO_DESKTOP: Record<string, string> = {
  "everyday-icons":  "/images/collection/collection_1_desktop.webp",
  "daytime-soiree":  "/images/collection/collection_2_desktop.webp",
  "after-hours":     "/images/collection/collection_3_desktop.webp",
};
const COLLECTION_HERO_MOBILE: Record<string, string> = {
  "everyday-icons":  "/images/collection/collection_1_mobile.webp",
  "daytime-soiree":  "/images/collection/collection_2_mobile.webp",
  "after-hours":     "/images/collection/collection_3_mobile.webp",
};

export const metadata: Metadata = {
  title: "Collection - StyleSupply",
  description: "Explore this curated collection on StyleSupply.",
};

function formatPrice(minor: number): string {
  const rupees = Math.round(minor / 100);
  return `MRP ₹${rupees.toLocaleString("en-IN")}`;
}

function colourSlug(card: ProductCard): string | null {
  if (card.colour?.slug) return card.colour.slug;
  if (card.custom_colour) return card.custom_colour.toLowerCase().trim().replace(/\s+/g, "-");
  return null;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionSlugPage({ params }: Props) {
  const { slug } = await params;

  let cards: ProductCard[] = [];
  let collectionName = "Collection";
  let collectionDescription = "";
  let collectionHero: string | undefined;

  try {
    const res = await fetch(`${BACKEND_URL}/api/collections/${slug}?limit=24`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = (await res.json()) as {
        collection?: { name?: string; description?: string | null; hero_url?: string | null };
        cards?: ProductCard[];
      };
      cards = data.cards ?? [];
      collectionName = data.collection?.name ?? collectionName;
      collectionDescription = data.collection?.description ?? "";
      collectionHero = data.collection?.hero_url ?? undefined;
    }
  } catch { /* fall through to placeholder */ }

  const productsForSection: IndividualCollectionProduct[] = cards.length > 0
    ? cards.map((c) => ({
        id: c.card_id,
        brand: c.brand?.name ?? "",
        name: c.name,
        retailPrice: formatPrice(c.retail_price_minor),
        rentPrice: !c.rent_price_minor ? "₹0 to try" : `₹${Math.round(c.rent_price_minor / 100).toLocaleString("en-IN")}`,
        image: c.thumbnail_url ?? PRODUCT_CARD_IMAGE,
        href: `/products/${c.product_id}${colourSlug(c) ? `?colour=${encodeURIComponent(colourSlug(c)!)}` : ""}`,
      }) as unknown as IndividualCollectionProduct)
    : Array.from({ length: 4 }, (_, i) => ({
        id: `placeholder-${i}`,
        brand: "",
        name: "",
        retailPrice: "",
        rentPrice: "",
        image: PRODUCT_CARD_IMAGE,
      }));

  // One editorial section per collection. Future: backend may expose look-keyed groupings.
  const sections = [
    {
      label: collectionName,
      mobileLabel: collectionName,
      layout: "image-left" as const,
      sectionImage: collectionHero ?? SECTION_EDITORIAL,
      products: productsForSection,
    },
  ];

  return (
    <>
      <Header />
      <div className="w-full bg-white">
        <IndividualCollectionLanding
          heroImage={collectionHero ?? COLLECTION_HERO_DESKTOP[slug] ?? "/images/individual_Collectionlanding/image 1356@4x.png"}
          heroImageMobile={COLLECTION_HERO_MOBILE[slug]}
          heroTitle={collectionName}
          heroSubtitle={COLLECTION_SUBTITLES[slug]}
          heroQuote={collectionDescription || "– Stylesupply Editorial"}
        />
      </div>
      <Footer />
    </>
  );
}
