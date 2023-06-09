import axios from 'axios';
import {MIS_SERVER_HOST} from '../constants';


const myplans= axios.create({
    baseURL: MIS_SERVER_HOST+'/sales/my_plans',
})

export default myplans;
