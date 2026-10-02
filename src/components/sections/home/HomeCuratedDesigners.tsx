import Image from "next/image";
import Link from "next/link";
import type { HomeEditorialsSection } from "@/types/home";

interface Props {
  data: HomeEditorialsSection;
}

const BRAND_IMAGES = [
  "/images/home/brand1.webp",
  "/images/home/brand3.webp",
  "/images/home/brand2.webp",
  "/images/home/brand4.webp",
  "/images/home/brand5.webp",
  "/images/home/brand6.webp",
] as const;

function DiscoverButton({ href, red = false }: { href: string; red?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full
        border text-[3.889vw] font-medium tracking-[-0.04em]
        md:h-[7.813vw] md:w-[18.229vw] md:text-[1.823vw]
        lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]
        ${red ? "border-[#7A021D] text-[#7A021D]" : "border-white text-white"}`}
    >
      Discover
    </Link>
  );
}

function BrandTile({
  href,
  imgSrc,
  redCta = false,
  mobile = false,
}: {
  href: string;
  imgSrc: string;
  redCta?: boolean;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        className="relative flex aspect-[167/176] w-full overflow-hidden"
      >
        <Image src={imgSrc} alt="Brand" fill className="object-cover" sizes="50vw" />
      </Link>
    );
  }

  return (
    <Link href={href} className="relative flex aspect-[466/488] w-full flex-col items-center justify-end overflow-hidden pb-[clamp(20px,5.55vw,33px)]">
      <Image src={imgSrc} alt="Brand" fill className="object-cover" sizes="33vw" />
      <div className="relative z-10 hidden lg:flex items-center justify-center">
        <span className={`flex h-[5.556vw] w-[12.5vw] items-center justify-center rounded-full border text-[1.389vw] font-medium tracking-[-0.04em] ${redCta ? "border-[#7A021D] text-[#7A021D]" : "border-white text-white"}`}>
          Discover
        </span>
      </div>
    </Link>
  );
}

function ExploreBrandsButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7A021D]
        text-[3.889vw] font-medium tracking-[-0.04em] text-[#F7F4EF]
        md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw]
        lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
    >
      {label}
    </Link>
  );
}

export default function HomeCuratedDesigners({ data }: Props) {
  const fallback = data.viewAllHref ?? "/brands";
  const RED_CTA_INDICES = [1, 3, 5];
  const tiles = data.brands.map((b, i) => ({
    href: b.href ?? fallback,
    img: BRAND_IMAGES[i] ?? "",
    redCta: RED_CTA_INDICES.includes(i),
  }));

  return (
    <section className="w-full font-[var(--font-manrope)]">
      <div className="mx-auto w-full">
        <h2 className="text-center text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] md:leading-[1.05] lg:text-[5.139vw]">
          {data.title}
        </h2>

        {/* Mobile grid */}
        <div className="mt-[40px] grid w-full grid-cols-2 gap-[5px] px-[10px] md:hidden">
          {tiles.map(({ href, img, redCta }) => (
            <BrandTile key={href} mobile href={href} imgSrc={img} redCta={redCta} />
          ))}
        </div>

        {/* Desktop grid */}
        <div className="mt-[40px] hidden w-full px-[10px] md:grid md:grid-cols-3 md:gap-[5px]">
          {tiles.map(({ href, img, redCta }) => (
            <BrandTile key={href} href={href} imgSrc={img} redCta={redCta} />
          ))}
        </div>

        {data.viewAllHref && data.viewAllLabel ? (
          <div className="mt-[8.333vw] md:mt-[3.906vw] lg:mt-[2.778vw] flex justify-center">
            <ExploreBrandsButton href={data.viewAllHref} label={data.viewAllLabel} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
