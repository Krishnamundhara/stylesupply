"use client";

import { useEffect, useRef } from "react";

import { about } from "./aboutUsAssets";

export default function AboutHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? about.heroVideoMobile : about.heroVideoDesktop;

    // Reload after setting src so iOS Safari starts from the selected asset.
    video.load();

    const handleCanPlay = () => {
      video.play().catch(() => {
        // Autoplay may still be blocked by device settings; keep the frame visible.
      });
    };

    video.addEventListener("canplay", handleCanPlay);
    return () => video.removeEventListener("canplay", handleCanPlay);
  }, []);

  return (
    <section className="w-full overflow-x-clip bg-white font-[var(--font-manrope)] text-black">
      {/*
        Mobile — Figma node 1545-6363: 360-wide frame, white headline field, 19px gutters.
        Heading → image: 40px. Hero image: 360×560 (aspect 360/560), full viewport width.
      */}
      <div className="bg-white md:hidden">
        <div className="pb-[8.333vw] pt-[8.333vw]">
          <h1 className="mx-auto max-w-[20ch] text-center text-[9.4vw] font-normal leading-[1.2] tracking-[-0.04em] text-black">
            Premium fashion,
            <br />
            discovered with
            <br />
            intention not impulse.
          </h1>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex md:w-full md:flex-col md:items-center">
        <h1
          className="mx-auto mb-[3.906vw] mt-[3.906vw] lg:mb-[4.861vw] lg:mt-[4.861vw] w-fit max-w-full text-center text-black text-[5.859vw] lg:text-[5.139vw] font-normal leading-[1.05] tracking-[-0.04em]"
        >
          Premium fashion, discovered
          <br />
          with intention not impulse.
        </h1>
      </div>

      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[#E6E8EC]">
        <div className="relative w-full overflow-hidden h-[155.556vw] md:aspect-[1440/720] md:h-auto lg:aspect-none lg:h-[47.986vw]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[50%_42%] lg:object-center"
            loop
            muted
            playsInline
            aria-label="Premium fashion hero"
          />
        </div>
      </div>
    </section>
  );
}
