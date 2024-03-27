import React from "react";
import useMediaQuery from "../../../../components/media";
import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdDone } from "react-icons/md";
import { getDate } from "../../../../helper/DateUtils";
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
} from "date-fns";

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

  const handleSaveButton = () => {
    props.setEdit(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-white z-50">
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
            />
            {isDesktop && <div className="w-[50%]">{props.children}</div>}
          </>
        ) : (
          <EditDates
            destinations={destinations}
            setDestinations={setDestinations}
            start_date={props?.plan ? props?.plan.start_date : null}
            end_date={props?.plan ? props?.plan.end_date : null}
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
    <div className="w-full p-3 border-b-2 border-b-gray-200">
      <h1 className="text-2xl md:text-3xl lg:text-3xl font-semibold">
        {props?.title}
      </h1>
      <div className="flex flex-row pb-3 gap-5 text-sm items-center justify-start overflow-x-auto text-nowrap">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Group Type</div>
          <div>{props?.group_type}</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Duration</div>
          <div>{props?.duration_time} Nights</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Dates ({props?.duration})</div>
          <div>
            {convertDFormat(props.start_date)}
            {" - "}
            {convertDFormat(props.end_date)}
          </div>
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
          onClick={() => setEditDestination((prev) => !prev)}
          className={`cursor-pointer ${
            editDestination
              ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
              : "text-gray-500 px-3 py-2"
          } `}
        >
          Edit/Remove Destination
        </div>
        <div
          onClick={() => setEditDestination((prev) => !prev)}
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
            cityData={dest?.cityData}
            pinColour={dest?.cityData?.color}
            setDestinations={props.setDestinations}
            destinations={props.destinations}
            isNewDestination={dest.isNewDestination}
            isEditDestination={dest.isEditDestination}
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
      destinations = destinations.map((dest) => {
        dest.isNewDestination = false;
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
        cityData={cityData}
        handleRemoveDestination={handleRemoveDestination}
        startingCity={startingCity}
        endingCity={endingCity}
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

          <div className="text-lg font-semibold">{cityData.city_name}</div>
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
  const { handleRemoveDestination, cityData, startingCity, endingCity } = props;
  const [search, setSearch] = useState(cityData.city_name);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="w-full flex border-1 border-black shadow-sm rounded-lg px-3 py-2">
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
          {!(startingCity || endingCity) && (
            <RxCrossCircled
              onClick={handleRemoveDestination}
              className="text-2xl cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const EditDates = ({
  destinations,
  setDestinations,
  start_date,
  end_date,
}) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [startDate, setStartDate] = useState(getDate(start_date));
  const [endDate, setEndDate] = useState(getDate(end_date));
  const [calendarMonths, setCalenderMonths] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);

  useEffect(() => {
    const startMonth = new Date(startDate).getMonth();
    const endMonth = new Date(endDate).getMonth();
    setCalenderMonths(endMonth - startMonth + 1);
  }, [startDate, endDate]);

  useEffect(() => {
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

  return (
    <div className="w-full flex flex-row relative">
      <div className="w-[60%] flex flex-col items-start justify-start pb-5 gap-3">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="text-[24px] font-semibold leading-6">
            City Departures
          </div>
        </div>
        <div className="w-full flex flex-col">
          {destinations.map((dest, index) => (
            <DestinationDates
              key={index}
              index={index}
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
            />
          ))}
        </div>
      </div>
      {isDesktop && (
        <div className="w-[40%] flex flex-col gap-5 right-[5%] pb-5">
          <div className="text-[24px] font-semibold">Trip Dates</div>

          <CustomCalendar
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            dateRanges={dateRanges}
            calendarMonths={calendarMonths}
          />
          <div className="flex flex-row gap-1 items-center">
            <MdDone className="text-sm text-white bg-[#0F9E03] rounded-full" />
            <span className="text-sm">
              Dates in destinations match trip dates
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const DestinationDates = (props) => {
  const {
    index,
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
  } = props;

  const [checkinDate, setCheckinDate] = useState(
    getDate(cityData.checkin_date)
  );
  const [checkoutDate, setCheckoutDate] = useState(
    getDate(cityData.checkout_date)
  );

  useEffect(() => {
    setDestinations((prev) => {
      return prev.map((dest, i) => {
        if (i === index) {
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkin_date: checkinDate,
              checkout_date: checkoutDate,
            },
          };
        } else {
          return dest;
        }
      });
    });
  }, [checkinDate, checkoutDate]);

  const handleDateChange = (e) => {
    if (e.target.name === "Arrival Date") {
      setCheckinDate(e.target.value);
    } else if (e.target.name === "Start Date") {
      setStartDate(e.target.value);
    } else if (e.target.name === "End Date") {
      setEndDate(e.target.value);
    }
  };

  return (
    <div className="w-full flex flex-col items-start">
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
        <div className="text-[16px] font-semibold">{cityData.city_name}</div>
      </div>
      <div className="flex flex-row items-center gap-3">
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
        <div className="flex flex-col gap-2 py-3">
          <div className="flex flex-col gap-1">
            <div>
              {startingCity
                ? "Start Date"
                : endingCity
                ? "End Date"
                : "Arrival Date"}
            </div>
            <div>
              <input
                name={
                  startingCity
                    ? "Start Date"
                    : endingCity
                    ? "End Date"
                    : "Arrival Date"
                }
                value={
                  startingCity ? startDate : endingCity ? endDate : checkinDate
                }
                min={
                  startingCity ? format(new Date(), "yyyy-MM-dd") : previousDate
                }
                onChange={(e) => handleDateChange(e)}
                type="Date"
                className="w-52 border-2 border-gray-200 rounded-lg p-2"
              />
            </div>
          </div>
          {!(startingCity || endingCity) && (
            <div className="flex flex-col gap-1">
              <div>Departure Date</div>
              <div>
                <input
                  name={"Departure Date"}
                  value={checkoutDate}
                  min={checkinDate}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                  type="Date"
                  className="w-52 border-2 border-gray-200 rounded-lg p-2"
                />
              </div>
              <div></div>
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
        isSameDay(day.date, range.startDate) ||
        (day.date > range.startDate && day.date < range.endDate)
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
            return <div className=""></div>;
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
              className={`flex items-center justify-center p-2 ${
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

export const ActionPanel = (props) => {
  const { setEdit, setEditDestination, editDestination, handleSaveButton } =
    props;

  return (
    <div className="w-full fixed bottom-0 bg-white py-2 md:py-3 lg:py-3 flex items-center justify-center border-t-2 shadow-lg px-2">
      <div className="flex flex-row gap-4">
        <button
          onClick={() => setEdit(false)}
          className="px-5 py-2 rounded-lg border-2 border-black"
        >
          Cancel
        </button>
        <button
          onClick={
            editDestination
              ? () => setEditDestination((prev) => !prev)
              : handleSaveButton
          }
          className="bg-[#F7E700] px-5 py-2 rounded-lg border-2 border-black"
        >
          {editDestination ? "Next" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default RouteEditSection;
