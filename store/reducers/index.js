import { combineReducers } from 'redux';
import authReducer from './auth';
import experience from './experience';
import Updateloading from './Updateloading';

import { HYDRATE } from 'next-redux-wrapper';

const rootReducer = combineReducers({
  auth: authReducer,
  experience: experience,
  Updateloading: Updateloading,
});

export default rootReducer;
