import { useEffect, useRef, useState } from "react";
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
  IconPlus,
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

// Split a start-location label into a name and a region.
//
// /geos/search/start_locations/ returns one flat string per row — "Delft,
// Netherlands", "Bengaluru, Karnataka, India" — and no image, so this is the
// only material the "from" rows have to build the same two-line row the
// destination sheet shows. Everything before the first comma is the place;
// the rest is where it is.
const startParts = (text) => {
  const raw = String(text || "");
  const at = raw.indexOf(",");
  if (at === -1) return { name: raw, region: "" };
  return { name: raw.slice(0, at).trim(), region: raw.slice(at + 1).trim() };
};

// The trailing chip on a start-location row — the destination rows' type chip,
// said in the same voice.
//
// Google's `types` are machine words ("locality", "administrative_area_level_1")
// and several of them are on every row ("geocode", "political"), so only the
// ones that tell the traveller something get a label. No match, no chip — the
// destination rows drop theirs the same way when a result has no type.
const START_TYPES = [
  ["airport", "AIRPORT"],
  ["locality", "CITY"],
  ["administrative_area_level_1", "REGION"],
  ["country", "COUNTRY"],
];
const startType = (types) => {
  const list = Array.isArray(types) ? types : [];
  const hit = START_TYPES.find(([key]) => list.includes(key));
  return hit ? hit[1] : "";
};

export const destSubtitle = (d) =>
  d?.country || getParent(d?.path) || d?.type || "";

// Eager, not lazy: these lists are six rows of 36px thumbnails, already warmed
// by the prefetch in StepTrip, and `loading="lazy"` only delays the paint of a
// picture the browser is already holding in cache.
export const DestTile = ({ dest, className = "" }) => (
  <div className={`kform-tile ${className}`}>
    {dest?.image ? (
      <img src={CDN + dest.image} alt="" decoding="async" />
    ) : (
      <IconPin size={18} />
    )}
  </div>
);

// The id a destination is known by: search rows carry `resource_id`, picked
// destinations (and hot locations) carry `id`.
const destId = (d) => d?.resource_id || d?.id;

// "Oman", "Oman & UAE", "Oman, UAE & Qatar" — how a trip with several
// destinations is named in running copy.
export const joinNames = (names) =>
  names.length <= 1
    ? names[0] || ""
    : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;

/**
 * Step 1 — "Where are you going?": starting point, dates, destinations.
 * Search results come from Mercury's geo search; the selected values live in
 * the parent (starting location in Index state, destinations + dates in Redux).
 *
 * A trip can have several destinations (Oman and the UAE, or Kerala and
 * Goa). Each picked one is a row of its own with a remove button; the search
 * field is only on screen while there is none yet, or while the traveller is
 * adding another.
 */
