import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import axiosTaxiSearch from "../../../services/bookings/TaxiSearch";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { connect } from "react-redux";
import Button from "../../ui/button/Index";
import LogInModal from "../Login";
import SectionOne from "./SectionOne";
import LoadingLottie from "../../ui/LoadingLottie";
import TaxiSearched from "./taxi-searched/Index";
import Drawer from "../../ui/Drawer";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import { fetchTransferMode } from "../../../services/bookings/FetchTaxiRecommendations";

const GridContainer = styled.div`
@media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;

    @media screen and (min-width: 768px) {

    }
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  width: 97%;
  position: relative;
  margin: auto;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
    width: 90%;
  }
`;

const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;

const Booking = (props) => {
  let isPageWide = media("(min-width: 768px)");
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
        style={{ zIndex: 1501 }}
        className="font-lexend"
        show={props.showTaxiModal}
        onHide={props.setHideTaxiModal}
        mobileWidth={"100%"}
        width="50%"
      >
        <SectionOne
          selectedBooking={props.selectedBooking}
          setHideTaxiModal={props.setHideTaxiModal}
          handleTransferEdit={handleTransferEdit}
          oCityData={props?.oCityData}
          dCityData={props?.dCityData}
          mercury={props?.mercury}
          setIsMercury={setIsMercury}
        ></SectionOne>

        <div>
          <GridContainer style={{ clear: "right" }}>
            <ContentContainer style={{ position: "relative" }}>
              {updateBookingState ? (
                <div
                  style={{
                    width: "max-content",
                    margin: "auto",
                    height: isPageWide ? "80vh" : "40vh",
                  }}
                  className="center-div text-center font-lexend"
                >
                  <LoadingLottie height="5rem" width="5rem" margin="none" />
                  Please wait while we update your bookings
                </div>
              ) : null}

              {!noResults && !error && !updateBookingState ? (
                <OptionsContainer id="options">
                  <div style={{ clear: "right" }}>
                    {optionsJSX.length
                      ? optionsJSX
                      : moreOptionsJSX.length
                      ? moreOptionsJSX
                      : null}
                    {loading && !optionsJSX.length ? <Skeleton /> : null}
                  </div>

                  {updateLoadingState ? (
                    <div className="center-div" style={{}}>
                      <LoadingLottie
                        height="5rem"
                        width="5rem"
                        margin="1rem auto"
                      />
                    </div>
                  ) : null}

                  {viewMoreStatus && !optionsJSX.length ? (
                    <Button
                      boxShadow
                      onclickparam={null}
                      onclick={_loadAccommodationsHandler}
                      margin="0.25rem auto"
                      borderWidth="1px"
                      borderRadius="2rem"
                      padding="0.25rem 1rem"
                    >
                      View More
                    </Button>
                  ) : null}
                </OptionsContainer>
              ) : null}

              {noResults ? (
                <OptionsContainer className="font-lexend center-div text-center">
                  Oops, we couldn't find what you were searching but we are
                  already adding new and approved accommodations to our database
                  everyday!
                </OptionsContainer>
              ) : null}

              {error ? (
                <OptionsContainer className="font-lexend center-div text-center">
                  Oops, There seems to be a problem, please try again later!
                </OptionsContainer>
              ) : null}
            </ContentContainer>
          </GridContainer>
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
