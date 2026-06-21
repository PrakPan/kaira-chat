import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { FaRegCalendar, FaChevronDown } from "react-icons/fa";
import AirbnbCalendarSingleMonth from "../../calendar/SingleCalendar";

/**
 * Departure-date field for the transfer search drawer.
 *
 * Matches the website's booking-drawer date design (see flights ComboSectionOne):
 * a clean field trigger that opens the shared `AirbnbCalendarSingleMonth`
 * popover (single-date, black selected day) instead of the legacy react-dates
 * calendar. Emits the same `{ target: { name, value } }` event shape the old
 * DatePicker produced, so the drawer's onDateChange handlers are unchanged.
 */
const TransferDateField = ({ id, date, defaultDate, onDateChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const value = date || defaultDate || null;
  const display = value ? dayjs(value).format("DD MMM, YYYY") : "Select date";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleChangeDate = ({ start }) => {
    if (!start) return;
    onDateChange({ target: { name: id, value: start } });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        id={id}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex h-[46.4px] w-full min-w-0 items-center gap-2 rounded-[10px] border bg-[#f4f3ec] px-3 transition-colors ${
          open ? "border-[#0b1220]" : "border-[#ececec]"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-[#ececec] hover:border-[#ececec]"
        }`}
      >
        <FaRegCalendar className="shrink-0 text-[#0b1220]" size={16} />
        <span
          className={`Body2M_14 flex-1 truncate ${value ? "text-[#0b1220]" : "text-[#8a93a6]"}`}
        >
          {display}
        </span>
        <FaChevronDown
          className={`shrink-0 text-[#0b1220] transition-transform ${open ? "rotate-180" : ""}`}
          size={14}
        />
      </div>

      {open && !disabled && (
        <div className="absolute left-0 z-[100] mt-2 w-[350px] max-w-[calc(100vw-2rem)] bg-[#fafaf5] border border-[#ececec] rounded-lg shadow-lg">
          <AirbnbCalendarSingleMonth
            dateType="fixed"
            valueStart={value}
            valueEnd={null}
            date={{ month: value ? new Date(value) : new Date(), duration: 1 }}
            setDateType={() => {}}
            onChangeDate={handleChangeDate}
            setShowCalendar={setOpen}
            isNotForm={true}
          />
        </div>
      )}
    </div>
  );
};

export default TransferDateField;
