import { useState } from "react";
import { StyledFigmaBox } from "../tailoredform/utils/ui";
import Image from "next/image";
import DateRangeSheet from "./DateRangeSheet";
import { diffDays, fmtRange, fromYMD } from "../tailoredform/kaira/dateUtils";

const DateComponent = (props) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const start = fromYMD(props.date?.start_date);
  const end = fromYMD(props.date?.end_date);
  const nights = start && end ? diffDays(start, end) : 0;
  const value =
    start && end
      ? `${fmtRange(start, end)} · ${nights} night${nights === 1 ? "" : "s"}`
      : "";

  return (
    <div>
      <div className="Body1M_16  mb-[4px]">
        {props.settings ? "Dates" : "When"}
      </div>
      <div className="relative w-full">
        <StyledFigmaBox
          value={value}
          placeholder="Select dates"
          className={`cursor-pointer w-full pr-10  Body2M_14`}
          onClick={() => setShowCalendar(true)}
          readOnly
        />
        <Image
          src="/calendar.svg"
          width={20}
          height={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          alt="calendar"
        />
      </div>

      {showCalendar && (
        <DateRangeSheet
          start={props.date?.start_date}
          end={props.date?.end_date}
          onApply={({ start: s, end: e }) =>
            props.handleApplyDates({ start: s, end: e, dateType: "fixed" })
          }
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default DateComponent;
