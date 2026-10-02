"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { HomeHeroContent, HomeUser } from "@/types/home";

interface HomeHeroProps {
  user: HomeUser;
  hero: HomeHeroContent;
}

export default function HomeHero({ user, hero }: HomeHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile
      ? "/videos/landing/hero_video_mobile.webm"
      : "/videos/landing/hero_video_desktop.webm";
    video.load();
    const handleCanPlay = () => {
      video.play().catch(() => {});
    };
    video.addEventListener("canplay", handleCanPlay);
    return () => video.removeEventListener("canplay", handleCanPlay);
  }, []);

  const headingClassName =
    "mx-auto text-center font-normal tracking-[-0.04em] text-black text-[9.444vw] md:text-[5.859vw] md:leading-[1.05] lg:text-[5.139vw] overflow-hidden";

  return (
    <div className="w-full font-[var(--font-manrope)] flex flex-col items-center">
      {/* Personalized welcome heading */}
      <div className="pt-[8.333vw] md:pt-[3.906vw] lg:pt-[4.861vw] pb-[8.333vw] md:pb-[3.906vw] lg:pb-[4.861vw] px-[5vw] lg:px-[70px] w-full">
        <h1 className={`${headingClassName} whitespace-nowrap`}>
          {hero.headingPrefix} {user.name.charAt(0).toUpperCase() + user.name.slice(1)}, You&rsquo;re In!
        </h1>
      </div>

      {/* Hero video */}
      <div className="relative w-full">
        <div className="relative aspect-[362/530] w-full overflow-hidden bg-[#F7F4EF] md:aspect-[1440/720]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            aria-label="Style Supply home hero"
          />
        </div>
      </div>

      {/* Large descriptor text */}
      <div className="mt-[27.778vw] md:mt-[13.021vw] lg:mt-[7.639vw] w-full px-[5vw] md:px-[8vw] lg:px-[12.5vw]">
        <p className="mx-auto text-center font-normal text-black leading-[1.2] tracking-[-0.05em] text-[9.444vw] md:text-[5.859vw] lg:text-[5.139vw]">
          <span className="md:hidden">Choose 5 designer<br />pieces. Delivered in 24<br />hours. Try at home.<br />Keep what you love.</span>
          <span className="hidden md:inline">
            Choose 5 designer pieces.<br />
            Delivered in 24 hours. Try at home.<br />
            Keep what you love.
          </span>
        </p>
      </div>

      {/* Membership note */}
      <div className="mt-[30px]">
        <p className="text-center font-medium text-black text-[4.444vw] md:text-[2.344vw] lg:text-[1.667vw] leading-[1.4] tracking-[-0.02em]">
          Membership is by invitation only.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="mt-[30px]">
        <Link
          href={hero.ctaHref}
          className="flex h-[16.667vw] w-[55.556vw] items-center justify-center rounded-full bg-[#7A021D] text-[3.889vw] font-medium text-white md:h-[7.813vw] md:w-[26.042vw] md:text-[1.823vw] lg:h-[5.556vw] lg:w-[16.667vw] lg:text-[1.389vw]"
        >
          {hero.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
