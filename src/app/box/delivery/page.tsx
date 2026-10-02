import type { Metadata } from "next";
import BoxHero from "@/components/sections/box/BoxHero";
import BoxStageDelivery from "@/components/sections/box/delivery/BoxStageDelivery";
import BoxStageArrived from "@/components/sections/box/delivery/BoxStageArrived";

export const metadata: Metadata = {
  title: "Delivery - StyleSupply",
  description: "Your box is confirmed and on its way.",
  alternates: { canonical: "https://stylesupply.io/box/delivery" },
};

export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const params = await searchParams;
  const isArrived = params?.stage === "arrived";

  return (
    <>
      <BoxHero stage={isArrived ? "arrived" : "confirmation"} />
      {isArrived ? <BoxStageArrived /> : <BoxStageDelivery />}
    </>
  );
}
