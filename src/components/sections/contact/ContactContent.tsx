import Link from "next/link";
import Image from "next/image";

const SECTION_HEADING =
  "font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[12.222vw] md:text-[5.859vw] lg:text-[4.444vw]";

const EMAIL_BODY =
  "font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.344vw] lg:text-[1.389vw]";

const FAQS_BODY =
  "font-[var(--font-manrope)] font-medium leading-[1.4] tracking-[-0.02em] text-black text-[5vw] md:text-[2.344vw] lg:text-[1.389vw]";

const CARD_TITLE =
  "font-[var(--font-manrope)] font-normal leading-[1.2] tracking-[-0.04em] text-black text-[8.889vw] md:text-[3.255vw] lg:text-[3.056vw]";

const CARD_BODY =
  "font-[var(--font-manrope)] font-medium leading-[1.6] text-black text-[3.611vw] md:text-[1.823vw] lg:text-[1.25vw]";

const CARD_EMAIL =
  "font-[var(--font-manrope)] font-medium leading-[1.6] tracking-[-0.02em] text-[#7a021d] text-[4.056vw] md:text-[2.083vw] lg:text-[1.389vw]";

const CTA_TEXT = "text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw]";

const emailCards = [
  {
    title: "For membership support",
    body: "Questions about your plan, access, billing, pauses, or profile.",
    email: "membership@stylesupply.io",
  },
  {
    title: "For orders & returns",
    body: "Questions about your plan, access, billing, pauses, or profile.",
    email: "support@stylesupply.io",
  },
  {
    title: "For brands & partnerships",
    body: "Questions about your plan, access, billing, pauses, or profile.",
    email: "brands@stylesupply.io",
  },
];

