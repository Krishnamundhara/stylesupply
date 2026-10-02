"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useLaunchMode } from "@/hooks/useLaunchMode";

const FOOTER_LOGOMARK_SRC = "/logo/ss logomark.svg";
const FOOTER_SUBMIT_ARROW_SRC = "/icon/arrow.svg";
const PIXELS_LOGO_SRC = "/logo/pixels_logo.svg";

type SubmitState = "idle" | "loading" | "success" | "duplicate";

const RIGHT_NAV = [
  { label: "Browse", href: "/products" },
  { label: "By Brands", href: "/brands" },
  { label: "By Collection", href: "/collections" },
] as const;

const MOBILE_NAV = [
  { label: "Browse", href: "/products" },
  { label: "By Brands", href: "/brands" },
  { label: "By Collection", href: "/collections" },
] as const;

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/stylesupply.io", icon: "/logo/instagram.svg" },
  { label: "Pinterest", href: "https://pin.it/3mwLIMfyU", icon: "/logo/pintrest.svg" },
  { label: "X", href: "https://x.com/mystylesupply", icon: "/logo/x.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/style-supply-co/", icon: "/logo/linkedin.svg" },
] as const;

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      aria-label="Subscribe"
      disabled={loading}
      className="flex h-[9.722vw] w-[9.722vw] md:h-[4.557vw] md:w-[4.557vw] lg:h-[2.431vw] lg:w-[2.431vw] shrink-0 items-center justify-center rounded-full bg-white"
    >
      {loading ? (
        <svg className="h-[6.111vw] w-[6.111vw] md:h-[2.865vw] md:w-[2.865vw] lg:h-[1.528vw] lg:w-[1.528vw] animate-spin text-[#7A021D]" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="40 20" />
        </svg>
      ) : (
        <Image src={FOOTER_SUBMIT_ARROW_SRC} alt="" width={15} height={15} className="h-[4.167vw] w-[4.167vw] md:h-[1.953vw] md:w-[1.953vw] lg:h-[1.042vw] lg:w-[1.042vw] object-contain" aria-hidden />
      )}
    </button>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const { isLive } = useLaunchMode();

  const BOTTOM_NAV = [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Legal", href: isLive ? "/legal" : "/coming-soon" },
  ] as const;

  const MOBILE_BOTTOM_NAV = BOTTOM_NAV;

  const isLoading = submitState === "loading";
  const isDone = submitState === "success" || submitState === "duplicate";

  const placeholderText =
    submitState === "success"
      ? "Thank you for subscribing!"
      : submitState === "duplicate"
      ? "You have already subscribed, thank you!"
      : "Enter Email Address";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || isLoading || isDone) return;
    setSubmitState("loading");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-ss.vercel.app";
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status === 409 || (data.error && /already/i.test(data.error))) {
        setSubmitState("duplicate");
      } else if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      } else {
        setSubmitState("success");
      }
      setEmail("");
      setTimeout(() => setSubmitState("idle"), 3000);
    } catch {
      setSubmitState("idle");
    }
  }

  return (
    <footer className="bg-[#7A021D] font-[var(--font-manrope)] text-white">

      {/* ── MOBILE + TABLET ────────────────────────────────────── */}
      <div className="lg:hidden w-full px-[5.556vw] md:px-[5.208vw] pt-[11.111vw] md:pt-[7.813vw] pb-[13.889vw] md:pb-[9.115vw] flex flex-col gap-[5.556vw] md:gap-[3.906vw]">

        {/* Newsletter */}
        <h2 className="text-[8.333vw] md:text-[5.208vw] font-normal leading-[1.2] tracking-[-0.04em] w-[76.667vw] md:w-[54.688vw]">
          Join the exclusive Style Supply Circle
        </h2>

        {/* Email form */}
        <div>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="footer-email-mobile" className="sr-only">Email address</label>
            <div className="flex items-center justify-between pb-[3.889vw] md:pb-[2.604vw]">
              <input
                id="footer-email-mobile"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholderText}
                disabled={isLoading || isDone}
                className="min-w-0 flex-1 h-[12.222vw] md:h-[5.729vw] border-0 bg-transparent text-[4.444vw] md:text-[2.604vw] font-medium leading-[1.1] text-white outline-none placeholder:text-white pr-3"
              />
              <SubmitButton loading={isLoading} />
            </div>
            <div className="h-px w-full bg-white" aria-hidden />
            <p className="mt-[3.333vw] md:mt-[1.953vw] text-[3.333vw] md:text-[1.823vw] font-medium leading-[1.2]">
              Currently active only in Mumbai, India
            </p>
          </form>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-[4.167vw] md:gap-[2.604vw] mt-[1.389vw] md:mt-[1.302vw]">
          {SOCIAL_LINKS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              <Image src={s.icon} alt={s.label} width={30} height={30} className="h-[8.333vw] w-[8.333vw] md:h-[3.906vw] md:w-[3.906vw] object-contain" />
            </a>
          ))}
        </div>

        {/* Nav links */}
        <nav aria-label="Footer" className="flex flex-col gap-[4.167vw] md:gap-[2.604vw] mt-[1.389vw] md:mt-[1.302vw]">
          {MOBILE_NAV.map((link, i) => (
            <Link key={i} href={isLive ? link.href : "/coming-soon"} className="text-[3.889vw] md:text-[2.344vw] font-medium leading-[1.2] tracking-[-0.04em]">
              {link.label.startsWith("By ") ? <><span className="mr-[1.389vw] md:mr-[0.651vw]">By</span>{link.label.slice(3)}</> : link.label}
            </Link>
          ))}
        </nav>

        {/* Ornament */}
        <div className="flex justify-center mt-[5.556vw] md:mt-[5.208vw] mb-[5.556vw] md:mb-[5.208vw]">
          <Image src={FOOTER_LOGOMARK_SRC} alt="StyleSupply" width={162} height={194} className="h-auto w-[45vw] md:w-[28.646vw]" />
        </div>

        {/* Bottom nav row */}
        <div className="flex items-center justify-center gap-[8.333vw] md:gap-[6.51vw] flex-wrap">
          {MOBILE_BOTTOM_NAV.map((link) => (
            <Link key={link.label} href={link.href} className="text-[3.889vw] md:text-[2.344vw] lg:text-[1.111vw] font-medium leading-[normal] tracking-[0.02em] whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Pixels + copyright */}
        <div className="flex items-end justify-between mt-[5.556vw] md:mt-[1.302vw]">
          <div className="flex flex-col gap-[3.333vw] md:gap-[1.953vw]">
            <Image src={PIXELS_LOGO_SRC} alt="" width={15} height={14} className="h-[3.889vw] w-[4.167vw] md:h-[2.344vw] md:w-[2.344vw] object-contain" aria-hidden />
            <p className="text-[3.333vw] md:text-[1.823vw] font-medium leading-[1.5] tracking-[-0.02em] w-[37.222vw] md:w-[20.833vw]">
              Designed By Pixels Creative Technologies
            </p>
          </div>
          <div className="flex flex-col items-end gap-[1.389vw] md:gap-[0.651vw]">
            <p className="text-[3.333vw] md:text-[1.823vw] font-medium leading-[1.2] tracking-[-0.02em]">
              ©<span className="ml-[1.667vw] md:ml-[0.781vw]">2026</span>
            </p>
            <p className="text-[3.333vw] md:text-[1.823vw] font-medium leading-[1.2] tracking-[-0.02em]">Style Supply</p>
          </div>
        </div>

      </div>

      {/* ── DESKTOP ────────────────────────────────────────────── */}
      <div className="hidden lg:block w-full">
        <div className="relative w-full min-h-[47.222vw] px-[2.5vw]">

          {/* Ornament — absolutely centered in the footer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src={FOOTER_LOGOMARK_SRC}
              alt="StyleSupply"
              width={292}
              height={350}
              className="h-auto w-[20.278vw]"
            />
          </div>

          {/* Content layer */}
          <div className="relative flex flex-col min-h-[47.222vw] pb-[2.778vw]">

            {/* Top row: left CTA + right nav */}
            <div className="flex justify-between pt-[3.472vw]">

              {/* LEFT — Newsletter */}
              <div className="flex flex-col w-[22.222vw]">
                <h2 className="text-[2.361vw] font-normal leading-[1.2] tracking-[-0.04em]">
                  Join the exclusive Style Supply Circle
                </h2>
                <form onSubmit={handleSubmit} className="mt-[1.736vw] w-full" noValidate>
                  <label htmlFor="footer-email-desktop" className="sr-only">Email address</label>
                  <div className="flex items-center justify-between pb-[0.694vw]">
                    <input
                      id="footer-email-desktop"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={placeholderText}
                      disabled={isLoading || isDone}
                      className="min-w-0 flex-1 h-[3.056vw] border-0 bg-transparent text-[1.111vw] font-medium leading-[1.1] text-white outline-none placeholder:text-white pr-3"
                    />
                    <SubmitButton loading={isLoading} />
                  </div>
                  <div className="h-px w-full bg-white" aria-hidden />
                  <p className="mt-[0.972vw] text-[0.972vw] font-medium leading-[1.2]">
                    Currently active only in Mumbai, India
                  </p>
                </form>

                {/* Social icons — below form on left */}
                <div className="mt-[1.736vw] flex items-center gap-[1.389vw]">
                  {SOCIAL_LINKS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <Image src={s.icon} alt={s.label} width={30} height={30} className="h-[2.083vw] w-[2.083vw] object-contain" />
                    </a>
                  ))}
                </div>
              </div>

              {/* RIGHT — Nav links */}
              <nav aria-label="Footer" className="flex flex-col items-end gap-[1.389vw] pt-[0.278vw]">
                {RIGHT_NAV.map((link, i) => (
                  <Link key={i} href={isLive ? link.href : "/coming-soon"} className="text-[1.111vw] font-medium leading-[1.2] tracking-[-0.04em] text-right whitespace-nowrap">
                    {link.label.startsWith("By ") ? <><span className="mr-[0.347vw]">By</span>{link.label.slice(3)}</> : link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom bar */}
            <div className="mt-auto pt-[4.167vw] flex flex-col gap-[1.389vw]">

              {/* Pixels — standalone row */}
              <div className="flex flex-col gap-[1.389vw]">
                <Image src={PIXELS_LOGO_SRC} alt="" width={15} height={14} className="h-[0.972vw] w-[1.042vw] shrink-0 object-contain" aria-hidden />
                <p className="text-[0.833vw] font-medium leading-[1.4] tracking-[-0.04em] w-[8.611vw]">
                  Designed By Pixels Creative Technologies
                </p>
              </div>

              {/* Bottom nav + copyright row */}
              <div className="flex items-center justify-between">
                <nav aria-label="Footer secondary" className="flex items-center gap-[2.778vw]">
                  {BOTTOM_NAV.map((link) => (
                    <Link key={link.label} href={link.href} className="text-[1.111vw] font-medium leading-[normal] tracking-[0.02em] whitespace-nowrap">
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <p className="text-[0.833vw] font-medium leading-[1.2] tracking-[-0.04em]">
                  ©<span className="ml-[0.417vw]">2026</span><span className="ml-[0.694vw]">Style Supply</span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
