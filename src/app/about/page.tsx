import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutTruth from "@/components/sections/about/AboutTruth";
import AboutBanner from "@/components/sections/about/AboutBanner";
import AboutFounder from "@/components/sections/about/AboutFounder";
import AboutCTA from "@/components/sections/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us — StyleSupply",
  description:
    "Learn about StyleSupply — our story, our purpose, and how we rethink style without the weight of ownership.",
  alternates: { canonical: "https://stylesupply.io/about" },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex w-full min-w-0 flex-col bg-white pb-[27.778vw] md:pb-[13.021vw] lg:pb-[8.333vw]">
        <AboutHero />
        {/* Spacing spacers between sections — do not remove */}
        <div className="h-[5.556vw] shrink-0 md:h-[2.604vw] lg:h-[1.389vw]" />
        <AboutTruth />
        <div className="h-[5.556vw] shrink-0 md:h-[2.604vw] lg:h-[1.389vw]" />
        <AboutBanner />
        <div className="h-[27.778vw] shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" />
        <div className="mx-auto flex w-full min-w-0 max-w-360 flex-col">
          <AboutFounder />
          <div className="h-[30.556vw] shrink-0 md:h-[14.323vw] lg:h-[7.639vw]" />
          <AboutCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
