import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePricingForm } from "../../../../store/actions/pricingForm";
import type { PricingFormState } from "./types";
import type { Destination } from "../IntakeForm/types";
import { canSubmitPricing, composePricingMessage } from "./pricingPrompt";
import PricingFormSkeleton from "./ui/PricingFormSkeleton";
import StartCitySearch from "./ui/StartCitySearch";

interface PricingFormCardProps {
  /** Called with the composed message after the form is submitted. The parent
   *  decides whether to send it directly or gate it behind login first. */
  onComplete: (composedMessage: string) => void;
}

// ── Yes / No segmented control ────────────────────────────────────────────────
const YesNo: React.FC<{
  value: boolean | null;
  onChange: (v: boolean) => void;
}> = ({ value, onChange }) => {
  const opt = (label: string, on: boolean) => {
    const active = value === on;
    return (
      <button
        type="button"
        onClick={() => onChange(on)}
        className="px-[15px] py-[7px] rounded-[9px] text-[12.5px] font-bold transition-all"
        style={{
          background: active ? "#0f1a2e" : "#fff",
          color: active ? "#fff" : "#445069",
          border: active ? "1.5px solid #0f1a2e" : "1.5px solid #ececec",
          boxShadow: active ? "0 6px 14px -6px rgba(11,18,32,.25)" : "none",
        }}
      >
        {label}
      </button>
    );
  };
  return (
    <div className="flex gap-[7px] shrink-0">
      {opt("Yes", true)}
      {opt("No", false)}
    </div>
  );
};

