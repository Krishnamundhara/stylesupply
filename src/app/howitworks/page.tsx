import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HowItWorksHero, HowItWorksSteps } from "@/components/sections";

export const metadata: Metadata = {
  title: "How It Works - StyleSupply",
  description:
    "Learn how StyleSupply subscriptions work, from selecting styles to swapping and returns.",
  alternates: { canonical: "https://stylesupply.io/howitworks" },
};

export default function Page() {
  return (
    <>
      <Header />
      <HowItWorksHero />
      <HowItWorksSteps />
      <div className="h-[100px] shrink-0 md:h-[110px] lg:h-[120px]" aria-hidden />
      <Footer />
    </>
  );
}
