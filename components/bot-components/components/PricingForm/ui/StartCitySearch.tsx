import React from "react";
import useStartLocationSearch, {
  type StartLocation,
} from "../../../hooks/useStartLocationSearch";

interface StartCitySearchProps {
  query: string;
  /** True only while the user is actively searching for a new departure city
   *  (query differs from the committed selection). When false we neither fire
   *  the start_locations API nor show results. */
  searchActive?: boolean;
  onQueryChange: (q: string) => void;
  onPick: (loc: StartLocation) => void;
  onClear: () => void;
}

/** Departure-city search input + live `start_locations` autocomplete results
 *  (single-select). The results render as an absolute-positioned overlay so
 *  they float over the content below instead of pushing it down. */
const StartCitySearch: React.FC<StartCitySearchProps> = ({
  query,
  searchActive = query.trim().length >= 2,
  onQueryChange,
  onPick,
  onClear,
}) => {
  const { results, loading } = useStartLocationSearch(searchActive ? query : "");
  const showResults = searchActive;

  return (
    // `relative` so the results overlay anchors to the input; `z-20` keeps it
    // above the toggles below.
    <div className="relative z-20">
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
          className="flex-1 border-0 outline-none bg-transparent text-[16px] py-[11px] text-[#0b1220]"
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
          className="absolute left-0 right-0 top-[calc(100%+6px)] flex flex-col gap-[5px] overflow-y-auto p-[6px] rounded-[12px] bg-white"
          style={{
            maxHeight: "min(240px, 40dvh)",
            border: "1px solid #ececec",
            boxShadow: "0 16px 36px -12px rgba(11,18,32,.28)",
          }}
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
              key={r.place_id || r.text}
              type="button"
              onClick={() => onPick(r)}
              className="flex items-center gap-[11px] p-[9px_11px] rounded-[10px] text-left w-full transition-all hover:bg-[#fafaf5]"
              style={{ background: "#fff" }}
            >
              <span
                className="w-[30px] h-[30px] rounded-[9px] grid place-items-center shrink-0 text-[15px]"
                style={{ background: "#fafaf5" }}
              >
                🏙️
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13.5px] font-semibold text-[#0b1220] truncate">
                  {r.text}
                </span>
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
