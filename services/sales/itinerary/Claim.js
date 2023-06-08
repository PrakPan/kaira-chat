import axios from 'axios';
import { MIS_SERVER_HOST } from '../../constants';

const Claims = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/itinerary/claim',
});

export default Claims;

