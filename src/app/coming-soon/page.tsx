import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main className="relative w-full overflow-hidden bg-white max-md:min-h-[calc(100svh-104px)] md:min-h-[calc(100vh-104px)]">
        {/* Mobile image */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/coming-soon/coming-soon-mobile.webp"
            alt="Coming Soon"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Desktop image */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/images/coming-soon/coming-soon-desktop.webp"
            alt="Coming Soon"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Frosted overlay */}
        <div className="absolute inset-0 bg-[rgba(217,217,217,0.2)]" />

        <div className="absolute inset-0 flex items-center justify-center px-6 text-center md:hidden">
          <h1 className="font-[var(--font-manrope)] text-[26px] font-bold uppercase leading-[1.2] tracking-[0.2em] text-white">
            Coming Soon
          </h1>
        </div>

        <div className="absolute inset-0 hidden items-center justify-center px-8 text-center md:flex">
          <h1 className="font-[var(--font-manrope)] text-[26px] font-bold uppercase leading-[1.2] tracking-[0.2em] text-white">
            Coming Soon
          </h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
