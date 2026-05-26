import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { FaRegCalendar } from "react-icons/fa";
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
        className={`flex h-[46.4px] min-w-[200px] items-center justify-between gap-2 rounded-[6px] border border-[#E5E5E5] bg-white px-4 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
        }`}
      >
        <span className="Body2M_14 text-[#212529]">{display}</span>
        <FaRegCalendar className="text-gray-500 shrink-0" size={16} />
      </div>

      {open && !disabled && (
        <div className="absolute left-0 z-[100] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[350px]">
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
