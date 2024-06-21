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
import Itinerary from "./Itinerary";
import ItineraryId from "./ItineraryId";
import ItineraryRoutes from "./ItineraryRoutes";
import Plan from "./Plan";
import Bookings from "./Bookings";
import Breif from "./Breif";

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
  Itinerary,
  ItineraryId,
  ItineraryRoutes,
  Plan,
  Bookings,
  Breif,
});

export default rootReducer;
