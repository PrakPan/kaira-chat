import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import axiostaxigozoinstance from "../../../services/bookings/FetchTaxiRecommendationsGozo";
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

  useEffect(() => {
    setError(false);
    if (!props.alternates && props.showTaxiModal) {
      let params = null;
      try {
        if (props.selectedBooking.transfer_type === "Intercity one-way") {
          params = {
            transfer_type: "Intercity one-way",
            search_by: "name",
            locations:
              props.selectedBooking.city +
              "," +
              props.selectedBooking.destination_city,
            distance: Math.trunc(
              props.selectedBooking.costings_breakdown.distance.value
            ),
          };
        } else
          params = {
            transfer_type: "Intercity round-trip",
            duration: props.selectedBooking.costings_breakdown.duration.value,
            distance: Math.trunc(
              props.selectedBooking.costings_breakdown.distance.value
            ),
          };
      } catch {
        params = {
          transfer_type: "Intercity one-way",
          search_by: "name",
          locations: "Munnar,Kochi",
        };
      }
      setLoading(true);
      setUpdateLoadingState(false);
      setMoreOptionsJSX([]);

      axiostaxigozoinstance
        .post("/", {
          booking_id: props.selectedBooking.id,
          tripType: props.selectedBooking.transfer_type,
          cabType: [],
          startDate: props.selectedBooking.check_in,
        })
        .then((res) => {
          if (
            res.data.data &&
            res.data.data.cabRate &&
            res.data.data.cabRate.length
          ) {
            setNoResults(false);
            let options = [];
            for (var i = 0; i < res.data.data.cabRate.length; i++) {
              options.push(
                <TaxiSearched
                  _updateSearchedTaxi={_updateSearchedTaxi}
                  selectedBooking={props.selectedBooking}
                  getPaymentHandler={props.getPaymentHandler}
                  _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                  data={{
                    ...res.data.data.cabRate[i],
                    estimatedDuration: res.data.data.estimatedDuration,
                    trace_id: res.data.trace_id,
                  }}
                ></TaxiSearched>
              );
            }
            if (!options.length) setNoResults(true);
            setMoreOptionsJSX(options);
          } else {
            setNoResults(true);
            setViewMoreStatus(false);
            setMoreOptionsJSX([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
          props.openNotification({
            type: "error",
            text: "There seems to be a problem, please try again later!",
            heading: "Error!",
          });
        });
    }
  }, [props.alternates, props.budget, props.showTaxiModal]);

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

  if (props.token)
    return (
      <div>
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
      </div>
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
