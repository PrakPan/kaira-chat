import React from "react";
import useMediaQuery from "../../../../components/media";
import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const RouteEditSection = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [destinations, setDestinations] = useState([]);
  const [editDestination, setEditDestination] = useState(true);

  useEffect(() => {
    const cities = [];
    if (props.routes) {
      for (let i = 0; i < props.routes.length; i += 2) {
        cities.push({
          startingCity: i === 0,
          endingCity: i === props.routes.length - 1,
          cityData: props.routes[i],
        });
      }
      setDestinations(cities);
    }
  }, []);

  const handleAddDestinationButton = () => {
    setDestinations((prev) => [...prev, <NewDestination key={prev.length} />]);
  };

  return (
    <div className="fixed top-24 inset-0 flex flex-col items-center bg-white z-50">
      <EditPanel editDestination={editDestination} />
      <div className="w-full md:w-[85%] lg:w-[85%] flex flex-col md:flex-row lg:flex-row items-start justify-between overflow-y-auto px-2 py-5 gap-5">
        {editDestination ? (
          <>
            <EditDestinations
              destinations={destinations}
              handleAddDestinationButton={handleAddDestinationButton}
              setDestinations={setDestinations}
            />
            {isDesktop && <div className="w-[60%]">{props.children}</div>}
          </>
        ) : (
          <EditDates
            destinations={destinations}
            handleAddDestinationButton={handleAddDestinationButton}
          />
        )}
      </div>
      <ActionPanel
        setEdit={props.setEdit}
        setEditDestination={setEditDestination}
      />
    </div>
  );
};

export const EditDestinations = (props) => {
  return (
    <div className="w-full mg:w-[50%] lg:w-[50%] flex flex-col items-center justify-center pb-5 gap-3">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="text-[24px] font-semibold leading-6">Route</div>
        <div>
          <button
            onClick={props.handleAddDestinationButton}
            className="border-2 border-black rounded-lg px-3 py-1"
          >
            Add Destination
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        {props.destinations.map((dest, ind) => (
          <Destination
            key={ind}
            index={ind}
            startingCity={dest.startingCity}
            endingCity={dest.endingCity}
            cityData={dest.cityData}
            pinColour={dest.cityData.color}
            setDestinations={props.setDestinations}
          />
        ))}
      </div>
    </div>
  );
};

export const EditDates = (props) => {
  return (
    <div className="w-full mg:w-[50%] lg:w-[50%] flex flex-col items-center justify-center pb-5 gap-3">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="text-[24px] font-semibold leading-6">
          Route Date & Time
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">{props.destinations}</div>
    </div>
  );
};

export const EditPanel = (props) => {
  const { editDestination } = props;

  return (
    <div className="w-full flex items-center justify-center border-b-2 px-2 text-sm md:text-lg lg:text-lg">
      <div className="flex flex-row gap-4">
        <div
          className={`${
            editDestination
              ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
              : "text-gray-500 px-3 py-2"
          } `}
        >
          Edit/Remove Destination
        </div>
        <div
          className={`${
            !editDestination
              ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
              : "text-gray-500 px-3 py-2"
          } `}
        >
          Edit Dates
        </div>
      </div>
    </div>
  );
};

export const ActionPanel = (props) => {
  return (
    <div className="w-full fixed bottom-0 bg-white py-2 md:py-3 lg:py-3 flex items-center justify-center border-t-2 shadow-lg px-2">
      <div className="flex flex-row gap-4">
        <button
          onClick={() => props.setEdit(false)}
          className="px-5 py-2 rounded-lg border-2 border-black"
        >
          Cancel
        </button>
        <button
          onClick={() => props.setEditDestination((prev) => !prev)}
          className="bg-[#F7E700] px-5 py-2 rounded-lg border-2 border-black"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Destination = (props) => {
  const { startingCity, endingCity, cityData, pinColour, index } = props;

  const handleRemoveDestination = () => {
    props.setDestinations((prev) => {
      return prev.filter((dest, i) => i !== index);
    });
  };

  return (
    <div className="w-full flex border-1 border-gray-200 shadow-sm rounded-lg px-3 py-2">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <IoMenu className="text-3xl cursor-pointer" />
          {startingCity ? (
            <FaLocationCrosshairs className="text-xl" />
          ) : (
            <IoLocationSharp
              className={`text-xl`}
              style={{ color: pinColour }}
            />
          )}

          <div className="text-lg font-semibold">{cityData.city_name}</div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <BiSolidPencil className="text-xl cursor-pointer" />
          {!startingCity && (
            <FaTrashAlt
              onClick={handleRemoveDestination}
              className="text-xl cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const NewDestination = (props) => {
  const [search, setSearch] = useState("");

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="w-full flex border-1 border-black shadow-sm rounded-lg px-3 py-2">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <IoLocationSharp className={`text-xl`} />

          <div className="text-lg font-semibold">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Destination"
              className="focus:outline-none"
            ></input>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <RxCrossCircled
            onClick={clearSearch}
            className="text-2xl cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default RouteEditSection;
