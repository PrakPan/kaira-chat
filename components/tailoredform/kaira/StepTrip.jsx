import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import axiossearchinstance from "../../../services/search/searchsuggest";
import axiossearchstartinginstance from "../../../services/search/startinglocation";
import { getParent } from "../../../utils/tailoredform";
import WhenPanel from "./WhenPanel";
import SearchSheet from "./SearchSheet";
import {
  IconCalendar,
  IconMoon,
  IconPin,
  IconSearch,
  IconTarget,
  IconX,
} from "./icons";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net/";

// Phones get the full-screen search (see SearchSheet); wider screens keep the
// dropdown under the field.
//
// Read inside event handlers only, never during render — the rule in this
// stylesheet's header is about never letting a media query decide the LAYOUT at
// hydration. This decides which of two behaviours a tap runs, long after
// hydration, so there is nothing to mismatch.
const NARROW = "(max-width: 767.98px)";
const isNarrow = () =>
  typeof window !== "undefined" && window.matchMedia(NARROW).matches;

export const destSubtitle = (d) =>
  d?.country || getParent(d?.path) || d?.type || "";

export const DestTile = ({ dest, className = "" }) => (
  <div className={`kform-tile ${className}`}>
    {dest?.image ? (
      <img src={CDN + dest.image} alt="" loading="lazy" />
    ) : (
      <IconPin size={18} />
    )}
  </div>
);

/**
 * Step 1 — "Where are you going?": starting point, dates, destination.
 * Search results come from Mercury's geo search; the selected values live in
 * the parent (starting location in Index state, destination + dates in Redux).
 */
