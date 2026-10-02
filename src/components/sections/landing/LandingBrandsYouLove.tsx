import Image from "next/image";

const SECTION_PADDING = "px-[6.9vw] sm:px-6 lg:px-[2.5vw]";

const HEADLINE_CLASSES =
  "mx-auto w-full text-center leading-[1.2] tracking-[-0.04em] text-black text-[1.875rem] sm:text-[clamp(1.875rem,4.5vw,3rem)] lg:leading-[1.05] lg:text-[4.444vw]";

interface LandingBrandsYouLoveProps {
  teaserImage: { src: string; srcMobile: string; alt: string };
}

export default function LandingBrandsYouLove({ teaserImage }: LandingBrandsYouLoveProps) {
  return (
    <section className="flex w-full flex-col items-center bg-[#F7F4EF] font-[var(--font-manrope)]">
      {/* Mobile */}
      <div className="relative w-full md:hidden">
        <Image
          src={teaserImage.srcMobile}
          alt={teaserImage.alt}
          width={376}
          height={600}
          className="block h-auto w-full max-w-none"
          sizes="100vw"
        />
        <div className={`pointer-events-none absolute inset-x-0 top-[50px] ${SECTION_PADDING}`}>
          <h2 className="mx-auto w-full text-center text-[34px] font-medium leading-[1.2] tracking-[-0.04em] text-black">
            Curated from
            <br />
            contemporary
            <br />
            designer labels
          </h2>
          <p className="mt-[208px] text-center text-[18px] font-bold uppercase tracking-[0.05em] text-[#000000]">
            Coming Soon
          </p>
        </div>
      </div>

      {/* Tablet + Desktop */}
      <div className="relative hidden w-full md:block">
        <Image
          src={teaserImage.src}
          alt={teaserImage.alt}
          width={1440}
          height={931}
          className="block h-auto w-full"
          sizes="100vw"
        />
        <div className={`pointer-events-none absolute inset-x-0 top-[9.236vw] ${SECTION_PADDING}`}>
          <h2 className={`${HEADLINE_CLASSES} font-normal`}>
            Curated from contemporary
            <br /> designer labels.
          </h2>
          <p className="mt-[18.82vw] text-center font-bold uppercase tracking-[0.05em] text-[#000000] text-[clamp(14px,1.8vw,24px)]">
            Coming Soon
          </p>
        </div>
      </div>
    </section>
  );
}
