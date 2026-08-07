import React, { useMemo, useState } from "react";
import { PulseLoader } from "react-spinners";
import { MdOutlineLuggage } from "react-icons/md";

import { getIndianPrice } from "../../../../services/getIndianPrice";
import {
  candidateKey,
  countVehicles,
  describeSelection,
  emptySelection,
  remainingCapacity,
  selectionFromMembers,
  setQuantity,
  summarizeSelection,
  toVehiclesPayload,
  validateSelection,
} from "./fleetSelection";

/**
 * Pick several DIFFERENT cabs for one journey and add them together.
 *
 * Only appears when no single cab seats the group — the same condition that produces the
 * "2 Taxis" convoy cards beside it. The difference is that a convoy is N copies of one model,
 * while this lets a group of 8 travel as 1 Innova + 1 Dzire if that suits them better.
 *
 * Two ways in, one selection model behind them: the server's ranked suggestions are one-click
 * cards, and "Build your own" exposes every cab with a quantity stepper so any combination is
 * reachable. Picking a suggestion just pre-fills the same selection, so there is one code path.
 */

// Stable identifiers for the rows that can submit, so a loader can be pinned to one of them.
const CUSTOM_KEY = "custom";
const suggestionKey = (index) => `suggestion-${index}`;

const Stepper = ({ value, onChange, max, disabled }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      aria-label="Remove one"
      disabled={disabled || value <= 0}
      onClick={() => onChange(value - 1)}
      className="w-7 h-7 rounded-full border-sm border-solid border-[#ececec] text-[#445069] disabled:opacity-40"
    >
      −
    </button>
    <span className="w-5 text-center ttw-type-small font-600 text-[#0b1220]">
      {value}
    </span>
    <button
      type="button"
      aria-label="Add one"
      disabled={disabled || max <= 0}
      onClick={() => onChange(value + 1)}
      className="w-7 h-7 rounded-full border-sm border-solid border-[#ececec] text-[#445069] disabled:opacity-40"
    >
      +
    </button>
  </div>
);

const CandidateRow = ({ candidate, quantity, onChange, headroom, symbol, disabled }) => {
  const category = candidate?.taxi_category || {};
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b-sm border-solid border-[#f4f4f4] last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-500 text-[#0b1220] truncate">
          {category.model_name || category.type || "Taxi"}
          {category.fuel_type ? (
            <span className="font-400 text-[#445069]">
              {" "}
              ({category.fuel_type})
            </span>
          ) : null}
        </div>
        <div className="ttw-type-small text-[#445069] flex flex-wrap items-center gap-x-2">
          {category.seating_capacity ? (
            <span className="whitespace-nowrap">
              {category.seating_capacity}-seater
            </span>
          ) : null}
          {category.bag_capacity ? (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <MdOutlineLuggage />
              {category.bag_capacity}
            </span>
          ) : null}
        </div>
      </div>

      <span className="ttw-type-small text-[#0b1220] whitespace-nowrap">
        {symbol}
        {getIndianPrice(Math.ceil(Number(candidate?.price?.total) || 0))}
      </span>

      <Stepper
        value={quantity}
        max={headroom}
        disabled={disabled}
        onChange={(next) => onChange(Math.max(next, 0))}
      />
    </div>
  );
};

