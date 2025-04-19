import * as actionTypes from "./actionsTypes";

export const SetCallPaymentInfo = (data) => ({
  type: actionTypes.SET_CALL_PAYMENT_INFO,
  payload: data,
});
export default SetCallPaymentInfo