import React, { useState } from "react";
import moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import LogInModal from "../../../../components/modals/Login";
import { SingleDatePicker } from "react-dates";
import styled from "styled-components";

const Container = styled.div`
  position: relative;

  .SingleDatePickerInput {
    width: 100%;
    background-color: #fff0;
  }
  .SingleDatePickerInput__withBorder {
    border-radius: 0px;
    border: white;
  }
  .SingleDatePickerInputInput_1 {
    border: none;
    display: flex;
    gap: 22px;
    ${(props) => props.tailoredFormModal && "gap : 10px"};
    background: initial;
  }
  .DateInput {
    width: 100%;
    pointer-events: none;
    visibility: hidden;

    border: 1px solid #d0d5dd;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }
  .DateInput > input {
    font-family: poppins;
    font-weight: 400;
    font-size: 1rem;
  }
  .DayPicker__withBorder {
    ${(props) =>
      props.tailoredFormModal &&
      "border : none;-webkit-box-shadow : none;box-shadow :none;"};

    @media screen and (max-width: 768px) {
      border: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      width: 320px;
      margin: auto;
    }
  }
  .SingleDatePickerInputInput_arrow,
  .DayPickerKeyboardShortcuts_buttonReset {
    display: none !important;
  }

  .SingleDatePickerInput_picker_1 {
    left: 0px;
    top: 48px !important;
    @media screen and (min-width: 768px) {
      left: -210px !important;
      right: 0px !important;
      top: 55px !important;
      ${(props) =>
        props.tailoredFormModal &&
        "position : fixed ; top : 125px !important ; left : 0 !important; right : 0; bottom : 0px !important; display : flex; justify-content: center; z-index : 10 ; border-radius : 1rem"};
    }
    ${(props) =>
      props.tailoredFormModal &&
      "position : fixed ; top : 120px !important; left : 0 !important; right : 0; bottom : 0px !important ; z-index : 10"};
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
    border-bottom: 2px solid #f7e700;
  }
  .DayPickerKeyboardShortcuts_show__topRight {
    display: none;
  }
`;

const SelectDate = (props) => {
  const initialDate = moment(props.date, "YYYY-MM-DD");
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div id="bookingsummary-date-container">
      <Container tailoredFormModal={true}>
        <SingleDatePicker
          onDateChange={(date) => props.setDate(date)} // PropTypes.func.isRequired
          focused={props.focus} // PropTypes.bool
          numberOfMonths={1}
          dateFormat="dd-MM-yyyy"
          onFocusChange={({ focused }) => props.setFocus(focused)} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired,
          initialDate={initialDate}
        />
      </Container>
      <LogInModal
        show={showLoginModal}
        onhide={() => setShowLoginModal(false)}
      ></LogInModal>
    </div>
  );
};

export default SelectDate;
