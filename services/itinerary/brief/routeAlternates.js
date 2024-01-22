import axios from 'axios';
import { CONTENT_SERVER_HOST } from '../../constants';

const routeAlternates = axios.create({
  baseURL: CONTENT_SERVER_HOST + '/poi/route/alternates',
});

export default routeAlternates;
