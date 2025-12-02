import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { scroller } from "react-scroll";
import { RxCross2 } from "react-icons/rx";
import GITSummaryContainer from "./booking1/gittailored/Index";
import SummaryContainer from "./booking1/TailoredDetails";
import axiosLeadChat from "../../services/leads/chat.js";
import Register from "./register/Index";
import Breif from "./breif/NewIndex";
import OldBreif from "./breif/OldNewIndex.js";
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
import OldActivityBookings from "./ActivityBookings/OldActivityBooking.js";
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
import { connect, useDispatch, useSelector } from "react-redux";
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
import { setTransfersBookings } from "../../store/actions/transferBookingsStore.js";
import { TopicSharp } from "@mui/icons-material";
import { ItineraryStatusLoader } from "./ItineraryContainer.jsx";
import { useAnalytics } from "../../hooks/useAnalytics.js";
import ChatBot from "../../components/Chatbot/Index.js";
import Drawer from "../../components/ui/Drawer.js";
import Image from "next/image";
import {
  ChatProvider,
  useChatContext,
} from "../../components/Chatbot/context/ChatContext.js";
import { currencySymbols } from "../../data/currencySymbols.js";

const NotificationDot = styled.div`
  position: absolute;
  top: 7px;
  right: 19px;
  width: 16px;
  // height: 16px;
  // background-color: #fd6d6c;
  // border-radius: 50%;
  // border: 2px solid white;
  // animation: pulse 2s infinite;

  // @keyframes pulse {
  //   0% {
  //     box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
  //   }
  //   70% {
  //     box-shadow: 0 0 0 6px rgba(255, 68, 68, 0);
  //   }
  //   100% {
  //     box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
  //   }
  // }
`;

