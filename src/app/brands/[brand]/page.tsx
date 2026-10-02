import { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  BrandHeroBanner,
  BrandProductSection,
  BrandAboutSection,
  BrandContinueExploring,
  BrandMoreForYou,
} from "@/components/sections";
import type { HomeProduct } from "@/types/home";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Props = {
  params: Promise<{ brand: string }>;
};

function formatPrice(minor: number): string {
  const rupees = Math.round(minor / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/brands/${slug}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: `${data.name} - StyleSupply`,
        description: data.description || `Explore ${data.name} collections on StyleSupply.`,
      };
    }
  } catch { /* fallback */ }
  const brandName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${brandName} - StyleSupply`,
    description: `Explore ${brandName} collections on StyleSupply.`,
  };
}

export default async function IndividualBrandPage({ params }: Props) {
  const { brand: slug } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let brandName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  let brandHeroUrl: string | undefined;
  let brandDescription: string | undefined;
  let brandLogoUrl: string | undefined;
  let brandLogoBgColor: string | undefined;
  let initialProducts: HomeProduct[] = [];
  let initialTotal = 0;

  try {
    const [brandRes, productsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/brands/${slug}`, { next: { revalidate: 60 } }),
      fetch(`${BACKEND_URL}/api/brands/${slug}/products?limit=20&offset=0`, {
        headers: { Cookie: cookieHeader },
        next: { revalidate: 60 },
      }),
    ]);

    if (brandRes.ok) {
      const brandData = await brandRes.json();
      brandName = brandData.name;
      brandHeroUrl = brandData.hero_url ?? undefined;
      brandDescription = brandData.description ?? undefined;
      brandLogoUrl = brandData.logo_url ?? undefined;
      brandLogoBgColor = brandData.brand_color ?? undefined;
    }

    if (productsRes.ok) {
      const prodData = (await productsRes.json()) as { cards?: Array<Record<string, unknown>>; total?: number };
      const cards = prodData.cards ?? [];
      initialProducts = cards.map((c) => {
        const brandObj = c.brand as { name?: string } | null;
        const colour = c.colour as { slug?: string } | null;
        const customColour = (c.custom_colour as string | null) ?? null;
        const colourSlug = colour?.slug ?? null;
        const slugForHref = colourSlug
          ? `?colour=${encodeURIComponent(colourSlug)}`
          : customColour
            ? `?colour=${encodeURIComponent(customColour.toLowerCase().trim().replace(/\s+/g, "-"))}`
            : "";
        const retail = c.retail_price_minor as number;
        const rent = c.rent_price_minor as number | null;
        return {
          id: c.card_id as string,
          productId: c.product_id as string,
          brand: brandObj?.name ?? brandName,
          name: c.name as string,
          image: (c.thumbnail_url as string) ?? "/images/individual_Brandlanding/image 814.png",
          originalPrice: formatPrice(retail),
          currentPrice: !rent ? "₹0 to try" : formatPrice(rent),
          href: `/products/${c.product_id as string}${slugForHref}`,
          badge: brandObj?.name ?? brandName,
          isSaved: Boolean(c.is_saved),
        };
      });
      initialTotal = prodData.total ?? 0;
    }
  } catch { /* proceed with defaults */ }

  return (
    <>
      <Header />
      <main className="w-full bg-white">

        {/* 1. Hero Banner — full bleed, no padding */}
        <BrandHeroBanner brandName={brandName} heroUrl={brandHeroUrl} />

        <div className="h-[30px] w-full bg-white" aria-hidden />

        {/* 2+3. Products bar + grid */}
        <BrandProductSection
          products={initialProducts}
          totalCount={initialTotal}
          brandSlug={slug}
          brandName={brandName}
        />

        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />

        {/* 4. About section — 10px side margins on all breakpoints */}
        <div className="px-[10px]">
          <BrandAboutSection
            brandName={brandName}
            description={brandDescription}
            logoUrl={brandLogoUrl}
            logoBgColor={brandLogoBgColor}
          />
        </div>

        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />

        {/* 5. Continue Exploring / Curated Designers — 10px side margins on all breakpoints */}
        <div className="px-[10px]">
          <BrandContinueExploring />
        </div>

        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />

        {/* 6. We've got more for you */}
        <BrandMoreForYou />

        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
      </main>
      <Footer />
    </>
  );
}
