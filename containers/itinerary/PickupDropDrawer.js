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

const PickupDropDrawer = ({
  isOpen,
  onClose,
  transferType,
  bookingMode,
  originCityName,
  destinationCityName,
  onSubmit,
  existingBooking = null,
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
  HOST = "https://dev.mercury.tarzanway.com",
}) => {
  const {number_of_adults , number_of_children, number_of_infants} = useSelector(state=>state.Itinerary)
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
  };

  const [formData, setFormData] = useState(initialFormState);

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

  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const sourceInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const timeDropdownRef = useRef(null);
  const calendarRef = useRef(null);

  console.log("formData", formData);

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

  useEffect(() => {
    if (isOpen) {
      setIsLoadingQuotes(false);
      setFormData(initialFormState);
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
    }
  }, [isOpen]);

  const getStationName = () => {
    switch (bookingMode?.toLowerCase()) {
      case "flight":
        return transferType === "pickup"
          ? `${destinationCityName} Airport`
          : `${originCityName} Airport`;
      case "train":
        return transferType === "pickup"
          ? `${destinationCityName} Railway Station`
          : `${originCityName} Railway Station`;
      case "ferry":
        return transferType === "pickup"
          ? `${destinationCityName} Ferry Terminal`
          : `${originCityName} Ferry Terminal`;
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
    try {
      const endpoint = getHubEndpoint();
      const response = await fetch(
        `${HOST}/api/v1/geos/search/${endpoint}?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHubSuggestions(data.results || []);
    } catch (error) {
      console.error("Hub search error:", error);
      setHubSuggestions([]);
    } finally {
      setIsLoadingHubs(false);
    }
  };

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

    try {
      const response = await fetch(
        `${HOST}/api/v1/geos/gmaps_address/autocomplete/?q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (field === "source") {
        setSourceSuggestions(data.results || []);
        setShowSourceSuggestions(true);
      } else {
        setDestinationSuggestions(data.results || []);
        setShowDestinationSuggestions(true);
      }
    } catch (error) {
      console.error("Autocomplete search error:", error);
      if (field === "source") {
        setSourceSuggestions([]);
        setShowSourceSuggestions(false);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
    }
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
    const label = isHub ? suggestion.name : suggestion.text;
    const id = suggestion.id;
    console.log("Hereee", label, isHub);
    if (field === "source") {
      setFormData((prev) => ({
        ...prev,
        sourceAddress: label,
        sourceGmapsId: isHub ? "" : id,
        sourceHubId: isHub ? id : "",
      }));
      setSourceInput(label); // <- important!
      setShowSourceSuggestions(false);
      setSourceSuggestions([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        destinationAddress: label,
        destinationGmapsId: isHub ? "" : id,
        destinationHubId: isHub ? id : "",
      }));
      setDestinationInput(label); // <- important!
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
    const sourceId = formData.sourceHubId || formData.sourceGmapsId;
    const destinationId =
      formData.destinationHubId || formData.destinationGmapsId;

    if (!sourceId || !destinationId) {
      setSearchError(
        "Please select both pickup and drop locations from suggestions"
      );
      return;
    }

    setIsLoadingQuotes(true);
    setSearchError("");

    try {
      const requestBody = {
        source: null,
        trips: [
          {
            trip_type: "airport",
            origin: formData.sourceHubId
              ? { hub_id: formData.sourceHubId }
              : { gmaps_place_id: formData.sourceGmapsId },
            destination: formData.destinationHubId
              ? { hub_id: formData.destinationHubId }
              : { gmaps_place_id: formData.destinationGmapsId },
            start_date: formData.transferDate,
            start_time: formData.transferTime,
            number_of_travellers: formData.passengers,
          },
        ],
      };

      const response = await fetch(`${HOST}/api/v1/transfers/taxi/search/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.quotes) {
        setSource(data?.data?.source);
        setTraceId(data?.trace_id);
        setTransferQuotes(data.data.quotes);
      } else {
        setSearchError("No transfer options found for the selected route");
      }
    } catch (error) {
      console.error("Transfer search error:", error);
      setSearchError("Failed to search transfers. Please try again.");
    } finally {
      setIsLoadingQuotes(false);
    }
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
      } else if (field === "destinationAddress") {
        newData.destinationGmapsId = "";
        newData.destinationHubId = "";
      }

      return newData;
    });

    // Clear errors when user types
    if (field === "sourceAddress" || field === "destinationAddress") {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
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
      return formData.sourceGmapsId || formData.sourceHubId;
    }
    return formData.destinationGmapsId || formData.destinationHubId;
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

  // Load default hub suggestions when drawer opens
  useEffect(() => {
    if (isOpen && bookingMode) {
      const cityName =
        transferType === "pickup" ? destinationCityName : originCityName;
      if (cityName) {
        searchHubs(cityName);
      }
    }
  }, [isOpen, bookingMode, transferType, originCityName, destinationCityName]);

  const getTitle = () => {
    const action = transferType === "pickup" ? "Pickup" : "Drop";
    const location =
      transferType === "pickup" ? destinationCityName : originCityName;
    return `Add ${action} in ${location}`;
  };

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getFieldLabel("source")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    ref={sourceInputRef}
                    value={formData.sourceAddress}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSourceInput(value);
                      handleLocationSearch(value, "source");
                      // clear gmaps/hub ids if user types manually
                      setFormData((prev) => ({
                        ...prev,
                        sourceAddress: value,
                        sourceGmapsId: "",
                        sourceHubId: "",
                      }));
                    }}
                    onFocus={() => setShowSourceSuggestions(true)}
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
                            console.log("Clicked", suggestion);
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Destination Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getFieldLabel("destination")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    ref={destinationInputRef}
                    value={formData.destinationAddress}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDestinationInput(value);
                      handleLocationSearch(value, "destination");
                      setFormData((prev) => ({
                        ...prev,
                        destinationAddress: value,
                        destinationGmapsId: "",
                        destinationHubId: "",
                      }));
                    }}
                    onFocus={() => setShowDestinationSuggestions(true)}
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
                fontSize="0.5rem"
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
                className="relative flex items-center justify-center min-w-[100px] h-[30px]"
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
          {transferQuotes.length > 0 && (
            <div className="space-y-3">
              {transferQuotes.map((quote, index) => (
                <TaxiSearched
                  airportBooking
                  cityId={transferType === "pickup" ? destination_itinerary_city_id : origin_itinerary_city_id}
                  key={index}
                  data={quote}
                  handleAirportTaxiSelect={handleSubmit}
                  combo={false}
                  selectedBooking={selectedBooking}
                  getPaymentHandler={getPaymentHandler}
                  _updateTaxiBookingHandler={
                        _updateTaxiBookingHandler
                        }
                  origin_itinerary_city_id={
                          origin_itinerary_city_id
                        }
                        destination_itinerary_city_id={
                          destination_itinerary_city_id
                        }
                  setHideBookingModal={onClose}
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
