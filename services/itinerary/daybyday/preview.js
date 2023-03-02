import axios from 'axios';
import {MIS_SERVER_HOST} from '../../constants';


const preview = axios.create({
    baseURL: MIS_SERVER_HOST+'/sales/itinerary/preview/day_by_day',
})

export default preview;
