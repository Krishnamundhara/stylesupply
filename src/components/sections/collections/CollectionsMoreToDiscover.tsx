import Link from "next/link";

export default function CollectionsMoreToDiscover() {
  return (
    <section className="flex w-full flex-col items-center px-[20px] text-center">
      <h2 className="m-0 font-[var(--font-manrope)] text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
        Not Done Yet?
      </h2>
      <p className="m-0 mt-[4.167vw] w-full font-[var(--font-manrope)] text-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black md:mt-[2.083vw] md:text-[2.344vw] lg:mt-[1.389vw] lg:text-[max(18px,1.389vw)]">
        Step into the full wardrobe and discover<br />
         more styles to add to your box.
      </p>

      <div className="mt-[11.111vw] flex flex-wrap items-center justify-center gap-[10px] md:mt-[5.208vw] lg:mt-[2.778vw]">
        <Link
          href="/brands"
          className="inline-flex items-center justify-center rounded-full border border-[#7a021d] font-[var(--font-manrope)] font-medium text-[#7a021d]
            h-[16.667vw] w-[38.889vw] text-[3.889vw]
            md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw]
            lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse Brands
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-[#7a021d] font-[var(--font-manrope)] font-medium text-[#f7f4ef]
            h-[16.667vw] w-[38.889vw] text-[3.889vw]
            md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw]
            lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse All
        </Link>
      </div>
    </section>
  );
}
