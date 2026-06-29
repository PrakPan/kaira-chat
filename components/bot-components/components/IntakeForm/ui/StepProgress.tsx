import React from "react";

interface StepProgressProps {
  step: number; // 0-based current step
  total: number;
  /** Per-step completion flags (from backend prefill). A segment shows filled
   *  when it's been visited (i <= step) OR flagged complete. */
  completedSteps?: boolean[];
}

/** Segmented progress bar + "n/total" counter shown in the card header. */
const StepProgress: React.FC<StepProgressProps> = ({
  step,
  total,
  completedSteps,
}) => (
  <div className="flex items-center gap-3 w-full">
    <div className="flex-1 flex gap-1">
      {Array.from({ length: total }).map((_, i) => {
        // Fill reflects the CURRENT position (i <= step) so the bar matches the
        // "n/total" counter. Completed-but-not-yet-reached steps get a subtle
        // tint instead, so the count never reads ahead of where the user is.
        const visited = i <= step;
        const completed = !!completedSteps?.[i];
        return (
          <div
            key={i}
            className="flex-1 h-1 rounded-sm overflow-hidden"
            style={{ background: completed ? "#cfe9dc" : "#ececec" }}
          >
            <span
              className="block h-full origin-left transition-transform duration-300"
              style={{
                background: "#0f1a2e",
                transform: visited ? "scaleX(1)" : "scaleX(0)",
              }}
            />
          </div>
        );
      })}
    </div>
    <span className="text-[11px] font-bold text-[#8a93a6] tabular-nums shrink-0">
      <b className="text-[#0b1220]">{step + 1}</b>/{total}
    </span>
  </div>
);

export default StepProgress;
