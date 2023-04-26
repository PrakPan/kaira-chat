import axios from 'axios';
import { MIS_SERVER_HOST } from '../../constants';

const routes = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/itinerary/routes',
});

export default routes;
