"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  const [toastTop, setToastTop] = useState(104);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1440);

  const fontSize = vw < 768 ? `${(14 / 360) * 100}vw` : vw < 1024 ? `${(14 / 768) * 100}vw` : `${(14 / 1440) * 100}vw`;
  const iconSize = vw < 768 ? `${(20 / 360) * 100}vw` : vw < 1024 ? `${(20 / 768) * 100}vw` : `${(20 / 1440) * 100}vw`;
  const shadowBlur = vw < 768 ? `${(12 / 360) * 100}vw` : vw < 1024 ? `${(12 / 768) * 100}vw` : `${(12 / 1440) * 100}vw`;
  const shadowY = vw < 768 ? `${(4 / 360) * 100}vw` : vw < 1024 ? `${(4 / 768) * 100}vw` : `${(4 / 1440) * 100}vw`;
  // 300px mobile, 340px tablet, 360px desktop — in vw
  const toastWidth = vw < 768 ? `${(300 / 360) * 100}vw` : vw < 1024 ? `${(340 / 768) * 100}vw` : `${(360 / 1440) * 100}vw`;
  // padding: 12px mobile, 14px tablet, 16px desktop — drives height dynamically
  const toastPadding = vw < 768 ? `${(12 / 360) * 100}vw ${(16 / 360) * 100}vw` : vw < 1024 ? `${(14 / 768) * 100}vw ${(18 / 768) * 100}vw` : `${(16 / 1440) * 100}vw ${(20 / 1440) * 100}vw`;

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    let rafId: number;
    let transitionEnd: number = 0;
    const TRANSITION_MS = 550; // slightly longer than header's 500ms transition

    const measure = () => {
      const bottom = header.getBoundingClientRect().bottom;
      setToastTop(Math.max(10, bottom + 10));
    };

    // Poll via rAF during the transition window, then stop
    const poll = () => {
      measure();
      if (Date.now() < transitionEnd) {
        rafId = requestAnimationFrame(poll);
      }
    };

    const startPoll = () => {
      transitionEnd = Date.now() + TRANSITION_MS;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(poll);
    };

    const onResize = () => { setVw(window.innerWidth); startPoll(); };

    measure();
    window.addEventListener("scroll", startPoll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", startPoll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      containerStyle={{
        top: toastTop,
      }}
      toastOptions={{
        style: {
          background: "#F7F4EF",
          color: "#000000",
          borderRadius: "0px",
          fontFamily: "var(--font-manrope)",
          fontSize,
          width: toastWidth,
          maxWidth: toastWidth,
          padding: toastPadding,
          boxShadow: `0 ${shadowY} ${shadowBlur} rgba(0,0,0,0.08)`,
        },
        success: {
          icon: <img src="/icon/vuesax/linear/tick.svg" alt="success" style={{ width: iconSize, height: iconSize }} />,
        },
        error: {
          icon: <img src="/icon/vuesax/linear/red-cross.svg" alt="error" style={{ width: iconSize, height: iconSize }} />,
        },
      }}
    />
  );
}
