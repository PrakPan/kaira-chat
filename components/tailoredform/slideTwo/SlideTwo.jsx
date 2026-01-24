import { useRef, useState, useEffect, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import { IoLocationSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { BiSolidLeftArrow } from "react-icons/bi";
import {
    FaCirclePlus,
    FaCalendarDays,
    FaCircleMinus,
    // FaInfoCircle
} from "react-icons/fa6";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getDate } from "../../../helper/DateUtils";

import useDebounce from "../../../hooks/useDebounce";
import useMediaQuery from "../../media";
import { logEvent } from "../../../services/ga/Index";
import { openNotification } from "../../../store/actions/notification";
import { buildDestinations, buildRoutes, buildRoutesFromDestinations, CustomMapPin, getItemStyle, handleDestinationSearch, handleDragEnd, handleEditDestination, handleRemoveDestination, handleSearchInput, handleSetDestination, handleSetNights, handleUpdateDestination, updateDestinationsDates, updateLatLong, validateDates } from "../utils/slideTwoActions";
import RenderRoutes from "../utils/RenderRoutes";
import { FaInfoCircle } from "react-icons/fa";

const CITY_COLOR_CODES = [
    "#359EBF",
    "#F0C631",
    "#BF3535",
    "#47691e",
    "#cc610a",
    "#008080",
    "#7d5e7d",
];
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

const ScrollContainer = styled.div`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;



const RouteEditSection = (props) => {
    const itinerary = useSelector((state) => state.tailoredInfoReducer.itineraryInititateData);
    const isDesktop = useMediaQuery("(min-width:768px)");
    const routes = useMemo(
        () => buildRoutes(itinerary?.start_city, itinerary?.end_city, itinerary?.basic_route || []),
        [itinerary]
    );

    const startDate = getDate(itinerary?.basic_route?.[0]?.start_date);
    const [endDate, setEndDate] = useState(getDate(props?.plan?.end_date || props?.itinerary?.end_date));
    const [destinations, setDestinations] = useState(buildDestinations(routes, itinerary, getDate, CITY_COLOR_CODES));
    const [destinationChanges, setDestinationChanges] = useState(false);
    const [isValidDates, setIsValidDates] = useState(true);
    const [invalidDateError, setInvalidDateError] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const destinationRef = useRef(null);
    const [mapRoutes, setMapRoutes] = useState(routes);

    const [containerHeight, setContainerHeight] = useState(0);


    // const routes = useMemo(() => {
    //     if (destinations.length > 0) {
    //         return buildRoutesFromDestinations(destinations);
    //     }
    //     return buildRoutes(itinerary?.start_city, itinerary?.end_city, itinerary?.basic_route || []);
    // }, [destinations, itinerary]);


    useEffect(() => {
        if (destinations.length) {
            setMapRoutes(buildRoutesFromDestinations(destinations));
            setIsValidDates(validateDates(destinations, startDate, endDate, setInvalidDateError));
        }
    }, [destinations, startDate, endDate]);

    return (
       
        <div
            className={`w-full h-full relative  flex flex-col bg-white items-center overflow-y-auto  ${!isDesktop ? 'p-2 border-sm border-solid border-primary-yellow rounded-xl mb-xl' : ''}`}
        >
            <ScrollContainer className="w-full h-full">
            <div className="w-full h-full  hide-scrollbar overflow-y-auto" style={{ pointerEvents: 'auto' }}>
                {/* {!isDesktop && <> {
                    <RenderRoutes isDesktop={isDesktop} containerHeight={containerHeight} routes={mapRoutes} destinationChanges={destinationChanges}  key={`map-${mapRoutes?.length}-${destinationChanges}`} />
                }
                    {destinationChanges && (
                        <div className="flex flex-row items-center gap-2">
                            <FaInfoCircle className="text-2xl text-yellow-500" />
                            <div className="text-sm">Changes to be saved</div>
                        </div>
                    )}
                </>
                } */}
                <div className={`${isDesktop ? 'flex flex-row gap-md p-lg border-sm border-solid border-primary-yellow rounded-xl' : ''}`}>
                    <div className={`${isDesktop ? 'w-[100%] overflow-hidden' : ''}`}>
                        <EditDestinations
                            destinations={destinations}
                            setDestinations={setDestinations}
                            destinationRef={destinationRef}
                            startDate={startDate}
                            setEndDate={setEndDate}
                            setLocationsLatLong={props.setLocationsLatLong}
                            locationsLatLong={props.locationsLatLong}
                            setDestinationChanges={setDestinationChanges}
                            isAddMode={isAddMode}
                            setIsAddMode={setIsAddMode}
                            setIsRouteChanged={props.setIsRouteChanged}
                            listClasses={`${isDesktop ? 'h-[380px] overflow-y-auto' : ''}`}
                        />
                    </div>
                    {isDesktop && <>
                    <RenderRoutes isDesktop={isDesktop} containerHeight={containerHeight} routes={mapRoutes} destinationChanges={destinationChanges}  key={`map-${mapRoutes?.length}`} />
                    </>
                    }
                </div>

                {isDesktop && <>
                    {destinationChanges && (
                        <div className="flex flex-row items-center gap-2">
                            <FaInfoCircle className="text-2xl text-yellow-500" />
                            <div className="text-sm">Changes to be saved</div>
                        </div>
                    )}
                </>}
            </div>
            </ScrollContainer>
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


export const EditPanel = ({ editDestination, setEditDestination, setIsRouteChanged }) => {
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
        setIsRouteChanged(true);
    }

    return (
        <div className="w-full md:w-[85%] pt-3 flex items-center justify-center border-b-2 px-2 text-sm md:text-lg lg:text-lg">
            <div className="flex flex-row gap-1 sm:gap-4">
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
    const [newDestination, setNewDestination] = useState(null);
    const isDesktop = useMediaQuery("(min-width:768px)");


    return (
        <div className="w-full bg-text-white lg:p-4 font-inter font-normal flex flex-col items-start justify-start gap-3">
        
            <div className="w-full flex flex-row items-start justify-between">
                <div className="relative text-[20px] pb-3">Route Preview</div>
                <div
                    onClick={() => props?.setIsAddMode(true)}
                    className=" text-blue cursor-pointer underline Body1R_16"
                >
                    + Add Destination
                </div>
                {(props.isAddMode === true) && (
                    <div className={`text-black absolute ${isDesktop ? "top-[120px] left-[180px]" : "top-[80px] left-[5px]"} w-full  sm:w-[300px] z-[1000]`}>
                        <DestinationPopUp
                            destinationRef={props.destinationRef}
                            cityData={{}} 
                            setDestinations={props.setDestinations}
                            updateLatLong={(items) =>
                                updateLatLong(items, props.locationsLatLong, props.setLocationsLatLong)
                            }
                            updateDestinationsDates={updateDestinationsDates}
                            setDestinationChanges={props.setDestinationChanges}
                            onSetDestination={(dest) => setNewDestination(dest)}
                            onClose={() => {
                                props?.setIsAddMode(false)
                                
                            }}
                            setIsRouteChanged={props.setIsRouteChanged}
                            setPopUp={props.setIsAddMode} 
                        />
                    </div>
                )}
            </div>

            {props.destinations.length ? (
                <DragDrop
                    listClasses={props.listClasses}
                    popUp={popUp}
                    setPopUp={setPopUp}
                    updateLatLong={(items) => {
                        updateLatLong(items, props.locationsLatLong, props.setLocationsLatLong)
                    }
                    }
                    updateDestinationsDates={(dests) =>
                        updateDestinationsDates(dests, props.startDate, props.setEndDate)
                    }
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

    return (
        <div className={`w-full flex flex-col relative ${props.listClasses}`}>
            {/* First Destination */}
            <div className="mb-3.5">
                <Destination
                    index={0}
                    startingCity={destinations[0].startingCity}
                    endingCity={destinations[0].endingCity}
                    cityData={destinations[0]?.cityData}
                    pinColour={destinations[0]?.cityData?.color}
                    setDestinations={setDestinations}
                    updateLatLong={updateLatLong}
                    updateDestinationsDates={updateDestinationsDates}
                    setDestinationChanges={setDestinationChanges}
                    destinationRef={destinationRef}
                    totalDestinations={destinations.length}
                    setIsRouteChanged={props.setIsRouteChanged}
                />
            </div>

            <DragDropContext
                onDragEnd={(result) =>
                    handleDragEnd({
                        result,
                        destinations,
                        setDestinations,
                        updateLatLong,
                        updateDestinationsDates,
                        setDestinationChanges,
                        logEvent,
                        setIsRouteChanged: props.setIsRouteChanged
                    })
                }
            >
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {destinations.map((item, index) => {
                                // Only middle destinations, exclude first and last
                                if (index !== 0 && index !== destinations.length - 1) {
                                    return (
                                        <Draggable
                                            key={item.cityData.city_id+index}
                                            draggableId={String(item.cityData.city_id+index)}
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
                                                        setDestinations={setDestinations}
                                                        updateLatLong={updateLatLong}
                                                        setPopUp={setPopUp}
                                                        updateDestinationsDates={updateDestinationsDates}
                                                        setDestinationChanges={setDestinationChanges}
                                                        destinationRef={destinationRef}
                                                        totalDestinations={destinations.length}
                                                        setIsRouteChanged={props.setIsRouteChanged}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                }
                                return null;
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* PopUp for editing existing destinations */}
            {popUp && (
                <DestinationPopUp
                    setDestinations={setDestinations}
                    updateLatLong={updateLatLong}
                    setPopUp={setPopUp}
                    updateDestinationsDates={updateDestinationsDates}
                    setDestinationChanges={setDestinationChanges}
                    destinationRef={destinationRef}
                    onClose={() => setPopUp(false)}
                    setIsRouteChanged={props.setIsRouteChanged}
                    isAddMode={false}
                />
            )}

            <div className="relative w-full flex py-2 mt-2">
                <div 
                    onClick={() => props?.setIsAddMode(true) }
                    className="text-blue cursor-pointer underline Body1R_16"
                >
                    + Add Destination
                </div>
            </div>
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
    const isDesktop = useMediaQuery("(min-width:768px)");

    return (
        <div className="relative w-full flex py-2">
            {popUp && (
                <DestinationPopUp
                    index={index}
                    cityData={cityData}
                    startingCity={startingCity}
                    endingCity={endingCity}
                    setDestinations={setDestinations}
                    updateLatLong={updateLatLong}
                    setPopUp={setPopUp}
                    updateDestinationsDates={updateDestinationsDates}
                    setDestinationChanges={setDestinationChanges}
                    destinationRef={destinationRef}
                    onClose={() => setPopUp(false)}
                    setIsRouteChanged={props.setIsRouteChanged}
                />
            )}

            <div className="w-full flex flex-row font-inter items-center justify-between gap-1 sm:gap-4 mt-3 relative z-10">
                <div className="flex flex-row items-center gap-1 sm:gap-3">
                    {!(startingCity || endingCity) && (
                        <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="6" width="18" height="2" rx="1" />
                                <rect x="3" y="11" width="18" height="2" rx="1" />
                                <rect x="3" y="16" width="18" height="2" rx="1" />
                            </svg>
                        </div>
                    )}

                    {(startingCity || endingCity) && (
                        <div className="w-[20px]" />
                    )}

                    {/* Pin */}
                    <div className="relative flex flex-row items-center gap-1 sm:gap-4">
                        {startingCity || endingCity ? (
                            <div className="w-6 h-6 ml-[0.25rem] rounded-full bg-black flex items-center justify-center relative z-10">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        ) : (
                            <CustomMapPin color={cityData?.color || pinColour} />
                        )}

                        <div className="flex flex-row items-center justify-center gap-2 sm:gap-3">
                            <div className=" Body1M_16  cursor-pointer ">
                                {cityData.city_name || cityData.name || cityData.text}
                            </div>
                            {!(startingCity || endingCity) && cityData?.nights && (
                                <div className="Body1R_16 text-gray-500">
                                    <span className="text-[16px] text-gray-500">I</span> &nbsp;
                                    {`${cityData.nights > 1 && isDesktop ? `${cityData.nights} Nights` : isDesktop ? `${cityData.nights} Night` : `${cityData.nights}N`}`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {!startingCity && !endingCity && (<div className="flex flex-row items-center gap-2">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditDestination(setPopUp, props.setIsRouteChanged);
                        }}
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-50 rounded z-2"
                    >
                        <MdOutlineEdit size={24} color={"#3B82F6"} />
                    </div>


                    <div
                        onClick={(e) =>
                            handleRemoveDestination(
                                e,
                                index,
                                setDestinations,
                                updateLatLong,
                                updateDestinationsDates,
                                setDestinationChanges,
                                props.setIsRouteChanged
                            )
                        }
                        className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-50 rounded"
                    >
                        <MdOutlineDelete size={24} color="#EF4444" />
                    </div>
                </div>
                )}

            </div>

            {/* Dotted line */}
            {index < props?.totalDestinations - 2 && (
                <div
                    className={`absolute z-0
                         left-[40px] top-[45px]
                    `}
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
        onClose,
        setIsRouteChanged,
        isAddMode // NEW PROP
    } = props;

    const [search, setSearch] = useState(
        cityData?.city_name || cityData?.name || cityData?.text || ""
    );
    const debouncedSearch = useDebounce(search);
    const [destination, setDestination] = useState(cityData);
    const [nights, setNights] = useState(cityData?.nights ?? 1);
    const [searchResults, setSearchResults] = useState(null);
    const [validDestination, setValidDestination] = useState(!!cityData?.resource_id); 
    const isDesktop = useMediaQuery("(min-width:768px)");
    const [isSearched,setIsSearched] = useState(false);

    useEffect(() => {
        return () => {
            setSearchResults(null);
        };
    }, []);

    useEffect(() => {
        if (debouncedSearch) {
            handleDestinationSearch(
                debouncedSearch,
                startingCity,
                endingCity,
                setSearchResults
            );
        }
    }, [debouncedSearch, startingCity, endingCity]);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (setPopUp) {
            setPopUp(false);
        }
    };

    const handleSearchChange = (e) => {
        handleSearchInput(e, setSearch);
        const currentDestinationName = destination?.name || destination?.city_name || destination?.text;
        if (e.target.value !== currentDestinationName) {
            setValidDestination(false);
        }
    };

    const handleSelectDestination = (ind) => {
        handleSetDestination(
            ind,
            searchResults,
            setSearch,
            setDestination,
            setSearchResults,
            setIsSearched
        );
        setValidDestination(true); 
    };

    return (
        <>
            {/* Backdrop overlay - clicking closes popup */}
            {isAddMode && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                    onClick={handleClose}
                />
            )}
            
            <div
                ref={destinationRef}
                className={`drop-shadow-2xl bg-gray-200 rounded-lg ${
                    isAddMode 
                        ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[350px] z-[9999]' 
                        : `absolute sm:w-[300px] z-[9999] ${
                            isDesktop 
                                ? '-top-[40%] left-[calc(21%+20px)]' 
                                : 'top-0 left-[6%]'
                        }`
                }`}
            >
                <div className="relative flex flex-col gap-3 p-4">
                    {!isAddMode && !isDesktop && (
                        <BiSolidLeftArrow className="text-2xl absolute left-[-18px] top-3 text-gray-200" />
                    )}

                    <RxCrossCircled
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                        className="text-2xl cursor-pointer absolute right-2 top-2 z-10"
                    />

                    <div className="text-sm px-2 font-medium">
                        {startingCity
                            ? "Where is your trip starting from?"
                            : endingCity
                                ? "Where is your trip ending?"
                                : isAddMode
                                    ? "What do you want to explore?"
                                    : "What do you want to explore?"}
                    </div>

                    <div className="relative flex flex-row items-center justify-between gap-3 w-full text-sm rounded-lg p-2 bg-white border-2 border-gray-300">
                        <IoLocationSharp
                            className="text-xl flex-shrink-0"
                            style={{ color: cityData?.color || '#3B82F6' }}
                        />
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e)=> {handleSearchChange(e);  setIsSearched(false);}} 
                            placeholder="Search Destination"
                            className="focus:outline-none w-full placeholder:font-weight-400 text-base sm:text-sm"
                        />
                        {search && (
                            <RxCrossCircled
                                onClick={() => {
                                    setSearch("");
                                    setValidDestination(false);
                                }}
                                className="text-2xl cursor-pointer flex-shrink-0"
                            />
                        )}

                        {searchResults?.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto border-2 rounded-lg bg-white p-2 flex flex-col gap-2 z-[10000] shadow-lg">
                                {searchResults.map((res, ind) => (
                                    <div
                                        key={ind}
                                        onClick={() => handleSelectDestination(ind)}
                                        className="cursor-pointer flex flex-row items-center gap-3 hover:bg-gray-100 rounded-lg p-2"
                                    >
                                        <div className="w-8 h-8 bg-gray-200 rounded-full p-2 flex items-center justify-center flex-shrink-0">
                                            <IoLocationSharp className="text-sm text-black" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <div className="text-sm font-medium truncate">
                                                {startingCity || endingCity ? res.text : res.name}
                                            </div>
                                            {!(startingCity || endingCity) && (
                                                <div className="text-xs text-gray-500 truncate">
                                                    {res.country}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!(startingCity || endingCity) && (
                        <div className="flex flex-row items-center justify-between w-full text-sm rounded-lg p-2 bg-white border-2 border-gray-300">
                            <div className="flex flex-row items-center gap-1 sm:gap-3">
                                <FaCalendarDays className="flex-shrink-0" />
                                <div className="text-sm mr-2 sm:mr-0">Number of nights</div>
                            </div>

                            <div className="flex flex-row items-center gap-1 sm:gap-2">
                                <FaCircleMinus
                                    onClick={() => handleSetNights(true, setNights)}
                                    className="text-xl cursor-pointer flex-shrink-0"
                                />
                                <div className="text-center min-w-[20px]">{nights}</div>
                                <FaCirclePlus
                                    onClick={() => handleSetNights(false, setNights)}
                                    className="text-xl cursor-pointer flex-shrink-0"
                                />
                            </div>
                        </div>
                    )}

                    {(!validDestination || !destination?.resource_id) && search && (
                        <div className="text-xs text-red-600 px-2">
                            Please select a destination from the dropdown
                        </div>
                    )}

                    <button
                        onClick={() => {
                            if (!validDestination || !destination?.resource_id || !destination?.name) {
                                return;
                            }

                            const updatedDestination = { ...destination, nights };

                            if (props.onSetDestination) props.onSetDestination(updatedDestination);

                            if (props.setDestinations) {
                                handleUpdateDestination({
                                    index, 
                                    destination: updatedDestination,
                                    nights,
                                    setDestinations: setDestinations,
                                    setDestinationChanges: setDestinationChanges || (() => { }),
                                    updateDestinationsDates,
                                    updateLatLong,
                                    setPopUp: null, 
                                    isAddMode: isAddMode || index === undefined,
                                    setIsRouteChanged
                                });
                            }

                            handleClose();
                        }}
                        disabled={!validDestination || !destination?.resource_id || !destination?.name} 
                        className={`w-full rounded-lg border-2 border-black p-2 text-sm font-semibold ${
                            (!validDestination || !destination?.resource_id || !destination?.name)
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-yellow'
                        }`}
                    >
                        {isAddMode || index === undefined ? 'Add Destination' : 'Update'}
                    </button>
                </div>
            </div>
        </>
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

