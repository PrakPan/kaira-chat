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
          className="w-full border-0 outline-none bg-transparent text-[13.5px] text-[#0b1220] resize-none leading-relaxed"
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
        {NOTE_HINTS.map((h) => (
          <button
            type="button"
            key={h}
            onClick={() => addHint(h)}
            className="px-[11px] py-[6px] rounded-full text-[11.5px] font-semibold text-[#445069] transition-all"
            style={{ background: "#fff", border: "1px dashed #8a93a6" }}
          >
            + {h}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotesStep;
