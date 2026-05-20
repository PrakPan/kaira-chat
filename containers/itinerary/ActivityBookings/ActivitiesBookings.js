import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import ActivitiesSummary from "../../../components/Activities/ActivitiesSummary";
import VisaDetailDrawer from "../../../components/drawers/visaDetails/VisaDetailDrawer";
import EsimDetailDrawer from "../../../components/drawers/esimDetails/EsimDetailDrawer";
import {
  addAncillaryBooking,
  removeAncillaryBooking,
} from "../../../store/actions/ancillaryBookings";

const BOOKING_TYPE_CONFIG = {
  eSIM: { label: "eSIM", bg: "bg-[#DDF4C5]", text: "text-[#2A6800]"},
  Visa: { label: "Visa", bg: "bg-[#F5F0FF]", text: "text-[#5B1DB3]" },
  
};

const ActivitiesBookings = (props) => {
  const dispatch = useDispatch();
  const [showActivities, setShowActivities] = useState(false);
  const [selectedAncillary, setSelectedAncillary] = useState(null);
  const [showVisaDrawer, setShowVisaDrawer] = useState(false);
  const [showEsimDrawer, setShowEsimDrawer] = useState(false);
  const ancillaries = useSelector((state) => state.AncillaryBookings) || [];

  const handleChangeAncillary = (ancillary) => {
    setSelectedAncillary(ancillary);
    if (ancillary.booking_type === "Visa") setShowVisaDrawer(true);
    else if (ancillary.booking_type === "eSIM") setShowEsimDrawer(true);
  };

  const handleDrawerClose = () => {
    setShowVisaDrawer(false);
    setShowEsimDrawer(false);
    setSelectedAncillary(null);
  };

  const handleAncillaryAdded = (booking, replaceId) => {
    if (booking?.id) dispatch(addAncillaryBooking(booking, replaceId));
    else if (replaceId) dispatch(removeAncillaryBooking(replaceId));
  };

  const handleAncillaryRemoved = (bookingId) => {
    if (bookingId) dispatch(removeAncillaryBooking(bookingId));
  };

  return (
    <div id="activities" className="w-full md:w-auto mb-[80px] md:mb-0">
      {showActivities && (
        <div className="mb-8 cursor-pointer mb-2 mt-8 font-bold ttw-type-h3 group text-[#262626] transition duration-300 max-w-fit">
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
          <div className="cursor-pointer mb-2 mt-8 font-bold ttw-type-h3 group text-[#262626] transition duration-300 max-w-fit">
            Ancillaries
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
          </div>
          {ancillaries.map((ancillary, index) => {
            const typeConfig = BOOKING_TYPE_CONFIG[ancillary.booking_type];
            return (
              <div
                key={ancillary.id || index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 mb-3 rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#262626] ttw-type-body leading-tight">
                      {ancillary.name}
                    </span>
                    {typeConfig && (
                      <span className={`ttw-type-small font-500 px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.text}`}>
                        {typeConfig.label}
                      </span>
                    )}
                  </div>

                  {ancillary.check_in && ancillary.check_out && (
                    <span className="ttw-type-body text-gray-500">
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

                  {/* {ancillary.currency && ancillary.total_booking_cost > 0 && (
                    <span className="ttw-type-body-strong text-[#262626]">
                      {ancillary.currency}{" "}
                      {ancillary.total_booking_cost.toLocaleString()}
                    </span>
                  )} */}
                </div>

                <div className="flex flex-row sm:flex-row items-center gap-2 flex-shrink-0">
                  {ancillary.visa?.checklist_file && (
                    <a
                      href={ancillary.visa.checklist_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black no-underline"
                    >
                      <button className="ttw-btn-secondary whitespace-nowrap">
                        Download Checklist
                      </button>
                    </a>
                  )}
                  {(ancillary.booking_type === "Visa" || ancillary.booking_type === "eSIM") && (
                    <button
                      className="ttw-btn-secondary whitespace-nowrap"
                      onClick={() => handleChangeAncillary(ancillary)}
                    >
                      View Detail
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <VisaDetailDrawer
        show={showVisaDrawer}
        visa={selectedAncillary?.visa}
        bookingId={selectedAncillary?.id}
        showManageActions
        onHide={handleDrawerClose}
        onAdded={handleAncillaryAdded}
        onRemoved={handleAncillaryRemoved}
        onBooked={handleDrawerClose}
      />
      <EsimDetailDrawer
        show={showEsimDrawer}
        pkg={selectedAncillary?.external_data?.package}
        bookingId={selectedAncillary?.id}
        showManageActions
        onHide={handleDrawerClose}
        onAdded={handleAncillaryAdded}
        onRemoved={handleAncillaryRemoved}
        onBooked={handleDrawerClose}
      />
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
