"use client";

import { useEffect, useState } from "react";
import RequestAccessForm from "./RequestAccessForm";
import RequestAccessFitProfile from "./RequestAccessFitProfile";
import RequestAccessStyle from "./RequestAccessStyle";
import RequestAccessConfirmation from "./RequestAccessConfirmation";
import type { Step2Data } from "./RequestAccessForm";
import type { FitProfileData } from "./RequestAccessFitProfile";

type Step = 1 | 2 | 3 | 4;

export default function RequestAccessClient() {
  const [step, setStep] = useState<Step>(1);
  const [s1Data, setS1Data] = useState<Step2Data | null>(null);
  const [s2Data, setS2Data] = useState<FitProfileData | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, 4) as Step);
  const goToStep = (target: 1 | 2 | 3) => setStep(target);

  useEffect(() => {
    // Keep each step transition anchored to the top of the page.
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [step]);

  return (
    <div className="animate-fade-in">
      {step === 1 && (
        <RequestAccessForm 
          onContinue={(data: Step2Data) => { setS1Data(data); next(); }} 
          onStepSelect={goToStep} 
        />
      )}
      {step === 2 && (
        <RequestAccessFitProfile 
          onContinue={(data: FitProfileData) => { setS2Data(data); next(); }} 
          onStepSelect={goToStep} 
        />
      )}
      {step === 3 && (
        <RequestAccessStyle 
          s1Data={s1Data} 
          s2Data={s2Data} 
          onContinue={next} 
          onStepSelect={goToStep} 
        />
      )}
      {step === 4 && <RequestAccessConfirmation />}
    </div>
  );
}