const FleetPicker = ({
  fleet,
  source,
  symbol = "₹",
  // Which row is mid-submit, or null. A shared boolean would spin every button at once and
  // leave the user unsure which option they actually committed to.
  pendingKey = null,
  // True while ANY option on the screen is being added, including the convoy cards below.
  busy = false,
  onAdd,
  ctaLabel,
}) => {
  const candidates = fleet?.candidates || [];
  const suggestions = fleet?.suggestions || [];

  const [selection, setSelection] = useState(emptySelection);
  // Open the manual builder by default when there is nothing to click on.
  const [showBuilder, setShowBuilder] = useState(suggestions.length === 0);

  const summary = useMemo(
    () => summarizeSelection(selection, candidates),
    [selection, candidates],
  );
  const validity = useMemo(
    () => validateSelection(summary, fleet, source),
    [summary, fleet, source],
  );
  const headroom = remainingCapacity(selection, fleet);
  const picked = countVehicles(selection);

  // Self pricing is the only source that can quote each cab independently; every other
  // supplier binds a quote to the passenger count we sent it.
  if (!candidates.length || (source && source !== "Self")) return null;

  const handleQuickAdd = (suggestion, index) => {
    const next = selectionFromMembers(suggestion?.members);
    setSelection(next);
    onAdd?.(
      toVehiclesPayload(next, candidates),
      summarizeSelection(next, candidates),
      suggestionKey(index),
    );
  };

  const handleCustomise = (suggestion) => {
    setSelection(selectionFromMembers(suggestion?.members));
    setShowBuilder(true);
  };

  return (
    <div className="flex flex-col rounded-3xl border-sm border-solid border-[#f2e6a8] bg-[#fffdf0] p-md mt-md">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <span className="text-base font-600 text-[#0b1220]">
          Travel in a mix of vehicles
        </span>
        {fleet?.pax ? (
          <span className="ttw-type-small text-[#6b5600]">
            No single taxi seats {fleet.pax} — combine two or more instead
          </span>
        ) : null}
      </div>

      {suggestions.length ? (
        <div className="flex flex-col gap-2 mt-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.label || index}
              className="flex items-center justify-between gap-3 flex-wrap rounded-2xl bg-white border-sm border-solid border-[#ececec] p-2"
            >
              <div className="min-w-0">
                <div className="text-sm font-500 text-[#0b1220]">
                  {suggestion.label}
                </div>
                <div className="ttw-type-small text-[#445069]">
                  {suggestion.vehicles} vehicles
                  {suggestion.seats ? ` · ${suggestion.seats} seats` : ""}
                  {suggestion.bags ? ` · ${suggestion.bags} bags` : ""}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-mono text-[#0b1220] whitespace-nowrap">
                  {symbol}
                  {getIndianPrice(Math.ceil(Number(suggestion.total) || 0))}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  className="ttw-type-small text-[#445069] underline whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => handleCustomise(suggestion)}
                >
                  Customise
                </button>
                {pendingKey === suggestionKey(index) ? (
                  <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    className="ttw-btn-fill-yellow whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleQuickAdd(suggestion, index)}
                  >
                    Add to Itinerary
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {suggestions.length ? (
        <button
          type="button"
          disabled={busy}
          className="ttw-type-small text-[#445069] underline self-start mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setShowBuilder((open) => !open)}
        >
          {showBuilder ? "Hide" : "Build your own combination"}
        </button>
      ) : null}

      {showBuilder ? (
        <div className="mt-2 rounded-2xl bg-white border-sm border-solid border-[#ececec] px-3 py-1">
          {candidates.map((candidate) => (
            <CandidateRow
              key={candidateKey(candidate)}
              candidate={candidate}
              symbol={symbol}
              quantity={Number(selection[candidateKey(candidate)] || 0)}
              headroom={headroom}
              disabled={busy}
              onChange={(next) =>
                setSelection((prev) =>
                  setQuantity(prev, candidateKey(candidate), next),
                )
              }
            />
          ))}
        </div>
      ) : null}

      {picked > 0 ? (
        <div className="flex items-center justify-between gap-3 flex-wrap mt-3 pt-3 border-t-sm border-solid border-[#f2e6a8]">
          <div className="min-w-0">
            <div className="text-sm font-500 text-[#0b1220] truncate">
              {describeSelection(summary)}
            </div>
            <div className="ttw-type-small text-[#445069]">
              {summary.vehicles} vehicles · {summary.seats} seats
              {summary.bags ? ` · ${summary.bags} bags` : ""}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-mono text-[#0b1220]">
              {symbol}
              {getIndianPrice(Math.ceil(summary.total))}
            </span>
            {pendingKey === CUSTOM_KEY ? (
              <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
            ) : (
              <button
                type="button"
                disabled={!validity.ok || busy}
                className="ttw-btn-fill-yellow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                onClick={() =>
                  onAdd?.(
                    toVehiclesPayload(selection, candidates),
                    summary,
                    CUSTOM_KEY,
                  )
                }
              >
                {ctaLabel || `Add ${summary.vehicles} taxis to Itinerary`}
              </button>
            )}
          </div>

          {!validity.ok && validity.reason ? (
            <span className="ttw-type-small text-white bg-[#CD2026] py-1 px-2 rounded-lg">
              {validity.reason}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default FleetPicker;
