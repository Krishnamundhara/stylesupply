import type { Metadata } from "next";
import BoxHero from "@/components/sections/box/BoxHero";
import BoxStageBuilder from "@/components/sections/box/my-box/BoxStageBuilder";

export const metadata: Metadata = {
  title: "My Box - StyleSupply",
  description:
    "Curate up to 5 styles for your try-at-home session.",
  alternates: { canonical: "https://stylesupply.io/box/my-box" },
};

export default function MyBoxPage() {
  return (
    <>
      <BoxHero stage="builder" />
      <BoxStageBuilder />
    </>
  );
}
