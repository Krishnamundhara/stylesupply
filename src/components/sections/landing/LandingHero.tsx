"use client";

import { useEffect, useRef } from "react";

interface LandingHeroProps {
  videoSrc?: string;
  videoSrcMobile?: string;
  videoLabel?: string;
}

const DEFAULTS = {
  videoSrc: "/videos/landing/hero_video_desktop.webm",
  videoSrcMobile: "/videos/landing/hero_video_mobile.webm",
  videoLabel: "Style Supply hero",
};

export default function LandingHero({
  videoSrc = DEFAULTS.videoSrc,
  videoSrcMobile = DEFAULTS.videoSrcMobile,
  videoLabel = DEFAULTS.videoLabel,
}: LandingHeroProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? videoSrcMobile : videoSrc;

    // iOS Safari requires an explicit load() call after setting src,
    // otherwise the video silently does nothing on first paint.
    video.load();

    // iOS Safari won't autoplay until it has buffered enough data.
    // Listening for `canplay` and calling play() explicitly is the
    // most reliable way to trigger autoplay after load().
    const handleCanPlay = () => {
      video.play().catch(() => {
        // Autoplay was blocked (e.g. Low Power Mode). Silently ignore —
        // the poster/background colour shows instead, which is acceptable.
      });
    };

    video.addEventListener("canplay", handleCanPlay);
    return () => video.removeEventListener("canplay", handleCanPlay);
  }, [videoSrc, videoSrcMobile]);

  return (
    <section className="w-full font-[var(--font-manrope)]">
      {/* Keep the desktop heading locked to the comp sizing and forced 2-line break. */}
      {/* Mobile: 34px (Figma 360px comp) | Desktop: 5.833vw (~84px at 1440) */}
      {/* Always 2 lines: "Your Private Boutique," / "Delivered." at every breakpoint. */}
      <div className="w-full px-[5vw] pt-[8.333vw] pb-[8.333vw] md:pt-[3.906vw] md:pb-[3.906vw] lg:pt-[70px] lg:pb-[70px]">
        <h1 className="mx-auto w-fit max-w-full text-center font-normal leading-[1.2] tracking-[-0.04em] text-black text-[9.4vw] md:text-[5.859vw] md:leading-[1.05] lg:text-[5.139vw] lg:leading-[1.05]">
          Your Private Boutique,
          <br />
          Delivered.
        </h1>
      </div>

      {/* Full-width hero video — edge to edge, responsive aspect ratio */}
      <div className="relative w-full">
        <div className="relative aspect-[362/530] w-full overflow-hidden bg-[#F7F4EF] md:aspect-[1440/720]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            // Do NOT set autoPlay here — we call play() manually in the
            // canplay handler so iOS Safari actually honours it.
            aria-label={videoLabel}
          />
        </div>
      </div>
    </section>
  );
}