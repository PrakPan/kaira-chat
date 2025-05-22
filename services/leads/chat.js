import axios from 'axios';
import { MERCURY_HOST, MIS_SERVER_HOST } from '../constants';

// const tailoredLeadChat = axios.create({
//   baseURL: MIS_SERVER_HOST + '/lead/chat',
// });

const tailoredLeadChat = axios.create({
  baseURL: MERCURY_HOST + '/api/v1/itinerary/',
});

export default tailoredLeadChat;
