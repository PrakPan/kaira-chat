import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import axiossearchinstance from "../../../services/search/searchsuggest";
import axiossearchstartinginstance from "../../../services/search/startinglocation";
import { getParent } from "../../../utils/tailoredform";
import WhenPanel from "./WhenPanel";
import {
  IconCalendar,
  IconMoon,
  IconPin,
  IconSearch,
  IconTarget,
  IconX,
} from "./icons";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net/";

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

      {anyPop && <div className="kform-scrim" onClick={closeAll} />}

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
              <div className={`kform-field${fromOpen ? " is-open" : ""}`}>
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
    </div>
  );
};

export default StepTrip;
