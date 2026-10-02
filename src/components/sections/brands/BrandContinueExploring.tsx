import Link from "next/link";
import Image from "next/image";

/*
 * Figma mobile (360px) node 2050:7923:
 *   Heading: "Curated Designers" ~28px, centered
 *   Cards: 3 stacked, each w=339 h=339 (square), gap ~5px
 *   Discover pill: w=180 h=70 centered at bottom
 *   Explore Brands btn: w=180 h=80
 *
 * Figma desktop (1440px) node 2050:8586:
 *   Heading: "Continue Exploring" 74px, centered
 *   Cards: 3 side-by-side, aspect 466.67/488.86
 *   Discover: w 140→38.889vw / 180→12.5vw, Explore: w 160→44.444vw / 200→13.889vw; h 60/80 → 16.667/5.556vw; type 14/20px → 3.889/1.389vw
 */

type ExploreCard = {
  brandName: string;
  brandSlug: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  imageUrl?: string;
};

type BrandContinueExploringProps = {
  heading?: string;
  cards?: ExploreCard[];
};

const DEFAULT_CARDS: ExploreCard[] = [
  {
    brandName: "Brand 1",
    brandSlug: "brand-1",
    bgColor: "#7a021d",
    textColor: "#ffffff",
    borderColor: "#ffffff",
    imageUrl: "/images/individual_Brandlanding/Rectangle 19083.png",
  },
  {
    brandName: "Brand 2",
    brandSlug: "brand-2",
    bgColor: "#070705",
    textColor: "#ffffff",
    borderColor: "#ffffff",
    imageUrl: "/images/individual_Brandlanding/images (3) 2.png",
  },
  {
    brandName: "Brand 3",
    brandSlug: "brand-3",
    bgColor: "#fff9f9",
    textColor: "#7a021d",
    borderColor: "#7a021d",
    imageUrl: "/images/individual_Brandlanding/Rectangle 19083 (2).png",
  },
];

export default function BrandContinueExploring({
  heading,
  cards = DEFAULT_CARDS,
}: BrandContinueExploringProps) {
  return (
    <section className="w-full flex flex-col items-center gap-[clamp(30px,3.47vw,50px)]">

      {/* Heading — different text per breakpoint */}
      {/* Mobile: 34px Regular, tracking -1.36px. Desktop: 74px Regular, tracking -2.96px */}
      <h2 className="font-[var(--font-manrope)] font-normal text-black text-center m-0 leading-[1.2] tracking-[-0.04em] text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw]">
        <span className="md:hidden">{heading ?? "Curated Designers"}</span>
        <span className="hidden md:inline">Continue Exploring</span>
      </h2>

      {/* Cards row
       * Mobile: flex-col, each card is aspect-square
       * Desktop: flex-row, each card is aspect-[466.67/488.86]
       */}
      <div className="w-full flex flex-col md:flex-row gap-[5px]">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[4px] w-full aspect-square md:aspect-[466.67/488.86] flex-1"
            style={{ backgroundColor: card.bgColor }}
          >
            {card.imageUrl && (
              <Image
                src={card.imageUrl}
                alt={card.brandName}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 94vw, 33vw"
              />
            )}

            {/* Discover pill — centered horizontally, near bottom */}
            <div className="absolute bottom-[clamp(16px,1.67vw,24px)] inset-x-0 flex justify-center z-10">
              <Link
                href={`/brands/${card.brandSlug}`}
                className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full font-[var(--font-manrope)] text-[3.889vw] font-medium tracking-[-0.04em] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]"
                style={{
                  border: `1.6px solid ${card.borderColor}`,
                  color: card.textColor,
                }}
              >
                Discover
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Explore Brands — w 160@360 / 200@1440 in vw */}
      <Link
        href="/brands"
        className="flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7a021d] font-[var(--font-manrope)] text-[3.889vw] font-semibold tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
      >
        Explore Brands
      </Link>
    </section>
  );
}
