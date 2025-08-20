const initialState = {
    showHotelDrawer: false,
  };
  
  const uiReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_SHOW_HOTEL_DRAWER":
        return {
          ...state,
          showHotelDrawer: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default uiReducer;
  