import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoChevronUp, IoPerson } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "../../../ui/button/Index";

const Pax = (props) => {
  console.log("distribution is 1:",props)
  const containerRef = useRef(null);
  const [isRoomExpanded, setIsRoomExpanded] = useState(false);
  const [travelers, setTravelers] = useState(
    props?.numberOfAdults || 1 + props?.numberOfChildren || 0
  );
  const [rooms, setRooms] = useState(props.roomConfiguration);
  props?.setRoomConfiguration(rooms);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsRoomExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let total = 0;
    for (let room of rooms) {
      total += room.adults;
      total += room.children;
    }
    setTravelers(total);
  }, [rooms]);

  const handleAddRoom = () => {
    if (rooms.length < 8) {
      setRooms((prev) => [
        ...prev,
        {
          adults: 1,
          children: 0,
          childAges: [],
        },
      ]);
    }
  };

  const removeRoom = () => {
    setRooms((prev) => prev.slice(0, -1));
  };

  const handleDone = () => {
    props?.setRoomConfiguration(rooms);

    setShowError(false);
    setIsRoomExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative  md:w-full h-fit border-2 flex flex-row items-center gap-2 bg-gray-50 p-2 rounded-lg cursor-pointer hover:border-black"
    >
      <div
        className="flex flex-col   rounded-lg cursor-pointer w-full"
        onClick={() => setIsRoomExpanded(!isRoomExpanded)}
      >
        <div className="flex justify-between w-full">
          <span className="text-gray-700">Room Configuration</span>
          {isRoomExpanded ? (
            <IoChevronUp size={18} />
          ) : (
            <IoChevronDown size={18} />
          )}
        </div>
        <span className="mr-2 text-gray-700">
          {travelers} Travellers, {rooms.length} Room
          {rooms.length > 1 ? "s" : ""}
        </span>
      </div>

      {isRoomExpanded && (
        <div className="absolute bg-white z-50 left-0 md:left-0 md:right-0 top-[70px] flex flex-col gap-3 drop-shadow-2xl rounded-lg p-3 overflow-auto max-h-[70vh] md:max-h-[60vh] hide-scrollbar shadow-2xl w-full">
          <div className="">
            {rooms.map((room, index) => (
              <Room
                key={index}
                index={index}
                data={room}
                setRooms={setRooms}
                showError={showError}
                removeRoom={removeRoom}
              />
            ))}

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleAddRoom}
                className="text-blue font-medium underline"
                disabled={rooms.length >= 8}
              >
                Add Room
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                fontSize="1rem"
                width={"auto"}
                padding="0.5rem 2rem"
                fontWeight="500"
                margin="0"
                borderRadius="5px"
                borderWidth="1px"
                bgColor="#f7e700"
                onclick={() => handleDone()}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Room = ({ index, data, setRooms, showError, removeRoom }) => {
  const [adults, setAdults] = useState(data.adults);
  const [children, setChildren] = useState(data.children);
  const [childAges, setChildAges] = useState(data?.childAges || []);

  useEffect(() => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === index
          ? {
              ...room,
              adults: adults,
              children: children,
              childAges: childAges,
            }
          : room
      )
    );
  }, [adults, children, childAges, index, setRooms]);

  const handleAdults = (increment) => {
    if (increment && adults < 14) {
      setAdults((prev) => prev + 1);
    } else if (!increment && adults > 1) {
      setAdults((prev) => prev - 1);
    }
  };

  const handleChildren = (type) => {
    if (type === "plus" && children < 13) {
      setChildren((prev) => prev + 1);
      setChildAges((prev) => [...prev, 10]);
    } else if (type === "minus" && children >= 1) {
      setChildren((prev) => prev - 1);
      setChildAges((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="mb-6 last:mb-0 ">
      <div className="flex justify-between">
        <div className="mb-3 px-2 py-1 bg-gray-200 w-fit rounded-md">
          <span className="text-sm font-medium">Room {index + 1}</span>
        </div>
        {index + 1 > 1 && (
          <button onClick={removeRoom} className="text-blue-600 font-medium">
            <RiDeleteBin6Line className="text-red-600" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-medium">Adults</div>
          <div className="text-xs text-gray-500">18+ years</div>
        </div>
        <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
          <button
            className={` flex items-center justify-center  ${
              adults > 1 ? "text-blue " : "text-gray-300"
            }`}
            onClick={() => handleAdults(false)}
            disabled={adults <= 1}
          >
            -
          </button>
          <span className="mx-2 w-6 text-center">{adults}</span>
          <button
            className="flex items-center justify-center text-blue"
            onClick={() => handleAdults(true)}
            disabled={adults >= 14}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="font-medium">Children</div>
          <div className="text-xs text-gray-500">1-18 years</div>
        </div>
        <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
          <button
            className={`flex items-center justify-center ${
              children > 0 ? "text-blue" : "text-gray-300"
            }`}
            onClick={() => handleChildren("minus")}
            disabled={children == 0}
          >
            -
          </button>
          <span className="mx-2 w-6 text-center">{children}</span>
          <button
            className=" flex items-center justify-center text-blue"
            onClick={() => handleChildren("plus")}
            disabled={children > 12}
          >
            +
          </button>
        </div>
      </div>

      {children > 0 && (
        <div className="pl-4 space-y-2 mt-3">
          {childAges.map((age, i) => (
            <ChildAge
              key={i}
              index={i}
              child={i + 1}
              age={age}
              setChildAges={setChildAges}
              showError={showError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ChildAge = ({ index, child, age, setChildAges, showError }) => {
  const [openAges, setOpenAges] = useState(false);
  const [selectedAge, setSelectedAge] = useState(age);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setChildAges((prev) =>
      prev.map((age, i) => (i === index ? selectedAge : age))
    );
  }, [selectedAge, index, setChildAges]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenAges(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChildAge = (value) => {
    setSelectedAge(value);
    setOpenAges(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpenAges((prev) => !prev)}
        className={`flex justify-between items-center p-2 border rounded cursor-pointer bg-white ${
          showError && selectedAge === null
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >
        <span>Child {child} age*</span>
        <div className="flex items-center">
          <span className="mr-1">
            {selectedAge !== null ? selectedAge : "--"}
          </span>
          <RiArrowDropDownLine className="text-xl" />
        </div>
      </div>

      {showError && selectedAge === null && (
        <div className="text-xs text-red-500 mt-1">
          Please provide the age of the child
        </div>
      )}

      {openAges && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {Array.from({ length: 19 }, (_, i) => (
            <>
              {i >= 1 && (
                <div
                  key={i}
                  onClick={() => handleChildAge(i)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {i}
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pax;