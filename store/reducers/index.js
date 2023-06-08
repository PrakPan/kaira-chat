import { combineReducers } from 'redux';
import authReducer from './auth';
import experience from './experience';
import Updateloading from './Updateloading';
import ActiveComponent from './ActiveComponent';
import { HYDRATE } from 'next-redux-wrapper';

const rootReducer = combineReducers({
  auth: authReducer,
  experience: experience,
  Updateloading: Updateloading,
  ActiveComponent: ActiveComponent,
});

export default rootReducer;
