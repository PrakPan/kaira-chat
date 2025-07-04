import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiX,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiSearch,
  FiNavigation,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import Drawer from "../../components/ui/Drawer";
import { FaCar, FaSearch } from "react-icons/fa";

const PickupDropDrawer = ({
  isOpen,
  onClose,
  transferType,
  bookingMode,
  originCityName,
  destinationCityName,
  onSubmit,
  existingBooking = null,
  HOST = "https://mercury.tarzanway.com"
}) => {
  const [formData, setFormData] = useState({
    sourceAddress: "",
    destinationAddress: "",
    transferDate: "",
    transferTime: "",
    passengers: 1,
    notes: "",
    sourceGmapsId: "",
    destinationGmapsId: "",
  });




  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [transferQuotes, setTransferQuotes] = useState([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [traceId,setTraceId] = useState(null)
  const [source,setSource] = useState(null);

  const sourceInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const getStationName = () => {
    switch (bookingMode?.toLowerCase()) {
      case "flight":
        return transferType === "pickup"
          ? `${originCityName} Airport`
          : `${destinationCityName} Airport`;
      case "train":
        return transferType === "pickup"
          ? `${originCityName} Railway Station`
          : `${destinationCityName} Railway Station`;
      case "ferry":
        return transferType === "pickup"
          ? `${originCityName} Ferry Terminal`
          : `${destinationCityName} Ferry Terminal`;
      default:
        return "";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceInputRef.current && !sourceInputRef.current.contains(event.target)) {
        setShowSourceSuggestions(false);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    const action = transferType === "pickup" ? "Pickup" : "Drop";
    const location = transferType === "pickup" ? originCityName : destinationCityName;
    return `${action} Transfer - ${location}`;
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
        `${HOST}/api/v1/geos/gmaps_address/autocomplete/?q=${encodeURIComponent(query)}`
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

  const handleLocationSearch = useCallback((value, field) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAutocomplete(value, field);
    }, 300);
  }, []);

  const handleSuggestionSelect = (suggestion, field) => {
    if (field === "source") {
      setFormData((prev) => ({
        ...prev,
        sourceAddress: suggestion.text,
        sourceGmapsId: suggestion.id,
      }));
      setShowSourceSuggestions(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        destinationAddress: suggestion.text,
        destinationGmapsId: suggestion.id,
      }));
      setShowDestinationSuggestions(false);
    }

    // Clear error for this field
    const fieldName = field === "source" ? "sourceAddress" : "destinationAddress";
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const searchTransfers = async () => {
    if (!formData.sourceGmapsId || !formData.destinationGmapsId) {
      setSearchError("Please select both pickup and drop locations from suggestions");
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
            origin: {
              gmaps_place_id: formData.sourceGmapsId,
            },
            destination: {
              gmaps_place_id: formData.destinationGmapsId,
            },
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
        setSource(data?.data?.source)
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
      cityName: transferType === "pickup" ? originCityName : destinationCityName,
      traceId,
      selectedQuote,
      source
    };

    onSubmit(submissionData);
    onClose();
  };


  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Clear gmaps id when address changes
      if (field === "sourceAddress") {
        newData.sourceGmapsId = "";
      } else if (field === "destinationAddress") {
        newData.destinationGmapsId = "";
      }
      
      return newData;
    })};


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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
      <div className="h-full w-full bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-white p-2">
                  
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{getTitle()}</h2>
                 
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-white bg-opacity-20 p-2 text-black hover:bg-opacity-30 transition-all"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Search Form */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Trip Details
                </h3>
                
                {/* Location Fields - Desktop Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* Source Address */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMapPin size={16} className="inline mr-2 text-green-600" />
                      From
                    </label>
                    <div className="relative">
                      <input
      ref={sourceInputRef}
      type="text"
      value={formData.sourceAddress}
      onChange={(e) => {
        handleInputChange("sourceAddress", e.target.value);
        handleLocationSearch(e.target.value, "source");
      }}
      onFocus={() => setShowSourceSuggestions(true)}
      onBlur={() => {
        if (!formData.sourceGmapsId && sourceSuggestions.length > 0) {
          handleSuggestionSelect(sourceSuggestions[0], "source");
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !formData.sourceGmapsId && sourceSuggestions.length > 0) {
          e.preventDefault();
          handleSuggestionSelect(sourceSuggestions[0], "source");
        }
      }}
      placeholder="Enter pickup location"
      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        errors.sourceAddress ? "border-red-500" : "border-gray-300"
      }`}
    />
                      <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      {formData.sourceGmapsId && (
                        <FiCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                      )}
                    </div>
                    {errors.sourceAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sourceAddress}
                      </p>
                    )}
                    
                    {/* Source Suggestions */}
                    {showSourceSuggestions && sourceSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {sourceSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onClick={() => handleSuggestionSelect(suggestion, "source")}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <FiMapPin className="text-gray-400 flex-shrink-0" size={16} />
                              <span className="text-gray-900">{suggestion.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Destination Address */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiNavigation size={16} className="inline mr-2 text-red-600" />
                      To
                    </label>
                    <div className="relative">
                      <input
      ref={destinationInputRef}
      type="text"
      value={formData.destinationAddress}
      onChange={(e) => {
        handleInputChange("destinationAddress", e.target.value);
        handleLocationSearch(e.target.value, "destination");
      }}
      onFocus={() => setShowDestinationSuggestions(true)}
      onBlur={() => {
        if (!formData.destinationGmapsId && destinationSuggestions.length > 0) {
          handleSuggestionSelect(destinationSuggestions[0], "destination");
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !formData.destinationGmapsId && destinationSuggestions.length > 0) {
          e.preventDefault();
          handleSuggestionSelect(destinationSuggestions[0], "destination");
        }
      }}
      placeholder="Enter drop location"
      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        errors.destinationAddress ? "border-red-500" : "border-gray-300"
      }`}
    />
                      <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      {formData.destinationGmapsId && (
                        <FiCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                      )}
                    </div>
                    {errors.destinationAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.destinationAddress}
                      </p>
                    )}
                    
                    {/* Destination Suggestions */}
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {destinationSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onClick={() => handleSuggestionSelect(suggestion, "destination")}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <FiMapPin className="text-gray-400 flex-shrink-0" size={16} />
                              <span className="text-gray-900">{suggestion.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date, Time, and Passengers - Desktop Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar size={16} className="inline mr-2 text-blue-600" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.transferDate}
                      onChange={(e) => handleInputChange("transferDate", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.transferDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.transferDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.transferDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiClock size={16} className="inline mr-2 text-blue-600" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.transferTime}
                      onChange={(e) => handleInputChange("transferTime", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.transferTime ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.transferTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.transferTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUsers size={16} className="inline mr-2 text-blue-600" />
                      Passengers
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.passengers}
                      onChange={(e) => handleInputChange("passengers", parseInt(e.target.value) || 1)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.passengers ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.passengers && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passengers}
                      </p>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={() => {
    if (validateForm()) searchTransfers();
  }}
                  disabled={isLoadingQuotes}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-black py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoadingQuotes ? (
                    <>
                      <FiLoader className="animate-spin" size={20} />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FiSearch size={20} />
                      <span>Search Transfers</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {searchError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <FiAlertCircle className="text-red-500" size={20} />
                    <span className="text-red-700">{searchError}</span>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {transferQuotes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Transfer Options
                  </h3>
                  {transferQuotes.map((quote, index) => (
                    <div
                      key={quote.result_index}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <FaCar className="text-blue-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {quote.taxi_category.model_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {quote.taxi_category.type} • {quote.taxi_category.seating_capacity} seats • {quote.taxi_category.bag_capacity} bags
                            </p>
                          </div>
                        </div>
                        
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(Math.ceil(quote.price.total))}
                          </div>
                          {/* <p className="text-sm text-gray-600">
                            ₹{quote.per_km_cost}/km
                          </p> */}
                       
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleSubmit(quote)}
                          className="bg-blue-600 text-black px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <input type="checkbox" size={18}/>
                          {/* <FiArrowRight size={16} /> */}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default PickupDropDrawer;