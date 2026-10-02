"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLaunchMode } from "@/hooks/useLaunchMode";
import { brandsApi } from "@/services/brands";
import type { Brand } from "@/types/brand";
import { TEMP_COLLECTIONS } from "@/components/sections/collections/collectionsLandingData";
import SearchOverlay from "./SearchOverlay";

const WORDMARK = "/logo/Stylesupply_wordmark.svg";
const WORDMARK_W = 220;
const WORDMARK_H = 30;
const WORDMARK_MOBILE_W = 150;
const WORDMARK_MOBILE_H = 20;
const ICON_SEARCH = "/icon/vuesax/linear/search-normal.svg";
const ICON_HEART = "/icon/vuesax/linear/heart-menu.svg";
const ICON_BOX = "/icon/vuesax/linear/box.svg";
const ICON_USER = "/icon/vuesax/linear/user.svg";
const ICON_SEARCH_RED = "/icon/vuesax/linear/search-normal-red.svg";
const ICON_HEART_RED = "/icon/vuesax/linear/heart-menu-red.svg";
const ICON_BOX_RED = "/icon/vuesax/linear/box-red.svg";
const ICON_USER_RED = "/icon/vuesax/linear/user-red.svg";
const ICON_MENU = "/icon/vuesax/linear/hamburger.svg";
const ICON_CROSS = "/icon/vuesax/linear/cross.svg";
const MENU_HERO_MOBILE = "/images/menu/menu-mobile.webp";
const MENU_HERO_DESKTOP = "/images/menu/menu-desktop.webp";
const LOGO_WHITE = "/logo/white.svg";
const TOP_BAR_PREFIX_MOBILE = "Membership by invite only.";
const TOP_BAR_PREFIX_DESKTOP = "Membership by invite only.";
const TOP_BAR_CTA = "Request Access";

/** Hit target — scales with viewport: 8.333vw mobile (30px), 3.906vw tablet (30px), 2.778vw desktop (40px) */
const actionIconWrap =
  "inline-flex h-[8.333vw] w-[8.333vw] md:h-[3.906vw] md:w-[3.906vw] lg:h-[2.778vw] lg:w-[2.778vw] shrink-0 items-center justify-center text-[#292D32]";

/** All glyphs: 20px mobile/tablet, 25px desktop — vw units */
const actionIconImg = "h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain object-center";

/** Horizontal padding: 15px mobile, 20px tablet, 40px desktop */
const headerPaddingX = "px-[4.167vw] md:px-[2.604vw] lg:px-[2.778vw]";
const headerInset = `w-full ${headerPaddingX}`;
const topBarInset = `w-full ${headerPaddingX}`;
/** Top bar height: 40px mobile = 11.111vw, 40px tablet = 5.208vw, 40px desktop = 2.778vw */
const topBarRowClass = "flex h-[11.111vw] md:h-[5.208vw] lg:h-[2.778vw] items-center justify-center";
const topBarTextClass =
  "cursor-default flex items-center justify-center gap-3 whitespace-nowrap font-[var(--font-manrope)] text-center text-[3.333vw] md:text-[1.953vw] lg:text-[1.042vw] font-medium tracking-[-0.01em] text-white leading-[1.2]";
