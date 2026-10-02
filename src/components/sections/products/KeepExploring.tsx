import Link from "next/link";

interface KeepExploringProps {
  collectionsHref?: string;
  browseHref?: string;
}

export default function KeepExploring({
  collectionsHref = "/collections",
  browseHref = "/products",
}: KeepExploringProps) {
  return (
    <section className="flex w-full flex-col items-center px-[10px] text-center font-[var(--font-manrope)] md:px-0">
      <h2 className="m-0 text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:text-[5.859vw] lg:text-[5.139vw]">
        Keep Exploring
      </h2>

      <p className="m-0 mt-[4.167vw] w-full max-w-[340px] font-medium leading-[1.4] tracking-[-0.02em] text-black text-[4.167vw] md:mt-[2.083vw] md:max-w-none md:text-[2.344vw] md:leading-[1.4] md:tracking-[-0.04em] lg:mt-[1.389vw] lg:text-[max(18px,1.389vw)]">
        <span className="md:hidden">
          Explore the full Style Supply wardrobe, from everyday pieces to the ones
          you didn&apos;t know you were looking for.
        </span>
        <span className="hidden md:inline">
          Explore the full Style Supply wardrobe, from everyday
          <br />
          pieces to the ones you didn&apos;t know you were looking for.
        </span>
      </p>

      <div className="mx-auto mt-[11.111vw] flex flex-row flex-wrap items-center justify-center gap-[10px] md:mt-[5.208vw] lg:mt-[2.778vw]">
        <Link
          href={collectionsHref}
          className="flex h-[16.667vw] w-[38.889vw] shrink-0 items-center justify-center rounded-full border border-[#7a021d] px-2 text-center text-[3.889vw] font-medium tracking-[-0.04em] text-[#7a021d] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse Collections
        </Link>

        <Link
          href={browseHref}
          className="flex h-[16.667vw] w-[38.889vw] shrink-0 items-center justify-center rounded-full bg-[#7a021d] px-2 text-center text-[3.889vw] font-medium tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          Browse All
        </Link>
      </div>
    </section>
  );
}
