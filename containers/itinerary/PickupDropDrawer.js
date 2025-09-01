import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiNavigation,
  FiCheckCircle,
  FiAlertCircle,
  FiPlane,
  FiTruck,
  FiChevronDown,
} from "react-icons/fi";
import Drawer from "../../components/ui/Drawer";
import { FaCar } from "react-icons/fa";
import BackArrow from "../../components/ui/BackArrow";
import Generalbutton from "../../components/ui/button/Generallinkbutton";
import TaxiSearched from "../../components/modals/taxis/taxi-searched/Index";
import { PulseLoader } from "react-spinners";
import SingleDateInput from "./SingleDateInput";
import { useSelector } from "react-redux";
import axiossearchinstance, {
  axiosHubsAutocomplete,
  gmapsAutocomplete,
} from "../../services/search/searchsuggest";
import axiosTaxiSearch from "../../services/bookings/TaxiSearch";
import Skeleton from "../../components/modals/taxis/Skeleton";

const PickupDropDrawer = ({
  isOpen,
  onClose,
  transferType,
  bookingMode,
  originCityName,
  destinationCityName,
  onSubmit,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  setShowLoginModal,
  _updateTaxiBookingHandler,
  selectedBooking,
  setSelectedBooking,
  originCityId,
  destinationCityId,
  origin_itinerary_city_id,
  destination_itinerary_city_id,
  hotelName,
  destinationHotelName,
  booking,
  trips,
  sourceGmaps,
  destinationGmaps,
  booking_id,
  loading,
  sourceLat,
  sourceLong,
  destinationLat,
  destinationLong,
}) => {

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [transferQuotes, setTransferQuotes] = useState([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [traceId, setTraceId] = useState(null);
  const [source, setSource] = useState(null);
  const [hubSuggestions, setHubSuggestions] = useState([]);
  const [isLoadingHubs, setIsLoadingHubs] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [initialPropsAssigned, setInitialPropsAssigned] = useState(false);
  const hasAutoSearchedRef = useRef(false);

  const sourceInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const timeDropdownRef = useRef(null);
  const calendarRef = useRef(null);
  const { number_of_adults, number_of_children, number_of_infants } =
    useSelector((state) => state.Itinerary);
  const hasAutoFilledRef = useRef({ source: false, destination: false });

  // Replace the initial form state calculation
  const initialFormState = {
    sourceAddress: "",
    destinationAddress: "",
    transferDate: "",
    transferTime: "12:00",
    passengers: number_of_adults + number_of_children + number_of_infants,
    notes: "",
    sourceGmapsId: "",
    destinationGmapsId: "",
    sourceHubId: "",
    destinationHubId: "",
    sourceLatitude: "",
    sourceLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
  };

  useEffect(() => {
    if (isOpen) {
      const trip = trips?.[0];
      hasAutoSearchedRef.current = false;
      // Reset state first
      setFormData(initialFormState); 
      setSourceInput(""); 
      setDestinationInput("");
      setInitialPropsAssigned(false);
      setIsLoadingQuotes(false);
      setSourceSuggestions([]);
      setDestinationSuggestions([]);
      setShowSourceSuggestions(false);
      setShowDestinationSuggestions(false);
      setHubSuggestions([]);
      setErrors({});
      setSearchError("");
      setTransferQuotes([]);
      setTraceId(null);
      setSource(null);
      setIsAutoFilled(false);
      
      hasAutoFilledRef.current = { source: false, destination: false };

      // Extract data from trip
      const sourceAddress = trip?.origin?.address || "";
      const destinationAddress = trip?.destination.address || "";
      const transferDate = trip?.start_date || "";
      const transferTime = trip?.start_time || "12:00";
      const passengers =
        trip?.number_of_travellers ||
        number_of_adults + number_of_children + number_of_infants;

      const originLat = trip?.origin?.coordinates?.lat || "";
      const originLng = trip?.origin?.coordinates?.long || "";

      const destinationLat = trip?.destination?.coordinates?.lat || "";
      const destinationLng = trip?.destination?.coordinates?.long || "";

      // Update form data - directly assign gmaps IDs from trip
      setFormData({
        sourceAddress,
        destinationAddress,
        transferDate,
        transferTime,
        passengers,
        notes: "",
        sourceGmapsId: trip?.origin?.gmaps_place_id || "",

        destinationGmapsId: trip?.destination?.gmaps_place_id || "",
        sourceHubId: trip?.origin.hub_id || "",
        destinationHubId: trip?.destination?.hub_id || "",
        sourceLatitude: originLat,
        sourceLongitude: originLng,
        destinationLatitude: destinationLat,
        destinationLongitude: destinationLng,
      });

      // Set input display values to match form data
      setSourceInput(sourceAddress);
      setDestinationInput(destinationAddress);

      if (
        transferType === "pickup" &&
        destinationLat &&
        destinationLong &&
        !destinationHotelName
      ) {
        setDestinationInput(`Location (${destinationLat}, ${destinationLong})`);
      } else if (
        transferType === "drop" &&
        sourceLat &&
        sourceLong &&
        !hotelName
      ) {
        setSourceInput(`Location (${sourceLat}, ${sourceLong})`);
      }

      // Search for hubs if needed
      if (trip?.origin.hub_id || trip?.destination.hub_id) {
        const searchCityName =
          transferType === "pickup" ? destinationCityName : originCityName;
        if (searchCityName) {
          searchHubs(searchCityName);
        }
      }

      setIsAutoFilled(true);
      setInitialPropsAssigned(true);
    }
  }, [
    isOpen,
    trips,
    number_of_adults,
    number_of_children,
    number_of_infants,
    transferType,
    originCityName,
    destinationCityName,
  ]);

  const getInitialFormState = () => {
    if (!booking) {
      return {
        ...initialFormState,
        passengers: number_of_adults + number_of_children + number_of_infants,
      };
    }

    // Calculate date and time
    let newDate = "";
    let newTime = "12:00";

    if (transferType === "pickup") {
  const result = calculateTimeWithOffset(booking.check_out, 30);
  newDate = result.date;
  newTime = { value: result.value, display: result.display };
} else {
  const result = calculateTimeWithOffset(booking.check_in, -30);
  newDate = result.date;
  newTime = { value: result.value, display: result.display };
}


    // Set hotel addresses with city name fallback
    let newSourceAddress = "";
    let newDestinationAddress = "";

    if (transferType === "pickup") {
      newDestinationAddress = destinationHotelName || destinationCityName || "";
    } else {
      newSourceAddress = hotelName || originCityName || "";
    }

    return {
      ...initialFormState,
      passengers: number_of_adults + number_of_children + number_of_infants,
      transferDate: newDate,
      transferTime: newTime,
      sourceAddress: newSourceAddress,
      destinationAddress: newDestinationAddress,
    };
  };

  const [formData, setFormData] = useState(initialFormState);


  console.log("AirForm",formData)

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "";

    const safeString = dateTimeString.replace(" ", "T");

    const date = new Date(safeString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const calculateTimeWithOffset = (dateTimeString, offsetMinutes) => {
    if (!dateTimeString)
      return { value: "12:00", display: "12:00 PM", date: "" };

    let date = new Date(dateTimeString);
    if (isNaN(date.getTime()))
      return { value: "12:00", display: "12:00 PM", date: "" };

    // Apply offset
    date.setMinutes(date.getMinutes() + offsetMinutes);

    // Round to nearest 30 minutes
    let minutes = date.getMinutes();
    if (minutes < 15) {
      date.setMinutes(0);
    } else if (minutes < 45) {
      date.setMinutes(30);
    } else {
      date.setHours(date.getHours() + 1);
      date.setMinutes(0);
    }

    // Final time value
    const value = date.toTimeString().slice(0, 5); // "22:00"

    // Final date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const finalDate = `${year}-${month}-${day}`;

    // 12-hour display
    let hours = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    const display = `${displayHour}:${mins} ${ampm}`;


    return { value, display, date: finalDate };
  };

  const getHubId = (booking, transferType, field) => {
    if (!booking) return null;

    if (bookingMode === "train" || bookingMode === "ferry") {
      if (!booking?.transfer_details) return null;
      return transferType === "pickup" && field === "source"
        ? booking?.transfer_details?.destination?.id
        : transferType === "drop" && field === "destination"
        ? booking?.transfer_details?.source?.id
        : null;
    } else {
      // For train/ferry: use transfer_details
      const transferDetails = booking.transfer_details;
      if (!transferDetails) return null;

      if (transferType === "pickup" && field === "source") {
        // For pickup source, get destination hub from booking
        return (
          transferDetails.items?.[0]?.segments?.[
            transferDetails.items?.[0]?.segments?.length - 1
          ]?.destination?.hub_id || null
        );
      } else if (transferType === "drop" && field === "destination") {
        // For drop destination, get destination hub from booking
        return (
          transferDetails.items?.[0]?.segments?.[0]?.origin?.hub_id ||
          transferDetails.destination?.id ||
          null
        );
      }
      return null;
    }
  };

  // 2. SECOND - Initialize form data and trigger gmaps API calls
  useEffect(() => {
    if (isOpen && booking && !trips) {
      const initialData = getInitialFormState();
      let updatedData = { ...initialData };

      if (transferType === "pickup") {
        // For pickup: destination gets hotel data if available, source gets hub
        if (destinationHotelName && destinationLat && destinationLong) {
          // Hotel exists - use hotel data for destination
          updatedData.destinationAddress = destinationHotelName;
          updatedData.destinationLatitude = destinationLat;
          updatedData.destinationLongitude = destinationLong;
        } else if (destinationLat && destinationLong && !destinationHotelName) {
          // No hotel but coordinates exist - use coordinates for destination
          updatedData.destinationAddress = `Location (${destinationLat}, ${destinationLong})`;
          updatedData.destinationLatitude = destinationLat;
          updatedData.destinationLongitude = destinationLong;
        } else if (destinationCityName) {
          // No hotel or coordinates - use city gmaps for destination
          updatedData.destinationAddress = destinationCityName;
          if (destinationGmaps) {
            updatedData.destinationGmapsId = destinationGmaps;
          }
        }

        // Source gets hub data for pickup
        const sourceHubId = getHubId(booking, "pickup", "source");
        if (sourceHubId) {
          updatedData.sourceHubId = sourceHubId;
          updatedData.sourceAddress = getStationName();
        } else if (originCityName) {
          // Fallback to city if no hub
          updatedData.sourceAddress = originCityName;
          if (sourceGmaps) {
            updatedData.sourceGmapsId = sourceGmaps;
          }
        }
      } else if (transferType === "drop") {
        // For drop: source gets hotel data if available, destination gets hub
        if (hotelName && sourceLat && sourceLong) {
          // Hotel exists - use hotel data for source
          updatedData.sourceAddress = hotelName;
          updatedData.sourceLatitude = sourceLat;
          updatedData.sourceLongitude = sourceLong;
        } else if (sourceLat && sourceLong && !hotelName) {
          // No hotel but coordinates exist - use coordinates for source
          updatedData.sourceAddress = `Location (${sourceLat}, ${sourceLong})`;
          updatedData.sourceLatitude = sourceLat;
          updatedData.sourceLongitude = sourceLong;
        } else if (originCityName) {
          // No hotel or coordinates - use city gmaps for source
          updatedData.sourceAddress = originCityName;
          if (sourceGmaps) {
            updatedData.sourceGmapsId = sourceGmaps;
          }
        }

        // Destination gets hub data for drop
        const destHubId = getHubId(booking, "drop", "destination");
        if (destHubId) {
          updatedData.destinationHubId = destHubId;
          updatedData.destinationAddress = getStationName();
        } else if (destinationCityName) {
          // Fallback to city if no hub
          updatedData.destinationAddress = destinationCityName;
          if (destinationGmaps) {
            updatedData.destinationGmapsId = destinationGmaps;
          }
        }
      }

      setFormData(updatedData);
      setSourceInput(updatedData.sourceAddress);
      setDestinationInput(updatedData.destinationAddress);

      setIsAutoFilled(true);
      setInitialPropsAssigned(true);
    }
  }, [
    isOpen,
    booking,
    transferType,
    hotelName,
    destinationHotelName,
    originCityName,
    destinationCityName,
    number_of_adults,
    number_of_children,
    number_of_infants,
    trips,
    sourceGmaps,
    destinationGmaps,
    sourceLat,
    sourceLong,
    destinationLat,
    destinationLong,
  ]);

  // Update the hub auto-fill useEffect
  useEffect(() => {
    if (isOpen && booking && isAutoFilled && !trips) {
      let targetHubId = null;
      let fieldToUpdate = null;

      if (transferType === "pickup") {
        targetHubId = getHubId(booking, "pickup", "source");
        fieldToUpdate = "source";
      } else {
        targetHubId = getHubId(booking, "drop", "destination");
        fieldToUpdate = "destination";
      }


      if (targetHubId && fieldToUpdate) {
        // Instead of searching in hubSuggestions, directly use the hub ID and generate a name
        const hubName = getStationName(); // This already generates the appropriate name

        setFormData((prev) => ({
          ...prev,
          ...(fieldToUpdate === "source"
            ? {
                sourceAddress: hubName,
                sourceHubId: targetHubId,
                sourceGmapsId: "",
              }
            : {
                destinationAddress: hubName,
                destinationHubId: targetHubId,
                destinationGmapsId: "",
              }),
        }));

        // Update input display
        if (fieldToUpdate === "source") {
          setSourceInput(hubName);
        } else {
          setDestinationInput(hubName);
        }
      }
    }
  }, [booking, transferType, isAutoFilled, bookingMode, isOpen, trips]);

  // 1. FIRST - Reset everything when drawer opens/closes

  // 2. SECOND - Initialize form data and trigger gmaps API calls
  useEffect(() => {
    if (isOpen && booking) {

      // Calculate date and time
      let newDate = "";
      let newTime = { value: "12:00", display: "12:00 PM" };

      if (transferType === "pickup") {
        const result = calculateTimeWithOffset(booking.check_out, 30);
        newDate = result.date;
        newTime = { value: result.value, display: result.display };
      } else {
        const result = calculateTimeWithOffset(booking.check_in, -30);
        newDate = result.date;
        newTime = { value: result.value, display: result.display };
      }


      // Update form data
      setFormData((prev) => ({
        ...prev,
        transferDate: newDate,
        transferTime: newTime?.value,
      }));

      setIsAutoFilled(true);
    }
  }, [isOpen, booking, transferType]);

  // 3. THIRD - Search for hubs when drawer opens
  // useEffect(() => {
  //   if (isOpen && bookingMode && booking) {
  //     // Search hubs for the city where the hub should be located
  //     const searchCityName =
  //       transferType === "pickup" ? destinationCityName : originCityName;

  //     console.log("Searching hubs for city:", searchCityName);

  //     if (searchCityName) {
  //       searchHubs(searchCityName);
  //     }
  //   }
  // }, [
  //   isOpen,
  //   bookingMode,
  //   transferType,
  //   originCityName,
  //   destinationCityName,
  //   booking,
  // ]);

  // 4. FOURTH - Auto-fill hub data when suggestions become available
  useEffect(() => {
    if (hubSuggestions.length > 0 && booking && isAutoFilled) {

      let targetHubId = null;
      let fieldToUpdate = null;

      if (transferType === "pickup") {
        // For pickup: source should be hub
        targetHubId = getHubId(booking, "pickup", "source");
        fieldToUpdate = "source";
      } else {
        // For drop: destination should be hub
        targetHubId = getHubId(booking, "drop", "destination");
        fieldToUpdate = "destination";
      }


      if (targetHubId && fieldToUpdate) {
        const matchedHub = hubSuggestions.find((hub) => hub.id === targetHubId);


        if (matchedHub) {
          setFormData((prev) => ({
            ...prev,
            ...(fieldToUpdate === "source"
              ? {
                  sourceAddress: matchedHub.name,
                  sourceHubId: matchedHub.id,
                  sourceGmapsId: "",
                }
              : {
                  destinationAddress: matchedHub.name,
                  destinationHubId: matchedHub.id,
                  destinationGmapsId: "",
                }),
          }));

          // Update input display
          if (fieldToUpdate === "source") {
            setSourceInput(matchedHub.name);
          } else {
            setDestinationInput(matchedHub.name);
          }
        }
      }
    }
  }, [hubSuggestions, booking, transferType, isAutoFilled, bookingMode]);


  const searchAutocomplete = async (query, field) => {
    if (!query.trim() || query.length < 2) {
      if (field === "source") {
        setSourceSuggestions([]);
        setShowSourceSuggestions(false);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
      return;
    }

    const hotelSuggestions = [];

    try {
      const res = await gmapsAutocomplete.get(
        `/?q=${encodeURIComponent(query)}`
      );
      const gmapResults = res.data.results || [];
      const combinedResults = [...hotelSuggestions, ...gmapResults];

      if (field === "source") {
        setSourceSuggestions(combinedResults);
        setShowSourceSuggestions(true);

        // Auto-select on first load for hotel name OR city name
        // if (combinedResults.length > 0 &&
        //     !hasAutoFilledRef.current.source &&
        //     transferType === "drop" &&
        //     (query === hotelName || (!hotelName && query === originCityName)) &&
        //     !formData.sourceGmapsId) {
        //   handleSuggestionSelect(combinedResults[0], "source");
        //   hasAutoFilledRef.current.source = true;
        // }
      } else {
        setDestinationSuggestions(combinedResults);
        setShowDestinationSuggestions(true);

        // Auto-select on first load for hotel name OR city name
        // if (combinedResults.length > 0 &&
        //     !hasAutoFilledRef.current.destination &&
        //     transferType === "pickup" &&
        //     (query === destinationHotelName || (!destinationHotelName && query === destinationCityName)) &&
        //     !formData.destinationGmapsId) {
        //   handleSuggestionSelect(combinedResults[0], "destination");
        //   hasAutoFilledRef.current.destination = true;
        // }
      }
    } catch (error) {
      console.error("Autocomplete search error:", error);
      // Show hotel suggestions even if gmaps fails
      if (field === "source") {
        setSourceSuggestions(hotelSuggestions);
        setShowSourceSuggestions(hotelSuggestions.length > 0);
      } else {
        setDestinationSuggestions(hotelSuggestions);
        setShowDestinationSuggestions(hotelSuggestions.length > 0);
      }
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        // Convert to 12-hour format for display
        let displayHour = hour;
        let ampm = "AM";

        if (hour === 0) {
          displayHour = 12;
        } else if (hour === 12) {
          displayHour = 12;
          ampm = "PM";
        } else if (hour > 12) {
          displayHour = hour - 12;
          ampm = "PM";
        }

        const displayTime = `${displayHour}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`;

        times.push({
          value: time24,
          display: displayTime,
        });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (timeValue) => {
    setFormData((prev) => ({
      ...prev,
      transferTime: timeValue,
    }));
    setShowTimeDropdown(false);
    setErrors((prev) => ({
      ...prev,
      transferTime: "",
    }));
  };

  const getSelectedTimeDisplay = () => {
    if (!formData.transferTime) return "Select time";
    const timeOption = timeOptions.find(
      (option) => option.value === formData.transferTime
    );
    return timeOption ? timeOption.display : formData.transferTime;
  };

  const getStationName = () => {
    switch (bookingMode?.toLowerCase()) {
      case "flight":
        return transferType === "pickup"
          ? `${destinationCityName} City`
          : `${originCityName} City`;
      case "train":
        return transferType === "pickup"
          ? `${destinationCityName} City`
          : `${originCityName} City`;
      case "ferry":
        return transferType === "pickup"
          ? `${destinationCityName} City`
          : `${originCityName} City`;
      default:
        return "";
    }
  };

  const getHubEndpoint = () => {
    switch (bookingMode?.toLowerCase()) {
      case "flight":
        return "hubs/airport";
      case "train":
      case "ferry":
        return "hubs/station";
      default:
        return "hubs/airport";
    }
  };

  const searchHubs = async (query) => {
    if (!query.trim() || query.length < 2) {
      setHubSuggestions([]);
      return;
    }

    setIsLoadingHubs(true);

    const endpoint = getHubEndpoint();
    axiosHubsAutocomplete
      .get(`/${endpoint}?q=${encodeURIComponent(query)}`)
      .then((res) => {
        setHubSuggestions(res.data.results || []);
        setIsLoadingHubs(false);
      })
      .catch((err) => {
        console.error("Hub search error:", err);
        setIsLoadingHubs(false);
        setHubSuggestions([]);
      });
  };

  const handleLocationSearch = useCallback(
    (value, field) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        // For pickup: source is hub, destination is gmaps
        // For drop: source is gmaps, destination is hub
        const shouldUseHub =
          (transferType === "pickup" && field === "source") ||
          (transferType === "drop" && field === "destination");

        if (shouldUseHub) {
          searchHubs(value);
        } else {
          searchAutocomplete(value, field);
        }
      }, 300);
    },
    [transferType]
  );

  const handleSuggestionSelect = (suggestion, field) => {
    const isHub = suggestion.code !== undefined;
    const isHotel = suggestion.isHotel === true;
    const label = isHub ? suggestion.name : suggestion.text;
    const id = suggestion.id;


    if (field === "source") {
      setFormData((prev) => ({
        ...prev,
        sourceAddress: label,
        sourceGmapsId: isHub ? "" : id,
        sourceHubId: isHub ? id : "",
      }));
      setSourceInput(label);
      setShowSourceSuggestions(false);
      setSourceSuggestions([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        destinationAddress: label,
        destinationGmapsId: isHub ? "" : id,
        destinationHubId: isHub ? id : "",
      }));
      setDestinationInput(label);
      setShowDestinationSuggestions(false);
      setDestinationSuggestions([]);
    }
    setHubSuggestions([]);
  };

  const getCurrentSuggestions = (field) => {
    const shouldUseHub =
      (transferType === "pickup" && field === "source") ||
      (transferType === "drop" && field === "destination");

    if (shouldUseHub) {
      return hubSuggestions;
    }

    return field === "source" ? sourceSuggestions : destinationSuggestions;
  };

  const searchTransfers = async () => {
    const sourceId =
      formData.sourceHubId ||
      formData.sourceGmapsId ||
      (formData.sourceLatitude && formData.sourceLongitude);
    const destinationId =
      formData.destinationHubId ||
      formData.destinationGmapsId ||
      (formData.destinationLatitude && formData.destinationLongitude);

    if (!sourceId || !destinationId) {
      setSearchError(
        "Please select both pickup and drop locations from suggestions"
      );
      return;
    }

    setIsLoadingQuotes(true);
    setTransferQuotes([]);
    setSearchError("");

    const requestBody = {
      source: null,
      trips: [
        {
          trip_type: "airport",
          origin: formData.sourceHubId
            ? { hub_id: formData.sourceHubId }
            : formData.sourceGmapsId
            ? { gmaps_place_id: formData.sourceGmapsId }
            : {
                address: hotelName || originCityName,
                coordinates: {
                  latitude: formData.sourceLatitude,
                  longitude: formData.sourceLongitude,
                },
              },
          destination: formData.destinationHubId
            ? { hub_id: formData.destinationHubId }
            : formData.destinationGmapsId
            ? { gmaps_place_id: formData.destinationGmapsId }
            : {
                address: destinationHotelName || destinationCityName,
                coordinates: {
                  latitude: formData.destinationLatitude,
                  longitude: formData.destinationLongitude,
                },
              },
          start_date: formData.transferDate,
          start_time: formData.transferTime,
          number_of_travellers: formData.passengers,
        },
      ],
    };

    axiosTaxiSearch
      .post("", requestBody)
      .then((res) => {
        if (res.data.data && res.data.data?.quotes) {
          setSource(res?.data.data?.source);
          setTraceId(res.data?.trace_id);
          setTransferQuotes(res.data.data.quotes);
        } else {
          setIsLoadingQuotes(false);
          setSearchError("No transfer options found for the selected route");
        }
        setIsLoadingQuotes(false);
      })
      .catch((error) => {
        setIsLoadingQuotes(false);
        console.error(
          "Transfer search error:",
          error.response.data?.errors?.[0]?.message[0]
        );
        setSearchError(error.response.data?.errors?.[0]?.message[0]);
      });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sourceAddress.trim()) {
      newErrors.sourceAddress = "Source address is required";
    }

    if (!formData.destinationAddress.trim()) {
      newErrors.destinationAddress = "Destination address is required";
    }

    if (!formData.transferDate) {
      newErrors.transferDate = "Transfer date is required";
    }

    if (!formData.transferTime) {
      newErrors.transferTime = "Transfer time is required";
    }

    if (!formData.passengers || formData.passengers < 1) {
      newErrors.passengers = "Number of passengers is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (selectedQuote) => {
    if (!selectedQuote) return;

    const submissionData = {
      ...formData,
      transferType,
      bookingMode,
      stationName: getStationName(),
      booking_id,
      cityName:
        transferType === "pickup" ? originCityName : destinationCityName,
      traceId,
      selectedQuote,
      source,
    };

    onSubmit(submissionData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Clear both gmaps and hub ids when address changes
      if (field === "sourceAddress") {
        newData.sourceGmapsId = "";
        newData.sourceHubId = "";

        newData.sourceLatitude = "";
        newData.sourceLongitude = "";
      } else if (field === "destinationAddress") {
        newData.destinationGmapsId = "";
        newData.destinationHubId = "";

        newData.destinationLatitude = "";
        newData.destinationLongitude = "";
      }
      return newData;
    });

    // Clear errors when user types
    if (field === "sourceAddress" || field === "destinationAddress") {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));

      // Only call API if initial props have been assigned (meaning user is manually typing)
      if (initialPropsAssigned) {
        if (field === "sourceAddress") {
          setSourceInput(value);
          handleLocationSearch(value, "source");
        } else if (field === "destinationAddress") {
          setDestinationInput(value);
          handleLocationSearch(value, "destination");
        }
      }
    }
  };

  const getFieldIcon = (field) => {
    const shouldUseHub =
      (transferType === "pickup" && field === "source") ||
      (transferType === "drop" && field === "destination");

    if (shouldUseHub) {
      return bookingMode === "flight" ? FiPlane : FiTruck;
    }

    return field === "source" ? FiMapPin : FiNavigation;
  };

  const getFieldLabel = (field) => {
    const shouldUseHub =
      (transferType === "pickup" && field === "source") ||
      (transferType === "drop" && field === "destination");

    if (shouldUseHub) {
      const hubType =
        bookingMode === "flight"
          ? "Airport"
          : bookingMode === "train"
          ? "Station"
          : "Terminal";
      return field === "source" ? `From` : `To`;
    }

    return field === "source" ? "From" : "To";
  };

  const getFieldPlaceholder = (field) => {
    const shouldUseHub =
      (transferType === "pickup" && field === "source") ||
      (transferType === "drop" && field === "destination");

    if (shouldUseHub) {
      const hubType =
        bookingMode === "flight"
          ? "airport"
          : bookingMode === "train"
          ? "station"
          : "terminal";
      return field === "source" ? `Select ${hubType}` : `Select ${hubType}`;
    }

    return field === "source" ? "Enter pickup location" : "Enter drop location";
  };

  const isFieldValid = (field) => {
    if (field === "source") {
      return (
        formData.sourceGmapsId ||
        formData.sourceHubId ||
        (formData.sourceLatitude && formData.sourceLongitude)
      );
    }
    return (
      formData.destinationGmapsId ||
      formData.destinationHubId ||
      (formData.destinationLatitude && formData.destinationLongitude)
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sourceInputRef.current &&
        !sourceInputRef.current.contains(event.target)
      ) {
        setShowSourceSuggestions(false);
      }
      if (
        destinationInputRef.current &&
        !destinationInputRef.current.contains(event.target)
      ) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(event.target)
      ) {
        setShowTimeDropdown(false);
      }

      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        const calendarCloseButton = calendarRef.current.querySelector(
          '[data-testid="DateInput__calendar-icon"]'
        );
        if (!calendarCloseButton?.contains(event.target)) {
          document.activeElement?.blur();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTitle = () => {
    const action = transferType === "pickup" ? "Pickup" : "Drop";
    const hubType =
      bookingMode === "flight"
        ? "Airport"
        : bookingMode === "train"
        ? "Station"
        : "Terminal";
    const location =
      transferType === "pickup"
        ? destinationCityName || trips?.[0]?.destination?.address
        : originCityName || trips?.[0]?.origin?.address;
    return `${trips?.[0] ? "Changing" : "Add"} ${
      trips?.[0] ? "" : hubType
    } ${action} in ${location}`;
  };

  // Auto-search when all fields are filled on initial mount
  // Auto-search when all fields are filled on initial mount
  // useEffect(() => {
  //   if (
  //     isOpen &&
  //     isAutoFilled &&
  //     initialPropsAssigned &&
  //     !hasAutoSearchedRef.current
  //   ) {
  //     // Check if all required fields are filled
  //     const sourceId =
  //       formData.sourceHubId ||
  //       formData.sourceGmapsId ||
  //       (formData.sourceLatitude && formData.sourceLongitude);
  //     const destinationId =
  //       formData.destinationHubId ||
  //       formData.destinationGmapsId ||
  //       (formData.destinationLatitude && formData.destinationLongitude);

  //     const allFieldsFilled =
  //       formData.sourceAddress &&
  //       formData.destinationAddress &&
  //       formData.transferDate &&
  //       formData.transferTime &&
  //       formData.passengers &&
  //       sourceId &&
  //       destinationId;

  //     if (allFieldsFilled) {
  //       console.log("All fields filled, auto-searching transfers...");
  //       hasAutoSearchedRef.current = true;
  //       searchTransfers();
  //     }
  //   }
  // }, [isOpen, isAutoFilled, initialPropsAssigned]);

  useEffect(() => {
  // Only run auto-search after a short delay to ensure all form data is set
  if (
    isOpen &&
    isAutoFilled &&
    initialPropsAssigned &&
    !hasAutoSearchedRef.current
  ) {
    const timeoutId = setTimeout(() => {
      const sourceId =
        formData.sourceHubId ||
        formData.sourceGmapsId ||
        (formData.sourceLatitude && formData.sourceLongitude);
      const destinationId =
        formData.destinationHubId ||
        formData.destinationGmapsId ||
        (formData.destinationLatitude && formData.destinationLongitude);

      const allFieldsFilled =
        formData.sourceAddress &&
        formData.destinationAddress &&
        formData.transferDate &&
        formData.transferTime &&
        formData.passengers &&
        sourceId &&
        destinationId;

      if (allFieldsFilled) {
        console.log("Auto-searching with current form data:", formData);
        hasAutoSearchedRef.current = true;
        searchTransfers();
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }
}, [formData, isOpen, isAutoFilled, initialPropsAssigned]);

  if (!isOpen) return null;

  return (
    <Drawer
      show={isOpen}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={onClose}
      mobileWidth="100vw"
      width={"50vw"}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-3">
          <BackArrow handleClick={onClose} />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 p-3">
          {getTitle()}
        </h2>

        {/* Content */}
        <div className="flex-1 overflow-y-visible">
          {/* Search Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            {/* Location Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Source Field */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  {getFieldLabel("source")} <FiNavigation color="red" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    ref={sourceInputRef}
                    value={formData.sourceAddress}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("sourceAddress", value);
                    }}
                    onFocus={() => {
                      setShowSourceSuggestions(true);
                      setErrors((prev) => ({ ...prev, sourceAddress: "" }));
                    }}
                    placeholder={getFieldPlaceholder("source")}
                    className={`w-full px-3 py-2 pl-8 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                      errors.sourceAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {isFieldValid("source") && (
                    <FiCheckCircle
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      size={16}
                    />
                  )}
                </div>
                {errors.sourceAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sourceAddress}
                  </p>
                )}

                {/* Source Suggestions */}
                {showSourceSuggestions &&
                  getCurrentSuggestions("source").length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {getCurrentSuggestions("source").map((suggestion) => (
                        <div
                          key={suggestion.id}
                          onMouseDown={() => {
                            handleSuggestionSelect(suggestion, "source");
                          }}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900">
                              {suggestion.name || suggestion.text}
                            </span>
                            {suggestion.code && (
                              <span className="text-xs text-gray-500 ml-auto">
                                {suggestion.code}
                              </span>
                            )}
                            {suggestion.isHotel && (
                              <span className="text-xs text-blue-500 ml-auto">
                                Hotel
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Destination Field */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  {getFieldLabel("destination")} <FiMapPin color="green" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    ref={destinationInputRef}
                    value={formData.destinationAddress}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("destinationAddress", value);
                    }}
                    onFocus={() => {
                      setShowDestinationSuggestions(true);
                      setErrors((prev) => ({
                        ...prev,
                        destinationAddress: "",
                      }));
                    }}
                    placeholder={getFieldPlaceholder("destination")}
                    className={`w-full px-3 py-2 pl-8 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                      errors.destinationAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {isFieldValid("destination") && (
                    <FiCheckCircle
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      size={16}
                    />
                  )}
                </div>
                {errors.destinationAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.destinationAddress}
                  </p>
                )}
                {/* Destination Suggestions */}
                {showDestinationSuggestions &&
                  getCurrentSuggestions("destination").length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {getCurrentSuggestions("destination").map(
                        (suggestion) => (
                          <div
                            key={suggestion.id}
                            onMouseDown={() =>
                              handleSuggestionSelect(suggestion, "destination")
                            }
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-900">
                                {suggestion.name || suggestion.text}
                              </span>
                              {suggestion.code && (
                                <span className="text-xs text-gray-500 ml-auto">
                                  {suggestion.code}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Date, Time, and Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div ref={calendarRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiCalendar size={14} className="inline mr-1 text-blue-600" />
                  Date
                </label>
                <SingleDateInput
                  value={formData.transferDate}
                  onChange={(date) => handleInputChange("transferDate", date)}
                  onFocus={() =>
                    setErrors((prev) => ({ ...prev, transferDate: "" }))
                  }
                />

                {errors.transferDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.transferDate}
                  </p>
                )}
              </div>

              <div className="relative" ref={timeDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiClock size={14} className="inline mr-1 text-blue-600" />
                  Time
                </label>
                <div
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer bg-white flex items-center justify-between ${
                    errors.transferTime ? "border-red-500" : "border-gray-300"
                  }`}
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  <span
                    className={
                      formData.transferTime ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {getSelectedTimeDisplay()}
                  </span>
                  <FiChevronDown
                    size={16}
                    className={`text-gray-400 transform transition-transform ${
                      showTimeDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showTimeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-scroll">
                    {timeOptions.map((option) => (
                      <div
                        key={option.value}
                        onMouseDown={() => handleTimeSelect(option.value)}
                        className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          formData.transferTime === option.value
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        <span className="text-sm">{option.display}</span>
                      </div>
                    ))}
                  </div>
                )}

                {errors.transferTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.transferTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiUsers size={14} className="inline mr-1 text-blue-600" />
                  Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.passengers}
                  onChange={(e) =>
                    handleInputChange(
                      "passengers",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.passengers ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.passengers && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passengers}
                  </p>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <Generalbutton
                fontSize="0.8rem"
                width="auto"
                padding="0.5rem 1.5rem"
                fontWeight="500"
                margin="0"
                borderRadius="6px"
                borderWidth="1px"
                bgColor="#f7e700"
                loading={isLoadingQuotes}
                onclick={() => {
                  if (validateForm()) searchTransfers();
                }}
                disabled={isLoadingQuotes}
                className="relative flex items-center justify-center min-w-[120px] h-[30px]"
              >
                <span
                  className={`transition-opacity duration-200 ${
                    isLoadingQuotes ? "hidden" : "opacity-100"
                  }`}
                >
                  Search
                </span>

                {isLoadingQuotes && (
                  <span className="">
                    <PulseLoader size={8} speedMultiplier={0.6} color="#000" />
                  </span>
                )}
              </Generalbutton>
            </div>
          </div>

          {/* Error Message */}
          {searchError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-center space-x-2">
                <FiAlertCircle className="text-red-500" size={16} />
                <span className="text-red-700 text-sm">{searchError}</span>
              </div>
            </div>
          )}

          {/* Transfer Results */}
          {!transferQuotes?.length && isLoadingQuotes ? (
            <div className="space-y-3">
              <Skeleton />
            </div>
          ) : null}

          {transferQuotes.length > 0 && (
            <div className="space-y-3">
              {transferQuotes.map((quote, index) => (
                <TaxiSearched
                  airportBooking
                  cityId={
                    transferType === "pickup"
                      ? destination_itinerary_city_id
                      : origin_itinerary_city_id
                  }
                  key={index}
                  data={quote}
                  handleAirportTaxiSelect={handleSubmit}
                  combo={false}
                  selectedBooking={selectedBooking}
                  getPaymentHandler={getPaymentHandler}
                  _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                  origin_itinerary_city_id={origin_itinerary_city_id}
                  destination_itinerary_city_id={destination_itinerary_city_id}
                  setHideBookingModal={onClose}
                  bookingLoad={loading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default PickupDropDrawer;
