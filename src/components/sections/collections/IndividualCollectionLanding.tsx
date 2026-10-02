"use client";

import Link from "next/link";
import Image from "next/image";
import SharedProductCard from "@/components/layout/ProductCard";
import type { HomeProduct } from "@/types/home";

// â"€â"€â"€ Image paths â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Desktop:
//   image 1356@4x.png        â†' hero background (warm editorial, woman on sofa)
//   Screen Shot...3.png      â†' section editorial image (tall dark-outfit model)
//   image 814.png            â†' product card image (beige vest model)
// Mobile (_M suffix):
//   image 1357_M.png         â†' mobile hero background
//   standing_m.png           â†' mobile section editorial image

const HERO_IMAGE_D    = "/images/individual_Collectionlanding/image 1356@4x.png";
const HERO_IMAGE_M    = "/images/individual_Collectionlanding/image 1357_M.png";
const SECTION_IMG_D   = "/images/individual_Collectionlanding/Screen Shot 2026-04-29 at 5.15.38 AM 3.png";
const SECTION_IMG_M   = "/images/individual_Collectionlanding/standing_m.png";
const PRODUCT_IMG     = "/images/individual_Collectionlanding/image 814.png";

// â"€â"€â"€ Types â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

export type IndividualCollectionProduct = {
  id: string;
  brand: string;
  name: string;
  retailPrice: string;
  rentPrice: string;
  image: string;
};

export type IndividualCollectionEdit = {
  title: string;
  slug: string;
  color: string;
};

export type IndividualCollectionSection = {
  label: string;
  mobileLabel?: string;
  layout: "image-left" | "image-center" | "image-right";
  sectionImage: string;
  sectionImageMobile?: string;
  products: IndividualCollectionProduct[];
};

export type IndividualCollectionLandingProps = {
  heroImage?: string;
  heroImageMobile?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroQuote?: string;
  sections?: IndividualCollectionSection[];
  otherEdits?: IndividualCollectionEdit[];
};

// â"€â"€â"€ Product Card â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function toHomeProduct(p: IndividualCollectionProduct): HomeProduct {
  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    image: p.image,
    originalPrice: p.retailPrice,
    currentPrice: p.rentPrice,
    href: `/products/${p.id}`,
  };
}

function ProductCard({ product, stretch }: { product: IndividualCollectionProduct; stretch?: boolean }) {
  if (!stretch) return <SharedProductCard product={toHomeProduct(product)} />;
  // In stretch mode the card fills its grid cell height; image takes all available space above the text block
  const hp = toHomeProduct(product);
  return (
    <Link href={hp.href} className="group flex h-full w-full flex-col font-[var(--font-manrope)]">
      <div className="relative flex-1 overflow-hidden bg-white pt-0">
        <Image src={hp.image || "/images/collection/Prod_image.png"} alt={`${hp.brand} ${hp.name}`} fill className="object-contain object-top" />
        <div className="absolute z-10 flex flex-col" style={{ bottom: "clamp(20px,2.5vw,36px)", right: "clamp(5px,0.90vw,13px)" }}>
          <span className="relative flex shrink-0 aspect-square w-[11.111vw] md:w-[6.510vw] lg:w-[3.472vw] items-center justify-center rounded-full bg-white">
            <Image src="/icon/favourite.svg" alt="" fill className="object-contain" />
          </span>
        </div>
      </div>
      <div className="pt-[15px]">
        <p className="text-[2.083vw] lg:text-[1.04vw] font-medium uppercase leading-normal tracking-[-0.02em] text-[#4E4E4E]">{hp.brand}</p>
        <p className="mt-[10px] md:mt-[0.911vw] lg:mt-[10px] text-[2.734vw] lg:text-[1.67vw] font-semibold capitalize leading-[1.05] tracking-[-0.04em] text-black">{hp.name}</p>
        {hp.originalPrice && (
          <p className="mt-[10px] md:mt-[0.911vw] lg:mt-[10px] leading-[1.1] text-[2.083vw] lg:text-[1.04vw] font-medium tracking-[-0.02em] text-black">
            {hp.originalPrice.startsWith("MRP") ? hp.originalPrice : `MRP ${hp.originalPrice}`}
          </p>
        )}
        <p className="mt-[5px] md:mt-[0.911vw] lg:mt-[5px] text-[2.083vw] lg:text-[1.04vw] font-medium leading-normal tracking-[-0.02em] text-[#4E4E4E]">{hp.currentPrice}</p>
      </div>
    </Link>
  );
}

