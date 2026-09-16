import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "./icons";
import { DOW, MONF, addDays, today } from "./dateUtils";

// The first date anyone can pick is tomorrow. A trip that departs today
// cannot be planned, sourced and booked in the hours that are left, so today
// is disabled in the calendar rather than offered and then rejected later.
export const earliestDate = () => addDays(today(), 1);

/**
 * The two-month range calendar: month navigation plus two month grids side by
 * side (one on a phone — see `.kform-cal-month:nth-child(2)` in
 * styles/kaira-form.css). Shared by the tailored form's "I have dates" tab
 * (WhenPanel) and the Settings date sheet.
 *
 * Controlled: `start` / `end` are local-midnight Dates (or null), and every
 * tap reports the next range through `onChange({ start, end })`. Which month
 * is on screen is the calendar's own business.
 *
 * Needs a `.kform` ancestor for its tokens.
 */
const RangeCalendar = ({ start, end, onChange }) => {
  const earliest = earliestDate();
  // Open on the selected trip, unless it has already gone — then a month with
  // nothing selectable in it would be the first thing on screen.
  const initial = start && start >= earliest ? start : earliest;
  const [calY, setCalY] = useState(initial.getFullYear());
  const [calM, setCalM] = useState(initial.getMonth());

  const pickDay = (d) => {
    // Restart the range on the first tap, on a tap before the current start,
    // and on the tap after a complete range — so a second pass over the
    // calendar just picks a new trip rather than extending the old one.
    if (!start || (start && end) || d <= start) {
      onChange({ start: d, end: null });
      return;
    }
    onChange({ start, end: d });
  };

  const prevMonth = () => {
    if (calM === 0) {
      setCalM(11);
      setCalY(calY - 1);
    } else setCalM(calM - 1);
  };
  const nextMonth = () => {
    if (calM === 11) {
      setCalM(0);
      setCalY(calY + 1);
    } else setCalM(calM + 1);
  };
  const atCurrentMonth =
    calY < earliest.getFullYear() ||
    (calY === earliest.getFullYear() && calM <= earliest.getMonth());

  const y2 = calM === 11 ? calY + 1 : calY;
  const m2 = (calM + 1) % 12;

  const monthCells = (y, m) => {
    const first = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push({ blank: true, key: `b${i}` });
    for (let day = 1; day <= dim; day++) {
      const d = new Date(y, m, day);
      const t = d.getTime();
      cells.push({
        key: `d${day}`,
        d,
        label: day,
        past: d < earliest,
        sel: (start && t === start.getTime()) || (end && t === end.getTime()),
        range: start && end && t > start.getTime() && t < end.getTime(),
      });
    }
    return cells;
  };

  const renderMonth = (y, m) => (
    <div className="kform-cal-month" key={`${y}-${m}`}>
      <div className="kform-cal-dow">
        {DOW.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="kform-cal-grid">
        {monthCells(y, m).map((c) =>
          c.blank ? (
            <button
              key={c.key}
              type="button"
              className="kform-day is-blank"
              disabled
              tabIndex={-1}
            />
          ) : (
            <button
              key={c.key}
              type="button"
              className={`kform-day${c.sel ? " is-sel" : ""}${c.range ? " is-range" : ""}`}
              disabled={c.past}
              onClick={() => pickDay(c.d)}
            >
              {c.label}
            </button>
          ),
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="kform-cal-nav">
        <button
          type="button"
          className="kform-iconbtn kform-iconbtn--cal"
          onClick={prevMonth}
          disabled={atCurrentMonth}
          aria-label="previous month"
        >
          <IconChevronLeft />
        </button>
        <div className="kform-cal-title">
          {MONF[calM]} {calY}
        </div>
        <div className="kform-cal-title kform-cal-title--second">
          {MONF[m2]} {y2}
        </div>
        <button
          type="button"
          className="kform-iconbtn kform-iconbtn--cal"
          onClick={nextMonth}
          aria-label="next month"
        >
          <IconChevronRight />
        </button>
      </div>
      <div className="kform-cal-months">
        {renderMonth(calY, calM)}
        {renderMonth(y2, m2)}
      </div>
    </>
  );
};

export default RangeCalendar;
