import React, { useState, } from "react";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import Button from "../ui/button/Index";
import { FaMinus, FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { NumToClass } from "../../public/content/flights";
import { useRouter } from "next/navigation";
import AirportSearchSmall from "./AirportSearchSmall";
import { Pax } from "../../pages/flights";
const Container = styled.div`
  position: relative;

  .DateRangePicker {
    width: 100%;
  }
  .DateRangePickerInput_1 {
    border: none;
    display: flex;
    gap: 22px;
    background: initial;
  }
  .DateInput {
    width: 100%;

    border: none;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 2px;
    overflow: hidden;
  }
  .DateInput > input {
    font-family: poppins;
    font-weight: 400;
    background-color: transparent;
    font-size: 0.5rem;
  }
  .DayPicker__withBorder {
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
    border-bottom: 2px solid #f7e700;
  }
  .DayPickerKeyboardShortcuts_show__topRight {
    display: none;
  }
`;

const FlightSearchSmall = ({input,setInput}) => {
  const today = new Date();
  const [date, setDate] = useState(moment(today));
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const [returnDate, setReturnDate] = useState(null);
  const [returnFocused, setReturnFocused] = useState(false);
  const [showPax, setShowPax] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SimpleInputComp = ({ name, ipt, handleChange }) => {
    return (
      <>
        <div
          className="w-[150px] h-[65px] text-bold border border-gray-300 rounded-md py-2 px-2 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
          onClick={() => setShowPax(true)}
        >
          <label className="block text-gray-600 font-medium mb-1">
            Traveller & Class
          </label>
          <div name={name} className=" w-full">
            {input.adults + input.children + input.infants} Travellers
          </div>
          <div name={name} className=" w-full">
            {
              NumToClass.filter(
                (item) => item.label === input.flightCabinClass
              )[0].value
            }
          </div>
        </div>
        {showPax && (
          <Pax setShowPax={setShowPax} pax={input} setPax={setInput} />
        )}
      </>
    );
  };
  return (
    <>
      <form className="mt-8 relative   p-6 max-w-5xl mx-auto z-[1002]">
        <div className="flex gap-1 py-4 items-center">
          <div className="w-[120px]">
            <div className=" h-[65px] text-xs flex flex-col  border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none ">
              <label className="block text-gray-600 text-xs mb-1">
                Trip Type
              </label>
              <select
                name="tripType"
                value={input.tripType}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  handleChange(e);
                  if (selectedValue === "oneWay") {
                    setReturnDate(null);
                    setInput((prev) => ({
                      ...prev,
                      returnDate: "",
                    }));
                  }
                }}
                className="mt-1 block bg-white   rounded-md focus:outline-none "
              >
                <option value="oneWay">One Way</option>
                <option value="roundTrip">Round Trip</option>
              </select>
            </div>
          </div>
          <div className="h-[65px]">
            <AirportSearchSmall input={input} setInput={setInput} name="from" />
          </div>

          <div className="h-[65px]">
            <AirportSearchSmall input={input} setInput={setInput} name="to" />
          </div>

          <div className="w-[120px]">
            <div className=" h-[65px] text-xs flex flex-col  border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none ">
              <label className="block text-gray-600 text-xs mb-1">
                Departure
              </label>
              <Container>
                <SingleDatePicker
                  date={date}
                  onDateChange={(newDate) => {
                    setDate(newDate);
                    setInput((prev) => ({
                      ...prev,
                      departure: newDate ? newDate.format("YYYY-MM-DD") : "",
                    }));
                  }}
                  focused={focused}
                  onFocusChange={({ focused }) => setFocused(focused)}
                  id="single_date_picker"
                  numberOfMonths={1}
                  small
                  displayFormat="DD/MM/YYYY"
                  noBorder={true}
                />
              </Container>
            </div>
          </div>
          <div className="w-[120px] text-xs">
            <div className="h-[65px] flex flex-col border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <label className="block text-gray-600 font-medium mb-1">
                Return
              </label>
              <Container>
                <SingleDatePicker
                  date={returnDate}
                  onDateChange={(newDate) => {
                    setReturnDate(newDate);
                    setInput((prev) => ({
                      ...prev,
                      returnDate: newDate ? newDate.format("YYYY-MM-DD") : "",
                      tripType: "roundTrip",
                    }));
                  }}
                  focused={returnFocused}
                  onFocusChange={({ focused }) => setReturnFocused(focused)}
                  id="return_date_picker"
                  numberOfMonths={1}
                  small
                  displayFormat="DD/MM/YYYY"
                  noBorder={true}
                />
              </Container>
            </div>
          </div>

          <div>
            <SimpleInputComp
              name="traveller"
              ipt={input}
              handleChange={handleChange}
            />
          </div>
          <div className="flex justify-center">
          <Button
            padding="0.75rem 1rem"
            fontSize="18px"
            fontWeight="500"
            bgColor="#f7e700"
            borderRadius="7px"
            color="black"
            borderWidth="1px"
            onclick={() =>
              setInput((prev) => ({
                ...prev,
                applyFilter: !input.applyFilter,
            }))
            }
          >
            Search
          </Button>
        </div>

        
        </div>
      </form>
    </>
  );
};


export default FlightSearchSmall;
