import axios from 'axios';
import {MERCURY_HOST} from '../constants';

const instance = axios.create({
    baseURL: MERCURY_HOST+"/api/v1/user/login/"
})

export default instance;

export const logoutinstance = axios.create({
    baseURL: MERCURY_HOST + "/api/v1/user/logout/"
})