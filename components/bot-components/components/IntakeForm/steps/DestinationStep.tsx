import React from "react";
import type { Destination, IntakeFormState } from "../types";
import { DEFAULT_FEATURED } from "../constants";
import DestinationCard from "../ui/DestinationCard";
import DestinationSearch from "../ui/DestinationSearch";

interface StepProps {
  state: IntakeFormState;
  update: (partial: Partial<IntakeFormState>) => void;
}

/** Step 1 — pick a featured destination or search the suggest API. */
const DestinationStep: React.FC<StepProps> = ({ state, update }) => {
  const selectedName = state.destination?.name?.toLowerCase();
  const featured = state.featured?.length ? state.featured : DEFAULT_FEATURED;

  const pick = (d: Destination) => {
    update({ destination: d, query: d.name });
  };

  const clear = () => update({ destination: null, query: "" });

  return (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        Where to next?
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        Tap a place, or search any city or country.
      </div>

      <DestinationSearch
        query={state.query}
        onQueryChange={(q) => update({ query: q })}
        onPick={pick}
        onClear={clear}
      />

      {state.query.trim().length < 2 && (
        <div className="grid grid-cols-4 gap-[9px] max-ph:grid-cols-2">
          {featured.map((d) => (
            <DestinationCard
              key={d.name}
              destination={d}
              active={selectedName === d.name.toLowerCase()}
              onSelect={pick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationStep;
