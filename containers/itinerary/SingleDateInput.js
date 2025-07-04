import React, { useState, useEffect } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { BiCalendarAlt } from "react-icons/bi";
import moment from "moment";
import styled from "styled-components";
import { SingleDatePicker } from "react-dates";

const Container = styled.div`
  position: relative;

  .SingleDatePickerInput {
    border: none;
    background: initial;
    width: 100%;
  }

  .DateInput {
    width: 100%;
    border: 1px solid #d0d5dd;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 8px;
    overflow: hidden;
    padding: 5px;
  }

  .DateInput > input {
    font-family: poppins;
    font-weight: 400;
    font-size: 1rem;
  }

   .SingleDatePicker_picker,
  .DateRangePicker_picker {
    z-index: 1600;
    max-width: 320px;

    @media screen and (min-width: 768px) {
    }
  }

  

  .CalendarDay {
    border: 0px;
  }

  .CalendarDay__selected,
  .CalendarDay__selected:hover {
    background-color: #f7e700;
    border: 0px;
    color: black;
  }

  .CalendarDay__selected_span,
  .CalendarDay__hovered_span,
  .CalendarDay__hovered_span_3 {
    background-color: #f7e70033;
    color: black;
    &:active {
      background-color: #f7e700;
      opacity: 0.7;
      border: none;
    }
    &:hover {
      color: black;
      background-color: #f7e7004a;
      border: none;
    }
  }

  .DateInput_input__focused {
    border-bottom: 0px solid #f7e700;
  }

  .DayPickerKeyboardShortcuts_show__topRight {
    display: none;
  }
`;

const CalenderIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0.75rem;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;
  color: #aaa;
  z-index: 0;
`;

const SingleDateInput = ({
  value,
  onChange,
  id = "single_date_input",
  placeholder = "Select date",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <Container>
      <SingleDatePicker
        id={id}
        date={value ? moment(value) : null}
        onDateChange={(date) =>
          onChange(date ? date.format("YYYY-MM-DD") : "")
        }
        focused={focused}
        onFocusChange={({ focused }) => setFocused(focused)}
        displayFormat="DD/MM/YYYY"
        placeholder={placeholder}
        numberOfMonths={1}
        isOutsideRange={(day) =>
          day.startOf("day").isBefore(moment().startOf("day"))
        }
        readOnly
        noBorder
        small
      />
      <CalenderIcon>
        <BiCalendarAlt size={20} />
      </CalenderIcon>
    </Container>
  );
};

export default SingleDateInput;
