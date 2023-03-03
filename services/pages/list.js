
import axios from 'axios';
import {CONTENT_SERVER_HOST} from '../constants';

const instance = axios.create({
    baseURL: CONTENT_SERVER_HOST+"/page/list?country=India"
})

export default instance;