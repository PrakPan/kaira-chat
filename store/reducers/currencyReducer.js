import { SET_CURRENCY_SYMBOLS } from '../actions/currencyActions';

const initialState = {
  symbols: {}
};

const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENCY_SYMBOLS:
      return {
        ...state,
        symbols: action.payload
      };
    
    default:
      return state;
  }
};

export default currencyReducer;
