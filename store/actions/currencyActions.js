import { SET_CURRENCY } from "./actionsTypes";

export const SET_CURRENCY_SYMBOLS = 'SET_CURRENCY_SYMBOLS';

export const setCurrencySymbols = (symbols) => ({
  type: SET_CURRENCY_SYMBOLS,
  payload: symbols
});

export const setCurrency = (currency) => ({
  type: SET_CURRENCY,
  payload: currency
});