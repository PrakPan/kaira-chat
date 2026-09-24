import React from "react";
import type { IntakeFormState } from "../types";
import { isInternationalTrip } from "../intakePrompt";
import AddOnToggles, { DEFAULT_ADD_ONS } from "../ui/AddOnToggles";

interface StepProps {
  state: IntakeFormState;
  update: (partial: Partial<IntakeFormState>) => void;
  disabled?: boolean;
}

/** Step 5 — what Kaira should handle beyond the itinerary: flights, and for a
 *  trip abroad, visa assistance and an eSIM. */
const AddOnsStep: React.FC<StepProps> = ({ state, update, disabled }) => {
  const firstStop = state.destinations?.[0]?.name || state.destination?.name;

  return (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        What should I handle?
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        I&apos;ll price each one separately, so you can drop any later.
      </div>

      <AddOnToggles
        value={state.addOns ?? DEFAULT_ADD_ONS}
        onChange={(addOns) => update({ addOns })}
        international={isInternationalTrip(state)}
        toName={firstStop}
        disabled={disabled}
      />
    </div>
  );
};

export default AddOnsStep;
