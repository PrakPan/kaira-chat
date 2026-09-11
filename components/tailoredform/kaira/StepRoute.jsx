import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useDebounce from "../../../hooks/useDebounce";
import axiossearchinstance from "../../../services/search/searchsuggest";
import Stepper from "./Stepper";
import SearchSheet from "./SearchSheet";
import { DestTile } from "./StepTrip";
import { fmtDayMon, fromYMD } from "./dateUtils";
import {
  IconGrip,
  IconPlane,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "./icons";

// The same Google map the chat page draws the trip on — numbered stop pins and
// a dashed, arrowed curve between them.
//
// Loaded on demand: it reaches straight for `google.maps` (so it can't render
// on the server), and it pulls in the POI drawer and the day-by-day card stack
// behind it. The tailored form is imported statically by the homepage and the
// other marketing pages, so a static import here would land all of that in the
// bundle every one of them ships.
const TripMap = dynamic(() => import("../../bot-components/Map"), {
  ssr: false,
});

// One colour per stop, cycled. These are the map's own accent hexes
// (ACCENT_COLORS in bot-components/Map.tsx), starting on the brand coral the map
// falls back to — the same value passed through `color` on each map location, so
// stop 3 in the list and pin 3 on the map are the same colour.
const PIN_COLORS = [
  "#FD6D6C",
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
  "#eab308",
];
const pinColor = (i) => PIN_COLORS[i % PIN_COLORS.length];

// The map's numbered teardrop, drawn inline in the list.
//
// Same path data as getNumberedPin() so the two read as one set: coloured
// teardrop, white centre, the stop number in the pin's own colour. The number
// stays — it is what ties a row to its pin — it has just moved inside the pin
// and out of the square tile it used to sit in.
const RoutePin = ({ index }) => {
  const color = pinColor(index);
  return (
    <span className="kform-pin" aria-hidden="true">
      <svg viewBox="0 0 48 61" width="28" height="36" fill="none">
        <path
          d="M24 0C10.7314 0 0 10.7155 0 23.9643C0 39.495 17.9202 55.8391 22.7908 59.9944C23.4984 60.5982 24.5016 60.5982 25.2092 59.9944C30.0798 55.8391 48 39.495 48 23.9643C48 10.7155 37.2686 0 24 0ZM24 32.523C19.2686 32.523 15.4286 28.6887 15.4286 23.9643C15.4286 19.2399 19.2686 15.4056 24 15.4056C28.7314 15.4056 32.5714 19.2399 32.5714 23.9643C32.5714 28.6887 28.7314 32.523 24 32.523Z"
          fill={color}
        />
        <circle cx="24" cy="23.9643" r="11.5" fill="#fff" />
        <text
          x="24"
          y="28.5"
          textAnchor="middle"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="15"
          fontWeight="700"
          fill={color}
        >
          {index + 1}
        </text>
      </svg>
    </span>
  );
};

const MAX_NIGHTS = 14;

// See the note in StepTrip: phones get the full-screen search, wider screens
// keep the list under the field. Read in event handlers only.
const isNarrow = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767.98px)").matches;

export const cityName = (c) =>
  c?.name || c?.city_name || c?.city?.name || c?.text || "Stop";
const cityLat = (c) => c?.latitude ?? c?.lat ?? c?.city?.latitude;
const cityLng = (c) => c?.longitude ?? c?.long ?? c?.city?.longitude;
const cityNights = (c) => Number(c?.duration || c?.nights || 1);

const rowKey = (c, i) =>
  String(c?.itinerary_city_id || c?.city_id || c?.id || `${cityName(c)}-${i}`);

// A route can visit the same city twice (out to the coast and back through the
// capital), and both stops carry the same city_id — so the id alone is not a
// unique React key / draggableId. The second and later visits get a suffix.
const rowKeys = (cities) => {
  const seen = {};
  return cities.map((c, i) => {
    const k = rowKey(c, i);
    seen[k] = (seen[k] || 0) + 1;
    return seen[k] > 1 ? `${k}~${seen[k]}` : k;
  });
};

