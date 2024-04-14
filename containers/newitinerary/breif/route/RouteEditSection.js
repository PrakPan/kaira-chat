import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { openNotification } from "../../../../store/actions/notification";
import useMediaQuery from "../../../../components/media";
import { IoMenu, IoLocationSharp } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdDone, MdModeEdit } from "react-icons/md";
import { getDate, getDateString } from "../../../../helper/DateUtils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  addMonths,
  isSameDay,
  addDays,
  differenceInDays,
} from "date-fns";
import axiossearchstartinginstance from "../../../../services/search/startinglocation";
import axiossearchinstance from "../../../../services/search/searchsuggest";
import axiosItineraryUpdateInstance from "../../../../services/itinerary/update";
import { dateFormat } from "../../../../helper/DateUtils";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { BiCalendarAlt } from "react-icons/bi";
import moment from "moment";
import media from "../../../../components/media";
import { SingleDatePicker } from "react-dates";
import styled from "styled-components";

const Container = styled.div`
  position: relative;

  .DateRangePickerInput {
  display: flex;
  flex-direction: column;
}
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
      left: 0px !important;
      right: 0px !important;
      top: 55px !important;
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
  top: 0%;
  right: 0%;
  pointer-events: none;
  font-size: 20px;
  z-index: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100% !important;
  height: 7.5rem;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 400;
  font-size: 14px;
  height: 25px;
  width: 100%;
`;

const Text = styled.p`
  width: 100%;
`;

const Icon = styled.div`
  width: 100%;
  text-align: right;
  width: 100%;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: end;
  margin-right: 5px;
  margin-top: -5px;
`;

