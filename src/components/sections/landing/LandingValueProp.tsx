import Link from "next/link";

interface LandingValuePropProps {
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULTS = {
  subtitle:
    "Membership is by invitation only. Expect a response within 48 hours.",
  ctaLabel: "Request Access",
  ctaHref: "/request-access",
};

export default function LandingValueProp({
  subtitle = DEFAULTS.subtitle,
  ctaLabel = DEFAULTS.ctaLabel,
  ctaHref = DEFAULTS.ctaHref,
}: LandingValuePropProps = {}) {
  return (
    <section className="flex w-full flex-col items-center px-[5vw] font-[var(--font-manrope)]">
      <h2 className="md:hidden text-center font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw]">
        <span className="block">Choose 5 designer</span>
        <span className="block">pieces. Delivered in 24</span>
        <span className="block">hours. Try at home.</span>
        <span className="block">Keep what you love.</span>
      </h2>

      <h2 className="hidden md:block text-center font-normal leading-[1.05] tracking-[-0.04em] text-black text-[5.859vw] lg:text-[5.139vw]">
        <span className="block whitespace-nowrap">Choose 5 designer pieces.</span>
        <span className="block whitespace-nowrap">Delivered in 24 hours. Try at home.</span>
        <span className="block whitespace-nowrap">Keep what you love.</span>
      </h2>

      {/* Subtitle + CTA group — mobile: 30px gap, desktop: clamp */}
      <div className="mt-[20px] md:mt-[30px] flex flex-col items-center gap-[30px]">
        {/* Subtitle — mobile: 15px | tablet: 2vw | desktop: fluid */}
        <p className="text-center font-medium leading-[1.5] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.344vw] md:leading-[1.4] lg:text-[1.667vw]">
          Membership is by invitation only. Expect a
          <br />
          response within 48 hours.
        </p>

        {/* CTA button — mobile: 160×60px / 14px | tablet: intermediate | desktop: 240×80px / fluid */}
        <Link
          href={ctaHref}
          className="flex h-[16.667vw] w-[44.444vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium text-white md:h-[7.813vw] md:w-[20.833vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[13.889vw] lg:text-[1.389vw]"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
