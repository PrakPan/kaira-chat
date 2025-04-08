import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Menu from "../OldMenuV2";
import Spinner from "../../../containers/loaderbar/Index";
import OldSpinner from "../../../components/LoadingPage";
import axiosdaybydayinstance from "../../../services/itinerary/daybyday/preview";
import axiosbreifinstance from "../../../services/itinerary/brief/preview";
import * as authaction from "../../../store/actions/auth";
import { connect, useDispatch } from "react-redux";
import { ITINERARY_STATUSES } from "../../../services/constants";
import { TRAVELER_ITINERARIES } from "../../../services/constants";
import axiosPoiRoutes from "../../../services/itinerary/brief/route";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import Overview from "../../newitinerary/overview/Index";
import { openNotification } from "../../../store/actions/notification";
import { setItineraryStartDate } from "../../../store/actions/itineraryStartDate";
import { setItineraryRoutes } from "../../../store/actions/itineraryRoutes";
import setItinerary from "../../../store/actions/itinerary";
import setPlan from "../../../store/actions/plan";
import { setBookings } from "../../../store/actions/bookings";
import { setItineraryActivities } from "../../../store/actions/itineraryActivities";
import setBreif from "../../../store/actions/breif";
import axiosPaymentInstance from "../../../services/itinerary/payment";
import axiosBookingsInstance from "../../../services/itinerary/bookings";
import axiosPlanInstance from "../../../services/itinerary/plan";

const Container = styled.div`
  width: 90%;
  margin: 5vh auto 0 auto;
  @media screen and (min-width: 768px) {
    width: 85%;
    margin: -5vh auto 0 auto;
  }
`;

