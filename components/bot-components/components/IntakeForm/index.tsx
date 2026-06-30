import React, { useLayoutEffect, useRef } from "react";
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
  const stepsCompleted = state?.stepsCompleted ?? [];
  const currentStepCompleted = !!stepsCompleted[step];
  // A backend-prefilled step that's already marked complete can always be
  // advanced — even if its loose client validation wouldn't pass (e.g. a
  // "dates" timing that arrived without explicit start/end).
  const canAdvance = state
    ? currentStepCompleted || validateStep(state, step)
    : false;

  // The horizontal track holds all four steps side-by-side and slides between
  // them; the viewport height animates to the active step so the card grows and
  // shrinks smoothly instead of swapping content. We observe the active step so
  // height also follows in-step changes (search results, pax counters, etc.).
  const viewportRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const active = stepRefs.current[step];
    if (!viewport || !active) return;
    const apply = () => {
      viewport.style.height = `${active.scrollHeight}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(active);
    return () => ro.disconnect();
  }, [step, state]);

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
        className="rounded-[16px] h-[11vh] p-3 mb-3 ml-10 w-[calc(100%-40px)] max-ph:ml-0 max-ph:-mx-1 max-ph:w-auto max-ph:rounded-none"
        style={{ background: "#fff", border: "1px solid #ececec", maxWidth: 480 }}
      >
        <div className="text-[11px] font-extrabold text-[#1f8a5a] uppercase tracking-wide mb-2">
          ✓ Trip details locked
        </div>
        <div className="text-[13.5px] font-semibold text-[#0b1220] leading-relaxed">
          {(state.destinations?.length
            ? state.destinations.map((d) => d.name).join(", ")
            : state.destination?.name) || "—"}{" "}
          · {whenSummary(state)} ·{" "}
          {state.who ? paxLabel(state) : "just me"}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Kaira intro line above the form — avatar on the left, mirrors the
          assistant chat bubble. */}
      {/* <div className="flex items-end gap-[9px] mb-3 max-w-[92%] max-ph:max-w-full">
        <div
          className="w-[26px] h-[26px] rounded-full overflow-hidden shrink-0"
          style={{ background: "#ffede0" }}
        >
          <img
            src="/KairaInsta.png"
            alt="Kaira"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.4";
            }}
          />
        </div>
        <div
          className="px-[13px] py-[10px] rounded-[14px] rounded-bl-[5px] text-[14px] leading-[1.5] text-[#0b1220]"
          style={{ background: "#fafaf5", border: "1px solid #f4f3ec" }}
        >
          Hi, I&apos;m <b className="font-bold">Kaira</b> 🌴 Let&apos;s plan your trip
          — <span className="italic">just a few quick taps</span> 👇
        </div>
      </div> */}

      <div
        className="ml-10 w-[calc(100%-40px)] max-ph:ml-0 max-ph:-mx-1 max-ph:w-auto rounded-[20px] max-ph:rounded-none bg-white"
        style={{
          maxWidth: 480,
          border: "1px solid #ececec",
        }}
      >
      {/* Header */}
      <div
        className="px-5 py-[14px] flex items-center gap-3 rounded-t-[20px] max-ph:rounded-t-none"
        style={{
          background: "linear-gradient(135deg,#fffde7 0%,#fff 100%)",
          borderBottom: "1px solid #f4f3ec",
        }}
      >
        <StepProgress
          step={step}
          total={TOTAL_STEPS}
          completedSteps={stepsCompleted}
        />
        {currentStepCompleted && (
          <span
            className="inline-flex items-center gap-[4px] pl-[6px] pr-[9px] py-[3px] rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0"
            style={{ background: "#e0f2e9", color: "#1f8a5a" }}
          >
            <span
              className="w-[13px] h-[13px] rounded-full grid place-items-center shrink-0"
              style={{ background: "#1f8a5a" }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            Done
          </span>
        )}
      </div>

      {/* Sliding viewport — height animates to the active step */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{ transition: "height .42s cubic-bezier(.2,.7,.3,1)" }}
      >
        <div
          className="flex items-start"
          style={{
            transform: `translateX(-${step * 100}%)`,
            transition: "transform .4s cubic-bezier(.2,.7,.3,1)",
          }}
        >
          {[
            <DestinationStep key="d" state={state} update={update} />,
            <WhenStep key="w" state={state} update={update} />,
            <WhoStep key="who" state={state} update={update} />,
            <NotesStep key="n" state={state} update={update} />,
          ].map((node, i) => (
            <div
              key={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="min-w-full px-2 py-[18px] self-start"
            >
              {node}
            </div>
          ))}
        </div>
      </div>

      {/* Footer — on mobile it sticks to the bottom of the chat scroll viewport
          so the Back / Continue actions stay visible in the first view without
          having to scroll the form down. */}
      <div className="px-3 pt-2 pb-[18px] flex gap-[10px] max-ph:sticky max-ph:bottom-[-33px] max-ph:z-10 max-ph:bg-white max-ph:border-t max-ph:border-[#f0f0f0] max-ph:pb-[calc(18px_+_env(safe-area-inset-bottom))]">
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
          className="flex-1 px-3 py-[11px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
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
    </>
  );
};

export default IntakeFormCard;