// â"€â"€â"€ Mobile Section â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Mobile layout uses image-center ("City Chic") style for all section types:
//   Label centered, full-width editorial image, then 2Ã—2 product card grid
// 30px padding between sections (gap divider in parent)

function MobileSection({ section }: { section: IndividualCollectionSection }) {
  const [p1, p2, p3, p4] = section.products;
  const mobileImg = section.sectionImageMobile ?? SECTION_IMG_M;
  const label = section.mobileLabel ?? section.label;
  return (
    <div className="w-full">
      <h2 className="mb-[5.556vw] text-center font-[var(--font-manrope)] font-normal text-black text-[12.22vw] tracking-[-0.04em] leading-[1.2]">
        {label}
      </h2>

      <div className="mx-[2.78vw] overflow-hidden" style={{ height: "111.11vw" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mobileImg}
          alt={section.label}
          className="h-auto w-full object-cover object-top"
        />
      </div>

      <div className="mt-[5px] mx-[2.78vw] grid grid-cols-2 items-start gap-x-[0.83vw] gap-y-[4.44vw]">
        {[p1, p2, p3, p4].map((p, i) =>
          p ? <ProductCard key={p?.id ?? i} product={p} /> : null
        )}
      </div>
    </div>
  );
}

// â"€â"€â"€ Desktop Layout A: image LEFT (50%), 2Ã—2 grid RIGHT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function SectionImageLeft({ section }: { section: IndividualCollectionSection }) {
  const [p1, p2, p3, p4] = section.products;
  return (
    <div className="w-full px-[0.694vw]">
      <h2 className="mb-[5.556vw] md:mb-[2.604vw] lg:mb-[3.472vw] font-[var(--font-manrope)] font-normal text-black text-[5.859vw] lg:text-[5.139vw] tracking-[-0.04em] leading-[1.2]">
        {section.label}
      </h2>
      <div className="flex items-stretch gap-[5px]">
        <div className="relative shrink-0 overflow-hidden" style={{ width: "48.611vw" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.sectionImage} alt={section.label}
            className="h-full w-full object-cover object-top" />
        </div>
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-x-[5px] gap-y-[20px]">
          {[p1, p2, p3, p4].map((p, i) =>
            p ? <ProductCard key={p?.id ?? i} product={p} stretch /> : null
          )}
        </div>
      </div>
    </div>
  );
}

// â"€â"€â"€ Desktop Layout B: 2 cards LEFT | image CENTER | 2 cards RIGHT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function SectionImageCenter({ section }: { section: IndividualCollectionSection }) {
  const [p1, p2, p3, p4] = section.products;
  return (
    <div className="w-full px-[0.694vw]">
      <h2 className="mb-[5.556vw] md:mb-[2.604vw] lg:mb-[3.472vw] text-center font-[var(--font-manrope)] font-normal text-black text-[5.859vw] lg:text-[5.139vw] tracking-[-0.04em] leading-[1.2]">
        {section.label}
      </h2>
      <div className="flex gap-[5px]">
        <div className="flex shrink-0 flex-col justify-between gap-[20px]" style={{ width: "24.444vw" }}>
          {[p1, p2].map((p, i) => p ? <ProductCard key={p?.id ?? i} product={p} stretch /> : null)}
        </div>
        <div className="relative flex-1 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.sectionImage} alt={section.label}
            className="h-full w-full object-cover object-top" />
        </div>
        <div className="flex shrink-0 flex-col justify-between gap-[20px]" style={{ width: "24.444vw" }}>
          {[p3, p4].map((p, i) => p ? <ProductCard key={p?.id ?? i} product={p} stretch /> : null)}
        </div>
      </div>
    </div>
  );
}

