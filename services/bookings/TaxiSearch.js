import axios from "axios";
import { MERCURY_HOST } from "../constants";

const axiosTaxiSearch = axios.create({
    baseURL: MERCURY_HOST + "/api/v1/transfers/taxi/search/",
});

export default axiosTaxiSearch;
