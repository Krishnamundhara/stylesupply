import Image from "next/image";
import Link from "next/link";

export interface WardrobeProduct {
  id: string;
  image: string;
  brand: string;
  productName: string;
}

export default function WardrobeProductCard({
  product,
}: {
  product: WardrobeProduct;
}) {
  return (
    <div className="flex flex-col w-full">
      {/* Image — 5:6 portrait on mobile, 7:5 landscape on desktop */}
      <div className="relative w-full aspect-[5/6] md:aspect-[7/5] overflow-hidden bg-[#f2f2f2]">
        <Image
          src={product.image}
          alt={product.productName}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 50vw, 48vw"
        />
      </div>

      {/* Info + Button — 2 columns */}
      <div className="grid grid-cols-2 gap-[2vw] md:gap-[1vw] pt-[6px] md:pt-[1.111vw]">
        {/* Left: brand + name stacked */}
        <div className="flex flex-col justify-center gap-[4px] md:gap-[0.556vw]">
          <p className="font-[var(--font-manrope)] font-normal text-[#4e4e4e] tracking-[-0.04em] text-[10px] md:text-[1.302vw] lg:text-[1.042vw] leading-normal">
            {product.brand}
          </p>
          <p className="font-[var(--font-manrope)] font-semibold text-black capitalize tracking-[-0.04em] text-[15px] md:text-[2.344vw] lg:text-[1.806vw] leading-normal truncate">
            {product.productName}
          </p>
        </div>

        {/* Right: Review button full height */}
        <Link
          href={`/accounts/wardrobe/review?productId=${product.id}`}
          className="flex items-center justify-center self-start ml-auto mr-[1.389vw] rounded-full border border-[#7a021d] text-[#7a021d] font-[var(--font-manrope)] font-semibold tracking-[-0.04em] whitespace-nowrap text-[3.333vw] md:text-[1.823vw] lg:text-[1.389vw] w-[13.889vw] md:w-[18.229vw] md:h-[7.813vw] lg:w-[13.889vw] lg:h-[5.556vw] h-[5.556vw]"
        >
          Review
        </Link>
      </div>
    </div>
  );
}
