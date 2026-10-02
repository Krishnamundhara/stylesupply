"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingModal from "@/components/layout/LoadingModal";

// Only show modal if navigation takes longer than this (avoids flash on cached pages)
const SHOW_DELAY = 150;

export default function NavigationLoadingProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef<string | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    setLoading(false);
    if (showTimerRef.current) { clearTimeout(showTimerRef.current); showTimerRef.current = null; }
  };

  // Hide modal whenever the route actually changes
  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (prevPath.current === null) {
      prevPath.current = current;
      return;
    }
    hide();
    prevPath.current = current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.target === "_blank"
      ) return;

      const destination = new URL(href, window.location.origin);
      const current = window.location.pathname + window.location.search;
      const dest = destination.pathname + destination.search;

      // Don't show if already on this page
      if (dest === current) return;

      // Cancel any pending show timer from a previous click
      if (showTimerRef.current) clearTimeout(showTimerRef.current);

      showTimerRef.current = setTimeout(() => {
        setLoading(true);
      }, SHOW_DELAY);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      hide();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingModal open={loading} />;
}
