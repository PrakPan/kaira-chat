import * as actionTypes from "./actionsTypes";

export const setStays = (data) => ({
  type: actionTypes.SET_STAYS,
  payload: data,
});

export const updateStays = (bookingIdToDelete) => {
  // console.log("Inside Stays Redux", bookingIdToDelete);
  return (dispatch, getState) => {
    const state = getState();
    const updatedData = state.Stays.map((category) =>
      category?.id === bookingIdToDelete ? { ...category, id: "" } : category
    );
    //  console.log("Updated Data ", updatedData);

    dispatch({
      type: actionTypes.UPDATE_STAYS,
      payload: updatedData,
    });
  };
};


export const addNewStay = (data) => {
  return (dispatch, getState) => {
    const state = getState();
    const updatedData = [...state.Stays, data];

    dispatch({
      type: actionTypes.UPDATE_STAYS,
      payload: updatedData,
    });
  };
};

export const updateSingleStayCityAndCheckInWise = (data) => {
  return (dispatch, getState) => {
    const state = getState();
    const stays = state.Stays;
    if (data?.itinerary_city && !data.itinerary_city_id) {
      data['itinerary_city_id'] = data?.itinerary_city
    }

    let found = false;
    let inserted = false;

    const updatedStays = [];

    for (let i = 0; i < stays.length; i++) {
      const stay = stays[i];

      // If same city and check-in, replace
      if (stay.itinerary_city_id === data.itinerary_city_id && stay.check_in === data.check_in) {
        updatedStays.push(data);
        found = true;
      } else {
        // Insert before the next different city or before a later check-in (optional logic)
        if (
          !found &&
          !inserted &&
          stay.city_id === data.city_id &&
          new Date(data.check_in) < new Date(stay.check_in)
        ) {
          updatedStays.push(data);
          inserted = true;
        }

        updatedStays.push(stay);
      }
    }

    // If not replaced or inserted, push after last matching city_id
    if (!found && !inserted) {
      let inserted = false;

      for (let i = updatedStays.length - 1; i >= 0; i--) {
        if (updatedStays[i].city_id === data.city_id) {
          updatedStays.splice(i + 1, 0, data);
          inserted = true;
          break;
        }
      }

      // If no matching city_id found at all, push at the end
      if (!inserted) {
        updatedStays.push(data);
      }
    }

    dispatch({
      type: actionTypes.SET_STAYS,
      payload: updatedStays,
    });
  };
};
