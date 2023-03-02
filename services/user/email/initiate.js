import axios from 'axios';
import {CONTENT_SERVER_HOST} from '../../constants';

const instance = axios.create({
    baseURL: CONTENT_SERVER_HOST+"/user/verify_email/initiate"
})

export default instance;