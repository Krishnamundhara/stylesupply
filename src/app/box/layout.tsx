"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BoxLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showFooterSpacer = pathname !== "/box/session-ended" && pathname !== "/box/session";

  return (
    <>
      <Header />
      {children}
      {showFooterSpacer ? <div className="h-[27.778vw] shrink-0 md:h-[8.333vw]" aria-hidden /> : <div className="h-[0.556vw] shrink-0 md:h-[0.26vw] lg:h-[0.139vw]" aria-hidden />}
      <Footer />
    </>
  );
}
