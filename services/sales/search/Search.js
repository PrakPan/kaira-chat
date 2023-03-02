import axios from 'axios';
import {MIS_SERVER_HOST} from '../../constants';


const search = axios.create({
    baseURL: MIS_SERVER_HOST+'/sales/search',
})

export default search;
