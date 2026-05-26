import { FaRegClock, FaChevronDown } from "react-icons/fa";
import TransferDateField from "./TransferDateField";
import TransferPax from "./TransferPax";

/**
 * Shared "Departure Date + Departure Time + Travellers" row for the transfer
 * search drawer. Used by both the single-transfer flow and the combo/multi-city
 * flow so the layout (date/time on the left, travellers on the right) and the
 * field chrome (navy-tinted `bg-[#07213A0D]` box, icon-left + chevron-right)
 * stay in sync. The date field reuses {@link TransferDateField}.
 *
 * Presentational + controlled: the parent owns the time-dropdown open state and
 * all selection handlers. The time-dropdown container forwards either an `id`
 * (legacy `getElementById` outside-click) or a `ref`, so each call site keeps
 * its existing outside-click behaviour.
 */
const TransferDateTimeFields = ({
  // Date
  dateId,
  date,
  defaultDate,
  onDateChange,
  // Time
  departureTime,
  timeOptions = [],
  formatTimeForDisplay,
  onTimeSelect,
  showTimeDropdown,
  setShowTimeDropdown,
  timeDropdownId,
  timeDropdownRef,
  // Travellers
  pax,
  onPaxChange,
  // Shared
  disabled = false,
  labelClassName = "Body2M_14",
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
        {/* Date */}
        <div className="w-full sm:w-auto">
          <label className={`${labelClassName} mb-[4px] block`}>
            Departure Date
          </label>
          <TransferDateField
            id={dateId}
            date={date}
            defaultDate={defaultDate}
            onDateChange={onDateChange}
            disabled={disabled}
          />
        </div>

        {/* Time */}
        <div
          className="time-dropdown-container relative w-full sm:w-auto"
          id={timeDropdownId}
          ref={timeDropdownRef}
        >
          <div className={`${labelClassName} mb-[4px] block`}>
            Departure Time
          </div>
          <div
            className={`flex items-center gap-3 px-4 h-[46.4px] min-w-[160px] rounded-[10px] border bg-[#07213A0D] transition-colors ${
              showTimeDropdown ? "border-[#07213A]" : "border-[#07213A26]"
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-[#07213A14] hover:border-[#07213A40]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) setShowTimeDropdown((prev) => !prev);
            }}
          >
            <FaRegClock className="shrink-0 text-[#07213A]" size={16} />
            <span className="Body2M_14 flex-1 text-[#07213A]">
              {formatTimeForDisplay(departureTime)}
            </span>
            <FaChevronDown
              className={`shrink-0 text-[#07213A] transition-transform ${
                showTimeDropdown ? "rotate-180" : ""
              }`}
              size={14}
            />
          </div>

          {showTimeDropdown && !disabled && (
            <div className="absolute right-0 z-[100] mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {timeOptions.map((time, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                    time.value === departureTime
                      ? "bg-gray-100 font-medium text-[#212529]"
                      : "text-gray-700"
                  }`}
                  onClick={() => onTimeSelect(time)}
                >
                  {time.display}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Travellers */}
      <div className="flex justify-end">
        <TransferPax
          pax={pax}
          setPax={onPaxChange}
          combo={true}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TransferDateTimeFields;