// â"€â"€â"€ Desktop Layout C: 2Ã—2 grid LEFT | image RIGHT â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function SectionImageRight({ section }: { section: IndividualCollectionSection }) {
  const [p1, p2, p3, p4] = section.products;
  return (
    <div className="w-full px-[0.694vw]">
      <h2 className="mb-[5.556vw] md:mb-[2.604vw] lg:mb-[3.472vw] font-[var(--font-manrope)] font-normal text-black text-[5.859vw] lg:text-[5.139vw] tracking-[-0.04em] leading-[1.2]">
        {section.label}
      </h2>
      <div className="flex items-stretch gap-[5px]">
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-x-[5px] gap-y-[20px]">
          {[p1, p2, p3, p4].map((p, i) =>
            p ? <ProductCard key={p?.id ?? i} product={p} stretch /> : null
          )}
        </div>
        <div className="relative shrink-0 overflow-hidden" style={{ width: "48.611vw" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.sectionImage} alt={section.label}
            className="h-full w-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

// â"€â"€â"€ Section dispatcher (desktop) / MobileSection (mobile) â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function CollectionSection({ section }: { section: IndividualCollectionSection }) {
  return (
    <>
      <div className="md:hidden">
        <MobileSection section={section} />
      </div>
      <div className="hidden md:block">
        {section.layout === "image-left"   && <SectionImageLeft   section={section} />}
        {section.layout === "image-center" && <SectionImageCenter section={section} />}
        {section.layout === "image-right"  && <SectionImageRight  section={section} />}
      </div>
    </>
  );
}

// â"€â"€â"€ Other Edits â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Desktop: two side-by-side cards 690Ã—705px, title centered at 42%, Discover 180Ã—80px â†' 12.5Ã—5.556vw @1440
// Mobile:  two stacked full-width cards 340Ã—340px, title 34px=9.44vw, Discover 140Ã—60px â†' 38.889Ã—16.667vw @360

function OtherEdits({ edits }: { edits: IndividualCollectionEdit[] }) {
  return (
    <section className="w-full px-[10px]">
      {/* Heading */}
      <h2 className="text-center font-[var(--font-manrope)] font-normal text-black text-[9.44vw] tracking-[-0.04em] leading-[1.2] mb-[8.333vw] md:text-[5.859vw] md:mb-[3.906vw] lg:text-[5.139vw] lg:mb-[2.778vw]">
        Other Edits
      </h2>

      {/* Mobile: stacked square cards; Desktop: flex row; 5px gap all breakpoints */}
      <div className="flex flex-col gap-[5px] md:flex-row md:gap-[5px]">
        {edits.map((edit) => (
          <Link
            key={edit.slug}
            href={`/collections/${edit.slug}`}
            className="relative w-full overflow-hidden md:flex-1"
            style={{ backgroundColor: edit.color }}
          >
            <div className="aspect-square w-full md:hidden" />
            <div className="hidden md:block md:aspect-[690/705] md:w-full" />

            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-[var(--font-manrope)] font-normal text-white text-[9.44vw] tracking-[-0.04em] leading-[1.2] md:top-[42%] md:text-[5.859vw] lg:text-[4.444vw]">
              {edit.title}
            </span>

            <span className="absolute bottom-[8.33vw] left-1/2 inline-flex h-[16.667vw] w-[38.889vw] -translate-x-1/2 items-center justify-center rounded-full border border-white font-[var(--font-manrope)] font-medium text-[3.89vw] text-white tracking-[-0.04em] md:bottom-[5.556vw] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]">
              Discover
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// â"€â"€â"€ Brands to Discover â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function BrandsToDiscover() {
  return (
    <section className="flex flex-col items-center px-[5.56vw] pb-0 text-center md:px-0">
      <h2 className="m-0 font-[var(--font-manrope)] font-normal text-[9.444vw] leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
        Brands to Discover
      </h2>
      <p className="m-0 mt-[4.167vw] font-[var(--font-manrope)] text-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black md:hidden">
        An eclectic mix of home-grown and<br />
        international brands for the intentional<br />
        shopper.
      </p>
      <p className="m-0 mt-[4.167vw] hidden font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.02em] text-black md:mt-[2.083vw] md:block md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[max(18px,1.389vw)]">
        An eclectic mix of home-grown and international<br />
        brands for the intentional shopper.
      </p>
      <div className="mt-[11.111vw] flex gap-[2.78vw] md:mt-[5.208vw] lg:mt-[2.778vw] md:gap-[0.694vw]">
        <Link
          href="/brands"
          className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border border-[#7a021d] font-[var(--font-manrope)] font-medium text-[3.889vw] text-[#7a021d] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse Brands
        </Link>
        <Link
          href="/products"
          className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full bg-[#7a021d] font-[var(--font-manrope)] font-medium text-[3.889vw] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse All
        </Link>
      </div>
    </section>
  );
}

// â"€â"€â"€ Default data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const DEFAULT_PRODUCTS: IndividualCollectionProduct[] = Array.from({ length: 4 }, (_, i) => ({
  id: `default-${i}`,
  brand: "TWO EXTRA LIVES",
  name: "Baobab Dress",
  retailPrice: "MRP ₹50,000",
  rentPrice: "₹0 to try",
  image: PRODUCT_IMG,
}));

const DEFAULT_SECTIONS: IndividualCollectionSection[] = [
  { label: "Off-Duty Classic", mobileLabel: "City Chic", layout: "image-left",   sectionImage: SECTION_IMG_D, sectionImageMobile: SECTION_IMG_M, products: DEFAULT_PRODUCTS },
  { label: "City Chic",        mobileLabel: "City Chic", layout: "image-center", sectionImage: SECTION_IMG_D, sectionImageMobile: SECTION_IMG_M, products: DEFAULT_PRODUCTS },
  { label: "Off-Duty Classic", mobileLabel: "City Chic", layout: "image-right",  sectionImage: SECTION_IMG_D, sectionImageMobile: SECTION_IMG_M, products: DEFAULT_PRODUCTS },
  { label: "City Chic",        mobileLabel: "City Chic", layout: "image-center", sectionImage: SECTION_IMG_D, sectionImageMobile: SECTION_IMG_M, products: DEFAULT_PRODUCTS },
  { label: "Off-Duty Classic", mobileLabel: "City Chic", layout: "image-left",   sectionImage: SECTION_IMG_D, sectionImageMobile: SECTION_IMG_M, products: DEFAULT_PRODUCTS },
  { label: "Off-Duty Classic", mobileLabel: "City Chic", layout: "image-right",  sectionImage: SECTION_IMG_D, sectionImageMobile: SECTION_IMG_M, products: DEFAULT_PRODUCTS },
];

const DEFAULT_EDITS: IndividualCollectionEdit[] = [
  { title: "Everyday Icons",  slug: "everyday-icons",  color: "#7a021d" },
  { title: "Daytime Soiree", slug: "daytime-soiree",  color: "#000000" },
];

// â"€â"€â"€ Main Component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

export default function IndividualCollectionLanding({
  heroImage        = HERO_IMAGE_D,
  heroImageMobile  = HERO_IMAGE_M,
  heroTitle        = "Everyday Icons",
  heroSubtitle,
  heroQuote        = `Pieces meant to move between boardroom and gallery opening. Pieces meant to move between boardroom and gallery opening.\n- Stylesupply Editorial`,
  sections         = DEFAULT_SECTIONS,
  otherEdits       = DEFAULT_EDITS,
}: IndividualCollectionLandingProps) {
  return (
    <main className="flex w-full flex-col overflow-x-hidden bg-white">


      <section className="relative w-full overflow-hidden md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImageMobile}
          alt={heroTitle}
          className="w-full h-auto object-cover object-top"
        />
        {/* Text: left=19px=5.28vw, top=62.46% of container */}
        <div className="absolute flex flex-col gap-[2.78vw] text-white"
          style={{ left: "5.28vw", top: "62.46%" }}>
          <p className="whitespace-nowrap font-[var(--font-manrope)] font-normal text-[11.11vw] leading-[1.2] tracking-[-0.04em]">
            {heroTitle}
          </p>
          {heroSubtitle && (
            <p className="font-[var(--font-manrope)] font-medium text-[3.889vw] leading-[1.4] tracking-[-0.02em]">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="relative hidden w-full overflow-hidden md:block"
        style={{ height: "34.722vw" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={heroTitle}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        {/* Text: left=30px=2.083vw, top=3.472vw, width=439px=30.486vw */}
        <div className="absolute flex flex-col gap-[1.389vw] text-white"
          style={{ left: "2.083vw", top: "3.472vw" }}>
          <p className="font-[var(--font-manrope)] font-normal text-[5.859vw] lg:text-[5.833vw] leading-[1.2] tracking-[-0.04em] whitespace-nowrap">
            {heroTitle}
          </p>
          {heroSubtitle && (
            <p className="font-[var(--font-manrope)] font-medium text-[1.823vw] lg:text-[1.389vw] leading-[1.4] tracking-[-0.02em]">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <div className="h-[11.111vw] w-full shrink-0 md:h-[5.208vw] lg:h-[2.083vw]" aria-hidden />


      <div className="md:hidden flex flex-col gap-[11.111vw]">
        {sections.slice(0, 3).map((section, index) => (
          <MobileSection key={index} section={section} />
        ))}
      </div>

      {/* Desktop: all sections, 40px gap (2.778vw @ 1440) between them */}
      <div className="hidden md:flex md:flex-col md:gap-[5.208vw] lg:gap-[7.639vw]">
        {sections.map((section, index) => (
          <div key={index}>
            {section.layout === "image-left"   && <SectionImageLeft   section={section} />}
            {section.layout === "image-center" && <SectionImageCenter section={section} />}
            {section.layout === "image-right"  && <SectionImageRight  section={section} />}
          </div>
        ))}
      </div>

      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
      <OtherEdits edits={otherEdits} />

      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
      <BrandsToDiscover />
      <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />

    </main>
  );
}
