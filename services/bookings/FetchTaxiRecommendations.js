import axios from 'axios';
import {MIS_SERVER_HOST} from '../constants';


const fetchaccommodations = axios.create({
    baseURL: MIS_SERVER_HOST+'/sales/taxi/suggestion/',
})

export default fetchaccommodations;
