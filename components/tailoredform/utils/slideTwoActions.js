import { addDays, differenceInDays, getDate, isSameDay } from "date-fns";
import { getDateString } from "../../../helper/DateUtils";
import { logEvent } from "../../../services/ga/Index";
import axiossearchstartinginstance from "../../../services/search/startinglocation";
import axiossearchinstance from "../../../services/search/searchsuggest";

export const CITY_COLOR_CODES = [
    "#359EBF",
    "#F0C631",
    "#BF3535",
    "#47691e",
    "#cc610a",
    "#008080",
    "#7d5e7d",
];

const formatDateToAPI = (date) => {
  if (!date) return null;
  

  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  if (date instanceof Date && !isNaN(date)) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  if (typeof date === 'string') {
    const parsed = new Date(date);
    if (!isNaN(parsed)) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  return null;
};


export function addDaysToDate(dateString, daysToAdd) {
  const formattedDate = formatDateToAPI(dateString);
  if (!formattedDate) return dateString;
  
  return addDaysLocal(formattedDate, daysToAdd);
}


const addDaysLocal = (dateString, days) => {
  // Safety check for undefined or invalid dateString
  if (!dateString || typeof dateString !== 'string') {
    console.warn('Invalid dateString provided to addDaysLocal:', dateString);
    dateString = formatDateToAPI(new Date());
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newDay = String(date.getDate()).padStart(2, '0');
  
  return `${newYear}-${newMonth}-${newDay}`;
};


export function buildRoutes(startCity, endCity, basicRoute = []) {
  const routesArray = [];

  if (startCity) {
    routesArray.push({
      name: startCity.name || startCity.city_name,
      latitude: startCity.latitude,
      longitude: startCity.longitude,
      type: "start",
    });
  }

  basicRoute.forEach((route) => {
    routesArray.push({
      ...route,
      type: "stop",
    });
  });

  if (endCity) {
    routesArray.push({
      name: endCity.name || endCity.city_name,
      latitude: endCity.latitude,
      longitude: endCity.longitude,
      type: "end",
    });
  }

  return routesArray;
}

// Build routes from destinations array
export function buildRoutesFromDestinations(destinations) {
  if (!destinations || destinations.length === 0) {
    return [];
  }

  return destinations.map((dest, index) => {
    const cityData = dest.cityData || {};
    
    return {
      name: cityData.city_name || cityData.name || cityData.text || '',
      latitude: cityData.latitude || cityData.lat,
      longitude: cityData.longitude || cityData.long,
      type: dest.startingCity ? "start" : dest.endingCity ? "end" : "stop",
      city_id: cityData.city_id,
      place_id: cityData.place_id,
      duration: cityData.duration,
      nights: cityData.nights,
      checkin_date: cityData.checkin_date,
      checkout_date: cityData.checkout_date,
      color: cityData.color,
      // Include all other properties from cityData
      ...cityData
    };
  });
}

// Build destinations from routes
export function buildDestinations(routes, itinerary, getDate, CITY_COLOR_CODES) {
  const cities = [];

  for (let i = 0; i < routes.length; i++) {
    // Format dates properly
    const checkin_date = i === 0
      ? formatDateToAPI(itinerary?.start_date)
      : i === routes.length - 1
      ? formatDateToAPI(itinerary?.end_date)
      : formatDateToAPI(
          routes[i].checkin_date ||
          routes[i]?.start_date ||
          null
        );

    const checkout_date = i === 0
      ? formatDateToAPI(itinerary?.start_date)
      : i === routes.length - 1
      ? formatDateToAPI(itinerary?.end_date)
      : routes[i].checkout_date
      ? formatDateToAPI(routes[i].checkout_date)
      : routes[i]?.start_date && routes[i]?.duration
      ? addDaysToDate(routes[i]?.start_date, routes[i]?.duration)
      : null;

    const city = {
      startingCity: i === 0,
      endingCity: i === routes.length - 1,
      cityData: {
        ...routes[i],
        city_name: routes[i]?.city_name || routes[i]?.city?.name,
        checkin_date,
        checkout_date,
        city_id: routes[i]?.city_id || routes[i]?.city?.id,
        place_id: routes[i]?.place_id || routes[i]?.gmaps_place_id,
        duration: routes[i]?.duration,
        id: routes[i]?.hasOwnProperty("id") ? routes[i]?.id : null,
        color: CITY_COLOR_CODES[i % 7],
        lat: routes[i]?.lat || routes[i]?.latitude || routes[i]?.city?.latitude,
        long: routes[i]?.long || routes[i]?.longitude || routes[i]?.city?.longitude,
        nights: routes[i]?.nights || routes[i]?.duration,
      },
    };

    if (i !== 0 && i !== routes.length - 1 && checkin_date && checkout_date) {
      // Calculate nights properly
      const checkinParsed = new Date(checkin_date);
      const checkoutParsed = new Date(checkout_date);
      const diffTime = checkoutParsed - checkinParsed;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      city.cityData.nights = diffDays;
    }

    cities.push(city);
  }

  return cities;
}

export function validateDates(destinations, startDate, endDate, setInvalidDateError) {
  const today = new Date();

  if (
    !new Date(startDate) ||
    isNaN(Date.parse(startDate)) ||
    (!isSameDay(new Date(startDate), today) && new Date(startDate) < today)
  ) {
    setInvalidDateError(
      `Invalid date selected for starting city ${destinations[0].cityData.city_name}`
    );
    return false;
  }

  let prevDate = new Date(startDate);

  for (let i = 1; i < destinations.length - 1; i++) {
    const checkin_date = getDate(destinations[i].cityData.checkin_date);
    const checkout_date = getDate(destinations[i].cityData.checkout_date);

    if (!new Date(checkin_date) || isNaN(Date.parse(checkin_date)) || new Date(checkin_date) < prevDate) {
      setInvalidDateError(`Invalid Arrival date for ${destinations[i].cityData.city_name}`);
      return false;
    }

    if (!new Date(checkout_date) || isNaN(Date.parse(checkout_date)) || new Date(checkout_date) < new Date(checkin_date)) {
      setInvalidDateError(`Invalid Departure date for ${destinations[i].cityData.city_name}`);
      return false;
    }

    prevDate = new Date(checkout_date);
  }

  if (!new Date(endDate) || isNaN(Date.parse(endDate)) || new Date(endDate) < prevDate) {
    setInvalidDateError(
      `Invalid date selected for ending city ${destinations[destinations.length - 1].cityData.city_name}`
    );
    return false;
  }

  setInvalidDateError(null);
  return true;
}




export function updateLatLong(items, prevLocations, setLocationsLatLong) {
  console.log("items are: ", items);
  setLocationsLatLong(() => {
    let locations = [...prevLocations];
    const newLocations = [];

    // Start from the first location's start date or items' first date or current date
    let currentDateStr = items?.[0]?.cityData?.start_date
      ? formatDateToAPI(items[0].cityData.start_date)
      : prevLocations?.[0]?.start_date
      ? formatDateToAPI(prevLocations[0].start_date)
      : formatDateToAPI(new Date());
    
    // Ensure we have a valid date string
    if (!currentDateStr) {
      currentDateStr = formatDateToAPI(new Date());
    }

    for (let i = 1; i < items.length - 1; i++) {
      const lat = items[i]?.cityData?.lat || items[i]?.cityData?.latitude;
      const long = items[i]?.cityData?.long || items[i]?.cityData?.longitude;
      const color = items[i]?.cityData?.color;
      const name = items[i]?.cityData?.name || items[i]?.cityData?.city_name;
      const nights = items[i]?.cityData?.nights;
      const itinerary_city_id = items[i]?.cityData?.itinerary_city_id || null;
      const city_id = items[i]?.cityData?.resource_id != null 
        ? items[i]?.cityData?.resource_id 
        : items[i]?.cityData?.city_id;

      if (lat && long) {
        // Use string dates to avoid timezone issues
        let startDate = currentDateStr;
        let endDate = currentDateStr;

        if (nights) {
          endDate = addDaysLocal(currentDateStr, nights);
          currentDateStr = endDate;
        }

        // Update the items array dates as strings
        items[i].cityData.start_date = startDate;
        items[i].cityData.end_date = endDate;
        items[i].cityData.checkin_date = startDate;
        items[i].cityData.checkout_date = endDate;

        const location = locations.find(
          (item) =>
            item.color === color &&
            item.latitude === lat &&
            item.longitude === long &&
            item.duration === nights
        );

        if (location) {
          newLocations.push({
            ...location,
            start_date: startDate,
            end_date: endDate,
          });
        } else {
          newLocations.push({
            latitude: lat,
            longitude: long,
            name,
            color,
            duration: nights,
            itinerary_city_id: itinerary_city_id,
            city_id: city_id,
            start_date: startDate,
            end_date: endDate,
          });
        }
      }
    }

    return newLocations;
  });
}

// ✅ Move updateDestinationsDates2 out
export function updateDestinationsDates2(destinations, startDate) {
  let prevDate = formatDateToAPI(startDate);

  for (let i = 1; i < destinations.length - 1; i++) {
    const dest = destinations[i];
    const checkInDate = prevDate;
    const nights = dest?.cityData?.nights >= 0 && dest?.cityData?.nights !== null 
      ? dest.cityData.nights 
      : 1;
    const checkOutDate = addDaysLocal(checkInDate, nights);

    dest.cityData.checkin_date = checkInDate;
    dest.cityData.checkout_date = checkOutDate;
    dest.cityData.start_date = checkInDate;
    dest.cityData.end_date = checkOutDate;
    prevDate = checkOutDate;
  }

  return destinations;
}

// ✅ Move updateDestinationsDates out
export function updateDestinationsDates(destinations, startDate, setEndDate) {
  let prevDate = formatDateToAPI(startDate);

  for (let i = 1; i < destinations.length - 1; i++) {
    const dest = destinations[i];
    const checkInDate = prevDate;
    const nights = dest?.cityData?.nights >= 0 && dest?.cityData?.nights !== null 
      ? dest.cityData.nights 
      : 1;
    const checkOutDate = addDaysLocal(checkInDate, nights);

    dest.cityData.checkin_date = checkInDate;
    dest.cityData.checkout_date = checkOutDate;
    dest.cityData.start_date = checkInDate;
    dest.cityData.end_date = checkOutDate;
    prevDate = checkOutDate;
  }

  if (setEndDate) {
    setEndDate(prevDate);
  }
}


// Reorder items in a list
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Handle drag end logic
export const handleDragEnd = ({
  result,
  destinations,
  setDestinations,
  updateLatLong,
  updateDestinationsDates,
  setDestinationChanges,
  logEvent,
  setIsRouteChanged
}) => {
  if (!result.destination) return;

  // Prevent dragging start or end cities
  if (
    result.destination.index === 0 ||
    result.destination.index === destinations.length - 1
  ) {
    return;
  }

  const items = reorder(destinations, result.source.index, result.destination.index);

  updateDestinationsDates(items);
  updateLatLong(items);
  // setDestinationChanges(true);
  setDestinations(items);
  setIsRouteChanged(true);
  logEvent({
    action: "Route Edit",
    params: {
      page: "Itinerary Page",
      event_category: "Drag and Drop",
      event_label: "Edit",
      event_action: "Edit destinations",
    },
  });
};

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? "rgb(229 231 235)" : "white",
  margin: `0 0 15px 0`,
  borderRadius: "8px",
  ...draggableStyle,
});



