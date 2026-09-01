import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Menu from "../ArchiveMenuV1";
import OldSpinner from "../../../components/LoadingPage";
import { connect, useDispatch } from "react-redux";
import { TRAVELER_ITINERARIES } from "../../../services/constants";
import { fetchV1Itinerary } from "../../../services/itinerary/v1/archive";
import { adaptV1Snapshot } from "../../../lib/v1Itinerary";
import Overview from "../../newitinerary/overview/Index";
import { setItineraryStartDate } from "../../../store/actions/itineraryStartDate";
import setItinerary from "../../../store/actions/itinerary";
import setPlan from "../../../store/actions/plan";
import { setBookings } from "../../../store/actions/bookings";
import { setItineraryActivities } from "../../../store/actions/itineraryActivities";
import setBreif from "../../../store/actions/breif";
import { ChatProvider } from "../../../components/Chatbot/context/ChatContext";
import NavigationMenu from "../../../components/revamp/home/NavigationMenu";

const Container = styled.div`
  width: 90%;
  margin: 5vh auto 0 auto;
  @media screen and (min-width: 768px) {
    width: 85%;
    margin: 0vh auto 0 auto;
  }
`;

// V1 itineraries are an archive now. They used to be assembled from six
// supplier-portal calls (day_by_day, brief, routes, plan, bookings, payment)
// and were editable in place — pick a hotel, swap a taxi, pay. That portal is
// being decommissioned, so the whole set was dumped to S3 as one JSON per
// itinerary and is read off CloudFront here; `adaptV1Snapshot` maps it onto the
// same redux shapes the components below already consume.
//
// Nothing on this page writes any more: the snapshot carries no prices, no
// booking ids and no payment record, so `payment` is gone rather than null, and
// every select/deselect/claim handler went with it. It also carries no route
// coordinates, so `ItineraryRoutes` stays empty and the route map is blank.
const Itinerary = (props) => {
  const router = useRouter();
  const [itineraryReleased, setItineraryReleased] = useState(false);
  const [itineraryDate, setItineraryDate] = useState("");
  const [itineraryLoading, setItineraryLoading] = useState(true);
  const [stayBookings, setStayBookings] = useState(null);
  const [transferBookings, setTransferBookings] = useState(null);
  const [activityBookings, setActivityBookings] = useState(null);
  const [flightBookings, setFlightBookings] = useState(null);
  const [isDatePresent, setIsDatePresent] = useState(false);
  const [travellerType, settravellerType] = useState(false);
  const [group_type, setgroup_type] = useState(null);
  const [duration_time, setduration_time] = useState(null);
  const [isPastTravelerItinerary, setIsPastTravelerItinerary] = useState(false);
  const [editRoute, setEditRoute] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.itinerary.name !== "Loading Itinerary") {
      const activities = getItineraryActivities();
      props.setItineraryActivities(activities);
    }
  }, [props.itinerary]);

  const getItineraryActivities = () => {
    let itenaryActivities = [];
    props.itinerary?.day_slabs?.map((day_slab, index) => {
      day_slab?.slab_elements?.map((element, index) => {
        if (element.element_type === "activity") {
          itenaryActivities.push({ activity: element, date: day_slab.slab });
        }
      });
    });
    return itenaryActivities;
  };

  function fetchData(scroll = true) {
    if (scroll) window.scrollTo(0, 0);
    if (TRAVELER_ITINERARIES.includes(props.id))
      setIsPastTravelerItinerary(true);

    setItineraryLoading(true);

    fetchV1Itinerary(props.id)
      .then((snapshot) => {
        const adapted = adaptV1Snapshot(snapshot, props.id);

        // Not in the archive — same bail-out the brief call used to do.
        if (!adapted) {
          window.location.href = "/thank-you";
          return;
        }

        const { itinerary, breif, plan, bookings } = adapted;

        props.setItinerary(itinerary);
        props.setBreif(breif);
        props.setPlan(plan);
        props.setBookings(bookings);

        setStayBookings(bookings.stayBookings);
        setActivityBookings(bookings.activityBookings);
        setTransferBookings(bookings.transferBookings);
        setFlightBookings(bookings.flightBookings);

        dispatch(setItineraryStartDate({ date: plan.start_date }));
        settravellerType(plan.experience_filters_selected);
        if (plan.start_date) setIsDatePresent(true);
        setgroup_type(plan.group_type);
        setduration_time(plan.duration_number);
        setItineraryReleased(plan.is_released_for_customer);
        setItineraryDate(plan.created_at);

        setItineraryLoading(false);
      })
      .catch((error) => {
        console.error("[ERROR][ItineraryV1][archive]", error?.message);
        setItineraryLoading(false);
      });
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

  if (props.breif && !itineraryLoading)
    return (
      <ChatProvider itinearyId={router.query.id}>
        <NavigationMenu />
        <Container className="mt-2">
          <Overview
            title={props.itinerary.name}
            itinerary={props?.itinerary}
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
            number_of_infants={
              props?.plan ? props.plan?.number_of_infants : null
            }
            setEditRoute={setEditRoute}
            v1={true}
          ></Overview>

          <div id="itinerary-anchor">
            <Menu
              isDatePresent={isDatePresent}
              budget={props?.plan ? props.plan.budget : null}
              flightBookings={flightBookings}
              activityBookings={activityBookings}
              transferBookings={transferBookings}
              stayBookings={stayBookings}
              setItinerary={props.setItinerary}
              traveleritinerary={isPastTravelerItinerary}
              id={props.id}
              itineraryReleased={itineraryReleased}
              itineraryDate={itineraryDate}
              token={props.token}
              fetchData={fetchData}
              group_type={group_type}
              duration_time={duration_time}
              travellerType={travellerType}
              editRoute={editRoute}
              setEditRoute={setEditRoute}
            ></Menu>
          </div>
        </Container>
      </ChatProvider>
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
  }
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
