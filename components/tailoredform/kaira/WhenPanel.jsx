import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Stepper from "./Stepper";
import RangeCalendar from "./RangeCalendar";
import { IconTarget } from "./icons";
import {
  MONF,
  addDays,
  diffDays,
  fmtDayMon,
  fromYMD,
  today,
  toYMD,
  fmtMonShort,
} from "./dateUtils";

const MIN_NIGHTS = 1;
const MAX_NIGHTS = 30;

// Redux date.type -> panel tab
const modeOf = (type) =>
  type === "flexible" ? "flexible" : type === "anytime" ? "unsure" : "dates";

/**
 * The inline "When" panel: three tabs (I have dates / Flexible / Not sure).
 *
 * Everything the reader touches here is a DRAFT held in local state. Nothing
 * reaches Redux — and so nothing reaches the field above or the payload —
 * until Done is pressed. Picking the second date used to commit and close the
 * panel on the spot, which meant a mis-tapped end date was already the answer
 * and the panel had shut before the reader saw it. Closing any other way
 * (Escape, the scrim, the field again) discards the draft.
 */
const WhenPanel = ({
  date,
  onFixed, // (startYMD, endYMD)
  onFlexible, // (month 1-12, year, nights)
  onAnytime, // (nights)
  onResetType, // ("fixed" | "flexible" | "anytime") — clears the slice
  onDone,
}) => {
  const [mode, setMode] = useState(modeOf(date?.type));
  const [ds, setDs] = useState(fromYMD(date?.start_date));
  const [de, setDe] = useState(fromYMD(date?.end_date));
  const [flexSel, setFlexSel] = useState(
    date?.type === "flexible" && date?.month && date?.year
      ? { y: Number(date.year), m: Number(date.month) - 1 }
      : null,
  );
  const [nights, setNights] = useState(
    date?.type !== "fixed" && Number(date?.duration) > 0
      ? Number(date.duration)
      : 7,
  );
  const now = today();

  // The panel floats below the When field. Cap it to the space actually left
  // inside the card so Clear / Done never fall past the bottom edge — a
  // viewport fraction isn't enough, because how much room is left depends on
  // where the field sits, not on how tall the window is.
  const panelRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(null);
  const measure = () => {
    const el = panelRef.current;
    if (!el) return;
    // On a phone the card fills the screen and its body scrolls, so the panel
    // is free to run as long as it likes — the user scrolls to the rest of it,
    // which is how the mobile design shows it. Capping it there would leave
    // three rows of calendar visible on a tall screen.
    if (window.innerWidth < 768) {
      setMaxHeight(null);
      el.scrollIntoView({ block: "nearest" });
      return;
    }
    // On desktop the card is a fixed-height dialog: the step body is the
    // scroll container that clips the panel, so it — not the card — is what
    // the panel has to fit inside.
    const clip =
      el.closest(".kform-body") ||
      el.closest(".kform-card") ||
      document.documentElement;
    const bottom = clip.getBoundingClientRect().bottom;
    const top = el.getBoundingClientRect().top;
    setMaxHeight(Math.max(240, Math.round(bottom - top - 12)));
  };
  useLayoutEffect(measure, []);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const switchMode = (next) => setMode(next);

  const pickRange = ({ start, end }) => {
    setDs(start);
    setDe(end);
  };

  const changeNights = (n) => setNights(n);

  const pickFlex = (y, m) => setFlexSel({ y, m });

  const clear = () => {
    setDs(null);
    setDe(null);
    setFlexSel(null);
  };

  // Done is the only thing that writes. It commits whatever the draft says,
  // including an empty one — that is how Clear followed by Done removes a date
  // the reader had already confirmed.
  const commit = () => {
    if (mode === "dates") {
      if (ds && de) onFixed(toYMD(ds), toYMD(de));
      else onResetType("fixed");
    } else if (mode === "flexible") {
      if (flexSel) onFlexible(flexSel.m + 1, flexSel.y, nights);
      else onResetType("flexible");
    } else {
      onAnytime(nights);
    }
    onDone?.();
  };

  const flexMonths = [];
  for (let i = 0; i < 8; i++) {
    const y = now.getFullYear() + Math.floor((now.getMonth() + i) / 12);
    const m = (now.getMonth() + i) % 12;
    flexMonths.push({ y, m, on: flexSel && flexSel.y === y && flexSel.m === m });
  }

  const nightsWin = ds && de ? diffDays(ds, de) : null;
  const footer =
    mode === "dates"
      ? ds && de
        ? `${nightsWin} nights · ${fmtDayMon(ds)} - ${fmtDayMon(de)}`
        : ds
          ? "Now pick an end date"
          : "Pick a start date"
      : mode === "flexible"
        ? flexSel
          ? `${nights} nights · around ${MONF[flexSel.m]} ${flexSel.y}`
          : "Pick a rough month"
        : `${nights} nights · I'll suggest the window`;

  const howLong = (sub) => (
    <div className="kform-soft">
      <div className="kform-soft-body">
        <div className="kform-soft-title">How long, roughly?</div>
        <div className="kform-soft-sub">{sub}</div>
      </div>
      <Stepper
        value={nights}
        label={`${nights} night${nights === 1 ? "" : "s"}`}
        min={MIN_NIGHTS}
        max={MAX_NIGHTS}
        onChange={changeNights}
      />
    </div>
  );

  return (
    <div
      className="kform-panel"
      ref={panelRef}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <div className="kform-tabs" role="tablist">
        <button
          type="button"
          className={`kform-tab${mode === "dates" ? " is-on" : ""}`}
          onClick={() => switchMode("dates")}
        >
          I have dates
        </button>
        <button
          type="button"
          className={`kform-tab${mode === "flexible" ? " is-on" : ""}`}
          onClick={() => switchMode("flexible")}
        >
          Flexible
        </button>
        <button
          type="button"
          className={`kform-tab${mode === "unsure" ? " is-on" : ""}`}
          onClick={() => switchMode("unsure")}
        >
          Not sure
        </button>
      </div>

      <div className="kform-panel-scroll">
        {mode === "dates" && (
          <RangeCalendar start={ds} end={de} onChange={pickRange} />
        )}

        {mode === "flexible" && (
          <>
            <div className="kform-label" style={{ marginBottom: 10 }}>
              Rough month
            </div>
            <div className="kform-chips">
              {flexMonths.map((fm) => (
                <button
                  key={`${fm.y}-${fm.m}`}
                  type="button"
                  className={`kform-chip${fm.on ? " is-on" : ""}`}
                  onClick={() => pickFlex(fm.y, fm.m)}
                >
                  {fmtMonShort(fm.m, fm.y)}
                </button>
              ))}
            </div>
            {!flexSel && (
              <div className="kform-hint">
                Pick a rough month and I'll find the best window inside it.
              </div>
            )}
            {howLong("I'll fine-tune once the route is set")}
          </>
        )}

        {mode === "unsure" && (
          <>
            <div className="kform-soft kform-soft--wash">
              <IconTarget />
              <div>
                Leave the timing to me. I'll suggest the best window from
                weather, crowds and prices, and you decide later.
              </div>
            </div>
            {howLong("so I can size the route")}
          </>
        )}
      </div>

      <div className="kform-panel-foot">
        <div className="kform-panel-foot-text">{footer}</div>
        <button type="button" className="kform-linkbtn" onClick={clear}>
          Clear
        </button>
        <button type="button" className="kform-btn-ink" onClick={commit}>
          Done
        </button>
      </div>
    </div>
  );
};

