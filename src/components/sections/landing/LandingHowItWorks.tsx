import Image from "next/image";
import Link from "next/link";

type Step = {
  title: string;
  description: string;
  /** Tailwind bg + text color classes */
  cardClasses: string;
  /** Bottom image (flush to card bottom) */
  imageSrc?: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
};

const steps: Step[] = [
  {
    title: "Curate Your Box",
    description: "Your box, your instinct.",
    cardClasses: "bg-[#F2F1ED] text-black",
    imageSrc: "/images/landing/card_1.webp",
    imageAlt: "Curated designer pieces on a clothing rack",
  },
  {
    title: "Your Place, Your Time",
    description: "48h to decide, take your time.",
    cardClasses: "bg-[#7A021D] text-white",
    imageSrc: "/images/landing/card_2.webp",
    imageAlt: "Try pieces at home on your schedule",
    cta: { label: "How It Works", href: "/howitworks" },
  },
  {
    title: "Keep or Return",
    description: "Try at no cost.",
    cardClasses: "bg-[#F2F1ED] text-black",
    imageSrc: "/images/landing/card_3.webp",
    imageAlt: "StyleSupply delivery boxes",
  },
];

export default function LandingHowItWorks() {
  return (
    <section className="w-full font-[var(--font-manrope)]">
      {/* Mobile: 35px (Figma 360px comp) | Desktop: 4.444vw (~64px at 1440) */}
      <h2 className="mx-auto w-full md:w-fit max-w-full text-center font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] md:leading-[1.05] lg:text-[5.139vw] lg:whitespace-nowrap">
        <span className="md:hidden">A new way to<br />experience fashion</span>
        <span className="hidden md:inline">A new way to experience fashion</span>
      </h2>

      {/*
       * Card grid:
       *   Mobile (360px): single column, full-width, no gap, ~406px tall cards
       *   Tablet/Desktop: 3 columns, no gap
       */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] mt-[9.722vw] grid w-screen grid-cols-1 gap-0 md:grid-cols-3 md:mt-[4.167vw] lg:mt-[2.778vw]">
        {steps.map((step) => (
          <article
            key={step.title}
            className={`relative flex flex-col items-center overflow-hidden [container-type:inline-size] aspect-[362/406] md:aspect-[453/549] ${
              step.imageSrc
                ? "pb-0 pt-[16.667vw] md:pt-[9.115vw] lg:pt-[4.861vw]"
                : "pt-[16.667vw] md:pt-[9.115vw] lg:pt-[4.861vw] max-md:pb-[6.944vw] md:pb-[3vw] lg:pb-[1.389vw]"
            } ${step.cardClasses}`}
          >
            {step.imageSrc ? (
              <Image
                src={step.imageSrc}
                alt={step.imageAlt ?? ""}
                fill
                className="pointer-events-none absolute inset-0 z-0 object-cover object-[50%_100%]"
                sizes="(max-width: 767px) 100vw, 33vw"
              />
            ) : null}

            {/* Mobile: 8.333vw | Tablet: 3.3vw | Desktop: 2.639vw */}
            <h3 className="relative z-10 w-full text-center whitespace-nowrap font-medium leading-[1.2] tracking-[-0.03em] text-[8.333vw] md:text-[3.3vw] lg:text-[2.639vw]">
              {step.title}
            </h3>

            {/* Mobile: 5vw | Tablet: 2.1vw | Desktop: 1.667vw */}
            <p className="relative z-10 mt-[4.167vw] md:mt-[2.604vw] lg:mt-[1.389vw] w-full max-w-none text-center whitespace-nowrap font-medium leading-[1.4] tracking-[-0.04em] text-[5vw] md:text-[2.1vw] lg:text-[1.667vw]">
              {step.description}
            </p>

            {step.cta ? (
              <Link
                href={step.cta.href}
                className="relative z-10 mt-auto mb-10 flex h-[16.667vw] w-[38.889vw] items-center justify-center rounded-full bg-white text-[3.889vw] font-medium leading-[1.1] tracking-[-0.04em] text-black md:h-[7.813vw] md:w-[18.229vw] md:text-[1.823vw] md:mb-[clamp(1.5rem,3.5vw,2.5rem)] lg:h-[5.556vw] lg:w-[12.5vw] lg:text-[1.389vw]"
              >
                {step.cta.label}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
