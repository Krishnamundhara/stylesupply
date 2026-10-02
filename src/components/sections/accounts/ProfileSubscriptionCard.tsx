import Image from "next/image";
import Link from "next/link";

const RENTAL_ITEMS = [
  { id: "1", brand: "RALPH LAUREN", name: "COAT JACKET", image: "/image/figma/editorial-product.png" },
  { id: "2", brand: "RALPH LAUREN", name: "COAT JACKET", image: "/image/figma/editorial-product.png" },
  { id: "3", brand: "RALPH LAUREN", name: "COAT JACKET", image: "/image/figma/editorial-product.png" },
  { id: "4", brand: "RALPH LAUREN", name: "COAT JACKET", image: "/image/figma/editorial-product.png" },
  { id: "5", brand: "RALPH LAUREN", name: "COAT JACKET", image: "/image/figma/editorial-product.png" },
];

export default function ProfileSubscriptionCard() {
  return (
    <section
      className="w-full min-w-0 max-w-full rounded-[clamp(1rem,3vw,2.5rem)] bg-[#f7f4ef] px-[clamp(0.875rem,4vw,2.5rem)] pt-[clamp(1.25rem,3.5vw,2.75rem)] pb-[clamp(1.5rem,4vw,3rem)]"
      aria-labelledby="subscription-card-heading"
    >
      {/* Header — mobile: title block then order pill; desktop: row */}
      <div className="flex min-w-0 flex-col gap-[22px] lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(1rem,3vw,1.5rem)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[10px] lg:max-w-[min(39.5rem,100%)]">
          <h2
            id="subscription-card-heading"
            className="font-[var(--font-manrope)] font-normal text-[#25080a] leading-[1.2] tracking-[-0.04em]"
          >
            <span className="flex flex-col lg:hidden text-[clamp(1.5rem,8vw,2rem)]">
              <span>Standard</span>
              <span>Subscription</span>
            </span>
            <span className="hidden lg:inline text-[clamp(1.75rem,calc(0.75rem+3vw),3.375rem)]">
              Standard Subscription
            </span>
          </h2>
          <p className="font-[var(--font-manrope)] leading-[1.2] text-[12px] tracking-[-0.02em] text-[#25080a] lg:text-[clamp(0.875rem,calc(0.5rem+1.1vw),1.125rem)] lg:tracking-[-0.04em]">
            <span className="font-semibold text-[#7a021d]">12 Days left</span>
            <span className="font-normal"> for your next rotation</span>
          </p>
        </div>
        <div className="h-[50px] w-[min(100%,10rem)] shrink-0 self-start rounded-[60px] border-[0.5px] border-solid border-[#6b0b23] bg-white px-[clamp(0.75rem,3vw,1.25rem)] flex items-center justify-center lg:h-auto lg:min-h-[clamp(3.75rem,10vw,5.3125rem)] lg:w-auto lg:min-w-[min(100%,clamp(15rem,45vw,17.75rem))] lg:rounded-[clamp(3rem,8vw,7.9375rem)] lg:border lg:px-[clamp(1rem,2.5vw,1.6875rem)] lg:py-[clamp(1rem,2vw,1.25rem)]">
          <p className="font-[var(--font-manrope)] font-medium text-center text-[#7a021d] leading-none whitespace-nowrap text-[15px] tracking-[-0.04em] lg:text-[clamp(1rem,calc(0.25rem+1.5vw),1.5rem)]">
            Order Id: SS#2345
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-[clamp(1.25rem,3.5vw,2.5625rem)] w-full">
        <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.75rem)] sm:flex-row sm:justify-between sm:gap-[clamp(1rem,3vw,1.5rem)]">
          <div>
            <p className="font-[var(--font-manrope)] font-medium text-[#666] leading-[1.2] text-[10px] tracking-[-0.04em] lg:text-[clamp(0.8125rem,calc(0.4rem+1vw),1rem)]">
              Rented on
            </p>
            <p className="mt-[clamp(0.25rem,0.8vw,0.5rem)] font-[var(--font-manrope)] font-semibold text-black leading-[1.2] text-[10px] tracking-[-0.04em] lg:text-[clamp(0.8125rem,calc(0.4rem+1vw),1rem)]">
              March 14, 2026
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-[var(--font-manrope)] font-medium text-[#666] leading-[1.2] text-[10px] tracking-[-0.04em] lg:text-[clamp(0.8125rem,calc(0.4rem+1vw),1rem)]">
              Return Date
            </p>
            <p className="mt-[clamp(0.25rem,0.8vw,0.5rem)] font-[var(--font-manrope)] font-semibold text-black leading-[1.2] text-[10px] tracking-[-0.04em] lg:text-[clamp(0.8125rem,calc(0.4rem+1vw),1rem)]">
              April 14, 2026
            </p>
          </div>
        </div>

        <div className="relative mt-[clamp(1rem,2.5vw,1.75rem)] w-full pb-[clamp(1.25rem,3.5vw,2.25rem)]">
          <div className="relative mx-auto w-full h-[11px] lg:h-[clamp(1.125rem,1.5vw,1.375rem)]">
            <div
              className="absolute inset-x-0 top-1/2 h-[2.5px] lg:h-[clamp(0.25rem,0.4vw,0.3125rem)] -translate-y-1/2 rounded-full bg-[#eae2df]"
              aria-hidden
            />
            <div
              className="absolute left-0 top-1/2 h-[3px] lg:h-[clamp(0.25rem,0.4vw,0.3125rem)] w-[81%] max-w-full -translate-y-1/2 rounded-full bg-[#7a021d]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute left-0 top-1/2 z-[1] size-[11px] lg:size-[clamp(1rem,1.25vw,1.3125rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a021d] ring-2 ring-[#f7f4ef]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute left-[81%] top-1/2 z-[1] size-[11px] lg:size-[clamp(1rem,1.25vw,1.3125rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a021d] ring-2 ring-[#f7f4ef]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute left-full top-1/2 z-[1] size-[11px] lg:size-[clamp(1rem,1.25vw,1.3125rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eae2df] ring-2 ring-[#f7f4ef]"
              aria-hidden
            />
            <p className="absolute left-[81%] top-[calc(100%+clamp(0.35rem,1.2vw,0.75rem))] -translate-x-1/2 font-[var(--font-manrope)] font-semibold text-[#666] whitespace-nowrap text-[10px] tracking-[-0.04em] lg:text-[clamp(0.8125rem,calc(0.4rem+1vw),1rem)]">
              Day 28
            </p>
          </div>
        </div>
      </div>

      {/* Product row — mobile: horizontal scroll, 140px cards; desktop: flex row */}
      <div className="mt-[clamp(1.25rem,3.5vw,2.25rem)] overflow-x-auto pb-[clamp(0.25rem,0.5vw,0.5rem)] scrollbar-hide -mx-[clamp(0.125rem,2vw,0.25rem)] px-[clamp(0.125rem,2vw,0.25rem)] touch-pan-x">
        <div className="flex min-w-min gap-[clamp(0.36rem,1.5vw,0.625rem)] lg:min-w-0 lg:w-full lg:justify-between">
          {RENTAL_ITEMS.map((item) => (
            <article
              key={item.id}
              className="w-[140px] shrink-0 lg:w-[clamp(10rem,28vw,15.75rem)] lg:min-w-0 lg:flex-1 lg:basis-0 lg:max-w-[min(15.75rem,20%)]"
            >
              <div className="relative h-[230px] w-full overflow-hidden bg-white lg:h-auto lg:aspect-[252/412]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain object-bottom p-2 lg:p-[clamp(0.5rem,1.5vw,0.75rem)]"
                  sizes="(max-width: 1024px) 140px, 18vw"
                />
              </div>
              <div className="mt-[clamp(0.5rem,1.2vw,0.875rem)] px-[clamp(0.125rem,1vw,0.25rem)]">
                <p className="font-[var(--font-manrope)] font-semibold text-black leading-normal text-[11px] lg:text-[clamp(0.875rem,calc(0.35rem+1.2vw),1.25rem)]">
                  {item.brand}
                </p>
                <p className="mt-[2px] font-[var(--font-manrope)] font-medium text-black leading-normal text-[7.7px] lg:mt-[clamp(0.25rem,0.8vw,0.375rem)] lg:text-[clamp(0.6875rem,calc(0.25rem+0.9vw),0.875rem)]">
                  {item.name}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Actions — mobile: stacked, centered, max 280px; desktop: row */}
      <div className="mt-[clamp(1.25rem,3.5vw,2.5rem)] flex w-full flex-col items-center gap-[15px] lg:flex-row lg:items-center lg:justify-between lg:gap-[clamp(1rem,2.5vw,1.25rem)]">
        <div className="flex w-full max-w-[min(280px,90vw)] flex-col gap-[15px] lg:max-w-none lg:flex-row lg:flex-wrap lg:justify-start lg:gap-[clamp(0.75rem,2vw,1rem)]">
          <button
            type="button"
            className="inline-flex h-[60px] w-full min-w-0 items-center justify-center whitespace-nowrap rounded-[60px] bg-[#7a021d] px-[clamp(0.75rem,3vw,1.5rem)] font-[var(--font-manrope)] font-semibold text-[15px] leading-[16px] text-[#fafafa] tracking-[-0.04em] lg:min-h-[clamp(3.5rem,9vw,5rem)] lg:rounded-[clamp(2.5rem,6vw,3.875rem)] lg:px-[clamp(1.75rem,5vw,3rem)] lg:text-[clamp(1rem,calc(0.4rem+1.3vw),1.4375rem)] lg:leading-[1.1] lg:tracking-[-0.02em] lg:w-auto lg:min-w-[clamp(15rem,42vw,17.5rem)]"
          >
            Request Return
          </button>
          <button
            type="button"
            className="inline-flex h-[60px] w-full min-w-0 items-center justify-center whitespace-nowrap rounded-[60px] border-0 bg-[#fffbfc] px-[clamp(0.75rem,3vw,1.5rem)] font-[var(--font-manrope)] font-semibold text-[15px] leading-[16px] text-[#1e1822] tracking-[-0.04em] transition-colors hover:bg-[#f5f0f2] lg:min-h-[clamp(3.5rem,9vw,5rem)] lg:bg-white lg:rounded-[clamp(2.5rem,6vw,3.875rem)] lg:px-[clamp(1.75rem,5vw,3rem)] lg:text-[clamp(1rem,calc(0.4rem+1.3vw),1.4375rem)] lg:leading-[1.1] lg:text-[#25080a] lg:tracking-[-0.02em] lg:hover:bg-white/80 lg:w-auto lg:min-w-[clamp(15rem,42vw,17.5rem)]"
          >
            Swap Shipment
          </button>
        </div>
        <Link
          href="/accounts/reviews"
          className="w-full text-center font-[var(--font-manrope)] font-semibold text-[#6b0b23] text-[14.6px] leading-[1.1] tracking-[-0.02em] underline decoration-solid underline-offset-2 lg:w-auto lg:text-right lg:text-[clamp(1rem,calc(0.4rem+1.3vw),1.4375rem)] lg:underline-offset-[clamp(0.125rem,0.4vw,0.25rem)] shrink-0"
        >
          Leave a Review
        </Link>
      </div>
    </section>
  );
}
