import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Box from "@/components/layout/Box";
import { ProductHero, ProductReviews } from "@/components/sections";
import RecentlyViewed from "@/components/sections/products/RecentlyViewed";
import KeepExploring from "@/components/sections/products/KeepExploring";
import Link from "next/link";
import type { ProductHeroProps } from "@/components/sections/products/ProductHero";
import { getHomeData } from "@/services/home";
import { customColourSlug } from "@/lib/url";
import { formatRupees } from "@/lib/price";
import type { ProductDetail, ColourGroup, ProductImage } from "@/types/product";
import type { ProductReview } from "@/services/reviews";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function pickColourGroup(product: ProductDetail, colourParam?: string): ColourGroup | null {
  if (product.colours.length === 0) return null;
  if (!colourParam) return product.colours[0];
  return (
    product.colours.find((g) => {
      if (g.hex) return g.slug === colourParam;
      return customColourSlug(g.custom_colour ?? g.name) === colourParam;
    }) ?? product.colours[0]
  );
}

async function getProduct(id: string, cookieHeader: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ProductDetail;
  } catch {
    return null;
  }
}

async function getReviews(id: string): Promise<ProductReview[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reviews/product/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const body = (await res.json()) as { reviews?: ProductReview[] };
    return body.reviews ?? [];
  } catch {
    return [];
  }
}

export default async function ProductDescriptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ stock?: string; colour?: string }>;
}) {
  const { id } = await params;
  const { stock, colour } = await searchParams;
  const isOutOfStock = stock === "out";
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const [product, homeData] = await Promise.all([
    getProduct(id, cookieHeader),
    getHomeData(),
  ]);
  const reviews = product ? await getReviews(product.id) : [];

  const activeColour = product ? pickColourGroup(product, colour) : null;
  const galleryImages: ProductImage[] = activeColour
    ? activeColour.images.length > 0
      ? activeColour.images
      : product!.shared_images
    : [];

  const sizeOptions = activeColour
    ? [...activeColour.available_sizes, ...activeColour.unavailable_sizes]
    : [];
  const defaultSize =
    activeColour?.available_sizes[0] ?? sizeOptions[0] ?? "M";

  const activeSlug = activeColour
    ? activeColour.hex
      ? activeColour.slug
      : customColourSlug(activeColour.custom_colour ?? activeColour.name)
    : "";

  const heroProps: ProductHeroProps = product
    ? {
        brand: product.brand?.name ?? "",
        brandAboutHref: product.brand?.slug ? `/brands/${product.brand.slug}` : "/brands",
        title: product.name,
        displayPrice: `MRP ${formatRupees(product.retail_price_minor)}`,
        images:
          galleryImages.length > 0
            ? galleryImages.map((img) => ({
                id: img.id,
                src: img.public_url,
                alt: img.alt ?? product.name,
              }))
            : [
                {
                  id: "placeholder",
                  src: "/images/Product_des/pexels-andrea-yurko-364018-982585-removebg-preview 1@4x.webp",
                  alt: product.name,
                },
              ],
        sizeOptions,
        unavailableSizes: activeColour?.unavailable_sizes ?? [],
        defaultSize,
        accordionItems: [
          {
            key: "description",
            title: "Description",
            content:
              product.description ??
              "Turn every moment into a statement.\n\nCrafted for comfort and confidence, this piece blends modern minimalism with timeless sophistication.",
          },
        ],
        productId: product.id,
        variantId: activeColour?.size_to_variant_id[defaultSize],
        variantIdsBySize: activeColour?.size_to_variant_id ?? {},
        retailPriceMinor: product.retail_price_minor,
        currency: product.currency ?? "INR",
        thumbnailUrl: galleryImages[0]?.public_url ?? null,
        colours: product.colours,
        activeColourSlug: activeSlug,
        isSaved: product.is_saved ?? false,
      }
    : {};

  const browseAllCta = (
    <Link
      href="/products"
      className="flex items-center justify-center bg-[#7a021d] text-white font-medium rounded-full
        h-[16.667vw] w-[44.444vw] text-[16px] tracking-[-0.04em]
        md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw]
        lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
    >
      Browse All
    </Link>
  );

  return (
    <>
      <Header />
      <main className="flex flex-col bg-white">
        <ProductHero key={`${id}-${activeSlug}`} {...heroProps} isOutOfStock={isOutOfStock} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <ProductReviews reviews={reviews} />
        {/* <RecentlyViewed styleWithCta={browseAllCta} /> */}
        <Box data={homeData.curateYourBox} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <KeepExploring />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
      </main>
      <Footer />
    </>
  );
}
