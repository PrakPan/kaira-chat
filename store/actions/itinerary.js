import * as actionTypes from "./actionsTypes";

const setItinerary = (data) => ({
  type: actionTypes.SET_ITINERARY,
  payload: data,
});

export default setItinerary;


export const updateSinglePoiDetails = (res) => {

  return (dispatch, getState) => {
    const state = getState();
    const itinerary = state.Itinerary;

    const newItinerary = {
      ...itinerary,
      cities: itinerary?.cities?.map((city) => {
        if (city.id === res?.itinerary_city) {
          const updatedDayByDay = city.day_by_day.map((day, index) => {
            if (index === res?.day_by_day_index) {
              return {
                ...day,
                slab_elements: [...(day.slab_elements || []), { ...res, activity: null }],
              };
            }
            return day;
          });

          return {
            ...city,
            day_by_day: updatedDayByDay,
          };
        }
        return city;
      }),
    };

    dispatch({
      type: actionTypes.SET_ITINERARY,
      payload: newItinerary,
    });
  };

};

// Remove a slab_element at the given index in day_by_day[day_by_day_index] of
// the matching itinerary_city. Used by delete_poi_from_itinerary and
// delete_restaurant_from_itinerary bot effects — both carry an index into the
// flat slab_elements array (poi_index / restaurant_index) per the existing
// REST API contract in SlabElement.jsx / CityDrawer.jsx.
const removeSlabElementAt = (itinerary, itineraryCityId, dayIndex, slabIndex) => ({
  ...itinerary,
  cities: (itinerary?.cities ?? []).map((city) => {
    if (city?.id !== itineraryCityId) return city;
    const days = city?.day_by_day ?? [];
    return {
      ...city,
      day_by_day: days.map((day, idx) => {
        if (idx !== dayIndex) return day;
        const elements = [...(day?.slab_elements ?? [])];
        if (slabIndex >= 0 && slabIndex < elements.length) {
          elements.splice(slabIndex, 1);
        }
        return { ...day, slab_elements: elements };
      }),
    };
  }),
});

export const deletePoiFromItinerary = (data) => (dispatch, getState) => {
  const itinerary = getState().Itinerary;
  const next = removeSlabElementAt(
    itinerary,
    data?.itinerary_city_id,
    data?.day_by_day_index,
    data?.poi_index,
  );
  dispatch({ type: actionTypes.SET_ITINERARY, payload: next });
};

export const deleteRestaurantFromItinerary = (data) => (dispatch, getState) => {
  const itinerary = getState().Itinerary;
  const next = removeSlabElementAt(
    itinerary,
    data?.itinerary_city_id,
    data?.day_by_day_index,
    data?.restaurant_index,
  );
  dispatch({ type: actionTypes.SET_ITINERARY, payload: next });
};

export const deleteActivityFromItinerary = (data) => (dispatch, getState) => {
  const itinerary = getState().Itinerary;
  const bookingId = data?.booking_id;
  const next = {
    ...itinerary,
    cities: (itinerary?.cities ?? []).map((city) => ({
      ...city,
      day_by_day: (city?.day_by_day ?? []).map((day) => ({
        ...day,
        slab_elements: (day?.slab_elements ?? []).filter(
          (el) => el?.booking?.id !== bookingId,
        ),
      })),
      activities: (city?.activities ?? []).filter((a) => a?.id !== bookingId),
    })),
  };
  dispatch({ type: actionTypes.SET_ITINERARY, payload: next });
};