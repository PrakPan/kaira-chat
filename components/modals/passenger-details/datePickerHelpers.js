import styled from "styled-components";
import moment from "moment";

export const DatePickerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .SingleDatePicker,
  .SingleDatePickerInput,
  .DateInput {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    display: flex;
    align-items: center;
    overflow: visible;
  }

  .DateInput_input {
    font-family: lexend;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #212529;
    background: transparent;
    border: none;
    padding: 0;
    height: auto;
    width: 100%;
  }
  .DateInput_input::placeholder {
    color: #c7c7c7;
    font-weight: 400;
  }
  .DateInput_input__focused {
    border: none;
    outline: none;
  }

  .SingleDatePickerInput_clearDate {
    padding: 4px;
    margin: 0 4px 0 0;
  }
  .SingleDatePickerInput_clearDate svg {
    fill: #6e757a;
    height: 10px;
    width: 10px;
  }

  .SingleDatePicker_picker {
    z-index: 1700;
  }

  .DayPicker__withBorder {
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
    @media screen and (max-width: 768px) {
      border: none;
      box-shadow: none;
      width: 320px;
      margin: auto;
    }
  }

  .CalendarDay {
    border: 0;
  }
  .CalendarDay__selected,
  .CalendarDay__selected:hover {
    background-color: #f7e700;
    color: #07213a;
    border: 0;
  }
  .CalendarDay__selected_span,
  .CalendarDay__hovered_span {
    background-color: #f7e70033;
    color: #07213a;
    border: 0;
    &:hover {
      background-color: #f7e7004a;
      border: 0;
    }
  }

  .DayPickerKeyboardShortcuts_show__topRight,
  .DayPickerKeyboardShortcuts_buttonReset {
    display: none !important;
  }
`;

export const renderMonthYearSelect = (
  { month, onMonthSelect, onYearSelect },
  yearStart,
  yearEnd
) => {
  const years = [];
  for (let y = yearEnd; y >= yearStart; y--) years.push(y);
  return (
    <div className="flex justify-center gap-2 px-2">
      <select
        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none"
        value={month.month()}
        onChange={(e) => onMonthSelect(month, e.target.value)}
      >
        {moment.months().map((label, value) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none"
        value={month.year()}
        onChange={(e) => onYearSelect(month, e.target.value)}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
