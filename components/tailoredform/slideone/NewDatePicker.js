import React, { useEffect, useState } from "react";
import 'react-dates/initialize'
import "react-dates/lib/css/_datepicker.css";
import {BiCalendarAlt} from 'react-icons/bi'
import moment from "moment";
import media from '../../media'
import {FaChevronLeft , FaChevronRight} from 'react-icons/fa'
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
 .DayPicker__withBorder{
  @media screen and (max-width: 768px){
border : none;
-webkit-box-shadow : none;
box-shadow :none;
width:320px;
margin : auto;
  }
}
.DateRangePickerInput_arrow , .DayPickerKeyboardShortcuts_buttonReset{
  display : none !important;
}

//  Customized navigation button

// @media screen and (max-width: 768px){
//   .DayPickerNavigation{  
//         display: flex;
//         height: 20px;
//         width: fit-content;
//         margin-inline : 37%;
//         margin-bottom : 10px;
//       }
//       .DayPickerNavigation>.DayPickerNavigation_button{
//       height: 32px;
//       width:32px;
//       border-radius: 100%;
//       margin-inline : 5px;
//       padding : 2px;
//       }
//       .DayPickerNavigation>.DayPickerNavigation_button > svg{
//         height:10px;
//         width: 10px;
//       }
// }

.DateRangePicker_picker_1{
  left : 0px;
  top : 48px !important;
  @media screen and (max-width: 768px){
    right : 0px !important;
  }
  @media screen and (min-width: 768px){
    left : -210px !important;
    top : 55px !important;
  }
}
  .CalendarDay{
    border : 0px;
  }
  .CalendarDay__selected , .CalendarDay__selected:hover{
    background-color : #F7E700;
    border:0px;
    color : black;
  }
  .CalendarDay__selected_span , .CalendarDay__hovered_span , .CalendarDay__hovered_span_3 {
    background-color : #F7E70033;
    color : black;
    &:active{
      background-color : #F7E700;
      opacity:0.7;
      border : none;
      }
    &:hover{
    color : black;
    background-color : #F7E7004A;
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
top: 27%;
right: 2%;
pointer-events: none;
font-size: 20px;
z-index: 0;
display: flex;
justify-content: space-between;
width: 59%;
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
        isOutsideRange={day => day.startOf('day').isBefore(moment().add(2,'day')) }
          initialVisibleMonth={() => moment().subtract(0, "month")}
        numberOfMonths={isPageWide?2:1}
        orientation={"horizontal"}
        noBorder={true}
        // navPrev={<FaChevronLeft />}
        // navNext={<FaChevronRight />}
      />
      <CalenderIcons>
      <BiCalendarAlt />
      <BiCalendarAlt />
      </CalenderIcons>
   </Container>
  </>

)};

export default DatePicker