const useStyles = {
  root: `
    flex-grow-1
    pb-[30px]
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
  const [isChatBotEnable, handleChatBotOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const [countCartItems, setCountCartItems] = useState(0);
  const { hasUnreadMessages, setHasUnreadMessages } = useChatContext();
  const currency = useSelector(state=>state.currency);


  const transferBooking = useSelector(
    (state) => state.TransferBookings
  )?.transferBookings;
  const { pricing_status } = useSelector((state) => state.ItineraryStatus);
  const stays = useSelector((state) => state.Stays);
  const itneraryId = useSelector((state) => state.ItineraryId);
  const { trackGetInTouchClicked, trackPaymentPageViewed,trackChatOpened,trackSectionViewed} = useAnalytics();
  const [activeTab, setActiveTab] = useState("Itinerary");
  const [showChatBanner, setShowChatBanner] = useState(false);

   
  const [isHovered, setIsHovered] = useState(false);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginBottom: "5px",
  };

  useEffect(() => {
  const hasSeenBanner = localStorage.getItem('hasSeenChatBanner');
  if (!hasSeenBanner) {
    setShowChatBanner(true);
    localStorage.setItem('hasSeenChatBanner', 'true');
  }
}, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToElement("Itenary");
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (
      props?.payment?.summary &&
      Object.keys(props?.payment?.summary).length
    ) {
      const totalCount = Object.values(props.payment.summary).reduce(
        (sum, item) => sum + item.count,
        0
      );
      setCountCartItems(totalCount);
    }
  }, [props?.payment]);

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
    // console.log(totalcityslabs, "total city slabs");
  }, [props.breif, props.routes, props.cities]);

  const _GetInTouch = () => {
    setLoading(true);

    if (props.token) {
      // const email = localStorage.getItem("email");
      // const name = localStorage.getItem("name");
      // const phone = localStorage.getItem("phone");
      // axiosLeadChat
      //   .post("/", {
      //     email: email,
      //     name: name,
      //     phone: phone,
      //     source: "Itinerary",
      //     query_message: `I need help in completing booking.`,
      //   })
      axiosLeadChat
        .get(`${itneraryId}/get_in_touch/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          props.openNotification({
            type: "sucess",
            text: res.data.message,
            heading: "Request received.",
          });
          trackGetInTouchClicked(
            itneraryId,
            props?.payment?.discounted_cost,
            "Rupees"
          );
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
    { id: 1, label: "Itinerary", link: "Itenary" },
    { id: 2, label: "Bookings", link: "Booking" },
  ];

  const hasActivities =
    Array.isArray(props?.itinerary?.cities) &&
    props.itinerary.cities.some(
      (city) => Array.isArray(city?.activities) && city.activities.length > 0
    );

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
    setActiveTab(tabName);
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

  const handleFooterBannerMobile = (label) => {
    setShowFooterBannerMobile(!showFooterBannerMobile);
    trackPaymentPageViewed(router?.query?.id)

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

    // Enhanced tracking using passed function
    if (props.handleGetInTouchClick) {
      props.handleGetInTouchClick();
    }
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

  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    description: "",
  });

  const trustFactors = [
    {
      icon: "/assets/trustfactor/trust-factor-1.svg",
      text: "Trusted by 10,000+ Travelers",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "All costs are transparent and disclosed upfront. What you see is what you pay - no surprises at checkout.",
    },
    {
      icon: "/assets/trustfactor/trust-factor-2.svg",
      text: "24/7 Support",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "Round-the-clock customer support with complete pricing transparency. No hidden fees, ever.",
    },
    {
      icon: "/assets/trustfactor/trust-factor-3.svg",
      text: "GST Invoice Provided",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "Complete tax transparency with detailed GST invoices. All charges clearly itemized.",
    },
    {
      icon: "/assets/trustfactor/trust-factor-4.svg",
      text: "Secure Payments",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "Safe and secure payment gateway with transparent pricing. No hidden transaction fees.",
    },
  ];

  const handleIconClick = (factor) => {
    setPopupContent({
      title: factor.popupTitle,
      description: factor.popupDescription,
    });
    setShowPopup(true);
  };
  const itinearyId = router.query.id;

  return (
    <div className={classes.root}>
      {/* <div id={"Brief"}> */}
      {props?.mercuryItinerary && citydatadone ? (
        <Breif
          mercuryItinerary={props?.mercuryItinerary}
          loadbookings={props?.loadbookings}
          plan={props.plan}
          routesData={RoutesData}
          transfersData={TransfersData}
          cityTransferBookings={props.cityTransferBookings}
          routes={props.routes}
          payment={props.payment}
          traveleritinerary={props.traveleritinerary}
          CityData={CityData}
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          _updateFlightBookingHandler={props._updateFlightBookingHandler}
          // CityData={props?.cities}
          itinerary={props.itinerary}
          breif={props.breif}
          resetRef={props?.resetRef}
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
      ) : (
        citydatadone && (
          <OldBreif
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
          ></OldBreif>
        )
      )}
      {/* </div> */}

      {/* <div className={`z-10 sticky z-2 md:top-[0px] top-[1px] ${isPageWide ? 'mb-[40px]' : ''}`}>
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
      </div> */}

      {/* {isPageWide && (


        <div className="w-full z-[20] sticky flex flex-row top-[2px] justify-end -mt-[55px] ">
          <div className="z-[99] absolute  md:top-[0px] top-[0px] w-[20rem]">
            {props?.displayText ? <ItineraryStatusLoader
              displayText={props?.displayText}
              isVisible={props?.shouldShowLoader()}
            /> :
              <div className="flex flex-row justify-between ">

                {pricing_status === "PENDING" ? (
                  <div className="flex flex-col animate-pulse w-full max-w-[120px]">
                    <div className="h-3 w-20 bg-gray-300 rounded mb-1"></div>
                    <div className="h-5 w-24 bg-gray-400 rounded"></div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                     <div className="text-[0.725rem]">
                      {props?.payment?.pay_only_for_one ||
                        props?.payment?.show_per_person_cost
                        ? "Per Person"
                        : props.payment?.is_estimated_price
                          ? `${props.payment.total_cost === 0
                            ? "No Bookings"
                            : "Estimated Price"
                          }`
                          : "Total Cost"}
                    </div> 
                    {props.payment ? (
                      <div>
                        <span className="font-bold">
                          ₹{" "}
                          {!props?.mercuryItinerary
                            ? props?.payment?.pay_only_for_one ||
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
                              )
                            : props?.payment?.pay_only_for_one ||
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
                              )}
                          {"/-"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}

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
                    borderWidth="1px"
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
                          borderWidth="1px"
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
                              borderWidth="1px"
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
                              borderWidth="1px"
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
                              borderWidth="1px"
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
                              borderWidth="1px"
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
                          borderWidth="1px"
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
              </div>}
          </div>
        </div>
      )} */}

      {isPageWide ? null : (
        <>
          <div className={`z-10 sticky z-2 md:top-[0px] top-[1px]`}>
            <ScrollableMenuTabs
              icons={false}
              offset={isDesktop ? "0px" : "0px"}
              items={items}
              BarName="TabsName"
              scrollOffSet={-50}
            />
          </div>
          <div id={"Itenary"}>
            {props.mercuryItinerary ? (
              props?.itineraryDaybyDay && (
                <DaybyDay
                  mercuryItinerary={props?.mercuryItinerary}
                  activityBookings={props?.activityBookings}
                  setActivityBookings={props?.setActivityBookings}
                  itinerary={props.itinerary}
                  transferBookings={transferBooking}
                  setTransferBookings={props?.setTransferBookings}
                  setItinerary={props?.setItinerary}
                  payment={props.payment}
                  stayBookings={stays}
                  setStayBookings={props.setStayBookings}
                  _updateBookingHandler={props._updateBookingHandler}
                  _updateStayBookingHandler={props._updateStayBookingHandler}
                  _updateFlightBookingHandler={
                    props._updateFlightBookingHandler
                  }
                  _updatePaymentHandler={props._updatePaymentHandler}
                  getPaymentHandler={props.getPaymentHandler}
                  setShowBookingModal={props.setShowBookingModal}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  setShowLoginModal={setShowLoginModal}
                  _GetInTouch={_GetInTouch}
                />
              )
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

          <div id={"Booking"}>
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
                  stayBookings={stays}
                  setStayBookings={props.setStayBookings}
                  CityData={CityData}
                  cities={props?.cities}
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

            <div id={"Transfers"}>
              {props?.transferBookings && !props?.mercuryItinerary ? (
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
                  _updateFlightBookingHandler={
                    props._updateFlightBookingHandler
                  }
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
              ) : (
                <>
                  {props.transferBookings && (
                    <TransferBookings
                      mercuryItinerary={props?.mercuryItinerary}
                      setShowLoginModal={setShowLoginModal}
                      showTaxiModal={props.showTaxiModal}
                      _updateFlightBookingHandler={
                        props._updateFlightBookingHandler
                      }
                      setShowTaxiModal={props.setShowTaxiModal}
                      getPaymentHandler={props.getPaymentHandler}
                      _updateTaxiBookingHandler={
                        props._updateTaxiBookingHandler
                      }
                      _updatePaymentHandler={props._updatePaymentHandler}
                      _updateBookingHandler={props._updateBookingHandler}
                      showFlightModal={props.showFlightModal}
                      setShowFlightModal={_handleFlighModalShow}
                      setHideFlightModal={_handleFlightModalClose}
                      setShowBookingModal={() =>
                        props.setShowBookingModal(true)
                      }
                      setHideBookingModal={props.setHideBookingModal}
                      payment={props.payment}
                      fetchData={props.fetchData}
                      _GetInTouch={_GetInTouch}
                    />
                  )}
                </>
              )}
            </div>

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
                setShowLoginModal={setShowLoginModal}
              />
            </div>
          </div>

          <div className="fixed z-[9] bottom-[70px] max-sm:bottom-[97px] right-[10px] flex flex-col items-end gap-2">
  {/* Chat Banner */}
  {showChatBanner && !isPageWide && (
    <div className="relative bg-[#F7E700] text-black px-4 py-2 rounded-[12px] shadow-lg max-w-[290px] animate-slideIn">
      <button
        onClick={() => setShowChatBanner(false)}
        className="absolute top-2 right-2 text-black hover:text-gray-700"
      >
        <RxCross2 size={18} />
      </button>
      <p className="text-[14px] pr-6 mb-0 ">
        Hi, I am Kiara Your travel partner
      </p>
      {/* Speech bubble arrow */}
      <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#F7E700]"></div>
    </div>
  )}
  
  {/* Chat Button */}
  <div className="relative">
    <Button
      borderWidth="0px"
      onclick={() => {
        handleChatBotOpen(true);
        setShowChatBanner(false);
        router.push(
          {
            pathname: `/itinerary/${router.query.id}/`,
            query: {
              drawer: "chat",
            },
          },
          undefined,
          { scroll: false }
        );
        setHasUnreadMessages(false);
      }}
    >
      <Image
        src={"/assets/chatbot/chatbot-avaatar.svg"}
        alt="ticket"
        width={80}
        height={80}
      />
    </Button>
    {hasUnreadMessages && (
      <NotificationDot>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle opacity="0.2" cx="12" cy="12" r="11" fill="#FA3530" stroke="white" strokeWidth="2"/>
          <circle opacity="0.4" cx="12" cy="12" r="8" fill="#FA3530"/>
          <circle cx="12" cy="12" r="6" fill="#FA3530"/> 
        </svg>
      </NotificationDot>
    )}
  </div>
</div>
          {isChatBotEnable ? (
            <Drawer
              show={isChatBotEnable}
              anchor={"right"}
              backdrop
              width={"50%"}
              height={"100vh"}
              mobileWidth={"100%"}
              style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
              isCloseButtonEnable={true}
              onHide={() => {handleChatBotOpen(false)}}
              className="overflow-y-hidden"
            >
              <ChatBot showAsPopup={true} />
            </Drawer>
          ) : null}
        </>
      )}

      {isPageWide ? (
        <SplitScreen isPageWide leftWidth={5} rightWidth={5}>
          <div className="mb-4">
            <Navigation
              items={items}
              BarName="TabsName"
              ClickHandler={_handleMenuTabsChange}
              trackSectionViewed={trackSectionViewed}
            />
            <div
              id={"Itenary"}
              className={activeTab === "Itinerary" ? "block" : "hidden"}
            >
              {props.mercuryItinerary
                ? props?.itineraryDaybyDay && (
                    <DaybyDay
                      mercuryItinerary={props?.mercuryItinerary}
                      activityBookings={props?.activityBookings}
                      setActivityBookings={props?.setActivityBookings}
                      transferBookings={props?.transferBookings}
                      setTransferBookings={props?.setTransferBookings}
                      setItinerary={props?.setItinerary}
                      itinerary={props?.itinerary}
                      loadbookings={props?.loadbookings}
                      payment={props.payment}
                      stayBookings={stays}
                      setStayBookings={props.setStayBookings}
                      _updateBookingHandler={props._updateBookingHandler}
                      _updateStayBookingHandler={
                        props._updateStayBookingHandler
                      }
                      _updatePaymentHandler={props._updatePaymentHandler}
                      getPaymentHandler={props.getPaymentHandler}
                      _updateFlightBookingHandler={
                        props._updateFlightBookingHandler
                      }
                      _updateTaxiBookingHandler={
                        props._updateTaxiBookingHandler
                      }
                      setShowBookingModal={(val) =>
                        props.setShowStayBookingModal(val)
                      }
                      showBookingModal={props.showStayBookingModal}
                      setHideBookingModal={props.setHideBookingModal}
                      setShowLoginModal={setShowLoginModal}
                      _GetInTouch={_GetInTouch}
                    />
                  )
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

            <div
              id={"Booking"}
              className={
                activeTab === "Bookings" ? "block mb-[100px]" : "hidden"
              }
            >
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
                      _updateStayBookingHandler={
                        props._updateStayBookingHandler
                      }
                      _updatePaymentHandler={props._updatePaymentHandler}
                      getPaymentHandler={props.getPaymentHandler}
                      setShowBookingModal={(value) =>
                        props.setShowBookingModal(value)
                      }
                      showBookingModal={props.showBookingModal}
                      setHideBookingModal={props.setHideBookingModal}
                      setShowLoginModal={setShowLoginModal}
                      _GetInTouch={_GetInTouch}
                      stayBookings={stays}
                      setStayBookings={props.setStayBookings}
                      CityData={CityData}
                      cities={props?.cities}
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
                      _updateStayBookingHandler={
                        props._updateStayBookingHandler
                      }
                      _updatePaymentHandler={props._updatePaymentHandler}
                      getPaymentHandler={props.getPaymentHandler}
                      setShowBookingModal={() =>
                        props.setShowBookingModal(true)
                      }
                      showBookingModal={props.showBookingModal}
                      setHideBookingModal={props.setHideBookingModal}
                      payment={props.payment}
                      booking={props.booking}
                      _GetInTouch={_GetInTouch}
                    ></HotelsBooking>
                  )}
                </div>
              )}

              <div id={"Transfers"}>
                {props.mercuryItinerary ? (
                  <>
                    <TransferBookings
                      mercuryItinerary={props?.mercuryItinerary}
                      loadbookings={props?.loadbookings}
                      setShowLoginModal={setShowLoginModal}
                      showTaxiModal={props.showTaxiModal}
                      _updateFlightBookingHandler={
                        props._updateFlightBookingHandler
                      }
                      setShowTaxiModal={props.setShowTaxiModal}
                      getPaymentHandler={props.getPaymentHandler}
                      _updateTaxiBookingHandler={
                        props._updateTaxiBookingHandler
                      }
                      _updatePaymentHandler={props._updatePaymentHandler}
                      _updateBookingHandler={props._updateBookingHandler}
                      showFlightModal={props.showFlightModal}
                      setShowFlightModal={_handleFlighModalShow}
                      setHideFlightModal={_handleFlightModalClose}
                      setShowBookingModal={() =>
                        props.setShowBookingModal(true)
                      }
                      setHideBookingModal={props.setHideBookingModal}
                      payment={props.payment}
                      fetchData={props.fetchData}
                      _GetInTouch={_GetInTouch}
                    />
                  </>
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
                    CityData={CityData}
                    _GetInTouch={_GetInTouch}
                  />
                )}
              </div>

              {props?.mercuryItinerary ? (
                <div id={"Activities"} className="w-full">
                  <ActivityBookings
                    mercuryItinerary={props?.mercuryItinerary}
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
                    setShowLoginModal={setShowLoginModal}
                  />
                </div>
              ) : (
                props.activityBookings && (
                  <div id={"Activities"}>
                    <OldActivityBookings
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
                      _updateStayBookingHandler={
                        props._updateStayBookingHandler
                      }
                      _updatePaymentHandler={props._updatePaymentHandler}
                      flightBookings={props.flightBookings}
                      getPaymentHandler={props.getPaymentHandler}
                      setShowBookingModal={() =>
                        props.setShowBookingModal(true)
                      }
                      showBookingModal={props.showBookingModal}
                      setHideBookingModal={props.setHideBookingModal}
                      activityBookings={props.activityBookings}
                      payment={props.payment}
                      booking={props.booking}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          {!props?.mercuryItinerary ? (
            <div
              id="Booking_container"
              className="sticky top-[6rem] mt-40 ml-4 flex flex-col gap-3"
            >
              <SummaryContainer
                setUserDetails={props.setUserDetails}
                id={props.id}
                stayBookings={stays || props.stayBookings}
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
          ) : props?.mercuryItinerary ? (
            <>
              <div className="sticky top-[1rem] ml-5">
                <ChatBot />
              </div>
            </>
          ) : null}
        </SplitScreen>
      ) : null}

      {/* <Modal
        centered
        show={showFooterBannerMobile}
        backdrop
        closeIcon={true}
        onCLose={() => setShowFooterBannerMobile(false)}
        onHide={() => {}}
        borderRadius={"12px"}
      > */}
      {showFooterBannerMobile && (
        <>
          {props.payment ? (
            <>
              {!props.payment.is_registration_needed ? (
                !props?.mercuryItinerary ? (
                  <SummaryContainer
                    setUserDetails={props.setUserDetails}
                    id={props.id}
                    stayBookings={stays || props.stayBookings}
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
                ) : (
                  <NewSummaryContainers
                    id={props.itinerary_id}
                    token={props.token}
                    loadpricing={props?.loadpricing}
                    payment={props?.payment}
                    itineraryDate={props?.itineraryDate}
                    getPaymentHandler={props.getPaymentHandler}
                    mercuryItinerary={props?.mercuryItinerary}
                    itinerary={props.itinerary}
                    fetchData={props.fetchData}
                    resetRef={props?.resetRef}
                    _GetInTouch={() => _GetInTouch()}
                    setShowLoginModal={setShowLoginModal}
                    setShowFooterBannerMobile={() =>
                      setShowFooterBannerMobile(false)
                    }
                    openPaymentDrawer={true}
                    blur={props.blur}
                    loading={loading}
                    social_title={props?.social_title}
                    social_description={props?.social_description}
                    itineraryName={props.itinerary.name}
                    itineraryImage={props?.itinerary?.images?.[0]}
                  />
                )
              ) : (
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
            </>
          ) : null}
        </>
      )}
      {/* </Modal> */}

      <div
        className={
          isPageWide
            ? "z-10  fixed bottom-0 shadow-lg bg-white px-[16px] py-[12px] desktop-view-cart-fixed"
            : "z-10 fixed bottom-0 left-0 right-0 shadow-lg bg-white p-md"
        }
      >
        {props?.displayText ? (
          <ItineraryStatusLoader
            displayText={props?.displayText}
            isVisible={props?.shouldShowLoader()}
          />
        ) : (
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <div className="flex justify-between">
                {pricing_status === "FAILURE" ? (
                  <p className="text-red-600 text-sm">
                    Get in touch to finalize the pricing!
                  </p>
                ) : null}
                {pricing_status === "FAILURE" ? (
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
                ) : null}
              </div>
              {props?.payment && (
                <div className="text-[12px] text-[#6E757A]">
                  {props?.payment?.pay_only_for_one ||
                  props?.payment?.show_per_person_cost
                    ? "Per Person"
                    : props.payment?.is_estimated_price
                    ? `${
                        props.payment.total_cost == 0 ? "" : "Estimated Price"
                      }`
                    : "Total Cost"}
                </div>
              )}
              {props.payment ? (
                <div>
                  <span className="font-bold font-[20px] ">
                    {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{" "}
                    {!props?.mercuryItinerary
                      ? props?.payment?.pay_only_for_one ||
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
                              Math.round(props.payment.discounted_cost) / 100
                            )
                          )
                      : props?.payment?.pay_only_for_one ||
                        props?.payment?.show_per_person_cost
                      ? getIndianPrice(
                          Math.round(
                            Math.round(props.payment.per_person_discounted_cost)
                          )
                        )
                      : getIndianPrice(
                          Math.round(Math.round(props.payment.discounted_cost))
                        )}
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
                borderWidth="1px"
                width="10rem"
                borderRadius="8px"
                bgColor="#f8e000"
                onclick={handleCreateTripButton}
              >
                Craft a new trip!
              </Button>
            ) : (
              <>
                {props.payment ? (
                  (props.payment?.itinerary_status ===
                    ITINERARY_STATUSES?.itinerary_finalized ||
                    pricing_status === "SUCCESS") &&
                  !props.payment?.paid_user &&
                  // props.payment?.user_allowed_to_pay ? (
                  (props.payment.total_cost > 0 ||
                    props?.payment?.discounted_cost > 0) ? (
                    <div className="flex flex-row gap-4 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="30"
                        viewBox="0 0 23 30"
                        fill="none"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <path
                          d="M11.3333 29.75L1.13333 22.1C0.779167 21.8403 0.501736 21.5097 0.301042 21.1083C0.100347 20.7069 0 20.2819 0 19.8333V2.83333C0 2.05417 0.277431 1.38715 0.832292 0.832292C1.38715 0.277431 2.05417 0 2.83333 0H19.8333C20.6125 0 21.2795 0.277431 21.8344 0.832292C22.3892 1.38715 22.6667 2.05417 22.6667 2.83333V19.8333C22.6667 20.2819 22.5663 20.7069 22.3656 21.1083C22.1649 21.5097 21.8875 21.8403 21.5333 22.1L11.3333 29.75ZM11.3333 26.2083L19.8333 19.8333V2.83333H2.83333V19.8333L11.3333 26.2083ZM9.84583 18.4167L17.85 10.4125L15.8667 8.35833L9.84583 14.3792L6.87083 11.4042L4.81667 13.3875L9.84583 18.4167ZM11.3333 2.83333H2.83333H19.8333H11.3333Z"
                          fill="#AD5BE7"
                          className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90 relative"
                          // onMouseEnter={() => setIsHovered(true)}
                          // onMouseLeave={() => setIsHovered(false)}
                        />
                      </svg>
                      <button
                        className="ttw-btn-secondary-fill"
                        onClick={() =>
                          handleFooterBannerMobile("View Inclusions")
                        }
                      >
                        View Cart{" "}
                        <span className="ttw-btn-count-white">
                          {" "}
                          {countCartItems}{" "}
                        </span>
                      </button>

                      <div
                        style={popupStyle}
                        className="z-50 absolute -top-11  text-sm text-center flex flex-col gap-2 bg-white"
                      >
                        <div className="relative">
                          <span className="absolute top-2 -left-5 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-red"></span>
                          {/* <span className="absolute -bottom-2 left-1/4 w-0 h-0 border-[10px] border-solid border-transparent border-t-[#2b2b2a]"></span> */}

                          <div className="text-nowrap font-normal text-black text-sm">
                            No Hidden Charges,
                            <br />
                            Includes taxes
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : !props.payment.paid_user ? (
                    <div className="">
                      <button
                        className="ttw-btn-secondary-fill"
                        onClick={() =>
                          handleFooterBannerMobile("View Inclusions")
                        }
                      >
                        View Cart{" "}
                        <span className="ttw-btn-count-white">
                          {" "}
                          {countCartItems}{" "}
                        </span>
                      </button>
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
                ) : null}
              </>
            )}
          </div>
        )}
        <div className="flex overflow-x-auto md:grid md:[grid-template-columns:1.3fr_0.8fr_1fr_1fr] gap-3 mt-2 pt-2 border-t border-gray-200 scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {trustFactors.map((factor, index) => (
            <div
              key={index}
              className="flex items-center text-[#ACACAC] text-xs flex-shrink-0"
            >
              <div className="flex items-center gap-1.5 text-gray-500">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M5.73333 9.73333L10.4333 5.03333L9.5 4.1L5.73333 7.86667L3.83333 5.96667L2.9 6.9L5.73333 9.73333ZM6.66667 13.3333C5.74444 13.3333 4.87778 13.1583 4.06667 12.8083C3.25556 12.4583 2.55 11.9833 1.95 11.3833C1.35 10.7833 0.875 10.0778 0.525 9.26667C0.175 8.45555 0 7.58889 0 6.66667C0 5.74444 0.175 4.87778 0.525 4.06667C0.875 3.25556 1.35 2.55 1.95 1.95C2.55 1.35 3.25556 0.875 4.06667 0.525C4.87778 0.175 5.74444 0 6.66667 0C7.58889 0 8.45555 0.175 9.26667 0.525C10.0778 0.875 10.7833 1.35 11.3833 1.95C11.9833 2.55 12.4583 3.25556 12.8083 4.06667C13.1583 4.87778 13.3333 5.74444 13.3333 6.66667C13.3333 7.58889 13.1583 8.45555 12.8083 9.26667C12.4583 10.0778 11.9833 10.7833 11.3833 11.3833C10.7833 11.9833 10.0778 12.4583 9.26667 12.8083C8.45555 13.1583 7.58889 13.3333 6.66667 13.3333ZM6.66667 12C8.15555 12 9.41667 11.4833 10.45 10.45C11.4833 9.41667 12 8.15555 12 6.66667C12 5.17778 11.4833 3.91667 10.45 2.88333C9.41667 1.85 8.15555 1.33333 6.66667 1.33333C5.17778 1.33333 3.91667 1.85 2.88333 2.88333C1.85 3.91667 1.33333 5.17778 1.33333 6.66667C1.33333 8.15555 1.85 9.41667 2.88333 10.45C3.91667 11.4833 5.17778 12 6.66667 12Z"
                    fill="#ACACAC"
                  />
                </svg> */}
                <img
                  src={factor.icon}
                  alt={factor.title}
                  className="w-[20px] h-[20px]"
                />
                <span className="text-xs md:text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-none">
                  {factor.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {isPageWide && (
        <div
          onClick={() => setShare((prev) => !prev)}
          className="z-[999] flex fixed bottom-[90px] right-[25px] p-[18px] w-fit items-center justify-center rounded-full cursor-pointer bg-black mb-[1rem]"
        >
          {share ? (
            <IoMdClose className="animate-popOut text-[25px] text-white" />
          ) : (
            <BsShareFill className="animate-popOut text-[25px] text-white" />
          )}
        </div>
      )} */}

      {isPageWide && (
        <SocialShareDesktop
          social_title={props?.social_title}
          social_description={props?.social_description}
          itineraryName={props.itinerary.name}
          itineraryImage={props?.itinerary?.images?.[0]}
          setShare={setShare}
          share={share}
        />
      )}

      {/* <div
        onClick={() => setShareMobile((prev) => !prev)}
        className="z-[999] fixed bottom-[160px] right-[22px] md:right-[16px] md:hidden bg-black  p-[18px] w-fit flex items-center justify-center rounded-full cursor-pointer"
      >
        <BsShareFill className="text-[25px] text-white " />
      </div>

      {shareMobile && (
        <div className="md:hidden">
          <SocialShareMobile
            social_title={props?.social_title}
            social_description={props?.social_description}
            itineraryName={props.itinerary.name}
            itineraryImage={props?.itinerary?.images?.[0]}
            setShare={setShareMobile}
          />
        </div>
      )} */}

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

      <div className="width-[100%] z-[1650]">
        <LogInModal
          show={showLoginModal}
          onhide={_handleLoginClose}
          itinary_id={props.id}
          zIndex={"3300"}
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
    transferBookings: state.TransferBookings?.transferBookings,
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
      // CityDataTemp.push(props?.itinerary?.start_city);
      //  RoutesData.push(props?.itinerary?.start_city);
      for (var i = 0; i < props.breif.city_slabs.length; i++) {
        if (props.breif.city_slabs[i].long) {
          CityDataTemp.push(props.breif.city_slabs[i]);
          RoutesData.push(props.breif.city_slabs[i]);
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
              RoutesData.push(updatedRoutes);
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
  // processRoutes2(props);

  async function processRoutes3(props) {
    if (props?.mercuryItinerary) {
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
              const data = await getCityDetails(props.cities[i].city?.id);
              const updatedRoutes = replaceLatLong1(props.cities[i].city, data);
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
