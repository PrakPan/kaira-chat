import * as actionTypes from "./actionsTypes";

const setCart = (data) => ({
  type: actionTypes.SET_CART,
  payload: data,
});

export default setCart;
