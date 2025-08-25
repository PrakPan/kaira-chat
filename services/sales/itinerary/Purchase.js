import axios from 'axios';
import { MERCURY_HOST, MIS_SERVER_HOST } from '../../constants';

const myplans = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/itinerary/purchase',
});

export const paymentInitiate = axios.create({
  baseURL: MERCURY_HOST + "/payment/initiate/",
});
export default myplans;
