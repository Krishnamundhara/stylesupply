import Link from "next/link";

export default function HomeClosetElevated() {
  return (
    <section className="flex flex-col items-center text-center font-[var(--font-manrope)]">
      <h2 className="m-0 text-[9.444vw] font-normal leading-[1.2] tracking-[-0.04em] text-black md:whitespace-nowrap md:text-[5.859vw] lg:text-[5.139vw]">
        Your Closet, Elevated.
      </h2>

      <p className="m-0 mt-[4.167vw] font-medium leading-[1.4] tracking-[-0.02em] text-black text-[4.167vw] md:mt-[1.389vw] md:text-[2.344vw] lg:text-[max(14px,1.389vw)]">
        <span className="md:hidden">
          <span className="block">You try. You decide. You only own what</span>
          <span className="block">you truly love. Your private boutique,</span>
          <span className="block">delivered in 24 hours.</span>
        </span>
        <span className="hidden md:block">
          <span className="block">You try. You decide. You only own what you truly love.</span>
          <span className="block">Your private boutique, delivered in 24 hours.</span>
        </span>
      </p>

      <div className="mt-[11.111vw] flex items-center gap-[7px] md:mt-[5.208vw] lg:mt-[2.778vw]">
        <Link
          href="/about"
          className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full border border-[#7A021D] text-[3.889vw] font-medium leading-[1.1] tracking-[-0.04em] text-[#7A021D] md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[max(14px,1.389vw)]"
        >
          About Us
        </Link>
        <Link
          href="/howitworks"
          className="flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium leading-[1.1] tracking-[-0.04em] text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[max(14px,1.389vw)]"
        >
          How It Works
        </Link>
      </div>
    </section>
  );
}
