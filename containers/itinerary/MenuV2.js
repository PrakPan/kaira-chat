import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { scroller } from "react-scroll";
import { RxCross2 } from "react-icons/rx";
import GITSummaryContainer from "./booking1/gittailored/Index";
import SummaryContainer from "./booking1/TailoredDetails";
import axiosLeadChat from "../../services/leads/chat.js";
import Register from "./register/Index";
import Breif from "./breif/NewIndex";
import media from "../../components/media";
import PoiEditModal from "../../components/modals/editpoi/Index";
import { getIndianPrice } from "../../services/getIndianPrice";
import Button from "../../components/ui/button/Index";
import * as ga from "../../services/ga/Index";
import { useRouter } from "next/router";
import useMediaQuery from "../../hooks/useMedia";
import NewItenaryDBDMob from "./New_Itenary_DBD/NewItenaryDBDMob";
import NewItenaryMain from "./New_Itenary_DBD/NewItenaryMain";
import ScrollableMenuTabs from "../../components/ScrollableMenuTabs";
import ActivityBookings from "./ActivityBookings/ActivitiesBookings";
import HotelsBooking from "./HotelsBooking/HotelsBooking";
import { SplitScreen } from "../../components/SplitScreen";
import { Navigation } from "../../components/NewNavigation";
import TransfersContainer from "./TransfersContainer/TransfersContainer";
import LogInModal from "../../components/modals/Login";
import Modal from "../../components/ui/Modal";
import {
  CONTENT_SERVER_HOST,
  ITINERARY_STATUSES,
} from "../../services/constants";
import { getCityDetails } from "./getCityDetails";
import ImageLoader from "../../components/ImageLoader";
import { connect } from "react-redux";
import { openNotification } from "../../store/actions/notification";
import { logEvent } from "../../services/ga/Index";
import openTailoredModal from "../../services/openTailoredModal";
import {
  SocialShareMobile,
  SocialShareDesktop,
} from "./booking1/SocialShare.js";
import { BsShareFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import DaybyDay from "./DaybyDay.jsx";
import StaysContainer from "./Stays/StaysContainer.jsx";
import TransferBookings from "./TransfersContainer/TransferBookings.jsx";
import NewSummaryContainers from "./NewSummaryContainers.js";

const useStyles = {
  root: `
    flex-grow-1
    `,
};

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const SimpleTabsV2 = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [isGroup, setIsGroup] = useState(false);
  const router = useRouter();
  const classes = useStyles;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFooterBannerMobile, setShowFooterBannerMobile] = useState(false);
  const [citydatadone, setcitydatadone] = useState(false);
  const [CityData, setCityData] = useState();
  const [selectedPoi, setSelectedPoi] = useState({ name: "Kasol" });
  const [loading, setLoading] = useState(false);
  const [share, setShare] = useState(false);
  const [shareMobile, setShareMobile] = useState(false);
  const isDesktop = useMediaQuery("(min-width:1148px)");


  console.log("transfer booking is",props?.transferBookings );

  useEffect(() => {
    if (router.query.payment_status) {
      if (isPageWide) window.scrollTo(0, window.innerHeight);
      else window.scrollTo(0, window.innerHeight / 2);
    }
  }, []);

  const scrollToElement = (elementId) => {
    scroller?.scrollTo(elementId, {
      duration: 500,
      smooth: false,
      spy: true,
      offset: -50,
    });
  };

  useLayoutEffect(() => {
    const { t, booking, scroll } = router.query;

    if (booking) {
      setShowFooterBannerMobile(true);
    } else if (scroll) {
      scrollToElement(scroll);
    }
  }, [router.query]);

  const _hidePaymentHandler = () => {
    setShowFooterBannerMobile(true);
    setShowpayment(false);
  };

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
  }, [props.breif, props.routes,props.cities]);

  const _GetInTouch = () => {
    setLoading(true);

    if (props.token) {
      const email = localStorage.getItem("email");
      const name = localStorage.getItem("name");
      const phone = localStorage.getItem("phone");
      axiosLeadChat
        .post("/", {
          email: email,
          name: name,
          phone: phone,
          source: "Itinerary",
          query_message: `I need help in completing booking.`,
        })
        .then((res) => {
          props.openNotification({
            type: "sucess",
            text: res.data.message,
            heading: "Request received.",
          });
          setLoading(false);
        })
        .catch((err) => {
          if (err.response) {
          }
          props.openNotification({
            type: "error",
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
      setShowLoginModal(true);
    }
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

  const _handlePoiEditModalOpen = (poi) => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "Itinerary-poiedit-open",
          params: {
            poi: poi.name,
            city: poi.city_id,
          },
        });
    }
    setSelectedPoi({
      name: poi.name,
      city_id: poi.city_id,
      day_slab_index: poi.day_slab_index,
      slab_element_index: poi.slab_element_index,
      element_index: poi.element_index,
    });
    props.setShowPoiModal(true);
  };

  const _handleFlighModalShow = () => {
    props.setShowFlightModal(true);
  };

  const _handleFlightModalClose = () => {
    props.setShowFlightModal(false);
  };

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

  const handleLoginButton = () => {
    setShowLoginModal(true);

    logEvent({
      action: "Login",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Log in to proceed",
        event_action: "Navigation Bar",
      },
    });
  };

  const handleButtonClick = (label) => {
    scrollToElement("Stays");

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_action: "Navigation Bar",
      },
    });
  };

  const handleFooterBannerMobile = (lebel) => {
    setShowFooterBannerMobile(!showFooterBannerMobile);

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: lebel,
        event_action: "Navigation Bar",
      },
    });
  };

  const handleGetInTouch = () => {
    _GetInTouch();

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Get in touch!",
        event_action: "Navigation Bar",
      },
    });
  };

  const handleCreateTripButton = () => {
    openTailoredModal(router);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "Itinerary Page",
        event_category: "Button Click",
        event_label: "Create a Trip",
        event_action: "Payments Slide",
      },
    });
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

      {isPageWide && (
        <div className="w-full z-[20] sticky flex flex-row top-[2px] justify-end -mt-[55px] ">
          <div className="z-[99] absolute  md:top-[0px] top-[0px] w-[20rem]">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col">
                <div className="text-[0.725rem]">
                  {props?.payment?.pay_only_for_one ||
                  props?.payment?.show_per_person_cost
                    ? "Per Person"
                    : props.payment?.is_estimated_price
                    ? `${
                        props.payment.total_cost === 0
                          ? "No Bookings"
                          : "Estimated Price"
                      }`
                    : "Total Cost"}
                </div>
                {props.payment ? (
                  <div>
                    <span className="font-bold">
                      ₹{" "}
                      { !props?.mercuryItinerary ? (props?.payment?.pay_only_for_one ||
                      props?.payment?.show_per_person_cost 
                        ? getIndianPrice(
                            Math.round(
                              Math.round(
                                props.payment.per_person_discounted_cost
                              ) / 100
                            )
                          )
                        : getIndianPrice(
                            Math.round(
                              Math.round(props.payment.discounted_cost)
                            )
                          )) : (props?.payment?.pay_only_for_one ||
                            props?.payment?.show_per_person_cost 
                              ? getIndianPrice(
                                  Math.round(
                                    Math.round(
                                      props.payment.per_person_discounted_cost
                                    ) 
                                  )
                                )
                              : getIndianPrice(
                                  Math.round(
                                    Math.round(props.payment.discounted_cost)
                                  )
                                ))}
                      {"/-"}
                    </span>
                  </div>
                ) : null}
              </div>

              {props?.token && props?.payment?.paid_user && (
                <div className="border-[1px] flex my-2 justify-center items-center text-[#04AA32] text-center  text-medium border-[#04AA32] px-[2px] py-[1px]">
                  PAID
                </div>
              )}

              {props.tripsPage ? (
                <Button
                  color="#111"
                  fontWeight="400"
                  fontSize="0.45rem"
                  borderWidth="2px"
                  width="12rem"
                  borderRadius="10px"
                  bgColor="#F7E700"
                  onclick={handleCreateTripButton}
                >
                  Craft a new trip!
                </Button>
              ) : (
                <>
                  {!props.token ? (
                    <div>
                      <Button
                        color="#111"
                        fontWeight="400"
                        fontSize="0.45rem"
                        borderWidth="2px"
                        width="12rem"
                        borderRadius="10px"
                        bgColor="#F7E700"
                        onclick={handleLoginButton}
                      >
                        Log in to proceed
                      </Button>
                    </div>
                  ) : null}

                  {props.payment && props.token ? (
                    props.payment.itinerary_status ===
                      ITINERARY_STATUSES.itinerary_finalized &&
                    !props.payment.paid_user &&
                    props.payment.user_allowed_to_pay ? (
                      props.payment.total_cost > 0 ? (
                        <div>
                          <Button
                            color="#111"
                            fontWeight="400"
                            fontSize="0.45rem"
                            borderWidth="2px"
                            width="13rem"
                            borderRadius="10px"
                            bgColor="#F7E700"
                            onclick={() => handleButtonClick("View Inclusions")}
                            onclickparams={null}
                          >
                            View Inclusions
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Button
                            color="#111"
                            fontWeight="400"
                            fontSize="0.45rem"
                            borderWidth="2px"
                            width="9rem"
                            borderRadius="10px"
                            bgColor="#F7E700"
                            onclick={() => handleButtonClick("Add Hotels")}
                          >
                            Add Hotels
                          </Button>
                        </div>
                      )
                    ) : !props.payment.paid_user ? (
                      props.payment.is_registration_needed ? (
                        <div className="">
                          <Button
                            color="#111"
                            fontWeight="600"
                            fontSize="0.85rem"
                            borderWidth="2px"
                            width="11rem"
                            borderRadius="8px"
                            bgColor="#f8e000"
                            onclick={() => handleButtonClick("View Inclusions")}
                          >
                            View Inclusions
                          </Button>
                        </div>
                      ) : (
                        <GetInTouchContainer>
                          <Button
                            color="#111"
                            fontWeight="400"
                            fontSize="0.45rem"
                            borderWidth="2px"
                            width="12rem"
                            borderRadius="10px"
                            bgColor="#F7E700"
                            onclick={handleGetInTouch}
                            loading={loading}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <ImageLoader
                                dimensions={{ height: 50, width: 50 }}
                                dimensionsMobile={{ height: 50, width: 50 }}
                                height={"20px"}
                                width={"20px"}
                                leftalign
                                url={
                                  "media/icons/login/customer-service-black.png"
                                }
                              />{" "}
                              <span>Get in touch!</span>
                            </div>
                          </Button>
                        </GetInTouchContainer>
                      )
                    ) : (
                      <Button
                        color="#111"
                        fontWeight="400"
                        fontSize="0.45rem"
                        borderWidth="2px"
                        width="9rem"
                        borderRadius="10px"
                        bgColor="#F7E700"
                        onclick={() => handleButtonClick("View Bookings")}
                      >
                        View Bookings
                      </Button>
                    )
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div id={"Brief"}>
        {citydatadone && (
          <Breif
           mercuryItinerary={props?.mercuryItinerary}

            plan={props.plan}
            routesData={RoutesData}
            transfersData={TransfersData}
            cityTransferBookings={props.cityTransferBookings}
            routes={props.routes}
            payment={props.payment}
            traveleritinerary={props.traveleritinerary}
            CityData={CityData}
            // CityData={props?.cities}
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
            {props.mercuryItinerary ? (
              props?.itineraryDaybyDay && <DaybyDay itinerary={props.itinerary} trasferBookings={props?.transferBookings}/>
            ) : (
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
                setShowBookingModal={() => props.setShowBookingModal(true)}
                _GetInTouch={_GetInTouch}
              ></NewItenaryDBDMob>
            )}
          </div>

          <div id={"Stays"}>
            {props.mercuryItinerary ? (
              <StaysContainer stayBookings={props?.stayBookings}/>
            ) : (
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
                budget={props.budget}
                breif={props.breif}
                stayBookings={props.stayBookings}
                _updateBookingHandler={props._updateBookingHandler}
                _updateStayBookingHandler={props._updateStayBookingHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                getPaymentHandler={props.getPaymentHandler}
                setShowBookingModal={() => props.setShowBookingModal(true)}
                showBookingModal={props.showBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                payment={props.payment}
                booking={props.booking}
              ></HotelsBooking>
            )}
          </div>

          {props?.transferBookings && !props?.mercuryItinerary? (
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
                setShowFlightModal={_handleFlighModalShow}
                setHideFlightModal={_handleFlightModalClose}
                setShowBookingModal={() => props.setShowBookingModal(true)}
                setHideBookingModal={props.setHideBookingModal}
                payment={props.payment}
                transferBookings={props?.transferBookings}
                itinerary_id={props.itinerary_id}
                fetchData={props.fetchData}
                _GetInTouch={_GetInTouch}
              />
            </div>
          ) : (
            <>
            <TransferBookings
                    setShowLoginModal={setShowLoginModal}
                    showTaxiModal={props.showTaxiModal}
                    _updateFlightBookingHandler={
                      props._updateFlightBookingHandler
                    }
                    setShowTaxiModal={props.setShowTaxiModal}
                    getPaymentHandler={props.getPaymentHandler}
                    _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    _updateBookingHandler={props._updateBookingHandler}
                    showFlightModal={props.showFlightModal}
                    setShowFlightModal={_handleFlighModalShow}
                    setHideFlightModal={_handleFlightModalClose}
                    setShowBookingModal={() => props.setShowBookingModal(true)}
                    setHideBookingModal={props.setHideBookingModal}
                    payment={props.payment}
                    fetchData={props.fetchData}
                    _GetInTouch={_GetInTouch}
                  /></>
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
                setShowBookingModal={() => props.setShowBookingModal(true)}
                showBookingModal={props.showBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                activityBookings={props.activityBookings}
                payment={props.payment}
                booking={props.booking}
              />
            </div>
          )}

          <Modal
            centered
            show={showFooterBannerMobile}
            mobileWidth="90%"
            backdrop
            closeIcon={true}
            onCLose={() => setShowFooterBannerMobile(false)}
            onHide={_handleLoginClose}
            borderRadius={"12px"}
          >
            {props.payment ? (
              <div className=" ">
                <RxCross2
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowFooterBannerMobile(false)}
                />

                {!props.payment.is_registration_needed ? !props?.mercuryItinerary ? (
                  <SummaryContainer
                    setUserDetails={props.setUserDetails}
                    id={props.id}
                    stayBookings={props.stayBookings}
                    flightBookings={props.flightBookings}
                    activityBookings={props.activityBookings}
                    transferBookings={props.transferBookings}
                    setShowFooterBannerMobile={() =>
                      setShowFooterBannerMobile(true)
                    }
                    getPaymentHandler={props.getPaymentHandler}
                    payment={props.payment}
                    traveleritinerary={props.traveleritinerary}
                    blur={props.blur}
                    hide={_hidePaymentHandler}
                    experienceId={props.experienceId}
                    token={props.token}
                    setShowLoginModal={setShowLoginModal}
                    plan={props.plan}
                    _GetInTouch={() => _GetInTouch()}
                  ></SummaryContainer>
                ) :  <NewSummaryContainers payment={props?.payment} itineraryDate={props?.itineraryDate} mercuryItinerary={props?.mercuryItinerary} itinerary={props.itinerary}/> : (
                  <div>
                    <GITSummaryContainer
                      hasUserPaid={
                        props.payment
                          ? props.payment.paid_user
                            ? true
                            : false
                          : false
                      }
                      payment_status={props.payment_status}
                      plan={props.plan}
                      itinerary={props.itinerary}
                      getPaymentHandler={props.getPaymentHandler}
                      setUserDetails={props.setUserDetails}
                      id={props.id}
                      stayBookings={props.stayBookings}
                      flightBookings={props.flightBookings}
                      activityBookings={props.activityBookings}
                      transferBookings={props.transferBookings}
                      setShowFooterBannerMobile={() =>
                        setShowFooterBannerMobile(true)
                      }
                      payment={props.payment}
                      traveleritinerary={props.traveleritinerary}
                      blur={props.blur}
                      hide={_hidePaymentHandler}
                      experienceId={props.experienceId}
                      token={props.token}
                      setShowLoginModal={setShowLoginModal}
                    ></GITSummaryContainer>
                  </div>
                )}
              </div>
            ) : null}
          </Modal>
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
            <div id={"Itenary"}>
              {props.mercuryItinerary
                ? props?.itineraryDaybyDay && <DaybyDay transferBookings={props?.transferBookings}/>
                : props?.itinerary && (
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
                      setShowBookingModal={() =>
                        props.setShowBookingModal(true)
                      }
                      _GetInTouch={_GetInTouch}
                    ></NewItenaryMain>
                  )}
            </div>

            {isGroup ? (
              <div id={"Stays"}>
                <Register></Register>
              </div>
            ) : (
              <div id={"Stays"}>
                {props.mercuryItinerary ? (
                  <StaysContainer
                    payment={props.payment}
                    _updateBookingHandler={props._updateBookingHandler}
                    _updateStayBookingHandler={props._updateStayBookingHandler}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    getPaymentHandler={props.getPaymentHandler}
                    setShowBookingModal={() => props.setShowBookingModal(true)}
                    showBookingModal={props.showBookingModal}
                    setHideBookingModal={props.setHideBookingModal}
                    setShowLoginModal={setShowLoginModal}
                    _GetInTouch={_GetInTouch}
                    stayBookings={props?.stayBookings}
                  />
                ) : (
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
                    setShowBookingModal={() => props.setShowBookingModal(true)}
                    showBookingModal={props.showBookingModal}
                    setHideBookingModal={props.setHideBookingModal}
                    payment={props.payment}
                    booking={props.booking}
                    _GetInTouch={_GetInTouch}
                  ></HotelsBooking>
                )}
              </div>
            )}

            {props?.transferBookings ? (
              <div id={"Transfers"}>
                {props.mercuryItinerary ? (
                  <TransferBookings
                    setShowLoginModal={setShowLoginModal}
                    showTaxiModal={props.showTaxiModal}
                    _updateFlightBookingHandler={
                      props._updateFlightBookingHandler
                    }
                    setShowTaxiModal={props.setShowTaxiModal}
                    getPaymentHandler={props.getPaymentHandler}
                    _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    _updateBookingHandler={props._updateBookingHandler}
                    showFlightModal={props.showFlightModal}
                    setShowFlightModal={_handleFlighModalShow}
                    setHideFlightModal={_handleFlightModalClose}
                    setShowBookingModal={() => props.setShowBookingModal(true)}
                    setHideBookingModal={props.setHideBookingModal}
                    payment={props.payment}
                    fetchData={props.fetchData}
                    _GetInTouch={_GetInTouch}
                  />
                ) : (
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
                    setShowFlightModal={_handleFlighModalShow}
                    setHideFlightModal={_handleFlightModalClose}
                    setShowBookingModal={() => props.setShowBookingModal(true)}
                    setHideBookingModal={props.setHideBookingModal}
                    payment={props.payment}
                    transferBookings={props.transferBookings}
                    itinerary_id={props.itinerary_id}
                    fetchData={props.fetchData}
                    _GetInTouch={_GetInTouch}
                  />
                )}
              </div>
            ) : null}

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
                  setShowBookingModal={() => props.setShowBookingModal(true)}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  activityBookings={props.activityBookings}
                  payment={props.payment}
                  booking={props.booking}
                />
              </div>
            )}
          </div>
          {!props?.mercuryItinerary  ? (
            <div
              id="Booking_container"
              className="sticky top-[6rem] mt-40 ml-4 flex flex-col gap-3"
            >
              <SummaryContainer
                setUserDetails={props.setUserDetails}
                id={props.id}
                stayBookings={props.stayBookings}
                flightBookings={props.flightBookings}
                activityBookings={props.activityBookings}
                transferBookings={props.transferBookings}
                setShowFooterBannerMobile={() =>
                  setShowFooterBannerMobile(true)
                }
                getPaymentHandler={props.getPaymentHandler}
                payment={props.payment}
                traveleritinerary={props.traveleritinerary}
                blur={props.blur}
                hide={_hidePaymentHandler}
                experienceId={props.experienceId}
                token={props.token}
                setShowLoginModal={setShowLoginModal}
                plan={props.plan}
                _GetInTouch={() => _GetInTouch()}
              ></SummaryContainer>
            </div>
          ) : props?.mercuryItinerary ? <NewSummaryContainers payment={props?.payment} itineraryDate={props?.itineraryDate} mercuryItinerary={props?.mercuryItinerary} itinerary={props.itinerary} /> :null}
        </SplitScreen>
      ) : null}

      <div className="z-10 sticky shadow-lg z-2 bottom-[0px] bg-white px-1 py-2 md:hidden -mx-5">
        <div className="flex flex-row justify-between items-center mx-3">
          <div className="flex flex-col">
            <div className="text-sm">
              {props?.payment?.pay_only_for_one ||
              props?.payment?.show_per_person_cost
                ? "Per Person"
                : props.payment?.is_estimated_price
                ? `${props.payment.total_cost == 0 ? "" : "Estimated Price"}`
                : "Total Cost"}
            </div>
            {props.payment ? (
              <div>
                <span className="font-bold">
                  ₹{" "}
                  { !props?.mercuryItinerary ? (props?.payment?.pay_only_for_one ||
                  props?.payment?.show_per_person_cost
                    ? getIndianPrice(
                        Math.round(
                          Math.round(props.payment.per_person_discounted_cost) /
                            100
                        )
                      )
                    : getIndianPrice(
                        Math.round(
                          Math.round(props.payment.discounted_cost) / 100
                        )
                      )) : (props?.payment?.pay_only_for_one ||
                        props?.payment?.show_per_person_cost
                          ? getIndianPrice(
                              Math.round(
                                Math.round(props.payment.per_person_discounted_cost)
                              )
                            )
                          : getIndianPrice(
                              Math.round(
                                Math.round(props.payment.discounted_cost)
                              )
                            ))}
                  {"/-"}
                </span>
              </div>
            ) : null}
          </div>
          {props?.token && props?.payment?.paid_user && (
            <div className="border-[3px] flex  justify-center items-center text-[#04AA32] text-center font-medium  text-sm border-[#04AA32] px-[9px] py-[0px]">
              PAID
            </div>
          )}

          {props.tripsPage ? (
            <Button
              color="#111"
              fontWeight="600"
              fontSize="0.85rem"
              borderWidth="3px"
              width="10rem"
              borderRadius="8px"
              bgColor="#f8e000"
              onclick={handleCreateTripButton}
            >
              Craft a new trip!
            </Button>
          ) : (
            <>
              {!props.token ? (
                <div className="">
                  <Button
                    color="#111"
                    fontWeight="600"
                    fontSize="0.85rem"
                    borderWidth="3px"
                    width="10rem"
                    borderRadius="8px"
                    bgColor="#f8e000"
                    onclick={handleLoginButton}
                  >
                    Log in to proceed
                  </Button>
                </div>
              ) : null}

              {props.payment && props.token ? (
                props.payment?.itinerary_status ===
                  ITINERARY_STATUSES?.itinerary_finalized &&
                !props.payment?.paid_user &&
                props.payment?.user_allowed_to_pay ? (
                  props.payment.total_cost > 0 ? (
                    <div className="">
                      <Button
                        color="#111"
                        fontWeight="600"
                        fontSize="0.85rem"
                        borderWidth="2px"
                        width="10rem"
                        borderRadius="8px"
                        bgColor="#f8e000"
                        onclick={() =>
                          handleFooterBannerMobile("View Inclusions")
                        }
                      >
                        View Inclusions
                      </Button>
                    </div>
                  ) : (
                    <div className="">
                      <Button
                        color="#111"
                        fontWeight="600"
                        fontSize="0.85rem"
                        borderWidth="2px"
                        width="10rem"
                        borderRadius="8px"
                        bgColor="#f8e000"
                        onclick={() => handleButtonClick("Add Hotels")}
                      >
                        Add Hotels
                      </Button>
                    </div>
                  )
                ) : !props.payment.paid_user ? (
                  props.payment.is_registration_needed ? (
                    <div className="">
                      <Button
                        color="#111"
                        fontWeight="600"
                        fontSize="0.85rem"
                        borderWidth="2px"
                        width="10rem"
                        borderRadius="8px"
                        bgColor="#f8e000"
                        onclick={() =>
                          handleFooterBannerMobile("View Inclusions")
                        }
                      >
                        View Inclusions
                      </Button>
                    </div>
                  ) : (
                    <GetInTouchContainer className="">
                      <Button
                        color="#111"
                        fontWeight="600"
                        fontSize="0.85rem"
                        borderWidth="2px"
                        width="10rem"
                        borderRadius="8px"
                        bgColor="#f8e000"
                        loading={loading}
                        onclick={handleGetInTouch}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          <ImageLoader
                            dimensions={{ height: 50, width: 50 }}
                            dimensionsMobile={{ height: 50, width: 50 }}
                            height={"20px"}
                            width={"20px"}
                            widthmobile={"20px"}
                            leftalign
                            url={"media/icons/login/customer-service-black.png"}
                          />{" "}
                          <span>Get in touch!</span>
                        </div>
                      </Button>
                    </GetInTouchContainer>
                  )
                ) : (
                  <Button
                    color="#111"
                    fontWeight="600"
                    fontSize="0.85rem"
                    borderWidth="2px"
                    width="10rem"
                    borderRadius="8px"
                    bgColor="#f8e000"
                    onclick={() => handleButtonClick("View Bookingstays")}
                  >
                    View Bookings
                  </Button>
                )
              ) : null}
            </>
          )}
        </div>
      </div>

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

      {!props.preview ? (
        <PoiEditModal
          setItinerary={props.setItinerary}
          itinerary_id={props.id}
          selectedPoi={selectedPoi}
          tailored_id={
            props.booking ? props.booking[0]["tailored_itinerary"] : ""
          }
          _updatePaymentHandler={props._updatePaymentHandler}
          setShowPoiModal={() => _handlePoiEditModalOpen({ name: "kasol" })}
          showPoiModal={props.showPoiModal}
          setHidePoiModal={props.setHidePoiModal}
        ></PoiEditModal>
      ) : null}

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
    itineraryDaybyDay: state.ItineraryDaybyDay,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(SimpleTabsV2);

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
  if (props?.breif) {
    if (props.breif.city_slabs) {
      for (var j = 0; j < props.breif.city_slabs.length; j++) {
        if (!props.breif.city_slabs[j].is_trip_terminated) {
          totalcityslabs += 1;
        }
      }
    }
  }

  function replaceLatLong1(source, destination) {
    return {
      ...source,
      lat: destination.latitude,
      long: destination.longitude,
    };
  }
  if (props?.breif) {
    if (props.breif.city_slabs) {
      for (var j = 0; j < props.breif.city_slabs.length; j++) {
        if (!props.breif.city_slabs[j].is_trip_terminated) {
          totalcityslabs += 1;
        }
      }
    }
  }

  async function processRoutes2(props) {
    if (props?.breif && !props.mercuryItinerary) {
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
    }
    setcitydatadone(true);
    setCityData(CityDataTemp);
  }
  processRoutes2(props);

  async function processRoutes3(props) {

    CityDataTemp.push(props?.itinerary?.start_city);
    RoutesData.push(props?.itinerary?.start_city);
      for (var i = 0; i < props.cities.length; i++) {
        if (props.cities[i]?.city.longitude) {
          CityDataTemp.push(props.cities[i]);
          RoutesData.push(props.cities[i].city);
        } else {
          if (
            props.cities[i].city?.id &&
            props.cities[i].city?.duration > "0"
          ) {
            try {
              const data = await getCityDetails(
                props.cities[i].city?.id
              );
              const updatedRoutes = replaceLatLong1(
                props.cities[i].city,
                data
              );
              RoutesData.push(updatedRoutes);
              CityDataTemp.push(updatedRoutes);
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    
      CityDataTemp.push(props?.itinerary?.end_city);
      RoutesData.push(props?.itinerary?.end_city);
    setcitydatadone(true);
    setCityData(CityDataTemp);
  }
  processRoutes3(props);

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
