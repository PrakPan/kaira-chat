import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { openNotification } from "../../../../store/actions/notification";
import useMediaQuery from "../../../../components/media";
import { IoMenu, IoLocationSharp } from "react-icons/io5";
import {
  FaLocationCrosshairs,
  FaCirclePlus,
  FaCircleMinus,
  FaCalendarDays,
} from "react-icons/fa6";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { MdDone } from "react-icons/md";
import { BiSolidLeftArrow } from "react-icons/bi";
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
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { logEvent } from "../../../../services/ga/Index";

const Container = styled.div`
  position: relative;

  .SingleDatePicker {
    width: 100%;
  }
  .SingleDatePickerInput_1 {
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
  .SingleDatePickerInput_arrow,
  .DayPickerKeyboardShortcuts_buttonReset {
    display: none !important;
  }

  .SingleDatePicker_picker_1 {
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
`;

const Icon = styled.div`
  width: 100%;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: end;
  margin-right: 5px;
  margin-top: -5px;
`;

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

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
  const [destinationChanges, setDestinationChanges] = useState(false);
  const [isValidDates, setIsValidDates] = useState(true);
  const [invalidDateError, setInvalidDateError] = useState(null);
  const [loading, setLoading] = useState(false);
  const destinationRef = useRef(null);

  useEffect(() => {
    const cities = [];
    if (props.routes) {
      for (let i = 0; i < props.routes.length; i += 2) {
        cities.push({
          startingCity: i === 0,
          endingCity: i === props.routes.length - 1,
          cityData: {
            ...props.routes[i],
            checkin_date: getDate(props.routes[i].checkin_date),
            checkout_date: getDate(props.routes[i].checkout_date),
          },
        });

        if (i !== 0 && i !== props.routes.length - 1) {
          cities[cities.length - 1].cityData.nights = differenceInDays(
            new Date(getDate(props.routes[i].checkout_date)),
            new Date(getDate(props.routes[i].checkin_date))
          );
        }
      }

      setDestinations(cities);
    }
  }, [props.routes]);

  useEffect(() => {
    if (destinations.length) {
      if (validateDates()) {
        setIsValidDates(true);
      } else {
        setIsValidDates(false);
      }
    }
  }, [destinations, startDate, endDate]);

  const validateDates = () => {
    const today = new Date();

    if (
      !new Date(startDate) ||
      isNaN(Date.parse(startDate)) ||
      (!isSameDay(new Date(startDate), today) && new Date(startDate) < today)
    ) {
      setInvalidDateError(
        `Invalid date selected for starting city ${
          destinations[0].cityData.city_name ||
          destinations[0].cityData.name ||
          destinations[0].cityData.text
        }`
      );
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
        setInvalidDateError(
          `Invalid Arrival date selected for city ${
            destinations[i].cityData.city_name ||
            destinations[i].cityData.name ||
            destinations[i].cityData.text
          }`
        );
        return false;
      }

      if (
        !new Date(checkout_date) ||
        isNaN(Date.parse(checkout_date)) ||
        (!isSameDay(new Date(checkout_date), new Date(checkin_date)) &&
          new Date(checkout_date) < new Date(checkin_date))
      ) {
        setInvalidDateError(
          `Invalid Departure date selected for city ${
            destinations[i].cityData.city_name ||
            destinations[i].cityData.name ||
            destinations[i].cityData.text
          }`
        );
        return false;
      }

      prevDate = new Date(checkout_date);
    }

    if (
      !new Date(endDate) ||
      isNaN(Date.parse(endDate)) ||
      (!isSameDay(new Date(endDate), prevDate) && new Date(endDate) < prevDate)
    ) {
      setInvalidDateError(
        `Invalid date selected for ending city ${
          destinations[destinations.length - 1].cityData.city_name ||
          destinations[destinations.length - 1].cityData.name ||
          destinations[destinations.length - 1].cityData.text
        }`
      );
      return false;
    }

    setInvalidDateError(null);
    return true;
  };

  const submitData = () => {
    const data = {
      itinerary_id: props.ItineraryId,
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
      end_location: {
        place_id: destinations[destinations.length - 1].cityData.place_id,
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

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Update Itinerary Routes",
        event_label: "Save",
        event_action: "Update Routes",
      },
    });
  };

  const handleOutsideClick = (event) => {
    if (
      destinationRef.current &&
      !destinationRef.current.contains(event.target)
    ) {
      destinationRef.current.setPopUp();
    }
  };

  return (
    <div
      onClick={(e) => handleOutsideClick(e)}
      className="fixed inset-0 flex flex-col items-center bg-white z-50"
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

      <div className="w-full h-fit md:w-[85%] lg:w-[85%] px-3 hide-scrollbar overflow-y-auto py-5">
        {editDestination ? (
          <div className="w-full flex flex-row justify-center gap-5">
            <EditDestinations
              destinations={destinations}
              setDestinations={setDestinations}
              destinationRef={destinationRef}
              startDate={startDate}
              setEndDate={setEndDate}
              setLocationsLatLong={props.setLocationsLatLong}
              setDestinationChanges={setDestinationChanges}
            />
            {isDesktop && (
              <div className="sticky top-0 h-[50vh] w-[50%] flex flex-col gap-3 items-center">
                {props.children}

                {destinationChanges && (
                  <div className="flex flex-row items-center gap-2">
                    <FaInfoCircle className="text-2xl text-yellow-500" />
                    <div className="text-sm">Changes to be saved</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <EditDates
            destinations={destinations}
            setDestinations={setDestinations}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            isValidDates={isValidDates}
            invalidDateError={invalidDateError}
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

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    token: state.auth.token,
    ItineraryId: state.ItineraryId,
    itinerary: state.Itinerary,
    plan: state.Plan,
    routes: state.ItineraryRoutes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(RouteEditSection);

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
        </div>
      </div>
    </div>
  );
};

export const EditPanel = ({ editDestination, setEditDestination }) => {
  function handleEditPanel(editDates = false) {
    if (editDates) {
      setEditDestination(false);
    } else {
      setEditDestination(true);
    }

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: editDates ? "Edit Dates" : "Edit/Remove Destination",
        event_action: "Edit Destinations",
      },
    });
  }

  return (
    <div className="w-full pt-3 flex items-center justify-center border-b-2 px-2 text-sm md:text-lg lg:text-lg">
      <div className="flex flex-row gap-4">
        <div
          onClick={() => handleEditPanel()}
          className={`cursor-pointer ${
            editDestination
              ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
              : "text-gray-500 px-3 py-2"
          } `}
        >
          Edit/Remove Destination
        </div>
        <div
          onClick={() => handleEditPanel(true)}
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
  const [popUp, setPopUp] = useState(false);

  function handleAddDestination() {
    setPopUp(true);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Add Destination",
        event_action: "Add New Destination",
      },
    });
  }

  function updateLatLong(items) {
    props.setLocationsLatLong((prev) => {
      let locations = [...prev];
      const newLocations = [];

      for (let i = 1; i < items.length - 1; i++) {
        const lat = items[i]?.cityData?.lat;
        const long = items[i]?.cityData?.long;
        const color = items[i]?.cityData?.color;
        const name = items[i]?.cityData?.name;
        const nights = items[i]?.cityData?.nights;

        if (lat && long) {
          const location = locations.find(
            (item) =>
              item.color === color &&
              item.lat === lat &&
              item.long === long &&
              item.nights === nights
          );

          if (location) {
            newLocations.push(location);
          } else {
            newLocations.push({
              lat: lat,
              long: long,
              name: name,
              color: color,
            });
          }
        }
      }

      return newLocations;
    });
  }

  function updateDestinationsDates(destinations) {
    let prevDate = getDate(props.startDate);

    for (let i = 1; i < destinations.length - 1; i++) {
      const dest = destinations[i];
      const checkInDate = prevDate;
      const checkOutDate = dest?.cityData?.nights
        ? getDateString(
            addDays(new Date(getDate(prevDate)), dest.cityData.nights)
          )
        : getDateString(addDays(new Date(getDate(prevDate)), 1));

      dest.cityData.checkin_date = checkInDate;
      dest.cityData.checkout_date = checkOutDate;
      prevDate = checkOutDate;
    }

    props.setEndDate(prevDate);
  }

  return (
    <div className="w-full md:w-[50%] lg:w-[50%] flex flex-col items-center justify-center pb-[150px] gap-3">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="text-[24px] font-semibold leading-6">Route</div>

        <div>
          <button
            onClick={handleAddDestination}
            className="border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition ease-in-out duration-500"
          >
            Add Destination
          </button>
        </div>
      </div>

      {props.destinations.length ? (
        <DragDrop
          popUp={popUp}
          setPopUp={setPopUp}
          updateLatLong={updateLatLong}
          updateDestinationsDates={updateDestinationsDates}
          {...props}
        />
      ) : null}
    </div>
  );
};

