"use client";
import Link from "next/link";

interface CollectionHeroBannerProps {
  title: string;
  subtitle?: string;
  heroImage: string;
  heroImageMobile?: string;
  href?: string;
  btnLabel?: string;
}

export default function CollectionHeroBanner({
  title,
  subtitle,
  heroImage,
  heroImageMobile,
  href = "#",
  btnLabel = "View Collection",
}: CollectionHeroBannerProps) {
  return (
    <div className="relative w-full overflow-hidden" suppressHydrationWarning>
      <picture className="block w-full">
        {heroImageMobile && <source media="(max-width: 767px)" srcSet={heroImageMobile} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={title}
          className="h-auto w-full object-top"
        />
      </picture>

      {/* Title + subtitle — top-left overlay */}
      <div className="absolute left-[20px] top-[30px] flex flex-col gap-[10px] text-white md:left-[60px] md:top-[60px]">
        <h2 className="font-[var(--font-manrope)] text-[9.44vw] font-normal leading-[1.2] tracking-[-1.36px] md:text-[5.859vw] md:tracking-[-2.56px] lg:text-[4.44vw]">
          {title}
        </h2>
        {subtitle && (
          <p className="font-[var(--font-manrope)] text-[3.89vw] font-medium leading-[1.2] tracking-[-0.28px] md:text-[2.344vw] md:tracking-[-0.36px] lg:text-[1.25vw]">
            {subtitle}
          </p>
        )}
      </div>

      {/* "View Collection" button — bottom-right */}
      <Link
        href={href}
        suppressHydrationWarning
        className="absolute bottom-[20px] right-[20px] md:bottom-[40px] md:right-[40px] items-center justify-center rounded-full border border-white inline-flex h-[16.667vw] w-[38.889vw] text-[3.889vw] font-[var(--font-manrope)] font-medium text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] md:border-[1.6px] lg:h-[5.556vw] lg:w-[15.278vw] lg:text-[1.389vw] lg:bottom-[60px]"
      >
        {btnLabel}
      </Link>
    </div>
  );
}
