import React from "react";
import type { Destination, IntakeFormState } from "../types";
import { DEFAULT_FEATURED } from "../constants";
import DestinationCard from "../ui/DestinationCard";
import DestinationSearch from "../ui/DestinationSearch";

interface StepProps {
  state: IntakeFormState;
  update: (partial: Partial<IntakeFormState>) => void;
}

/** Step 1 — destinations. Featured/default tiles are SINGLE-select: tapping one
 *  replaces the whole selection with just that place. Searching the suggest API
 *  lets the user build a MULTI-select list. A prefill may arrive with several
 *  default tiles selected, but the first manual tile tap collapses back to
 *  single-select. Selections show in the input box (comma-joined) and as
 *  removable tags below it. */
const DestinationStep: React.FC<StepProps> = ({ state, update }) => {
  const featured = state.featured?.length ? state.featured : DEFAULT_FEATURED;
  const destinations = state.destinations ?? [];
  const selectedSet = new Set(destinations.map((d) => d.name.toLowerCase()));
  const joined = destinations.map((d) => d.name).join(", ");

  // Single writer that keeps `destinations`, the primary `destination` (drives
  // the left hero + BotApp gate), and the input `query` in sync.
  const setList = (list: Destination[]) =>
    update({
      destinations: list,
      destination: list[0] ?? null,
      query: list.map((d) => d.name).join(", "),
    });

  const addDestination = (d: Destination) => {
    if (selectedSet.has(d.name.toLowerCase())) {
      setList(destinations); // already selected — keep as-is
      return;
    }
    setList([...destinations, d]);
  };

  // Featured/default tiles are single-select: tapping one replaces the whole
  // selection with just that place (collapsing any prefilled multi-select or
  // search picks). Tapping the sole selected tile toggles it back off. Only
  // search picks (addDestination) build a multi-select list.
  const toggleFeatured = (d: Destination) => {
    const isOnlySelected =
      destinations.length === 1 &&
      destinations[0].name.toLowerCase() === d.name.toLowerCase();
    setList(isOnlySelected ? [] : [d]);
  };

  const removeTag = (name: string) =>
    setList(
      destinations.filter((d) => d.name.toLowerCase() !== name.toLowerCase()),
    );

  // Clear everything — empties the list, the input, and re-disables Continue.
  const clearAll = () => update({ destinations: [], destination: null, query: "" });

  // The query doubles as the input text and the live search term. When it
  // matches the committed selection (joined names) we treat it as settled — NOT
  // an active search — so no API call fires and the grid stays visible.
  const committed = destinations.length > 0 && state.query.trim() === joined;
  const isSearching = state.query.trim().length >= 2 && !committed;

  return (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        Where to next?
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        Tap a place to pick one, or search any city or country to add several.
      </div>

      <DestinationSearch
        query={state.query}
        searchActive={isSearching}
        onQueryChange={(q) => update({ query: q })}
        onPick={addDestination}
        onClear={clearAll}
      />

      {/* Selected destinations — removable tags. Clearing all re-disables
          Continue (validateStep checks destinations.length). */}
      {destinations.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mb-3">
          {destinations.map((d) => (
            <span
              key={d.name}
              className="inline-flex items-center gap-[7px] pl-3 pr-2 py-[6px] rounded-full text-[13px] font-bold text-[#0b1220]"
              style={{ background: "#e0f2e9", border: "1px solid #c9e9d8" }}
            >
              <span
                className="w-4 h-4 rounded-full grid place-items-center shrink-0"
                style={{ background: "#1f8a5a" }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {d.name}
              <button
                type="button"
                onClick={() => removeTag(d.name)}
                aria-label={`Remove ${d.name}`}
                className="w-[18px] h-[18px] rounded-full grid place-items-center shrink-0"
                style={{ background: "rgba(0,0,0,0.06)", color: "#445069" }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {!isSearching && (
        <div className="grid grid-cols-4 gap-[9px] max-ph:grid-cols-2">
          {featured.map((d) => (
            <DestinationCard
              key={d.name}
              destination={d}
              active={selectedSet.has(d.name.toLowerCase())}
              onSelect={toggleFeatured}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationStep;
