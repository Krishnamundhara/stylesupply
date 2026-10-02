import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  LandingHero,
  LandingValueProp,
  LandingHowItWorks,
  LandingOurPromise,
  LandingBrandsYouLove,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Style Supply - Your Private Boutique, Delivered",
  description:
    "Membership by invite only. Try premium fashion in the comfort of your home with a subscription. Choose from curated designer labels to build a custom box. Premium fashion delivered in 24 hours.",
  alternates: { canonical: "https://stylesupply.io" },
  openGraph: {
    title: "Style Supply - Your Private Boutique, Delivered",
    description:
      "Membership by invite only. Try premium fashion in the comfort of your home with a subscription. Choose from curated designer labels to build a custom box. Premium fashion delivered in 24 hours.",
    url: "https://stylesupply.io",
    siteName: "Style Supply",
    type: "website",
  },
};

// Public landing page. Shown to visitors who are not logged in.
export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <main className="flex flex-col">
          {/* Full-bleed hero, no max-width */}
          <LandingHero />

          {/* Spacer after hero */}
          <div className="h-[27.78vw] md:h-[13.02vw] lg:h-[7.64vw]" />

          {/* Constrained content sections */}
          <div className="mx-auto flex w-full max-w-360 flex-col">
            <LandingValueProp />
            <div className="h-[27.78vw] md:h-[13.02vw] lg:h-[7.64vw]" />
            <LandingHowItWorks />
          </div>

          {/* Full-bleed cream background section */}
          <LandingOurPromise />

          {/* Brands teaser — full width */}
          <div className="w-full">
            <LandingBrandsYouLove
              teaserImage={{
                src: "/images/landing/brand_coming_soon_dekstop.png",
                srcMobile: "/images/landing/brand_coming_soon_mobile.png",
                alt: "Blurred partner marks — new brands coming soon",
              }}
            />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
