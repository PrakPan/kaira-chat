const initialState = {
  updateLoading: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_UPDATE_LOADING":
      return {
        ...state,
        updateLoading: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
