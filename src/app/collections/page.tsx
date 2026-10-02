import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CollectionsLandingHero, CollectionLandingRow, CollectionsMoreToDiscover } from "@/components/sections";
import { TEMP_COLLECTIONS, COLLECTIONS_LANDING_ASSETS } from "@/components/sections/collections/collectionsLandingData";

const LANDING_COPY = [
  { title: "Everyday Icons",   subtitle: "The ease of good taste." },
  { title: "Daytime Soirée",   subtitle: "For sunlit jest and golden-hour arrivals." },
  { title: "After Hours",      subtitle: "Where the night begins." },
];

export const metadata: Metadata = {
  title: "Explore Collections - StyleSupply",
  description:
    "Explore curated collections on StyleSupply — from everyday essentials to vacation and wedding looks.",
  alternates: { canonical: "https://stylesupply.io/collections" },
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function formatPrice(minor: number): string {
  const rupees = Math.round(minor / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

type ApiProduct = {
  id: string;
  name: string;
  brand: { name: string } | null;
  retail_price_minor: number;
  rent_price_minor: number | null;
  thumbnail_url: string | null;
};

type ApiCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_url: string | null;
  products: ApiProduct[];
};

type CollectionForUI = {
  id: string;
  name: string;
  slug: string;
  hero_url: string | null;
  hero_url_mobile?: string;
  products: { id: string; brand: string; name: string; retailPrice: string; rentPrice: string; image: string }[];
};

async function getCollections(): Promise<CollectionForUI[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/collections`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.collections ?? []) as ApiCollection[]).map((col) => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      hero_url: col.hero_url,
      products: col.products.map((p) => ({
        id: p.id,
        brand: p.brand?.name ?? "Unknown",
        name: p.name,
        retailPrice: formatPrice(p.retail_price_minor),
        rentPrice:
          p.rent_price_minor != null && p.rent_price_minor > 0
            ? formatPrice(p.rent_price_minor)
            : "₹0 to try",
        image: p.thumbnail_url ?? "/images/collection/Prod_image.png",
      })),
    }));
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();
  const collectionsForView = collections.length > 0 ? collections : TEMP_COLLECTIONS;

  return (
    <>
      <Header />
      <main className="flex w-full flex-col overflow-x-hidden bg-white">
        <CollectionsLandingHero />
        <div className="flex flex-col gap-[11.111vw] md:gap-[6.51vw] lg:gap-[3.472vw]">
          {collectionsForView.map((col, i) => (
            <CollectionLandingRow
              key={col.id}
              title={LANDING_COPY[i]?.title ?? col.name}
              subtitle={LANDING_COPY[i]?.subtitle}
              heroImage={col.hero_url || COLLECTIONS_LANDING_ASSETS.heroImage}
              heroImageMobile={col.hero_url_mobile}
              products={col.products}
              href={`/collections/${col.slug}`}
            />
          ))}
        </div>
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <CollectionsMoreToDiscover />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
      </main>
      <Footer />
    </>
  );
}
