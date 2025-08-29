import { useRef, useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { IoLocationSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { BiSolidLeftArrow } from "react-icons/bi";
import { FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import {
    FaCirclePlus,
    FaCalendarDays,
    FaCircleMinus,
} from "react-icons/fa6";
import {
    isSameDay,
    addDays,
    differenceInDays,
} from "date-fns";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getDate, getDateString } from "../../../helper/DateUtils";

import { PulseLoader } from "react-spinners";


import { useHandleClose } from "../../../hooks/useHandleClose";
import useDebounce from "../../../hooks/useDebounce";
import useMediaQuery from "../../media";
import { logEvent } from "../../../services/ga/Index";
import axiossearchstartinginstance from "../../../services/search/startinglocation";
import axiossearchinstance from "../../../services/search/searchsuggest";
import axiosItineraryUpdateInstance, { axiosMercuryItineraryUpdateInstance } from "../../../services/itinerary/update";
import { axiosGetItineraryStatus } from "../../../services/itinerary/daybyday/preview";
import { openNotification } from "../../../store/actions/notification";
import setItinerary from "../../../store/actions/itinerary";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiLocationMarker } from "react-icons/hi";
import RoutesMap from "../../../containers/itinerary/breif/RoutesMap";
import Spinner from "../../Spinner";

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
    const itineraryLoading = false;
    const destinationRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const itinerary = useSelector((state) => state.tailoredInfoReducer.itineraryInititateData);
    function addDaysToDate(dateString, daysToAdd) {
        const date = new Date(dateString);

        date.setDate(date.getDate() + daysToAdd);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);


    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
        }

        const handleResize = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.clientHeight);
            }
        };
        window.addEventListener("resize", handleResize);

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
        return () => window.removeEventListener("resize", handleResize)
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
            ref={containerRef}
            onClick={(e) => handleOutsideClick(e)}
            className="w-full h-full relative  flex flex-col bg-white items-center  overflow-y-auto hide-scrollbar"
        >
            {/* {loading && <Loader />} */}

            {itineraryLoading && <Spinner isEdit={true} />}

            <div className="w-full h-full px-5 hide-scrollbar overflow-y-auto py-5">

                {!isDesktop && <div className={`w-full sm:w-[50%] flex flex-col gap-3 items-center h-[300px] mb-4 sm:h-[${containerHeight}px]`}>
                    <div className="flex-1 h-full w-full">
                        <RoutesMap
                            locations={props?.routes}
                        />
                    </div>

                    {destinationChanges && (
                        <div className="flex flex-row items-center gap-2">
                            <FaInfoCircle className="text-2xl text-yellow-500" />
                            <div className="text-sm">Changes to be saved</div>
                        </div>
                    )}
                </div>}

                {editDestination && !itineraryLoading ? (
                    <div className="w-full h-full flex flex-col sm:flex-row justify-start gap-5">
                        {/* redux state error was here */}
                        <EditDestinations
                            destinations={destinations}
                            setDestinations={setDestinations}
                            destinationRef={destinationRef}
                            startDate={startDate}
                            setEndDate={setEndDate}
                            setLocationsLatLong={props.setLocationsLatLong}
                            setDestinationChanges={setDestinationChanges}
                            isEditMode={isEditMode}
                            setIsEditMode={setIsEditMode}
                        />
                        {/* {isDesktop && ( */}
                        {isDesktop && <div className={`w-full sm:w-[50%] flex flex-col gap-3 items-center h-[300px] sm:h-[${containerHeight}px]`}>
                            <div className="flex-1 h-full w-full">
                                <RoutesMap
                                    locations={props?.routes}
                                />
                            </div>

                            {destinationChanges && (
                                <div className="flex flex-row items-center gap-2">
                                    <FaInfoCircle className="text-2xl text-yellow-500" />
                                    <div className="text-sm">Changes to be saved</div>
                                </div>
                            )}
                        </div>}
                        {/* )} */}
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

const mapStateToPros = (state) => ({
    notificationText: state.Notification?.text ?? "",
    token: state.auth?.token ?? "",
    ItineraryId: state.ItineraryId ?? null,
    itinerary: state.Itinerary ?? {},
    plan: state.Plan ?? {},
});


const mapDispatchToProps = (dispatch) => {
    return {
        openNotification: (payload) => dispatch(openNotification(payload)),
    };
};

export default connect(mapStateToPros, mapDispatchToProps)(RouteEditSection);


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
            </div>
        </div>
    );
};

