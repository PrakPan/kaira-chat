import { combineReducers } from 'redux';
import authReducer from './auth';
import experience from './experience';
import {HYDRATE} from 'next-redux-wrapper';

const rootReducer = combineReducers({
    auth: authReducer,
      experience: experience
});

export default rootReducer;