import { SET_CURRENCY } from '../actions/actionsTypes';
import { SET_CURRENCY_SYMBOLS } from '../actions/currencyActions';

const initialState = {
  currency: 'INR'
};

const currency = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENCY:
      return {
        currency: action.payload
      };
    
    default:
      return state;
  }
};

export default currency;
