import React, { useEffect, useState } from "react";
import 'react-dates/initialize'
import "react-dates/lib/css/_datepicker.css";
import {BiCalendarAlt} from 'react-icons/bi'
import moment from "moment";
import media from '../../media'
import {
    DateRangePicker,
    isInclusivelyBeforeDay
  } from "react-dates";
import styled from "styled-components";

const Container = styled.div`
position : relative;

.DateRangePicker{
  width : 100%;
}
.DateRangePickerInput_1{
  border : none;
  display: flex;
  gap: 22px;
  background : initial;
}
.DateInput{
  width : 100%;

  border: 1px solid #D0D5DD;
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
border-radius: 8px;
overflow : hidden;
}
.DateInput>input{
  font-family : poppins;
  font-weight : 400;
  font-size : 1rem;
}

.DateRangePickerInput_arrow , .DayPickerKeyboardShortcuts_buttonReset{
  display : none !important;
}

@media screen and (max-width: 768px){
  .DayPickerNavigation{  
        display: flex;
        height: 20px;
        width: fit-content;
        margin-inline : 37%;
        margin-bottom : 10px;
      }
      .DayPickerNavigation>.DayPickerNavigation_button{
      height: 32px;
      width:32px;
      border-radius: 100%;
      margin-inline : 5px;
      padding : 2px;
      }
      .DayPickerNavigation>.DayPickerNavigation_button > svg{
        height:10px;
        width: 10px;
      }

    
}
.DateRangePicker_picker_1{
  left : 0px;
  @media screen and (min-width: 768px){
    left : -210px !important;;
  }
}
  .CalendarDay{
    border : 0px;
  }
  .CalendarDay__selected , .CalendarDay__selected:hover{
    background-color : #F7E700;
    border:0px;
  }
  .CalendarDay__selected_span , .CalendarDay__hovered_span , .CalendarDay__hovered_span_3 {
    background-color : #F7E700;
    color : white;
    opacity:0.5;
    &:active{
      background-color : #F7E700;
      opacity:0.7;
      border : none;
      }
    &:hover{
    color : white;
    background-color : #F7E700;
    opacity:0.7;
    border : none;
    }
  }

.DateInput_input__focused {
  border-bottom : 2px solid #F7E700
}
.DayPickerKeyboardShortcuts_show__topRight{
  display : none;
}
`

const CalenderIcons = styled.div`
position: absolute;
top: 14%;
right: 8px;
pointer-events: none;
font-size : 20px;
z-index : 0;

`
const TextContainer = styled.div`
display : flex;
justify-content : space-between;
font-weight: 400;
font-size: 14px;
height: 25px;
width: 70%;
`
const DatePicker = (props) => {
const [focusedInput, setFocusedInput] = useState(null);
let isPageWide = media('(min-width: 768px)');

return (
  <>
    <TextContainer>
      <p>Start Date</p>
      <p>End Date</p>
    </TextContainer>
   <Container>
    
    <DateRangePicker
    displayFormat='DD/MM/YYYY'
        startDate={props.valueStart}
        startDateId="startDate"
        startDatePlaceholderText='DD/MM/YYYY'
        endDatePlaceholderText='DD/MM/YYYY'
        endDate={props.valueEnd}
        endDateId="endDate"
        onDatesChange={({ startDate, endDate }) => {
          props.setValueStart(startDate);
          props.setValueEnd(endDate)
        }}
        focusedInput={focusedInput}
        onFocusChange={setFocusedInput}
        isOutsideRange={day => day.isBefore(moment()) }
          initialVisibleMonth={() => moment().subtract(0, "month")}
        numberOfMonths={2}
        orientation={isPageWide?"horizontal":"vertical"}
      />
      <CalenderIcons style={{right : '12.6rem'}}><BiCalendarAlt /></CalenderIcons>
      <CalenderIcons style={{right : '8px'}}><BiCalendarAlt /></CalenderIcons>
   </Container>
  </>

)};

export default DatePicker