import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import media from "../../media";
import {
  updateFlightBooking,
  updateFlightBookingWarning,
} from "../../../services/bookings/UpdateBookings";
import { connect, useDispatch, useSelector } from "react-redux";
import axiosflightsearch, {
  axiosFlightHubSearch,
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
import { FaExchangeAlt, FaFilter } from "react-icons/fa";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import LogInModal from "../Login";
import { toast, ToastContainer } from "react-toastify";
import {
  setTransfersBookings,
  updateSingleTransferBooking,
} from "../../../store/actions/transferBookingsStore";
import ComboSection from "./ComboSectionOne";
import dayjs from "dayjs";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import Generalbutton from "../../ui/button/Generallinkbutton";
import { FiCheckCircle, FiMapPin, FiNavigation } from "react-icons/fi";
import { FaX } from "react-icons/fa6";
import ReactDOM from "react-dom";
import { useGenericAPIModal } from "../warning/Index";
import { PiAirplaneLanding, PiAirplaneTakeoff } from "react-icons/pi";
import FlightFilters from "./new-flight-searched/FlightFilters";
import { useAnalytics } from "../../../hooks/useAnalytics";

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

const BottomSheet = styled.div`
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
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
    width: 100%;
    // margin: auto;
  }
`;

const ComboFlight = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const dispatch = useDispatch();
  const transferBookings = useSelector((state) => state.TransferBookings);
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState({
    order: "asc",
    non_stop_flights: false,
    stops: [],
    departure_time_period: "",
    arrival_time_period: "",
    airline_name: "",
    sort_by: "price",
  });
  const { number_of_adults, number_of_children, number_of_infants } =
    useSelector((state) => state.Itinerary);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);
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
    props?.flightResults ? props?.flightResults?.length : 0,
  );
  const [previousAirlineFilter, setPreviousAirlineFilter] = useState(null);
  const currency = useSelector((state) => state.currency);

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
    props?.flightResults ? props?.flightResults : [],
  );
  const [airlineCodes, setAirlineCodes] = useState([]);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);
  const [flightProvider, setProvider] = useState(null);
  const [preferredDepartureTime, setPreferredDepartureTime] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [timeUpdated, setTimeUpdated] = useState(false);
  const [propsReady, setPropsReady] = useState(false);
  const [dateTimeInitialized, setDateTimeInitialized] = useState(false);
  const [paxChanged, setPaxChanged] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const abortControllerRef = useRef(null);
  const cancelTokenSourceRef = useRef(null);

  const [currentRequestId, setCurrentRequestId] = useState(0);
  const { trackTransferBookingChange, trackTransferBookingAdd } =
    useAnalytics();
  const { intercity } = useSelector(
    (state) => state.TransferBookings,
  )?.transferBookings;

  //for flight search
  const [sourceInput, setSourceInput] = useState({
    id: props?.transferData?.source?.id || "",
    city_name: props?.transferData?.source?.city_name || "",
    code: props?.transferData?.source?.code || "",
  });
  const [destinationInput, setDestinationInput] = useState({
    id: props?.transferData?.destination?.id || "",
    city_name: props?.transferData?.destination?.city_name || "",
    code: props?.transferData?.destination?.code || "",
  });
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const sourceInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [sourceError, setSourceError] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const [isSourceFocused, setIsSourceFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  const [traceId, setTraceId] = useState(null);
  const [traceIdTimestamp, setTraceIdTimestamp] = useState(null);
  const [remainingTime, setRemainingTime] = useState(900);

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [isProcessingWarning, setIsProcessingWarning] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [isTimeOnlyChange, setIsTimeOnlyChange] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [isFilterChangesApplied, setIsFilterChangesApplied] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedFareInFlight, setSelectedFareInFlight] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const isTraceIdValid = () => {
    if (!traceId || !traceIdTimestamp) return false;

    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - traceIdTimestamp) / 1000;

    return elapsedSeconds < remainingTime;
  };

  const generateRequestId = () => {
    const newId = currentRequestId + 1;
    setCurrentRequestId(newId);
    return newId;
  };

  const cancelCurrentRequest = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Request cancelled by user");
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
    // When user logs in (token becomes available) and we have the required data
    if (
      props.token &&
      preferredDepartureTime &&
      !loading &&
      !isFetching &&
      (sourceInput.code ||
        props.source_code ||
        props.selectedBooking?.origin_iata) &&
      (destinationInput.code ||
        props.destination_code ||
        props.selectedBooking?.destination_iata)
    ) {
      if (!flights || flights.length === 0) {
        const timeoutId = setTimeout(() => {
          _FetchFlightsHandler();
        }, 300);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [props.token]);

  useEffect(() => {
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
            props?.comboStartTime,
          );
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
        } catch (error) {
          console.error("Error with check_in:", error);
          return;
        }
      } else {
        return;
      }

      if (!baseTime.isValid()) {
        console.error("Date not valid");
        return;
      }

      const roundedTime = roundToNext30Min(baseTime);
      if (roundedTime) {
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

  const handleCancel = () => {
    setSelectedFlightIndex(null);

    setUpdateBookingState(false);
    setUpdateLoadingState(false);

    if (setPendingBookingData) {
      setPendingBookingData(null);
    }
  };

  useEffect(() => {
    if (!preferredDepartureTime) return;

    const shouldFetchFlights =
      (props.showComboFlightModal && props.token && preferredDepartureTime) ||
      !props?.skipFetch;

    // Only fetch on initial load
    if (shouldFetchFlights && !isFilterDrawerOpen && isInitialLoad) {
      const timeoutId = setTimeout(() => {
        _FetchFlightsHandler();
        setTimeUpdated(false);
        setIsInitialLoad(false);
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
    isFilterDrawerOpen,
    isInitialLoad,
  ]);

  // Add this new useEffect after the initial load useEffect
  useEffect(() => {
    // Skip if initial load hasn't completed yet
    if (isInitialLoad || !preferredDepartureTime) return;

    // Only fetch if drawer is closed (to avoid fetch while drawer is opening/closing)
    if (preferredDepartureTime) {
      const timeoutId = setTimeout(() => {
        _FetchFlightsHandler();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [preferredDepartureTime, pax, filtersState, isInitialLoad]);

  // Replace your existing useEffect that handles selectedFlightIndex with this enhanced version:

  useEffect(() => {
    if (
      Array.isArray(props?.flightResults) &&
      props?.flightResults?.length &&
      props?.selectedData?.resultIndex !== undefined
    ) {
      const selectedIndex = props.flightResults.findIndex(
        (flight) =>
          flight?.result_index ===
          (props.selectedData?.resultIndex || props.selectedData?.result_index),
      );

      if (selectedIndex !== -1) {
        setSelectedFlightIndex(selectedIndex);
      }
    } else {
      // Always reset when no selectedData
      setSelectedFlightIndex(null);
    }
  }, [props.flightResults, props.selectedData]);

  // useEffect(() => {
  //   if (
  //     props?.flightResults?.length &&
  //     props?.selectedData?.resultIndex !== undefined
  //   ) {
  //     const selectedIndex = props.flightResults.findIndex(
  //       (flight) =>
  //         flight?.result_index ===
  //         (props.selectedData?.resultIndex || props.selectedData?.result_index)
  //     );

  //     if (selectedIndex !== -1) {
  //       setSelectedFlightIndex(selectedIndex);
  //     }
  //   } else {
  //     if (
  //       props?.combo &&
  //       (!props.selectedData || !props.isSelected) &&
  //       selectedFlightIndex !== null
  //     ) {
  //       console.log(
  //         "Resetting flight selection - parent deselected or no selected data"
  //       );
  //       setSelectedFlightIndex(null);
  //     }
  //   }
  // }, [
  //   props.flightResults,
  //   props.selectedData,
  //   props.isSelected,
  //   selectedFlightIndex,
  // ]);

  const updatePreferredDepartureTime = (newDateTime) => {
    setPreferredDepartureTime(newDateTime);
  };

  const handlePaxChange = (newPax) => {
    setPax(newPax);
  };

  const handleFiltersChange = (newFilters) => {
    setFiltersState(newFilters);
  };

  const handleViewMore = async () => {
    if (!nextUrl) return;

    setMoreLoadingState(true);

    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel(
        "Operation cancelled due to new request",
      );
    }
    cancelTokenSourceRef.current = axios.CancelToken.source();
    const currentCancelTokenSource = cancelTokenSourceRef.current;

    try {
      // Extract offset from nextUrl
      const urlParams = new URLSearchParams(nextUrl.split("?")[1]);
      const newOffset = parseInt(urlParams.get("offset")) || 0;
      const newLimit = parseInt(urlParams.get("limit")) || limit;

      // Prepare request data with current filters
      const requestData = {
        adult_count: pax.adults,
        child_count: pax.children,
        infant_count: pax.infants || 0,
        direct_flight: filtersState.non_stop_flights ? "true" : "false",
        journey_type: "1",
        origin:
          sourceInput.code ||
          props.source_code ||
          props.selectedBooking.origin_iata,
        destination:
          destinationInput.code ||
          props.destination_code ||
          props.selectedBooking.destination_iata,
        preferred_departure_time: preferredDepartureTime,
        flight_cabin_class: classType.value,
        // departure_time_period: filtersState.departure_time_period || "",
        // arrival_time_period: filtersState.arrival_time_period || "",
        // sort_by: filtersState.sort_by || "price",
        // order: filtersState.order || "asc",
        trace_id: traceId,
        ...(filtersState?.airlines &&
          isTraceIdValid() && { trace_id: traceId }),
      };

      // Build URL with pagination and airline filter
      let url = `?currency=${currency?.currency || "INR"}&limit=${newLimit}&offset=${newOffset}`;
      if (filtersState?.airlines) {
        url += `&airlines=${encodeURIComponent(filtersState.airlines)}`;
      }

      const response = await axiosFlightSearch.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
        cancelToken: currentCancelTokenSource.token,
      });

      if (currentCancelTokenSource.token.reason) {
        return;
      }

      setFlights((prevFlights) => [
        ...prevFlights,
        ...(response.data.results || []),
      ]);
      setNextUrl(response.data.next || null);
      setPreviousUrl(response.data.previous || null);
      setFlightsCount(
        (prevCount) => prevCount + (response.data.results?.length || 0),
      );
      setOffset(newOffset);

      if (props?.setFlightResults) {
        props.setFlightResults((prevFlights) => {
          return [
            ...(Array.isArray(prevFlights) ? prevFlights : []),
            ...(response.data.results || []),
          ];
        });
      }

      if (response.data.trace_id) {
        setTraceId(response.data.trace_id);
        setTraceIdTimestamp(Date.now());
        setRemainingTime(response.data.remaining_time || 900);
        localStorage.setItem(
          `${response.data.provider}_trace_id`,
          response.data.trace_id,
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      console.error("Error loading more flights:", error);
      setFetchingIsError({
        error: true,
        errorMsg: "Failed to load more flights. Please try again.",
      });
    } finally {
      setMoreLoadingState(false);

      if (cancelTokenSourceRef.current === currentCancelTokenSource) {
        cancelTokenSourceRef.current = null;
      }
    }
  };

  const _FetchFlightsHandler = async () => {
    const requestId = generateRequestId();

    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel(
        "Operation cancelled due to new request",
      );

      await new Promise((resolve) => setTimeout(resolve, 10));
      cancelTokenSourceRef.current = null;
    }
    cancelTokenSourceRef.current = axios.CancelToken.source();
    const currentCancelTokenSource = cancelTokenSourceRef.current;

    setLoading(true);
    setIsTimeOnlyChange(false);
    setIsFetching(true);
    setFlightsCount(0);
    setNextUrl(null);
    setPreviousUrl(null);
    setOffset(0);
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
      const hasAirlineFilterChanged =
        filtersState?.airlines !== previousAirlineFilter;
      const shouldSendTraceId =
        (filtersState?.airlines &&
          hasAirlineFilterChanged &&
          isTraceIdValid()) ||
        (isTimeOnlyChange && isTraceIdValid());

      const requestData = {
        adult_count: pax.adults,
        child_count: pax.children,
        infant_count: pax.infants || 0,
        direct_flight: filtersState?.stops.includes("non_stop")
          ? "true"
          : "false",
        journey_type: "1",
        origin:
          sourceInput.code ||
          props.source_code ||
          props.selectedBooking.origin_iata,
        destination:
          destinationInput.code ||
          props.destination_code ||
          props.selectedBooking.destination_iata,
        preferred_departure_time: preferredDepartureTime,
        flight_cabin_class: classType.value,
        // Add these filter parameters
        ...(filtersState.trip_type && { trip_type: filtersState.trip_type }),
        // ...(filtersState.stops &&
        //   filtersState.stops.length > 0 && {
        //     stops: filtersState.stops.join(","),
        //   }),
        // ...(filtersState.departure_time && { departure_time: filtersState.departure_time }),
        ...(filtersState.fare_type != null && {
          fare_type: filtersState.fare_type,
        }),
        ...(shouldSendTraceId && { trace_id: traceId }),
      };

      const selectedAirlines = filtersState?.airlines;
      let curr = null;
      const url = selectedAirlines
        ? `?currency=${currency?.currency || "INR"}&airlines=${encodeURIComponent(
            selectedAirlines,
          )}&limit=${limit}&offset=0`
        : `?currency=${currency?.currency || "INR"}&limit=${limit}&offset=0`;

      axiosFlightSearch
        .post(url, requestData, {
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
          cancelToken: currentCancelTokenSource.token,
        })
        .then((res) => {
          if (currentCancelTokenSource.token.reason) {
            return;
          }

          setLoading(false);
          setMoreLoadingState(false);
          setIsFetching(false);
          setIsTimeOnlyChange(false);

          if (cancelTokenSourceRef.current === currentCancelTokenSource) {
            cancelTokenSourceRef.current = null;
          }

          const provider = res.data.provider;
          setProvider(provider);
          localStorage.setItem(`${provider}_trace_id`, res.data.trace_id);

          if (res.data.trace_id) {
            setTraceId(res.data.trace_id);
            setTraceIdTimestamp(Date.now());
            setRemainingTime(res.data.remaining_time || 900);
          }

          if (res.data?.results && res.data.results.length) {
            setFlights(res.data.results);
            setNextUrl(res.data.next || null);
            setPreviousUrl(res.data.previous || null);
            if (!hasFetchedOnce) {
              setAirlineCodes(res.data.airlines);
              setHasFetchedOnce(true);
            }
            setAirlineCodes(res.data.airlines);
            setPreviousAirlineFilter(filtersState?.airlines);
            if (props?.setFlightResults)
              props?.setFlightResults(res.data.results);
            setFlightsCount(res.data.results.length);
          } else {
            setFlights([]);
            setNextUrl(null);
            setPreviousUrl(null);
            if (props?.setFlightResults) props?.setFlightResults([]);
            setFlightsCount(0);
            setNoResults(true);
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            return;
          }

          if (currentCancelTokenSource.token.reason) {
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
              sourceInput.code ||
              props.source_code ||
              props.selectedBooking?.origin_iata
            } to ${
              destinationInput.code ||
              props.destination_code ||
              props.selectedBooking?.destination_iata
            } for given dates at the moment. Please contact us to complete this booking`,
          });

          props.openNotification({
            type: "error",
            text: err?.response?.data?.errors?.[0]?.message?.[0] || err.message,
            heading: "Error!",
          });
        });
    } else {
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

  const _newUpdateBookingHandler = async ({
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

    const requestData = {
      booking_id,
      trace_id: traceId || localStorage.getItem(`${flightProvider}_trace_id`),
      result_indices: [result_index],
      source_itinerary_city: props?.source_itinerary_city_id,
      destination_itinerary_city: props?.destination_itinerary_city_id,
      edge: props?.edge || props?.selectedBooking?.edge,
    };

    setIsProcessingWarning(true);

    try {
      const warningResponse = await updateFlightBookingWarning.post(
        `${itinerary_id}/transfers/flight/warning/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      );

      if (warningResponse?.data?.show_warning === true) {
        setWarningMessage(
          warningResponse.data.warning || "Please confirm this action.",
        );
        setPendingBookingData({
          booking_id,
          itinerary_id,
          result_index,
          flightProvider,
          edge,
          requestData,
        });
        setShowWarningModal(true);
        setIsProcessingWarning(false);
      } else {
        setIsProcessingWarning(false);
        await handleBookingConfirm(requestData, itinerary_id);
      }
    } catch (error) {
      setIsProcessingWarning(false);

      // CLEAR SELECTION ON ERROR
      setSelectedFlight(null);
      setSelectedFareInFlight(null);

      console.error("Warning API failed:", error);

      let errorMsg = "Warning check failed. Please try again.";
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMsg = error.response.data.errors[0].message?.[0];
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      props.openNotification({
        type: "error",
        text: errorMsg,
        heading: "Error!",
      });
    }
  };

  const handleBookingConfirm = async (requestData, itinerary_id) => {
    setIsProcessingBooking(true);
    setUpdateBookingState(true);

    try {
      const response = await updateFlightBooking.post(
        `${itinerary_id}/bookings/flight/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      );

      // Success handling
      props._updateFlightBookingHandler([response.data]);

      props.getPaymentHandler();
      setMoreLoadingState(false);
      setUpdateBookingState(false);
      setIsProcessingBooking(false);

      const updatedTransferBookings = JSON.parse(
        JSON.stringify(transferBookings?.transferBookings),
      );
      const bookingIdToUpdate = requestData?.booking_id;

      if (props?.combo) {
        Object.keys(updatedTransferBookings).forEach((category) => {
          if (updatedTransferBookings[category]) {
            Object.keys(updatedTransferBookings[category]).forEach((key) => {
              const booking = updatedTransferBookings[category][key];
              if (!booking || Object.keys(booking).length === 0) return;

              if (booking?.id === bookingIdToUpdate) {
                updatedTransferBookings[category][key] = {
                  ...booking,
                  ...response.data,
                };
              } else if (
                booking?.children &&
                Array.isArray(booking.children) &&
                booking.children.length > 0
              ) {
                let foundMatch = false;
                const updatedChildren = booking.children.map((childBooking) => {
                  if (childBooking && childBooking.id === bookingIdToUpdate) {
                    foundMatch = true;
                    return { ...childBooking, ...response.data };
                  }
                  return childBooking;
                });

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

        if (response?.data?.is_refresh_needed) {
          const url = new URL(window.location);
          const drawerParams = [
            "drawer",
            "booking_id",
            "flight_modal",
            "modal",
            "edit",
          ];
          drawerParams.forEach((param) => {
            url.searchParams.delete(param);
          });

          window.history.replaceState({}, "", url.toString());

          setTimeout(() => {
            window.location.reload();
          }, 200);
        }
      } else {
        dispatch(
          updateSingleTransferBooking(
            `${props?.source_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
            response.data,
          ),
        );
        trackTransferBookingAdd(
          itinerary_id,
          `${props?.source_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
          intercity?.[
            `${props?.source_itinerary_city_id}:${props?.destination_itinerary_city_id}`
          ],
          response.data,
          sourceInput?.city_name,
          destinationInput?.city_name,
        );
        props?.getPaymentHandler();

        if (response?.data?.is_refresh_needed) {
          const url = new URL(window.location);
          const drawerParams = [
            "drawer",
            "booking_id",
            "flight_modal",
            "modal",
            "edit",
          ];
          drawerParams.forEach((param) => {
            url.searchParams.delete(param);
          });

          window.history.replaceState({}, "", url.toString());
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }
      }

      props.openNotification({
        type: "success",
        text: "Flight updated successfully.",
        heading: "Success!",
      });
      props.setHideFlightModal();
    } catch (error) {
      setIsProcessingBooking(false);
      setUpdateBookingState(false);

      // CLEAR SELECTION ON ERROR
      setSelectedFlight(null);
      setSelectedFareInFlight(null);

      console.error("Booking API failed:", error);

      let errorMsg = "Booking failed. Please try again.";
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMsg = error.response.data.errors[0].message?.[0];
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      props.openNotification({
        type: "error",
        text: errorMsg,
        heading: "Error!",
      });
    }
  };

  // ============================================
  // PART 4: Update handleWarningCancel function
  // ============================================

  const handleTransferEdit = (e) => {
    setShowTransferEditDrawer(true);
  };

  const searchHubsAirports = useCallback(async (query, type) => {
    if (!query || query.length < 2) {
      const setSuggestions =
        type === "source" ? setSourceSuggestions : setDestinationSuggestions;
      setSuggestions([]);
      return;
    }

    const setLoading =
      type === "source" ? setSourceLoading : setDestinationLoading;
    const setSuggestions =
      type === "source" ? setSourceSuggestions : setDestinationSuggestions;

    setLoading(true);

    try {
      const response = await axiosFlightHubSearch.get(
        `/?q=${encodeURIComponent(query)}`,
      );
      setSuggestions(response.data.results || []);
    } catch (error) {
      console.error("Error searching hubs/airports:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  // Add this debounce function before the component or import it from lodash
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleSourceInputChange = useCallback(
    (value) => {
      setSourceInput((prev) => ({
        ...prev,
        city_name: value,
        ...(value !== prev.city_name && prev.code && { code: "", id: "" }),
      }));

      if (sourceError) {
        setSourceError("");
      }

      if (value.length >= 1) {
        setShowSourceSuggestions(true);
        searchHubsAirports(value, "source");
      } else {
        setShowSourceSuggestions(false);
        setSourceSuggestions([]);
      }
    },
    [sourceError, searchHubsAirports],
  );

  const handleDestinationInputChange = useCallback(
    (value) => {
      setDestinationInput((prev) => ({
        ...prev,
        city_name: value,
        ...(value !== prev.city_name && prev.code && { code: "", id: "" }),
      }));

      if (destinationError) {
        setDestinationError("");
      }

      if (value.length >= 2) {
        setShowDestinationSuggestions(true);
        searchHubsAirports(value, "destination");
      } else {
        setShowDestinationSuggestions(false);
        setDestinationSuggestions([]);
      }
    },
    [destinationError, searchHubsAirports],
  );

  const handleSourceSelect = useCallback((suggestion) => {
    setSourceInput({
      id: suggestion.id,
      city_name: suggestion.city_name,
      code: suggestion.code,
    });
    setShowSourceSuggestions(false);
    setSourceSuggestions([]);
    setSourceError("");
    setIsManualSelection(true); // Add this
  }, []);

  const handleDestinationSelect = useCallback((suggestion) => {
    setDestinationInput({
      id: suggestion.id,
      city_name: suggestion.city_name,
      code: suggestion.code,
    });
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);
    setDestinationError("");
    setIsManualSelection(true); // Add this
  }, []);

  // Add validation function
  const validateInputs = () => {
    let isValid = true;

    if (!sourceInput.code) {
      setSourceError("Please select a source airport");
      isValid = false;
    }

    if (!destinationInput.code) {
      setDestinationError("Please select a destination airport");
      isValid = false;
    }

    return isValid;
  };

  useEffect(() => {
    const bothAirportsSelected = sourceInput.code && destinationInput.code;

    // Only fetch if user manually changed airports after initial load
    if (
      bothAirportsSelected &&
      !loading &&
      !isInitialLoad &&
      isManualSelection
    ) {
      const timeoutId = setTimeout(() => {
        _FetchFlightsHandler();
        setIsManualSelection(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [
    sourceInput.code,
    destinationInput.code,
    isInitialLoad,
    isManualSelection,
    loading,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sourceContainer = sourceInputRef.current?.closest(".relative");
      const destinationContainer =
        destinationInputRef.current?.closest(".relative");

      if (sourceContainer && !sourceContainer.contains(event.target)) {
        setShowSourceSuggestions(false);
      }
      if (
        destinationContainer &&
        !destinationContainer.contains(event.target)
      ) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleWarningConfirm = async () => {
    if (pendingBookingData && !isProcessingBooking) {
      setShowWarningModal(false);
      await handleBookingConfirm(
        pendingBookingData.requestData,
        pendingBookingData.itinerary_id,
      );
      setPendingBookingData(null);
    }
  };

  const handleWarningCancel = () => {
    setShowWarningModal(false);
    setWarningMessage("");
    setPendingBookingData(null);
    setSelectedFlightIndex(null);
    setUpdateBookingState(false);
    setIsProcessingWarning(false);
    setIsProcessingBooking(false);

    // CLEAR FARE SELECTION
    setSelectedFlight(null);
    setSelectedFareInFlight(null);
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
          className="center-div "
        >
          <LoadingLottie height={"5rem"} width={"5rem"} margin="none" />
          Please wait while we update your flight
        </div>
      );
    }

    if (isFetchingError.error) {
      return (
        <div className="flex flex-row items-center justify-center h-[80vh] text-center ">
          {isFetchingError.errorMsg}
        </div>
      );
    }

    if (noResults) {
      return (
        <p className=" text-center h-[80vh] flex items-center justify-center">
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
              trace_id={
                traceId || localStorage.getItem(`${flightProvider}_trace_id`)
              }
              loading={loading}
              // NEW PROPS FOR FARE SELECTION
              selectedFlight={selectedFlight}
              setSelectedFlight={setSelectedFlight}
              selectedFareInFlight={selectedFareInFlight}
              setSelectedFareInFlight={setSelectedFareInFlight}
              flightIndex={index}
            />
          ))}

          {moreLoadingState && <Skeleton />}

          {/* {viewMoreStatus && !updateBookingState && flights.length > 0 && (
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
          )} */}
          {!updateBookingState && flights.length > 0 && nextUrl && (
            <Button
              boxShadow
              onclickparam={null}
              onclick={handleViewMore}
              margin="0.25rem auto"
              borderWidth="1px"
              borderRadius="2rem"
              padding="0.25rem 1rem"
              disabled={moreLoadingState}
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
        <div className="text-xl font-600 leading-2xl mb-md">
          {" "}
          {props.heading}
        </div>

        {showWarningModal &&
          ReactDOM.createPortal(
            <div className="fixed z-[1666] inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center">
              <div className="bg-white w-full max-w-lg md:mx-4 mb-0 md:mb-auto md:rounded-lg rounded-t-2xl md:rounded-b-lg relative transform transition-transform duration-300 ease-out animate-slide-up md:animate-none max-h-[90vh] md:max-h-none overflow-hidden">
                <div className="md:hidden flex justify-center py-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {!isProcessingBooking && (
                  <button
                    onClick={handleWarningCancel}
                    className="absolute top-4 right-4 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                  >
                    <FaX size={16} />
                  </button>
                )}

                <div className="px-6 pb-6 pt-2 md:pt-6 max-h-[calc(90vh-8rem)] md:max-h-none overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-1 pr-8">
                    Dates Change Warning!
                  </h2>

                  <div className="text-gray-700 mb-6">
                    <div className="rounded-lg p-2">{warningMessage}</div>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 justify-end border-t-2 pt-4">
                    <button
                      onClick={handleWarningCancel}
                      disabled={isProcessingBooking}
                      className="w-full md:w-auto px-6 py-2 md:py-2 text-gray-600 border rounded hover:bg-gray-50 transition-colors cursor-pointer text-center disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isProcessingBooking}
                      onClick={handleWarningConfirm}
                      className="w-full md:w-auto px-6 py-2 md:py-2 bg-[#07213A] text-white rounded hover:bg-[#0a2942] transition-colors cursor-pointer text-center disabled:opacity-50"
                    >
                      {isProcessingBooking ? "Processing..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )}

        <SearchSection
          sourceInput={sourceInput}
          destinationInput={destinationInput}
          handleSourceInputChange={handleSourceInputChange}
          handleDestinationInputChange={handleDestinationInputChange}
          setDestinationInput={setDestinationInput}
          setSourceInput={setSourceInput}
          handleSourceSelect={handleSourceSelect}
          handleDestinationSelect={handleDestinationSelect}
          showSourceSuggestions={showSourceSuggestions}
          showDestinationSuggestions={showDestinationSuggestions}
          sourceSuggestions={sourceSuggestions}
          destinationSuggestions={destinationSuggestions}
          sourceError={sourceError}
          destinationError={destinationError}
          sourceInputRef={sourceInputRef}
          destinationInputRef={destinationInputRef}
          loading={loading}
          validateInputs={validateInputs}
          setShowSourceSuggestions={setShowSourceSuggestions}
          setShowDestinationSuggestions={setShowDestinationSuggestions}
          _FetchFlightsHandler={_FetchFlightsHandler}
          setIsManualSelection={setIsManualSelection}
        />
        <ComboSection
          _FetchFlightsHandler={_FetchFlightsHandler}
          setHideBookingModal={props.setHideBookingModal}
          showFilter={showFilter}
          setShowFilter={(value) => {
            setShowFilter(value);
            setIsFilterDrawerOpen(value);
          }}
          filtersState={filtersState}
          flights={flights}
          airlineCodes={airlineCodes}
          setAirlineCodes={setAirlineCodes}
          setFiltersState={setFiltersState}
          flightCount={flightCount}
          selectedAirlines={selectedAirlines}
          setSelectedAirlines={setSelectedAirlines}
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
          setIsTimeOnlyChange={setIsTimeOnlyChange}
        />
        {flightCount ? (
          <div className="text-[14px] text-gray-400 px-2 py-3">
            Showing {flightCount} flights
          </div>
        ) : null}

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
          origin={props.selectedBooking?.city}
          destination={props.selectedBooking?.destination_city}
          day_slab_index={props.daySlabIndex}
          element_index={props.elementIndex}
          setShowLoginModal={props?.setShowLoginModal}
          check_in={props?.check_in}
          _GetInTouch={props._GetInTouch}
          routeId={props.routeId}
          selectedBooking={props.selectedBooking}
          mercuryTransfer={props?.mercuryTransfer}
          mercury={true}
          booking_id={props?.booking_id}
        />

        {showFilter && (
          <FlightFilters
            showFilter={showFilter}
            loading={loading}
            setShowFilter={(value) => {
              setShowFilter(value);
              setIsFilterDrawerOpen(value);
            }}
            filters={{
              ...filtersState,
              preferred_departure_time: preferredDepartureTime,
            }}
            setFiltersState={setFiltersState}
            handleFiltersChange={handleFiltersChange}
            airlineCodes={airlineCodes}
            selectedAirlines={selectedAirlines}
            setSelectedAirlines={setSelectedAirlines}
            isFilterChangesApplied={isFilterChangesApplied}
            setIsFilterChangesApplied={setIsFilterChangesApplied}
            setPreferredDepartureTime={setPreferredDepartureTime}
            setIsTimeOnlyChange={setIsTimeOnlyChange}
          />
        )}
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

const SearchSection = ({
  sourceInput,
  destinationInput,
  handleSourceInputChange,
  handleDestinationInputChange,
  handleSourceSelect,
  handleDestinationSelect,
  showSourceSuggestions,
  showDestinationSuggestions,
  sourceSuggestions,
  destinationSuggestions,
  sourceError,
  destinationError,
  sourceInputRef,
  destinationInputRef,
  loading,
  validateInputs,
  setShowSourceSuggestions,
  setShowDestinationSuggestions,
  _FetchFlightsHandler,
  setDestinationInput,
  setSourceInput,
  setIsManualSelection,
}) => {
  const handleLocationChange = async () => {
    const tempSource = sourceInput;
    const tempDestination = destinationInput;

    setDestinationInput(tempSource);
    setSourceInput(tempDestination);

    setIsManualSelection(true);
  };

  return (
    <div className="w-full mb-2">
      {/* Desktop Layout */}
      <div className="max-ph:hidden md:flex items-center gap-4 mb-0 ">
        {/* Source Input */}
        <div className="relative flex-1">
          <div className="relative">
            <PiAirplaneTakeoff
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              ref={sourceInputRef}
              type="text"
              value={`${sourceInput.city_name || ""}${
                sourceInput.code ? ` (${sourceInput.code})` : ""
              }`}
              onChange={(e) => {
                handleSourceInputChange(e.target.value);
                setShowSourceSuggestions(true);
              }}
              placeholder="Select source airport"
              className={`w-full pl-10 pr-4 py-[0.6rem] bg-[#F9F9F9] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-[#212529] font-normal ${
                sourceError ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {sourceError && (
            <div className="absolute top-full left-0 text-red-500 text-xs mt-1 whitespace-nowrap z-30">
              {sourceError}
            </div>
          )}
          {showSourceSuggestions && sourceSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {sourceSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSourceSelect(suggestion)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-sm text-gray-900">{suggestion.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Icon */}
        <div className="flex-shrink-0">
          <button
            onClick={handleLocationChange}
            className="w-9 h-9 flex items-center justify-center bg-[#F7E700] rounded-lg hover:bg-[#e6d600] transition-colors"
          >
            <FaExchangeAlt className="text-gray-700" size={15} />
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative flex-1">
          <div className="relative">
            <PiAirplaneLanding
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              ref={destinationInputRef}
              type="text"
              value={`${destinationInput.city_name || ""}${
                destinationInput.code ? ` (${destinationInput.code})` : ""
              }`}
              onChange={(e) => {
                handleDestinationInputChange(e.target.value);
                setShowDestinationSuggestions(true);
              }}
              placeholder="Select destination airport"
              className={`w-full pl-10 pr-4 py-[0.6rem] bg-[#F9F9F9] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-[#212529] font-normal ${
                destinationError ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {destinationError && (
            <div className="absolute top-full left-0 text-red-500 text-xs mt-1 whitespace-nowrap z-30">
              {destinationError}
            </div>
          )}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {destinationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleDestinationSelect(suggestion)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-sm text-gray-900">{suggestion.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden  items-center gap-2 mb-0">
        {/* Source Input */}
        <div className="relative flex-1 min-w-0">
          <div className="relative">
            <PiAirplaneTakeoff
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={sourceInputRef}
              type="text"
              value={`${sourceInput.city_name || ""}${
                sourceInput.code
                  ? ` (${sourceInput.code.substring(0, 2)}...`
                  : ""
              }`}
              onChange={(e) => {
                handleSourceInputChange(e.target.value);
                setShowSourceSuggestions(true);
              }}
              placeholder="Source"
              className={`w-full pl-9 pr-3 py-2.5 bg-[#F9F9F9] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-[#212529] font-normal truncate ${
                sourceError ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {sourceError && (
            <div className="absolute top-full left-0 text-red-500 text-xs mt-1 whitespace-nowrap z-30 max-w-[150px] truncate">
              {sourceError}
            </div>
          )}
          {showSourceSuggestions && sourceSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {sourceSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSourceSelect(suggestion)}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-xs text-gray-900">{suggestion.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Icon */}
        <div className="flex-shrink-0">
          <button
            onClick={handleLocationChange}
            className="w-7 h-8 py-2 flex items-center justify-center bg-[#F7E700] rounded-md hover:bg-[#e6d600] transition-colors"
          >
            <FaExchangeAlt className="text-gray-700" size={14} />
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative flex-1 min-w-0">
          <div className="relative">
            <PiAirplaneLanding
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={destinationInputRef}
              type="text"
              value={`${destinationInput.city_name || ""}${
                destinationInput.code ? ` (${destinationInput.code})` : ""
              }`}
              onChange={(e) => {
                handleDestinationInputChange(e.target.value);
                setShowDestinationSuggestions(true);
              }}
              placeholder="Destination"
              className={`w-full pl-9 pr-3 py-2.5 bg-[#F9F9F9] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-[#212529] font-normal truncate ${
                destinationError ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {destinationError && (
            <div className="absolute top-full left-0 text-red-500 text-xs mt-1 whitespace-nowrap z-30 max-w-[150px] truncate">
              {destinationError}
            </div>
          )}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {destinationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleDestinationSelect(suggestion)}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-xs text-gray-900">{suggestion.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