export default WhenPanel;

// Exported for the field label above the panel.
export const describeDate = (date) => {
  if (!date) return { label: "Pick your dates", ok: false, nights: null };
  if (date.type === "fixed") {
    const s = fromYMD(date.start_date);
    const e = fromYMD(date.end_date);
    if (s && e)
      return {
        label: `${fmtDayMon(s)} - ${fmtDayMon(e)} ${e.getFullYear()}`,
        ok: true,
        nights: diffDays(s, e),
        monthPhrase: MONF[s.getMonth()],
        short: `${fmtDayMon(s).split(" ")[1]} ${s.getFullYear()}`,
        header: `${fmtDayMon(s)} - ${fmtDayMon(e)}`,
        startYMD: toYMD(s),
      };
    return { label: "Pick your dates", ok: false, nights: null, monthPhrase: "season", short: "", header: "Dates to be decided" };
  }
  const n = Number(date.duration) > 0 ? Number(date.duration) : null;
  if (date.type === "flexible") {
    if (date.month && date.year) {
      const m = Number(date.month) - 1;
      return {
        label: `${fmtMonShort(m, date.year)} · flexible`,
        ok: true,
        nights: n,
        monthPhrase: MONF[m],
        short: fmtMonShort(m, date.year),
        header: `${fmtMonShort(m, date.year)}${n ? ` · ${n}N` : ""}`,
        startYMD: toYMD(new Date(Number(date.year), m, 1)),
      };
    }
    return { label: "Flexible · pick a month", ok: false, nights: n, monthPhrase: "season", short: "Flexible", header: "Flexible" };
  }
  return {
    label: "Kaira picks the time",
    ok: !!n,
    nights: n,
    monthPhrase: "its best season",
    short: "Best season",
    header: `Kaira picks${n ? ` · ${n}N` : ""}`,
    startYMD: null,
  };
};

// Handy when the route step wants to know the trip window.
export const windowEnd = (date) => {
  const s = fromYMD(date?.start_date);
  const e = fromYMD(date?.end_date);
  if (s && e) return e;
  if (s && Number(date?.duration) > 0) return addDays(s, Number(date.duration));
  return null;
};
