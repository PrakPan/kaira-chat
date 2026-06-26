import React, { useState } from "react";
import { MONTHS } from "../constants";
import { dateToIso, isoToDate, formatShort, nightsBetween } from "../intakePrompt";

interface CalendarProps {
  startDate: string | null; // ISO
  endDate: string | null; // ISO
  onChange: (startIso: string | null, endIso: string | null) => void;
}

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/** Range date-picker that emits ISO date strings. Ports the mockup's range
 *  selection behaviour (tap start, then end; tap start again to clear). */
const Calendar: React.FC<CalendarProps> = ({ startDate, endDate, onChange }) => {
  const today = startOfToday();
  const start = isoToDate(startDate);
  const end = isoToDate(endDate);
  const [view, setView] = useState(() => {
    const base = start ?? today;
    return { y: base.getFullYear(), m: base.getMonth() };
  });

  const prevDisabled =
    view.y === today.getFullYear() && view.m <= today.getMonth();

  const move = (delta: number) => {
    setView((v) => {
      let m = v.m + delta;
      let y = v.y;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
      if (m > 11) {
        m = 0;
        y += 1;
      }
      return { y, m };
    });
  };

  const pickDay = (d: number) => {
    const dt = new Date(view.y, view.m, d);
    dt.setHours(0, 0, 0, 0);
    if (dt < today) return;
    if (!start || (start && end)) {
      onChange(dateToIso(dt), null);
    } else if (dt < start) {
      onChange(dateToIso(dt), dateToIso(start));
    } else if (dt.getTime() === start.getTime()) {
      onChange(null, null);
    } else {
      onChange(dateToIso(start), dateToIso(dt));
    }
  };

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const startWeekday = new Date(view.y, view.m, 1).getDay();

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(<span key={`e${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(view.y, view.m, d);
    dt.setHours(0, 0, 0, 0);
    const disabled = dt < today;
    const isStart = !!start && dt.getTime() === start.getTime();
    const isEnd = !!end && dt.getTime() === end.getTime();
    const inRange = !!start && !!end && dt > start && dt < end;
    const selected = isStart || isEnd;

    cells.push(
      <button
        type="button"
        key={d}
        disabled={disabled}
        onClick={() => pickDay(d)}
        className="aspect-square text-[11.5px] font-semibold tabular-nums transition-colors"
        style={{
          border: 0,
          background: selected ? "#0f1a2e" : inRange ? "#fffde7" : "transparent",
          color: selected ? "#fff" : disabled ? "#b8becc" : "#1a2436",
          textDecoration: disabled ? "line-through" : "none",
          cursor: disabled ? "default" : "pointer",
          borderRadius: selected
            ? isStart && isEnd
              ? "50%"
              : isStart
                ? "50% 0 0 50%"
                : "0 50% 50% 0"
            : inRange
              ? 0
              : "50%",
        }}
      >
        {d}
      </button>,
    );
  }

  const n = nightsBetween(startDate, endDate);

  return (
    <div
      className="rounded-[12px] p-3"
      style={{ background: "#fafaf5", border: "1px solid #ececec" }}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={prevDisabled}
          className="w-[26px] h-[26px] rounded-full grid place-items-center"
          style={{
            background: "#fff",
            border: "1px solid #ececec",
            color: "#445069",
            opacity: prevDisabled ? 0.3 : 1,
            cursor: prevDisabled ? "default" : "pointer",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2 4 6l4 4" />
          </svg>
        </button>
        <div className="text-[13px] font-extrabold">
          {MONTHS[view.m]} {view.y}
        </div>
        <button
          type="button"
          onClick={() => move(1)}
          className="w-[26px] h-[26px] rounded-full grid place-items-center"
          style={{ background: "#fff", border: "1px solid #ececec", color: "#445069" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2l4 4-4 4" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-[3px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((w, i) => (
          <span
            key={i}
            className="text-[9px] font-extrabold text-[#8a93a6] text-center py-1 uppercase"
          >
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">{cells}</div>

      <div
        className="mt-[9px] pt-[9px] flex items-center text-[12px] font-bold text-[#0b1220]"
        style={{ borderTop: "1px dashed #ececec" }}
      >
        {!start && (
          <span className="text-[#8a93a6] font-medium italic">
            Tap start date, then end
          </span>
        )}
        {start && !end && (
          <>
            <span>{formatShort(startDate)}</span>
            <span className="text-[#8a93a6] font-medium ml-[5px]">pick end</span>
          </>
        )}
        {start && end && (
          <>
            <span>
              {formatShort(startDate)} to {formatShort(endDate)}
            </span>
            <span
              className="ml-[7px] px-2 py-[1px] rounded-full text-[10px] font-extrabold text-white"
              style={{ background: "#0f1a2e" }}
            >
              {n}N
            </span>
          </>
        )}
        {(start || end) && (
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="ml-auto text-[10.5px] font-semibold text-[#445069] underline"
          >
            clear
          </button>
        )}
      </div>
    </div>
  );
};

export default Calendar;
