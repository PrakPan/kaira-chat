import { combineReducers } from "redux";
import authReducer from "./auth";
import experience from "./experience";
import Updateloading from "./Updateloading";
import ActiveComponent from "./ActiveComponent";
import Notification from "./Notification";
import Scroll from "./Scroll";
import UserLocation from "./UserLocation";
import ItineraryStartDate from "./ItineraryStartDate";
import ItineraryActivities from "./ItineraryActivities";
import ItineraryId from "./ItineraryId";
import ItineraryRoutes from "./ItineraryRoutes";

const rootReducer = combineReducers({
  auth: authReducer,
  experience: experience,
  Updateloading: Updateloading,
  ActiveComponent: ActiveComponent,
  Notification: Notification,
  scroll: Scroll,
  UserLocation: UserLocation,
  itineraryStartDate: ItineraryStartDate,
  itineraryActivities: ItineraryActivities,
  ItineraryId,
  ItineraryRoutes,
});

export default rootReducer;