const StepTrip = ({
  startingLocation,
  onPickStart,
  onClearStart,
  dest,
  onPickDest,
  onClearDest,
  date,
  dateInfo,
  onFixed,
  onFlexible,
  onAnytime,
  onResetType,
  errors,
  readNote,
}) => {
  const hotLocations =
    useSelector((state) => state.HotLocationSearch?.locations) || [];

  const [fromQuery, setFromQuery] = useState("");
  const [fromOpen, setFromOpen] = useState(false);
  const [fromResults, setFromResults] = useState([]);
  const [fromLoading, setFromLoading] = useState(false);
  const debouncedFrom = useDebounce(fromQuery, 350);

  const [destQuery, setDestQuery] = useState("");
  const [destOpen, setDestOpen] = useState(false);
  const [destResults, setDestResults] = useState([]);
  const [destLoading, setDestLoading] = useState(false);
  const debouncedDest = useDebounce(destQuery, 350);

  const [calOpen, setCalOpen] = useState(false);
  // Which field, if any, has taken over the screen: "from" | "dest" | null.
  const [sheet, setSheet] = useState(null);

  const openSheet = (which) => {
    setFromOpen(false);
    setDestOpen(false);
    setCalOpen(false);
    setSheet(which);
  };

  useEffect(() => {
    let cancelled = false;
    const q = debouncedFrom.trim();
    if (q.length < 2) {
      setFromResults([]);
      return;
    }
    setFromLoading(true);
    axiossearchstartinginstance
      .get(`?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!cancelled) setFromResults(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
      })
      .catch(() => {
        if (!cancelled) setFromResults([]);
      })
      .finally(() => {
        if (!cancelled) setFromLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedFrom]);

  useEffect(() => {
    let cancelled = false;
    const q = debouncedDest.trim();
    if (q.length < 2) {
      setDestResults([]);
      return;
    }
    setDestLoading(true);
    axiossearchinstance
      .get(`?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!cancelled) setDestResults(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
      })
      .catch(() => {
        if (!cancelled) setDestResults([]);
      })
      .finally(() => {
        if (!cancelled) setDestLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedDest]);

  const closeAll = () => {
    setFromOpen(false);
    setDestOpen(false);
    setCalOpen(false);
  };
  const anyPop = (fromOpen && !startingLocation) || (destOpen && !dest) || calOpen;

  // Dismiss an open popover by listening for a press outside it, rather than by
  // laying a full-screen scrim over the page.
  //
  // The scrim was `position: fixed; inset: 0`, so while any dropdown or the date
  // panel was open it sat over the whole viewport — and a wheel or a touch drag
  // anywhere, including over the fields themselves, landed on the scrim instead
  // of on the scrolling body. That is the "sometimes it won't scroll" of it.
  // It also ate the first click on anything outside, so dismissing and pressing
  // took two taps.
  //
  // Capture phase and no preventDefault: the popover closes AND the press
  // reaches whatever was actually pressed.
  useEffect(() => {
    if (!anyPop) return undefined;
    const onDown = (e) => {
      // A press inside a field or its own popover is not an outside press —
      // both live in the same .kform-field-wrap.
      if (e.target instanceof Node && e.target.parentElement === null) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el && el.closest(".kform-field-wrap")) return;
      closeAll();
    };
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyPop]);

  const destList = destQuery.trim().length >= 2 ? destResults : hotLocations.slice(0, 6);
  const destListLabel =
    destQuery.trim().length >= 2
      ? destLoading
        ? "Searching…"
        : "Matches"
      : "Popular right now";

  return (
    <div className="kform-step">
      <h1 className="kform-h1">
        Where are you <span className="kform-serif">going</span>?
      </h1>
      <p className="kform-lead">
        Tell me the shape of it. I'll handle the 47 Chrome tabs.
      </p>

      <div className="kform-trip">
        {/* Starting from */}
        <div className="kform-field-wrap kform-area-from">
          <div className="kform-label">Starting from</div>
          {startingLocation ? (
            <div className="kform-field">
              <span className="kform-field-icon">
                <IconTarget />
              </span>
              <div className="kform-field-value">{startingLocation.name}</div>
              <button
                type="button"
                className="kform-clear"
                aria-label="change starting point"
                onClick={() => {
                  onClearStart();
                  setFromQuery("");
                  if (isNarrow()) {
                    openSheet("from");
                    return;
                  }
                  setFromOpen(true);
                  setDestOpen(false);
                  setCalOpen(false);
                }}
              >
                <IconX />
              </button>
            </div>
          ) : (
            <>
              <div
                className={`kform-field${fromOpen ? " is-open" : ""}`}
                // preventDefault stops the field taking focus, so the keyboard
                // comes up against the sheet's own input rather than flashing
                // here first.
                // Two handlers on purpose. pointerdown only blocks the
                // default — that stops the field taking focus, so the keyboard
                // never comes up against this input. The sheet is opened on
                // CLICK, the last event of the tap: mounting a full-screen
                // overlay at pointerdown put a fresh result row under a finger
                // that had not lifted yet, and the tap's own click then landed
                // on it, picking a suggestion nobody chose.
                onPointerDown={(e) => {
                  if (!isNarrow()) return;
                  e.preventDefault();
                }}
                onClick={() => {
                  if (!isNarrow()) return;
                  openSheet("from");
                }}
              >
                <span className="kform-field-icon kform-field-icon--muted">
                  <IconSearch />
                </span>
                <input
                  className="kform-input"
                  value={fromQuery}
                  placeholder="A city or region"
                  autoFocus
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setFromOpen(true);
                  }}
                  onFocus={() => {
                    setFromOpen(true);
                    setDestOpen(false);
                    setCalOpen(false);
                  }}
                />
              </div>
              {fromOpen && fromQuery.trim().length >= 2 && (
                <div className="kform-pop" style={{ maxHeight: 264 }}>
                  {fromResults.map((r) => (
                    <button
                      key={r.place_id}
                      type="button"
                      className="kform-opt"
                      onClick={() => {
                        onPickStart({ name: r.text, place_id: r.place_id });
                        setFromOpen(false);
                        setFromQuery("");
                      }}
                    >
                      <span className="kform-field-icon kform-field-icon--muted">
                        <IconPin />
                      </span>
                      <span className="kform-opt-name" style={{ fontWeight: 600, flex: 1 }}>
                        {r.text}
                      </span>
                    </button>
                  ))}
                  {!fromLoading && fromResults.length === 0 && (
                    <div className="kform-pop-empty">
                      Nothing yet. Try a bigger city, I fly from most metros.
                    </div>
                  )}
                  {fromLoading && fromResults.length === 0 && (
                    <div className="kform-pop-empty">Searching…</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* When */}
        <div className="kform-field-wrap kform-area-when">
          <div className="kform-label">When</div>
          <button
            type="button"
            className={`kform-field kform-field--btn${calOpen ? " is-open" : ""}${
              errors?.when ? " has-error" : ""
            }`}
            onClick={() => {
              setCalOpen(!calOpen);
              setFromOpen(false);
              setDestOpen(false);
            }}
          >
            <span className="kform-field-icon">
              <IconCalendar />
            </span>
            <div
              className={`kform-field-value kform-field-value--sm${
                dateInfo.ok ? "" : " is-placeholder"
              }`}
            >
              {dateInfo.label}
            </div>
            {dateInfo.nights > 0 && (
              <div className="kform-pill">{dateInfo.nights} nights</div>
            )}
          </button>
          {errors?.when && <div className="kform-field-error">{errors.when}</div>}
          {calOpen && (
            <div className="kform-when-pop">
              <WhenPanel
                date={date}
                onFixed={onFixed}
                onFlexible={onFlexible}
                onAnytime={onAnytime}
                onResetType={onResetType}
                onDone={() => setCalOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Destination */}
        <div className="kform-field-wrap kform-area-dest">
          <div className="kform-label">Destination</div>
          {dest ? (
            <div className="kform-field" style={{ padding: "12px 16px", gap: 14 }}>
              <DestTile dest={dest} />
              <div className="kform-opt-body">
                <div className="kform-opt-name" style={{ fontSize: 15 }}>
                  {dest.name}
                </div>
                <div className="kform-opt-sub" style={{ fontSize: 12, marginTop: 2 }}>
                  {destSubtitle(dest)}
                </div>
              </div>
              <button
                type="button"
                className="kform-clear"
                aria-label="change destination"
                onClick={() => {
                  onClearDest();
                  setDestQuery("");
                  if (isNarrow()) {
                    openSheet("dest");
                    return;
                  }
                  setDestOpen(true);
                  setFromOpen(false);
                  setCalOpen(false);
                }}
              >
                <IconX />
              </button>
            </div>
          ) : (
            <>
              <div
                className={`kform-field${destOpen ? " is-open" : ""}${
                  errors?.destination1 ? " has-error" : ""
                }`}
                // Two handlers on purpose. pointerdown only blocks the
                // default — that stops the field taking focus, so the keyboard
                // never comes up against this input. The sheet is opened on
                // CLICK, the last event of the tap: mounting a full-screen
                // overlay at pointerdown put a fresh result row under a finger
                // that had not lifted yet, and the tap's own click then landed
                // on it, picking a suggestion nobody chose.
                onPointerDown={(e) => {
                  if (!isNarrow()) return;
                  e.preventDefault();
                }}
                onClick={() => {
                  if (!isNarrow()) return;
                  openSheet("dest");
                }}
              >
                <span className="kform-field-icon kform-field-icon--muted">
                  <IconSearch />
                </span>
                <input
                  className="kform-input"
                  value={destQuery}
                  placeholder="A country, a coastline, a city, anywhere"
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    setDestOpen(true);
                  }}
                  onFocus={() => {
                    setDestOpen(true);
                    setFromOpen(false);
                    setCalOpen(false);
                  }}
                />
              </div>
              {destOpen && (
                <div className="kform-pop">
                  <div className="kform-pop-label">{destListLabel}</div>
                  {destList.map((d, i) => (
                    <button
                      key={d.resource_id || d.id || `${d.name}-${i}`}
                      type="button"
                      className="kform-opt"
                      onClick={() => {
                        onPickDest(d);
                        setDestOpen(false);
                        setDestQuery("");
                      }}
                    >
                      <DestTile dest={d} className="kform-tile--sm" />
                      <div className="kform-opt-body">
                        <div className="kform-opt-name">{d.name}</div>
                        <div className="kform-opt-sub">{destSubtitle(d)}</div>
                      </div>
                      {d.type && <span className="kform-mono">{String(d.type).toUpperCase()}</span>}
                    </button>
                  ))}
                  {destList.length === 0 && !destLoading && (
                    <div className="kform-pop-empty">
                      {destQuery.trim().length >= 2
                        ? "Nothing yet. I'm adding places every week. Try Japan, Vietnam, Bali, Thailand or Italy."
                        : "Start typing a country or a city."}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {errors?.destination1 && (
            <div className="kform-field-error">{errors.destination1}</div>
          )}
        </div>
      </div>

      <div className="kform-note">
        <IconMoon />
        <div>{readNote}</div>
      </div>

      {/* Phone-only: the two suggestion fields take over the screen rather than
          dropping a list under themselves. Same data and same pick handlers as
          the dropdowns above — only the container differs. */}
      <SearchSheet
        open={sheet === "from"}
        onClose={() => setSheet(null)}
        placeholder="Search a city or region"
        value={fromQuery}
        onChange={(e) => setFromQuery(e.target.value)}
        onClear={() => setFromQuery("")}
        loading={fromLoading && fromResults.length === 0}
        empty={
          fromQuery.trim().length < 2
            ? "Type a city or region to see matches."
            : !fromLoading && fromResults.length === 0
              ? "Nothing yet. Try a bigger city, I fly from most metros."
              : null
        }
      >
        {fromQuery.trim().length >= 2 &&
          fromResults.map((r) => (
            <button
              key={r.place_id}
              type="button"
              className="kform-opt"
              onClick={() => {
                onPickStart({ name: r.text, place_id: r.place_id });
                setFromQuery("");
                setSheet(null);
              }}
            >
              <span className="kform-field-icon kform-field-icon--muted">
                <IconPin />
              </span>
              <span className="kform-opt-name" style={{ fontWeight: 600, flex: 1 }}>
                {r.text}
              </span>
            </button>
          ))}
      </SearchSheet>

      <SearchSheet
        open={sheet === "dest"}
        onClose={() => setSheet(null)}
        placeholder="A country, a coastline, a city, anywhere"
        value={destQuery}
        onChange={(e) => setDestQuery(e.target.value)}
        onClear={() => setDestQuery("")}
        label={destListLabel}
        loading={destLoading && destList.length === 0}
        empty={
          destList.length === 0 && !destLoading
            ? destQuery.trim().length >= 2
              ? "Nothing yet. I'm adding places every week. Try Japan, Vietnam, Bali, Thailand or Italy."
              : "Start typing a country or a city."
            : null
        }
      >
        {destList.map((d, i) => (
          <button
            key={d.resource_id || d.id || `${d.name}-${i}`}
            type="button"
            className="kform-opt"
            onClick={() => {
              onPickDest(d);
              setDestQuery("");
              setSheet(null);
            }}
          >
            <DestTile dest={d} className="kform-tile--sm" />
            <div className="kform-opt-body">
              <div className="kform-opt-name">{d.name}</div>
              <div className="kform-opt-sub">{destSubtitle(d)}</div>
            </div>
            {d.type && <span className="kform-mono">{String(d.type).toUpperCase()}</span>}
          </button>
        ))}
      </SearchSheet>
    </div>
  );
};

export default StepTrip;
