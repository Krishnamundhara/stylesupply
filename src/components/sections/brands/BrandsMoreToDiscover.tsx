import Link from "next/link";

export default function BrandsMoreToDiscover() {
  return (
    <section className="flex w-full flex-col items-center px-[20px] text-center">
      <h2 className="whitespace-nowrap font-[var(--font-manrope)] text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
        More to Discover
      </h2>
      <p className="mt-[4.167vw] w-full font-[var(--font-manrope)] text-[4.167vw] font-medium leading-[1.4] tracking-[-0.04em] text-black md:mt-[2.083vw] md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[max(18px,1.389vw)]">
        There&apos;s more waiting in the wardrobe.
        <br />
        Browse every brand and edit available to you.
      </p>
      <div className="mt-[11.111vw] flex items-center justify-center gap-[10px] md:mt-[5.208vw] lg:mt-[2.778vw]">
        <Link
          href="/collections"
          className="flex items-center justify-center rounded-full border border-[#7A021D] font-[var(--font-manrope)] font-medium tracking-[-0.04em] text-[#7A021D] w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[13.889vw] lg:h-[5.556vw] lg:text-[1.389vw]"
        >
          Browse Collections
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center rounded-full bg-[#7A021D] font-[var(--font-manrope)] font-medium tracking-[-0.04em] text-white w-[38.889vw] h-[16.667vw] text-[3.889vw] md:w-[20.833vw] md:h-[7.813vw] md:text-[1.823vw] lg:w-[13.889vw] lg:h-[5.556vw] lg:text-[1.389vw]"
        >
          Browse All
        </Link>
      </div>
    </section>
  );
}
