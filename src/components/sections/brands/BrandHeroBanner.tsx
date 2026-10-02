import Image from "next/image";

/*
 * Figma mobile (360px) node 2050:7765 — Frame: w=360 h=530
 *   Image: hero_M.png, fills frame
 *   Text block node 2050:7769: top=14px left=21.76px w=254px gap=15px
 *   Brand name node 2050:7770: 60px Regular lh=1.2 tracking=-2.4px
 *   Quote node 2050:7771: 16px SemiBold lh=25px tracking=-0.32px w=260px
 *
 * Figma desktop (1440px): Frame h=580
 *   Image: image 1356@4x.png (or heroUrl from API)
 *   Text block: top=50px left=30px w=439px gap=20px
 *   Brand name: 84px Regular lh=1.2 tracking=-3.36px
 *   Quote: 20px SemiBold lh=30px tracking=-0.4px
 */

type BrandHeroBannerProps = {
  brandName: string;
  editorialQuote?: string;
  heroUrl?: string;
};

export default function BrandHeroBanner({
  brandName,
  editorialQuote = "Pieces meant to move between boardroom and gallery opening.",
  heroUrl,
}: BrandHeroBannerProps) {
  return (
    <section className="relative w-[100vw] overflow-hidden">
      {/* Desktop hero image — hidden below md */}
      <div className="relative hidden md:block w-full h-[28.2vw]">
        <Image
          src={heroUrl || "/images/individual_Brandlanding/image 1356@4x.png"}
          alt={`${brandName} campaign`}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Mobile hero image — hidden md and above */}
      <div className="relative block md:hidden w-full h-[103vw]">
        <Image
          src={heroUrl || "/images/individual_Brandlanding/hero_M.png"}
          alt={`${brandName} campaign`}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay — top-left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent" />

      {/*
       * Text block
       * Mobile:  top=14px left=21.76px w=254px gap=15px
       * Desktop: top=50px left=30px  w=439px gap=20px
       */}
      <div
        className="absolute flex flex-col"
        style={{
          top: "clamp(14px, 3.47vw, 50px)",
          left: "clamp(21px, 2.08vw, 30px)",
          width: "clamp(254px, 30.49vw, 439px)",
          gap: "clamp(15px, 1.39vw, 20px)",
        }}
      >
        {/* Brand name */}
        <h1
          className="font-[var(--font-manrope)] font-normal m-0 text-white leading-[1.2] text-[12.222vw] md:text-[5.859vw] lg:text-[5.13vw]"
        >
          {brandName}
        </h1>

      </div>
    </section>
  );
}
