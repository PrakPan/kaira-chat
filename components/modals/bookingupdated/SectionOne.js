import React, { useEffect, useRef, useState } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import Travelers from "./filtersmobile/Travelers";

const svgIcons = {
  filter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.66667 15.5V10.5H8.33333V12.1667H15V13.8333H8.33333V15.5H6.66667ZM0 13.8333V12.1667H5V13.8333H0ZM3.33333 10.5V8.83333H0V7.16667H3.33333V5.5H5V10.5H3.33333ZM6.66667 8.83333V7.16667H15V8.83333H6.66667ZM10 5.5V0.5H11.6667V2.16667H15V3.83333H11.6667V5.5H10ZM0 3.83333V2.16667H8.33333V3.83333H0Z"
        fill="currentColor"
      />
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 3V6M16 3V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5L10 17.5L19 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sort: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 7H16M4 12H12M4 17H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 8V18M18 18L15.5 15.5M18 18L20.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
};

/* The booking payload hands us dates as either "YYYY-MM-DD" or "DD-MM-YYYY"
   (with "/" separators in some flows), so normalise before constructing. */
const parseStayDate = (value) => {
  if (!value) return null;

  const parts = String(value).replace(/\//g, "-").split("T")[0].split("-");
  if (parts.length !== 3) return null;

  const iso =
    parts[0].length === 4
      ? `${parts[0]}-${parts[1]}-${parts[2]}`
      : `${parts[2]}-${parts[1]}-${parts[0]}`;

  const date = new Date(`${iso}T00:00:00`);
  return isNaN(date.getTime()) ? null : date;
};

const formatStayDay = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const getStayMeta = (checkIn, checkOut, duration) => {
  const start = parseStayDate(checkIn);
  if (!start) return null;

  const end = parseStayDate(checkOut);
  const nights = end
    ? Math.max(0, Math.round((end - start) / 86400000))
    : Number(duration) || 0;

  return {
    range: end ? `${formatStayDay(start)} – ${formatStayDay(end)}` : formatStayDay(start),
    nights,
  };
};

/* Controls sit on the cream header as raised white surfaces rather than
   outlined ones — a row of thin hairlines read as noise against the cream. */
export const SURFACE =
  "bg-white shadow-[0_1px_2px_rgba(11,18,32,0.09)] transition-shadow hover:shadow-[0_2px_7px_rgba(11,18,32,0.14)]";
const SURFACE_ACTIVE =
  "bg-[#0b1220] text-white shadow-[0_2px_8px_rgba(11,18,32,0.25)]";

/* Toggle pill — replaces the old square checkboxes so the quick filters read
   as one horizontally scrollable row on mobile. */
const QuickToggle = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 ttw-type-small font-500 ${
      active ? SURFACE_ACTIVE : `${SURFACE} text-[#445069] hover:text-[#0b1220]`
    }`}
  >
    {active ? svgIcons.check : null}
    {children}
  </button>
);

const Section = (props) => {
  const {
    clickType,
    booking_city,
    selectSearch,
    setSelectedSearch,
    setSelectedHotelId,
    searchResults,
    autocompleteLoading,
    handleSuggestionSelect,
    handleClearSearch,
    fetchHotelsAutocomplete,
    handleClose,
    setShowFilters,
    activeFilterCount = 0,
    checkIn,
    checkOut,
    duration,
    filters,
    setFilters,
    refundable,
    freeBreakfast,
    onToggleRefundable,
    onToggleFreeBreakfast,
    totalCount,
    selectedSort,
    sortOptions = [],
    onSortSelect,
    onSortReset,
    filterChips,
  } = props;

  const sentinelRef = useRef(null);
  const sortRef = useRef(null);
  const [condensed, setCondensed] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  /* A 1px sentinel above the sticky bar tells us when the header has left the
     top of the drawer, so the eyebrow/date line can fold away and give the
     list back its vertical space on small screens. */
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) =>
        // The drawer slides in from off-screen, which also reads as "not
        // intersecting" — only a negative top means we actually scrolled.
        setCondensed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchHandler = () => {
    if (selectSearch.trim().length > 3) {
      fetchHotelsAutocomplete();
    }
  };

  const stayMeta = getStayMeta(checkIn, checkOut, duration);
  const cityName = booking_city || "City";
  const isSorted = selectedSort && selectedSort !== "Sort";

  const stayMetaChip = stayMeta ? (
    <div className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-[12px] py-1.5 text-[#0b1220] shadow-[0_1px_2px_rgba(11,18,32,0.09)]">
      <span className="text-[#8a93a5]">{svgIcons.calendar}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.05em]">
        {stayMeta.range}
      </span>
      {stayMeta.nights ? (
        <>
          <span className="h-3 w-px bg-[#e7e5db]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#445069]">
            {stayMeta.nights} {stayMeta.nights > 1 ? "nights" : "night"}
          </span>
        </>
      ) : null}
    </div>
  ) : null;

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <div
        className={`sticky top-0 z-[900] w-full border-b border-[#e7e5db] bg-[#faf9f4] px-6 pt-[12px] pb-[12px] max-ph:px-4 ${
          condensed ? "shadow-[0_10px_24px_-18px_rgba(11,18,32,0.7)]" : ""
        }`}
      >
        <div className="flex flex-col gap-[12px]">
          {/* ── Title row ──────────────────────────────────────────────── */}
          <div className="flex flex-row items-center gap-[12px]">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => {
                try {
                  handleClose && handleClose();
                } catch (error) {
                  console.log("unable to close:", error);
                }
              }}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${SURFACE}`}
            >
              <img
                src="/backarrow.svg"
                alt=""
                width={18}
                height={18}
                style={{ margin: 0, maxWidth: "none" }}
              />
            </button>

            <div className="min-w-0 flex-1">
              <div
                className={`flex flex-row items-center gap-1.5 overflow-hidden transition-all duration-200 ${
                  condensed ? "max-h-0 opacity-0" : "max-h-5 opacity-100"
                }`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7e700]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a93a5]">
                  {clickType == "Add" ? "Adding a stay" : "Changing your stay"}
                </span>
              </div>

              <h2 className="mb-0 truncate ttw-type-h4 md:ttw-type-h3 font-600 text-[#0b1220]">
                Stays in{" "}
                <span className="ttw-type-serif ml-[3px]">{cityName}</span>
              </h2>

              {/* Phones have no room for the chip beside the title, so the
                  same stay meta drops to a plain line underneath. */}
              {stayMeta && !condensed ? (
                <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-[#445069] sm:hidden">
                  {stayMeta.range}
                  {stayMeta.nights
                    ? ` · ${stayMeta.nights} ${
                        stayMeta.nights > 1 ? "nights" : "night"
                      }`
                    : ""}
                </div>
              ) : null}
            </div>

            <div className={`max-sm:hidden ${condensed ? "hidden" : ""}`}>
              {stayMetaChip}
            </div>
          </div>

          {/* ── Search ─────────────────────────────────────────────────── */}
          <div className="flex flex-row items-center gap-2">
            <div className="relative flex flex-1 flex-row items-center">
              <span
                className="absolute left-3.5 text-[#8a93a5]"
                onClick={searchHandler}
              >
                {svgIcons.search}
              </span>

              <input
                type="text"
                value={selectSearch}
                onChange={(e) => {
                  setSelectedSearch(e.target.value);
                  setSelectedHotelId && setSelectedHotelId(null);
                }}
                placeholder={`Search stays in ${cityName}`}
                className="h-11 w-full rounded-full bg-white pl-11 pr-10 ttw-type-body text-[#0b1220] shadow-[0_1px_2px_rgba(11,18,32,0.09)] transition-shadow placeholder:text-[#9aa1b1] focus:shadow-[0_0_0_1.5px_#0b1220] focus:outline-none focus:ring-0"
              />

              {selectSearch && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={handleClearSearch}
                  className="absolute right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#eeece3] text-[#445069] transition-colors hover:bg-[#0b1220] hover:text-white"
                >
                  {svgIcons.close}
                </button>
              )}

              {selectSearch.trim().length > 3 && (
                <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl bg-white shadow-[0_2px_6px_rgba(11,18,32,0.08),0_18px_38px_-16px_rgba(11,18,32,0.5)]">
                  {autocompleteLoading ? (
                    <div className="px-[16px] py-[12px] text-center">
                      <p className="mb-0 ttw-type-small text-[#445069]">
                        Searching…
                      </p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-1.5">
                      {searchResults.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionSelect(suggestion);
                          }}
                          className={`cursor-pointer px-[12px] py-2 transition-colors hover:bg-[#faf9f4] ${
                            index !== searchResults.length - 1
                              ? "border-b border-[#f4f3ec]"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <IoMdSearch className="mt-1 flex-shrink-0 text-[#9aa1b1]" />
                            <div className="min-w-0 flex-1">
                              <p className="mb-0 truncate ttw-type-small font-600 text-[#0b1220]">
                                {suggestion.name}
                              </p>
                              <p className="mb-0 mt-0.5 font-mono text-[10px] uppercase tracking-[0.05em] text-[#8a93a5]">
                                {suggestion.city}, {suggestion.country}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white px-[12px] py-[12px] text-center">
                      <p className="mb-0 ttw-type-small text-[#445069]">
                        No results found
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ── Quick filters + More Filters ───────────────────────────── */}
          <div className="flex flex-row items-center gap-2">
            {/* Chips scroll under the pinned button, which stays reachable.
                The left bleed lets them run to the drawer edge on phones. */}
            <div className="-ml-6 flex min-w-0 flex-1 flex-row items-center gap-2 overflow-x-auto pl-6 no-scrollbar max-ph:-ml-4 max-ph:pl-4">
              <Travelers filters={filters} setFilters={setFilters} />

              <QuickToggle active={refundable} onClick={onToggleRefundable}>
                Refundable
              </QuickToggle>

              <QuickToggle active={freeBreakfast} onClick={onToggleFreeBreakfast}>
                Free breakfast
              </QuickToggle>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="relative flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#07213A] px-[16px] ttw-type-small font-500 text-white shadow-[0_2px_8px_rgba(7,33,58,0.28)] transition-colors hover:bg-[#0b3965]"
            >
              {svgIcons.filter}
              <span>More Filters</span>
              {activeFilterCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f7e700] px-1 font-mono text-[10px] font-bold text-[#0b1220] ring-2 ring-[#faf9f4]">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>

          {filterChips ? <div>{filterChips}</div> : null}

          {/* ── Result count + sort ────────────────────────────────────── */}
          {totalCount ? (
            <div className="flex flex-row items-center justify-between gap-[12px] border-t border-[#eeece3] pt-2.5">
              <div className="min-w-0 truncate ttw-type-small text-[#445069]">
                <span className="ttw-type-num font-600 text-[#0b1220]">
                  {totalCount}
                </span>{" "}
                stays in {cityName}
              </div>

              <div ref={sortRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className={`flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 ttw-type-small font-500 ${
                    isSorted ? SURFACE_ACTIVE : `${SURFACE} text-[#0b1220]`
                  }`}
                >
                  {svgIcons.sort}
                  <span className="truncate max-ph:max-w-[90px]">
                    {selectedSort}
                  </span>
                  {isSorted ? (
                    <span
                      role="button"
                      aria-label="Clear sort"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortOpen(false);
                        onSortReset && onSortReset();
                      }}
                      className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 hover:bg-white/35"
                    >
                      {svgIcons.close}
                    </span>
                  ) : null}
                </button>

                {sortOpen ? (
                  <div className="absolute right-0 z-20 mt-1.5 w-max overflow-hidden rounded-xl bg-white p-1 shadow-[0_2px_6px_rgba(11,18,32,0.08),0_18px_38px_-16px_rgba(11,18,32,0.5)]">
                    {sortOptions.map((option, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSortOpen(false);
                          onSortSelect && onSortSelect(option);
                        }}
                        className={`cursor-pointer rounded-lg px-[12px] py-1.5 ttw-type-small font-500 transition-colors ${
                          option === selectedSort
                            ? "bg-[#0b1220] text-white"
                            : "text-[#0b1220] hover:bg-[#f4f3ec]"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Section;