const RouteEditSection = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [startDate, setStartDate] = useState(
    getDate(props?.plan ? props?.plan.start_date : null)
  );
  const [endDate, setEndDate] = useState(
    getDate(props?.plan ? props?.plan.end_date : null)
  );
  const [destinations, setDestinations] = useState([]);
  const [editDestination, setEditDestination] = useState(
    props.editRoute === "editDates" ? false : true
  );
  const [isValidDates, setIsValidDates] = useState(true);
  const [loading, setLoading] = useState(false);
  const destinationRef = useRef(null);

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
  }, [props.routes]);

  useEffect(() => {
    if (validateDates()) {
      setIsValidDates(true);
    } else {
      setIsValidDates(false);
    }
  }, [destinations, startDate, endDate]);

  const handleAddDestinationButton = () => {
    setDestinations((prev) => {
      let flag = true;
      let curDestinations = [...prev];
      curDestinations = curDestinations.map((dest) => {
        if (dest.isNewDestination) {
          flag = false;
          return dest;
        }
        dest.isEditDestination = false;
        return dest;
      });
      if (flag) {
        curDestinations.splice(curDestinations.length - 1, 0, {
          startingCity: false,
          endingCity: false,
          isNewDestination: true,
          cityData: {},
        });
      }
      return curDestinations;
    });
  };

  const validateDates = () => {
    const today = new Date();

    if (
      !new Date(startDate) ||
      isNaN(Date.parse(startDate)) ||
      (!isSameDay(new Date(startDate), today) && new Date(startDate) < today)
    ) {
      return false;
    }

    let prevDate = new Date(startDate);
    for (let i = 1; i < destinations.length - 1; i++) {
      const checkin_date = getDate(destinations[i].cityData.checkin_date);
      const checkout_date = getDate(destinations[i].cityData.checkout_date);
      if (
        !new Date(checkin_date) ||
        isNaN(Date.parse(checkin_date)) ||
        (!isSameDay(new Date(checkin_date), prevDate) &&
          new Date(checkin_date) < prevDate)
      ) {
        return false;
      }

      if (
        !new Date(checkout_date) ||
        isNaN(Date.parse(checkout_date)) ||
        (!isSameDay(new Date(checkout_date), new Date(checkin_date)) &&
          new Date(checkout_date) < new Date(checkin_date))
      ) {
        return false;
      }
      prevDate = new Date(checkout_date);
    }

    if (
      !new Date(endDate) ||
      isNaN(Date.parse(endDate)) ||
      (!isSameDay(new Date(endDate), prevDate) && new Date(endDate) < prevDate)
    ) {
      return false;
    }

    return true;
  };

  const submitData = () => {
    const data = {
      itinerary_id: props.plan.id || props.itinerary.tailor_made_id,
      start_date: startDate,
      basic_route: destinations
        .map((dest) => {
          return {
            name:
              dest.cityData.city_name ||
              dest.cityData.name ||
              dest.cityData.text,
            city_id: dest.cityData.city_id || dest.cityData.resource_id,
            check_in: dest.cityData.checkin_date,
            check_out: dest.cityData.checkout_date,
          };
        })
        .filter(
          (dest, index) => index !== 0 && index !== destinations.length - 1
        ),
      user_location: {
        place_id: destinations[0].cityData.place_id,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.token}`,
    };
    axiosItineraryUpdateInstance
      .post("", data, { headers })
      .then((response) => {
        props.fetchData();
        setLoading(false);
        props.openNotification({
          text: "Your Itinerary is updated successfully!",
          heading: "Success!",
          type: "success",
        });
        props.setEdit(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status === 403) {
          props.openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else if (err?.response?.status === 400) {
          props.openNotification({
            text: err?.response?.data?.messages[0],
            heading: "Error!",
            type: "error",
          });
        } else {
          props.openNotification({
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
        console.log("[ERROR][Route Edit]: ", err.message);
      });
  };

  const handleSaveButton = () => {
    if (!props.token) {
      props.setShowLoginModal(true);
      return;
    }

    if (validateDates()) {
      setLoading(true);
      submitData();
    } else {
      setIsValidDates(false);
    }
  };

  const handleOutsideClick = (event) => {
    if (
      destinationRef.current &&
      !destinationRef.current.contains(event.target)
    ) {
      setDestinations((prev) => {
        let destinations = [...prev];
        destinations = destinations.filter((dest) => !dest.isNewDestination);
        destinations = destinations.map((dest) => {
          dest.isEditDestination = false;
          return dest;
        });

        return destinations;
      });
    }
  };

  return (
    <div
      onClick={(e) => handleOutsideClick(e)}
      className="fixed inset-0 flex flex-col items-center bg-white z-40"
    >
      {loading && <Loader />}
      <Header
        setEdit={props.setEdit}
        title={props?.itinerary.name}
        group_type={props?.group_type}
        duration_time={props?.duration_time}
        travellerType={props?.travellerType}
        start_date={props?.plan ? props?.plan.start_date : null}
        end_date={props?.plan ? props?.plan.end_date : null}
        duration={
          props?.plan
            ? props?.plan.duration_number + " " + props?.plan.duration_unit
            : null
        }
        budget={props?.plan ? props?.plan?.budget : null}
        number_of_adults={props?.plan ? props?.plan?.number_of_adults : null}
        number_of_children={
          props?.plan ? props?.plan?.number_of_children : null
        }
        number_of_infants={props?.plan ? props?.plan?.number_of_infants : null}
        setEditDestination={setEditDestination}
      />

      <EditPanel
        editDestination={editDestination}
        setEditDestination={setEditDestination}
      />
      <div className="w-full h-fit md:w-[85%] lg:w-[85%] flex flex-col md:flex-row lg:flex-row items-start justify-between hide-scrollbar overflow-y-auto px-2 py-5 gap-5">
        {editDestination ? (
          <>
            <EditDestinations
              destinations={destinations}
              handleAddDestinationButton={handleAddDestinationButton}
              setDestinations={setDestinations}
              destinationRef={destinationRef}
            />
            {isDesktop && <div className="w-[50%]">{props.children}</div>}
          </>
        ) : (
          <EditDates
            destinations={destinations}
            setDestinations={setDestinations}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            isValidDates={isValidDates}
          />
        )}
      </div>
      <ActionPanel
        setEdit={props.setEdit}
        editDestination={editDestination}
        setEditDestination={setEditDestination}
        handleSaveButton={handleSaveButton}
      />
    </div>
  );
};

const Header = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");

  const convertDFormat = (dt) => {
    try {
      const date = parseISO(dt);
      const formattedDate = format(date, "MMMM do");
      return formattedDate;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="w-full p-3 border-b-2 border-b-gray-200 space-y-5">
      <h1 className="text-2xl md:text-3xl lg:text-3xl font-semibold">
        {props?.title}
      </h1>
      <div className="flex flex-row pb-3 gap-5 text-sm items-center justify-start overflow-x-auto text-nowrap">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Group Type</div>
          <div className="flex flex-row gap-2">
            {props?.group_type}
            <span>
              (
              {props.number_of_adults
                ? props.number_of_adults > 1
                  ? props.number_of_adults + " Adults"
                  : props.number_of_adults + " Adult"
                : null}
              {props.number_of_children
                ? `, ${props.number_of_children} Children`
                : null}
              {props.number_of_infants
                ? props.number_of_infants > 1
                  ? `, ${props.number_of_infants} Infants`
                  : `, ${props.number_of_infants} Infant`
                : null}
              )
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Budget</div>
          <div>{props?.budget}</div>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-center">
              <div className="text-sm text-gray-500">
                Dates ({props?.duration})
              </div>
            </div>
            <div>
              {convertDFormat(props.start_date)}
              {" - "}
              {convertDFormat(props.end_date)}
            </div>
          </div>
          {isDesktop ? (
            <button
              onClick={() => props.setEditDestination(false)}
              className="text-sm border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition ease-in-out duration-500"
            >
              Edit Dates
            </button>
          ) : (
            <MdModeEdit
              onClick={() => props.setEditDestination(false)}
              className="text-lg cursor-pointer hover:text-yellow-400"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const EditPanel = ({ editDestination, setEditDestination }) => {
  return (
    <div className="w-full pt-3 flex items-center justify-center border-b-2 px-2 text-sm md:text-lg lg:text-lg">
      <div className="flex flex-row gap-4">
        <div
          onClick={() => setEditDestination(true)}
          className={`cursor-pointer ${
            editDestination
              ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
              : "text-gray-500 px-3 py-2"
          } `}
        >
          Edit/Remove Destination
        </div>
        <div
          onClick={() => setEditDestination(false)}
          className={`cursor-pointer ${
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

export const EditDestinations = (props) => {
  return (
    <div
      ref={props.destinationRef}
      className="w-full mg:w-[50%] lg:w-[50%] flex flex-col items-center justify-center pb-5 gap-3"
    >
      <div className="w-full flex flex-row items-center justify-between">
        <div className="text-[24px] font-semibold leading-6">Route</div>
        <div>
          <button
            onClick={props.handleAddDestinationButton}
            className="border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition ease-in-out duration-500"
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
            cityData={dest?.cityData}
            pinColour={dest?.cityData?.color}
            setDestinations={props.setDestinations}
            destinations={props.destinations}
            isNewDestination={dest.isNewDestination}
            isEditDestination={dest.isEditDestination}
            destinationRef={props.destinationRef}
          />
        ))}
      </div>
    </div>
  );
};

