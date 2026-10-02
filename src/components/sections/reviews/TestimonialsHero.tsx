import Link from "next/link";

export default function TestimonialsHero() {
  return (
    <section className="flex flex-col items-center gap-[30px] lg:gap-10 pt-6 lg:pt-14 px-5 lg:px-[45px] text-center">
      <h1 className="font-[var(--font-manrope)] font-medium text-[32px] lg:text-[74px] leading-[1.2] lg:leading-[1.1] tracking-[-0.06em] text-[#000000] max-w-[320px] lg:max-w-[740px]">
        See why we&apos;re rated #1 in rental fashion.
      </h1>
      <div className="flex items-center gap-[12px] lg:gap-[10px]">
        <Link
          href="/about"
          className="flex items-center justify-center h-[47px] lg:h-[60px] px-[24px] lg:px-[32px] rounded-[14px] lg:rounded-full bg-[#F7FAFF] font-[var(--font-manrope)] font-normal lg:font-semibold text-[14px] lg:text-[16px] text-[#7A021D] tracking-[-0.04em]"
        >
          About Us
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center h-[47px] lg:h-[60px] px-[24px] lg:px-[32px] rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-normal lg:font-semibold text-[14px] lg:text-[16px] text-white tracking-[-0.04em]"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}