// ── One toggle row with a colourful leading icon ──────────────────────────────
const Row: React.FC<{
  icon: React.ReactNode;
  tint: string;
  label: string;
  hint?: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}> = ({ icon, tint, label, hint, value, onChange }) => (
  <div className="flex items-center justify-between gap-3 py-[11px] border-b border-[#f4f3ec] last:border-b-0">
    <div className="flex items-center gap-[11px] min-w-0">
      <span
        className="w-[34px] h-[34px] rounded-[10px] grid place-items-center shrink-0"
        style={{ background: tint }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-[#0b1220] leading-snug">
          {label}
        </div>
        {hint && (
          <div className="text-[11.5px] text-[#8a92a3] leading-snug mt-[1px]">
            {hint}
          </div>
        )}
      </div>
    </div>
    <YesNo value={value} onChange={onChange} />
  </div>
);

/**
 * The embedded pricing card rendered inside the chat thread. Reads and writes
 * the `PricingForm` Redux slice. It's a lightweight "confirm a few final
 * details before pricing" step — an editable departure city plus a couple of
 * yes/no add-on toggles. On submit it composes a structured message and hands
 * it to `onComplete`.
 *
 * Unlike the intake form, this card does NOT lock the composer — the user can
 * keep chatting while it's shown.
 */
const PricingFormCard: React.FC<PricingFormCardProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const state = useSelector((s: any) => s.PricingForm as PricingFormState);

  const update = (partial: Partial<PricingFormState>) =>
    dispatch(updatePricingForm(partial));

  if (!state) return null;

  // ── Loading: backend `pricing_form_shimmer` in flight → skeleton loader ──────
  if (state.loading) {
    return <PricingFormSkeleton />;
  }

  // ── Completed: compact, non-interactive summary ──────────────────────────────
  if (state.completed) {
    const parts = [
      ...(state.startCity ? [`From ${state.startCity}`] : []),
      `Flights ${state.addFlights ? "✓" : "✕"}`,
      ...(state.isInternational
        ? [`Visa ${state.addVisa ? "✓" : "✕"}`, `eSIM ${state.addEsim ? "✓" : "✕"}`]
        : []),
    ];
    return (
      <div
        className="rounded-[16px] p-3 mb-3 ml-10 w-[calc(100%-40px)] max-ph:ml-0 max-ph:-mx-1 max-ph:w-auto max-ph:rounded-none"
        style={{ background: "#fff", border: "1px solid #ececec", maxWidth: 480 }}
      >
        <div className="text-[11px] font-extrabold text-[#1f8a5a] uppercase tracking-wide mb-2">
          ✓ Final details locked
        </div>
        <div className="text-[13.5px] font-semibold text-[#0b1220] leading-relaxed">
          {parts.join(" · ")}
        </div>
      </div>
    );
  }

  // ── Departure-city search state (single-select) ──────────────────────────────
  const query = state.startCityQuery ?? "";
  // The query reads as a settled selection when it matches the committed city.
  const committed =
    !!state.startCity && query.trim() === state.startCity.trim();
  const isSearchingCity = query.trim().length >= 2 && !committed;

  const pickCity = (city: Destination) =>
    update({
      startCity: city.name,
      startCityQuery: city.name,
      startCityCompleted: true,
    });

  const clearCity = () =>
    update({ startCity: null, startCityQuery: "", startCityCompleted: false });

  const canSubmit = canSubmitPricing(state);

  const submit = () => {
    if (!canSubmit) return;
    const composed = composePricingMessage(state);
    update({ completed: true, active: false });
    onComplete(composed);
  };

  return (
    <div
      className="ml-10 w-[calc(100%-40px)] max-ph:ml-0 max-ph:-mx-1 max-ph:w-auto rounded-[20px] max-ph:rounded-none bg-white overflow-hidden"
      style={{ maxWidth: 480, border: "1px solid #ececec" }}
    >
      {/* ── Enhanced header — colourful gradient + attention icons ────────────── */}
      <div
        className="px-2 py-[16px] rounded-t-[20px] max-ph:rounded-t-none relative"
        style={{
          background: "linear-gradient(135deg,#fffde7 0%,#fff 100%)",
          borderBottom: "1px solid #f4f3ec",
        }}
      >
        <div className="flex items-center gap-[11px] px-3">
          <div className="min-w-0">
            <div className="text-[16px] font-bold text-[#0b1220] leading-tight">
              {state.heading || "Almost there!"}
            </div>
            <div className="text-[12.5px] text-[#6b7280] mt-[2px] leading-snug">
              {state.subheading || "Confirm a few final details before pricing."}
            </div>
          </div>
        </div>

        {/* Colourful add-on pills — a quick visual cue of what's coming. */}
        {/* <div className="flex flex-wrap gap-[6px] mt-[12px]">
          <span className="inline-flex items-center gap-[5px] px-[9px] py-[4px] rounded-full text-[11px] font-bold" style={{ background: "#e0edff", color: "#1d4ed8" }}>
            ✈️ Flights
          </span>
          {state.isInternational && (
            <>
              <span className="inline-flex items-center gap-[5px] px-[9px] py-[4px] rounded-full text-[11px] font-bold" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                🛂 Visa
              </span>
              <span className="inline-flex items-center gap-[5px] px-[9px] py-[4px] rounded-full text-[11px] font-bold" style={{ background: "#dcfce7", color: "#15803d" }}>
                📶 eSIM
              </span>
            </>
          )}
        </div> */}
      </div>

      {/* Body */}
      <div className="px-4 py-[14px]">
        {/* ── Departure city — prefilled tag + editable City search ──────────── */}
        <div className="mb-[6px]">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#8a92a3] mb-[8px]">
            Departure city
          </div>

          {/* Selected city tag (single) */}
          {state.startCity && !isSearchingCity && (
            <div className="flex flex-wrap gap-[6px] mb-[10px]">
              <span
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
                {state.startCity}
                <button
                  type="button"
                  onClick={clearCity}
                  aria-label={`Change ${state.startCity}`}
                  className="w-[18px] h-[18px] rounded-full grid place-items-center shrink-0"
                  style={{ background: "rgba(0,0,0,0.06)", color: "#445069" }}
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 3l6 6M9 3l-6 6" />
                  </svg>
                </button>
              </span>
            </div>
          )}

          <StartCitySearch
            query={query}
            searchActive={isSearchingCity}
            onQueryChange={(q) => update({ startCityQuery: q })}
            onPick={pickCity}
            onClear={clearCity}
          />
        </div>

        {/* ── Add-on toggles ─────────────────────────────────────────────────── */}
        <div className="mt-[6px]">
          <Row
            tint="#e0edff"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            }
            label="Add flights?"
            hint="Include return flights in your quote."
            value={state.addFlights}
            onChange={(v) => update({ addFlights: v })}
          />
          {state.isInternational && (
            <>
              <Row
                tint="#f3e8ff"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 3h13a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4z" />
                    <circle cx="11" cy="9" r="2.5" />
                    <path d="M8 15h6" />
                  </svg>
                }
                label="Add visa assistance?"
                hint="Guidance and paperwork support."
                value={state.addVisa}
                onChange={(v) => update({ addVisa: v })}
              />
              <Row
                tint="#dcfce7"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                }
                label="Add eSIM / data?"
                hint="Stay connected the moment you land."
                value={state.addEsim}
                onChange={(v) => update({ addEsim: v })}
              />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pt-1 pb-[18px]">
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="w-full px-3 py-[12px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
          style={{
            background: canSubmit ? "#0f1a2e" : "#b8becc",
            cursor: canSubmit ? "pointer" : "not-allowed",
            boxShadow: canSubmit ? "0 8px 18px -6px rgba(11,18,32,.25)" : "none",
          }}
        >
          Get pricing
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PricingFormCard;
