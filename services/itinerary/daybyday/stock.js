import axios from 'axios';
import {MIS_SERVER_HOST} from '../../constants';


const stock = axios.create({
    baseURL: MIS_SERVER_HOST+'/itinerary/preview/day_by_day/',
})

export default stock;
