import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  hasUnreadMessages: false,
  sessionId: null,
  shouldResetSession: false,
  resetTimestamp: null,
};

const chatStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UNREAD_MESSAGES:
      return {
        ...state,
        hasUnreadMessages: action.payload,
      };

    case actionTypes.RESET_CHAT_SESSION:
      return {
        ...state,
        shouldResetSession: true,
        resetTimestamp: Date.now(),
        sessionId: null,
        hasUnreadMessages: false,
      };

    case actionTypes.SET_CHAT_SESSION_ID:
      return {
        ...state,
        sessionId: action.payload,
        shouldResetSession: false,
        resetTimestamp: null,
      };

    case actionTypes.CLEAR_RESET_FLAG:
      return {
        ...state,
        shouldResetSession: false,
      };

    default:
      return state;
  }
};

export default chatStateReducer;
