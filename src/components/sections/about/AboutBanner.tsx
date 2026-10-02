import Image from "next/image";
import { about } from "./aboutUsAssets";

export default function AboutBanner() {
  return (
    <section className="flex w-full flex-col bg-white font-[var(--font-manrope)]">
      {/* MOBILE — Figma 360×640 frame, dedicated art */}
      <div
        className="relative flex w-full flex-col md:hidden"
        style={{ aspectRatio: "360 / 640" }}
      >
        <Image
          src={about.bannerMobile}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <p
            className="w-full max-w-[90vw] text-center font-[var(--font-manrope)] font-normal leading-[1.15] tracking-[-0.04em] text-white"
            style={{
              fontSize: "11.111vw",
              textShadow: "0px 4px 44px rgba(0,0,0,1)",
            }}
          >
            Try With Intention.
            <br />
            Keep with
            <br />
            Confidence.
          </p>
        </div>
      </div>

      {/* DESKTOP — single image, headline centered via flex */}
      <div
        className="relative hidden w-full items-center justify-center overflow-hidden md:flex"
        style={{ aspectRatio: "1440 / 910" }}
      >
        <Image
          src={about.bannerNew}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        <p
          className="relative text-center font-normal text-white"
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "7.572vw",
            lineHeight: "normal",
            letterSpacing: "-0.04em",
            textShadow: "0px 4px 44px rgba(0,0,0,1)",
          }}
        >
          Try With Intention.
          <br />
          Keep with Confidence.
        </p>
      </div>
    </section>
  );
}
