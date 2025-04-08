import * as actionTypes from "./actionsTypes";

export const setItineraryFilters=(data)=>({
    type: actionTypes.UPDATE_FILTERS,
    payload:data,
});

export const resetItineraryFilters=()=>({
    type: actionTypes.RESET_FILTERS,
});