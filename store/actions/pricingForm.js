import * as actionTypes from "./actionsTypes";

// Replace the entire pricing-form slice with `payload`.
export const setPricingForm = (payload) => ({
  type: actionTypes.SET_PRICING_FORM,
  payload,
});

// Shallow-merge `payload` into the current pricing-form slice. This is the
// primary updater used while the user answers the final pricing questions.
export const updatePricingForm = (payload) => ({
  type: actionTypes.UPDATE_PRICING_FORM,
  payload,
});

// Clear the slice back to its initial state (called on New Chat / fresh session).
export const resetPricingForm = () => ({
  type: actionTypes.RESET_PRICING_FORM,
});

export default setPricingForm;
