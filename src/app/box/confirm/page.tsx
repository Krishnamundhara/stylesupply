"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMembership } from "@/context/MembershipContext";
import BoxStageDeliveryForm from "@/components/sections/box/confirm/BoxStageDeliveryForm";
import BoxStageMembership from "@/components/sections/box/confirm/BoxStageMembership";
import BoxStagePayment from "@/components/sections/box/confirm/BoxStagePayment";
import BoxStageConfirmed from "@/components/sections/box/confirm/BoxStageConfirmed";

type ConfirmStage = "delivery" | "membership" | "payment" | "active" | "confirmed";

export default function ConfirmPage() {
  const router = useRouter();
  const { isActive: hasMembership, isLoading: membershipLoading } = useMembership();
  const [stageOverride, setStageOverride] = useState<ConfirmStage | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [stageOverride]);

  if (membershipLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const stage = stageOverride ?? (hasMembership ? "active" : "delivery");
  const setStage = setStageOverride;

  if (stage === "delivery") {
    return (
      <BoxStageDeliveryForm
        onConfirm={() => setStage("membership")}
        onEdit={() => router.push("/box/my-box")}
      />
    );
  }

  if (stage === "membership") {
    return (
      <BoxStageMembership
        onActivate={() => setStage("payment")}
        onConfirm={() => setStage("confirmed")}
      />
    );
  }

  if (stage === "payment") {
    return <BoxStagePayment onConfirm={() => setStage("active")} />;
  }

  if (stage === "active") {
    return (
      <BoxStageMembership
        isActive
        onConfirm={() => setStage("confirmed")}
      />
    );
  }

  return <BoxStageConfirmed onCompleteSession={() => router.push("/box/delivery")} />;
}
