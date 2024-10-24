import axios from 'axios';
import { CONTENT_SERVER_HOST, MERCURY_HOST } from '../constants';

const instance = axios.create({
  baseURL: CONTENT_SERVER_HOST + '/poi/activity/detail/',
});

export default instance;

export const activityDetail = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/ancillaries/activity/',
});

export const activityBooking = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/sales/bookings/activity/create/',
});
