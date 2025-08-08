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