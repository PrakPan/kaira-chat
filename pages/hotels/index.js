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
import { logEvent } from "../../services/ga/Index";
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

const ContainerSmall = styled.div`
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

const Hotels = () => {
  const today = moment().format("YYYY-MM-DD");
  const router = useRouter();
  const [input, setInput] = useState({
    city: { city: "Mumbai", country: "India" },
    city_id: "e77a08bf-fe41-4f6e-9574-e2866c3747a2",
    checkIn: today,
    checkOut: today,
    occupancies: [{ num_adults: 1, children: 0, child_ages: [] }], // Default: 1 room with 1 adult
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Layout page="Hotels">
        <div className="mt-8 relative bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto z-[1002]">
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
          <SearchComponent
            input={input}
            setInput={setInput}
            handleChange={handleChange}
            small={false}
          />
        </div>
      </Layout>
    </>
  );
};

export const SearchComponent = ({ input, setInput, handleChange, small }) => {
  const router = useRouter();

  const today = new Date();


  const [focused, setFocused] = useState(false);

  const [date, setDate] = useState(
    input?.checkIn ? moment(input?.checkIn, "YYYY-MM-DD") : moment(today)
  );
  
  const [returnDate, setReturnDate] = useState(
    input?.checkOut ? moment(input?.checkOut, "YYYY-MM-DD") : moment(today)
  );
    const [returnFocused, setReturnFocused] = useState(false);

  const [showPax, setShowPax] = useState(false);

  const SelectedContainer = small == true ? ContainerSmall : Container;

  const SimpleInputComp = ({ name, small }) => {
    const [showPax, setShowPax] = useState(false);

    return (
      <div className="relative">
        {" "}
        <div
          className={`${
            small ? "h-[65px] w-[150px]" : "h-[100px] w-[290px]"
          } text-bold border border-gray-300 rounded-md py-2 px-2 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 outline-none`}
          onClick={() => setShowPax(true)}
        >
          <label
            className={`block text-gray-600 font-medium mb-2 ${
              small && "text-xs"
            }`}
          >
            Rooms
          </label>
          <div
            name={name}
            className={`text-2xl w-full ${small ? "text-xs" : "text-2xl"}`}
          >
            {input?.occupancies?.length} Rooms
          </div>
        </div>
        {/* ✅ Pax appears below the input */}
        {showPax && (
          <div className="absolute left-0 top-full mt-2 z-50">
            <Pax setShowPax={setShowPax} pax={input} setPax={setInput} />
          </div>
        )}
      </div>
    );
  };

  return (
    <form
      className={`${
        small == true ? "flex gap-2 items-center justify-center" : ""
      }`}
    >
      <div className="flex gap-1 py-4">
        <div
          className={`${
            small == true ? "h-[65px] w-[250px]" : "h-[100px] w-[290px]"
          } `}
        >
          <RoomsGuests
            input={input}
            setInput={setInput}
            name="city"
            small={small}
          />
        </div>

        <div>
          <div
            className={`flex flex-col ${
              small == true
                ? "h-[65px] w-[120px] gap-0"
                : "h-[100px] w-[290px] gap-2"
            } "} border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none`}
          >
            <label
              className={`block text-gray-600 font-medium mb-1 ${
                small == true && "text-xs"
              }`}
            >
              Check-In
            </label>
            <SelectedContainer>
              <SingleDatePicker
                date={date}
                onDateChange={(newDate) => {
                
                  if (newDate) {
                    setDate(newDate);
                    setInput((prev) => ({
                      ...prev,
                      checkIn: newDate.format("YYYY-MM-DD"), // Ensure it's a string
                    }));
                  }
                }}
                focused={focused}
                onFocusChange={({ focused }) => setFocused(focused)}
                id="single_date_picker"
                numberOfMonths={1}
                small
                displayFormat="DD/MM/YYYY"
                noBorder={true}
              />
            </SelectedContainer>
          </div>
        </div>
        <div>
          <div
            className={`flex flex-col ${
              small == true
                ? "h-[65px] w-[120px] gap-0"
                : "h-[100px] w-[290px] gap-2"
            } "}  border border-gray-300 rounded-md py-2 px-2 focus:ring-2 focus:ring-blue-500 outline-none`}
          >
            <label
              className={`block text-gray-600 font-medium mb-1 ${
                small == true && "text-xs"
              }`}
            >
              Check-Out
            </label>
            <SelectedContainer>
              <SingleDatePicker
                date={returnDate}
                onDateChange={(newDate) => {
                  setReturnDate(newDate);
                  setInput((prev) => ({
                    ...prev,
                    checkOut: newDate ? newDate.format("YYYY-MM-DD") : "",
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
            </SelectedContainer>
          </div>
        </div>
        <div
          className={`${
            small == true ? "h-[65px] w-[150px]" : "h-[100px] w-[290px]"
          } `}
        >
          <SimpleInputComp name={"rooms"} small={small} />
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
          onclick={() => {
            logEvent({
              action: "Search_Hotels",
              params: {
                page: "Hotels Page",
                event_category: "Button Click",
                event_label: "Search",
                event_action: "Hotel Search Form",
                destination: input.destination?.name || "",
                check_in: input.checkIn,
                check_out: input.checkOut,
                rooms: input.occupancies?.length || 1,
              },
            });

            var roomData = "";
            input.occupancies.forEach((room, index) => {
              if (roomData !== "") {
                roomData += "v";
              }

              var eachRoom = room.num_adults + "t" + (room.children||room.child_ages.length);

              room.child_ages.forEach((age) => {
                eachRoom += "t" + age; // Corrected string concatenation
              });

              roomData += eachRoom;
            });
            const queryParams = new URLSearchParams({
              searchText: input.city.city,
              country: input.city.country,
              city: input.city_id,
              checkIn: input.checkIn,
              checkOut: input.checkOut,
              ppl: roomData,
            });

            router.push(`/hotels/searchhotels?${queryParams.toString()}`);
          }}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

const Pax = ({ setShowPax, pax, setPax }) => {
  const ref = useRef(null);
  const [occupancies, setOccupancies] = useState(
    pax.occupancies.length > 0
      ? pax.occupancies
      : [{ num_adults: 1, children: 0, child_ages: [] }]
  );

  const handleMinus = (roomIndex, type) => {
    setOccupancies((prev) =>
      prev.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              [type]: Math.max(room[type] - 1, type === "adults" ? 1 : 0),
              ...(type === "children"
                ? { child_ages: room.child_ages.slice(0, -1) }
                : {}),
            }
          : room
      )
    );
  };

  const handlePlus = (roomIndex, type) => {
    setOccupancies((prev) =>
      prev.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              [type]: room[type] + 1,
              ...(type === "children"
                ? { child_ages: [...room.child_ages, 0] }
                : {}),
            }
          : room
      )
    );
  };

  const handleRoomChange = (e, action) => {
    e.preventDefault();
    if (action === "add") {
      setOccupancies([
        ...occupancies,
        { num_adults: 1, children: 0, child_ages: [] },
      ]);
    } else if (action === "remove" && occupancies.length > 1) {
      setOccupancies(occupancies.slice(0, -1));
    }
  };

  const handleDone = () => {
    setPax((prev) => ({
      ...prev,
      occupancies,
    }));
    setShowPax(false);
  };

  return (
    <div className="relative z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-300 w-[300px]">
      <div
        ref={ref}
        className="absolute w-[300px] bg-white p-4 rounded-lg shadow-xl"
      >
        {occupancies.map((room, roomIndex) => (
          <div key={roomIndex} className="mb-4 border-b pb-2">
            <h3 className="font-bold">Room {roomIndex + 1}</h3>

            <div className="flex items-center justify-between">
              <span>Adults</span>
              <div className="flex items-center gap-2">
                <FaMinus
                  onClick={() => handleMinus(roomIndex, "num_adults")}
                  className="cursor-pointer"
                />
                <span>{room.num_adults}</span>
                <FaPlus
                  onClick={() => handlePlus(roomIndex, "num_adults")}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span>Children</span>
              <div className="flex items-center gap-2">
                <FaMinus
                  onClick={() => handleMinus(roomIndex, "children")}
                  className="cursor-pointer"
                />
                <span>{room.children||room.child_ages.length}</span>
                <FaPlus
                  onClick={() => handlePlus(roomIndex, "children")}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {(room.children ||room.child_ages.length)> 0 &&
              room.child_ages.map((age, ageIndex) => (
                <div key={ageIndex} className="mt-2 flex items-center gap-3">
                  <label className="text-gray-700 font-medium text-sm">
                    Child {ageIndex + 1} Age:
                  </label>
                  <select
                    value={age}
                    onChange={(e) => {
                      const newAges = [...room.child_ages];
                      newAges[ageIndex] = e.target.value;
                      setOccupancies((prev) =>
                        prev.map((r, i) =>
                          i === roomIndex ? { ...r, child_ages: newAges } : r
                        )
                      );
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 bg-white shadow-sm text-gray-700 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    {Array.from({ length: 17 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} years
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}

        <div className="flex justify-between">
          <button
            onClick={(e) => handleRoomChange(e, "remove")}
            disabled={occupancies.length === 1}
            className="text-red-500"
          >
            - Remove Room
          </button>
          <button
            onClick={(e) => handleRoomChange(e, "add")}
            className="text-blue-500"
            type="button"
          >
            + Add Room
          </button>
        </div>

        <button
          onClick={handleDone}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg mt-4 w-full"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Hotels;
