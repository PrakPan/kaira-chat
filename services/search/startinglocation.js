import axios from 'axios';
import {CONTENT_SERVER_HOST} from '../constants';

const axiossearchstartinginstance = axios.create({
    baseURL: CONTENT_SERVER_HOST+"/search/start_locations/"
})

export default axiossearchstartinginstance;