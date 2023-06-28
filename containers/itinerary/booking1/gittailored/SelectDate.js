import React, { useState } from 'react';
// import ImageLoader from '../../../components/ImageLoader';
import dayjs from 'dayjs';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import LogInModal from '../../../../components/modals/Login';
import { SingleDatePicker } from 'react-dates';
import styled from 'styled-components';
import { BiCalendarAlt } from 'react-icons/bi';

const CalenderIcons = styled.div`
  position: absolute;
  top: 0;
  // right: 2%;
  pointer-events: none;
  font-size: 20px;
  z-index: 0;
  display: flex;
  justify-content: space-between;
  width: 100% !important;
  height: 3rem;
  gap: ${(props) => (props.tailoredFormModal ? '10px' : '22px')};
`;
const Container = styled.div`
  position: relative;

  .SingleDatePickerInput {
    width: 100%;
  }
  .SingleDatePickerInputInput_1 {
    border: none;
    display: flex;
    gap: 22px;
    ${(props) => props.tailoredFormModal && 'gap : 10px'};
    background: initial;
  }
  .DateInput {
    width: 100%;

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
      'border : none;-webkit-box-shadow : none;box-shadow :none;'};

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
        'position : fixed ; top : 125px !important ; left : 0 !important; right : 0; bottom : 0px !important; display : flex; justify-content: center; z-index : 10 ; border-radius : 1rem'};
    }
    ${(props) =>
      props.tailoredFormModal &&
      'position : fixed ; top : 120px !important; left : 0 !important; right : 0; bottom : 0px !important ; z-index : 10'};
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
const Icon = styled.div`
  width: 100%;
  text-align: right;
  width: 100%;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: end;
  margin-right: 14px;
  margin-top: -0px;
`;

const SelectDate = (props) => {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const _handleOpen = () => {
    if (props.token) {
      setOpen(true);
    } else {
      // setOpen(false)
      setShowLoginModal(true);
    }
  };

  const onKeyDown = (e) => {
    e.preventDefault();
  };
  const _handleFocus = () => {};
  return (
    <div id="bookingsummary-date-container">
      <Container tailoredFormModal={true}>
        <SingleDatePicker
          date={props.date} // momentPropTypes.momentObj or null
          onDateChange={(date) => props.setDate(date)} // PropTypes.func.isRequired
          focused={focus} // PropTypes.bool
          numberOfMonths={1}
          dateFormat="MM/dd/yyyy"
          onFocusChange={({ focused }) => setFocus(focused)} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired,
        />
        <CalenderIcons className="CalentderIcons">
          {/* <Icon>
            <BiCalendarAlt />
          </Icon> */}
          <Icon>
            <BiCalendarAlt />
          </Icon>
        </CalenderIcons>
        {/* <DatePicker
          onOpen={_handleOpen}
          label="Start Date"
          value={props.date}
          onClose={() => setOpen(false)}
          open={open}
          onChange={(newValue) => {
            props.setDate(newValue);
          }}
          renderInput={(params) => (
            <TextField
              onKeyDown={onKeyDown}
              id="bookingsummary-pax"
              {...params}
              fullWidth
            />
          )}
        /> */}
      </Container>
      <LogInModal
        show={showLoginModal}
        onhide={() => setShowLoginModal(false)}
      ></LogInModal>
    </div>
  );
};

export default SelectDate;
