import axios from 'axios';
import { MIS_SERVER_HOST } from '../constants';

const updateaccommodations = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/bookings/add/',
});

export default updateaccommodations;
