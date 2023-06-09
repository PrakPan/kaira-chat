import axios from 'axios';
import {CONTENT_SERVER_HOST} from '../constants';

const instance = axios.create({
    baseURL: CONTENT_SERVER_HOST+"/search/all/?type=Location"
})

export default instance