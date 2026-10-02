import Image from "next/image";

/*
 * Mobile (360px → vw):
 *   Gap after logo square: 60px → 16.667vw
 *   Title "About X": 34px → 9.444vw, centered
 *   Title → body: 30px → 8.333vw
 *   Body: 15px → 4.167vw, centered
 *   Section bottom (before next block): 60px → 16.667vw (desktop uses page spacer)
 *
 * Desktop (1440px):
 *   Square: 440×440, side-by-side; title ~74px (5.139vw), body 20px (1.389vw), left-aligned
 */

const FALLBACK_BG = "#abaa8b";

type BrandAboutSectionProps = {
  brandName: string;
  description?: string;
  logoUrl?: string;
  logoBgColor?: string;
};

const DEFAULT_PARAGRAPHS = [
  "You know your style the best, and we curated collections to help you experiment.",
  "You know your style the best, and we curated collections to help you experiment. You know your style the best, and we curated collections to help you experiment. You know your style the best, and we curated collections to help you experiment.",
  "Founded in xyz at abc by yadayada",
];

export default function BrandAboutSection({
  brandName,
  description,
  logoUrl,
  logoBgColor = FALLBACK_BG,
}: BrandAboutSectionProps) {
  // Split API description on double newlines, or fall back to default paragraphs
  const paragraphs: string[] = description
    ? description.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : DEFAULT_PARAGRAPHS;

  return (
    <section className="flex w-full flex-col items-start gap-[16.667vw] md:flex-row md:gap-[clamp(20px,2.78vw,40px)]">

      {/* Brand color square
       * Mobile: full width, aspect-square
       * Desktop: fixed 440×440, shrink-0
       */}
      <div
        className="relative w-full aspect-square md:w-[39.063vw] md:h-[39.063vw] md:aspect-auto lg:w-[440px] lg:h-[440px] shrink-0 rounded-[4px] overflow-hidden"
        style={{ backgroundColor: logoBgColor }}
      >
        <Image
          src={logoUrl || "/images/individual_Brandlanding/image 3101.png"}
          alt={`${brandName} logo`}
          fill
          className="object-contain p-[18%]"
          sizes="(max-width: 1024px) 94vw, 440px"
        />
      </div>

      {/* Text block — mobile: vw rhythm per spec; desktop: larger type, left-aligned */}
      <div className="flex w-full flex-col gap-[8.333vw] md:flex-1 md:gap-[28px] md:pt-[clamp(0px,3.61vw,52px)]">
        <h2
          className="m-0 text-center font-[var(--font-manrope)] text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-left md:text-[4.427vw] lg:text-[5.139vw]"
        >
          About {brandName}
        </h2>

        {/* Body — each paragraph separated by visible gap, centered mobile / left desktop */}
        <div
          className="flex flex-col gap-[14px] text-center font-[var(--font-manrope)] text-[4.167vw] font-medium leading-[1.4] tracking-[-0.04em] text-black md:gap-[20px] md:text-left md:text-[1.823vw] lg:text-[1.389vw]"
        >
          {paragraphs.map((para, i) => (
            <p key={i} className="m-0">{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
