import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main suppressHydrationWarning className="relative flex h-[calc(100dvh-101px)] w-full flex-col overflow-hidden bg-white md:h-[calc(100dvh-114px)]">
        
        {/* Top Row: CTA left + Title center (desktop), stacked (mobile) */}
        <div className="relative z-10 flex shrink-0 items-center justify-between p-[10px] md:px-[calc(6.25%+11.5px)] md:pb-2.5 md:pt-6">
          <Link
            href="/"
            className="whitespace-nowrap font-[var(--font-manrope)] text-[16px] font-semibold leading-[1.2] text-[#7a021d] md:text-[18px]"
          >
            &larr; Go to Home
          </Link>
          <span className="absolute left-1/2 hidden -translate-x-1/2 font-[var(--font-manrope)] text-[18px] font-bold uppercase leading-[1.2] tracking-wide text-black md:block">
            SUPPLY NOT FOUND
          </span>
          <span className="hidden w-[120px] md:block" aria-hidden="true" />
        </div>

        {/* Mobile Only Title — centered in remaining space */}
        <div className="relative z-10 flex flex-1 shrink-0 items-end justify-center pb-[10%] md:hidden">
          <span className="font-[var(--font-manrope)] text-[20px] font-bold uppercase leading-[1.2] tracking-wide text-black">
            SUPPLY NOT FOUND
          </span>
        </div>

        {/* 404 Visual — anchored to bottom so digits appear cropped */}
        <div className="flex w-full flex-1 items-end justify-center overflow-hidden">
          <div className="relative w-[90%] translate-y-[2%] md:w-[80%]">
            <Image
              src="/images/404/404.webp"
              alt="404 - Page Not Found"
              width={1440}
              height={700}
              className="h-auto w-full -translate-y-[2%] object-cover md:translate-y-0"
              priority
            />
            {/* Logo centered inside the zero of 404 */}
            <Image
              src="/logo/ss_red_logo.svg"
              alt="StyleSupply Logo"
              width={80}
              height={80}
              className="pointer-events-none absolute left-1/2 top-[45%] h-auto w-[12%] -translate-x-1/2 -translate-y-1/2 md:w-[5.5%]"
            />
          </div>
        </div>
      </main>
    </>
  );
}