export const EditDestinations = (props) => {
    const [popUp, setPopUp] = useState(false);

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
        <div className="w-full md:w-[50%] lg:w-[55%] lg:p-4 font-inter  font-normal flex flex-col items-start justify-start  pb-[150px]  gap-3">
            <div className="w-full flex flex-row items-start justify-between">
                <div className="text-[20px] pb-3">Route Preview</div>
                <div
                    onClick={() => props?.setIsEditMode(!props?.isEditMode)}
                    className="text-blue cursor-pointer underline text-sm"
                >
                    Edit Route
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
        isEditMode,
        setIsEditMode,
    } = props;

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    function onDragEnd(result) {
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
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    totalDestinations={destinations.length}
                />
            </div>

            <DragDropContext 
            onDragEnd={onDragEnd}
            >
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <>
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {destinations.map((item, index) => {
                                    if (index !== 0 && index !== destinations.length - 1)
                                        return (
                                            <>
                                                <Draggable
                                                    key={item.city_id}
                                                    draggableId={item.city_id}
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
                                                                isEditMode={isEditMode}
                                                                setIsEditMode={setIsEditMode}
                                                                totalDestinations={destinations.length}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            </>
                                        );
                                })}
                                {provided.placeholder}
                            </div>
                        </>
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
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
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
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                totalDestinations={destinations.length}
            />
        </div>
    );
};

const DottedLine = styled.div`
  width: 2px;
  height: 55px;
  background-image: repeating-linear-gradient(
    to bottom,
    gray 0,
    gray 2px,
    transparent 1px,
    transparent 6px
  );
`;



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
        isEditMode,
        setIsEditMode
    } = props;


    const CustomMapPin = ({ color = '#FF0303', size = 32 }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0011 2.33331C16.0011 2.33331 16.0011 2.33331 15.9878 2.33331C11.2811 2.33331 5.89444 5.09331 4.49444 11.2533C2.93444 18.1333 7.14777 23.96 10.9611 27.6266C12.3744 28.9866 14.1878 29.6666 16.0011 29.6666C17.8144 29.6666 19.6278 28.9866 21.0278 27.6266C24.8411 23.96 29.0544 18.1466 27.4944 11.2666C26.0944 5.10665 20.7211 2.33331 16.0011 2.33331ZM11.8011 13.7466C11.8011 11.4266 13.6811 9.54665 16.0011 9.54665C18.3211 9.54665 20.2011 11.4266 20.2011 13.7466C20.2011 16.0666 18.3211 17.9466 16.0011 17.9466C13.6811 17.9466 11.8011 16.0666 11.8011 13.7466Z"
                fill={color}
            />
        </svg>
    );


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
        <div className={`relative w-full flex py-2`}>
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

            <div className="w-full flex flex-row font-inter items-center justify-between gap-4 mt-3 relative z-10">
                <div className="flex flex-row items-center gap-3">
                    {isEditMode && !(startingCity || endingCity) && (
                        <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="6" width="18" height="2" rx="1" />
                                <rect x="3" y="11" width="18" height="2" rx="1" />
                                <rect x="3" y="16" width="18" height="2" rx="1" />
                            </svg>
                        </div>
                    )}

                    {isEditMode && (startingCity || endingCity) && (
                        <div className="w-[20px]"></div> // Same width as hamburger to maintain alignment
                    )}

                    {/* Pin section */}
                    <div className="relative flex flex-row items-center gap-4">
                        {/* Pin design */}
                        {startingCity || endingCity ? (
                            <div className="w-6 h-6 ml-[0.25rem] rounded-full bg-black flex items-center justify-center relative z-10">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        ) : (
                            <CustomMapPin color={cityData?.color || pinColour} />
                        )}

                        <div className="flex flex-row items-center justify-center gap-3">
                            <div className="text-base lg:text-[16px] cursor-pointer font-medium">
                                {cityData.city_name || cityData.name || cityData.text}
                            </div>
                            {!(startingCity || endingCity) && cityData?.nights && (
                                <div className="text-sm text-gray-500">
                                    <span className="text-[16px] text-gray-500">I</span> &nbsp; {`${cityData.nights} ${cityData.nights > 1 ? 'Nights' : 'Night'}`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Show edit and delete icons only in edit mode */}
                {isEditMode && (
                    <div className="flex flex-row items-center gap-2">
                        <div
                            onClick={handleEditDestination}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-50 rounded"
                        >
                            <MdOutlineEdit size={18} color={"#3B82F6"} />
                        </div>

                        {!startingCity && !endingCity && (
                            <div
                                onClick={(e) => handleRemoveDestination(e)}
                                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-50 rounded"
                            >
                                <MdOutlineDelete size={18} color="#EF4444" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {index < props?.totalDestinations - 1 && (
                <div
                    className={`absolute top-[42px] z-0 ${isEditMode
                        ? 'left-[51px] top-[45px]'  // Shifted right when in edit mode (for all destinations)
                        : 'left-[15px]'  // Normal position
                        }`}
                >
                    <DottedLine />
                </div>
            )}
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