export const DragDrop = (props) => {
  const {
    destinations,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    popUp,
    setPopUp,
    setDestinationChanges,
    destinationRef,
  } = props;

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (
      result.destination.index === 0 ||
      result.destination.index === destinations.length - 1
    ) {
      return;
    }

    let items = reorder(
      destinations,
      result.source.index,
      result.destination.index
    );

    updateDestinationsDates(items);

    updateLatLong(items);

    setDestinationChanges(true);

    setDestinations(items);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Drag and Drop",
        event_label: "Edit",
        event_action: "Edit destinations",
      },
    });
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "rgb(229 231 235)" : "white",
    margin: `0 0 15px 0`,
    borderRadius: "8px",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <div className="w-full flex flex-col relative">
      <div className="mb-3.5">
        <Destination
          index={0}
          startingCity={props.destinations[0].startingCity}
          endingCity={props.destinations[0].endingCity}
          cityData={props.destinations[0]?.cityData}
          pinColour={props.destinations[0]?.cityData?.color}
          setDestinations={props.setDestinations}
          updateLatLong={updateLatLong}
          updateDestinationsDates={updateDestinationsDates}
          setDestinationChanges={setDestinationChanges}
          destinationRef={destinationRef}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {destinations.map((item, index) => {
                if (index !== 0 && index !== destinations.length - 1)
                  return (
                    <Draggable
                      key={`item-${index}`}
                      draggableId={`item-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Destination
                            index={index}
                            startingCity={item.startingCity}
                            endingCity={item.endingCity}
                            cityData={item?.cityData}
                            pinColour={item?.cityData?.color}
                            setDestinations={props.setDestinations}
                            updateLatLong={updateLatLong}
                            setPopUp={setPopUp}
                            updateDestinationsDates={updateDestinationsDates}
                            setDestinationChanges={setDestinationChanges}
                            destinationRef={destinationRef}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {popUp && (
        <DestinationPopUp
          setDestinations={setDestinations}
          updateLatLong={updateLatLong}
          setPopUp={setPopUp}
          updateDestinationsDates={updateDestinationsDates}
          setDestinationChanges={setDestinationChanges}
          destinationRef={destinationRef}
        />
      )}

      <Destination
        index={props.destinations.length - 1}
        startingCity={
          props.destinations[props.destinations.length - 1].startingCity
        }
        endingCity={
          props.destinations[props.destinations.length - 1].endingCity
        }
        cityData={props.destinations[props.destinations.length - 1]?.cityData}
        pinColour={
          props.destinations[props.destinations.length - 1]?.cityData?.color
        }
        setDestinations={props.setDestinations}
        updateLatLong={updateLatLong}
        updateDestinationsDates={updateDestinationsDates}
        setDestinationChanges={setDestinationChanges}
        destinationRef={destinationRef}
      />
    </div>
  );
};

export const Destination = (props) => {
  const {
    startingCity,
    endingCity,
    cityData,
    pinColour,
    index,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    setDestinationChanges,
    destinationRef,
  } = props;

  const [popUp, setPopUp] = useState(false);

  const handleRemoveDestination = (e) => {
    e.stopPropagation();

    setDestinationChanges(true);

    setDestinations((prev) => {
      const updatedDestinations = prev.filter((dest, i) => i !== index);
      updateLatLong(updatedDestinations);
      return updatedDestinations;
    });

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Remove",
        event_action: "Remove destination",
      },
    });
  };

  const handleEditDestination = () => {
    setPopUp(true);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Edit",
        event_action: "Edit destination",
      },
    });
  };

  return (
    <div
      className={`relative w-full flex border-1 border-gray-200 shadow-sm rounded-lg px-2 md:px-3 lg:px-3 py-2`}
    >
      {popUp && (
        <DestinationPopUp
          index={index}
          cityData={cityData}
          startingCity={startingCity}
          endingCity={endingCity}
          setDestinations={props.setDestinations}
          updateLatLong={updateLatLong}
          setPopUp={setPopUp}
          updateDestinationsDates={updateDestinationsDates}
          setDestinationChanges={setDestinationChanges}
          destinationRef={destinationRef}
        />
      )}

      <div
        onClick={handleEditDestination}
        className="w-full flex flex-row items-center justify-between gap-3"
      >
        <div className="w-[60%] flex flex-row items-center gap-3">
          <IoMenu
            className={`text-3xl ${
              !(startingCity || endingCity)
                ? "cursor-grab active:cursor-grabbing"
                : "text-gray-300"
            } `}
          />

          {startingCity || endingCity ? (
            <FaLocationCrosshairs className="text-xl" />
          ) : (
            <IoLocationSharp
              className={`text-xl`}
              style={{ color: pinColour }}
            />
          )}

          <div
            onClick={handleEditDestination}
            className="text-sm lg:text-lg font-medium cursor-pointer flex flex-row gap-5"
          >
            {cityData.city_name || cityData.name || cityData.text}{" "}
          </div>
        </div>

        {!(startingCity || endingCity) && (
          <div className="w-[30%] h-full flex flex-row items-center gap-2">
            <div className="h-[80%] w-[2px] rounded-lg bg-gray-400"></div>
            <div className="text-sm text-gray-500">
              {!(startingCity || endingCity) && cityData?.nights
                ? `${cityData.nights} ${
                    cityData.nights > 1 ? "Nights" : "Night"
                  }`
                : null}
            </div>
          </div>
        )}

        <div className="flex flex-row items-center gap-3 justify-self-end">
          <BiSolidPencil
            onClick={handleEditDestination}
            className="text-xl cursor-pointer"
          />

          {!startingCity && !endingCity && (
            <FaTrashAlt
              onClick={(e) => handleRemoveDestination(e)}
              className="text-xl cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const DestinationPopUp = (props) => {
  const {
    index,
    cityData,
    startingCity,
    endingCity,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    setPopUp,
    setDestinationChanges,
    destinationRef,
  } = props;

  const [search, setSearch] = useState(
    (cityData?.city_name || cityData?.name || cityData?.text) ?? ""
  );
  const [destination, setDestination] = useState(cityData);
  const [nights, setNights] = useState(cityData?.nights ?? 1);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    destinationRef.current.setPopUp = () => setPopUp(false);
    return () => {
      setSearchResults(null);
      setPopUp(null);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.target.value) {
      handleDestinationSeach(e.target.value);

      logEvent({
        action: "Route Edit",
        params: {
          page: "Itinerary Page",
          event_category: "Search",
          event_label: "Search Destination",
          event_action: "Search destination",
        },
      });
    }
    setSearch(e.target.value);
  };

  const handleDestinationSeach = (value) => {
    if (startingCity || endingCity) {
      axiossearchstartinginstance
        .get(`?q=${value}`)
        .then((results) => {
          setSearchResults(results.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiossearchinstance
        .get(`?type=Location&q=${value}`)
        .then((results) => {
          setSearchResults(results.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSetDestination = (i) => {
    setSearch(searchResults[i].name || searchResults[i].text);

    setDestination((prev) => {
      if (
        prev &&
        prev?.resource_id &&
        prev.resource_id === searchResults[i]?.resource_id
      ) {
        return prev;
      } else if (
        prev &&
        prev?.place_id &&
        prev.place_id === searchResults[i]?.place_id
      ) {
        return prev;
      }

      return searchResults[i];
    });

    setSearchResults(null);
  };

  const handleSetNights = (minus = false) => {
    if (minus) {
      setNights((prev) => (prev === 1 ? prev : prev - 1));
    } else {
      setNights((prev) => prev + 1);
    }

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Update Destination",
        event_label: minus ? "Decrease Nights" : "Increase Nights",
        event_action: "Update Nights",
      },
    });
  };

  const handleUpdateDestination = () => {
    setDestinationChanges(true);

    setDestinations((prev) => {
      let destinations = [...prev];
      const curDestination = destinations[index];

      if (curDestination) {
        if (curDestination.startingCity || curDestination.endingCity) {
          destinations[index] = {
            startingCity: curDestination.startingCity,
            endingCity: curDestination.endingCity,
            cityData: {
              ...destination,
            },
          };
        } else {
          destinations[index] = {
            startingCity: curDestination.startingCity,
            endingCity: curDestination.endingCity,
            cityData: {
              ...destination,
              nights: nights,
              color: curDestination.cityData.color,
            },
          };
        }
      } else {
        destinations.splice(destinations.length - 1, 0, {
          startingCity: false,
          endingCity: false,
          cityData: {
            ...destination,
            nights: nights,
            color: CITY_COLOR_CODES[(destinations.length - 1) % 7],
          },
        });
      }

      updateDestinationsDates(destinations);

      updateLatLong(destinations);

      return destinations;
    });

    setPopUp(false);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Update Destination",
        event_label: "Update",
        event_action: "Update destination",
      },
    });
  };

  return (
    <div
      ref={destinationRef}
      className={`z-50 drop-shadow-3xl w-[90%] lg:w-[70%] absolute ${
        index !== undefined
          ? `top-0 left-[10%] lg:left-[30%]`
          : "-bottom-[150px] left-[10%] lg:left-[15%]"
      }  bg-gray-200 rounded-lg`}
    >
      <div className="relative flex flex-col gap-3 p-3">
        <BiSolidLeftArrow className="text-2xl absolute left-[-18px] top-3 text-gray-200" />

        <RxCrossCircled
          onClick={() => setPopUp(false)}
          className="text-2xl cursor-pointer absolute right-2 top-2"
        />

        <div className="text-sm font-semibold px-2">
          {startingCity
            ? "Where is your trip starting from?"
            : endingCity
            ? "Where is your trip ending?"
            : "What do you want to explore?"}
        </div>

        <div className="relative flex flex-row items-center justify-between gap-3 w-full text-sm rounded-lg p-2 bg-white border-2 border-gray-300">
          <IoLocationSharp
            className={`text-xl`}
            style={{ color: cityData?.color }}
          />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => handleSearch(e)}
            placeholder="Search Destination"
            className="focus:outline-none w-full"
          ></input>
          <RxCrossCircled
            onClick={() => setSearch("")}
            className="text-2xl cursor-pointer"
          />

          {searchResults && searchResults.length ? (
            <div className="absolute fixed top-10 left-[0%] w-[100%] max-h-64 overflow-y-auto border-2 rounded-lg bg-white p-2 flex flex-col gap-3">
              {searchResults.map((res, ind) => (
                <div
                  key={ind}
                  onClick={() => handleSetDestination(ind)}
                  className="cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-100 rounded-full"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full p-2 flex items-center justify-center">
                    <IoLocationSharp className="text-lg text-black" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm">
                      {startingCity || endingCity ? res.text : res.name}
                    </div>
                    {!(startingCity || endingCity) && (
                      <div className="text-sm text-gray-500">
                        {res.parent}, {res.country}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {!(startingCity || endingCity) && (
          <div className="flex flex-row items-center justify-between w-full text-sm rounded-lg p-2 bg-white border-2 border-gray-300">
            <div className="flex flex-row items-center gap-3">
              <FaCalendarDays className="" />

              <div className="text-sm">Number of nights</div>
            </div>

            <div className="flex flex-row items-center justify-between gap-2">
              <FaCircleMinus
                onClick={() => handleSetNights(true)}
                className="text-2xl cursor-pointer"
              />
              <div className="text-center">{nights}</div>
              <FaCirclePlus
                onClick={() => handleSetNights()}
                className="text-2xl cursor-pointer"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpdateDestination}
          className="w-full bg-yellow rounded-lg border-2 border-black p-2 text-sm font-semibold"
        >
          Update
        </button>
      </div>
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
  invalidDateError,
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
                checkout_date:
                  getDate(checkoutDate) !== "" && !isNaN(offSet)
                    ? getDateString(
                        addDays(new Date(getDate(checkoutDate)), offSet)
                      )
                    : checkoutDate,
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
              checkin_date:
                getDate(dest.cityData.checkin_date) !== "" && !isNaN(offSet)
                  ? getDateString(
                      addDays(
                        new Date(getDate(dest.cityData.checkin_date)),
                        offSet
                      )
                    )
                  : dest.cityData.checkin_date,
              checkout_date:
                getDate(dest.cityData.checkout_date) !== "" && !isNaN(offSet)
                  ? getDateString(
                      addDays(
                        new Date(getDate(dest.cityData.checkout_date)),
                        offSet
                      )
                    )
                  : dest.cityData.checkout_date,
            },
          };
        } else {
          return dest;
        }
      });
    });

    setEndDate((prev) =>
      !isNaN(offSet) ? getDateString(addDays(new Date(prev), offSet)) : prev
    );
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
                <RxCrossCircled className="text-sm text-white bg-red-500 rounded-full" />
                <span className="text-sm">{invalidDateError}</span>
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

  const [checkinDate, setCheckinDate] = useState(
    getDate(cityData.checkin_date)
  );
  const [checkoutDate, setCheckoutDate] = useState(
    getDate(cityData.checkout_date)
  );

  useEffect(() => {
    setCheckinDate(getDate(cityData.checkin_date));
    setCheckoutDate(getDate(cityData.checkout_date));
  }, [destinations]);

  function updateDate(date, isArrival = true) {
    setDestinations((prev) => {
      return prev.map((dest, ind) => {
        if (ind === index && !(dest.startingCity || dest.endingCity)) {
          if (isArrival) {
            return {
              ...dest,
              cityData: {
                ...dest.cityData,
                checkin_date: date,
              },
            };
          }
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkout_date: date,
            },
          };
        }

        return dest;
      });
    });
  }

  const handleDateChange = (e) => {
    e.target.value = getDateString(e.target.value);

    if (e.target.name === "Arrival Date") {
      const offSet = differenceInDays(
        new Date(e.target.value),
        new Date(checkinDate)
      );

      if (isValidDates) {
        handleDates(offSet, index, e.target.value, checkoutDate, true);
      } else {
        updateDate(e.target.value);
      }
    } else if (e.target.name === "Departure Date") {
      const offSet = differenceInDays(
        new Date(e.target.value),
        new Date(checkoutDate)
      );

      if (isValidDates) {
        handleDates(offSet, index, checkinDate, e.target.value);
      } else {
        updateDate(e.target.value, false);
      }
    } else if (e.target.name === "Start Date") {
      const offSet = differenceInDays(
        new Date(e.target.value),
        new Date(startDate)
      );
      if (isValidDates) {
        handleDates(offSet, index, null, null);
      }
      setStartDate(e.target.value);
    } else if (e.target.name === "End Date") {
      setEndDate(e.target.value);
    }
  };

  const isInvalidDate = (is_departure = false) => {
    const prevDate = new Date(previousDate);
    const checkin_date = new Date(checkinDate);

    switch (startingCity || endingCity || is_departure || true) {
      case startingCity:
        const today = new Date();
        const start_date = new Date(startDate);
        if (isNaN(Date.parse(startDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(start_date, today) && start_date < today) {
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
        const end_date = new Date(endDate);
        if (isNaN(Date.parse(endDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(end_date, prevDate) && end_date < prevDate) {
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
        const checkout_date = new Date(checkoutDate);
        if (isNaN(Date.parse(checkoutDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (
          !isSameDay(checkout_date, checkin_date) &&
          checkout_date < checkin_date
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
        if (isNaN(Date.parse(checkinDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (
          !isSameDay(checkin_date, prevDate) &&
          checkin_date < prevDate
        ) {
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
        <div className="w-full flex flex-col gap-2 py-3">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-col gap-1">
              <label>
                {startingCity
                  ? "Start Date"
                  : endingCity
                  ? "End Date"
                  : "Arrival Date"}
              </label>
              <div
                className={`${
                  !isValidDates
                    ? isInvalidDate().error
                      ? isInvalidDate().invalid
                        ? "w-[80%] border-2 border-red-500 rounded-lg"
                        : "w-[80%] border-2 border-[#ffbb33] rounded-lg"
                      : "w-[80%]"
                    : "w-[80%] "
                } `}
              >
                <DatePicker
                  defaultDate={getDate(previousDate)}
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
              </div>
            </div>
          </div>
          {!(startingCity || endingCity) && (
            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="endDate">Departure Date</label>
                <div
                  className={`${
                    !isValidDates
                      ? isInvalidDate(true).error
                        ? isInvalidDate(true).invalid
                          ? "w-[80%] border-2 border-red-500 rounded-lg"
                          : "w-[80%] border-2 border-[#ffbb33] rounded-lg"
                        : "w-[80%]"
                      : "w-[80%] "
                  } `}
                >
                  <DatePicker
                    defaultDate={getDate(previousDate)}
                    date={getDate(cityData.checkout_date)}
                    onDateChange={handleDateChange}
                    id={"Departure Date"}
                  />
                </div>
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
      // monthDays = getDayColors(dateRanges[0], monthDays);
      monthDays = dayColor(monthDays);

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
        // monthDays = getDayColors(dateRanges[i], monthDays);
        monthDays = dayColor(monthDays);

        if (dateRanges[i].endDate > lastDayOfMonth) break;
        else {
          continue;
        }
      }

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

  const dayColor = (days) => {
    return days.map((day) => {
      if (isSameDay(day.date, startDate) || isSameDay(day.date, endDate)) {
        return { date: day.date, color: "#01202B" };
      } else if (day.date > startDate && day.date < endDate) {
        return { date: day.date, color: "#e5e7eb" };
      } else {
        return day;
      }
    });
  };

  return (
    <div className="w-full flex flex-row gap-5">
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
                    : day.color,
                color:
                  isSameDay(day.date, startDate) || isSameDay(day.date, endDate)
                    ? "#F7E700"
                    : "#01202B",
              }}
              className={`flex items-center justify-center p-2 font-normal`}
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
  const [focusedInput, setFocusedInput] = useState(false);

  function handleFocus() {
    setFocusedInput(true);
  }

  const initialMonth = () => {
    if (isNaN(Date.parse(props.date))) {
      return moment().month(new Date(props.defaultDate).getMonth());
    }
    return moment().month(new Date(props.date).getMonth());
  };

  return (
    <Container onClick={handleFocus} className="flex flex-col">
      <SingleDatePicker
        readOnly={true}
        initialVisibleMonth={initialMonth}
        date={isNaN(Date.parse(props.date)) ? null : moment(props.date)}
        onDateChange={(date) =>
          props.onDateChange({
            target: {
              name: props.id,
              value: date._d,
            },
          })
        }
        focused={focusedInput}
        onFocusChange={({ focused }) => {
          setFocusedInput(false);

          if (focused) {
            logEvent({
              action: "Route Edit",
              params: {
                page: "Itinerary Page",
                event_category: "Edit Dates",
                event_label: "Edit Date",
                event_action: "Focus on Date Input",
              },
            });
          }
        }}
        id={props.id}
        noBorder={true}
        placeholder={"DD/MM/YYYY"}
        numberOfMonths={1}
        displayFormat={"DD/MM/YYYY"}
      />
      <CalenderIcons className="p-2 py-3">
        <Icon>
          <FaCalendarDays />
        </Icon>
      </CalenderIcons>
    </Container>
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
          onClick={handleSaveButton}
          className="bg-[#F7E700] px-5 py-2 rounded-lg border-2 border-black hover:text-white hover:bg-black transition ease-in-out duration-500"
        >
          Save
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
