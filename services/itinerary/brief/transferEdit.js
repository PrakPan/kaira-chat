import axios from 'axios';
import { MIS_SERVER_HOST } from '../../constants';

const transferEdit = axios.create({
  baseURL: MIS_SERVER_HOST + '/sales/bookings/transfer/update/',
});

export default transferEdit;