const topBarLinkClass =
  "inline-flex items-center gap-1 font-medium underline underline-offset-[3px]";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenuCol1, setActiveMenuCol1] = useState<"browse" | "brands" | "collections">("browse");
  const [mobileBrowseOpen, setMobileBrowseOpen] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const lastScrollY = useRef(0);
  const footerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated } = useAuth();
  const { isLive } = useLaunchMode();

  useEffect(() => {
    brandsApi.getAll().then(({ brands }) => setBrands(brands)).catch(() => {});
  }, []);

  const NAV_ITEMS = useMemo(() => [
    { label: "Browse", href: isLive ? "/products" : "/coming-soon" },
    { label: "How It Works", href: "/howitworks" },
    { label: "Membership", href: isLive ? (isAuthenticated ? "/accounts/membership" : "/login") : "/coming-soon" },
  ], [isLive, isAuthenticated]);

  const boxHref = isLive ? (isAuthenticated ? "/box/my-box" : "/login") : "/coming-soon";
  const wishlistHref = isLive ? (isAuthenticated ? "/wishlist" : "/login") : "/coming-soon";
  const accountHref = isLive ? (isAuthenticated ? "/accounts" : "/login") : "/coming-soon";

  const isAccountSection = pathname.startsWith("/accounts") || pathname === "/help";
  const isLegalPage = pathname === "/legal";

  const isWishlistActive = !searchOpen && pathname.startsWith("/wishlist");
  const isBoxActive = !searchOpen && pathname.startsWith("/box");
  const isAccountActive = !searchOpen && (pathname.startsWith("/accounts") || pathname.startsWith("/login"));
  const isSearchIconActive = searchOpen;

  const hideScrollThreshold = isAccountSection ? 188 : 50;
  useEffect(() => {
    // Smoothly hide/reveal the sticky header on scroll direction changes.
    let ticking = false;
    const THRESHOLD = 5;

    const isFooterInView = () => {
      if (!footerRef.current) {
        footerRef.current = document.querySelector("footer");
      }

      const footer = footerRef.current;
      if (!footer) return false;

      const rect = footer.getBoundingClientRect();
      return rect.top <= window.innerHeight;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;
        const footerVisible = isFooterInView();

        setScrolled(currentY > 10);

        if (!isLegalPage && footerVisible) {
          setHidden(false);
          lastScrollY.current = currentY;
          ticking = false;
          return;
        }

        if (isLegalPage) {
          setHidden(currentY > hideScrollThreshold);
        } else if (Math.abs(delta) > THRESHOLD) {
          setHidden(delta > 0 && currentY > hideScrollThreshold);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    if (isAccountSection) {
      setTimeout(() => setHidden(false), 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAccountSection, isLegalPage, hideScrollThreshold]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => {
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      const t = setTimeout(() => {
        setActiveMenuCol1("browse");
        setMobileBrowseOpen(false);
        setMobileBrandsOpen(false);
        setMobileCollectionsOpen(false);
      }, 0);
      return () => clearTimeout(t);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  return (
    <>
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* Top announcement strip — full bleed */}
      <div className="w-full bg-[#7A021D]">
        <div className={`${topBarInset} ${topBarRowClass}`}>
          {isAuthenticated ? (
            <p className={topBarTextClass}>
              Your first box, on us. Use credit code &ldquo;FIRST25&rdquo; at checkout.
            </p>
          ) : (
            <p className={topBarTextClass}>
              <span className="md:hidden">{TOP_BAR_PREFIX_MOBILE}</span>
              <span className="hidden md:inline">{TOP_BAR_PREFIX_DESKTOP}</span>
              <Link href="/request-access" className={topBarLinkClass}>
                <span>{TOP_BAR_CTA}</span>
                <Image src="/icon/arrow-white.svg" alt="" width={11} height={7} aria-hidden="true" />
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Desktop header — full-bleed row, fluid padding (no max-width wrapper) */}
      <div className="hidden lg:block w-full min-w-0">
        <div className={`${headerInset} min-w-0`}>
          <div className="grid lg:min-h-[5vw] w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-[1.389vw] lg:py-0">
            <Link href="/" className="min-w-0 shrink-0 justify-self-start">
              <Image
                src={WORDMARK}
                alt="StyleSupply"
                width={WORDMARK_W}
                height={WORDMARK_H}
                priority
                className="shrink-0 object-contain object-left"
                style={{ width: WORDMARK_W, height: WORDMARK_H }}
              />
            </Link>

            <nav className="min-w-0 justify-self-center lg:px-[0.694vw]" aria-label="Primary">
              <ul className={`flex flex-wrap items-center justify-center lg:gap-x-[2.5vw] gap-y-1 ${mobileMenuOpen ? "invisible" : ""}`}>
                {NAV_ITEMS.map((item) => (
                  <li key={item.label} className="shrink-0">
                    <Link
                      href={item.href}
                      className="font-[var(--font-manrope)] lg:text-[1.111vw] font-semibold tracking-[0.02em] whitespace-nowrap text-black"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center justify-self-end gap-0.5 sm:gap-1 text-[#292D32]">
              <button type="button" aria-label="Search" className={actionIconWrap} onClick={() => isLive ? setSearchOpen(true) : (window.location.href = "/coming-soon")}>
                <Image src={isSearchIconActive ? ICON_SEARCH_RED : ICON_SEARCH} alt="" width={24} height={24} className={actionIconImg} />
              </button>
              <Link href={wishlistHref} aria-label="Wishlist" className={actionIconWrap}>
                <Image src={isWishlistActive ? ICON_HEART_RED : ICON_HEART} alt="" width={24} height={24} className={actionIconImg} />
              </Link>
              <Link href={boxHref} aria-label="My Box" className={actionIconWrap}>
                <Image src={isBoxActive ? ICON_BOX_RED : ICON_BOX} alt="" width={24} height={24} className={actionIconImg} />
              </Link>
              <Link
                href={accountHref}
                aria-label="Account"
                className={actionIconWrap}
              >
                <Image src={isAccountActive ? ICON_USER_RED : ICON_USER} alt="" width={24} height={24} className={actionIconImg} />
              </Link>
              {isLive ? (
                <button
                  type="button"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  className={actionIconWrap}
                >
                  {mobileMenuOpen ? (
                    <Image src={ICON_CROSS} alt="" width={27} height={19} className={actionIconImg} />
                  ) : (
                    <Image src={ICON_MENU} alt="" width={29} height={22} className={actionIconImg} />
                  )}
                </button>
              ) : (
                <Link href="/coming-soon" aria-label="Menu" className={actionIconWrap}>
                  <Image src={ICON_MENU} alt="" width={29} height={22} className={actionIconImg} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + tablet header */}
      <div className="lg:hidden flex w-full flex-col bg-white px-[4.167vw] md:px-[1.953vw]">
        <div className="flex min-h-[16.667vw] md:min-h-[7.813vw] items-center justify-between">
          <Link href="/" className="min-w-0 shrink-0">
            <Image
              src={WORDMARK}
              alt="StyleSupply"
              width={WORDMARK_MOBILE_W}
              height={WORDMARK_MOBILE_H}
              priority
              className="shrink-0 object-contain object-left"
              style={{ width: WORDMARK_MOBILE_W, height: WORDMARK_MOBILE_H }}
            />
          </Link>

          <div className="flex items-center gap-[2.778vw] md:gap-[1.302vw]">
            <button type="button" aria-label="Search" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]" onClick={() => isLive ? setSearchOpen(true) : (window.location.href = "/coming-soon")}>
              <Image src={isSearchIconActive ? ICON_SEARCH_RED : ICON_SEARCH} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </button>
            <Link href={wishlistHref} aria-label="Wishlist" title="Wishlist" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]">
              <Image src={isWishlistActive ? ICON_HEART_RED : ICON_HEART} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </Link>
            <Link href={boxHref} aria-label="My Box" title="My Box" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]">
              <Image src={isBoxActive ? ICON_BOX_RED : ICON_BOX} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </Link>
            <Link
              href={accountHref}
              aria-label="Account"
              title={isAuthenticated ? "My Account" : "Sign In"}
              className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]"
            >
              <Image src={isAccountActive ? ICON_USER_RED : ICON_USER} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </Link>
            {isLive ? (
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]"
              >
                {mobileMenuOpen ? (
                  <Image src={ICON_CROSS} alt="" width={27} height={19} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
                ) : (
                  <Image src={ICON_MENU} alt="" width={29} height={22} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
                )}
              </button>
            ) : (
              <Link href="/coming-soon" aria-label="Menu" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]">
                <Image src={ICON_MENU} alt="" width={29} height={22} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
              </Link>
            )}
          </div>
        </div>
      </div>

    </header>

    {/* Mobile full-screen menu */}
    {mobileMenuOpen && (
      <div
        className="fixed inset-0 z-[100] flex h-[100dvh] flex-col overflow-hidden bg-white lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        {/* Top bar */}
        <div className="w-full shrink-0 bg-[#7A021D]">
          <div className={`${topBarInset} ${topBarRowClass}`}>
            {isAuthenticated ? (
              <p className={topBarTextClass}>
                Your first box, on us. Use credit code &ldquo;FIRST25&rdquo; at checkout.
              </p>
            ) : (
              <p className={topBarTextClass}>
                <span className="md:hidden">{TOP_BAR_PREFIX_MOBILE}</span>
                <span className="hidden md:inline">{TOP_BAR_PREFIX_DESKTOP}</span>
                <Link href="/request-access" onClick={() => setMobileMenuOpen(false)} className={topBarLinkClass}>
                  <span>{TOP_BAR_CTA}</span>
                  <Image src="/icon/arrow-white.svg" alt="" width={11} height={7} aria-hidden="true" />
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Header row */}
        <div className="flex min-h-[16.667vw] md:min-h-[7.813vw] shrink-0 items-center justify-between px-[4.167vw] md:px-[1.953vw]">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="min-w-0 shrink-0">
            <Image
              src={WORDMARK}
              alt="StyleSupply"
              width={WORDMARK_MOBILE_W}
              height={WORDMARK_MOBILE_H}
              priority
              className="shrink-0 object-contain object-left"
              style={{ width: WORDMARK_MOBILE_W, height: WORDMARK_MOBILE_H }}
            />
          </Link>
          <div className="flex items-center gap-[2.778vw] md:gap-[1.302vw]">
            <button type="button" aria-label="Search" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]" onClick={() => { setMobileMenuOpen(false); isLive ? setSearchOpen(true) : (window.location.href = "/coming-soon"); }}>
              <Image src={isSearchIconActive ? ICON_SEARCH_RED : ICON_SEARCH} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </button>
            <Link href={wishlistHref} aria-label="Wishlist" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]" onClick={() => setMobileMenuOpen(false)}>
              <Image src={isWishlistActive ? ICON_HEART_RED : ICON_HEART} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </Link>
            <Link href={boxHref} aria-label="My Box" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]" onClick={() => setMobileMenuOpen(false)}>
              <Image src={isBoxActive ? ICON_BOX_RED : ICON_BOX} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </Link>
            <Link href={accountHref} aria-label="Account" className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]" onClick={() => setMobileMenuOpen(false)}>
              <Image src={isAccountActive ? ICON_USER_RED : ICON_USER} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </Link>
            <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="inline-flex h-[5.556vw] w-[5.556vw] md:h-[3.906vw] md:w-[3.906vw] shrink-0 items-center justify-center text-[#292D32]">
              <Image src={ICON_CROSS} alt="" width={20} height={20} className="h-[5.556vw] w-[5.556vw] md:h-[2.604vw] md:w-[2.604vw] lg:h-[1.736vw] lg:w-[1.736vw] object-contain" />
            </button>
          </div>
        </div>

        {/* Nav panel — #fffcf7 */}
        <div className="shrink-0 bg-[#fffcf7] px-[5vw] md:px-[2.344vw] pt-[5.556vw] md:pt-[3.255vw] pb-[5.556vw] md:pb-[3.255vw] mx-[1.389vw] md:mx-[0.651vw]">
          <nav className="flex flex-col gap-[8.333vw] md:gap-[3.906vw]" aria-label="Primary">
            <button
              type="button"
              onClick={() => setMobileBrowseOpen(true)}
              className="flex items-center justify-between w-full font-[var(--font-manrope)] text-[7.222vw] md:text-[4.688vw] font-medium leading-[1.1] tracking-[-0.04em] text-black"
            >
              <Link
                href="/products"
                onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                className="text-left"
              >
                Browse All
              </Link>
              <span>›</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileBrandsOpen(true)}
              className="flex items-center justify-between w-full font-[var(--font-manrope)] text-[7.222vw] md:text-[4.688vw] font-medium leading-[1.1] tracking-[-0.04em] text-black"
            >
              <Link
                href="/brands"
                onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                className="text-left"
              >
                By Brand
              </Link>
              <span>›</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileCollectionsOpen(true)}
              className="flex items-center justify-between w-full font-[var(--font-manrope)] text-[7.222vw] md:text-[4.688vw] font-medium leading-[1.1] tracking-[-0.04em] text-black"
            >
              <Link
                href="/collections"
                onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                className="text-left"
              >
                By Collections
              </Link>
              <span>›</span>
            </button>
          </nav>
          <div className="mt-[16.667vw] md:mt-[13.021vw] flex flex-col gap-[4.167vw]">
            <Link href="/howitworks" onClick={() => setMobileMenuOpen(false)} className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-semibold tracking-[-0.04em] text-black">How it Works</Link>
            <Link href="/accounts/membership" onClick={() => setMobileMenuOpen(false)} className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-semibold tracking-[-0.04em] text-black">Membership</Link>
            <Link href="/accounts/help" onClick={() => setMobileMenuOpen(false)} className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-semibold tracking-[-0.04em] text-black">Contact Us</Link>
          </div>
        </div>

        {/* Browse All sub-panel — slides in below the header rows, over nav + hero only */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 flex flex-col overflow-y-auto bg-[#fffcf7] transition-transform duration-300 ease-in-out ${mobileBrowseOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ top: "calc(11.111vw + 16.667vw)" }}
        >
          <div className="flex min-h-[13.889vw] md:min-h-[6.51vw] shrink-0 items-center border-b border-black/[0.06] px-[4.167vw] md:px-[1.953vw]">
            <button
              type="button"
              onClick={() => setMobileBrowseOpen(false)}
              className="font-[var(--font-manrope)] text-[7.222vw] font-medium text-black leading-none"
            >
              ‹
            </button>
          </div>
          <div className="flex-1 px-[6.944vw] md:px-[3.255vw] py-[8.333vw] md:py-[3.906vw]">
            <div className="flex flex-col gap-[40px]">
              <div>
                <p className="mb-[20px] font-[var(--font-manrope)] text-[6.111vw] md:text-[3.906vw] font-medium tracking-[-0.048em] text-black">Clothing</p>
                <div className="flex flex-col gap-[15px]">
                  {["Tops", "Bottoms", "Dresses", "Jackets", "Co-ord Sets"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-medium tracking-[-0.03em] text-black"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-[20px] font-[var(--font-manrope)] text-[6.111vw] md:text-[3.906vw] font-medium tracking-[-0.048em] text-black">Accessories</p>
                <div className="flex flex-col gap-[15px]">
                  {["Handbags", "Jewellery"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-medium tracking-[-0.03em] text-black"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* By Brand sub-panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 flex flex-col overflow-y-auto bg-[#fffcf7] transition-transform duration-300 ease-in-out ${mobileBrandsOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ top: "calc(11.111vw + 16.667vw)" }}
        >
          <div className="flex min-h-[13.889vw] md:min-h-[6.51vw] shrink-0 items-center border-b border-black/[0.06] px-[4.167vw] md:px-[1.953vw]">
            <button
              type="button"
              onClick={() => setMobileBrandsOpen(false)}
              className="font-[var(--font-manrope)] text-[7.222vw] font-medium text-black leading-none"
            >
              ‹
            </button>
          </div>
          <div className="flex-1 px-[6.944vw] md:px-[3.255vw] py-[8.333vw] md:py-[3.906vw]">
            <div className="flex flex-col gap-[15px]">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-medium tracking-[-0.03em] text-black"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* By Collections sub-panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 flex flex-col overflow-y-auto bg-[#fffcf7] transition-transform duration-300 ease-in-out ${mobileCollectionsOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ top: "calc(11.111vw + 16.667vw)" }}
        >
          <div className="flex min-h-[13.889vw] md:min-h-[6.51vw] shrink-0 items-center border-b border-black/[0.06] px-[4.167vw] md:px-[1.953vw]">
            <button
              type="button"
              onClick={() => setMobileCollectionsOpen(false)}
              className="font-[var(--font-manrope)] text-[7.222vw] font-medium text-black leading-none"
            >
              ‹
            </button>
          </div>
          <div className="flex-1 px-[6.944vw] md:px-[3.255vw] py-[8.333vw] md:py-[3.906vw]">
            <div className="flex flex-col gap-[15px]">
              {TEMP_COLLECTIONS.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-[var(--font-manrope)] text-[3.889vw] md:text-[2.344vw] font-medium tracking-[-0.03em] text-black"
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#4b0716] mt-[2.778vw] md:mt-[1.302vw]">
          <Image
            src={MENU_HERO_MOBILE}
            alt=""
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
          <Image
            src={LOGO_WHITE}
            alt=""
            width={295}
            height={340}
            className="absolute right-[22px] top-[22px] h-[17.778vw] w-auto object-contain"
          />
          <div className="absolute inset-x-0 bottom-[5dvh] flex justify-center">
            <Link
              href="/box/my-box"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-[16.667vw] md:h-[7.813vw] w-[55.556vw] md:w-[26.042vw] shrink-0 items-center justify-center rounded-full border border-[#7A021D] bg-white font-[var(--font-manrope)] text-[3.889vw] md:text-[1.823vw] font-semibold tracking-[-0.02em] text-[#7A021D]"
            >
              Build Your Box
            </Link>
          </div>
        </div>
      </div>
    )}

    {/* Desktop / tablet full-screen menu — Figma Menu_D (1592:5402) */}
    {mobileMenuOpen && (
      <div
        className="fixed inset-0 z-[100] hidden h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-white lg:flex"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="w-full shrink-0 bg-[#7A021D]">
          <div className={`${headerInset} ${topBarRowClass}`}>
            {isAuthenticated ? (
              <p className={topBarTextClass}>
                Your first box, on us. Use credit code &ldquo;FIRST25&rdquo; at checkout.
              </p>
            ) : (
              <p className={topBarTextClass}>
                <span className="md:hidden">{TOP_BAR_PREFIX_MOBILE}</span>
                <span className="hidden md:inline">{TOP_BAR_PREFIX_DESKTOP}</span>
                <Link href="/request-access" onClick={() => setMobileMenuOpen(false)} className={topBarLinkClass}>
                  <span>{TOP_BAR_CTA}</span>
                  <Image src="/icon/arrow-white.svg" alt="" width={11} height={7} aria-hidden="true" />
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 border-b border-gray-100 bg-white">
          <div className={`${headerInset} min-w-0`}>
            <div className="grid lg:min-h-[5vw] w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-[1.389vw] lg:py-0">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="min-w-0 shrink-0 justify-self-start">
              <Image
                src={WORDMARK}
                alt="StyleSupply"
                width={WORDMARK_W}
                height={WORDMARK_H}
                priority
                className="shrink-0 object-contain object-left"
                style={{ width: WORDMARK_W, height: WORDMARK_H }}
              />
            </Link>
            <nav className="min-w-0 justify-self-center lg:px-[0.694vw]" aria-label="Primary">
              <ul className="flex flex-wrap items-center justify-center lg:gap-x-[2.5vw] gap-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label} className="shrink-0">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-[var(--font-manrope)] lg:text-[1.111vw] font-semibold tracking-[0.02em] whitespace-nowrap text-black"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex shrink-0 items-center justify-self-end gap-0.5 sm:gap-1 text-[#292D32]">
              <button type="button" aria-label="Search" className={actionIconWrap} onClick={() => { setMobileMenuOpen(false); isLive ? setSearchOpen(true) : (window.location.href = "/coming-soon"); }}>
                <Image src={isSearchIconActive ? ICON_SEARCH_RED : ICON_SEARCH} alt="" width={24} height={24} className={actionIconImg} />
              </button>
              <Link href={wishlistHref} aria-label="Wishlist" className={actionIconWrap} onClick={() => setMobileMenuOpen(false)}>
                <Image src={isWishlistActive ? ICON_HEART_RED : ICON_HEART} alt="" width={24} height={24} className={actionIconImg} />
              </Link>
              <Link href={boxHref} aria-label="My Box" className={actionIconWrap} onClick={() => setMobileMenuOpen(false)}>
                <Image src={isBoxActive ? ICON_BOX_RED : ICON_BOX} alt="" width={24} height={24} className={actionIconImg} />
              </Link>
              <Link
                href={accountHref}
                aria-label="Account"
                className={actionIconWrap}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image src={isAccountActive ? ICON_USER_RED : ICON_USER} alt="" width={24} height={24} className={actionIconImg} />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className={actionIconWrap}
              >
                <Image src={ICON_CROSS} alt="" width={27} height={19} className={actionIconImg} />
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* 3-column menu body */}
        <div className="flex min-h-0 flex-1 flex-row gap-[0.694vw] bg-white px-[0.694vw] pb-[0.694vw]">
          {/* Col 1 — primary nav + secondary links */}
          <div className="flex w-[30%] shrink-0 flex-col justify-between overflow-y-auto bg-[#fffbf5] px-[1.389vw] pt-[2.222vw] pb-[2.778vw]">
            <nav className="flex flex-col gap-[1.736vw]" aria-label="Primary menu">
              <button
                type="button"
                onClick={() => setActiveMenuCol1("browse")}
                className={`flex items-center justify-between w-full font-[var(--font-manrope)] text-[1.944vw] font-medium tracking-[-0.04em] text-left ${activeMenuCol1 === "browse" ? "text-[#7a021d]" : "text-black"}`}
              >
                <Link
                  href="/products"
                  onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                >
                  Browse All
                </Link>
                <span className="text-[1.389vw]">›</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuCol1("brands")}
                className={`flex items-center justify-between w-full font-[var(--font-manrope)] text-[1.944vw] font-medium tracking-[-0.04em] text-left ${activeMenuCol1 === "brands" ? "text-[#7a021d]" : "text-black"}`}
              >
                <Link
                  href="/brands"
                  onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                >
                  By Brand
                </Link>
                <span className="text-[1.389vw]">›</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuCol1("collections")}
                className={`flex items-center justify-between w-full font-[var(--font-manrope)] text-[1.944vw] font-medium tracking-[-0.04em] text-left ${activeMenuCol1 === "collections" ? "text-[#7a021d]" : "text-black"}`}
              >
                <Link
                  href="/collections"
                  onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                >
                  By Collection
                </Link>
                <span className="text-[1.389vw]">›</span>
              </button>
            </nav>
            <div className="flex flex-col gap-[1.042vw]">
              <Link href="/howitworks" onClick={() => setMobileMenuOpen(false)} className="font-[var(--font-manrope)] text-[1.042vw] font-semibold tracking-[-0.02em] text-black">How it Works</Link>
              <Link href="/accounts/membership" onClick={() => setMobileMenuOpen(false)} className="font-[var(--font-manrope)] text-[1.042vw] font-semibold tracking-[-0.02em] text-black">Membership</Link>
              <Link href="/accounts/help" onClick={() => setMobileMenuOpen(false)} className="font-[var(--font-manrope)] text-[1.042vw] font-semibold tracking-[-0.02em] text-black">Contact Us</Link>
            </div>
          </div>

          {/* Col 2 — dynamic content based on col 1 selection */}
          <div className="flex w-[35%] shrink-0 flex-col overflow-y-auto bg-[#fffbf5] px-[2.778vw] pt-[2.222vw] pb-[2.778vw]">
            {activeMenuCol1 === "browse" && (
              <>
                <p className="mb-[1.667vw] font-[var(--font-manrope)] text-[1.667vw] font-medium tracking-[-0.02em] text-black">Clothing</p>
                <div className="flex flex-col gap-[1.389vw]">
                  {["Tops", "Bottoms", "Dresses", "Jackets", "Co-ord Sets", "Jumpsuits & Rompers"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-[var(--font-manrope)] text-[1.111vw] font-medium tracking-[-0.02em] text-black"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
                <p className="mb-[1.389vw] mt-[2.778vw] font-[var(--font-manrope)] text-[1.667vw] font-medium tracking-[-0.02em] text-black">Accessories</p>
                <div className="flex flex-col gap-[1.389vw]">
                  {["Handbags", "Jewellery"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-[var(--font-manrope)] text-[1.042vw] font-medium text-black"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </>
            )}
            {activeMenuCol1 === "brands" && (
              <div className="flex flex-col gap-[1.389vw]">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-[var(--font-manrope)] text-[1.111vw] font-medium tracking-[-0.02em] text-black"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            )}
            {activeMenuCol1 === "collections" && (
              <div className="flex flex-col gap-[1.389vw]">
                {TEMP_COLLECTIONS.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-[var(--font-manrope)] text-[1.111vw] font-medium tracking-[-0.02em] text-black"
                  >
                    {col.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Col 3 — hero image */}
          <div className="relative min-h-0 flex-1 bg-[#4b0716]">
            <Image
              src={MENU_HERO_DESKTOP}
              alt=""
              fill
              className="object-cover object-center"
              sizes="35vw"
              priority
            />
            <Image
              src={LOGO_WHITE}
              alt=""
              width={295}
              height={340}
              className="absolute right-[1.667vw] top-[1.667vw] h-[5.556vw] w-auto object-contain lg:right-[2.778vw] lg:top-[2.222vw] lg:h-[6.667vw]"
            />
            <div className="absolute bottom-[3.472vw] left-1/2 -translate-x-1/2">
              <Link
                href="/box/my-box"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-[5.556vw] w-[16.667vw] shrink-0 items-center justify-center rounded-full border border-[#7A021D] bg-white font-[var(--font-manrope)] text-[1.389vw] font-medium tracking-[-0.02em] text-[#7A021D]"
              >
                Build Your Box
              </Link>
            </div>
          </div>
        </div>
      </div>
    )}
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
