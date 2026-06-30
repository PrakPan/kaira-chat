import React from "react";
import type { IntakeFormState, WhenMode } from "../types";
import { MONTHS } from "../constants";
import Calendar from "../ui/Calendar";
import Chip from "../ui/Chip";
import Stepper from "../ui/Stepper";

interface StepProps {
  state: IntakeFormState;
  update: (partial: Partial<IntakeFormState>) => void;
}

const MODES: { mode: WhenMode; label: string }[] = [
  { mode: "dates", label: "I have dates" },
  { mode: "flexible", label: "Flexible" },
  { mode: "surprise", label: "Not sure" },
];

// Next ~7 month chips, computed from the current month forward.
function upcomingMonths(count = 7): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < count; i++) {
    const label = `${MONTHS[d.getMonth()].slice(0, 3)} '${String(d.getFullYear()).slice(2)}`;
    out.push(label);
    d.setMonth(d.getMonth() + 1);
  }
  return out;
}

/** Step 2 — when are you going (dates / flexible / surprise). */
const WhenStep: React.FC<StepProps> = ({ state, update }) => {
  const months = upcomingMonths();

  return (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        When are you going?
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        Lock dates, or keep it loose.
      </div>

      <div
        className="flex gap-[5px] rounded-[11px] p-1 mb-3"
        style={{ background: "#fafaf5", border: "1px solid #ececec" }}
      >
        {MODES.map(({ mode, label }) => (
          <button
            type="button"
            key={mode}
            onClick={() => update({ when_mode: mode })}
            className="flex-1 py-[9px] rounded-[8px] text-[12px] font-bold transition-all"
            style={{
              background: state.when_mode === mode ? "#0f1a2e" : "transparent",
              color: state.when_mode === mode ? "#fff" : "#445069",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {state.when_mode === "dates" && (
        <Calendar
          startDate={state.startDate}
          endDate={state.endDate}
          onChange={(startDate, endDate) => update({ startDate, endDate })}
        />
      )}

      {state.when_mode === "flexible" && (
        <div>
          <div className="text-[10.5px] font-extrabold uppercase tracking-wide text-[#8a93a6] mb-2">
            Rough month
          </div>
          <div className="flex flex-wrap gap-[6px]">
            {months.map((m) => (
              <Chip
                key={m}
                label={m}
                active={state.flexMonth === m}
                onClick={() => update({ flexMonth: m })}
              />
            ))}
            <Chip
              label="Flexible"
              dashed
              active={state.flexMonth === "Flexible"}
              onClick={() => update({ flexMonth: "Flexible" })}
            />
          </div>
          <div
            className="flex items-center gap-[10px] rounded-[10px] px-[13px] py-2 mt-[14px]"
            style={{ background: "#fafaf5" }}
          >
            <span className="flex-1 text-[13px] font-semibold text-[#1a2436]">
              Nights
            </span>
            <Stepper
              value={state.flexNights}
              min={2}
              max={30}
              onChange={(flexNights) => update({ flexNights })}
            />
          </div>
        </div>
      )}

      {state.when_mode === "surprise" && (
        <div
          className="rounded-[11px] p-[13px] text-[12.5px] font-semibold leading-relaxed flex gap-2"
          style={{ background: "#eef0fb", border: "1px solid #dfe3f7", color: "#7c83bc" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[1px]">
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          <span>
            I'll suggest the best time based on weather, crowds and prices. You
            decide later.
          </span>
        </div>
      )}
    </div>
  );
};

export default WhenStep;
