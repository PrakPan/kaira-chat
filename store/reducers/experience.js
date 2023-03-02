import * as actionTypes  from '../actions/actionsTypes';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    experience: null,
    pax: "1",
    couponInvalid: false,
    couponApplied: false,
    offerId: "",
    orderPlaced: false,
    durationSelected: 0,
}

const reducer = (state = initialState, action) => {
    switch( action.type){
        case HYDRATE:
            const nextState = {
                ...state, // use previous state
                ...action.payload, // apply delta from hydration
              }
              return nextState;
        case actionTypes.ORDER_SETORDERDETAILS: 
        return{
            ...state,
            ...action.orderDetails,
        }
        case actionTypes.ORDER_CREATIONSTARTED:
            return{
                ...state,
                checkoutStarted: true,
            }
        case actionTypes.ORDER_CREATED:
            return{
                ...state,
                checkoutStarted: false,
                orderCreated: true,
            }
        case actionTypes.ORDER_PLACED:
            return{
                ...initialState,
                orderPlaced: true,
            }
        case actionTypes.ORDER_COUPONAPPLIED:
            return{
                ...state,
                couponInvalid: false,
                couponApplied: true,
                offerId: action.offerId,
                couponCode: action.couponCode,
            }
        case actionTypes.ORDER_COUPONAINVALID:
            return{
                ...state,
                couponInvalid: true,
            }
        case actionTypes.ORDER_SETSALEID:
        return{
            ...state,
            saleId: action.saleId,
        }
        default:
            return state;
        }
        
}
export default reducer;