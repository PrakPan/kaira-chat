import axios from 'axios';
import {CONTENT_SERVER_HOST, MERCURY_HOST} from '../constants';

// const instance = axios.create({
//     baseURL: CONTENT_SERVER_HOST+"/search/all/"
// })

const instance = axios.create({
    baseURL: MERCURY_HOST+"/api/v1/geos/search"
})

export default instance;