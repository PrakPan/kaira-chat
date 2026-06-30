import React from "react";
import type { IntakeFormState } from "../types";
import { WHO_OPTIONS, WHO_WITH_PAX } from "../constants";
import Chip from "../ui/Chip";
import Stepper from "../ui/Stepper";

interface StepProps {
  state: IntakeFormState;
  update: (partial: Partial<IntakeFormState>) => void;
}

/** Step 3 — who's coming, with pax counters for group types. */
const WhoStep: React.FC<StepProps> = ({ state, update }) => {
  const showCounters = WHO_WITH_PAX.includes(state.who);

  const pickWho = (who: string) => {
    if (who === "Just me") {
      update({ who, adults: 1, children: 0, infants: 0 });
    } else if (who === "Couple") {
      update({ who, adults: 2, children: 0, infants: 0 });
    } else {
      update({ who, adults: Math.max(2, state.adults) });
    }
  };

  return (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        Who's coming?
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        So I can pace the trip and size the stays.
      </div>

      <div className="flex flex-wrap gap-[6px]">
        {WHO_OPTIONS.map((o) => (
          <Chip
            key={o.value}
            label={o.label}
            active={state.who === o.value}
            onClick={() => pickWho(o.value)}
          />
        ))}
      </div>

      {showCounters && (
        <div
          className="mt-3 rounded-[13px] px-[14px]"
          style={{ background: "#fafaf5", border: "1px solid #ececec" }}
        >
          {[
            { key: "adults" as const, label: "Adults", sub: "12+ years", min: 1 },
            { key: "children" as const, label: "Children", sub: "2 to 11 years", min: 0 },
            { key: "infants" as const, label: "Infants", sub: "under 2 years", min: 0 },
          ].map((row, idx) => (
            <div
              key={row.key}
              className="py-[10px]"
              style={{ borderBottom: idx < 2 ? "1px solid #ececec" : "none" }}
            >
              <Stepper
                label={row.label}
                sub={row.sub}
                value={state[row.key]}
                min={row.min}
                max={20}
                onChange={(v) => update({ [row.key]: v } as Partial<IntakeFormState>)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhoStep;
