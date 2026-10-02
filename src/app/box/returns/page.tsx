"use client";

import { useState } from "react";
import BoxHero from "@/components/sections/box/BoxHero";
import BoxStageReturnFeedback from "@/components/sections/box/returns/BoxStageReturnFeedback";
import BoxStageSchedulePickup from "@/components/sections/box/returns/BoxStageSchedulePickup";
import BoxStagePickupTracking from "@/components/sections/box/returns/BoxStagePickupTracking";
import BoxStagePickupCompleted from "@/components/sections/box/returns/BoxStagePickupCompleted";

export default function ReturnsPage() {
  const [stage, setStage] = useState<"feedback" | "schedulePickup" | "pickupTracking" | "pickupCompleted">("feedback");

  if (stage === "pickupCompleted") {
    return (
      <>
        <BoxHero stage="returnCompleted" />
        <BoxStagePickupCompleted />
      </>
    );
  }

  if (stage === "pickupTracking") {
    return (
      <>
        <BoxHero stage="pickupTracking" />
        <BoxStagePickupTracking showDevButton onDevNext={() => setStage("pickupCompleted")} />
      </>
    );
  }

  if (stage === "schedulePickup") {
    return (
      <>
        <BoxHero stage="schedulePickup" />
        <BoxStageSchedulePickup onConfirm={() => setStage("pickupTracking")} />
      </>
    );
  }

  return (
    <>
      <BoxHero stage="returnFeedback" />
      <BoxStageReturnFeedback onComplete={() => setStage("schedulePickup")} />
    </>
  );
}
