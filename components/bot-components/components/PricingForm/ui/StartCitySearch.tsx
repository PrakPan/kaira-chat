import React from "react";
import useDestinationSearch from "../../../hooks/useDestinationSearch";
import type { Destination } from "../../IntakeForm/types";

interface StartCitySearchProps {
  query: string;
  /** True only while the user is actively searching for a new departure city
   *  (query differs from the committed selection). When false we neither fire
   *  the suggest API nor show results. */
  searchActive?: boolean;
  onQueryChange: (q: string) => void;
  onPick: (city: Destination) => void;
  onClear: () => void;
}

/** Departure-city search input + live City suggest-API results (single-select).
 *  Mirrors the intake form's DestinationSearch but scopes the endpoint to
 *  `type=City` and only ever commits one city. */
const StartCitySearch: React.FC<StartCitySearchProps> = ({
  query,
  searchActive = query.trim().length >= 2,
  onQueryChange,
  onPick,
  onClear,
}) => {
  // Scope the suggest endpoint to cities only; pass "" when not searching so no
  // request fires for a committed selection.
  const { results, loading } = useDestinationSearch(
    searchActive ? query : "",
    2,
    "City",
  );
  const showResults = searchActive;

  return (
    <div>
      <div
        className="flex items-center gap-[9px] rounded-[11px] px-[13px]"
        style={{ background: "#fafaf5", border: "1.5px solid #ececec" }}
      >
        {/* colourful location pin */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search your departure city"
          className="flex-1 border-0 outline-none bg-transparent text-[14px] py-[11px] text-[#0b1220]"
        />
        {query && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear city"
            className="w-5 h-5 rounded-full grid place-items-center shrink-0"
            style={{ background: "#ececec", color: "#445069" }}
          >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <div
          className="flex flex-col gap-[5px] overflow-y-auto pr-[2px] mt-2"
          style={{ maxHeight: "min(220px, 34dvh)" }}
        >
          {loading && results.length === 0 && (
            <div className="p-3 text-center text-[12.5px] text-[#8a93a6] italic">
              Searching…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="p-3 text-center text-[12.5px] text-[#8a93a6] italic">
              No matching city. Keep typing.
            </div>
          )}
          {results.map((r) => (
            <button
              key={r.resource_id || r.name}
              type="button"
              onClick={() => onPick(r)}
              className="flex items-center gap-[11px] p-[9px_11px] rounded-[12px] text-left w-full transition-all"
              style={{ background: "#fff", border: "1px solid #ececec" }}
            >
              <span
                className="w-[30px] h-[30px] rounded-[9px] overflow-hidden grid place-items-center shrink-0"
                style={{ background: "#fafaf5" }}
              >
                {r.image ? (
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <span>🏙️</span>
                )}
              </span>
              <span className="flex-1 flex flex-col min-w-0">
                <span className="text-[13.5px] font-bold text-[#0b1220] truncate">
                  {r.name}
                </span>
                {r.place_tag && (
                  <span className="text-[11px] text-[#8a93a6] font-medium truncate">
                    {r.place_tag}
                  </span>
                )}
              </span>
              <span className="text-[10.5px] font-extrabold text-[#8a93a6] shrink-0">
                SELECT
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StartCitySearch;
