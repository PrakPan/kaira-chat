import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import ActivitiesSummary from "../../../components/Activities/ActivitiesSummary";

const ActivitiesBookings = (props) => {
  const [showActivities, setShowActivities] = useState(false);
  const ancillaries = useSelector((state) => state.AncillaryBookings) || [];

  return (
    <div id="activities" className="w-full  md:w-auto mb-[80px] md:mb-0">
      {showActivities && (
        <div className="mb-8 cursor-pointer  mb-2  mt-8 font-bold text-xl group text-[#262626] transition duration-300 max-w-fit">
          Activities
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
        </div>
      )}
      {props?.itinerary?.cities?.map((city, index1) => {
        return city?.activities?.map((item, index) => {
          if (showActivities === false) {
            setShowActivities(true);
          }

          return (
            <ActivitiesSummary
              city={city}
              item={item}
              key={index1 + "-" + index}
              index={index}
              index1={index1}
              setShowLoginModal={props?.setShowLoginModal}
            />
          );
        });
      })}

      {ancillaries.length > 0 && (
        <div className="mt-8">
          <div className="cursor-pointer mb-2 mt-8 font-bold text-xl group text-[#262626] transition duration-300 max-w-fit">
            Ancillaries
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
          </div>
          {ancillaries.map((ancillary, index) => (
            <div
              key={ancillary.id || index}
              className="flex items-center justify-between p-4 mb-3 rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[#262626] text-base">
                  {ancillary.name}
                </span>
                {ancillary.booking_type && (
                  <span className="text-sm text-gray-500">
                    {ancillary.booking_type}
                  </span>
                )}
                {ancillary.check_in && ancillary.check_out && (
                  <span className="text-sm text-gray-500">
                    {new Date(ancillary.check_in).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(ancillary.check_out).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                {/* {ancillary.number_of_adults > 0 && (
                  <span className="text-xs text-gray-400">
                    {ancillary.number_of_adults} Adult
                    {ancillary.number_of_adults !== 1 ? "s" : ""}
                    {ancillary.number_of_children > 0 &&
                      `, ${ancillary.number_of_children} Child${ancillary.number_of_children !== 1 ? "ren" : ""}`}
                  </span>
                )} */}
                {/* {ancillary.currency && ancillary.total_booking_cost > 0 && (
                  <span className="text-sm font-medium text-[#262626]">
                    {ancillary.currency}{" "}
                    {ancillary.total_booking_cost.toLocaleString()}
                  </span>
                )} */}
              </div>
              <div className="flex items-start lg:items-center justify-start lg:justify-end w-full lg:w-auto">
                {ancillary.visa?.checklist_file && (
                  <a
                    href={ancillary.visa.checklist_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black no-underline"
                  >
                    <button className="ttw-btn-secondary w-full sm:w-auto ">
                      Download
                    </button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
