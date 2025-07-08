import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RiArrowDropDownLine, RiWhatsappFill } from "react-icons/ri";
import Button from "../../../components/ui/button/Index";
import { connect, useDispatch, useSelector } from "react-redux";
import { connect, useDispatch, useSelector } from "react-redux";
import * as orderaction from "../../../store/actions/order";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { getHumanDateWithYear } from "../../../services/getHumanDateWithYear";
import urls from "../../../services/urls";
import { ITINERARY_STATUSES } from "../../../services/constants";
import axiossalecreateinstance from "../../../services/sales/itinerary/SaleCreate";
import axios from "axios";
import Accordion from "./Accordion";
import { BsCalendar2, BsPeopleFill } from "react-icons/bs";
import { add, addDays, format, isBefore, parseISO, startOfDay } from "date-fns";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";
import { scroller } from "react-scroll";
import { pluralDetector } from "../../../helper/shortHelpers";
import SelectDate from "./gittailored/SelectDate";
import RegistrationModal from "../../../components/modals/gitregistrationform/Index";
import VerificationModal from "../../../components/modals/verify/Index";
import RegisteredUsersModal from "../../../components/modals/registeredusers/Index";
import TermsModal from "../../../components/modals/terms/PW";
import UiDropdown from "../../../components/UiDropdown";
import Link from "next/link";
import ImageLoader from "../../../components/ImageLoader";
import { logEvent } from "../../../services/ga/Index";
import openTailoredModal from "../../../services/openTailoredModal";
import CountdownTimer from "../../../components/countdownTimer/CountdownTimer";
import PricingSkeleton from "../../../components/itinerary/Skeleton/PricingSkeleton";
import Drawer from "../../../components/ui/Drawer";
import PassengerDetails from "../../../components/modals/passenger-details/PassengerDetails";
import { IoMdClose } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import { SocialShare } from "./SocialShare";
import media from "../../../components/media";
import SocialShareMobile from "./SocialShareMobile";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { axiosGetItineraryStatus, axiosUpdateItineraryDates } from "../../../services/itinerary/daybyday/preview";
import UpdateItineraryDates from "./UpdateItineraryDates";

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const Details = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const dispatch = useDispatch();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [Newitinerary, setNewitinerary] = useState(false);
  const [acoordianceOpen, setAcordianOpen] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showRegistration, setShowRegistartion] = useState(false);
  const [pax, setPax] = useState(props?.itinerary?.number_of_adults);
  const [focus, setFocus] = useState(false);
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  const addDaysToDate = (dateString, numberOfDays) => {
    const date = new Date(dateString);
    const newDate = add(date, { days: numberOfDays });
    const formattedDate = format(newDate, "yyyy-MM-dd");
    return formattedDate;
  };
  const [showSetPassenger, setShowSetPassenger] = useState(false);
  const [getInTouchLoading, setGetInTouchLoading] = useState(false);
  const { itinerary_status, transfers_status, pricing_status } = useSelector(
    (state) => state.ItineraryStatus
  );

  const passengersDetail = useSelector((state) => state.Passengers);
  //console.log("Iti",props?.itinerary);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    console.log("loading is:", props.loadpricing);
  }, [props.loadpricing]);

  const getCurrentDateIfOlder = (dateString) => {
    const currentDate = startOfDay(new Date()); // Get the current date at the start of the day

    const givenDate = new Date(dateString);
    const isOlder = isBefore(givenDate, currentDate);

    if (isOlder) {
      const nextDay = addDays(currentDate, 1); // Add one day to the current date
      return format(nextDay, "yyyy-MM-dd");
    }

    return dateString;
  };

 const convertDFormat = (dt) => {
  if (dt) {
    const date = parseISO(dt);
    const formattedDate = format(date, "MMM dd, yyyy"); 
    return formattedDate;
  }
  return "";
};

  const [date, setDate] = useState(
    getCurrentDateIfOlder(props?.itinerary?.start_date)
  );

  const _handleVerificationSuccess = () => {
    props.getPaymentHandler();
    setShowVerification(false);
  };

  const handleSelectOption = (option) => {
    // Perform additional actions with the selected option
    setDropdownOpen(false);
    setPax(option);
  };

  const scrollToElement = (elementId) => {
    scroller.scrollTo(elementId, {
      duration: 500,
      smooth: "easeInOutQuart",
      spy: true,
      offset: -150,
    });
  };

  // axiosUpdateItineraryDates
  //   .post(`${router.query.id}/update-dates/`)
  //   .then((res) => {})
  //   .catch((error) => {
  //     console.log("ERROR:UPDATING ITINERARY DATES", error.message);
  //   });

  const fetchItineraryStatus = async (itineraryId = router.query.id) => {
    try {
      const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
      const status = res.data?.celery;
      dispatch(
        setItineraryStatus("pricing_status", status?.PRICING || "PENDING")
      );
      dispatch(
        setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING")
      );
      dispatch(
        setItineraryStatus("hotels_status", status?.HOTELS || "PENDING")
      );
      dispatch(
        setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING")
      );
      fetchItinerary();
    } catch (err) {
      console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
    }
  };

  const fetchItinerary = async () => {
    props?.resetRef();
    // setWaitingForStatusUpdate(true);
    props.fetchData(true);
  };

  const setBookingSummary = () => {
    try {
      if (props.payment) {
        if (props.payment?.costings_breakdown)
          for (const booking in props.payment?.costings_breakdown) {
            if (props.payment?.costings_breakdown[booking].user_selected) {
              if (
                props.payment?.costings_breakdown[booking].booking_type ===
                "Accommodation"
              ) {
                bookingslist.push(
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "400",
                      letterSpacing: "1px",
                      marginBottom: "0.25rem",
                    }}
                    className={
                      props.blur
                        ? "font-lexend text-enter blurry-text"
                        : "font-lexend text-enter"
                    }
                  >
                    {props.payment?.costings_breakdown[booking].detail[
                      "duration"
                    ] +
                      "N at " +
                      props.payment?.costings_breakdown[booking].detail["name"]}
                  </p>
                );
                bookinglistwithcost.push(
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3fr 1fr",
                      margin: "0.5rem 0",
                      gridGap: "1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "300",
                        letterSpacing: "1px",
                        marginBottom: "0.25rem",
                      }}
                      className={
                        props.blur
                          ? "font-lexend text-enter blurry-text"
                          : "font-lexend text-enter"
                      }
                    >
                      {props.payment?.costings_breakdown[booking].detail[
                        "duration"
                      ] +
                        "N at " +
                        props.payment?.costings_breakdown[booking].detail[
                          "name"
                        ]}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "300",
                        letterSpacing: "1px",
                        marginBottom: "0.25rem",
                      }}
                      className={
                        props.blur
                          ? "font-lexend text-enter blurry-text"
                          : "font-lexend text-enter"
                      }
                    >
                      {"₹ " +
                        getIndianPrice(
                          Math.ceil(
                            props.payment?.costings_breakdown[booking][
                              "booking_cost"
                            ]
                          )
                        )}
                    </p>
                  </div>
                );
              } else {
                bookingslist.push(
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "400",
                      letterSpacing: "1px",
                      marginBottom: "0.25rem",
                    }}
                    className={
                      props.blur
                        ? "font-lexend text-enter blurry-text"
                        : "font-lexend text-enter"
                    }
                  >
                    {props.payment?.costings_breakdown[booking].detail["name"]}
                  </p>
                );
                bookinglistwithcost.push(
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3fr 1fr",
                      margin: "0.5rem 0",
                      gridGap: "1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "300",
                        letterSpacing: "1px",
                        marginBottom: "0.25rem",
                      }}
                      className={
                        props.blur
                          ? "font-lexend text-enter blurry-text"
                          : "font-lexend text-enter"
                      }
                    >
                      {
                        props.payment?.costings_breakdown[booking].detail[
                          "name"
                        ]
                      }
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "300",
                        letterSpacing: "1px",
                        marginBottom: "0.25rem",
                      }}
                      className={
                        props.blur
                          ? "font-lexend text-enter blurry-text"
                          : "font-lexend text-enter"
                      }
                    >
                      {"₹ " +
                        getIndianPrice(
                          Math.ceil(
                            props.payment?.costings_breakdown[booking][
                              "booking_cost"
                            ]
                          )
                        )}
                    </p>
                  </div>
                );
              }
            }
          }
      }
    } catch {}
  };

  let bookingslist = [];
  let bookinglistwithcost = [];
  // Date on which agoda changes made to box
  let oldaccommodation = false;
  if (props.traveleritinerary) oldaccommodation = true;

  setBookingSummary();

  function getURL() {
    const url = router.asPath.split("?")[0];
    const searchParams = new URLSearchParams(router.asPath.split("?")[1]);
    searchParams.delete("t");
    const newPath =
      url + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    return newPath;
  }

  let message =
    "Hey TTW! I need some help with my tailored experience - https://thetarzanway.com" +
    getURL();

  const _startRazorpayHandler = (data) => {
    // Razorpay payload

    let razorpayOptions = {
      amount: data.amount,
      // "currency": "INR",
      name: "The Tarzan Way Payment Portal",
      description: " data.data.description",
      image:
        "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
      order_id: data.order_id,
      // Payment successfull handler passed to razorpay
      handler: function (response) {
        setPaymentLoading(true);

        axios
          .post(
            "https://dev.suppliers.tarzanway.com/sales/verify/",
            { ...response },
            { headers: { Authorization: `Bearer ${props.token}` } }
          )
          .then((res) => {
            setPaymentLoading(false);
            props.getPaymentHandler();
          })
          .catch((err) => {
            setPaymentLoading(false);
          });
      },
      // User details will be present as user is logged in
      prefill: {
        name: props.name,
        email: props.email,
        contact: props.phone,
      },
      theme: {
        color: "#F7e700",
      },
    };

    try {
      var rzp1 = new window.Razorpay(razorpayOptions);
      rzp1.open();
    } catch (error) {}
  };

  const _saleCreateHandler = (id) => {
    setPaymentLoading(true);
    axiossalecreateinstance
      .post(
        "/",
        {
          itinerary_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        setPaymentLoading(false);

        _startRazorpayHandler(res.data);
      })
      .catch((err) => {
        setPaymentLoading(false);
      });
  };

  let optionsJSX = [];
  for (var i = props.number_of_adults; i <= 20; i++) {
    optionsJSX.push({ i });
  }

  const handleLoginButton = () => {
    props.setShowLoginModal(true);

    logEvent({
      action: "Login",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Log in to proceed",
        event_action: "Booking Slide",
      },
    });
  };

  const handleGetInTouch = () => {
    props._GetInTouch();

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Get in touch!",
        event_action: "Booking Slide",
      },
    });
  };

  const handleViewBooking = (label) => {
    scrollToElement("Stays");

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_action: "Booking Slide",
      },
    });
  };

  const handlePayNow = (label) => {
    if (label === "_saleCreateHandler") {
      _saleCreateHandler(props.id);
    } else {
      setShowVerification(true);
    }

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Pay Now & Book",
        event_action: "Booking Slide",
      },
    });
  };

  const handleTravellersDetails = () => {
    setShowRegistartion(true);

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Add Travellers Details",
        event_action: "Booking Slide",
      },
    });
  };

  const handleWhatsappChat = () => {
    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Chat on Whatsapp",
        event_action: "Booking Slide",
      },
    });

    window.open(
      urls.WHATSAPP + "?text=" + encodeURIComponent(message),
      "_blank"
    );
  };

  const handleTermsConditions = () => {
    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Terms & Conditions",
        event_action: "Booking Slide",
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
    <>
      {pricing_status === "PENDING" || props?.loadpricing ? (
        <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
          <PricingSkeleton />
        </div>
      ) : (
        <div
          className={`${
            props.payment?.paid_user ? "bg-[#98F0AB33]" : "bg-[#F7E70033]"
          }  -mt-[1rem] -mx-[1rem] mb-0`}
        >
          <div className=" mx-[1rem] mt-[1rem]">
            <div className="flex flex-row justify-between">
              {props.iscouponApplied &&
              props.payment?.discounted_cost != props.payment?.total_cost &&
              props.payment?.show_per_person_cost !=
                props.payment?.per_person_discounted_cost ? (
                <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                  <span>₹</span>
                  <div>
                    {props.payment?.show_per_person_cost ||
                    props.payment?.pay_only_for_one
                      ? getIndianPrice(
                          Math.round(props.payment?.per_person_total_cost)
                        )
                      : getIndianPrice(Math.round(props.payment?.total_cost))}
                    {"/-"}
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {props.iscouponApplied && props?.payment?.coupon_usage && (
                <div className="bg-[#EB5757] font-bold flex flex-row gap-1 items-center justify-center text-sm px-2 py-1 lg:mt-4 mt-0 text-white">
                  <div>{props?.payment?.coupon_usage?.usage_description}</div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-1">
                <div
                  show_per_person_cost={props.payment?.show_per_person_cost}
                  className={
                    props.blur
                      ? "font-lexend blurry-text"
                      : "font-lexend text-3xl flex flex-row items-center font-semibold"
                  }
                >
                  {props?.payment && <span>₹</span>}
                  {props?.payment && (
                    <div>
                      {props?.payment?.pay_only_for_one ||
                      props?.payment?.show_per_person_cost
                        ? getIndianPrice(
                            Math.round(
                              Math.round(
                                props.payment?.per_person_discounted_cost
                              )
                            )
                          )
                        : getIndianPrice(
                            Math.round(
                              Math.round(props.payment?.discounted_cost)
                            )
                          )}
                      {"/-"}
                    </div>
                  )}
                </div>

                {props.payment?.paid_user ? (
                  <div className="font-[400] pl-2 text-base self-end">PAID</div>
                ) : (
                  <div className="font-medium text-base self-end">
                    {props?.payment?.pay_only_for_one ||
                    props?.payment?.show_per_person_cost
                      ? "Per Person Cost"
                      : props.payment?.is_estimated_price
                      ? `${
                          props.payment?.total_cost == 0
                            ? ""
                            : "Estimated Price"
                        }`
                      : props?.payment
                      ? "Total Cost"
                      : ""}
                  </div>
                )}
              </div>

              {pricing_status === "FAILURE" ? (
                <p className="text-red-600 text-sm">
                  Get in touch to finalize the pricing!
                </p>
              ) : null}

              {props?.payment && pricing_status === "SUCCESS" && (
                <div className="text-[#7A7A7A] text-sm">
                  {props?.payment?.total_cost == 0
                    ? "No bookings added yet"
                    : "Inclusive of applicable taxes"}
                </div>
              )}
            </div>
          </div>

          {!oldaccommodation ? (
            <div
              className="px-2 pt-2"
              style={{
                marginBottom: "0.1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridColumnGap: "1rem",
              }}
            >
              {props.payment?.itinerary_status ===
                ITINERARY_STATUSES?.itinerary_finalized ||
              props?.plan?.featured ? null : (
                <div></div>
              )}

              {props.payment?.itinerary_status ===
                ITINERARY_STATUSES.itinerary_finalized ||
              props?.plan?.featured ? null : (
                <div></div>
              )}
            </div>
          ) : null}

          {props?.payment && (
            <div
              className="mx-[1rem]  font-medium text-sm flex gap-0 flex-row cursor-pointer"
              onClick={() => setAcordianOpen(!acoordianceOpen)}
            >
              <div>
                {acoordianceOpen ? <span>Hide</span> : <span>View</span>}{" "}
                {!props.payment?.are_prices_hidden ? "breakup" : "inclusions"}
              </div>

              <RiArrowDropDownLine
                className={` text-2xl  mt-1 transition-all duration-100 ${
                  acoordianceOpen ? "-rotate-180 " : "rotate-180 animate-bounce"
                }`}
              ></RiArrowDropDownLine>
            </div>
          )}

          <div
            className={`mb-[0.8rem] mx-[1rem] Transition-Height-${
              acoordianceOpen ? "in" : "out"
            } `}
          >
            {props?.payment && acoordianceOpen && (
              <div className="">
                <Accordion
                  stayBookings={props.stayBookings}
                  flightBookings={props.flightBookings}
                  activityBookings={props.activityBookings}
                  transferBookings={props.transferBookings}
                  payment={props.payment}
                  mercuryItinerary={props?.mercuryItinerary}
                ></Accordion>

                {!oldaccommodation && !props.payment?.are_prices_hidden ? (
                  <div className="flex flex-row justify-between">
                    <div
                      className={
                        props.blur
                          ? "font-lexend text-enter blurry-text "
                          : "font-lexend text-enter text-sm font-normal"
                      }
                    >
                      {"Surcharges & Taxes"}
                    </div>
                    <div
                      className={
                        props.blur
                          ? "font-lexend text-enter blurry-text font-bold"
                          : "font-lexend text-enter "
                      }
                    >
                      {"₹ " +
                        getIndianPrice(
                          Math.round(props.payment?.surcharges_and_taxes)
                        )}
                    </div>
                  </div>
                ) : null}

                {props.payment ? (
                  props.payment?.coupon && props.iscouponApplied ? (
                    props.payment?.coupon.code ? (
                      <div className="flex flex-row justify-between pt-2">
                        <div
                          className={
                            props.blur
                              ? "font-lexend text-enter blurry-text  "
                              : "font-lexend text-enter text-sm font-bold  flex flex-col"
                          }
                        >
                          {"Coupon Discount"}
                          <div className="flex flex-row gap-1">
                            <div className="text-[#02BF2B]">
                              {props.payment?.coupon.code}
                            </div>
                            <div className="font-normal ">
                              {props?.payment?.coupon?.discount_type == "Flat"
                                ? "(Flat  OFF!)"
                                : props?.payment?.coupon?.discount_type ==
                                  "1 Night Free Stay"
                                ? props?.payment?.coupon_usage?.discount
                                  ? `(INR ${getIndianPrice(
                                      Math.round(
                                        props?.payment?.coupon_usage?.discount
                                      )
                                    )}  OFF!)`
                                  : props.payment?.coupon.discount_value
                                  ? props.payment?.coupon.discount_value +
                                    "%  OFF!"
                                  : null
                                : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            props.blur
                              ? "font-lexend text-enter blurry-text "
                              : "font-lexend text-enter font-bold"
                          }
                        >
                          {props?.payment?.coupon_usage?.discount ? (
                            <div>
                              (-){" "}
                              {"₹" +
                                getIndianPrice(
                                  Math.round(
                                    props?.payment?.coupon_usage?.discount
                                  )
                                )}
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    ) : null
                  ) : null
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-0 pb-4">
        {props.couponJSX}
        <div className=" border-y border-[#F0F0F0] mb-3 mt-1">
          <UpdateItineraryDates
           itinerary={props?.itinerary}
  token={props.token}
  onUpdateSuccess={fetchItineraryStatus}
  convertDFormat={convertDFormat}
  tripsPage={props.tripsPage}
/>
          {/* <div className=" group flex flex-row gap-3 items-center py-[1rem]">
            <BsCalendar2 className="text-md text-[#7A7A7A]" />
            <div className="text-md font-medium text-black flex flex-row items-center gap-2">
              {props.tripsPage ? (
                <div>{props?.itinerary?.duration + " Nights"}</div>
              ) : (
                <div>
                  {convertDFormat(
                    props?.itinerary?.start_date
                      ? props?.itinerary?.start_date
                      : null
                  )}{" "}
                  -{" "}
                  {convertDFormat(
                    props?.itinerary?.end_date
                      ? props?.itinerary?.end_date
                      : null
                  )}
                </div>
              )} */}

              
                 {/* <>
                  <div className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:text-blue-500 group-hover:scale-110  active:scale-90">
                    <MdEdit
                      className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
                      onClick={() => setFocus(true)}
                    />
                  </div>
                  <div className="w-[1rem] h-[0.2rem]">
                    <SelectDate
                      date={date}
                      setDate={setDate}
                      setFocus={setFocus}
                      focus={focus}
                      token={props.token}
                    ></SelectDate>
                  </div>
                </>  */}
              {/* </div>
          </div>      */}
        </div>

        <div className="group text-md font-medium gap-3 flex flex-row items-center mb-2 ml-1">
          <BsPeopleFill className="text-md text-[#7A7A7A]" />
          <div className=" flex flex-row items-center text-md font-medium text-black">
            <div>
              {pax} {pluralDetector("Adult", pax)}{" "}
            </div>
            {props.itinerary?.number_of_children ? (
              <div>, {props.itinerary?.number_of_children} Children</div>
            ) : null}
            {props.itinerary?.number_of_infants ? (
              <div>
                , {props.itinerary?.number_of_infants}{" "}
                {pluralDetector("Infant", props.itinerary?.number_of_infants)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {props.tripsPage ? (
        <Button
          color="#111"
          fontWeight="500"
          fontSize="1rem"
          borderWidth="2px"
          width="100%"
          borderRadius="8px"
          bgColor="#f8e000"
          padding="12px"
          onclick={handleCreateTripButton}
        >
          Craft a new trip!
        </Button>
      ) : (
        <>
          {props?.token && (
            <GetInTouchContainer>
              <Button
                color="#111"
                fontWeight="500"
                fontSize="1rem"
                borderWidth="2px"
                width="100%"
                borderRadius="8px"
                bgColor="#f8e000"
                padding="12px"
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
                  {props?.loading ? (
                    <PulseLoader />
                  ) : (
                    <span>Get in touch!</span>
                  )}
                </div>
              </Button>
            </GetInTouchContainer>
          )}

          {!props.token && pricing_status === "SUCCESS" ? (
            <Button
              color="#111"
              fontWeight="500"
              fontSize="1rem"
              borderWidth="2px"
              width="100%"
              borderRadius="8px"
              bgColor="#f8e000"
              padding="12px"
              onclick={handleLoginButton}
            >
              Log in to proceed
            </Button>
          ) : (
            !props.token &&
            pricing_status === "FAILURE" && (
              <GetInTouchContainer>
                <Button
                  color="#111"
                  fontWeight="500"
                  fontSize="1rem"
                  borderWidth="2px"
                  width="100%"
                  borderRadius="8px"
                  bgColor="#f8e000"
                  padding="12px"
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
                    {props?.loading ? (
                      <PulseLoader />
                    ) : (
                      <span>Get in touch!</span>
                    )}
                  </div>
                </Button>
              </GetInTouchContainer>
            )
          )}
        </>
      )}

      <Button
        width="100%"
        margin="0.5rem 0 0 0"
        borderRadius="8px"
        hoverColor="white"
        fontWeight="400"
        padding="12px"
        onclick={handleWhatsappChat}
      >
        <div className="flex flex-row justify-center items-center">
          <RiWhatsappFill className="text-[#4da750] mr-2 text-xl" />
          <div>Chat on WhatsApp</div>
        </div>
      </Button>

      <div className="flex flex-row justify-center items-center text-[#01202B] mt-2">
        <Link
          href="/terms-conditions"
          target="_blank"
          onClick={handleTermsConditions}
        >
          <div>Terms & Conditions</div>
        </Link>
      </div>
      <div className="flex flex-row justify-center items-center text-[#01202B] mt-4">
        {!isPageWide && (
          <SocialShareMobile
            social_title={props?.social_title}
            // social_description={props?.social_description}
            // itineraryName={"Share This Itinerary"}
            // itineraryImage={props?.itinerary?.images?.[0]}
            more
          />
        )}
      </div>

      <RegistrationModal
        number_of_adults={
          props?.itinerary ? props?.itinerary?.number_of_adults : 5
        }
        payment={props.payment}
        plan={props.plan}
        date={date}
        id={props.id}
        show={showRegistration}
        hide={() => setShowRegistartion(false)}
        pax={pax}
      ></RegistrationModal>

      <VerificationModal
        date={date}
        pax={pax}
        onSuccess={_handleVerificationSuccess}
        show={showVerification}
        hide={() => setShowVerification(false)}
      ></VerificationModal>

      <RegisteredUsersModal
        registered_users={
          props.payment ? props.payment?.registered_users : null
        }
        show={showRegisteredUsers}
        hide={() => setShowRegisteredUsers(false)}
      ></RegisteredUsersModal>

      <TermsModal
        show={showTerms}
        hide={() => setShowTerms(false)}
      ></TermsModal>

      {props.token && Newitinerary && (
        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={() => setNewitinerary(false)}
          show={Newitinerary}
        />
      )}
      <Drawer
        show={showSetPassenger}
        anchor={"right"}
        backdrop
        width={"100%"}
        mobileWidth={"100%"}
        style={{ zIndex: 1601 }}
        className="font-lexend"
        onHide={() => setShowSetPassenger(false)}
      >
        <IoMdClose
          className="hover-pointer"
          onClick={(e) => {
            setShowSetPassenger(false);
          }}
          style={{ fontSize: "2rem" }}
        ></IoMdClose>
        <div className="p-[40px]">
          <PassengerDetails />
        </div>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    experience: state.experience.experience,
    durationSelected: state.experience.durationSelected,
    pax: state.experience.pax,
    selectedDate: state.experience.selectedDate,
    experienceCost: state.experience.experienceCost,
    serviceFee: state.experience.serviceFee,
    totalCost: state.experience.totalCost,
    token: state.auth.token,
    name: state.auth.name,
    phone: state.auth.phone,
    email: state.auth.email,
    checkoutStarted: state.experience.checkoutStarted,
    orderCreated: state.experience.orderCreated,
    couponApplied: state.experience.couponApplied,
    couponInvalid: state.experience.couponInvalid,
    plan: state.Plan,
    tripsPage: state.TripsPage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderDetails: (details) =>
      dispatch(orderaction.setOrderDetails(details)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
