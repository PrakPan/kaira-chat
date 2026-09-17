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
 * until it is committed. Closing any other way (Escape, the scrim, the field
 * again) discards the draft.
 *
 * WHAT COMMITS depends on the tab:
 *
 *   I have dates — the second tap does. A start and an end is the whole answer,
 *     and there is nothing else on that tab to set, so asking for Done after it
 *     is a second tap that says what the first already said. A mis-tapped end
 *     is re-picked by opening the field again: pickDay restarts the range on
 *     the tap after a complete one, so a second pass is just a new trip.
 *
 *   Flexible / Not sure — Done does. Those tabs carry a month and/or a nights
 *     stepper, so there is no single gesture that means "that's it": committing
 *     on the month tap would close the panel before the reader had set the
 *     length, and committing on the stepper would fire on every increment.
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
  // Set by Clear, unset by any pick. It is what lets Done stay pressable with
  // nothing selected: see `canDone`, where an empty draft is normally refused.
  const [cleared, setCleared] = useState(false);
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
    // On desktop the panel floats in front of the card instead of sitting
    // inside the step body.
    //
    // The body is the scroll container (`overflow-y: auto`), so an absolutely
    // positioned child of it is CLIPPED by it: the calendar ran to the bottom
    // edge of the body and the rest of it — including Done — was behind the
    // footer's trust row, reachable only by scrolling the step. Nothing about
    // the height fixes that; the panel has to leave the clip.
    //
    // `fixed` is what takes it out, so the coordinates come from the field's
    // own rectangle and have to be refreshed whenever anything moves (see the
    // scroll/resize listeners below). Anchored to the field's right edge, the
    // way the stylesheet anchors it, because it is wider than the field.
    const anchor = el.closest(".kform-when-pop");
    const field = anchor?.parentElement;
    if (!anchor || !field) {
      setMaxHeight(null);
      return;
    }

    // The card, not the body: the panel is allowed to cover the footer now, so
    // the card's bottom edge is the only real floor.
    const card = el.closest(".kform-card") || document.documentElement;
    const cardBox = card.getBoundingClientRect();
    const fieldBox = field.getBoundingClientRect();
    const GAP = 8;
    const EDGE = 12;

    const below = cardBox.bottom - fieldBox.bottom - GAP - EDGE;
    const above = fieldBox.top - cardBox.top - GAP - EDGE;
    // Open downward unless the panel wants more room than is under the field
    // and there is more over it — on a short laptop window that is how the
    // whole calendar stays on screen without the reader scrolling anything.
    const wanted = Math.min(el.scrollHeight, 560);
    const flip = below < wanted && above > below;

    anchor.style.position = "fixed";
    anchor.style.right = `${Math.round(window.innerWidth - fieldBox.right)}px`;
    anchor.style.left = "auto";
    anchor.style.margin = "0";
    if (flip) {
      anchor.style.top = "auto";
      anchor.style.bottom = `${Math.round(window.innerHeight - fieldBox.top + GAP)}px`;
    } else {
      anchor.style.bottom = "auto";
      anchor.style.top = `${Math.round(fieldBox.bottom + GAP)}px`;
    }

    setMaxHeight(Math.max(240, Math.round(flip ? above : below)));
  };
  // Re-measured when the tab changes as well as on open: the three tabs are
  // very different heights (a two-month calendar against a month grid and a
  // stepper), so the side that fits is not the same answer for all of them.
  useLayoutEffect(measure, [mode]);
  useEffect(() => {
    // Capture, so the step body's own scroll is heard as well as the window's:
    // the panel is `fixed` on desktop, so it does not travel with the field and
    // has to be put back under it whenever anything moves.
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, []);

  const switchMode = (next) => setMode(next);

  const pickRange = ({ start, end }) => {
    setDs(start);
    setDe(end);
    setCleared(false);
    // A complete range is the answer — write it and close. `end` is only ever
    // set on the second tap (see RangeCalendar.pickDay, which restarts the
    // range rather than ending it on or before the start), so this cannot fire
    // on a half-picked range or a single day.
    if (start && end) {
      onFixed(toYMD(start), toYMD(end));
      onDone?.();
    }
  };

  const changeNights = (n) => setNights(n);

  const pickFlex = (y, m) => {
    setFlexSel({ y, m });
    setCleared(false);
  };

  const clear = () => {
    setDs(null);
    setDe(null);
    setFlexSel(null);
    setCleared(true);
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

  // From NEXT month on. The current one is not a rough month you can plan
  // around — most of it is already gone by the time anyone reads this, and a
  // "flexible in September" trip picked on 28 September has no window left to
  // be flexible in.
  const flexMonths = [];
  for (let i = 1; i <= 8; i++) {
    const y = now.getFullYear() + Math.floor((now.getMonth() + i) / 12);
    const m = (now.getMonth() + i) % 12;
    flexMonths.push({ y, m, on: flexSel && flexSel.y === y && flexSel.m === m });
  }

  // Flexible writes a month, so Done needs one. Without this the reader could
  // press it on an untouched month grid and land back on a field that still
  // said "Pick your dates" — a button that looked like it had done something.
  // Clear is the exception: there, committing nothing IS the intent.
  const canDone = mode !== "flexible" || !!flexSel || cleared;

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
        <button
          type="button"
          className="kform-btn-ink"
          onClick={commit}
          disabled={!canDone}
        >
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
