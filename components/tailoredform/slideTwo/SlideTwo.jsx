import React, { useRef, useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { IoMenu, IoLocationSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { MdDone, MdModeEditOutline, MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import {
    FaLocationCrosshairs,
    FaCirclePlus,
    FaCircleMinus,
    FaCalendarDays,
} from "react-icons/fa6";
import { RiProgress2Line } from "react-icons/ri";
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
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getDate, getDateString } from "../../../helper/DateUtils";
import { dateFormat } from "../../../helper/DateUtils";

import { TbArrowBack } from "react-icons/tb";


import { PulseLoader } from "react-spinners";


import { useHandleClose } from "../../../hooks/useHandleClose";
import useDebounce from "../../../hooks/useDebounce";
import useMediaQuery from "../../media";
import { logEvent } from "../../../services/ga/Index";
import axiossearchstartinginstance from "../../../services/search/startinglocation";
import axiossearchinstance from "../../../services/search/searchsuggest";
import axiosItineraryUpdateInstance, { axiosMercuryItineraryUpdateInstance } from "../../../services/itinerary/update";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { axiosGetItineraryStatus } from "../../../services/itinerary/daybyday/preview";
import { openNotification } from "../../../store/actions/notification";
import setItinerary from "../../../store/actions/itinerary";
import { IoMdArrowRoundBack } from "react-icons/io";

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
    font-family: lexend;
    font-weight: 450;
    font-size: 0.9rem;
    padding:5px;
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
  color: gray;
  font-weight: 600;
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
const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 2;
  cursor: pointer;
`;

const RouteEditSection = (props) => {
    const isDesktop = useMediaQuery("(min-width:768px)");
    const dispatch = useDispatch();
    const handleClose = useHandleClose();
    const [startDate, setStartDate] = useState(
        getDate(props?.plan ? props?.plan.start_date : props?.itinerary?.start_date)
    );
    const [endDate, setEndDate] = useState(
        getDate(props?.plan ? props?.plan.end_date : props?.itinerary?.end_date)
    );
    const [destinations, setDestinations] = useState([]);
    const [editDestination, setEditDestination] = useState(
        props.editRoute === "editDates" ? false : true
    );
    const [destinationChanges, setDestinationChanges] = useState(false);
    const [isValidDates, setIsValidDates] = useState(true);
    const [invalidDateError, setInvalidDateError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [itineraryLoading, setItineraryLoading] = useState(false);
    const [polling, setPolling] = useState(false);
    const [pollingInterval, setPollingInterval] = useState(null);
    const destinationRef = useRef(null);
    const itinerary = useSelector((state) => state.Itinerary);
    const [waitingForStatusUpdate, setWaitingForStatusUpdate] = useState(false);
    const { itinerary_status, transfers_status, pricing_status, hotels_status } =
        useSelector((state) => state.ItineraryStatus);

    function addDaysToDate(dateString, daysToAdd) {
        const date = new Date(dateString);

        date.setDate(date.getDate() + daysToAdd);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const cities = [];
        if (props?.routes) {
            for (let i = 0; i < props.routes.length; i += 1) {
                cities.push({
                    startingCity: i === 0,
                    endingCity: i === props.routes.length - 1,
                    cityData: {
                        ...props.routes[i],
                        city_name:
                            props.routes[i]?.city_name || props.routes[i]?.city?.name,
                        checkin_date:
                            (i === 0
                                ? itinerary?.start_date
                                : i === props.routes.length - 1
                                    ? itinerary?.end_date
                                    : getDate(
                                        props.routes[i].checkin_date ||
                                        props.routes[i]?.start_date ||
                                        (i === 0
                                            ? itinerary?.start_date
                                            : i === props.routes.length - 1
                                                ? itinerary?.end_date
                                                : null)
                                    )) || null,
                        checkout_date:
                            (i === 0
                                ? itinerary?.start_date
                                : i === props.routes.length - 1
                                    ? itinerary?.end_date
                                    : getDate(
                                        props.routes[i].checkout_date ||
                                        addDaysToDate(
                                            props.routes[i]?.start_date,
                                            props.routes[i]?.duration
                                        )
                                    )) || null,
                        city_id: props?.routes[i]?.city_id || props?.routes[i]?.city?.id,
                        place_id:
                            props.routes[i]?.place_id || props.routes[i]?.gmaps_place_id,
                        duration: props?.routes[i]?.duration,
                        id: props?.routes[i]?.hasOwnProperty("id")
                            ? props?.routes[i]?.id
                            : null,
                        color: CITY_COLOR_CODES[i % 7],
                        lat:
                            props?.routes[i]?.lat ||
                            props?.routes[i]?.latitude ||
                            props?.routes[i]?.city?.latitude,
                        long:
                            props?.routes[i]?.long ||
                            props?.routes[i]?.longitude ||
                            props?.routes[i]?.city?.longitude,
                        nights: props?.routes[i]?.nights || props?.routes[i]?.duration,
                    },
                });

                if (i !== 0 && i !== props.routes.length - 1) {
                    cities[cities.length - 1].cityData.nights = differenceInDays(
                        new Date(
                            getDate(
                                props.routes[i].checkout_date ||
                                addDaysToDate(
                                    props.routes[i]?.start_date,
                                    props.routes[i]?.duration
                                )
                            )
                        ),
                        new Date(
                            getDate(
                                props.routes[i].checkin_date || props.routes[i]?.start_date
                            )
                        )
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

    useEffect(() => {
        if (waitingForStatusUpdate) {
            const allStatusesCompleted = [
                itinerary_status,
                transfers_status,
                pricing_status,
                hotels_status,
            ].every((status) => status === "SUCCESS" || status === "FAILURE");

            if (allStatusesCompleted) {
                console.log(
                    "Status update complete",
                    itinerary_status,
                    transfers_status,
                    pricing_status,
                    hotels_status
                );
                dispatch(setItineraryStatus("finalized_status", "SUCCESS"));
                setItineraryLoading(false);
                setWaitingForStatusUpdate(false);
                dispatch(
                    openNotification({
                        type: "success",
                        text: "Itinerary has been updated successfully.",
                        heading: "Sucess!",
                    })
                );
                handleClose();
            }
        }
    }, [
        itinerary_status,
        transfers_status,
        pricing_status,
        hotels_status,
        itineraryLoading,
        waitingForStatusUpdate,
    ]);

    const fetchItineraryStatus = async (itineraryId) => {
        try {
            const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
            const status = res.data?.celery;
            dispatch(
                setItineraryStatus("pricing_status", status?.PRICING || "PENDING")
            );
            dispatch(
                setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING")
            );
            dispatch(
                setItineraryStatus("hotels_status", status?.HOTELS || "PENDING")
            );
            dispatch(
                setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING")
            );
            fetchItinerary();
        } catch (err) {
            console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
        }
    };

    const fetchItinerary = async () => {
        props?.resetRef();
        setWaitingForStatusUpdate(true);
        props.fetchData(true);
    };

    const startStatusPolling = (itineraryId) => {
        setItineraryLoading(true);
        setPolling(true);

        fetchItineraryStatus(itineraryId);
    };

    const validateDates = () => {
        const today = new Date();
        console.log("Valid D", destinations);
        if (
            !new Date(startDate) ||
            isNaN(Date.parse(startDate)) ||
            (!isSameDay(new Date(startDate), today) && new Date(startDate) < today)
        ) {
            setInvalidDateError(
                `Invalid date selected for starting city ${destinations[0].cityData.city_name ||
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
                    `Invalid Arrival date selected for city ${destinations[i].cityData.city_name ||
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
                    `Invalid Departure date selected for city ${destinations[i].cityData.city_name ||
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
                `Invalid date selected for ending city ${destinations[destinations.length - 1].cityData.city_name ||
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
            itinerary_id: props.ItineraryId || props?.itinerary?.ItineraryId,
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
                        id: dest.cityData?.hasOwnProperty("id") ? dest.cityData?.id : null,
                        duration: dest.cityData?.duration || dest.cityData?.nights,
                        start_date: dest.cityData.checkin_date || startDate,
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

        console.log("New Request Data", data, destinations);

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
        };

        if (!props?.mercuryItinerary) {
            axiosItineraryUpdateInstance
                .post("", data, { headers })
                .then((response) => {
                    setLoading(false);
                    const itineraryId =
                        props.ItineraryId || props?.itinerary?.ItineraryId;
                    startStatusPolling(itineraryId);
                    handleClose()
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
        } else {
            axiosMercuryItineraryUpdateInstance
                .post(`/${props.ItineraryId || props?.itinerary?.ItineraryId}/`, data, {
                    headers,
                })
                .then((response) => {
                    dispatch(setItinerary(response.data));
                    setLoading(false);
                    const itineraryId =
                        props.ItineraryId || props?.itinerary?.ItineraryId;
                    startStatusPolling(itineraryId);
                    handleClose()
                })
                .catch((err) => {
                    setLoading(false);
                    setItineraryLoading(false);
                    if (err?.response?.status === 403) {
                        props.openNotification({
                            text: "You are not allowed to make changes to this itinerary",
                            heading: "Error!",
                            type: "error",
                        });
                    } else if (err?.response?.status === 400) {
                        props.openNotification({
                            text: err?.message,
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
        }
    };

    const handleSaveButton = () => {
        if (!props.token) {
            props.setShowLoginModal(true);
            return;
        }

        if (validateDates()) {
            setLoading(true);
            setItineraryLoading(true);
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
        <>
            <div
                onClick={(e) => handleOutsideClick(e)}
                className="w-full h-full fixed inset-0 flex flex-col bg-[#ACACAC] items-center bg-white z-[1025] overflow-y-auto hide-scrollbar"
            >
                {/* {loading && <Loader />} */}
                <Header title={"Route Overview — Customize Your Journey from Start to Finish!"}></Header>
              
                {itineraryLoading && <Spinner isEdit={true} />}

                <div className="w-full h-full px-5 hide-scrollbar overflow-y-auto py-5">
                    {editDestination && !itineraryLoading ? (
                        <div className="w-full h-full flex flex-row justify-start gap-5">
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
                                <div className="sticky top-0 h-full w-[50%] flex flex-col gap-3 items-center">
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
                        // <EditDates
                        //   destinations={destinations}
                        //   setDestinations={setDestinations}
                        //   startDate={startDate}
                        //   setStartDate={setStartDate}
                        //   endDate={endDate}
                        //   setEndDate={setEndDate}
                        //   isValidDates={isValidDates}
                        //   invalidDateError={invalidDateError}
                        // />
                        ""
                    )}
                 <ActionPanel/>
                </div>

              
               
                {!isDesktop && (
                    <FloatingView>
                        <TbArrowBack
                            style={{ height: "28px", width: "28px" }}
                            cursor={"pointer"}
                            onClick={
                                editDestination
                                    ? () => handleClose()
                                    : () => setEditDestination(true)
                            }
                        />
                    </FloatingView>
                )}
            </div>
        </>
    );
};

const mapStateToPros = (state) => {
    return {
        notificationText: state.Notification.text,
        token: state.auth.token,
        ItineraryId: state.ItineraryId,
        itinerary: state.Itinerary,
        plan: state.Plan,
        // routes: state.ItineraryRoutes,
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
        <div className="w-full font-inter px-5 py-3  border-b-gray-200">
            <div className="flex items-center justify-between">
                <IoMdArrowRoundBack size={24}/>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold w-[50%] text-center">
                {props?.title}
            </h1>
                <IoMdArrowRoundBack size={24}/>
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
        <div className="w-full md:w-[85%] pt-3 flex items-center justify-center border-b-2 px-2 text-sm md:text-lg lg:text-lg">
            <div className="flex flex-row gap-4">
                <div
                    onClick={() => handleEditPanel()}
                    className={`cursor-pointer ${editDestination
                            ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
                            : "text-gray-500 px-3 py-2"
                        } `}
                >
                    Edit/Remove Destination
                </div>
                {/* <div
          onClick={() => handleEditPanel(true)}
          className={`cursor-pointer ${
            !editDestination
              ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
              : "text-gray-500 px-3 py-2"
          } `}
        >
          Edit Dates
        </div> */}
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
                const lat = items[i]?.cityData?.lat || items[i]?.cityData?.latitude;
                const long = items[i]?.cityData?.long || items[i]?.cityData?.longitude;
                const color = items[i]?.cityData?.color;
                const name = items[i]?.cityData?.name || items[i]?.cityData?.city_name;
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
        <div className="w-full md:w-[50%] lg:w-[50%] font-inter  font-normal flex flex-col items-start justify-start  pb-[150px]  gap-3">
            <div className="w-full flex flex-row items-start justify-between">
                <div className="text-[24px] pb-3">Route Preview</div>

                {/* <div>
                    <button
                        onClick={handleAddDestination}
                        className="border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition ease-in-out duration-500"
                    >
                        Add Destination
                    </button>
                </div> */}
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
    const isPageWide = window.matchMedia("(min-width: 768px)")?.matches;

    const handleRemoveDestination = (e) => {
        e.stopPropagation();

        setDestinationChanges(true);

        setDestinations((prev) => {
            const updatedDestinations = prev.filter((dest, i) => i !== index);
            updateLatLong(updatedDestinations);
            updateDestinationsDates(updatedDestinations);
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
            className={`relative w-full flex py-2`}
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
                <div className="w-[70%] flex flex-row items-center gap-3">
                    <div className={`text-3xl ${!(startingCity || endingCity)
                            ? "cursor-grab active:cursor-grabbing text-gray-400"
                            : "text-gray-300"
                        } `}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="6" width="18" height="2" rx="1" />
                            <rect x="3" y="11" width="18" height="2" rx="1" />
                            <rect x="3" y="16" width="18" height="2" rx="1" />
                        </svg>
                    </div>

                    {startingCity || endingCity ? (
                       <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "black" }}
                        >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    ) : (
                        <IoLocationSharp
                        className={`text-3xl`}
                        style={{ color: cityData?.color }}
                    />
                    )}

                    <div
                        onClick={handleEditDestination}
                        className="text-sm lg:text-lg  cursor-pointer flex flex-row gap-5 items-center justify-center"
                    >
                        {cityData.city_name || cityData.name || cityData.text}{" "} 
                         {!(startingCity || endingCity) && (
                    <div className="w-full h-full flex flex-row items-center justify-center gap-2">
                        <div className="h-8 flex items-center">
  <div className="h-[80%] w-[2px] bg-gray-400"></div>
</div>

                        <div className="text-sm text-gray-500">
                            {!(startingCity || endingCity) && cityData?.nights
                                ? `${cityData.nights} ${cityData.nights > 1
                                    ? isPageWide
                                        ? "Nights"
                                        : "N"
                                    : isPageWide
                                        ? "Night"
                                        : "N"
                                }`
                                : null}
                        </div>
                    </div>
                )}
                    </div>
                </div>

                {/* {!(startingCity || endingCity) && (
                    <div className="w-[30%] h-full flex flex-row items-center gap-2">
                        <div className="h-[80%] w-[2px]  bg-gray-400"></div>
                        <div className="text-sm text-gray-500">
                            {!(startingCity || endingCity) && cityData?.nights
                                ? `${cityData.nights} ${cityData.nights > 1
                                    ? isPageWide
                                        ? "Nights"
                                        : "N"
                                    : isPageWide
                                        ? "Night"
                                        : "N"
                                }`
                                : null}
                        </div>
                    </div>
                )} */}

                <div className="flex flex-row items-center gap-3 justify-self-end">
                    <div
                        onClick={handleEditDestination}
                        className="w-8 h-8   flex items-center justify-center cursor-pointer hover:bg-blue-50"
                    >
                        {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                            {/* <path d="M12 20h9" /> */}
                            {/* <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>  */}
                        <MdOutlineEdit size={20} color={"blue"}/>
                    </div>

                    {!startingCity && !endingCity && (
                        <div
                            onClick={(e) => handleRemoveDestination(e)}
                            className="w-8 h-8 rounded-full   flex items-center justify-center cursor-pointer hover:bg-red-50"
                        >
                            {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6" />
                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                            </svg> */}
                            <MdOutlineDelete size={20} color="red"/>
                        </div>
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
    const debouncedSearch = useDebounce(search);
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
    useEffect(() => {
        handleDestinationSeach(debouncedSearch);
    }, [debouncedSearch]);

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
                .get(`?type=City&q=${value}`)
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
        console.log("New Desti", destination);

        setDestinations((prev) => {
            let destinations = [...prev];
            const curDestination = destinations[index];

            const match = destinations.find((d, i) => {
                // if (i === index) return false; 
                const cd = d.cityData;
                return (
                    (cd?.resource_id === destination?.resource_id ||
                        cd?.city_id === destination?.resource_id ||
                        cd?.id === destination?.resource_id) && i === index
                );
            });

            const matchedCityId = match?.cityData?.id;
            if (matchedCityId) {
                destination.id = matchedCityId;
            }

            if (curDestination) {
                if (curDestination.startingCity || curDestination.endingCity) {
                    destinations[index] = {
                        startingCity: curDestination.startingCity,
                        endingCity: curDestination.endingCity,
                        cityData: {
                            ...destination,
                            duration: nights,
                            place_id: destination?.place_id,
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
                            duration: nights,
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
                        duration: nights,
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
            className={`z-50 drop-shadow-xl w-[90%] lg:w-[70%] absolute ${index !== undefined
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

                <div className="text-sm  px-2">
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
                        <div className="fixed top-[6rem] left-[5%] w-[90%] max-h-60 overflow-y-auto border-2 rounded-lg bg-white p-2 flex flex-col gap-3">
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
                                                {/* {res.parent || res.name} */}
                                                {res.country}
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





export const ActionPanel = (props) => {
    const {
        setEdit,
        setEditDestination,
        editDestination,
        handleSaveButton,
        itineraryLoading,
        handleClose,
    } = props;

    return (
        <div className="w-full mt-3 py-2 md:py-3 lg:py-3 flex  items-center justify-between border-t-2  px-2">
            <div className="flex w-full justify-between flex-row p-4">
                {!itineraryLoading && (
                    <button
                        onClick={
                            editDestination
                                ? () => handleClose()
                                : () => setEditDestination(true)
                        }
                        className="px-3 py-2 rounded-lg border-2 border-black hover:text-white hover:bg-black transition ease-in-out duration-500"
                    >
                        {/* {editDestination ? "Cancel" : "Back"} */}
                        Skip
                    </button>
                )}
                {
                    <button
                        onClick={handleSaveButton}
                        className="bg-[#07213A] px-5 py-2 w-[30%] rounded-lg border-2 border-black text-white hover:bg-black transition ease-in-out duration-500"
                    >
                        {itineraryLoading ? (
                            <PulseLoader size={14} speedMultiplier={0.6} color="white" />
                        ) : (
                            "Continue"
                        )}
                    </button>
                }
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
