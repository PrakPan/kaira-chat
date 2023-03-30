import React, { useEffect, useState } from "react";
import 'react-dates/initialize'
import "react-dates/lib/css/_datepicker.css";
import {BiCalendarAlt} from 'react-icons/bi'
import moment from "moment";
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

.DateRangePickerInput_arrow{
  display : none;
}

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
display: flex;
justify-content: space-between;
width: 58.5%;
position: absolute;
top: 30%;
right: 8px;
font-size : 20px;
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
return (
  <>
    <TextContainer>
      <p>Start Date</p>
      <p>End Date</p>
    </TextContainer>
   <Container>
    
    <DateRangePicker
        startDate={props.valueStart}
        startDateId="startDate"
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
        numberOfMonths={3}
        orientation={"vertical"}
      />
      <CalenderIcons><BiCalendarAlt/><BiCalendarAlt/></CalenderIcons>
   </Container>
  </>

)};

export default DatePicker