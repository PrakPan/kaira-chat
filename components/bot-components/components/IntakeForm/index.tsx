import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIntakeForm } from "../../../../store/actions/intakeForm";
import type { IntakeFormState } from "./types";
import { TOTAL_STEPS } from "./constants";
import { composeIntakeMessage, validateStep, whenSummary, paxLabel } from "./intakePrompt";
import StepProgress from "./ui/StepProgress";
import DestinationStep from "./steps/DestinationStep";
import WhenStep from "./steps/WhenStep";
import WhoStep from "./steps/WhoStep";
import NotesStep from "./steps/NotesStep";

interface IntakeFormCardProps {
  /** Called with the composed message after the form is submitted. The parent
   *  decides whether to send it directly or gate it behind login first. */
  onComplete: (composedMessage: string) => void;
}

/**
 * The embedded multi-step intake card rendered inside the chat thread. Reads and
 * writes the `IntakeForm` Redux slice; steps 1–3 are required, step 4 optional.
 * On "Done" it composes a structured message and hands it to `onComplete`.
 */
const IntakeFormCard: React.FC<IntakeFormCardProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const state = useSelector(
    (s: any) => s.IntakeForm as IntakeFormState,
  );

  const update = (partial: Partial<IntakeFormState>) =>
    dispatch(updateIntakeForm(partial));

  const step = state?.step ?? 0;
  const isLast = step === TOTAL_STEPS - 1;
  const canAdvance = state ? validateStep(state, step) : false;

  const goBack = () => {
    if (step > 0) update({ step: step - 1 });
  };

  const goNext = () => {
    if (!canAdvance) return;
    if (!isLast) {
      update({ step: step + 1 });
      return;
    }
    // Final step → compose + hand off to the parent (which sends or gates login).
    const composed = composeIntakeMessage(state);
    update({ completed: true, active: false });
    onComplete(composed);
  };

  if (!state) return null;

  // ── Completed: show a compact, non-interactive summary ──────────────────────
  if (state.completed) {
    return (
      <div
        className="rounded-[16px] p-4 ml-10 max-ph:ml-0"
        style={{ background: "#fff", border: "1px solid #ececec", maxWidth: 480 }}
      >
        <div className="text-[11px] font-extrabold text-[#1f8a5a] uppercase tracking-wide mb-2">
          ✓ Trip details locked
        </div>
        <div className="text-[13.5px] font-semibold text-[#0b1220] leading-relaxed">
          {state.destination?.name} · {whenSummary(state)} ·{" "}
          {state.who ? paxLabel(state) : "just me"}
        </div>
      </div>
    );
  }

  return (
    <div
      className="ml-10 max-ph:ml-0 rounded-[20px] overflow-hidden bg-white"
      style={{
        width: "calc(100% - 40px)",
        maxWidth: 480,
        border: "1px solid #ececec",
        boxShadow: "0 18px 40px -18px rgba(11,18,32,0.16)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-[14px] flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg,#fffde7 0%,#fff 100%)",
          borderBottom: "1px solid #f4f3ec",
        }}
      >
        <StepProgress step={step} total={TOTAL_STEPS} />
      </div>

      {/* Active step */}
      <div className="px-5 py-[18px]">
        {step === 0 && <DestinationStep state={state} update={update} />}
        {step === 1 && <WhenStep state={state} update={update} />}
        {step === 2 && <WhoStep state={state} update={update} />}
        {step === 3 && <NotesStep state={state} update={update} />}
      </div>

      {/* Footer */}
      <div className="px-5 pb-[18px] flex gap-[10px]">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-[11px] rounded-[11px] text-[13px] font-semibold text-[#445069] transition-all"
            style={{ background: "#fff", border: "1.5px solid #ececec" }}
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          className="flex-1 px-4 py-[11px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
          style={{
            background: canAdvance ? "#0f1a2e" : "#b8becc",
            cursor: canAdvance ? "pointer" : "not-allowed",
            boxShadow: canAdvance ? "0 8px 18px -6px rgba(11,18,32,.25)" : "none",
          }}
        >
          {isLast ? "Done" : "Continue"}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IntakeFormCard;
