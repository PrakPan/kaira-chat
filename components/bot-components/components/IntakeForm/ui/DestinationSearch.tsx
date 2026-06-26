import React from "react";
import useDestinationSearch from "../../../hooks/useDestinationSearch";
import type { Destination } from "../types";

interface DestinationSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onPick: (d: Destination) => void;
  onClear: () => void;
}

/** Search input + live suggest-API results list for step 1. */
const DestinationSearch: React.FC<DestinationSearchProps> = ({
  query,
  onQueryChange,
  onPick,
  onClear,
}) => {
  const { results, loading } = useDestinationSearch(query);
  const showResults = query.trim().length >= 2;

  return (
    <div>
      <div
        className="flex items-center gap-[9px] rounded-[11px] px-[13px] mb-3"
        style={{ background: "#fafaf5", border: "1.5px solid #ececec" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search any city or country"
          className="flex-1 border-0 outline-none bg-transparent text-[14px] py-[11px] text-[#0b1220]"
        />
        {query && (
          <button
            type="button"
            onClick={onClear}
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
          className="flex flex-col gap-[5px] overflow-y-auto pr-[2px]"
          style={{ maxHeight: 236 }}
        >
          {loading && results.length === 0 && (
            <div className="p-3 text-center text-[12.5px] text-[#8a93a6] italic">
              Searching…
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="p-3 text-center text-[12.5px] text-[#8a93a6] italic">
              No match. Keep typing, or pick from the list above.
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
                  <span>📍</span>
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

export default DestinationSearch;
