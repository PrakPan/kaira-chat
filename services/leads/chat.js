import axios from 'axios';
import { MIS_SERVER_HOST } from '../constants';

const tailoredLeadChat = axios.create({
  baseURL: MIS_SERVER_HOST + '/lead/chat',
});

export default tailoredLeadChat;