export const Destination = (props) => {
  const {
    startingCity,
    endingCity,
    isNewDestination,
    isEditDestination,
    cityData,
    pinColour,
    index,
    setDestinations,
    destinations,
  } = props;

  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("destId", index);
    // setDraggedItem({ index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("destId");

    if (targetIndex > 0 && targetIndex < destinations.length - 1) {
      const items = [...destinations];
      // const temp = items[targetIndex];
      // items[targetIndex] = items[draggedIndex];
      // items[draggedIndex] = temp;

      const [reorderedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, reorderedItem);

      setDestinations(items);
      setDraggedItem(null);
    }
  };

  const handleRemoveDestination = () => {
    setDestinations((prev) => {
      return prev.filter((dest, i) => i !== index);
    });
  };

  const handleEditDestination = () => {
    setDestinations((prev) => {
      let destinations = [...prev];
      destinations = destinations.filter((dest) => !dest.isNewDestination);
      destinations = destinations.map((dest) => {
        dest.isEditDestination = false;
        return dest;
      });
      const curDestination = destinations[index];
      destinations[index] = {
        startingCity: curDestination.startingCity,
        endingCity: curDestination.endingCity,
        isEditDestination: true,
        cityData: { ...curDestination.cityData },
      };
      return destinations;
    });
  };

  if (isNewDestination || isEditDestination) {
    return (
      <NewDestination
        index={index}
        cityData={cityData}
        handleRemoveDestination={handleRemoveDestination}
        startingCity={startingCity}
        endingCity={endingCity}
        setDestinations={setDestinations}
      />
    );
  }

  return (
    <div
      draggable={!(startingCity || endingCity)}
      onDragStart={(e) => handleDragStart(e, { index })}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e, index)}
      className={`w-full flex border-1 border-gray-200 shadow-sm rounded-lg px-3 py-2 ${
        draggedItem && draggedItem.index === index ? "opacity-50" : ""
      }`}
    >
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <IoMenu
            className={`text-3xl ${
              !(startingCity || endingCity)
                ? "cursor-grab active:cursor-grabbing"
                : "text-gray-300"
            } `}
          />
          {startingCity ? (
            <FaLocationCrosshairs className="text-xl" />
          ) : (
            <IoLocationSharp
              className={`text-xl`}
              style={{ color: pinColour }}
            />
          )}

          <div
            onClick={handleEditDestination}
            className="text-lg font-semibold cursor-pointer"
          >
            {cityData.city_name || cityData.name || cityData.text}
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <BiSolidPencil
            onClick={handleEditDestination}
            className="text-xl cursor-pointer"
          />
          {!startingCity && !endingCity && (
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
  const {
    index,
    handleRemoveDestination,
    cityData,
    startingCity,
    endingCity,
    setDestinations,
  } = props;
  const [search, setSearch] = useState(
    cityData.city_name || cityData.name || cityData.text
  );
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    handleDestinationSeach();

    return () => {
      setSearchResults(null);
    };
  }, [search]);

  const clearSearch = () => {
    setSearch("");
  };

  const handleCloseEdit = () => {
    setDestinations((prev) => {
      let destinations = [...prev];
      destinations = destinations.map((dest) => {
        if (dest.isNewDestination || dest.isEditDestination) {
          dest.isNewDestination = false;
          dest.isEditDestination = false;
        }
        return dest;
      });

      return destinations;
    });
  };

  const handleDestinationSeach = () => {
    if (startingCity || endingCity) {
      axiossearchstartinginstance
        .get(`?q=${search}`)
        .then((results) => {
          setSearchResults(results.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiossearchinstance
        .get(`?type=Location&q=${search}`)
        .then((results) => {
          setSearchResults(results.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSetDestination = (i) => {
    setDestinations((prev) => {
      let destinations = [...prev];

      const curDestination = destinations[index];
      destinations[index] = {
        startingCity: curDestination.startingCity,
        endingCity: curDestination.endingCity,
        isNewDestination: false,
        isEditDestination: false,
        cityData: { ...searchResults[i] },
      };
      return destinations;
    });
  };

  return (
    <div
      // onBlur={handleCloseEdit}
      className="relative w-full flex border-1 border-black shadow-sm rounded-lg px-3 py-2"
    >
      <div className="w-full flex flex-row gap-2 items-center justify-between">
        <div className="w-full flex flex-row items-center gap-3">
          <IoLocationSharp
            className={`text-xl`}
            style={{ color: cityData.color }}
          />

          <div className="w-full text-lg font-semibold">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Destination"
              className="focus:outline-none w-full"
            ></input>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          {
            <RxCrossCircled
              onClick={() => clearSearch()}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
      </div>

      {searchResults && searchResults.length ? (
        <div className="absolute fixed top-10 left-[0%] w-[100%] max-h-64 overflow-y-auto border-2 rounded-lg bg-white p-2 flex flex-col gap-3">
          {searchResults.map((res, ind) => (
            <div
              key={ind}
              onClick={() => handleSetDestination(ind)}
              className="cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-100 rounded-full"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full p-2 flex items-center justify-center">
                <IoLocationSharp />
              </div>
              <div className="text-sm font-bold">
                {startingCity || endingCity ? res.text : res.name}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const EditDates = ({
  destinations,
  setDestinations,
  startDate,
  setStartDate,
  setEndDate,
  endDate,
  isValidDates,
}) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [calendarMonths, setCalenderMonths] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);

  useEffect(() => {
    const startMonth = new Date(startDate).getMonth();
    const endMonth = new Date(endDate).getMonth();
    setCalenderMonths(endMonth - startMonth + 1);

    const ranges = [];
    for (let i = 0; i < destinations.length; i++) {
      if (destinations[i].startingCity) {
        ranges.push({
          startDate: new Date(startDate),
          endDate: new Date(startDate),
          key: "selection",
          color: "#01202B",
        });
      } else if (destinations[i].endingCity) {
        ranges.push({
          startDate: new Date(endDate),
          endDate: new Date(endDate),
          key: "selection",
          color: "#01202B",
        });
      } else {
        ranges.push({
          startDate: new Date(getDate(destinations[i].cityData.checkin_date)),
          endDate: new Date(getDate(destinations[i].cityData.checkout_date)),
          key: "selection",
          color: destinations[i].cityData.color,
        });
      }
    }

    setDateRanges(ranges);
  }, [destinations, startDate, endDate]);

  const handleDates = (
    offSet,
    index,
    checkinDate,
    checkoutDate,
    isArrival = false
  ) => {
    setDestinations((prev) => {
      return prev.map((dest, ind) => {
        if (ind === index && !(dest.startingCity || dest.endingCity)) {
          if (isArrival) {
            return {
              ...dest,
              cityData: {
                ...dest.cityData,
                checkin_date: checkinDate,
                checkout_date: getDateString(
                  addDays(new Date(getDate(checkoutDate)), offSet)
                ),
              },
            };
          }
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkin_date: checkinDate,
              checkout_date: checkoutDate,
            },
          };
        } else if (ind > index && ind < destinations.length - 1) {
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkin_date: getDateString(
                addDays(new Date(getDate(dest.cityData.checkin_date)), offSet)
              ),
              checkout_date: getDateString(
                addDays(new Date(getDate(dest.cityData.checkout_date)), offSet)
              ),
            },
          };
        } else {
          return dest;
        }
      });
    });

    setEndDate((prev) => getDateString(addDays(new Date(prev), offSet)));
  };

  return (
    <div className="w-full flex flex-row relative">
      <div className="w-full mg:w-[50%] lg:w-[50%] flex flex-col items-center pb-5 gap-3">
        <div className="w-full flex flex-col items-end">
          <div className="w-full md:w-[50%] ld:w-[50%] flex flex-row justify-start mb-5">
            <div className="text-[24px] font-semibold leading-6">
              City Departures
            </div>
          </div>
          {destinations.map((dest, index) => (
            <DestinationDates
              key={index}
              index={index}
              destinations={destinations}
              setDestinations={setDestinations}
              startingCity={dest.startingCity}
              endingCity={dest.endingCity}
              cityData={dest.cityData}
              pinColour={dest.cityData.color}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              previousDate={
                index === 1
                  ? startDate
                  : index > 1 &&
                    getDate(destinations[index - 1].cityData.checkout_date)
              }
              isValidDates={isValidDates}
              handleDates={handleDates}
            />
          ))}
        </div>
      </div>
      {isDesktop && (
        <div className="fixed w-[40%] flex flex-col gap-5 right-[5%] pb-5">
          <div className="text-[24px] font-semibold">Trip Dates</div>

          <CustomCalendar
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            dateRanges={dateRanges}
            calendarMonths={calendarMonths}
          />
          <div className="flex flex-row gap-1 items-center">
            {!isValidDates ? (
              <>
                <>
                  <RxCrossCircled className="text-sm text-white bg-red-500 rounded-full" />
                  <span className="text-sm">
                    Invalid dates selected on the left!
                  </span>
                </>
              </>
            ) : (
              <>
                <MdDone className="text-sm text-white bg-[#0F9E03] rounded-full" />
                <span className="text-sm">
                  Dates in individual cities match with itinerary dates
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const DestinationDates = (props) => {
  const {
    index,
    destinations,
    setDestinations,
    startingCity,
    endingCity,
    cityData,
    pinColour,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    previousDate,
    isValidDates,
    handleDates,
  } = props;

  const cityRef = useRef(null);
  const [divCount, setDivCount] = useState(0);
  const [checkinDate, setCheckinDate] = useState(
    getDate(cityData.checkin_date)
  );
  const [checkoutDate, setCheckoutDate] = useState(
    getDate(cityData.checkout_date)
  );

  useEffect(() => {
    const handleResize = () => {
      if (cityRef.current) {
        const containerHeight = cityRef.current.clientHeight;
        const divHeight = 14;
        const newDivCount = Math.floor(containerHeight / divHeight);
        setDivCount(newDivCount);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [cityRef]);

  useEffect(() => {
    setCheckinDate(getDate(cityData.checkin_date));
    setCheckoutDate(getDate(cityData.checkout_date));
  }, [destinations]);

  const handleDateChange = (e) => {
    console.log(e);
    if (e) {
      if (e.target.name === "Arrival Date") {
        const offSet = differenceInDays(
          new Date(e.target.value),
          new Date(checkinDate)
        );
        if (isNaN(Date.parse(checkinDate))) {
          setCheckinDate(e.target.value);
        } else {
          handleDates(offSet, index, e.target.value, checkoutDate, true);
        }
      } else if (e.target.name === "Departure Date") {
        const offSet = differenceInDays(
          new Date(e.target.value),
          new Date(checkoutDate)
        );
        if (isNaN(Date.parse(checkoutDate))) {
          setCheckoutDate(e.target.value);
        } else {
          handleDates(offSet, index, checkinDate, e.target.value);
        }
      } else if (e.target.name === "Start Date") {
        const offSet = differenceInDays(
          new Date(e.target.value),
          new Date(startDate)
        );
        if (isNaN(Date.parse(startDate))) {
          setStartDate(e.target.value);
        } else {
          handleDates(offSet, index, null, null);
          setStartDate(e.target.value);
        }
      } else if (e.target.name === "End Date") {
        setEndDate(e.target.value);

        // const offSet = differenceInDays(
        //   new Date(e.target.value),
        //   new Date(endDate)
        // );

        // if (isNaN(Date.parse(endDate))) {
        //   setEndDate(e.target.value);
        // } else {
        //   handleDates(offSet, index, null, null);
        // }
      }
    } else {
      console.log("here >>>", date);
    }
  };

  const isInvalidDate = (date, is_departure = false) => {
    const date_obj = new Date(date);
    const prevDate = new Date(previousDate);
    const checkin_date = new Date(checkinDate);

    switch (startingCity || endingCity || is_departure || true) {
      case startingCity:
        const today = new Date();
        if (!date_obj || isNaN(Date.parse(date))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(date_obj, today) && date_obj < today) {
          return {
            error: true,
            invalid: true,
            message: `Start Date should be greater than or equal to ${dateFormat(
              format(today, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
      case endingCity:
        if (!date_obj || isNaN(Date.parse(date))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(date_obj, prevDate) && date_obj < prevDate) {
          return {
            error: true,
            invalid: true,
            message: `End Date should be greater than or equal to ${dateFormat(
              format(prevDate, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
      case is_departure:
        if (!date_obj || isNaN(Date.parse(date))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (
          !isSameDay(date_obj, checkin_date) &&
          date_obj < checkin_date
        ) {
          return {
            error: true,
            invalid: true,
            message: `Departure Date should be greater than or equal to ${dateFormat(
              format(checkin_date, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
      default:
        if (!date_obj || isNaN(Date.parse(date))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(date_obj, prevDate) && date_obj < prevDate) {
          return {
            error: true,
            invalid: true,
            message: `Arrival Date should be greater than or equal to ${dateFormat(
              format(prevDate, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
    }
  };

  return (
    <div className="w-full md:w-[50%] lg:w-[50%] flex flex-col items-start">
      <div className="flex flex-row gap-3 items-center">
        <div
          style={{ backgroundColor: pinColour ? pinColour : "black" }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
        >
          <div
            className={`w-2 h-2 ${
              pinColour ? "bg-white" : "bg-yellow"
            } rounded-full`}
          ></div>
        </div>
        <div className="text-[16px] font-semibold">
          {cityData.city_name || cityData.name || cityData.text}
        </div>
      </div>
      <div className="w-full flex flex-row items-center gap-3">
        {/* <div className="w-6 flex flex-col gap-1 items-center justify-center">
          {!endingCity &&
            [...Array(divCount)].map((_, index) => (
              <div
                key={index}
                className="w-[2px] h-3 rounded-full bg-green-200"
              ></div>
            ))}
        </div> */}
        {!endingCity ? (
          startingCity ? (
            <div className="w-6 flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-400"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-800"></div>
            </div>
          ) : (
            <div className="w-6 flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-400"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-800"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-800"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-900"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-900"></div>
            </div>
          )
        ) : (
          <div className="w-6"></div>
        )}
        <div ref={cityRef} className="w-full flex flex-col gap-2 py-3">
          <div className="w-full flex flex-row items-center gap-3">
            <div className="w-full flex flex-col gap-1">
              <label>
                {startingCity
                  ? "Start Date"
                  : endingCity
                  ? "End Date"
                  : "Arrival Date"}
              </label>
              <DatePicker
                date={
                  startingCity
                    ? startDate
                    : endingCity
                    ? endDate
                    : getDate(cityData.checkin_date)
                }
                onDateChange={handleDateChange}
                id={
                  startingCity
                    ? "Start Date"
                    : endingCity
                    ? "End Date"
                    : "Arrival Date"
                }
              />

              {/* <div className="flex flex-row items-center gap-1">
                <input
                  required
                  name={
                    startingCity
                      ? "Start Date"
                      : endingCity
                      ? "End Date"
                      : "Arrival Date"
                  }
                  value={
                    startingCity
                      ? startDate
                      : endingCity
                      ? endDate
                      : getDate(cityData.checkin_date)
                  }
                  min={
                    startingCity
                      ? format(new Date(), "yyyy-MM-dd")
                      : previousDate
                  }
                  onChange={handleDateChange}
                  type="Date"
                  className="w-52 border-2 border-gray-200 rounded-lg p-2"
                />
                {!isValidDates &&
                  isInvalidDate(
                    startingCity
                      ? startDate
                      : endingCity
                      ? endDate
                      : checkinDate
                  ).error && (
                    <div
                      className={`text-xs lg:text-sm text-white text-center ${
                        isInvalidDate(
                          startingCity
                            ? startDate
                            : endingCity
                            ? endDate
                            : checkinDate
                        ).invalid
                          ? "bg-red-500"
                          : "bg-[#ffbb33]"
                      }  p-2 rounded-full rounded-tl-none animate-popOut`}
                    >
                      {
                        isInvalidDate(
                          startingCity
                            ? startDate
                            : endingCity
                            ? endDate
                            : checkinDate
                        ).message
                      }
                    </div>
                  )}
              </div> */}
            </div>
          </div>
          {!(startingCity || endingCity) && (
            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="endDate">Departure Date</label>
                <DatePicker
                  date={getDate(cityData.checkout_date)}
                  onDateChange={handleDateChange}
                  id={"Departure Date"}
                />
                {/* <div className="flex flex-row items-center gap-1">
                  <input
                    required
                    name={"Departure Date"}
                    value={getDate(cityData.checkout_date)}
                    min={checkinDate}
                    onChange={handleDateChange}
                    type="Date"
                    className="w-52 border-2 border-gray-200 rounded-lg p-2"
                  />

                  {!isValidDates && isInvalidDate(checkoutDate, true).error && (
                    <div
                      className={`text-xs lg:text-sm text-white text-center ${
                        isInvalidDate(checkoutDate, true).invalid
                          ? "bg-red-500"
                          : "bg-[#ffbb33]"
                      } p-2 rounded-full rounded-tl-none animate-popOut`}
                    >
                      {isInvalidDate(checkoutDate, true).message}
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CustomCalendar = ({
  startDate,
  endDate,
  dateRanges,
  calendarMonths,
}) => {
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const temp_months = [];
    if (calendarMonths < 1) {
      const firstDayOfMonth = startOfMonth(addMonths(startDate, 0));
      const lastDayOfMonth = endOfMonth(addMonths(startDate, 0));
      const startDay = startOfWeek(firstDayOfMonth);
      const endDay = endOfWeek(lastDayOfMonth);
      let monthDays = eachDayOfInterval({
        start: startDay,
        end: endDay,
      });

      monthDays = monthDays.map((day) => {
        return { date: day, color: "" };
      });
      monthDays = getDayColors(dateRanges[0], monthDays);

      temp_months.push({ firstDay: firstDayOfMonth, days: monthDays });
    }

    for (let i = 0; i < calendarMonths; i++) {
      const firstDayOfMonth = startOfMonth(addMonths(startDate, i));
      const lastDayOfMonth = endOfMonth(addMonths(startDate, i));
      const startDay = startOfWeek(firstDayOfMonth);
      const endDay = endOfWeek(lastDayOfMonth);
      let monthDays = eachDayOfInterval({
        start: startDay,
        end: endDay,
      });

      monthDays = monthDays.map((day) => {
        return { date: day, color: "" };
      });

      for (let i = 1; i < dateRanges.length - 1; i++) {
        monthDays = getDayColors(dateRanges[i], monthDays);
        if (dateRanges[i].endDate > lastDayOfMonth) break;
        else {
          continue;
        }
      }

      monthDays = getDayColors(dateRanges[0], monthDays);
      monthDays = getDayColors(dateRanges[dateRanges.length - 1], monthDays);
      temp_months.push({ firstDay: firstDayOfMonth, days: monthDays });
    }

    setMonths(temp_months);
  }, [startDate, endDate, dateRanges, calendarMonths]);

  const getDayColors = (range, days) => {
    return days.map((day) => {
      // Check if the current day is within the range
      if (
        (range && isSameDay(day.date, range.startDate)) ||
        (range && day.date > range.startDate && day.date < range.endDate)
      ) {
        return { date: day.date, color: range.color }; // Return the day and its color
      } else {
        return day;
      }
    });
  };

  return (
    <div className="w-[50%] flex flex-col gap-5">
      {months.map((month, i) => (
        <Month
          key={i}
          firstDay={month.firstDay}
          days={month.days}
          startDate={startDate}
          endDate={endDate}
        />
      ))}
    </div>
  );
};

export const Month = ({ firstDay, days, startDate, endDate }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm">{format(firstDay, "MMMM yyyy")}</div>
      <div className="flex flex-row border-b-2 pb-2">
        {days.map((day, index) => {
          if (index < 7)
            return (
              <div
                key={index}
                style={{ flex: 1, textAlign: "center" }}
                className="text-sm text-[#7C7C7C]"
              >
                {format(day.date, "EEE")}
              </div>
            );
        })}
      </div>
      <div className="grid grid-cols-7 text-lg">
        {days.map((day, index) => {
          if (day.date.getMonth() !== firstDay.getMonth()) {
            return <div key={index} className="p-2"></div>;
          }
          return (
            <div
              key={index}
              style={{
                backgroundColor:
                  isSameDay(day.date, startDate) || isSameDay(day.date, endDate)
                    ? day.color
                    : "",
                color:
                  isSameDay(day.date, startDate) || isSameDay(day.date, endDate)
                    ? "#F7E700"
                    : "#01202B",
              }}
              className={`flex items-center justify-center p-2 font-normal ${
                day.color !== "" ? `bg-gray-200` : ""
              }`}
            >
              {format(day.date, "dd")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DatePicker = (props) => {
  const [focusedInput, setFocusedInput] = useState(props.focusedDate || null);

  useEffect(() => {
    if (props.setFocusedDate) {
      if (focusedInput) props.setFocusedDate(focusedInput);
      else props.setFocusedDate(undefined);
    }
  }, [focusedInput]);

  useEffect(() => {
    if (props.setFocusedDate) setFocusedInput(props.inputDate);
  }, [props.inputDate]);

  let isPageWide = media("(min-width: 768px)");

  return (
    <div className="">
      <Container className="flex flex-col">
        {/* <DateRangePicker
          readOnly={true}
          displayFormat="DD/MM/YYYY"
          startDate={props.valueStart}
          startDateId="startDate"
          startDatePlaceholderText="DD/MM/YYYY"
          startDateTitleText="Start Date"
          endDate={props.valueEnd}
          endDateId="endDate"
          endDatePlaceholderText="DD/MM/YYYY"
          endDateTitleText="End Date"
          onDatesChange={({ startDate, endDate }) => {
            console.log("end >>>>", endDate?._d);
            props.setValueStart(startDate?._d);
            props.setValueStart(endDate?._d);
          }}
          focusedInput={focusedInput}
          onFocusChange={setFocusedInput}
          isOutsideRange={(day) =>
            day.startOf("day").isBefore(moment().add(-1, "day"))
          }
          initialVisibleMonth={() => moment().subtract(0, "month")}
          numberOfMonths={1}
          orientation={"horizontal"}
          noBorder={true}
        /> */}
        <SingleDatePicker
          date={moment(props.date)} // momentPropTypes.momentObj or null
          onDateChange={(date) =>
            props.onDateChange({
              target: {
                name: props.id,
                value: date,
              },
            })
          } // PropTypes.func.isRequired
          focused={false} // PropTypes.bool
          onFocusChange={({ focused }) => focused} // PropTypes.func.isRequired
          id={props.id} // PropTypes.string.isRequired,
          noBorder={true}
          placeholder={"DD/MM/YYYY"}
          numberOfMonths={1}
        />
        <CalenderIcons className="p-2 py-3">
          <Icon>
            <BiCalendarAlt />
          </Icon>
          {/* <Icon>
            <BiCalendarAlt />
          </Icon> */}
        </CalenderIcons>
      </Container>
    </div>
  );
};

export const ActionPanel = (props) => {
  const { setEdit, setEditDestination, editDestination, handleSaveButton } =
    props;

  return (
    <div className="w-full fixed bottom-0 bg-white py-2 md:py-3 lg:py-3 flex items-center justify-center border-t-2 shadow-lg px-2">
      <div className="flex flex-row gap-4">
        <button
          onClick={
            editDestination
              ? () => setEdit(false)
              : () => setEditDestination(true)
          }
          className="px-5 py-2 rounded-lg border-2 border-black hover:text-white hover:bg-black transition ease-in-out duration-500"
        >
          {editDestination ? "Cancel" : "Back"}
        </button>
        <button
          onClick={
            editDestination ? () => setEditDestination(false) : handleSaveButton
          }
          className="bg-[#F7E700] px-5 py-2 rounded-lg border-2 border-black hover:text-white hover:bg-black transition ease-in-out duration-500"
        >
          {editDestination ? "Next" : "Save"}
        </button>
      </div>
    </div>
  );
};

export const ErrorMessage = ({ error, setError }) => {
  return (
    <div
      id="err_message"
      className="animate-slideDown fixed mx-2 top-5 md:right-5 lg:right-5 bg-red-500 rounded-lg text-white p-3 flex flex-row items-center gap-3"
    >
      <div className="text-sm md:text-lg lg:text-lg">{error}</div>
      <RxCrossCircled
        onClick={() => setError(false)}
        className="text-2xl cursor-pointer"
      />
    </div>
  );
};

export const Loader = (props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="mb-96">
        <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-t-yellow-500 h-14 w-14"></div>
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(RouteEditSection);
