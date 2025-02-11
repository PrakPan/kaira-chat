import React, { useState, useRef, useEffect } from "react";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import Button from "../../components/ui/button/Index";
import AirportSearch from "./airportSearch";
import { FaMinus, FaPlus } from "react-icons/fa";
import styled from "styled-components";
import { NumToClass } from "../../public/content/flights";
import Layout from "../../components/Layout";
import { useRouter } from "next/navigation";
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
    border-radius: 8px;
    overflow: hidden;
  }
  .DateInput > input {
    font-family: poppins;
    font-weight: 400;
    font-size: 1rem;
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

const Flight = () => {
  const today = new Date();
  const [date, setDate] = useState(moment(today));
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const [input, setInput] = useState({
    tripType: "oneWay",
    from: { city: "Delhi", country: "India", code: "DEL" },
    to: { city: "Chennai", country: "India", code: "MAA" },
    departure: moment(today),
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    flightCabinClass: 1,
  });
  const [returnDate, setReturnDate] = useState(null);
  const [returnFocused, setReturnFocused] = useState(false);
const [showPax,setShowPax] = useState(false);
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
      <div className="w-[230px] h-[100px] text-bold border border-gray-300 rounded-md py-2 px-2 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 outline-none" onClick={()=>setShowPax(true)}>
        <label className="block text-gray-600 font-medium mb-1">
          Traveller & Class
        </label>
        <div name={name} className="text-2xl w-full">
          {input.adults + input.children + input.infants} Travellers
        </div>
        <div name={name} className="text-xl w-full">
          {NumToClass.filter((item)=>item.label===input.flightCabinClass)[0].value}
        </div>
      </div>
       {showPax&&<Pax  setShowPax={setShowPax} pax={input} setPax={setInput}/>}
       </>
    );
  };
  return (
    <>
    <Layout page="Flight" >
    <form className="mt-8 relative bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto z-[1002]" >
      <div className="flex gap-6 border-b border-gray-200 pb-4">
        <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
          <input
            type="radio"
            name="tripType"
            value="oneWay"
            className="accent-blue-600"
            checked={input.tripType === "oneWay"}
            onChange={handleChange}
            onClick={() => setReturnDate(() => null)}
          />
          One Way
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
          <input
            type="radio"
            name="tripType"
            value="roundTrip"
            className="accent-blue-600"
            checked={input.tripType === "roundTrip"}
            onChange={handleChange}
          />
          Round Trip
        </label>
      </div>

      <div className="flex gap-1 py-4">
        <div className="h-[150px]">
          <AirportSearch input={input} setInput={setInput} name="from" />
        </div>

        <div>
          <AirportSearch input={input} setInput={setInput} name="to" />
        </div>

        <div className="w-[160px]">
          <div className=" h-[100px] flex flex-col gap-2 border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none ">
            <label className="block text-gray-600 font-medium mb-1">
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
        <div className="!w-[160px]">
          <div className="h-[100px] flex flex-col gap-2 border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none">
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
          onclick={() => router.push({
            pathname: "/flight/searchflights",
            query: {
              tripType: input.tripType,
              from: input.from.code,
              to: input.to.code,
              departure: input.departure,
              returnDate: input.returnDate,
              adults: input.adults,
              children: input.children,
              infants: input.infants,
              flightCabinClass: input.flightCabinClass,
            },
          })}
        >
          Search
        </Button>
      </div>
    </form>
    </Layout>
    </>
  );
};


const Pax = ({ setShowPax, pax, setPax}) => {
  const ref = useRef(null);
  console.log(pax)
  const [adults, setAdults] = useState(pax.adults ? pax.adults : 1);
  const [children, setChildren] = useState(pax.children ? pax.children : 0);
  const [infants, setInfants] = useState(pax.infants ? pax.infants : 0);
  const [cabinClass, setCabinClass] = useState(pax.flightCabinClass);

  const handleMinus = (type) => {
    switch (type) {
      case "adult":
        setAdults(prev => {
          if (prev > 1) {
            return prev - 1;
          }
          return prev;
        })
        break;
      case "children":
        setChildren(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        })
        break;
      case "infants":
        setInfants(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        })
        break;
      default:
        break;
    }
  }

  const handlePlus = (type) => {
    switch (type) {
      case 'adult':
        setAdults(prev => prev + 1);
        break;
      case 'children':
        setChildren(prev => prev + 1);
        break;
      case 'infants':
        setInfants(prev => prev + 1);
        break;
      default:
        break;
    }
  }

  const handleClose = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowPax(false);
    }
  }

  const handleDone = () => {
    setPax((prev) => ({
      ...prev,
      adults,
      children,
      infants,
      flightCabinClass: cabinClass
    })
    )
    console.log(cabinClass)

    setShowPax(false);
  }

  return (
    <div onClick={handleClose} className="fixed inset-0 z-50">
      <div ref={ref} className="absolute top-[270px] md:top-[240px] left-2 right-2 md:right-5 md:left-auto bg-neutral-100 shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm">
        <div className="flex flex-col gap-1">
          <div>Adults (12y +)</div>
          <div className="flex flex-row items-center gap-2">
            <FaMinus onClick={() => handleMinus('adult')} className="cursor-pointer" />
            <div className="bg-white px-2 py-1 rounded-md">{adults}</div>
            <FaPlus onClick={() => handlePlus('adult')} className="cursor-pointer" />
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-1">
            <div>Children (2y - 12y)</div>
            <div className="flex flex-row items-center gap-2">
              <FaMinus onClick={() => handleMinus('children')} className="cursor-pointer" />
              <div className="bg-white px-2 py-1 rounded-md">{children}</div>
              <FaPlus onClick={() => handlePlus('children')} className="cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div>Infants (below 2y)</div>
            <div className="flex flex-row items-center gap-2">
              <FaMinus onClick={() => handleMinus('infants')} className="cursor-pointer" />
              <div className="bg-white px-2 py-1 rounded-md">{infants}</div>
              <FaPlus onClick={() => handlePlus('infants')} className="cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div>Chose Travel Class</div>
          <div className="w-fit flex flex-col md:flex-row border-2 border-gray-400 rounded-lg">
            <div
              onClick={() => setCabinClass(1)}
              style={{ backgroundColor: cabinClass === 1 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Economy
            </div>

            <div
              onClick={() => setCabinClass(2)}
              style={{ backgroundColor: cabinClass === 2 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Premium Economy
            </div>

            <div
              onClick={() => setCabinClass(3)}
              style={{ backgroundColor: cabinClass === 3 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Business
            </div>

            <div
              onClick={() => setCabinClass(4)}
              style={{ backgroundColor: cabinClass === 4 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Premium Business
            </div>

            <div
              onClick={() => setCabinClass(5)}
              style={{ backgroundColor: cabinClass === 5 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              First Class
            </div>
          </div>
        </div>

        <div className="border-t-2 border-t-white pt-2">
          <button onClick={handleDone} className="bg-[#F8E000] py-2 px-4 rounded-lg border-2 transition-all border-black hover:bg-black hover:text-white">Done</button>
        </div>
      </div>
    </div>
  )
}

export default Flight;
