import axios from 'axios';
import {API_SERVER_HOST} from '../constants';

const instance = axios.create({
    baseURL: API_SERVER_HOST+"/search/all/?type=Location"
})

export default instance