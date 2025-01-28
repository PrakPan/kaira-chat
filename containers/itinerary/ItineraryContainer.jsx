import * as authaction from "../../store/actions/auth";
import { connect, useDispatch } from "react-redux";
import ItineraryOverview from "../../components/itinerary/ItineraryOverview";

const ItineraryContainer = (props) => {
  return (
    <div className="bg-red-100 mt-[-5vh] w-[90%] md:w-[85%] mx-auto">
      <ItineraryOverview />
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    email: state.auth.email,
    otpSent: state.auth.otpSent,
    itinerary: state.Itinerary,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    openNotification: (payload) => dispatch(openNotification(payload)),
    setItinerary: (payload) => dispatch(setItinerary(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ItineraryContainer);
