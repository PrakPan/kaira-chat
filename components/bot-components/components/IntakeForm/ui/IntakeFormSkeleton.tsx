import React from "react";
import { TOTAL_STEPS } from "../constants";

/**
 * Responsive skeleton loader for the in-chat intake form. Shown while the
 * backend `intake_form_shimmer` effect is in flight (state.loading === true),
 * before the prefill (`form_fields` / intake-form widget) arrives. Mirrors the
 * real card's chrome — header progress rail, title lines, the featured tile
 * grid (4-up desktop / 2-up mobile), and the footer action — so the swap to the
 * live form doesn't shift the layout.
 */
const IntakeFormSkeleton: React.FC = () => {
  return (
    <div
      className="ml-10 w-[calc(100%-40px)] max-ph:ml-0 max-ph:-mx-1 max-ph:w-auto rounded-[20px] max-ph:rounded-none bg-white"
      style={{ maxWidth: 480, border: "1px solid #ececec" }}
      role="status"
      aria-busy="true"
      aria-label="Loading trip form"
    >
      {/* Header — mirrors the step progress rail */}
      <div
        className="px-5 py-[14px] flex items-center gap-2 rounded-t-[20px] max-ph:rounded-t-none"
        style={{
          background: "linear-gradient(135deg,#fffde7 0%,#fff 100%)",
          borderBottom: "1px solid #f4f3ec",
        }}
      >
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className="ttw-intake-skel h-[6px] rounded-full flex-1"
          />
        ))}
      </div>

      {/* Body */}
      <div className="px-4 py-[18px]">
        <div className="ttw-intake-skel h-[18px] w-[55%] rounded-[6px] mb-[10px]" />
        <div className="ttw-intake-skel h-[12px] w-[80%] rounded-[6px] mb-[16px]" />

        {/* Search box placeholder */}
        <div className="ttw-intake-skel h-[42px] w-full rounded-[12px] mb-[14px]" />

        {/* Featured tile grid — matches the live grid columns */}
        <div className="grid grid-cols-4 gap-[9px] max-ph:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="ttw-intake-skel w-full"
              style={{ aspectRatio: "1 / 1.2", borderRadius: "26px 8px 26px 8px" }}
            />
          ))}
        </div>
      </div>

      {/* Footer action */}
      <div className="px-3 pt-2 pb-[18px] flex gap-[10px]">
        <div className="ttw-intake-skel flex-1 h-[42px] rounded-[11px]" />
      </div>

      <style>{`
        @keyframes ttwIntakeShimmer { 0% { background-position: -320px 0; } 100% { background-position: 320px 0; } }
        .ttw-intake-skel {
          background: linear-gradient(90deg, #ece9e1 0%, #f6f4ee 50%, #ece9e1 100%);
          background-size: 640px 100%;
          animation: ttwIntakeShimmer 1.3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default IntakeFormSkeleton;
