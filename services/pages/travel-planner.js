
import axios from 'axios';
import {API_SERVER_HOST} from '../constants';

const instance = axios.create({
    baseURL: API_SERVER_HOST+"/page"
})

export default instance;