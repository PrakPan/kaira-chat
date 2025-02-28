import axios from 'axios';
import {MIS_SERVER_HOST, MERCURY_HOST} from '../constants';


const fetchaccommodations = axios.create({
    baseURL: MIS_SERVER_HOST+'/service/accommodation/',
})

export default fetchaccommodations;

export const hotelDetails = axios.create({
    baseURL: MERCURY_HOST + '/api/v1/hotels/detail/',
})

export const bookingDetails = axios.create({
    baseURL: MERCURY_HOST + "/api/v1/itinerary/"
})