const StepTrip = ({
  startingLocation,
  onPickStart,
  onClearStart,
  dests = [],
  onPickDest,
  onRemoveDest, // (input_id) => void
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
  // "Add another destination" was pressed and the search field is showing
  // under the picked ones. Wide screens only — a phone opens the sheet.
  const [destAdding, setDestAdding] = useState(false);
  const destInputRef = useRef(null);
  const showDestInput = dests.length === 0 || destAdding;

  const [calOpen, setCalOpen] = useState(false);
  // Which field, if any, has taken over the screen: "from" | "dest" | null.
  const [sheet, setSheet] = useState(null);

  const openSheet = (which) => {
    setFromOpen(false);
    setDestOpen(false);
    setCalOpen(false);
    setSheet(which);
  };

  // Focus "Starting from" whenever it comes up empty — on wide screens only.
  //
  // This was `autoFocus`, which fired on phones too: the keyboard came up on an
  // inline field that was never tapped, so the tap handlers that open the
  // full-screen search never ran, and typing got the desktop dropdown instead.
  // Same bug as the route step's "Add a city" field.
  const fromInputRef = useRef(null);
  useEffect(() => {
    if (!startingLocation && !isNarrow()) fromInputRef.current?.focus();
    // Keyed on empty/filled only: a different picked place shouldn't refocus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!startingLocation]);

  // Backstop for focus that doesn't come from a tap (the keyboard's "next"
  // key, assistive tech, a webview that ignores the pointerdown preventDefault):
  // on a phone these fields are never typed into — the sheet is.
  const redirectFocusToSheet = (e, which) => {
    if (!isNarrow()) return false;
    e.target.blur();
    openSheet(which);
    return true;
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

  // Warm the hot-destination thumbnails as soon as the form opens.
  //
  // Those tiles are the first thing in the destination list, but nothing
  // requests them until the traveller taps the field — so the list opened onto a
  // row of empty tiles that filled in one by one. Fetching them here means they
  // are already in the HTTP cache by then and the list paints complete.
  //
  // `new Image()` and not a <link rel="preload">: the same request the <img>
  // will make, so the cache entry matches, and no markup to clean up. The
  // browser drops the objects once they have loaded; failures are silent by
  // design — a warm cache is an optimisation, never a dependency.
  const hotImages = hotLocations
    .slice(0, 8)
    .map((d) => d?.image)
    .filter(Boolean)
    .join("|");

  useEffect(() => {
    if (!hotImages || typeof window === "undefined") return;
    hotImages.split("|").forEach((src) => {
      const img = new window.Image();
      img.src = CDN + src;
    });
  }, [hotImages]);

  // Bring the destination field into focus whenever it comes up to be typed
  // into — "Add another destination", or the last destination removed — on
  // wide screens only; a phone does its typing in the sheet.
  const [destFocusTick, setDestFocusTick] = useState(0);
  useEffect(() => {
    if (destFocusTick && !isNarrow()) destInputRef.current?.focus();
  }, [destFocusTick]);

  const closeAll = () => {
    setFromOpen(false);
    setDestOpen(false);
    setCalOpen(false);
    // An "add another" field left empty folds back into its button; one with
    // text in it stays, so nothing typed is thrown away.
    if (!destQuery.trim()) setDestAdding(false);
  };
  const anyPop =
    (fromOpen && !startingLocation) || (destOpen && showDestInput) || calOpen;

  const startAddingDest = () => {
    setDestQuery("");
    if (isNarrow()) {
      openSheet("dest");
      return;
    }
    setDestAdding(true);
    setDestOpen(true);
    setFromOpen(false);
    setCalOpen(false);
    setDestFocusTick((t) => t + 1);
  };

  const pickDest = (d) => {
    onPickDest(d);
    setDestOpen(false);
    setDestQuery("");
    setDestAdding(false);
  };

  const removeDest = (d) => {
    onRemoveDest(d.input_id);
    // Removing the only destination leaves the field empty; reopen the search
    // right away, the way the old single-destination "change" button did.
    if (dests.length === 1) startAddingDest();
  };

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

  // Places already on the trip aren't offered again.
  const pickedIds = new Set(dests.map(destId).filter(Boolean));
  const searching = destQuery.trim().length >= 2;
  const destList = (searching ? destResults : hotLocations)
    .filter((d) => !pickedIds.has(destId(d)))
    .slice(0, 6);
  // When every match is somewhere already picked, say so — "Nothing yet, I'm
  // adding places every week" would read as if the place didn't exist.
  const alreadyPicked = searching
    ? destResults.filter((d) => pickedIds.has(destId(d))).map((d) => d.name)
    : [];
  const destEmptyText = searching
    ? alreadyPicked.length
      ? `${joinNames(alreadyPicked)} ${alreadyPicked.length > 1 ? "are" : "is"} already on your trip.`
      : "Nothing yet. I'm adding places every week. Try Japan, Vietnam, Bali, Thailand or Italy."
    : "Start typing a country or a city.";
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
                  ref={fromInputRef}
                  className="kform-input"
                  value={fromQuery}
                  placeholder="A city or region"
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setFromOpen(true);
                  }}
                  onFocus={(e) => {
                    if (redirectFocusToSheet(e, "from")) return;
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

        {/* Destinations */}
        <div className="kform-field-wrap kform-area-dest">
          <div className="kform-label">
            {dests.length > 1 ? "Destinations" : "Destination"}
          </div>
          {dests.map((d) => (
            <div
              key={d.input_id || destId(d)}
              className="kform-field kform-dest-row"
            >
              <DestTile dest={d} />
              <div className="kform-opt-body">
                <div className="kform-opt-name kform-dest-name">{d.name}</div>
                <div className="kform-opt-sub kform-dest-sub">
                  {destSubtitle(d)}
                </div>
              </div>
              <button
                type="button"
                className="kform-clear"
                aria-label={`remove ${d.name}`}
                onClick={() => removeDest(d)}
              >
                <IconX />
              </button>
            </div>
          ))}
          {!showDestInput ? (
            <button
              type="button"
              className="kform-dashed-btn kform-dest-add"
              onClick={startAddingDest}
            >
              <IconPlus />
              Add another destination
            </button>
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
                  ref={destInputRef}
                  className="kform-input"
                  value={destQuery}
                  placeholder={
                    dests.length
                      ? "Add another country or city"
                      : "A country, a coastline, a city, anywhere"
                  }
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    setDestOpen(true);
                  }}
                  onFocus={(e) => {
                    if (redirectFocusToSheet(e, "dest")) return;
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
                      onClick={() => pickDest(d)}
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
                    <div className="kform-pop-empty">{destEmptyText}</div>
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
        label={
          fromQuery.trim().length >= 2
            ? fromLoading
              ? "Searching…"
              : "Matches"
            : null
        }
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
          fromResults.map((r) => {
            const { name, region } = startParts(r.text);
            return (
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
                {/* Same tile as the destination rows. Start locations carry no
                    image, so DestTile draws its pin fallback — which is the
                    point: the two sheets differ in content, not in shape. */}
                <DestTile dest={r} className="kform-tile--sm" />
                <div className="kform-opt-body">
                  <div className="kform-opt-name">{name}</div>
                  <div className="kform-opt-sub">{region}</div>
                </div>
                {startType(r.types) && (
                  <span className="kform-mono">{startType(r.types)}</span>
                )}
              </button>
            );
          })}
      </SearchSheet>

      <SearchSheet
        open={sheet === "dest"}
        onClose={() => setSheet(null)}
        placeholder={
          dests.length
            ? "Add another country or city"
            : "A country, a coastline, a city, anywhere"
        }
        value={destQuery}
        onChange={(e) => setDestQuery(e.target.value)}
        onClear={() => setDestQuery("")}
        label={destListLabel}
        loading={destLoading && destList.length === 0}
        empty={destList.length === 0 && !destLoading ? destEmptyText : null}
      >
        {destList.map((d, i) => (
          <button
            key={d.resource_id || d.id || `${d.name}-${i}`}
            type="button"
            className="kform-opt"
            onClick={() => {
              pickDest(d);
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
