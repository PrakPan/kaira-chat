import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import { updateFlightBooking } from "../../../services/bookings/UpdateBookings";
import { connect, useDispatch, useSelector } from "react-redux";
import axiosflightsearch, {
  axiosFlightSearch,
} from "../../../services/bookings/FlightSearch";
import SectionOne from "./SectionOne";
import Button from "../../ui/button/Index";
import Flight from "./new-flight-searched/Index";
import LoadingLottie from "../../ui/LoadingLottie";
import Drawer from "../../ui/Drawer";
import Skeleton from "./Skeleton";
import { TbArrowBack } from "react-icons/tb";
import { openNotification } from "../../../store/actions/notification";
import { FaFilter } from "react-icons/fa";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import LogInModal from "../Login";
import { toast, ToastContainer } from "react-toastify";
import {
  setTransfersBookings,
  updateSingleTransferBooking,
} from "../../../store/actions/transferBookingsStore";
import ComboSection from "./ComboSectionOne";
import dayjs from "dayjs";
import axios from 'axios';

// const GridContainer = styled.div`
// min-height: 65vh;
// max-height: 40vh;
// overflow-x: hidden;

// @media screen and (min-width: 768px) {
//     min-height: 90vh;
//     overflow-y: scroll;
// `;
const GridContainer = styled.div`
overflow: visible;
overflow-x: hidden;

@media screen and (min-width: 768px) {
    min-height: 90vh;
`;

const FloatingView = styled.div`
  position: sticky;
  bottom: 10px;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;

const Floating = styled.div`
  position: sticky;
  bottom: 65px;
  background: #01202b;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 85%;
  z-index: 2;
  cursor: pointer;
`;

const OptionsContainer = styled.div`
  overflow: visible;
  width: 100%;
  position: relative;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
  }
`;

const ContentContainer = styled.div`
  @media screen and (min-width: 768px) {
    width: 95%;
    margin: auto;
  }
