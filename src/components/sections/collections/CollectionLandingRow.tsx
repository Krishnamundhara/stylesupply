import type { CollectionProduct } from "./CollectionShowcase";
import CollectionHeroBanner from "./CollectionHeroBanner";
import CollectionProductScroll from "./CollectionProductScroll";
import CollectionProductGrid from "./CollectionProductGrid";

export type { CollectionProduct };

export interface CollectionLandingRowProps {
  title: string;
  subtitle?: string;
  heroImage: string;
  heroImageMobile?: string;
  products: CollectionProduct[];
  href?: string;
}

export default function CollectionLandingRow({
  title,
  subtitle,
  heroImage,
  heroImageMobile,
  products,
  href = "#",
}: CollectionLandingRowProps) {
  return (
    <section className="flex w-full flex-col">
      <CollectionHeroBanner
        title={title}
        subtitle={subtitle}
        heroImage={heroImage}
        heroImageMobile={heroImageMobile}
        href={href}
        btnLabel="View Collection"
      />

      <div className="pt-[5px] md:hidden">
        <CollectionProductScroll products={products} href={href} />
      </div>

      <div className="hidden pt-[5px] md:block">
        <CollectionProductGrid products={products} href={href} />
      </div>
    </section>
  );
}
