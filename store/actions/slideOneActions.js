import * as actionTypes from "./actionsTypes";

export const setSelectedCities = (id, input_id, data) => {
  return {
    type: actionTypes.SET_DESTINATIONS,
    payload: { id, input_id, data },
  };
};


export const setDateRange = (start, end) => ({
  type: actionTypes.SET_DATE_RANGE,
  payload: { start, end },
});

export const togglePreference = (preference) => ({
  type: actionTypes.TOGGLE_PREFERENCE,
  payload: preference,
});

export const resetSelectedCity = (input_id) => ({
  type: actionTypes.RESET_SELECTED_CITY,
  payload: input_id,
});

export const updateSelectedCity = (updatedData) => ({
  type: actionTypes.UPDATE_SELECTED_CITY,
  payload: updatedData,
});

export const deleteSelectedCity = (deletedId) => ({
  type: actionTypes.DELETE_SELECTED_CITY,
  payload: deletedId,
});

export const setCalendarDates = (start, end) => {
  console.log("start is: ", start)
  return {
    type: actionTypes.SET_CALENDAR_DATES,
    payload: { start, end },
  }
};

export const setDateType = (dateType) => ({
  type: actionTypes.SET_DATE_TYPE,
  payload: dateType,
});

export const setFixedDate = (start_date, end_date) => ({
  type: actionTypes.SET_FIXED_DATE,
  payload: { start_date, end_date },
});

export const setFlexibleDate = (month, year, duration) => ({
  type: actionTypes.SET_FLEXIBLE_DATE,
  payload: { month, year, duration },
});

export const setAnytimeDate = (duration) => ({
  type: actionTypes.SET_ANYTIME_DATE,
  payload: { duration },
});

export const resetDate = () => ({
  type: actionTypes.RESET_DATE,
});

export const setItineraryInitiateData = (payload) => ({
  type: actionTypes.SET_ITINERARY_INITIATE_DATA,
  payload,
});

export const setGroupType = (groupType) => ({
  type: actionTypes.SET_GROUP_TYPE,
  payload: groupType,
});

export const setNumberOfAdults = (adults) => ({
  type: actionTypes.SET_NUMBER_OF_ADULTS,
  payload: adults,
});

export const setNumberOfChildren = (children) => ({
  type: actionTypes.SET_NUMBER_OF_CHILDREN,
  payload: children,
});

export const setNumberOfInfants = (infants) => ({
  type: actionTypes.SET_NUMBER_OF_INFANTS,
  payload: infants,
});

export const setRoomConfiguration = (config) => ({
  type: actionTypes.SET_ROOM_CONFIGURATION,
  payload: config, // should be array [{adults, children, infants, childAges}]
});

export const setSubmitSecondSlide = (flag) => ({
  type: actionTypes.SET_SUBMIT_SECOND_SLIDE,
  payload: flag,
});

export const setAddHotels = (value) => ({
  type: actionTypes.SET_ADD_HOTELS,
  payload: value, // boolean
});

// Set Flights inclusion
export const setAddFlights = (value) => ({
  type: actionTypes.SET_ADD_FLIGHTS,
  payload: value, // boolean
});

// Set Activities + Transfers inclusion
export const setAddInclusions = (value) => ({
  type: actionTypes.SET_ADD_INCLUSIONS,
  payload: value, // boolean
});