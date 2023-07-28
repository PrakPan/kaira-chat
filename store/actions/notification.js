import * as actionTypes from "./actionsTypes";

export const openNotification = (data) => ({
  type: actionTypes.NOTIFICATION_OPEN,
  payload: data,
});

export const closeNotification = () => ({
  type: actionTypes.NOTIFICATION_CLOSE,
});