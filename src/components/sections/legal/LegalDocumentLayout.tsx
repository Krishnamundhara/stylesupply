import {
  LEGAL_INTRO_PARAGRAPH,
  LEGAL_SECTION_BODY,
  LEGAL_SUBHEADING_LINES,
} from "./legalPageCopy";

type LegalDocumentLayoutProps = {
  title: string;
};

export default function LegalDocumentLayout({ title }: LegalDocumentLayoutProps) {
  return (
    <section className="w-full min-w-0 font-(--font-manrope) text-black">
      {/* Same 1440px shell as About and other marketing pages */}
      <div className="mx-auto w-full max-w-360 px-[clamp(1.25rem,5vw,3.75rem)]">
        <div className="flex w-full flex-col gap-[clamp(2.5rem,6vw,3.625rem)] lg:gap-[clamp(3rem,6.5vw,3.625rem)]">
          <h1 className="text-center text-[clamp(2.75rem,6.5vw,5.25rem)] font-normal leading-none tracking-[-0.04em] text-[#000000] lg:leading-[clamp(4.5rem,9vw,6.25rem)] lg:tracking-[-0.04em]">
            {title}
          </h1>

          <div className="flex w-full flex-col gap-[clamp(1.25rem,4vw,2.5rem)] lg:gap-[clamp(2rem,4.5vw,2.5rem)]">
            <div className="h-px w-full bg-black" aria-hidden />

            <div className="flex w-full flex-col gap-[clamp(1rem,3.5vw,2.0625rem)] lg:gap-[clamp(1.75rem,3.5vw,2.0625rem)]">
              <h2 className="text-left text-[clamp(1.125rem,2.8vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.04em] lg:tracking-[-0.04em]">
                {LEGAL_SUBHEADING_LINES[0]}
                <br />
                {LEGAL_SUBHEADING_LINES[1]}
              </h2>

              <p className="text-[clamp(0.9375rem,2.2vw,1.25rem)] font-semibold leading-[1.5] tracking-[-0.04em] lg:tracking-[-0.04em]">
                {LEGAL_INTRO_PARAGRAPH}
              </p>

              <div className="text-[clamp(0.9375rem,2.2vw,1.25rem)] font-semibold leading-[1.5] tracking-[-0.04em] lg:tracking-[-0.04em]">
                <p className="mb-0">Lorem ipsum dolor sit amet:</p>
                <p>{LEGAL_SECTION_BODY}</p>
              </div>

              <div className="text-[clamp(0.9375rem,2.2vw,1.25rem)] font-semibold leading-[1.5] tracking-[-0.04em] lg:tracking-[-0.04em]">
                <p className="mb-0">Lorem ipsum dolor sit amet:</p>
                <p>{LEGAL_SECTION_BODY}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