export default function ContactContent() {
  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center px-[4.444vw] md:px-[6.25vw] lg:px-[2.778vw]">

      {/* ── 1. Contact Us ── */}
      <div className="flex w-full flex-col items-center text-center mt-[8.333vw] md:mt-[5.208vw] lg:mt-[4.861vw]">
        <div className="flex flex-col items-center gap-[4.167vw] md:gap-[2.083vw]">
          <h2 className="font-[var(--font-manrope)] font-normal leading-[1.3] tracking-[-0.04em] text-black whitespace-nowrap text-[12.222vw] md:text-[5.859vw] lg:text-[4.444vw]">Contact Us</h2>
          <p className="font-[var(--font-manrope)] font-medium leading-[1.6] tracking-[-0.02em] text-black text-[4.444vw] md:text-[2.344vw] lg:text-[1.389vw] w-[83.333vw] md:w-auto">
            <span className="md:hidden">We are available every day including Sundays between 9 AM - 9 PM to support your queries. WhatsApp is the fastest way to reach us.</span>
            <span className="hidden md:inline">We are available Monday to Sunday<br />between 9 AM - 9 PM to support your queries.<br />WhatsApp is the fastest way to reach us.</span>
          </p>
        </div>

        <div className="mt-[11.111vw] md:mt-[2.778vw] flex flex-row items-center gap-[2.778vw] md:gap-[1.302vw]">
          <a
            href="https://wa.me/919082203857"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center rounded-full bg-[#7a021d] text-white h-[16.667vw] md:h-[7.813vw] lg:h-[5.556vw] w-[38.889vw] md:w-[20.833vw] lg:w-[13.889vw] font-[var(--font-manrope)] font-semibold leading-[1.1] whitespace-nowrap ${CTA_TEXT}`}
          >
            WhatsApp Us
          </a>
          <a
            href="tel:+919082203857"
            className={`flex items-center justify-center rounded-full border border-[#7a021d] text-[#7a021d] bg-transparent h-[16.667vw] md:h-[7.813vw] lg:h-[5.556vw] w-[38.889vw] md:w-[20.833vw] lg:w-[13.889vw] font-[var(--font-manrope)] font-semibold leading-[1.1] whitespace-nowrap ${CTA_TEXT}`}
          >
            Call Us
          </a>
        </div>
      </div>

      {/* ── 2. Email Us ── */}
      <div className="mt-[16.667vw] md:mt-[10.417vw] lg:mt-[5.556vw] flex w-full flex-col items-center gap-[4.167vw] md:gap-[1.389vw] text-center">
        <h2 className={SECTION_HEADING}>Email Us</h2>
        <p className={`${EMAIL_BODY} w-[83.333vw] md:w-auto`}>
          Your experience is our priority.<br />
          Kindly allow up to 24 hours for email queries.
        </p>
      </div>

      {/* ── 3. Email cards ── */}
      <div className="mt-[8.333vw] md:mt-[2.778vw] flex w-full flex-col gap-[4.167vw] md:grid md:grid-cols-3 md:gap-[0.694vw] md:px-0">
        {emailCards.map((card) => (
          <div
            key={card.title}
            className="relative flex flex-col bg-[#f7f4ef] px-[6.093vw] py-[8.936vw] md:px-[2.083vw] md:py-[3.056vw] h-[93.429vw] md:h-[31.944vw]"
          >
            <div className="flex flex-col gap-[4.062vw] md:gap-[1.389vw] w-[73.118vw] md:w-auto">
              <h3 className={CARD_TITLE}>
                {card.title === "For membership support" ? (
                  <><span className="hidden md:inline">For membership<br />support</span><span className="md:hidden">{card.title}</span></>
                ) : card.title === "For orders & returns" ? (
                  <><span className="hidden md:inline">For orders &<br />returns</span><span className="md:hidden">{card.title}</span></>
                ) : card.title === "For brands & partnerships" ? (
                  <><span className="hidden md:inline">For brands &<br />partnerships</span><span className="md:hidden">{card.title}</span></>
                ) : card.title}
              </h3>
              <p className={`${CARD_BODY} w-[63.929vw] md:w-auto`}>{card.body}</p>
            </div>
            <a
              href={`mailto:${card.email}`}
              className={`${CARD_EMAIL} absolute bottom-[8.936vw] md:static md:mt-auto md:pt-[1.389vw] w-[63.929vw] md:w-auto flex items-center gap-[2vw] md:gap-[0.556vw]`}
            >
              <Image src="/icon/Mail.svg" alt="" width={20} height={20} className="shrink-0 w-[4.444vw] h-[4.444vw] md:w-[1.389vw] md:h-[1.389vw]" />
              <span>{card.email}</span>
            </a>
          </div>
        ))}
      </div>

      {/* ── 4. FAQs ── */}
      <div className="mt-[16.667vw] md:mt-[10.417vw] lg:mt-[5.556vw] flex w-full flex-col items-center gap-[11.111vw] md:gap-[2.778vw] text-center">
        <div className="flex flex-col items-center gap-[5.556vw] md:gap-[2.083vw]">
          <h2 className={SECTION_HEADING}>FAQs</h2>
          <p className={FAQS_BODY}>
            <span className="md:hidden w-[83.333vw] block">
              We&apos;ve answered a few common questions already. Browse our FAQs for quick help with orders, returns, membership, and more.
            </span>
            <span className="hidden md:inline">
              We&apos;ve answered a few common questions already.{" "}
              <br />Browse our FAQs for quick help with orders, returns,
              <br /> membership, and more.
            </span>
          </p>
        </div>
        <Link
          href="/faq"
          className="flex items-center justify-center rounded-full bg-[#7a021d] text-white h-[16.667vw] md:h-[7.813vw] lg:h-[5.556vw] w-[55.556vw] md:w-[20.833vw] lg:w-[16.667vw] font-[var(--font-manrope)] font-semibold leading-[1.1] tracking-[-0.02em] text-[3.889vw] md:text-[1.823vw] lg:text-[1.389vw] whitespace-nowrap"
        >
          View FAQs
        </Link>
      </div>

    </div>
  );
}
