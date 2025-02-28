import * as actionTypes from "../actions/actionsTypes";

const initialState={
    free_breakfast: true,
    is_refundable: false,
    budget: {
      price_lower_range: 3000,
      price_upper_range: 8000,
    },
    star_category: null,
    sort: "price: low to high",
    type: null,
    user_ratings: null,
    facilities: null,
    tags: null,
    occupancies: [
      {
        num_adults: 1,
        child_ages: []
      }
    ],
    trace_id:null
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_FILTERS:
            return {
                ...state,
                ...action.payload
            };
        case actionTypes.RESET_FILTERS:
            return initialState;
        default:
            return state;
    }
};

export default reducer;