import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";
import Menu from "../ArchiveMenuV1";
import Overview from "../../newitinerary/overview/Index";
import DesktopBanner from "../../../components/containers/Banner";
import { setItineraryStartDate } from "../../../store/actions/itineraryStartDate";
import { setItineraryActivities } from "../../../store/actions/itineraryActivities";
import setItinerary from "../../../store/actions/itinerary";
import setPlan from "../../../store/actions/plan";
import { setBookings } from "../../../store/actions/bookings";
import setBreif from "../../../store/actions/breif";
import setTripsPage from "../../../store/actions/tripsPage";
import openTailoredModal from "../../../services/openTailoredModal";
import { useRouter } from "next/router";

const Container = styled.div`
  width: 90%;
  margin: 5vh auto 0 auto;
  @media screen and (min-width: 768px) {
    width: 85%;
    /* Was -5vh, which pulled the itinerary title up underneath the sticky
       header. IndexsV2/Index.js uses 0vh for the same layout and sits clear of
       it. */
    margin: 2vh auto 0 auto;
  }
`;

// The published /trips itineraries.
//
// Every one of these was assembled at build time from the supplier portal, and
// the container then kept talking to it at runtime — re-fetching payment on
// login, swapping hotels, selecting taxis, claiming the itinerary. That portal
// is being switched off and the S3 archive behind these pages has no prices,
// no booking ids and no payment record, so all of that is gone and the page is
// a read-only view of what the trip was.
//
// It is now purely prop-driven: getStaticProps hands over data already adapted
// from `itineraries/<id>.json`, and this only pushes it into redux for the
// shared sections to read. Nothing here fetches.
const Itinerary = (props) => {
  const [stayBookings, setStayBookings] = useState(null);
  const [transferBookings, setTransferBookings] = useState(null);
  const [activityBookings, setActivityBookings] = useState(null);
  const [flightBookings, setFlightBookings] = useState(null);
  const [isDatePresent, setIsDatePresent] = useState(false);
  const [travellerType, settravellerType] = useState(false);
  const [group_type, setgroup_type] = useState(null);
  const [duration_time, setduration_time] = useState(null);
  const [itineraryReleased, setItineraryReleased] = useState(false);
  const [itineraryDate, setItineraryDate] = useState("");
  const [editRoute, setEditRoute] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    props.setTripsPage(true);
  }, []);

  // A 60s timer used to call openTailoredModal(router) here. That helper once
  // opened the tailored-travel form as a modal via a query flag, but it was
  // rewritten to `router.push("/chat?intake=1")` — so the timer had quietly
  // become a forced redirect that threw every /trips visitor onto the chat page
  // one minute after arrival, abandoning the itinerary they came to read. On
  // pages that exist to receive organic search traffic that is the opposite of
  // what we want, so it is gone. The banner below still offers the same journey
  // on click.

  useEffect(() => {
    if (props.itinerary.name !== "Loading Itinerary") {
      props.setItineraryActivities(getItineraryActivities());
    }
  }, [props.itinerary]);

  const getItineraryActivities = () => {
    let itenaryActivities = [];
    props.itinerary?.day_slabs?.map((day_slab) => {
      day_slab?.slab_elements?.map((element) => {
        if (element.element_type === "activity") {
          itenaryActivities.push({ activity: element, date: day_slab.slab });
        }
      });
    });
    return itenaryActivities;
  };

  useEffect(() => {
    if (props.daybydayData) props.setItinerary(props.daybydayData);
    if (props.breifData) props.setBreif(props.breifData);

    if (props.bookingsData) {
      props.setBookings(props.bookingsData);
      setStayBookings(props.bookingsData.stayBookings);
      setActivityBookings(props.bookingsData.activityBookings);
      setTransferBookings(props.bookingsData.transferBookings);
      setFlightBookings(props.bookingsData.flightBookings);
    }

    if (props.planData) {
      const plan = props.planData;
      props.setPlan(plan);
      dispatch(setItineraryStartDate({ date: plan.start_date }));
      settravellerType(plan.experience_filters_selected);
      if (plan.start_date) setIsDatePresent(true);
      setgroup_type(plan.group_type);
      setduration_time(plan.duration_number);
      setItineraryReleased(plan.is_released_for_customer);
      setItineraryDate(plan.created_at);
    }
  }, [props.id]);

  if (props.breif)
    return (
      <Container>
        <DesktopBanner
          onclick={() => openTailoredModal(router)}
          text="Liked this itinerary? Craft one for yourself now!"
        />

        <Overview
          title={props.page_title}
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
          // Shows the traveller-type/budget row and the desktop gallery, which
          // Overview gates behind this flag. Safe without the editing props it
          // normally comes with: Details wraps its only two callbacks in
          // `if (props?.setShowSettings)`, so with none passed the row simply
          // isn't clickable — right for a page that can no longer be edited.
          // Ratings bails out on its own (`if (!(rating && reviews)) return
          // null`) because the archive plan has no review or rating_count, so
          // UserRating and its supplier call never mount.
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
            id={props.id}
            itineraryReleased={itineraryReleased}
            itineraryDate={itineraryDate}
            token={props.token}
            group_type={group_type}
            duration_time={duration_time}
            travellerType={travellerType}
            editRoute={editRoute}
            setEditRoute={setEditRoute}
            social_title={props?.social_title}
            social_description={props?.social_description}
            setStayBookings={setStayBookings}
          ></Menu>
        </div>
      </Container>
    );
  else return <div></div>;
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
    setTripsPage: (payload) => dispatch(setTripsPage(payload)),
  };
};

export default connect(
  mapStateToPros,
  mapDispatchToProps,
)(React.memo(Itinerary));
