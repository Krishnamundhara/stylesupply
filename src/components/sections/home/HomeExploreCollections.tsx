import Image from "next/image";
import Link from "next/link";
import type { HomeCollection, HomeCollectionsSection } from "@/types/home";

interface HomeExploreCollectionsProps {
  data: HomeCollectionsSection;
}

function CollectionCard({ collection }: { collection: HomeCollection }) {
  return (
    <Link
      href={collection.href}
      className="group relative block w-full overflow-hidden aspect-[340/340] md:aspect-[705/720]"
    >
      <Image
        src={collection.image}
        alt={collection.label}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

      {/* Collection name — top-left corner */}
      <span className="absolute left-[20px] md:left-[40px] lg:left-[57px] top-[20px] md:top-[35px] lg:top-[50px] font-normal leading-[1.2] text-white text-[9.444vw] md:text-[4.427vw] lg:text-[4.444vw] whitespace-nowrap">
        {collection.label}
      </span>

      {/* Discover CTA pill */}
      <span className="absolute bottom-[20px] right-[20px] flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border border-white text-[3.889vw] font-medium leading-none text-white md:bottom-[32px] md:right-[32px] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:bottom-[44px] lg:right-[44px] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]">
        {collection.ctaLabel}
      </span>
    </Link>
  );
}

export default function HomeExploreCollections({
  data,
}: HomeExploreCollectionsProps) {
  // If mobile lines are provided, render a manual line break only on mobile.
  const hasMobileSplitTitle = Boolean(data.titleMobileLines);

  return (
    <section className="w-full flex flex-col items-center font-[var(--font-manrope)]">
      <h2 className="text-center font-normal text-black text-[9.444vw] md:text-[5.859vw] md:leading-[1.05] lg:text-[5.139vw] leading-[1.2] tracking-[-0.04em] px-[10px] lg:px-0">
        {hasMobileSplitTitle ? (
          <>
            <span className="md:hidden">
              {data.titleMobileLines?.[0]}
              <br />
              {data.titleMobileLines?.[1]}
            </span>
            <span className="hidden md:inline whitespace-nowrap">{data.title}</span>
          </>
        ) : (
          data.title
        )}
      </h2>

      <div className="mt-[40px] md:mt-[60px] grid w-full grid-cols-1 md:grid-cols-2 gap-[5px] px-[10px]">
        {data.collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