/**
 * Step 2 — "Shape the route": reorder stops, trade nights, add or remove a
 * city. Works directly on `cities` (the /initiate basic_route), which the
 * parent re-submits to /initiate when the user continues with changes.
 */
const StepRoute = ({
  startName,
  cities,
  setCities,
  setIsRouteChanged,
}) => {
  // The map is desktop-only (CSS hides `.kform-map` below 768px). Mount it off
  // the container's measured width rather than a media query, so CSS stays the
  // single authority on the layout — and so a phone never pays for the Google
  // Maps script at all, which a plain `display:none` would still have loaded.
  const mapSlotRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);
  useEffect(() => {
    const el = mapSlotRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => setMapVisible(el.clientWidth > 0));
    ro.observe(el);
    setMapVisible(el.clientWidth > 0);
    return () => ro.disconnect();
  }, []);

  const [addOpen, setAddOpen] = useState(false);
  const [addSheet, setAddSheet] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [addNights, setAddNights] = useState(2);
  const [addResults, setAddResults] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const debouncedAdd = useDebounce(addQuery, 350);
  const addInputRef = useRef(null);

  // Focus the "Where else?" field when the panel opens — on wide screens only.
  //
  // This used to be `autoFocus`, which also fired on phones: tapping "Add a
  // city" focused the field and raised the keyboard without the field ever
  // being tapped, so the pointerdown/click pair below — the only thing that
  // opens the phone search sheet — never ran. The first thing typed went into
  // the inline input and its desktop dropdown; only a second tap on the field
  // opened the sheet. Once the panel had been opened it stayed mounted, so the
  // field never auto-focused again and every later tap looked right, until the
  // panel was closed and reopened.
  useEffect(() => {
    if (addOpen && !isNarrow()) addInputRef.current?.focus();
  }, [addOpen]);

  useEffect(() => {
    let cancelled = false;
    const q = debouncedAdd.trim();
    if (q.length < 2) {
      setAddResults([]);
      return;
    }
    setAddLoading(true);
    axiossearchinstance
      .get(`?type=City&q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!cancelled) setAddResults(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
      })
      .catch(() => {
        if (!cancelled) setAddResults([]);
      })
      .finally(() => {
        if (!cancelled) setAddLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedAdd]);

  const commit = (next) => {
    setCities(next);
    setIsRouteChanged(true);
  };

  const setNights = (i, n) =>
    commit(cities.map((c, j) => (j === i ? { ...c, duration: n, nights: n } : c)));

  const remove = (i) => {
    if (cities.length <= 1) return;
    commit(cities.filter((_, j) => j !== i));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const next = Array.from(cities);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };

  // A city already on the route can be added again, always as a stop of its
  // own — a return visit is a real route shape. This used to bail out silently
  // instead, and because the bail happened before the query was cleared, a
  // phone was left with the search text in the field and the inline dropdown
  // showing, where tapping the city again did nothing either.
  const addCity = (r) => {
    commit([
      ...cities,
      {
        name: r.name,
        city_id: r.resource_id,
        latitude: r.latitude,
        longitude: r.longitude,
        image: r.image,
        country: r.country,
        duration: addNights,
        nights: addNights,
      },
    ]);
    setAddQuery("");
    setAddResults([]);
  };

  // The map matches a stop to its pin number by id, so every stop needs one of
  // its own even when the same city appears twice.
  const keys = useMemo(() => rowKeys(cities), [cities]);

  const mapLocations = useMemo(
    () =>
      cities
        .map((c, i) => ({
          id: `${rowKey(c, i)}#${i}`,
          name: cityName(c),
          description: "",
          lat: Number(cityLat(c)),
          lng: Number(cityLng(c)),
          duration: cityNights(c),
          image: c?.image || c?.city?.image?.[0]?.image,
          // Read by the map's resolvePinColor — this is what keeps pin 3 on the
          // map the same colour as stop 3 in the list.
          color: pinColor(i),
        }))
        .filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng)),
    [cities],
  );
  // Only read while there is no route to fit, i.e. before the first stop has
  // coordinates.
  const mapState = useMemo(
    () => ({
      lat: mapLocations[0]?.lat ?? 20,
      lng: mapLocations[0]?.lng ?? 78,
      zoom: 5,
    }),
    [mapLocations],
  );

  const dateSub = (c) => {
    const s = fromYMD(c?.start_date);
    const e = fromYMD(c?.end_date);
    if (s && e) return `${fmtDayMon(s)} → ${fmtDayMon(e)}`;
    return c?.country || "";
  };

  return (
    <div className="kform-step kform-step--wide">
      <h1 className="kform-h1">
        Shape the <span className="kform-serif">route</span>.
      </h1>
      <p className="kform-lead" style={{ marginBottom: 26 }}>
        Drag to reorder, trade nights between cities.
        {/* There is no map on a phone — see the .kform-map rule. */}
        <span className="kform-wide-only"> The map follows you.</span>
      </p>

      <div className="kform-route">
        <div className="kform-route-list">
          <div className="kform-rule">
            <div className="kform-label">Route</div>
          </div>

          {startName && (
            <div className="kform-depart">
              <div className="kform-depart-dot">
                <IconPlane />
              </div>
              <div className="kform-depart-name">{startName}</div>
              <div className="kform-label">Departure</div>
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="kform-route">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {cities.map((c, i) => (
                    <Draggable key={keys[i]} draggableId={keys[i]} index={i}>
                      {(drag, snapshot) => (
                        <div
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          className={`kform-city${snapshot.isDragging ? " is-dragging" : ""}`}
                        >
                          <span className="kform-grip" {...drag.dragHandleProps} aria-label="drag to reorder">
                            <IconGrip />
                          </span>
                          {/* The pin, not a photo tile: this is the row's
                              handle on the map beside it. */}
                          <RoutePin index={i} />
                          <div className="kform-city-body">
                            <div className="kform-city-name">{cityName(c)}</div>
                            <div className="kform-city-sub">{dateSub(c)}</div>
                          </div>
                          <Stepper
                            size="sm"
                            value={cityNights(c)}
                            min={1}
                            max={MAX_NIGHTS}
                            onChange={(n) => setNights(i, n)}
                            label={
                              <>
                                <span className="kform-wide-only">
                                  {cityNights(c)} night{cityNights(c) === 1 ? "" : "s"}
                                </span>
                                <span className="kform-narrow-only">{cityNights(c)}N</span>
                              </>
                            }
                          />
                          <button
                            type="button"
                            className="kform-trash"
                            onClick={() => remove(i)}
                            disabled={cities.length <= 1}
                            aria-label={`remove ${cityName(c)}`}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {!addOpen ? (
            <button
              type="button"
              className="kform-dashed-btn"
              onClick={() => {
                setAddOpen(true);
                setAddQuery("");
                setAddNights(2);
              }}
            >
              <IconPlus />
              Add a city
            </button>
          ) : (
            <div className="kform-add">
              <div className="kform-add-head">
                <div className="kform-label">Add a stop</div>
                <button
                  type="button"
                  className="kform-iconbtn kform-iconbtn--sm"
                  onClick={() => setAddOpen(false)}
                  aria-label="close"
                >
                  <IconX size={12} />
                </button>
              </div>
              <div className="kform-field" style={{ padding: "12px 14px", gap: 10 }}>
                <span className="kform-field-icon kform-field-icon--muted">
                  <IconSearch size={15} />
                </span>
                <input
                  ref={addInputRef}
                  className="kform-input"
                  style={{ fontSize: 14 }}
                  value={addQuery}
                  placeholder="Where else?"
                  onChange={(e) => setAddQuery(e.target.value)}
                  // Backstop for any focus that doesn't come from a tap (the
                  // keyboard's "next" key, an assistive tech, a webview that
                  // ignores the preventDefault below): on a phone this field
                  // is never typed into — the sheet is.
                  onFocus={(e) => {
                    if (!isNarrow()) return;
                    e.target.blur();
                    setAddSheet(true);
                  }}
                  // On a phone the search takes over the screen instead of
                  // opening a list inside a panel that is already low in a
                  // scrolling step. preventDefault keeps focus (and so the
                  // keyboard) off this input; the sheet's own input takes it.
                  // pointerdown blocks focus (so no keyboard here); the sheet
                  // opens on click, the last event of the tap. Opening it at
                  // pointerdown left a result row under a finger that had not
                  // lifted, and the same tap's click selected it. See StepTrip.
                  onPointerDown={(e) => {
                    if (!isNarrow()) return;
                    e.preventDefault();
                  }}
                  onClick={() => {
                    if (!isNarrow()) return;
                    setAddSheet(true);
                  }}
                />
              </div>
              {addQuery.trim().length >= 2 && (
                <div className="kform-add-list">
                  {addResults.map((r) => (
                    <button
                      key={r.resource_id || r.name}
                      type="button"
                      className="kform-opt"
                      style={{ padding: "10px 14px", gap: 11 }}
                      onClick={() => addCity(r)}
                    >
                      <DestTile dest={r} className="kform-tile--xs" />
                      <div className="kform-opt-body">
                        <div className="kform-opt-name" style={{ fontSize: 13.5 }}>
                          {r.name}
                        </div>
                        <div className="kform-opt-sub">{r.country || ""}</div>
                      </div>
                      <IconPlus size={13} style={{ color: "#b8becc" }} />
                    </button>
                  ))}
                  {!addLoading && addResults.length === 0 && (
                    <div className="kform-pop-empty" style={{ fontSize: 12.5 }}>
                      Nothing matches that. Try another spelling.
                    </div>
                  )}
                  {addLoading && addResults.length === 0 && (
                    <div className="kform-pop-empty" style={{ fontSize: 12.5 }}>
                      searching…
                    </div>
                  )}
                </div>
              )}
              {/* The nights stay here rather than in the sheet: they are set
                  once and apply to whatever is picked, and a picked place is
                  added immediately. */}
              <div className="kform-add-foot">
                <div className="kform-label">How long?</div>
                <Stepper
                  size="sm"
                  value={addNights}
                  min={1}
                  max={MAX_NIGHTS}
                  onChange={setAddNights}
                  label={`${addNights} night${addNights === 1 ? "" : "s"}`}
                />
                <div className="kform-add-foot-hint">Tap a place to add it</div>
              </div>
            </div>
          )}
        </div>

        <SearchSheet
          open={addSheet}
          onClose={() => setAddSheet(false)}
          placeholder="Search a city to add"
          value={addQuery}
          onChange={(e) => setAddQuery(e.target.value)}
          onClear={() => setAddQuery("")}
          label={`Adding ${addNights} night${addNights === 1 ? "" : "s"}`}
          loading={addLoading && addResults.length === 0}
          empty={
            addQuery.trim().length < 2
              ? "Type a city to see matches."
              : !addLoading && addResults.length === 0
                ? "Nothing matches that. Try another spelling."
                : null
          }
        >
          {addQuery.trim().length >= 2 &&
            addResults.map((r) => (
              <button
                key={r.resource_id || r.name}
                type="button"
                className="kform-opt"
                onClick={() => {
                  addCity(r);
                  setAddSheet(false);
                }}
              >
                <DestTile dest={r} className="kform-tile--sm" />
                <div className="kform-opt-body">
                  <div className="kform-opt-name">{r.name}</div>
                  <div className="kform-opt-sub">{r.country || ""}</div>
                </div>
                <IconPlus size={14} style={{ color: "#b8becc" }} />
              </button>
            ))}
        </SearchSheet>

        <div className="kform-map" ref={mapSlotRef}>
          {mapVisible && mapLocations.length > 0 && (
            <TripMap
              state={mapState}
              locations={mapLocations}
              currentRoute={mapLocations}
              userLocation={null}
              showCityDecks={false}
            />
          )}
          <div className="kform-map-caption">
            <IconPlane />
            <span>
              {startName ? `from ${startName} · ` : ""}
              {cities.length} stop{cities.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepRoute;
