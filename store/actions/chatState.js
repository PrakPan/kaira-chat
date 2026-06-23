import * as actionTypes from "./actionsTypes";

export const setUnreadMessages = (hasUnread) => ({
  type: actionTypes.SET_UNREAD_MESSAGES,
  payload: hasUnread,
});

export const resetChatSession = () => ({
  type: actionTypes.RESET_CHAT_SESSION,
});

export const setChatSessionId = (sessionId) => ({
  type: actionTypes.SET_CHAT_SESSION_ID,
  payload: sessionId,
});

export const clearResetFlag = () => ({
  type: actionTypes.CLEAR_RESET_FLAG,
});

// The customer this thread belongs to (from threads.get_by_id `customer_name`).
// Lets the chat avatar show the customer's initial in the P1/draft stage,
// before any itinerary (which carries its own customer_name) exists in redux.
export const setThreadCustomerName = (customerName) => ({
  type: actionTypes.SET_THREAD_CUSTOMER_NAME,
  payload: customerName ?? null,
});