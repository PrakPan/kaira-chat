import React, { useEffect, useState } from "react";
import 'react-dates/initialize'
import "react-dates/lib/css/_datepicker.css";
import {BiCalendarAlt} from 'react-icons/bi'
import moment from "moment";
import media from '../../media'
import {FaChevronLeft , FaChevronRight} from 'react-icons/fa'
import Button from '../../ui/button/Index'
import {
    DateRangePicker,
    isInclusivelyBeforeDay
  } from "react-dates";
import styled from "styled-components";

const Container = styled.div`
  position: relative;

  .DateRangePicker {
    width: 100%;
  }
  .DateRangePickerInput_1 {
    border: none;
    display: flex;
    gap: 22px;
    ${(props) => props.tailoredFormModal && "gap : 10px"};
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
      "border : none;-webkit-box-shadow : none;box-shadow :none;"};

    @media screen and (max-width: 768px) {
      border: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      width: 320px;
      margin: auto;
    }
  }
  .DateRangePickerInput_arrow,
  .DayPickerKeyboardShortcuts_buttonReset {
    display: none !important;
  }

  .DateRangePicker_picker_1 {
    left: 0px;
    top: 48px !important;
    @media screen and (min-width: 768px) {
      left: -210px !important;
      right: 0px !important;
      top: 55px !important;
      ${(props) =>
        props.tailoredFormModal &&
        "position : fixed ; top : 90px !important ; left : 0 !important; right : 0; bottom : 0px !important; display : flex; justify-content: center; z-index : 10"};
    }
    ${(props) =>
      props.tailoredFormModal &&
      "position : fixed ; top : 90px !important; left : 0 !important; right : 0; bottom : 0px !important ; z-index : 10"};
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

const CalenderIcons = styled.div`
position: absolute;
top: 0;
// right: 2%;
pointer-events: none;
font-size: 20px;
z-index: 0;
display: flex;
justify-content: space-between;
width: 100%;
height : 3rem;
gap : ${props=>props.tailoredFormModal ? '10px' : '22px'};

`
const TextContainer = styled.div`
display : flex;
justify-content : space-between;
font-weight: 400;
font-size: 14px;
height: 25px;
width: 100%;
gap : 22px;
${props=>props.tailoredFormModal && 'gap : 10px'};
`
const Text = styled.p`
width : 100%;
`
const Icon = styled.div`
width : 100%;
text-align : right;
width: 100%;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: end;
    margin-right : 5px;
margin-top : -5px;
    `
const ButtonContainer = styled.div`
z-index : 2 ;
position : fixed ;
bottom : 0 ;
z-index:11;
width : 273px ;
margin : auto ;
left : 0;
right : 0;
@media screen and (min-width: 768px){

  // left : 50%;
}

`
const DatePicker = (props) => {
const [focusedInput, setFocusedInput] = useState(props.focusedDate || null);

useEffect(()=>{
  if(props.setFocusedDate) props.setFocusedDate(focusedInput)
},[focusedInput])

useEffect(()=>{
  if(props.setFocusedDate) setFocusedInput(props.inputDate) 
},[props.inputDate])

let isPageWide = media('(min-width: 768px)');

return (
  <>
    <TextContainer tailoredFormModal={props.tailoredFormModal} className={'TextContainer'}>
      <Text>Start Date</Text>
      <Text>End Date</Text>
    </TextContainer>
   <Container tailoredFormModal={props.tailoredFormModal}>
    
    <DateRangePicker
    displayFormat='DD/MM/YYYY'
    readOnly={true}
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
        isOutsideRange={day => day.startOf('day').isBefore(moment().add(0,'day')) }
          initialVisibleMonth={() => moment().subtract(0, "month")}
        numberOfMonths={isPageWide && !props.tailoredFormModal?2:1}
        orientation={"horizontal"}
        noBorder={true}
        // navPrev={<FaChevronLeft />}
        // navNext={<FaChevronRight />}
      />
      <CalenderIcons tailoredFormModal={props.tailoredFormModal} className='CalentderIcons'>
      <Icon><BiCalendarAlt /></Icon>
      <Icon><BiCalendarAlt /></Icon>
      </CalenderIcons>

      {
        (props.tailoredFormModal && !!focusedInput)? 
        <ButtonContainer>

        <Button 
        
        width="100%"
        padding="0.5rem 2rem"
        fontWeight="500"
        margin="1rem 0"
        borderRadius="5px"
        borderWidth="1px"
        bgColor="#f7e700"
        onclick={()=>setFocusedInput(null)}
        >Back</Button></ButtonContainer> : null
      }
   </Container>
  </>

)};

export default DatePicker