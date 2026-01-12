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