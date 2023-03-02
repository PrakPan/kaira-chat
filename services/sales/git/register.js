import axios from 'axios';
import {MIS_SERVER_HOST} from '../../constants';


const register = axios.create({
    baseURL: MIS_SERVER_HOST+'/sales/itinerary/users/verify',
})

export default register;
