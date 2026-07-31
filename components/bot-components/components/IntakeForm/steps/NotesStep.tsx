import React from "react";
import type { IntakeFormState } from "../types";
import { NOTE_HINTS } from "../constants";

interface StepProps {
  state: IntakeFormState;
  update: (partial: Partial<IntakeFormState>) => void;
}

/** Step 4 — free-text notes (optional). */
const NotesStep: React.FC<StepProps> = ({ state, update }) => {
  const addHint = (hint: string) => {
    const cur = state.notes.trim();
    const next = cur
      ? `${cur.replace(/[.\s]*$/, "")}, ${hint}`
      : hint.charAt(0).toUpperCase() + hint.slice(1);
    update({ notes: next });
  };

  // Prefer the context-aware chips fetched from `/chatkit/context-chips`; fall
  // back to the static hints when the fetch hasn't resolved or failed.
  const hints = state.noteHints?.length ? state.noteHints : NOTE_HINTS;
  // Widths for the placeholder shimmer chips shown while the context-chips
  // request is in flight — varied so the row reads like real suggestions.
  const SHIMMER_WIDTHS = [78, 104, 88, 120, 92, 70];

  return (
    <div>
      <div className="text-[18px] font-extrabold tracking-tight mb-[3px]">
        Tell me anything
      </div>
      <div className="text-[12px] text-[#8a93a6] mb-[14px]">
        Budget, vibe, must-dos. Optional but it helps a lot.
      </div>

      <div
        className="rounded-[13px] p-[13px]"
        style={{
          background: "linear-gradient(135deg,#fffde7 0%,#fff 60%)",
          border: "1.5px solid #ececec",
        }}
      >
        <textarea
          value={state.notes}
          maxLength={2000}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="e.g. it's our honeymoon, around ₹2L, love beaches and great food, want one fancy dinner."
          className="w-full border-0 outline-none bg-transparent text-[16px] text-[#0b1220] resize-none leading-relaxed"
          style={{ minHeight: 80 }}
        />
        <div className="flex items-center gap-2 mt-[6px]">
          <span className="text-[10.5px] text-[#445069] font-semibold">
            Kaira reads it all
          </span>
          <span className="ml-auto text-[10px] text-[#8a93a6] tabular-nums">
            {state.notes.length} / 2000
          </span>
        </div>
      </div>

      <div className="mt-[11px] flex flex-wrap gap-[5px]">
        {state.noteHintsLoading ? (
          <>
            {SHIMMER_WIDTHS.map((w, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="rounded-full"
                style={{
                  width: w,
                  height: 27,
                  background:
                    "linear-gradient(90deg,#f3f4f6 0%,#e9eaee 50%,#f3f4f6 100%)",
                  backgroundSize: "200% 100%",
                  animation: "intakeChipShimmer 1.4s ease-in-out infinite",
                }}
              />
            ))}
            <style>{`
              @keyframes intakeChipShimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </>
        ) : (
          hints.map((h) => (
            <button
              type="button"
              key={h}
              onClick={() => addHint(h)}
              className="px-[11px] py-[6px] rounded-full text-[11.5px] font-semibold text-[#445069] transition-all"
              style={{ background: "#fff", border: "1px dashed #8a93a6" }}
            >
              + {h}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesStep;
