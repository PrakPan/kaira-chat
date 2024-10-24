import axios from 'axios';
import {CONTENT_SERVER_HOST, MERCURY_HOST} from '../constants';

const instance = axios.create({
    baseURL: CONTENT_SERVER_HOST+"/recommendations/get_activity_elements"
})

export default instance;

export const activtySearch = axios.create({
    baseURL: MERCURY_HOST + "/api/v1/ancillaries/activity/search/"
})
