import axios from 'axios';
import {MIS_SERVER_HOST} from '../constants';


const edit = axios.create({
    baseURL: MIS_SERVER_HOST+'/sales/itinerary/edit',
})

export default edit;
