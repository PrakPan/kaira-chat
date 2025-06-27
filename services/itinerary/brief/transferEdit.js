import axios from 'axios';
import { MIS_SERVER_HOST, MERCURY_HOST } from '../../constants';

const transferEdit = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/bookings/transfer/update/',
});

export default transferEdit;

export const routeDetails = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/geos/route/'
})

export const otherTransferSearch = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/transfers/'
})
