import React, { useState } from "react";
import { connect } from "react-redux";
import ActivitiesSummary from "../../../components/Activities/ActivitiesSummary";

const ActivitiesBookings = (props) => {
  const [showActivities, setShowActivities] = useState(false);

  return (
    <div
      id="activities"
      className="w-full lg:w-auto"
      style={{ width: "calc(54vw + 30px)" }}
    >
      {showActivities && (
        <div className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit">
          Activities
          <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
        </div>
      )}
      {props?.itinerary?.cities?.map((city, index1) => {
        return city?.activities?.map((item, index) => {
          {
            showActivities == false && setShowActivities(true);
          }
          return (
            <ActivitiesSummary
              city={city}
              item={item}
              index={index}
              index1={index1}
              setShowLoginModal={props?.setShowLoginModal}
            />
          );
        });
      })}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
    itinerary: state.Itinerary,
  };
};

export default connect(mapStateToPros)(ActivitiesBookings);