export const CustomMapPin = ({ color = '#FF0303', size = 32 }) => (
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

// Handle removing a destination
export const handleRemoveDestination = (
    e,
    index,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    setDestinationChanges,
    setIsRouteChanged
) => {
    e.stopPropagation();
    // setDestinationChanges(true);

    setDestinations((prev) => {
        const updatedDestinations = prev.filter((dest, i) => i !== index);
        updateLatLong(updatedDestinations);
        updateDestinationsDates(updatedDestinations);
        return updatedDestinations;
    });

    setIsRouteChanged(true)
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

// Handle editing a destination
export const handleEditDestination = (setPopUp, setIsRouteChanged) => {
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
    setIsRouteChanged(true);
};



export const handleDestinationSearch = async (
    value,
    startingCity,
    endingCity,
    setSearchResults
) => {
    try {
        const instance = startingCity || endingCity
            ? axiossearchstartinginstance
            : axiossearchinstance;

        const results = await instance.get(
            startingCity || endingCity ? `?q=${value}` : `?type=City&q=${value}`
        );

        setSearchResults(results.data);
    } catch (err) {
        console.error("Search error:", err);
    }
};

// 🖊️ Handle typing in search input
export const handleSearchInput = (e, setSearch) => {
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

// 📍 Set selected destination
export const handleSetDestination = (i, searchResults, setSearch, setDestination, setSearchResults) => {
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


export const handleSetNights = (minus, setNights) => {
    setNights((prev) => (minus ? (prev === 1 ? prev : prev - 1) : prev + 1));

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

// ✅ Update destination in state
export const handleUpdateDestination = ({
  index,
  destination,
  nights,
  setDestinations,
  setDestinationChanges,
  updateDestinationsDates,
  updateLatLong,
  setPopUp,
  isAddMode = false,
  setIsRouteChanged
}) => {
  setIsRouteChanged(true);
  
  setDestinations((prev) => {
    const destinations = [...prev];
    
    const formattedDestination = {
      ...destination,
      checkin_date: formatDateToAPI(destination.checkin_date),
      checkout_date: formatDateToAPI(destination.checkout_date),
      start_date: formatDateToAPI(destination.start_date),
      end_date: formatDateToAPI(destination.end_date),
    };
    
    const updatedDestination = {
      startingCity: false,
      endingCity: false,
      cityData: {
        ...formattedDestination,
        nights,
        duration: nights,
        color: CITY_COLOR_CODES[(destinations.length - 1) % 7],
      },
    };

    if (isAddMode) {
      destinations.splice(destinations.length - 1, 0, updatedDestination);
    } else {
      const curDestination = destinations[index];
      if (!curDestination) return destinations;

      if (curDestination.startingCity || curDestination.endingCity) {
        destinations[index] = {
          startingCity: curDestination.startingCity,
          endingCity: curDestination.endingCity,
          cityData: {
            ...formattedDestination,
            duration: nights,
            place_id: destination?.place_id,
          },
        };
      } else {
        destinations[index] = {
          startingCity: curDestination.startingCity,
          endingCity: curDestination.endingCity,
          cityData: {
            ...formattedDestination,
            nights,
            color: curDestination.cityData.color,
            duration: nights,
          },
        };
      }
    }

    updateDestinationsDates(destinations);
    updateLatLong(destinations);
    return destinations;
  });

  if (setPopUp) setPopUp(false);

  logEvent({
    action: "Route Edit",
    params: {
      page: "Itinerary Page",
      event_category: "Update Destination",
      event_label: isAddMode ? "Add" : "Update",
      event_action: isAddMode ? "Add destination" : "Update destination",
    },
  });
};