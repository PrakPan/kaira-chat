import axios from 'axios';
import { CONTENT_SERVER_HOST, MERCURY_HOST } from '../constants';

const instance = axios.create({
  baseURL: CONTENT_SERVER_HOST + '/poi/city',
});

export const cityDetail = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/geos/city/',
});

export default instance;
