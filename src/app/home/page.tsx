import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Box from "@/components/layout/Box";
import {
  HomeHero,
  HomeExploreCollections,
  HomeDiveRightIn,
  HomeCollectionBannerSection,
  HomeCuratedDesigners,
  HomeClosetElevated,
} from "@/components/sections/home";
import LandingHowItWorks from "@/components/sections/landing/LandingHowItWorks";
import { getHomeData } from "@/services/home";

export const metadata: Metadata = {
  title: "Home — StyleSupply",
  description:
    "Your personalized StyleSupply homepage — picks, saved items, and editorials curated for you.",
  alternates: { canonical: "https://stylesupply.io/home" },
  robots: { index: false, follow: false },
};

// Logged-in home page. Fetches personalized data server-side.
export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <Header />
      <main className="flex flex-col bg-white">
        <HomeHero user={data.user} hero={data.hero} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <HomeExploreCollections data={data.collectionsSection} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <LandingHowItWorks />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <HomeCuratedDesigners data={data.curatedDesigners} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <Box data={data.curateYourBox} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <HomeDiveRightIn data={data.diveRightIn} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <HomeCollectionBannerSection data={data.collectionBanner} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <HomeClosetElevated />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
      </main>
      <Footer />
    </>
  );
}
