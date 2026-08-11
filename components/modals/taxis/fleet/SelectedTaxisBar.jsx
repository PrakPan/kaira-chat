import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { MdOutlineLuggage } from "react-icons/md";

import { getIndianPrice } from "../../../../services/getIndianPrice";
import QuantityStepper from "./QuantityStepper";
import { useTaxiSelection } from "./TaxiSelectionContext";
import { validateSelection } from "./fleetSelection";

/**
 * The taxis picked so far, pinned to the bottom of the drawer.
 *
 * Only ever on screen when the party does not fit in one vehicle and the customer has started
 * picking — below that the drawer is exactly what it always was. It sticks rather than sitting
 * inline because the quote list is long: having chosen a cab near the bottom, the total and
 * the commit button must not be somewhere further down still.
 *
 * Every line is editable here as well as on the card. Scrolling back up to find the card you
 * over-clicked is the kind of small friction that makes people abandon the whole selection.
 */
const SelectedTaxisBar = ({ symbol = "₹", submitting = false, onSubmit, ctaLabel }) => {
  const context = useTaxiSelection();
  const [expanded, setExpanded] = useState(false);

  if (!context?.enabled) return null;

  const { summary, vehicles, setQuantity, clear, fleet, source, busy } = context;
  if (!summary?.vehicles) return null;

  const validity = validateSelection(summary, fleet, source);
  const disabled = submitting || busy || !validity.ok;
  const pax = Number(fleet?.pax) || 0;
  // Stated, never enforced. The customer may well be sending part of the group another way,
  // so this is a fact about the selection rather than a problem with it.
  const seatShortfall = pax > 0 ? Math.max(pax - summary.seats, 0) : 0;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 -mx-6 max-ph:-mx-4 px-6 max-ph:px-4 pb-3 pt-2 bg-gradient-to-t from-[#fafaf5] via-[#fafaf5] to-transparent">
      <div className="rounded-2xl border-sm border-solid border-[#ececec] bg-white shadow-[0_-2px_16px_rgba(11,18,32,0.10)] overflow-hidden">
        {expanded ? (
          <div className="max-h-[38vh] overflow-y-auto px-3 pt-2 divide-y divide-[#f4f4f4]">
            {summary.lines.map((line) => {
              const category = line.candidate?.taxi_category || {};
              return (
                <div
                  key={line.key}
                  className="flex items-center justify-between gap-3 py-2 max-ph:flex-col max-ph:items-stretch max-ph:gap-1"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-500 text-[#0b1220] break-words">
                      {category.model_name || category.type || "Taxi"}
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
                      <span className="whitespace-nowrap">
                        {symbol}
                        {getIndianPrice(Math.ceil(line.unitTotal))} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 max-ph:w-full max-ph:justify-between">
                    <span className="ttw-type-small font-mono text-[#0b1220] whitespace-nowrap">
                      {symbol}
                      {getIndianPrice(Math.ceil(line.lineTotal))}
                    </span>

                    <QuantityStepper
                      size="sm"
                      value={line.quantity}
                      disabled={submitting || busy}
                      label={category.model_name || category.type || "taxi"}
                      onChange={(next) => setQuantity(line.key, next)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Phone gets rows, not columns. The CTA carries a full sentence and the class it
            uses is nowrap + fit-content, so squeezed into a single row beside the summary
            and the total it simply ran off the right edge of the card. */}
        <div className="flex items-center justify-between gap-3 flex-wrap px-3 py-2.5 max-ph:flex-col max-ph:items-stretch max-ph:gap-2">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className="text-left ttw-type-small font-600 text-[#0b1220] underline decoration-[#d9d9cf] underline-offset-2"
            >
              {summary.vehicles} {summary.vehicles === 1 ? "taxi" : "taxis"} added
              {expanded ? " · Hide" : " · View"}
            </button>
            {/* Wraps rather than truncates: the seat shortfall is the one line that tells
                you the party does not fit, and an ellipsis is where it always got cut. */}
            <div className="ttw-type-small text-[#445069]">
              {summary.seats} {summary.seats === 1 ? "seat" : "seats"}
              {summary.bags ? ` · ${summary.bags} bags` : ""}
              {seatShortfall
                ? ` · ${seatShortfall} of ${pax} travellers without a seat`
                : ""}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 max-ph:w-full max-ph:flex-wrap max-ph:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={submitting || busy}
                onClick={clear}
                className="ttw-type-small text-[#445069] underline disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <span className="text-lg font-mono text-[#0b1220] whitespace-nowrap">
                {symbol}
                {getIndianPrice(Math.ceil(summary.total))}
              </span>
            </div>
            {submitting ? (
              <span className="flex items-center justify-center max-ph:w-full max-ph:py-2">
                <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
              </span>
            ) : (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSubmit?.(vehicles, summary)}
                className="ttw-btn-fill-yellow !whitespace-normal text-center max-ph:!w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ctaLabel ||
                  `Add ${summary.vehicles} ${
                    summary.vehicles === 1 ? "taxi" : "taxis"
                  } to Itinerary`}
              </button>
            )}
          </div>

          {!validity.ok && validity.reason ? (
            <span className="ttw-type-small text-white bg-[#CD2026] py-1 px-2 rounded-lg">
              {validity.reason}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SelectedTaxisBar;
