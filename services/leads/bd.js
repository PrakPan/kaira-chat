import axios from 'axios';
import {MIS_SERVER_HOST} from '../constants';


const tailored = axios.create({
    baseURL: MIS_SERVER_HOST+'/organization/generic/'
})

export default tailored
