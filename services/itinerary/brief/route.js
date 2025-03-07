import axios from 'axios';
import { MERCURY_HOST, MIS_SERVER_HOST } from '../../constants';

const routes = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/itinerary/routes',
});

export const axiosCityDataById = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/geos/city',
});

export default routes;
