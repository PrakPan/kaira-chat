import React, { useState, useRef, useEffect } from "react";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import Button from "../../components/ui/button/Index";
import RoomsGuests from "./roomsGuests";
import { FaMinus, FaPlus } from "react-icons/fa";
import styled from "styled-components";
import Layout from "../../components/Layout";
import { useRouter } from "next/navigation";
import PriceRange from "./priceRange";
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
    city: { city: "Mumbai", country: "India" },
    checkIn: moment(today),
    checkOut: moment(today),
    rooms: 1,
    adults: 1,
    children: 0,
    price: "₹0-₹1500",
  });
  const [returnDate, setReturnDate] = useState(moment(today));
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
          className="w-[210px] h-[100px] text-bold border border-gray-300 rounded-md py-2 px-2 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
          onClick={() => setShowPax(true)}
        >
          <label className="block text-gray-600 font-medium mb-1">
            Rooms & Guests
          </label>
          <div name={name} className="text-2xl w-full">
            {input.rooms} Room {input.adults} Adults
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
      <Layout page="Hotels">
        <form className="mt-8 relative bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto z-[1002]">
          <div className="flex gap-3">
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                router.push("/flight");
              }}
            >
              Flights
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                router.push("/hotels");
              }}
            >
              Hotels
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                router.push("/cabs");
              }}
            >
              Cabs
            </div>
          </div>
          <div className="flex gap-1 py-4">
            <div className="h-[150px]">
              <RoomsGuests input={input} setInput={setInput} name="city" />
            </div>

            <div className="w-[160px]">
              <div className=" h-[100px] flex flex-col gap-2 border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none ">
                <label className="block text-gray-600 font-medium mb-1">
                  Check-In
                </label>
                <Container>
                  <SingleDatePicker
                    date={date}
                    onDateChange={(newDate) => {
                      setDate(newDate);
                      setInput((prev) => ({
                        ...prev,
                        checkIn: newDate ? newDate.format("YYYY-MM-DD") : "",
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
                  Check-Out
                </label>
                <Container>
                  <SingleDatePicker
                    date={returnDate}
                    onDateChange={(newDate) => {
                      setReturnDate(newDate);
                      setInput((prev) => ({
                        ...prev,
                        checkOut: newDate ? newDate.format("YYYY-MM-DD") : "",
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
                name="rooms"
                ipt={input}
                handleChange={handleChange}
              />
            </div>

            <div className="h-[150px]">
              <PriceRange input={input} setInput={setInput} name="price" />
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
              onclick={() =>
                router.push({
                  pathname: "/flight/searchflights",
                  query: {
                    tripType: input.tripType,
                    checkIn: input.checkIn,
                    checkOut: input.checkOut,
                    adults: input.adults,
                    children: input.children,
                  },
                })
              }
            >
              Search
            </Button>
          </div>
        </form>
      </Layout>
    </>
  );
};

const Pax = ({ setShowPax, pax, setPax }) => {
  const ref = useRef(null);
  console.log(pax);
  const [adults, setAdults] = useState(pax.adults ? pax.adults : 1);
  const [children, setChildren] = useState(pax.children ? pax.children : 0);
  const [rooms, setRooms] = useState(pax.rooms);

  const handleMinus = (type) => {
    switch (type) {
      case "adult":
        setAdults((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          return prev;
        });
        break;
      case "children":
        setChildren((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
        break;
      case "infants":
        setInfants((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
        break;
      default:
        break;
    }
  };

  const handlePlus = (type) => {
    switch (type) {
      case "adult":
        setAdults((prev) => prev + 1);
        break;
      case "children":
        setChildren((prev) => prev + 1);
        break;
      case "rooms":
        setRooms((prev) => prev + 1);
        break;
      default:
        break;
    }
  };

  const handleClose = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowPax(false);
    }
  };

  const handleDone = () => {
    setPax((prev) => ({
      ...prev,
      adults,
      children,
      rooms,
    }));

    setShowPax(false);
  };

  return (
    <div onClick={handleClose} className="fixed inset-0 z-50">
      <div
        ref={ref}
        className="absolute top-[270px] md:top-[240px] left-2 right-2 md:right-5 md:left-auto bg-neutral-100 shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm"
      >
        <div className="flex flex-col gap-1">
          <div>Rooms</div>
          <div className="flex flex-row items-center gap-2">
            <FaMinus
              onClick={() => handleMinus("rooms")}
              className="cursor-pointer"
            />
            <div className="bg-white px-2 py-1 rounded-md">{rooms}</div>
            <FaPlus
              onClick={() => handlePlus("rooms")}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div>Adults (12y +)</div>
            <div className="flex flex-row items-center gap-2">
              <FaMinus
                onClick={() => handleMinus("adult")}
                className="cursor-pointer"
              />
              <div className="bg-white px-2 py-1 rounded-md">{adults}</div>
              <FaPlus
                onClick={() => handlePlus("adult")}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-1">
              <div>Children (2y - 12y)</div>
              <div className="flex flex-row items-center gap-2">
                <FaMinus
                  onClick={() => handleMinus("children")}
                  className="cursor-pointer"
                />
                <div className="bg-white px-2 py-1 rounded-md">{children}</div>
                <FaPlus
                  onClick={() => handlePlus("children")}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-t-white pt-2">
          <button
            onClick={handleDone}
            className="bg-[#F8E000] py-2 px-4 rounded-lg border-2 transition-all border-black hover:bg-black hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flight;
