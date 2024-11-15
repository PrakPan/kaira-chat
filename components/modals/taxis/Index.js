import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import routeAlternates from "../../../services/itinerary/brief/routeAlternates";
import axiosRoundTripInstance from "../../../services/itinerary/brief/roundTripSuggestion";
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
  const [alternateRoutes, setAlternateRoutes] = useState({});
  const [loadingAlternates, setLoadingAlternates] = useState(true);
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [alternatesError, setAlternatesError] = useState(null);

  useEffect(() => {
    if (props.showTaxiModal) {
      fetchData();
    }
  }, [props.alternates, props.budget, props.showTaxiModal]);

  const fetchData = () => {
    setError(false);
    setLoading(true);
    setUpdateLoadingState(false);
    setOptionsJSX([]);

    const requestData = {
      trips: [
        {
          start_date: props.selectedBooking.check_in,
          // start_time: "12:30",
          trip_type: "one-way",
          origin: {
            city_id: props.selectedBooking?.origin?.city_id,
            hub_id: null,
            gmaps_place_id: null,
            address: props.selectedBooking?.origin?.city_name,
            coordinates: {
              latitude: null,
              longitude: null
            }
          },
          destination: {
            city_id: props.selectedBooking?.destination?.city_id,
            hub_id: null,
            gmaps_place_id: null,
            address: props.selectedBooking?.destination?.city_name,
            coordinates: {
              latitude: null,
              longitude: null
            }
          }
        }
      ]
    }

    axiosTaxiSearch.post("", requestData).then(res => {
      if (res.data.success) {
        setNoResults(false);

        let options = [];
        for (var i = 0; i < res.data?.data?.quotes?.length; i++) {
          options.push(
            <TaxiSearched
              setHideBookingModal={props.setHideBookingModal}
              _updateSearchedTaxi={_updateSearchedTaxi}
              selectedBooking={props.selectedBooking}
              getPaymentHandler={props.getPaymentHandler}
              _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
              data={{
                ...res.data.data.quotes[i],
                distance: res.data.data.distance,
                duration: res.data.data.duration,
                trace_id: res.data.trace_id,
              }}
            ></TaxiSearched>
          );
        }
        if (!options.length) setNoResults(true);
        setOptionsJSX(options);
      } else {
        setNoResults(true);
        setViewMoreStatus(false);
        setOptionsJSX([]);
      }
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      setError(true);
      props.openNotification({
        type: "error",
        text: "There seems to be a problem, please try again later!",
        heading: "Error!",
      });
    })
  }

  const _updateSearchedTaxi = ({
    itinerary_id,
    taxi_type,
    transfer_type,
    duration,
    total_taxi,
  }) => {
    setUpdateBookingState(true);

    let updated_bookings_arr = [
      {
        id: props.selectedBooking.id,
        booking_type: "Taxi",
        itinerary_type: "Tailored",
        user_selected: true,
        itinerary_id: itinerary_id,
        taxi_type: taxi_type,
        transfer_type: transfer_type,
        costings_breakdown: {
          duration: {
            value: Math.trunc(duration),
          },
          total_taxi: total_taxi,
        },
      },
    ];
    axiosbookingupdateinstance
      .post("?booking_type=Taxi,Bus,Ferry", updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateTaxiBookingHandler(res.data.bookings);
        setTimeout(function () {
          props.getPaymentHandler();
        }, 1000);
        setUpdateBookingState(false);
      })
      .catch((err) => {
        setUpdateBookingState(false);
        props.openNotification({
          type: "error",
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
        });
      });
  };

  const roundTripSuggestion = () => {
    setLoadingAlternates(true);
    axiosRoundTripInstance
      .get(`?itinerary_id=${props?.itinerary_id}`)
      .then((response) => {
        const results = response.data;

        for (let i = 0; i < results.length; i++) {
          if (
            results[i].success &&
            results[i].transfer_type === "Intercity round-trip"
          ) {
            setRoundTripSuggestions(results[i]);
          } else if (
            results[i].success &&
            results[i].transfer_type === "Multicity"
          ) {
            setMultiCitySuggestions(results[i]);
          }
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        console.log("[ERROR][TransferEdit]: ", err);
        setLoadingAlternates(false);
      });
  };

  const handleTransferEdit = (e) => {
    setAlternatesError(null)
    setLoadingAlternates(true)
    setShowTransferEditDrawer(true);
    roundTripSuggestion();
    routeAlternates
      .get(`/?route_id=` + props.transferId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data.routes.length > 0) {
          const data = response.data;
          setAlternateRoutes(data);
        } else {
          setAlternatesError(
            "No route found, please get in touch with us to complete this booking!"
          );
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        setLoadingAlternates(false);
        setAlternatesError(
          "No Route Found, please get in touch with us to complete this booking!"
        );
      });
  };

  if (props.token)
    return (
      <>
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
                    already adding new and approved accommodations to our
                    database everyday!
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
        </Drawer>

        <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={showTransferEditDrawer}
          setShowDrawer={setShowTransferEditDrawer}
          selectedTransferHeading={props.selectedTransferHeading}
          origin={props.selectedBooking?.city}
          destination={props.selectedBooking?.destination_city}
          alternateRoutes={alternateRoutes}
          roundTripSuggestions={roundTripSuggestions}
          multiCitySuggestions={multiCitySuggestions}
          loadingAlternates={loadingAlternates}
          alternatesError={alternatesError}
          day_slab_index={props.daySlabIndex}
          element_index={props.elementIndex}
          fetchData={props?.fetchData}
          setShowLoginModal={props?.setShowLoginModal}
          check_in={props?.check_in}
          _GetInTouch={props._GetInTouch}
        />
      </>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
