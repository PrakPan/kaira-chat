import * as actionTypes from "./actionsTypes";

// Replace the entire intake-form slice with `payload`.
export const setIntakeForm = (payload) => ({
  type: actionTypes.SET_INTAKE_FORM,
  payload,
});

// Shallow-merge `payload` into the current intake-form slice. This is the
// primary updater used while the user fills the multi-step form.
export const updateIntakeForm = (payload) => ({
  type: actionTypes.UPDATE_INTAKE_FORM,
  payload,
});

// Clear the slice back to its initial state (called on New Chat / fresh session).
export const resetIntakeForm = () => ({
  type: actionTypes.RESET_INTAKE_FORM,
});

export default setIntakeForm;
