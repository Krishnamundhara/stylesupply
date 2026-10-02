import Link from "next/link";

/*
 * Pre-footer block (same rhythm as More to Discover / Not Done Yet):
 * pt 60/80 → 16.667vw / md:5.556vw; title 34/74 → 9.444vw / md:5.139vw;
 * after title 15/20 → mt 4.167vw / md:1.389vw; body 15/20 medium → 4.167vw / md:1.389vw;
 * before CTA 40 → 11.111vw / md:2.778vw. Bottom spacing: parent page spacer.
 */

type BrandMoreForYouProps = {
  heading?: string;
  subtext?: string;
};

export default function BrandMoreForYou({
  heading = "We've got more for you",
  subtext,
}: BrandMoreForYouProps) {
  return (
    <section className="flex w-full flex-col items-center text-center">
      <h2 className="m-0 font-[var(--font-manrope)] text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
        {heading}
      </h2>

      <p className="m-0 mt-[4.167vw] w-full font-[var(--font-manrope)] text-[4.167vw] font-medium leading-[1.4] tracking-[-0.04em] text-black md:mt-[2.083vw] md:w-full md:text-[2.344vw] lg:mt-[1.389vw] lg:max-w-[40vw] lg:text-[max(18px,1.389vw)]">
        {subtext ?? <>You know your style the best, and we<br />curated collections to help you experiment.</>}
      </p>

      <div className="mt-[11.111vw] flex flex-row items-center gap-[clamp(5px,0.69vw,10px)] md:mt-[5.208vw] lg:mt-[2.778vw]">
        <Link
          href="/collections"
          className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border border-[#7a021d] font-[var(--font-manrope)] text-[3.889vw] font-medium tracking-[-0.04em] text-[#7a021d] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse Collections
        </Link>

        <Link
          href="/products"
          className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border border-[#7a021d] bg-[#7a021d] font-[var(--font-manrope)] text-[3.889vw] font-medium tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse All
        </Link>
      </div>
    </section>
  );
}
