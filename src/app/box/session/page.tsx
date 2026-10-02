"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import BoxHero from "@/components/sections/box/BoxHero";
import BoxStageBoutique from "@/components/sections/box/session/BoxStageBoutique";
import BoxStageSessionEnded from "@/components/sections/box/session/BoxStageSessionEnded";
import BoxStageShopIntention from "@/components/sections/box/session/BoxStageShopIntention";

type SessionStage = "boutique" | "sessionEnded" | "shopIntention";

function SessionContent() {
  const searchParams = useSearchParams();
  const stageParam = searchParams.get("stage");
  const initialStage: SessionStage =
    stageParam === "shopIntention" ? "shopIntention"
    : stageParam === "sessionEnded" ? "sessionEnded"
    : "boutique";
  const [stage, setStage] = useState<SessionStage>(initialStage);

  return (
    <div className={`w-full ${stage === "sessionEnded" ? "bg-[#7A021D]" : "bg-white"}`}>
      <BoxHero
        stage={
          stage === "shopIntention"
            ? "shopIntention"
            : stage === "sessionEnded"
            ? "sessionEnded"
            : "boutique"
        }
      />
      {stage === "boutique" && (
        <BoxStageBoutique onDecideNow={() => setStage("sessionEnded")} />
      )}
      {stage === "sessionEnded" && (
        <BoxStageSessionEnded onDecideNow={() => setStage("shopIntention")} />
      )}
      {stage === "shopIntention" && <BoxStageShopIntention />}
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionContent />
    </Suspense>
  );
}
