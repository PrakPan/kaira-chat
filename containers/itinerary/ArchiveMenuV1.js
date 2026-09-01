// Layout for an archived V1 itinerary — a read-only fork of OldMenuV2.
//
// V1 itineraries are served from the S3/CloudFront archive now that the
// supplier portal is being switched off, and the snapshot carries no prices or
// booking ids. Everything that wrote back to that portal is therefore gone from
// this file: the payment summary (TailoredDetails / gittailored), the GIT
// registration slide, the POI edit modal, and the "get in touch" lead post. The
// page is left with brief, day-by-day, stays, transfers and activities.
//
// OldMenuV2 stays as it was because /trips/[type]/[slug] renders it through
// IndexedContainer and still shows a price and a pay CTA — splitting the two
// is what lets this one drop the supplier entirely.
//
// The child sections below (HotelsBooking, TransfersContainer, Breif, the
// day-by-day) are shared with the V2 layout in MenuV2.js, so their booking
// affordances stay where they are; with no `payment` prop they render nothing.
import React, { useState, useEffect, useLayoutEffect } from "react";
import { scroller } from "react-scroll";
import Breif from "./breif/OldNewIndex.js";
import media from "../../components/media";
import * as ga from "../../services/ga/Index";
import { useRouter } from "next/router";
import useMediaQuery from "../../hooks/useMedia";
import NewItenaryDBDMob from "./New_Itenary_DBD/NewItenaryDBDMob";
import NewItenaryMain from "./New_Itenary_DBD/NewItenaryMain";
import ScrollableMenuTabs from "../../components/ScrollableMenuTabs";
import ActivityBookings from "./ActivityBookings/OldActivityBooking.js";
import HotelsBooking from "./HotelsBooking/HotelsBooking";
import { SplitScreen } from "../../components/SplitScreen";
import { Navigation } from "../../components/NewNavigation";
import TransfersContainer from "./TransfersContainer/TransfersContainer";
import LogInModal from "../../components/modals/Login";
import { CONTENT_SERVER_HOST } from "../../services/constants";
import urls from "../../services/urls";
import { getCityDetails } from "./getCityDetails";
import { connect } from "react-redux";
import {
  SocialShareMobile,
  SocialShareDesktop,
} from "./booking1/SocialShare.js";
import { BsShareFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const noop = () => {};

const useStyles = {
  root: `
    flex-grow-1
    `,
};

const ArchiveMenuV1 = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const classes = useStyles;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [citydatadone, setcitydatadone] = useState(false);
  const [CityData, setCityData] = useState();
  const [share, setShare] = useState(false);
  const [shareMobile, setShareMobile] = useState(false);
  const isDesktop = useMediaQuery("(min-width:1148px)");

  const scrollToElement = (elementId) => {
    scroller?.scrollTo(elementId, {
      duration: 500,
      smooth: false,
      spy: true,
      offset: -50,
    });
  };

  useLayoutEffect(() => {
    const { scroll } = router.query;
    if (scroll) scrollToElement(scroll);
  }, [router.query]);

  var RoutesData = [];
  var TransfersData = [];
  var CityDataTemp = [];
  var totalcityslabs = 0;

  useEffect(() => {
    totalcityslabs = newFunction(
      props,
      totalcityslabs,
      citydatadone,
      CityDataTemp,
      setcitydatadone,
      setCityData,
      CityData,
      RoutesData,
      TransfersData
    );
  }, [props.breif, props.routes]);

  // Was a lead POST to the supplier portal's chat endpoint. That endpoint is
  // going away and there is no replacement for it on this page, so the child
  // sections that still offer "get in touch" hand the traveller straight to
  // WhatsApp instead of silently failing.
  const _GetInTouch = () => {
    window.open(urls.WHATSAPP, "_blank", "noopener,noreferrer");
  };

  const _handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const items = [
    { id: 1, label: "Brief", link: "Brief" },
    { id: 2, label: "Itinerary", link: "Itenary" },

    { id: 3, label: "Stays", link: "Stays" },
  ];

  if (props.transferBookings || props?.routes?.length) {
    items.push({ id: 4, label: "Transfers", link: "Transfers" });
  }

  if (props.activityBookings) {
    items.push({
      id: 5,
      label: "Activities",
      link: "Activities",
    });
  }

  const _handleMenuTabsChange = (tabName) => {
    if (
      process.env.NODE_ENV === "production" &&
      !CONTENT_SERVER_HOST.includes("dev")
    ) {
      ga.event({
        action: "Itinerary-tabs-" + tabName.toLowerCase(),
      });
    }
  };

  return (
    <div
      className={classes.root}
      style={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      <div className="z-10 sticky z-2 md:top-[0px] top-[1px]">
        {isPageWide ? (
          <Navigation
            items={items}
            BarName="TabsName"
            ClickHandler={_handleMenuTabsChange}
          />
        ) : (
          <ScrollableMenuTabs
            icons={false}
            offset={isDesktop ? "0px" : "0px"}
            items={items}
            BarName="TabsName"
            scrollOffSet={-50}
          />
        )}
      </div>

      <div id={"Brief"}>
        {citydatadone && (
          <Breif
            plan={props.plan}
            routesData={RoutesData}
            transfersData={TransfersData}
            routes={props.routes}
            payment={props.payment}
            traveleritinerary={props.traveleritinerary}
            CityData={CityData}
            itinerary={props.itinerary}
            breif={props.breif}
            fetchData={props.fetchData}
            getPaymentHandler={props.getPaymentHandler}
            setShowLoginModal={setShowLoginModal}
            _GetInTouch={_GetInTouch}
            group_type={props.group_type}
            duration_time={props.duration_time}
            travellerType={props.travellerType}
            editRoute={props.editRoute}
            setEditRoute={props.setEditRoute}
          ></Breif>
        )}
      </div>

      {isPageWide ? null : (
        <>
          <div id={"Itenary"}>
            <NewItenaryDBDMob
              plan={props.plan}
              payment={props.payment}
              token={props.token}
              setShowLoginModal={setShowLoginModal}
              city_slabs={props?.breif?.city_slabs}
              itinerary={props.itinerary}
              setItinerary={props.setItinerary}
              getPaymentHandler={props.getPaymentHandler}
              transferBookings={props.transferBookings}
              stayBookings={props.stayBookings}
              activityBookings={props.activityBookings}
              getAccommodationAndActivitiesHandler={
                props.getAccommodationAndActivitiesHandler
              }
              setShowBookingModal={props.setShowBookingModal}
              _GetInTouch={_GetInTouch}
            ></NewItenaryDBDMob>
          </div>

          <div id={"Stays"}>
            <HotelsBooking
              setShowLoginModal={setShowLoginModal}
              plan={props.plan}
              hasUserPaid={
                props.payment ? (props.payment.paid_user ? true : false) : false
              }
              budget={props.budget}
              breif={props.breif}
              stayBookings={props.stayBookings}
              _updateBookingHandler={props._updateBookingHandler}
              _updateStayBookingHandler={props._updateStayBookingHandler}
              _updatePaymentHandler={props._updatePaymentHandler}
              getPaymentHandler={props.getPaymentHandler}
              setShowBookingModal={props.setShowBookingModal}
              showBookingModal={props.showBookingModal}
              setHideBookingModal={props.setHideBookingModal}
              payment={props.payment}
              booking={props.booking}
            ></HotelsBooking>
          </div>

          {props?.transferBookings || props?.routes?.length ? (
            <div id={"Transfers"}>
              <TransfersContainer
                setShowLoginModal={setShowLoginModal}
                plan={props.plan}
                dayslab={props?.itinerary?.day_slabs}
                breif={props?.breif}
                routesData={RoutesData}
                transfers={TransfersData}
                routes={props.routes}
                showTaxiModal={props.showTaxiModal}
                getPaymentHandler={props.getPaymentHandler}
                _updateFlightBookingHandler={props._updateFlightBookingHandler}
                setShowTaxiModal={props.setShowTaxiModal}
                _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateBookingHandler={props._updateBookingHandler}
                showFlightModal={props.showFlightModal}
                setShowFlightModal={noop}
                setHideFlightModal={noop}
                setShowBookingModal={props.setShowBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                payment={props.payment}
                transferBookings={props?.transferBookings}
                itinerary_id={props.itinerary_id}
                fetchData={props.fetchData}
                _GetInTouch={_GetInTouch}
              />
            </div>
          ) : (
            <></>
          )}

          {props.activityBookings && (
            <div id={"Activities"}>
              <ActivityBookings
                plan={props.plan}
                hasUserPaid={
                  props.payment
                    ? props.payment.paid_user
                      ? true
                      : false
                    : false
                }
                budget={props.budget}
                stayBookings={props.stayBookings}
                _updateBookingHandler={props._updateBookingHandler}
                _updateStayBookingHandler={props._updateStayBookingHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                flightBookings={props.flightBookings}
                getPaymentHandler={props.getPaymentHandler}
                setShowBookingModal={props.setShowBookingModal}
                showBookingModal={props.showBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                activityBookings={props.activityBookings}
                payment={props.payment}
                booking={props.booking}
              />
            </div>
          )}

        </>
      )}

      {isPageWide ? (
        <SplitScreen
          classStyle="min-h-[600px]"
          isPageWide
          leftWidth={8}
          rightWidth={4}
        >
          <div>
            {isPageWide ? (
              <div id={"Itenary"}>
                {props?.itinerary && (
                  <NewItenaryMain
                    setShowLoginModal={setShowLoginModal}
                    plan={props.plan}
                    payment={props.payment}
                    city_slabs={props?.breif?.city_slabs}
                    itinerary={props?.itinerary}
                    setItinerary={props.setItinerary}
                    getPaymentHandler={props.getPaymentHandler}
                    token={props.token}
                    transferBookings={props.transferBookings}
                    stayBookings={props.stayBookings}
                    activityBookings={props.activityBookings}
                    getAccommodationAndActivitiesHandler={
                      props.getAccommodationAndActivitiesHandler
                    }
                    setShowBookingModal={props.setShowBookingModal}
                    _GetInTouch={_GetInTouch}
                  ></NewItenaryMain>
                )}
              </div>
            ) : (
              <div id={"Itenary"}>
                <NewItenaryDBDMob
                  plan={props.plan}
                  payment={props.payment}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  city_slabs={props?.breif?.city_slabs}
                  itinerary={props.itinerary}
                  setItinerary={props.setItinerary}
                  getPaymentHandler={props.getPaymentHandler}
                  transferBookings={props.transferBookings}
                  stayBookings={props.stayBookings}
                  activityBookings={props.activityBookings}
                  setShowBookingModal={props.setShowBookingModal}
                  _GetInTouch={_GetInTouch}
                ></NewItenaryDBDMob>
              </div>
            )}

            <div id={"Stays"}>
                <HotelsBooking
                  setShowLoginModal={setShowLoginModal}
                  plan={props.plan}
                  hasUserPaid={
                    props.payment
                      ? props.payment.paid_user
                        ? true
                        : false
                      : false
                  }
                  breif={props.breif}
                  budget={props.budget}
                  stayBookings={props.stayBookings}
                  _updateBookingHandler={props._updateBookingHandler}
                  _updateStayBookingHandler={props._updateStayBookingHandler}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  getPaymentHandler={props.getPaymentHandler}
                  setShowBookingModal={props.setShowBookingModal}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  payment={props.payment}
                  booking={props.booking}
                  _GetInTouch={_GetInTouch}
              ></HotelsBooking>
            </div>

            {props.transferBookings || props?.routes?.length ? (
              <div id={"Transfers"}>
                <TransfersContainer
                  setShowLoginModal={setShowLoginModal}
                  plan={props.plan}
                  dayslab={props?.itinerary?.day_slabs}
                  breif={props?.breif}
                  showTaxiModal={props.showTaxiModal}
                  routesData={RoutesData}
                  transfers={TransfersData}
                  routes={props.routes}
                  _updateFlightBookingHandler={
                    props._updateFlightBookingHandler
                  }
                  setShowTaxiModal={props.setShowTaxiModal}
                  getPaymentHandler={props.getPaymentHandler}
                  _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  _updateBookingHandler={props._updateBookingHandler}
                  showFlightModal={props.showFlightModal}
                  setShowFlightModal={noop}
                  setHideFlightModal={noop}
                  setShowBookingModal={props.setShowBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  payment={props.payment}
                  transferBookings={props?.transferBookings}
                  itinerary_id={props.itinerary_id}
                  fetchData={props.fetchData}
                  _GetInTouch={_GetInTouch}
                />
              </div>
            ) : (
              <></>
            )}

            {props.activityBookings && (
              <div id={"Activities"}>
                <ActivityBookings
                  plan={props.plan}
                  hasUserPaid={
                    props.payment
                      ? props.payment.paid_user
                        ? true
                        : false
                      : false
                  }
                  budget={props.budget}
                  stayBookings={props.stayBookings}
                  _updateBookingHandler={props._updateBookingHandler}
                  _updateStayBookingHandler={props._updateStayBookingHandler}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  flightBookings={props.flightBookings}
                  getPaymentHandler={props.getPaymentHandler}
                  setShowBookingModal={props.setShowBookingModal}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  activityBookings={props.activityBookings}
                  payment={props.payment}
                  booking={props.booking}
                />
              </div>
            )}
          </div>

        </SplitScreen>
      ) : null}

      {isPageWide && (
        <div
          onClick={() => setShare((prev) => !prev)}
          className="z-[999] flex fixed bottom-[90px] right-[25px] bg-[#2b2b27] p-[18px] w-fit items-center justify-center rounded-full cursor-pointer"
        >
          {share ? (
            <IoMdClose className="animate-popOut text-[25px] text-white" />
          ) : (
            <BsShareFill className="animate-popOut text-[25px] text-white" />
          )}
        </div>
      )}

      {isPageWide && (
        <SocialShareDesktop
          social_title={props?.social_title}
          social_description={props?.social_description}
          itineraryName={props.itinerary.name}
          itineraryImage={props.itinerary.images[0]}
          setShare={setShare}
          share={share}
        />
      )}

      <div
        onClick={() => setShareMobile((prev) => !prev)}
        className="z-[999] fixed bottom-[130px] right-[16px] md:hidden bg-[#2b2b27] p-[18px] w-fit flex items-center justify-center rounded-full cursor-pointer"
      >
        <BsShareFill className="text-[25px] text-white" />
      </div>

      {shareMobile && (
        <div className="md:hidden">
          <SocialShareMobile
            social_title={props?.social_title}
            social_description={props?.social_description}
            itineraryName={props.itinerary.name}
            itineraryImage={props.itinerary.images[0]}
            setShare={setShareMobile}
          />
        </div>
      )}

      <div className="width-[100%]">
        <LogInModal
          show={showLoginModal}
          onhide={_handleLoginClose}
          itinary_id={props.id}
        ></LogInModal>
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    itinerary: state.Itinerary,
    plan: state.Plan,
    routes: state.ItineraryRoutes,
    breif: state.Breif,
    itinerary_id: state.ItineraryId,
    tripsPage: state.TripsPage,
  };
};

export default connect(mapStateToPros)(ArchiveMenuV1);

function newFunction(
  props,
  totalcityslabs,
  citydatadone,
  CityDataTemp,
  setcitydatadone,
  setCityData,
  CityData,
  RoutesData,
  TransfersData
) {
  function replaceLatLong(source, destination) {
    return {
      ...source,
      lat: destination.lat,
      long: destination.long,
    };
  }
  if (props.breif)
    if (props.breif.city_slabs)
      for (var j = 0; j < props.breif.city_slabs.length; j++) {
        if (!props.breif.city_slabs[j].is_trip_terminated) {
          totalcityslabs += 1;
        }
      }

  async function processRoutes2(props) {
    for (var i = 0; i < props.breif.city_slabs.length; i++) {
      if (props.breif.city_slabs[i].long) {
        CityDataTemp.push(props.breif.city_slabs[i]);
      } else {
        if (
          props.breif.city_slabs[i].city_id &&
          props.breif.city_slabs[i].duration > "0"
        ) {
          try {
            const data = await getCityDetails(
              props.breif.city_slabs[i].city_id
            );
            const updatedRoutes = replaceLatLong(
              props.breif.city_slabs[i],
              data
            );
            CityDataTemp.push(updatedRoutes);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
    setcitydatadone(true);
    setCityData(CityDataTemp);
  }
  processRoutes2(props);

  if (props.routes) {
    async function processRoutes(props) {
      for (var i = 0; i < props.routes.length; i++) {
        if (props.routes[i].element_type !== "transfer") {
          if (props.routes[i].long) {
            RoutesData.push(props.routes[i]);
          } else {
            if (props.routes[i].city_id) {
              try {
                const data = await getCityDetails(props.routes[i].city_id);
                const updatedRoutes = replaceLatLong(props.routes[i], data);
                RoutesData.push(updatedRoutes);
              } catch (error) {
                console.error(error);
              }
            }
          }
        } else {
          TransfersData.push(props.routes[i]);
        }
      }
    }

    processRoutes(props);
  }
  return totalcityslabs;
}