const Itinerary = (props) => {
  const router = useRouter();
  const [totalduration, setTotalduration] = useState(0);
  const [itineraryReleased, setItineraryReleased] = useState(false);
  const [itineraryDate, setItineraryDate] = useState("");
  const [booking, setBooking] = useState(null);
  const [itineraryLoading, setItineraryLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [cardUpdateLoading, setCardUpdateLoading] = useState(null);
  const [stayBookings, setStayBookings] = useState(null);
  const [transferBookings, setTransferBookings] = useState(null);
  const [activityBookings, setActivityBookings] = useState(null);
  const [flightBookings, setFlightBookings] = useState(null);
  const [selectingBooking, setSelectingBooking] = useState(null);
  const [stayFlickityIndex, setStayFlickityIndex] = useState(0);
  const [transferFlickityIndex, setTransferFlickityIndex] = useState(0);
  const [flightFlickityIndex, setFlightFlickityIndex] = useState(0);
  const [activityFlickityIndex, setActivityFlickityIndex] = useState(0);
  const [payment, setPayment] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isDatePresent, setIsDatePresent] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [travellerType, settravellerType] = useState(false);
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [group_type, setgroup_type] = useState(null);
  const [duration_time, setduration_time] = useState(null);
  const [hasUserPaid, setHasUserPaid] = useState(false);
  const [isPastTravelerItinerary, setIsPastTravelerItinerary] = useState(false);
  const [is_stock, setIsStock] = useState(false);
  const hasRendered = useRef(false);
  const [editRoute, setEditRoute] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasRendered.current) {
      if (props.token) getPaymentHandler();
    } else hasRendered.current = true;
  }, [props.token]);

  useEffect(() => {
    if (props.itinerary.name !== "Loading Itinerary") {
      const activities = getItineraryActivities();
      props.setItineraryActivities(activities);
    }
  }, [props.itinerary]);

  const getItineraryActivities = () => {
    let itenaryActivities = [];
    props.itinerary?.day_slabs.map((day_slab, index) => {
      day_slab?.slab_elements.map((element, index) => {
        if (element.element_type === "activity") {
          itenaryActivities.push({ activity: element, date: day_slab.slab });
        }
      });
    });
    return itenaryActivities;
  };

  const getBreifHandler = () => {
    axiosbreifinstance
      .get(`/?itinerary_id=` + props.id)
      .then((res) => {
        props.setBreif(res.data);
        if (res.data) {
          if (res.data.city_slabs) {
            if (res.data.city_slabs.length)
              for (var i = 0; i < res.data.city_slabs.length; i++) {
                if (res.data.city_slabs[i].duration)
                  setTotalduration(
                    totalduration + parseInt(res.data.city_slabs[i].duration),
                  );
              }
          }
        }
        if (res.data.city_slabs)
          if (!res.data.city_slabs.length)
            if (!props.breif.city_slabs)
              if (!props.breif.city_slabs.length)
                setTimeout(getBreifHandler, 3000);
      })
      .catch((error) => {
        window.location.href = "/thank-you";
      });
  };

  const getPaymentHandler = () => {
    setPaymentLoading(true);

    axiosPaymentInstance
      .post(
        "",
        {
          itinerary_type: "Tailored",
          itinerary_id: props.id,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        if (
          props.token &&
          !res.data.user_allowed_to_pay &&
          res.data.itinerary_status == ITINERARY_STATUSES.itinerary_unclaimed
        ) {
          authaction
            .ClaimItinary(props.id, props.token)
            .then((res) => {
              setPayment(res); //
              setPaymentLoading(false);
            })
            .catch((err) => {});
        } else {
          setPayment(res.data);
          setPaymentLoading(false);
        }
        let email = localStorage.getItem("email");
        if (props.token)
          for (var i = 0; i < res.data.registered_users.length; i++) {
            if (res.data.registered_users[i].email === email) {
              if (res.data.registered_users[i].payment_status)
                if (res.data.registered_users[i].payment_status === "captured")
                  setHasUserPaid(true);
              break;
            }
          }
      })
      .catch((error) => {
        setPaymentLoading(false);
      });
  };

  const getAccommodationAndActivitiesHandler = () => {
    let stay_bookings = [];
    let activity_bookings = [];
    let transfer_bookings = [];
    let flight_bookings = [];

    const access_token = localStorage.getItem("access_token");

    axiosBookingsInstance
      .get("?itinerary_id=" + props.id, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        getPaymentHandler();
        if (response.status === 200) {
          const data = response.data;
          for (var i = 0; i < data.bookings.length; i++) {
            if (data.bookings[i].booking_type === "Accommodation")
              stay_bookings.push(data.bookings[i]);
            else if (data.bookings[i].booking_type === "Activity")
              activity_bookings.push(data.bookings[i]);
            else {
              transfer_bookings.push(data.bookings[i]);
              if (data.bookings[i].booking_type === "Flight") {
                flight_bookings.push(data.bookings[i]);
              }
            }
          }

          props.setBookings({
            stayBookings: stay_bookings,
            activityBookings: activity_bookings.length
              ? activity_bookings
              : null,
            flightBookings: flight_bookings.length ? flight_bookings : null,
            transferBookings: transfer_bookings.length
              ? transfer_bookings
              : null,
          });

          setStayBookings(stay_bookings);
          if (activity_bookings.length) {
            setActivityBookings(activity_bookings);
          } else {
            setActivityBookings(null);
          }

          if (flight_bookings.length) {
            setFlightBookings(flight_bookings);
          } else {
            setFlightBookings(null);
          }

          if (transfer_bookings.length) {
            setTransferBookings(transfer_bookings);
          } else {
            setTransferBookings(null);
          }
        }
      })
      .catch((err) => {});
  };

  async function getRoutes(itinaryId) {
    const res = await axiosPoiRoutes.get(`/?itinerary_id=${itinaryId}`);
    const data = res.data;
    return data;
  }

  function fetchData(scroll = true) {
    if (scroll) window.scrollTo(0, 0);
    if (TRAVELER_ITINERARIES.includes(props.id))
      setIsPastTravelerItinerary(true);

    axiosdaybydayinstance
      .get(`/?itinerary_id=` + props.id)
      .then((res) => {
        if (res.data.day_slabs.length) {
          if (res.data.is_stock) setIsStock(true);

          props.setItinerary({
            ...res.data,
            images: res.data.images.filter((value) => value),
          });

          setItineraryLoading(false);
        } else {
        }
      })
      .catch((error) => {
        setItineraryLoading(false);
      });

    getBreifHandler();

    getRoutes(props.id)
      .then((res) => {
        props.setItineraryRoutes(res);
      })
      .catch((err) => {});

    axiosPlanInstance
      .get("?itinerary_id=" + props.id)
      .then((res) => {
        props.setPlan(res.data);
        dispatch(setItineraryStartDate({ date: res.data.start_date }));
        if (
          res.data.itinerary_status === ITINERARY_STATUSES.itinerary_not_created
        ) {
          alert(
            "Looks like the response took too long, please refresh and try again.",
          );
        } else {
          setUserEmail(res.data.user_email);
          settravellerType(res.data.experience_filters_selected);
          if (res.data.start_date) setIsDatePresent(true);
          setgroup_type(res.data.group_type);
          setduration_time(res.data.duration_number);
          setItineraryReleased(res.data.is_released_for_customer);
          setItineraryDate(res.data.created_at);
        }
      })
      .catch((error) => {});

    getAccommodationAndActivitiesHandler();
  }

  useEffect(() => {
    var IntervalTiming;
    if (router.query.t) IntervalTiming = (+router.query.t + 2) * 1000;
    if (!IntervalTiming) {
      fetchData();
    } else
      setTimeout(() => {
        fetchData();
      }, [IntervalTiming]);
  }, []);

  const _updateTransferBooking = (arr1, arr2) => {
    const combinedArray = [...arr1]; // Copy arr1 to avoid modifying the original array

    arr2.forEach((element) => {
      const newId = element.id;

      // Check if the ID already exists in the combined array
      const existingElementIndex = combinedArray.findIndex(
        (el) => el.id === newId,
      );

      if (existingElementIndex !== -1) {
        // Replace the existing element's value with the new value
        combinedArray[existingElementIndex] = element;
      } else {
        // Add the new element to the combined array
        combinedArray.push(element);
      }
    });

    return combinedArray;
  };

  const _updateFlightBookingHandler = (json) => {
    setShowFlightModal(false);
    setTransferBookings(_updateTransferBooking(transferBookings, json));
  };

  const _updateBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setBooking(json);
  };

  const _updateStayBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setStayBookings(_updateTransferBooking(stayBookings, json));
    props.setBookings({
      ...props.bookings,
      stayBookings: _updateTransferBooking(props.bookings.stayBookings, json),
    });
  };

  const _updateActivityBookingHandler = (json) => {
    setActivityBookings(json);
  };

  const _updateTransferBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowFlightModal(false);
    setTransferBookings(json);
  };

  const _updateTaxiBookingHandler = (json) => {
    setShowTaxiModal(false);

    setTransferBookings(_updateTransferBooking(transferBookings, json));
  };

  const _selectTaxiHandler = (
    bookings,
    booking_id,
    booking_name,
    booking_type,
    itinerary_id,
    tailored_id,
    itinerary_name,
    taxi_type,
    transfer_type,
    city_id,
    destination_city_id,
    duration,
    check_in,
  ) => {
    let data = [];
    setCardUpdateLoading(booking_id);
    data.push({
      id: booking_id,
      booking_type: booking_type,
      itinerary_type: "Tailored",
      user_selected: true,
      itinerary_id: itinerary_id,
      tailored_itinerary: tailored_id,
      itinerary_name: itinerary_name,
      itinerary_db_id: null,
      taxi_type: taxi_type,
      transfer_type: transfer_type,
      city_id: city_id,
      destination_city_id: destination_city_id,
      duration: duration,
      check_in: check_in,
    });

    axiosbookingupdateinstance
      .post("/?booking_type=Taxi,Bus,Ferry", data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        setCardUpdateLoading(null);
        _updateTransferBookingHandler(res.data.bookings);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain.",
        );
      });
  };

  const _deselectStayBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < stayBookings.length; i++) {
      if (stayBookings[i].id === booking.id) {
        setStayFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);
    setSelectingBooking(booking.id);
    let costings_breakdown = [];
    for (var i = 0; i < booking.costings_breakdown.length; i++) {
      costings_breakdown.push({
        id: booking.costings_breakdown[i].id,
        room_type: booking.costings_breakdown[i].room_type,
        pricing_type: booking.costings_breakdown[i].pricing_type,
        room_type_name: booking.costings_breakdown[i].room_type_name,
        number_of_rooms: booking.costings_breakdown[i].number_of_rooms,
        number_of_adults: booking.costings_breakdown[i].number_of_adults,
        number_of_infants: booking.costings_breakdown[i].number_of_infants,
        number_of_children: booking.costings_breakdown[i].number_of_children,
      });
    }
    let data = [];
    data.push({
      id: booking.id,
      booking_type: "Accommodation",
      city: booking.city,
      user_selected: user_selected,
      accommodation: booking.accommodation,
      itinerary_id: booking.itinerary_id,
      tailored_itinerary: booking.tailored_itinerary,
      costings_breakdown: costings_breakdown,
      itinerary_name: booking.itinerary_name,
      itinerary_db_id: null,
      is_estimated_price: booking.is_estimated_price,
      itinerary_type: "Tailored",
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Accommodation&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateStayBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain.",
        );
      });
  };

  const _deselectFlightBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < flightBookings.length; i++) {
      if (flightBookings[i].id === booking.id) {
        setFlightFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);

    setSelectingBooking(booking.id);
    let data = [];

    data.push({
      id: booking.id,
      booking_type: booking.booking_type,
      itinerary_type: "Tailored",
      user_selected: user_selected,
      itinerary_id: booking.itinerary_id,
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Flight&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateFlightBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain.",
        );
      });
  };

  const _deselectTransferBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < transferBookings.length; i++) {
      if (transferBookings[i].id === booking.id) {
        setTransferFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);

    setSelectingBooking(booking.id);
    let data = [];
    data.push({
      id: booking.id,
      booking_type: booking.booking_type,
      itinerary_type: "Tailored",
      user_selected: user_selected,
      taxi_type: booking.taxi_type,
      transfer_type: booking.transfer_type,
      itinerary_id: booking.itinerary_id,
      costings_breakdown: booking.costings_breakdown,
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Taxi,Bus,Ferry&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateTransferBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        props.openNotification({
          type: "error",
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
        });
      });
  };

  const _deselectActivityBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < activityBookings.length; i++) {
      if (activityBookings[i].id === booking.id) {
        setActivityFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);

    setSelectingBooking(booking.id);
    let data = [];

    data.push({
      id: booking.id,
      booking_type: booking.booking_type,
      itinerary_type: "Tailored",
      user_selected: user_selected,
      itinerary_id: booking.itinerary_id,
      tailored_itinerary: booking.tailored_itinerary,
      itinerary_name: booking.itinerary_name,
      itinerary_db_id: null,
      check_in: booking.check_in,
      check_out: booking.check_out,
      city: booking.city,
      costings_breakdown: booking.costings_breakdown,
      accommodation: booking.accommodation,
      is_estimated_price: booking.is_estimated_price,
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Activity&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateActivityBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain.",
        );
      });
  };

  const _updatePaymentHandler = (json) => {
    setPayment(json);
  };

  const setHideBookingModal = () => {
    setShowBookingModal(false);
  };

  const setHidePoiModal = () => {
    setShowPoiModal(false);
  };

  if (props.breif && !itineraryLoading)
    return (
      <Container>
        <Overview
          title={props.itinerary.name}
          group_type={group_type}
          duration_time={duration_time}
          images={props.itinerary.images}
          travellerType={travellerType}
          start_date={props?.plan ? props.plan.start_date : null}
          end_date={props?.plan ? props.plan.end_date : null}
          duration={
            props?.plan
              ? props.plan.duration_number + " " + props.plan.duration_unit
              : null
          }
          budget={props?.plan ? props.plan?.budget : null}
          number_of_adults={props?.plan ? props.plan?.number_of_adults : null}
          number_of_children={
            props?.plan ? props.plan?.number_of_children : null
          }
          number_of_infants={props?.plan ? props.plan?.number_of_infants : null}
          setEditRoute={setEditRoute}
        ></Overview>

        <div id="itinerary-anchor">
          <Menu
            hasUserPaid={hasUserPaid}
            isDatePresent={isDatePresent}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            showTaxiModal={showTaxiModal}
            setShowTaxiModal={setShowTaxiModal}
            paymentLoading={paymentLoading}
            budget={props?.plan ? props.plan.budget : null}
            _deselectActivityBookingHandler={_deselectActivityBookingHandler}
            activityFlickityIndex={activityFlickityIndex}
            transferFlickityIndex={transferFlickityIndex}
            stayFlickityIndex={stayFlickityIndex}
            setStayFlickityIndex={setStayFlickityIndex}
            selectingBooking={selectingBooking}
            _deselectTransferBookingHandler={_deselectTransferBookingHandler}
            _deselectFlightBookingHandler={_deselectFlightBookingHandler}
            flightFlickityIndex={flightFlickityIndex}
            _deselectStayBookingHandler={_deselectStayBookingHandler}
            getPaymentHandler={getPaymentHandler}
            flightBookings={flightBookings}
            cardUpdateLoading={cardUpdateLoading}
            _selectTaxiHandler={_selectTaxiHandler}
            _updateTransferHandler={_updateTransferBookingHandler}
            _updateStayBookingHandler={_updateStayBookingHandler}
            activityBookings={activityBookings}
            transferBookings={transferBookings}
            stayBookings={stayBookings}
            user_email={userEmail}
            setItinerary={props.setItinerary}
            traveleritinerary={isPastTravelerItinerary}
            id={props.id}
            is_stock={is_stock}
            _updatePaymentHandler={_updatePaymentHandler}
            setHidePoiModal={setHidePoiModal}
            setHideBookingModal={setHideBookingModal}
            setShowPoiModal={setShowPoiModal}
            setShowBookingModal={setShowBookingModal}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            showFlightModal={showFlightModal}
            setShowFlightModal={setShowFlightModal}
            showPoiModal={showPoiModal}
            showBookingModal={showBookingModal}
            _updateBookingHandler={_updateBookingHandler}
            itineraryReleased={itineraryReleased}
            itineraryDate={itineraryDate}
            payment={payment}
            booking={booking}
            token={props.token}
            fetchData={fetchData}
            getAccommodationAndActivitiesHandler={
              getAccommodationAndActivitiesHandler
            }
            group_type={group_type}
            duration_time={duration_time}
            travellerType={travellerType}
            editRoute={editRoute}
            setEditRoute={setEditRoute}
          ></Menu>
        </div>
      </Container>
    );
  else if (isPastTravelerItinerary)
    return (
      <div>
        <OldSpinner></OldSpinner>
      </div>
    );
  else if (router.query.payment_status) {
    return (
      <div>
        <OldSpinner></OldSpinner>
      </div>
    );
  } else
    return (
      <div>
        <Spinner></Spinner>
      </div>
    );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    email: state.auth.email,
    otpSent: state.auth.otpSent,
    itinerary: state.Itinerary,
    breif: state.Breif,
    plan: state.Plan,
    routes: state.ItineraryRoutes,
    bookings: state.Bookings,
    itineraryActivities: state.itineraryActivities,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    openNotification: (payload) => dispatch(openNotification(payload)),
    setItineraryRoutes: (payload) => dispatch(setItineraryRoutes(payload)),
    setItinerary: (payload) => dispatch(setItinerary(payload)),
    setPlan: (payload) => dispatch(setPlan(payload)),
    setBookings: (payload) => dispatch(setBookings(payload)),
    setItineraryActivities: (payload) =>
      dispatch(setItineraryActivities(payload)),
    setBreif: (payload) => dispatch(setBreif(payload)),
  };
};

export default connect(
  mapStateToPros,
  mapDispatchToProps,
)(React.memo(Itinerary));