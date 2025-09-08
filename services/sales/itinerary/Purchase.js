import axios from 'axios';
import { MERCURY_HOST, MIS_SERVER_HOST } from '../../constants';

const myplans = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/itinerary/purchase',
});

export const paymentInitiate = axios.create({
  baseURL: MERCURY_HOST + "/payment/initiate/",
});


export const fetchCoupons = axios.create({
  baseURL: `${MERCURY_HOST}/payment/coupons`,
});

export const applyCoupon = axios.create({
  baseURL: `${MERCURY_HOST}/payment/coupons/apply`,
});

export const removeCoupon = axios.create({
  baseURL: `${MERCURY_HOST}/payment/coupons/remove`,
});

export const repriceBookings = axios.create({
  baseURL: `${MERCURY_HOST}/api/v1/itinerary`,
});

export default myplans;
