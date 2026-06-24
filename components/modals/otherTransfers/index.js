import React, {  useState } from "react";
import { PulseLoader } from "react-spinners";
import { connect } from "react-redux";
import LogInModal from "../Login";
import SectionOne from "./SectionOne";
import { ItineraryUpdateLoader } from "../../revamp/common/components/loader";
import Drawer from "../../ui/Drawer";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";

const Booking = (props) => {
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showTransferEditDrawer, setShowTransferEditDrawer] = useState(false);
  const [isMercury, setIsMercury] = useState(false);

  const handleTransferEdit = (e) => {
    setShowTransferEditDrawer(true);
  };

  if (props.token)
    return (
      <Drawer
        anchor={"right"}
        backdrop
        bgColor="#fafaf5"
        style={{ zIndex: 1501 }}
        className="!overflow-y-hidden"
        show={props.showTaxiModal}
        onHide={props.setHideTaxiModal}
        mobileWidth={"100%"}
        width="50%"
      >
        <div className="h-screen flex flex-col overflow-hidden">
          <SectionOne
            selectedBooking={props.selectedBooking}
            setHideTaxiModal={props.setHideTaxiModal}
            handleTransferEdit={handleTransferEdit}
            oCityData={props?.oCityData}
            dCityData={props?.dCityData}
            mercury={props?.mercury}
            setIsMercury={setIsMercury}
          ></SectionOne>

          <div className="overflow-y-scroll flex-1 px-6 max-ph:px-4 pb-24 relative">
          {updateBookingState ? (
            <ItineraryUpdateLoader
              message="Please wait while we update your transfer"
              subMessages={[
                "Confirming your transfer…",
                "Arranging the details…",
                "Updating your transfer…",
              ]}
            />
          ) : null}

          {!noResults && !error && !updateBookingState ? (
            <div id="options" className="relative flex flex-col gap-2">
              <div>
                {optionsJSX.length
                  ? optionsJSX
                  : moreOptionsJSX.length
                  ? moreOptionsJSX
                  : null}
                {loading && !optionsJSX.length ? <Skeleton /> : null}
              </div>

              {updateLoadingState ? (
                <div className="flex items-center justify-center py-6">
                  <PulseLoader size={8} color="#0b1220" />
                </div>
              ) : null}

              {viewMoreStatus && !optionsJSX.length ? (
                <button
                  onClick={_loadAccommodationsHandler}
                  className="w-full mt-4 py-3 rounded-xl border border-[#ececec] ttw-type-small font-500 text-[#0b1220] hover:bg-[#f4f3ec] transition-colors disabled:opacity-50"
                >
                  View More
                </button>
              ) : null}
            </div>
          ) : null}

          {noResults ? (
            <div className="flex items-center justify-center text-center py-10">
              <p className="ttw-type-body text-[#445069]">
                Oops, we couldn't find what you were searching but we are
                already adding new and approved transfers to our database
                everyday!
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
              <p className="ttw-type-body text-[#445069]">
                Oops, There seems to be a problem, please try again later!
              </p>
              <button
                onClick={() => setError(false)}
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
              >
                Retry
              </button>
            </div>
          ) : null}
          </div>
        </div>

        {props?.mercury ? <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={showTransferEditDrawer}
          setShowDrawer={setShowTransferEditDrawer}
          selectedTransferHeading={props.selectedTransferHeading}
          origin={props.selectedBooking?.origin?.shortName || props?.oCityData?.gmaps_place_id || props?.oCityData?.city?.id}
          destination={props.selectedBooking?.destination?.shortName || props?.dCityData?.gmaps_place_id || props?.dCityData?.city?.id}
          day_slab_index={props.daySlabIndex}
          element_index={props.elementIndex}
          fetchData={props?.fetchData}
          setShowLoginModal={props?.setShowLoginModal}
          check_in={props?.check_in}
          _GetInTouch={props._GetInTouch}
          routeId={props.routeId}
          selectedBooking={props.selectedBooking}
          city={props?.city}
          dcity={props?.dcity}
          oCityData={props?.oCityData}
          dCityData={props?.dCityData}
          isMercury={isMercury}
          mercury={props?.mercury}
        /> 
        :
        <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={showTransferEditDrawer}
          setShowDrawer={setShowTransferEditDrawer}
          selectedTransferHeading={props.selectedTransferHeading}
          origin={props.selectedBooking?.origin?.shortName}
          destination={props.selectedBooking?.destination?.shortName}
          day_slab_index={props.daySlabIndex}
          element_index={props.elementIndex}
          fetchData={props?.fetchData}
          setShowLoginModal={props?.setShowLoginModal}
          check_in={props?.check_in}
          _GetInTouch={props._GetInTouch}
          routeId={props.routeId}
          selectedBooking={props.selectedBooking}
          isMercury={isMercury}
          city={props?.city}
          dcity={props?.dcity}
          oCityData={props?.oCityData}
          dCityData={props?.dCityData}
        />}
      </Drawer>
    );
  else
    return (
      <div>
        <LogInModal show={true} onhide={props.setHideTaxiModal}></LogInModal>
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
    plan: state.Plan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
