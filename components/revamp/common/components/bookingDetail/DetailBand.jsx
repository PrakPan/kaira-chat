import React from "react";
import { getModeAccent } from "./modeAccent";

/**
 * The ink header every transfer detail drawer opens with — the drawer's front
 * door. Before this, every section carried equal weight and nothing announced
 * which booking you were looking at.
 *
 * Two rows: back arrow, mode tile, title and status; then a kicker line with
 * what kind of booking it is and when, against the one number that summarises
 * the whole leg (duration, distance, or how many services a package holds).
 *
 * Sticky, so back stays reachable however long the rail gets.
 */
export default function DetailBand({
  mode,
  title,
  kicker,
  summary,
  status,
  onBack,
  loading = false,
}) {
  const accent = getModeAccent(mode);

  return (
    <div className="sticky top-0 z-[900] bg-[#0b1220] text-white px-4 pt-3.5 pb-4">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="shrink-0 flex items-center opacity-85 hover:opacity-100 transition-opacity"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>

        <span
          className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <accent.Icon size={16} color={accent.onInk} aria-hidden="true" />
        </span>

        {loading ? (
          <div className="h-4 w-44 max-w-full rounded bg-white/15" />
        ) : (
          <h2 className="flex-1 min-w-0 mb-0 text-[14.5px] font-600 tracking-[-0.012em] truncate">
            {title}
          </h2>
        )}

        {status ? (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-white/15 text-white ttw-type-small font-600 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
            {status}
          </span>
        ) : null}
      </div>

      {kicker || summary ? (
        <div className="flex items-baseline justify-between gap-3 mt-2.5">
          <span className="ttw-type-status text-white/55 truncate">{kicker}</span>
          {summary ? (
            <span className="ttw-type-status text-white shrink-0 tracking-[0.09em]">
              {summary}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