`;



const ComboFlight = (props) => {
  console.log("TIMEE", props?.comboStartTime);
  console.log(
    "Flight Selected Booking",
    props?.selectedBooking,
    props?.showComboFlightModal
  );
  console.log(
    "Flight Selected Booking",
    props?.originCityId,
    props?.destinationCityId
  );

  let isPageWide = media("(min-width: 768px)");
  const dispatch = useDispatch();
  const transferBookings = useSelector((state) => state.TransferBookings);
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState({
    order: "asc",
    non_stop_flights: true,
    departure_time_period: "",
    arrival_time_period: "",
    airline_name: "",
    sort_by: "Price",
  });
  const { number_of_adults, number_of_children, number_of_infants } =
    useSelector((state) => state.Itinerary);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [isFetchingError, setFetchingIsError] = useState({
    error: false,
    errorMsg: "",
  });
  const [moreLoadingState, setMoreLoadingState] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [flightCount, setFlightsCount] = useState(
    props?.flightResults ? props?.flightResults?.length : 0
  );
  const [pax, setPax] = useState({
    adults:
      number_of_adults ||
      (props.selectedBooking?.pax?.number_of_adults
        ? props.selectedBooking.pax.number_of_adults
        : 1),
    children:
      number_of_children ||
      (props.selectedBooking?.pax?.number_of_children
        ? props.selectedBooking.pax.number_of_children
        : 0),
    infants:
      number_of_infants ||
      (props.selectedBooking?.pax?.number_of_infants
        ? props.selectedBooking.pax.number_of_infants
        : 0),
  });
  const [classType, setClassType] = useState({
    key: "All",
    value: 1,
  });
  const [showTransferEditDrawer, setShowTransferEditDrawer] = useState(false);
  const [flights, setFlights] = useState(
    props?.flightResults ? props?.flightResults : []
  );
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);
  const [flightProvider, setProvider] = useState(null);
  const [preferredDepartureTime, setPreferredDepartureTime] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [timeUpdated, setTimeUpdated] = useState(false);
  const [propsReady, setPropsReady] = useState(false);
  const [dateTimeInitialized, setDateTimeInitialized] = useState(false);
  const [paxChanged, setPaxChanged] = useState(false);
  
  const abortControllerRef = useRef(null);
  const cancelTokenSourceRef = useRef(null); 

  const [currentRequestId, setCurrentRequestId] = useState(0);

const generateRequestId = () => {
  const newId = currentRequestId + 1;
  setCurrentRequestId(newId);
  return newId;
};

  console.log(
    "Source Itinerary",
    props?.source_itinerary_city_id,
    props?.destination_itinerary_city_id
  );

 const cancelCurrentRequest = () => {
  if (cancelTokenSourceRef.current) {
    console.log("Cancelling current API request");
    cancelTokenSourceRef.current.cancel('Request cancelled by user');
    cancelTokenSourceRef.current = null;
  }
};

// Cleanup on component unmount
useEffect(() => {
  return () => {
    cancelCurrentRequest();
  };
}, []);


  useEffect(() => {
    if (props?.comboStartTime && props?.comboStartDate) {
      setPropsReady(true);
    } else if (props?.selectedBooking?.check_in) {
      setPropsReady(true);
    }
  }, [
    props?.comboStartTime,
    props?.comboStartDate,
    props?.selectedBooking?.check_in,
  ]);

  useEffect(() => {
    console.log(
      "Combo S",
      props?.comboStartDate,
      props?.comboStartTime,
      dateTimeInitialized,
      propsReady
    );

    function roundToNext30Min(input) {
      try {
        const dateTime = dayjs(input);
        if (!dateTime.isValid()) {
          console.error("Invalid date input:", input);
          return null;
        }

        const minutes = dateTime.minute();
        const addMinutes =
          minutes === 0 ? 0 : minutes <= 30 ? 30 - minutes : 60 - minutes;

        return dateTime.add(addMinutes, "minute").second(0).millisecond(0);
      } catch (error) {
        console.error("Error processing date:", error);
        return null;
      }
    }

    if (propsReady && (!dateTimeInitialized || timeUpdated)) {
      let baseTime;
      if (props?.comboStartTime && props?.comboStartDate) {
        try {
          const isoString = getISOStringFromDateAndTime(
            props?.comboStartDate,
            props?.comboStartTime
          );
          console.log("Using combo start time/date:", isoString);
          if (!isoString) {
            console.error("Failed to generate ISO string from date and time");
            return;
          }
          baseTime = dayjs(isoString);
        } catch (error) {
          console.error("Error with combo time/date:", error);
          return;
        }
      } else if (props?.selectedBooking?.check_in) {
        try {
          baseTime = dayjs(props?.selectedBooking?.check_in.replace(" ", "T"));
          console.log("Using check_in time:", props?.selectedBooking?.check_in);
        } catch (error) {
          console.error("Error with check_in:", error);
          return;
        }
      } else {
        console.log("No valid date source available");
        return;
      }

      if (!baseTime.isValid()) {
        console.error("Date not valid");
        return;
      }

      const roundedTime = roundToNext30Min(baseTime);
      if (roundedTime) {
        console.log(
          "Setting preferred departure time to:",
          roundedTime.format("YYYY-MM-DDTHH:mm:ss")
        );
        setPreferredDepartureTime(roundedTime.format("YYYY-MM-DDTHH:mm:ss"));
        setDateTimeInitialized(true);
        if (timeUpdated) {
          setTimeUpdated(false);
        }
      }
    }
  }, [
    props?.comboStartDate,
    props?.comboStartTime,
    props?.selectedBooking?.check_in,
    propsReady,
    dateTimeInitialized,
    timeUpdated,
  ]);

  function getISOStringFromDateAndTime(dateStr, timeStr) {
    try {
      if (!dateStr) throw new Error("No date provided");

      const [year, month, day] = dateStr.split("-");
      const [hour, minute] = timeStr ? timeStr.split(":") : ["00", "00"];

      if (!year || !month || !day) throw new Error("Invalid date format");

      const localDate = new Date(year, month - 1, day, hour || 0, minute || 0);

      if (isNaN(localDate.getTime())) {
        console.error("Invalid date created from inputs:", {
          dateStr,
          timeStr,
        });
        throw new Error("Invalid date created");
      }

      return localDate.toISOString();
    } catch (error) {
      console.error("Error creating ISO date:", error);
      return null;
    }
  }

useEffect(() => {
  if (!preferredDepartureTime) return;

  const shouldFetchFlights =
    props.showComboFlightModal &&
    props.token &&
    preferredDepartureTime &&
    !props?.skipFetch;

  if (shouldFetchFlights) {
    const timeoutId = setTimeout(() => {
      _FetchFlightsHandler();
      setTimeUpdated(false);
    }, 50); 

   
    return () => {
      clearTimeout(timeoutId);
    };
  }
}, [
  props.showComboFlightModal,
  props.token,
  preferredDepartureTime, 
  isPageWide,
  props?.skipFetch,
  pax,
  filtersState,
]);

  useEffect(() => {
    console.log("F Resu", props?.flightResults, props?.selectedData);
    if (
      props?.flightResults?.length &&
      props?.selectedData?.resultIndex !== undefined
    ) {
      console.log("F Resu", props?.flightResults, props?.selectedData);
      const selectedIndex = props.flightResults.findIndex(
        (flight) =>
          flight?.result_index ===
          (props.selectedData?.resultIndex || props.selectedData?.result_index)
      );

      if (selectedIndex !== -1) {
        setSelectedFlightIndex(selectedIndex);
      }
    }
  }, [props.flightResults, props.selectedData]);



const updatePreferredDepartureTime = (newDateTime) => {
  setPreferredDepartureTime(newDateTime);
 
};

const handlePaxChange = (newPax) => {
  setPax(newPax);
};

const handleFiltersChange = (newFilters) => {
  setFiltersState(newFilters);

};

const _FetchFlightsHandler = async () => {
  const requestId = generateRequestId();
  console.log(`Starting request ${requestId}`);
  
 
  if (cancelTokenSourceRef.current) {
    console.log(`Cancelling existing request, starting new request ${requestId}`);
    cancelTokenSourceRef.current.cancel('Operation cancelled due to new request');
    
    await new Promise(resolve => setTimeout(resolve, 10));
    cancelTokenSourceRef.current = null;
  }
  cancelTokenSourceRef.current = axios.CancelToken.source();
  const currentCancelTokenSource = cancelTokenSourceRef.current;
 
  
  console.log("Starting flight fetch with time:", preferredDepartureTime);
  console.log("Using pax values:", pax);
  console.log("Using filters:", filtersState);

  setLoading(true);
  setIsFetching(true);
  setFlightsCount(0);
  setFlights([]);
  if (props?.setFlightResults) {
    props?.setFlightResults([]);
  }
  setUpdateBookingState(false);
  setUnauthorized(false);
  setNoResults(false);
  setFetchingIsError({
    error: false,
    errorMsg: ``,
  });

  if (props.token) {
    const requestData = {
      adult_count: pax.adults,
      child_count: pax.children,
      infant_count: pax.infants || 0,
      direct_flight: filtersState.non_stop_flights ? "true" : "false",
      journey_type: "1",
      origin: props.source_code || props.selectedBooking.origin_iata,
      destination:
        props.destination_code || props.selectedBooking.destination_iata,
      preferred_departure_time: preferredDepartureTime,
      flight_cabin_class: classType.value,
    };

    console.log("Flight search request:", requestData);

    axiosFlightSearch
      .post(
        `?${filtersState.sort_by}_order=${filtersState.order}${
          filtersState.departure_time_period
            ? "&departure_time_period=" + filtersState.departure_time_period
            : ""
        }${
          filtersState.arrival_time_period
            ? "&arrival_time_period=" + filtersState.arrival_time_period
            : ""
        }`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
          cancelToken: currentCancelTokenSource.token, 
        }
      )
      .then((res) => {
        if (currentCancelTokenSource.token.reason) {
          console.log(`Request ${requestId} was cancelled, ignoring response`);
          return;
        }

        console.log("Flight search successful");
        setLoading(false);
        setMoreLoadingState(false);
        setIsFetching(false);
      
        if (cancelTokenSourceRef.current === currentCancelTokenSource) {
          cancelTokenSourceRef.current = null;
        }

        const provider = res.data.provider;
        setProvider(provider);
        localStorage.setItem(`${provider}_trace_id`, res.data.trace_id);

        if (res.data?.results && res.data.results.length) {
          setFlights(res.data.results);
          if (props?.setFlightResults)
            props?.setFlightResults(res.data.results);
          setFlightsCount(res.data.results.length);
        } else {
          setFlights([]);
          if (props?.setFlightResults) props?.setFlightResults([]);
          setFlightsCount(0);
          setNoResults(true);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log(`Flight search request ${requestId} was cancelled`);
          return; 
        }
        
     
        if (currentCancelTokenSource.token.reason) {
          console.log(`Request ${requestId} was cancelled during error handling`);
          return;
        }
        
        console.error("Flight search error:", err);
        setLoading(false);
        setMoreLoadingState(false);
        setIsFetching(false);
        
        
        if (cancelTokenSourceRef.current === currentCancelTokenSource) {
          cancelTokenSourceRef.current = null;
        }
        
        setFlights([]);
        if (props?.setFlightResults) props?.setFlightResults([]);
        setFlightsCount(0);
        setFetchingIsError({
          error: true,
          errorMsg: `Sorry, we could not find any flights from ${
            props.source_code || props.selectedBooking?.origin_iata
          } to ${
            props.destination_code || props.selectedBooking?.destination_iata
          } for given dates at the moment. Please contact us to complete this booking`,
        });
      });
  } else {
    console.log("Missing required data for flight search");
    setLoading(false);
    setMoreLoadingState(false);
    setIsFetching(false);
    
    if (cancelTokenSourceRef.current === currentCancelTokenSource) {
      cancelTokenSourceRef.current = null;
    }
    
    setFlights([]);
    if (props?.setFlightResults) props?.setFlightResults([]);
    setFlightsCount(0);
    setFetchingIsError({
      error: true,
      errorMsg: `Sorry, we could not find any flights from ${
        props.source_code || props.selectedBooking?.origin_iata
      } to ${
        props.destination_code || props.selectedBooking?.destination_iata
      } for given dates at the moment. Please contact us to complete this booking`,
    });
  }
};

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const _newUpdateBookingHandler = ({
    booking_id,
    itinerary_id,
    result_index,
    flightProvider,
    edge,
  }) => {
    if (props.handleFlightSelect) {
      props.handleFlightSelect({
        trace_id: localStorage.getItem(`${flightProvider}_trace_id`),
        result_index: result_index,
      });
    }

    setUpdateBookingState(true);
    setUnauthorized(false);
    let updated_bookings_arr = [];

    updated_bookings_arr.push({
      trace_id: localStorage.getItem(`${flightProvider}_trace_id`),
      id: booking_id,
      user_selected: true,
      booking_type: "Flight",
      itinerary_id: itinerary_id,
      result_index: result_index,
      itinerary_type: "Tailored",
    });

    const requestData = {
      booking_id,
      trace_id: localStorage.getItem(`${flightProvider}_trace_id`),
      result_indices: [result_index],
      source_itinerary_city: isValidUUID(props?.source_itinerary_city_id) ? props?.source_itinerary_city_id : null,
      destination_itinerary_city: isValidUUID(props?.destination_itinerary_city_id) ? props?.destination_itinerary_city_id : null,
      edge: props?.edge || props?.selectedBooking?.edge,
    };

    console.log("Request Data", requestData);

    updateFlightBooking
      .post(`${itinerary_id}/bookings/flight/`, requestData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateFlightBookingHandler([res.data]);
        props.getPaymentHandler();
        setMoreLoadingState(false);
        setUpdateBookingState(false);

        const updatedTransferBookings = JSON.parse(
          JSON.stringify(transferBookings?.transferBookings)
        );
        const bookingIdToUpdate = requestData?.booking_id;

        if (props?.combo) {
          Object.keys(updatedTransferBookings).forEach((category) => {
            if (updatedTransferBookings[category]) {
              Object.keys(updatedTransferBookings[category]).forEach((key) => {
                const booking = updatedTransferBookings[category][key];

                if (!booking || Object.keys(booking).length === 0) {
                  return;
                }

                if (booking?.id === bookingIdToUpdate) {
                  updatedTransferBookings[category][key] = {
                    ...booking,
                    ...res.data,
                  };
                } else if (
                  booking?.children &&
                  Array.isArray(booking.children) &&
                  booking.children.length > 0
                ) {
                  let foundMatch = false;
                  const updatedChildren = booking.children.map(
                    (childBooking) => {
                      if (
                        childBooking &&
                        childBooking.id === bookingIdToUpdate
                      ) {
                        foundMatch = true;
                        return {
                          ...childBooking,
                          ...res.data,
                        };
                      }
                      return childBooking;
                    }
                  );

                  if (foundMatch) {
                    updatedTransferBookings[category][key] = {
                      ...booking,
                      children: updatedChildren,
                    };
                  }
                }
              });
            }
          });

          dispatch(setTransfersBookings(updatedTransferBookings));
          props?.getPaymentHandler();
        } else {
          dispatch(
            updateSingleTransferBooking(
              `${props?.source_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
              res.data
            )
          );
          props?.getPaymentHandler();
        }

        props.openNotification({
          type: "success",
          text: "Flight updated successfully.",
          heading: "Success!",
        });
        props.setHideFlightModal();
      })
      .catch((err) => {
        console.log("Error in Updating Flight", err.message);
        const errorMsg =
            err?.response?.data?.errors?.[0]?.message?.[0] || err.message || `This flight is currently not available at the moment.`;
        setUpdateBookingState(false);
        setMoreLoadingState(false);
        setUnauthorized(true);
        props.openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        });
        props.setHideFlightModal();
      });
  };

  const _loadAccommodationsHandler = () => {
    setViewMoreStatus(false);
    setMoreLoadingState(true);
    let trace_id = localStorage.getItem("tbo_trace_id");

    axiosflightsearch
      .get("/?limit=" + limit + "&offset=" + offset, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        params: {
          number_of_adults: props.selectedBooking.pax.number_of_adults,
          number_of_children: props.selectedBooking.pax.number_of_children,
          number_of_infants: props.selectedBooking.pax.number_of_infants,
          check_in: props.selectedBooking.check_in,
          city_code: props.selectedBooking.origin_iata,
          destination_city_code: props.selectedBooking.destination_iata,
          flight_cabin_class: "1",
          trace_id: trace_id,
        },
      })
      .then((res) => {
        setMoreLoadingState(false);
        localStorage.setItem("tbo_trace_id", res.data.TraceId);
        if (res.data.search && res.data.search.airline_names) {
          setFlightsCount(res.data.data);
        }

        if (res.data?.Results.length) {
          setFlights((prevFlights) => [...prevFlights, ...res.data.Results]);
          if (props?.setFlightResults)
            props?.setFlightResults((prevFlights) => [
              ...prevFlights,
              ...res.data.Results,
            ]);
          setFlightsCount((prev) => prev + res.data.Results.length);
        }

        if (res.data.next_page) {
          setViewMoreStatus(true);
          setOffset(offset + 20);
        } else {
          setViewMoreStatus(false);
          setOffset(0);
        }
      })
      .catch((err) => {
        setMoreLoadingState(false);
      });
  };

  const handleTransferEdit = (e) => {
    setShowTransferEditDrawer(true);
  };

  const renderFlightContent = () => {
    if (updateBookingState) {
      return (
        <div
          style={{
            width: "max-content",
            margin: "auto",
            height: isPageWide ? "80vh" : "40vh",
          }}
          className="center-div font-lexend"
        >
          <LoadingLottie height={"5rem"} width={"5rem"} margin="none" />
          Please wait while we update your flight
        </div>
      );
    }

    if (isFetchingError.error) {
      return (
        <div className="flex flex-row items-center justify-center h-[80vh] text-center font-lexend">
          {isFetchingError.errorMsg}
        </div>
      );
    }

    if (noResults) {
      return (
        <p className="font-lexend text-center h-[80vh] flex items-center justify-center">
          Oops, we couldn't find what you were searching!
        </p>
      );
    }

    if (unauthorized) {
      return (
        <div
          style={{
            width: "100%",
            margin: "auto",
            height: isPageWide ? "80vh" : "40vh",
          }}
          className="center-div text-center"
        >
          Oops, this action is not allowed on another user's itinerary
        </div>
      );
    }

    if (loading) {
      return <Skeleton />;
    }

    return (
      <OptionsContainer id="options">
        <div style={{ clear: "right" }}>
          {flights.map((flight, index) => (
            <Flight
              key={index}
              itinerary_id={props.itinerary_id}
              data={flight}
              pax={pax}
              selectedBooking={props.selectedBooking}
              _updateBookingHandler={_newUpdateBookingHandler}
              individual={props?.individual}
              originCityId={props?.source_itinerary_city_id}
              provider={flightProvider}
              destinationCityId={props?.destination_itinerary_city_id}
              edge={props?.edge || props?.selectedBooking?.edge}
              setTransferBookingsIntercity={props.setTransferBookingsIntercity}
              onSelect={props.onSelect}
              isSelected={selectedFlightIndex === index}
              onFlightSelect={() => setSelectedFlightIndex(index)}
              getPaymentHandler={props.getPaymentHandler}
              combo={props?.combo}
              booking_id={props?.booking_id}
            />
          ))}

          {moreLoadingState && <Skeleton />}

          {viewMoreStatus && !updateBookingState && flights.length > 0 && (
            <Button
              boxShadow
              onclickparam={null}
              onclick={_loadAccommodationsHandler}
              margin="0.25rem auto"
              borderWidth="1px"
              borderRadius="2rem"
              padding="0.25rem 1rem"
            >
              View More
            </Button>
          )}
        </div>
      </OptionsContainer>
    );
  };

  if (props.token)
    return (
      <div className="w-full">
        <ToastContainer />

        <ComboSection
          _FetchFlightsHandler={_FetchFlightsHandler}
          setHideBookingModal={props.setHideBookingModal}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          filtersState={filtersState}
          setFiltersState={setFiltersState}
          flightCount={flightCount}
          setHideFlightModal={props.setHideFlightModal}
          text={props.selectedBooking?.name}
          selectedBooking={props.selectedBooking}
          pax={pax}
          setPax={handlePaxChange} // Using our new pax handler
          classType={classType}
          setClassType={setClassType}
          handleTransferEdit={handleTransferEdit}
          mercuryTransfer={props?.mercuryTransfer}
          preferred_departure_time={`${preferredDepartureTime}`}
          updatePreferredDepartureTime={updatePreferredDepartureTime}
          handleFiltersChange={handleFiltersChange}
        />

        <GridContainer style={{ clear: "right" }}>
          <ContentContainer style={{ position: "relative" }}>
            {updateLoadingState && !updateBookingState ? (
              <div
                className="center-div"
                style={{ width: "max-content", margin: "auto" }}
              >
                <LoadingLottie height={"5rem"} width={"5rem"} margin="none" />
                Fetching best fares
              </div>
            ) : (
              renderFlightContent()
            )}
          </ContentContainer>
        </GridContainer>

        <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={showTransferEditDrawer}
          setShowDrawer={setShowTransferEditDrawer}
          selectedTransferHeading={props.selectedTransferHeading}
          origin={props.selectedBooking?.city}
          destination={props.selectedBooking?.destination_city}
          day_slab_index={props.daySlabIndex}
          element_index={props.elementIndex}
          fetchData={props?.fetchData}
          setShowLoginModal={props?.setShowLoginModal}
          check_in={props?.check_in}
          _GetInTouch={props._GetInTouch}
          routeId={props.routeId}
          selectedBooking={props.selectedBooking}
          mercuryTransfer={props?.mercuryTransfer}
          mercury={true}
          booking_id={props?.booking_id}
        />
      </div>
    );

  return (
    <LogInModal show={true} onhide={props.setHideFlightModal}></LogInModal>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ComboFlight);
