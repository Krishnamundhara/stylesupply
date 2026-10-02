"use client";

import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/types/brand";

const LOCAL_HERO_BG = "/images/Brands/Rectangle%20994.png";
const LOCAL_MODEL = "/images/Brands/image-removebg-preview.png";
const LOCAL_SPLIT_BG = "/images/Brands/Rectangle%2019490.png";

function prepareBrands(input: Brand[]): Brand[] {
  const sorted = [...input].sort((a, b) => a.sort_order - b.sort_order);
  if (sorted.length >= 6) return sorted;

  const seed = sorted.length > 0 ? sorted : [{
    id: "seed", name: "Two Extra Lives", slug: "brand",
    hero_url: null, logo_url: null, description: null,
    tile_variant: "image", sort_order: 1,
  }];

  const padded = [...seed];
  while (padded.length < 6) {
    const src = seed[padded.length % seed.length];
    padded.push({ ...src, id: `${src.id}-${padded.length}`, slug: `${src.slug}-${padded.length}`, sort_order: padded.length + 1 });
  }
  return padded;
}

function DiscoverButton({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full font-[var(--font-manrope)] font-medium tracking-[-0.04em] border
        h-[16.667vw] w-[38.889vw] text-[3.889vw]
        md:h-[7.813vw] md:w-[18.229vw] md:text-[1.823vw]
        lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]
        ${dark ? "border-white text-white" : "border-[#7A021D] text-[#7A021D]"}`}
      style={{ lineHeight: 1.2 }}
    >
      Discover
    </span>
  );
}

function FullBleedCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`} className="relative block h-[94.444vw] w-full overflow-hidden md:aspect-[1420/726] md:h-auto">
      <Image src={LOCAL_HERO_BG} alt={brand.name} fill className="object-cover" sizes="100vw" priority />
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0">
        <h2 className="absolute left-[15px] top-[20px] whitespace-nowrap font-[var(--font-manrope)] text-[8.333vw] font-normal leading-[1.1] tracking-[-0.04em] text-white md:left-[40px] md:top-[51.5px] md:text-[5.859vw] lg:text-[4.444vw]">
          {brand.name}
        </h2>
        <div className="pointer-events-none absolute bottom-0 left-[32.222vw] h-[94.444vw] w-[61.111vw] md:left-[37.083vw] md:h-[44.375vw] md:w-[34.514vw]">
          <Image src={LOCAL_MODEL} alt="" fill className="object-contain object-bottom" sizes="35vw" />
        </div>
        <div className="absolute bottom-[20px] right-[20px] hidden md:block md:bottom-[28px] md:right-[32px]">
          <DiscoverButton dark />
        </div>
      </div>
    </Link>
  );
}

function HalfCard({ brand, left }: { brand: Brand; left: boolean }) {
  return (
    <Link href={`/brands/${brand.slug}`} className="relative block h-[46.568vw] w-full overflow-hidden md:aspect-square md:h-auto">
      <Image src={LOCAL_SPLIT_BG} alt={brand.name} fill className="object-cover" sizes="50vw" />
      <div className="absolute inset-0 bg-black/20" />
      <h3 className="absolute left-[15px] top-[14.38px] w-[calc(100%-30px)] font-[var(--font-manrope)] text-[8.333vw] font-normal leading-[1.2] tracking-[-0.04em] text-white md:left-[40px] md:top-[50px] md:w-auto md:whitespace-nowrap md:text-[5.859vw] lg:text-[4.444vw]">
        {brand.name}
      </h3>
      <div className={`absolute bottom-[14.06px] hidden md:block md:bottom-[39px] ${left ? "right-[14.06px] md:right-[39px]" : "right-[11.79px] md:right-[40px]"}`}>
        <DiscoverButton dark />
      </div>
    </Link>
  );
}

export default function BrandsPageGrid({ brands = [] }: { brands?: Brand[] }) {
  const [b1, b2, b3, b4, b5, b6] = prepareBrands(brands).slice(0, 6);

  return (
    <section className="w-full bg-white">
      <h1
        className="py-[8.333vw] text-center whitespace-nowrap font-[var(--font-manrope)] text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:py-[3.906vw] md:text-[5.859vw] lg:py-[4.861vw] lg:text-[5.139vw]"
      >
        Explore Brands
      </h1>

      <div className="flex flex-col gap-[1.389vw] md:gap-[0.651vw] lg:gap-[0.347vw] px-[10px] py-[5px]">
        <FullBleedCard brand={b1} />
        <div className="grid grid-cols-2 gap-[1.389vw] md:gap-[0.651vw] lg:gap-[0.347vw]">
          <HalfCard brand={b2} left />
          <HalfCard brand={b3} left={false} />
        </div>
        <FullBleedCard brand={b4} />
        <div className="grid grid-cols-2 gap-[1.389vw] md:gap-[0.651vw] lg:gap-[0.347vw]">
          <HalfCard brand={b5} left />
          <HalfCard brand={b6} left={false} />
        </div>
      </div>
    </section>
  );
}
