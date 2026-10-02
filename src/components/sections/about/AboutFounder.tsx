import Image from "next/image";
import { about } from "./aboutUsAssets";

const maroon = "#7A021D";

const founderNoteParts = [
  "For me, style has always been about expression. Across different phases of my life, it became a way of understanding myself more deeply and growing into who I am. It gave me confidence in my authenticity, and a certain comfort in being fully myself. In many ways, style has always felt like second skin.",
  "But discovering fashion today often feels disconnected from that. There is so much out there, yet so little that feels truly aligned. We are building Style Supply to bring back the joy of discovery and the freedom to interact with fashion more fluidly, to explore different pieces, different moods, and different versions of yourself as you evolve.",
] as const;

export default function AboutFounder() {
  return (
    <section className="w-full bg-white font-[var(--font-manrope)] text-black">
      {/* MOBILE */}
      <div className="px-[5.556vw] md:hidden">
        <div className="mx-auto flex w-full flex-col items-center gap-[8.333vw]">
          <div className="flex w-full flex-col items-center justify-center gap-[2.222vw] text-center">
            <h2
                className="w-full text-center font-[var(--font-manrope)] font-normal capitalize leading-none tracking-[-0.04em]"
              style={{ color: maroon, fontSize: "12.222vw" }}
            >
              Shivani Mehta
            </h2>
            <p className="text-[4.167vw] font-medium leading-normal tracking-[-0.02em] text-black">
              Founders Note
            </p>
          </div>
          <div className="relative w-full">
            <div className="relative mx-auto aspect-[360/480] w-full overflow-hidden">
              <Image
                src={about.founderPortrait}
                alt="Portrait of Shivani Mehta"
                fill
                className="object-cover object-[50%_28%]"
                sizes="100vw"
              />
            </div>
            <aside className="relative z-10 mx-auto mt-[1.736vw] w-full bg-[#F7F4EF] px-[5.556vw] py-[8.333vw] text-left text-[4.167vw] font-medium leading-[1.5] tracking-[-0.04em] text-black">
              <p>{founderNoteParts[0]}</p>
              <p className="mt-[4.444vw]">{founderNoteParts[1]}</p>
            </aside>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div
        className="hidden w-full flex-col items-center md:flex"
        style={{ gap: "2.569vw" }}
      >
        <div className="flex flex-col items-center" style={{ gap: "1.736vw" }}>
          <h2
            className="text-center font-[var(--font-manrope)] font-normal capitalize text-[5.859vw] lg:text-[5.139vw] leading-none tracking-[-0.04em]"
            style={{ color: maroon }}
          >
            Shivani Mehta
          </h2>
          <p
            className="text-center font-medium text-black text-[2.344vw] lg:text-[1.67vw] leading-normal tracking-[-0.02em]"
          >
            Founders Note
          </p>
        </div>

        <div className="relative mx-auto w-[32.6vw] max-w-full pb-[33.854vw] lg:pb-[9.722vw]">
          <div className="relative aspect-[470/620] w-full overflow-hidden">
            <Image
              src={about.founderPortrait}
              alt="Portrait of Shivani Mehta"
              fill
              className="object-cover object-[center_30%]"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </div>

          <aside className="absolute bottom-0 md:bottom-auto md:top-[38%] lg:top-auto lg:bottom-0 left-[70%] lg:left-[56%] z-10 w-[36.458vw] lg:w-[23.611vw] bg-[#F7F4EF] px-[2.083vw] lg:px-[1.75vw] py-[2.083vw] lg:py-[1.389vw] text-[1.823vw] lg:text-[1.111vw] font-medium leading-[1.35] tracking-[-0.04em] text-black xl:left-[58%]">
            <p>{founderNoteParts[0]}</p>
            <p className="mt-[1em]">{founderNoteParts[1]}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
