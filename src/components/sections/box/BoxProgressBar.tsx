const DOT_SIZE = 21;
const HALF_DOT = DOT_SIZE / 2;

interface BoxProgressBarProps {
  steps: readonly string[];
  currentStep: number;
  accentColor?: string;
  trackInactiveColor?: string;
  labelColor?: string;
  inactiveLabelColor?: string;
}

export default function BoxProgressBar({
  steps,
  currentStep,
  accentColor = "#7A021D",
  trackInactiveColor = "#EAE2DF",
  labelColor = "#000000",
  inactiveLabelColor = "#666666",
}: BoxProgressBarProps) {
  const totalSteps = steps.length - 1;
  const safeStep = Math.max(0, Math.min(currentStep, totalSteps));
  const pct = (safeStep / totalSteps) * 100;

  return (
    <div className="w-full font-[var(--font-manrope)]">
      {/* Dots + track */}
      <div className="relative flex items-center justify-between">
        <div
          className="absolute top-1/2 h-[5px] -translate-y-1/2 rounded-full"
          style={{ left: HALF_DOT, right: HALF_DOT, backgroundColor: trackInactiveColor }}
        >
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
        </div>
        {steps.map((_, i) => (
          <div
            key={i}
            className="relative z-10 shrink-0 rounded-full"
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              backgroundColor: i <= safeStep ? accentColor : trackInactiveColor,
            }}
          />
        ))}
      </div>

      {/* Mobile: current label only */}
      <div className="relative mt-[3.889vw] h-[5.333vw] md:hidden">
        <p
          className={`absolute whitespace-nowrap font-semibold leading-[1.2] tracking-[-0.04em] ${
            safeStep === 0 ? "translate-x-0" : safeStep === totalSteps ? "-translate-x-full" : "-translate-x-1/2"
          }`}
          style={{
            left: `calc(${HALF_DOT}px + ((100% - ${DOT_SIZE}px) * ${safeStep} / ${totalSteps}))`,
            fontSize: "4.444vw",
            color: labelColor,
          }}
        >
          {steps[safeStep]}
        </p>
      </div>

      {/* Desktop: all labels */}
      <div className="mt-[1.823vw] md:mt-[1.823vw] lg:mt-[0.972vw] hidden md:flex justify-between gap-2">
        {steps.map((label, i) => (
          <p
            key={i}
            className="font-semibold leading-none tracking-[-0.04em] text-[1.823vw] lg:text-[1.111vw]"
            style={{
              color: i <= safeStep ? labelColor : inactiveLabelColor,
              textAlign: i === 0 ? "left" : i === totalSteps ? "right" : "center",
              whiteSpace: i === totalSteps ? "nowrap" : undefined,
            }}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}
