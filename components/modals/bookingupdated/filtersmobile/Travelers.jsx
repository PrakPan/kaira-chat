import React, { useEffect, useRef, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { RiArrowDropDownLine, RiDeleteBin6Line } from "react-icons/ri";

export default function Travelers(props) {
  const containerRef = useRef(null);
  const [travelers, setTravelers] = useState(
    props.filters.occupancies.reduce(
      (sum, room) =>
        sum + room.num_adults + (room.child_ages ? room.child_ages.length : 0),
      0
    )
  );
  const [rooms, setRooms] = useState(props.filters.occupancies || []);
  const [open, setOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  useEffect(() => {
    let total = 0;
    for (let room of rooms) {
      total += room?.num_adults ? room.num_adults : 0;
      total += room?.children ? room.children : 0;
    }

    setTravelers(total);
  }, [rooms]);

  const handleAddRoom = () => {
    if (rooms.length < 8) {
      setRooms((prev) => [
        ...prev,
        {
          num_adults: 1,
          children: 0,
          child_ages: [],
        },
      ]);
    }
  };

  const removeRoom = () => {
    setRooms((prev) => prev.slice(0, -1));
  };

  const checkError = () => {
    for (let room of rooms) {
      if (room.child_ages.includes(null)) {
        return true;
      }
    }

    return false;
  };

  const handleModifySearch = () => {
    if (checkError()) {
      setShowError(true);
      return;
    }

    setShowError(false);
    props.setFilters((prev) => ({
      ...prev,
      occupancies: rooms.map((room) => {
        return {
          num_adults: room.num_adults,
          child_ages: room.child_ages,
        };
      }),
      applyFilter: !props.filters.applyFilter,
    }));

    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-fit md:w-full h-fit border-2 flex flex-row items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:border-black"
    >
      <IoPerson onClick={() => setOpen((prev) => !prev)} className="text-2xl" />

      <div onClick={() => setOpen((prev) => !prev)} className="flex flex-col">
        <div className="text-sm">Room Configuration</div>
        <div>
          {travelers} {travelers > 1 ? "travelers" : "traveler"}, {rooms.length}{" "}
          {rooms.length > 1 ? "rooms" : "room"}
        </div>
      </div>

      {open && (
        <div className="absolute bg-white z-50 left-0 md:left-auto md:right-0 top-[65px] flex flex-col gap-3 drop-shadow-2xl rounded-lg p-4 overflow-auto max-h-[60vh] hide-scrollbar">
          <div className="flex flex-col gap-3">
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
          </div>

          {rooms.length > 1 && (
            <div className="flex justify-end">
              <button
                onClick={removeRoom}
                className="w-fit text-blue rounded-full px-2 py-1 hover:bg-[#ECF4FD] focus:outline-none"
              >
                Remove room
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleAddRoom}
              className="w-fit text-blue rounded-full px-2 py-1 hover:bg-[#ECF4FD] focus:outline-none"
            >
              Add another room
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleModifySearch}
              className="px-3 py-1 bg-[#F7E700] rounded-lg border-2 border-black hover:text-white hover:bg-black transition-all w-full"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Room = ({ index, data, setRooms, showError ,removeRoom}) => {
  const [num_adults, setnum_adults] = useState(data.num_adults);
  const [children, setChildren] = useState(data?.children || 0);
  const [child_ages, setchild_ages] = useState(data.child_ages);

  useEffect(() => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === index
          ? {
              ...room,
              num_adults: num_adults,
              children: children,
              child_ages: child_ages,
            }
          : room
      )
    );
  }, [num_adults, children, child_ages]);

  const handleAdults = (type) => {
    if (type === "plus" && num_adults < 14) {
      setnum_adults((prev) => prev + 1);
    } else if (type === "minus" && num_adults > 1) {
      setnum_adults((prev) => prev - 1);
    }
  };

  const handleChildren = (type) => {
    if (type === "plus" && children < 6) {
      setChildren((prev) => prev + 1);
      setchild_ages((prev) => [...prev, null]);
    } else if (type === "minus" && children >= 1) {
      setChildren((prev) => prev - 1);
      setchild_ages((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="mb-6 last:mb-0">
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
          <div className="text-xs text-gray-500">12+ Years</div>
        </div>
        <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
          <button
            className={`flex items-center justify-center ${
              num_adults > 1 ? "text-blue" : "text-gray-300"
            }`}
            onClick={() => handleAdults("minus")}
            disabled={num_adults <= 1}
          >
            -
          </button>
          <span className="mx-2 w-6 text-center">{num_adults}</span>
          <button
            className="flex items-center justify-center text-blue"
            onClick={() => handleAdults("plus")}
            disabled={num_adults >= 14}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="font-medium">Children</div>
          <div className="text-xs text-gray-500">0-12 Years</div>
        </div>
        <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
          <button
            className={`flex items-center justify-center ${
              children > 0 ? "text-blue" : "text-gray-300"
            }`}
            onClick={() => handleChildren("minus")}
            disabled={children <= 0}
          >
            -
          </button>
          <span className="mx-2 w-6 text-center">{children}</span>
          <button
            className="flex items-center justify-center text-blue"
            onClick={() => handleChildren("plus")}
            disabled={children >= 6}
          >
            +
          </button>
        </div>
      </div>

      {children > 0 && (
        <div className="pl-4 space-y-2 mt-3">
          {child_ages &&
            child_ages.map((age, i) => (
              <ChildAge
                key={i}
                index={i}
                child={i + 1}
                age={age}
                setchild_ages={setchild_ages}
                showError={showError}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const ChildAge = ({ index, child, age, setchild_ages, showError }) => {
  const [openAges, setOpenAges] = useState(false);
  const [selectedAge, setSelectedAge] = useState(age);
const dropdownRef=useRef(null)
  useEffect(() => {
    setchild_ages((prev) =>
      prev.map((age, i) => (i === index ? selectedAge : age))
    );
  }, [selectedAge]);

  const handleChildAge = (value) => {
    setSelectedAge(value);
    setOpenAges(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
    <div
      onClick={() => setOpenAges((prev) => !prev)}
      className={`flex justify-between items-center px-3 py-2 border rounded-3xl cursor-pointer bg-white text-sm ${
        showError && !selectedAge ? "border-red-500" : "border-gray-300"
      }`}
    >
      <span className="text-gray-700">Child {child} age*</span>
      <div className="flex items-center text-gray-600">
        <span className="mr-1 font-medium">
          {selectedAge !== null ? selectedAge : "--"}
        </span>
        <RiArrowDropDownLine className="text-2xl" />
      </div>
    </div>
  
    {showError && !selectedAge && (
      <div className="text-xs text-red-500 mt-1 pl-1">
        Provide the age of the child.
      </div>
    )}
  
    {openAges && (
      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-md max-h-60 overflow-auto text-sm">
        {Array.from({ length: 13 }, (_, i) => (
          <div
            key={i}
            onClick={() => handleChildAge(i)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {i}
          </div>
        ))}
      </div>
    )}
  </div>
  
  );
};
