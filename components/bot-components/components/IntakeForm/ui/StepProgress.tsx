import React from "react";

interface StepProgressProps {
  step: number; // 0-based current step
  total: number;
}

/** Segmented progress bar + "n/total" counter shown in the card header. */
const StepProgress: React.FC<StepProgressProps> = ({ step, total }) => (
  <div className="flex items-center gap-3 w-full">
    <div className="flex-1 flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1 rounded-sm overflow-hidden"
          style={{ background: "#ececec" }}
        >
          <span
            className="block h-full origin-left transition-transform duration-300"
            style={{
              background: "#0f1a2e",
              transform: i <= step ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </div>
      ))}
    </div>
    <span className="text-[11px] font-bold text-[#8a93a6] tabular-nums shrink-0">
      <b className="text-[#0b1220]">{step + 1}</b>/{total}
    </span>
  </div>
);

export default StepProgress;
