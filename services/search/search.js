import axios from 'axios';
import { CONTENT_SERVER_HOST, MERCURY_HOST } from '../constants';

// const axiossearchinstance = axios.create({
//   baseURL: CONTENT_SERVER_HOST + '/search/',
// });

const axiossearchinstance = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/geos/search/',
});

export default axiossearchinstance;
