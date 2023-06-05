// Define action creators
import * as actionTypes from './actionsTypes';

export const setActiveComponent = (id) => ({
  type: actionTypes.SET_ACTIVE_COMPONENT,
  payload: id,
});
