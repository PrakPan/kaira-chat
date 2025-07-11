import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../../../../components/newheading/heading/Index";
import Button from "../../../../components/Button";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { connect } from "react-redux";
import * as orderaction from "../../../../store/actions/order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRupeeSign,
  faTimes,
  faMale,
  faChild,
  faBaby,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import { getHumanDate } from "../../../../services/getHumanDate";
import urls from "../../../../services/urls";
import Accordion from "../Accordion";
import SelectDate from "./SelectDate";
import SelectPax from "./SelectPax";
import RegistrationModal from "../../../../components/modals/gitregistrationform/Index";
import VerificationModal from "../../../../components/modals/verify/Index";
import dayjs from "dayjs";
import { ITINERARY_STATUSES } from "../../../../services/constants";
import axios from "axios";
import axiossalecreateinstance from "../../../../services/sales/itinerary/SaleCreate";
import TermsModal from "../../../../components/modals/terms/PW";
import RegisteredUsersModal from "../../../../components/modals/registeredusers/Index";

const SummaryContainer = styled.div`
  height: max-content;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  @media screen and (min-width: 768px) {
    margin: 0;
    position: sticky;
    top: 11vh;
  }
`;

const INR = styled.p`
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 0;
`;

const StrikedCost = styled.p`
  position: relative;
  width: max-content;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1rem;
  &:before {
    position: absolute;
    content: "";
    left: 0;
    top: 45%;
    right: 0;
    border-top: 2px solid;
    border-color: inherit;
    -webkit-transform: skewY(-10deg);
    -moz-transform: skewY(-10deg);
    transform: skewY(-10deg);
  }

  @media screen and (min-width: 768px) {
    &:before {
      position: absolute;
      content: "";
      left: 0;
      top: 45%;
      right: 0;
      border-top: 2px solid;
      border-color: inherit;
      -webkit-transform: skewY(-10deg);
      -moz-transform: skewY(-10deg);
      transform: skewY(-10deg);
    }
  }
`;

const Details = (props) => {
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);

  const setBookingSummary = () => {
    try {
      if (props.payment) {
        if (props.payment.costings_breakdown)
          for (const booking in props.payment.costings_breakdown) {
            if (props.payment.costings_breakdown[booking].user_selected) {
              if (
                props.payment.costings_breakdown[booking].booking_type ===
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
                    {props.payment.costings_breakdown[booking].detail[
                      "duration"
                    ] +
                      "N at " +
                      props.payment.costings_breakdown[booking].detail["name"]}
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
                      {props.payment.costings_breakdown[booking].detail[
                        "duration"
                      ] +
                        "N at " +
                        props.payment.costings_breakdown[booking].detail[
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
                          Math.round(
                            props.payment.costings_breakdown[booking][
                              "booking_cost"
                            ] / 100
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
                    {props.payment.costings_breakdown[booking].detail["name"]}
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
                      {props.payment.costings_breakdown[booking].detail["name"]}
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
                          Math.round(
                            props.payment.costings_breakdown[booking][
                              "booking_cost"
                            ] / 100
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    try {
      setPax(props.payment.meta_info.number_of_adults);
    } catch {}
  }, [props.payment]);

  let bookingslist = [];
  let bookinglistwithcost = [];
  // Date on which agoda changes made to box
  let oldaccommodation = false;
  if (props.traveleritinerary) oldaccommodation = true;

  setBookingSummary();
  let message =
    "Hey TTW! I need some help with my tailored experience - https://www.thetarzanway.com/" +
    router.asPath;
  const [showVerification, setShowVerification] = useState(false);
  const [showRegistration, setShowRegistartion] = useState(false);
  const [pax, setPax] = useState(5);
  const [date, setDate] = useState(dayjs());

  const _handleVerificationSuccess = () => {
    props.getPaymentHandler();
    setShowVerification(false);
  };

  const [paymentLoading, setPaymentLoading] = useState(false);

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
            "https://suppliers.tarzanway.com/sales/verify/",
            { ...response },
            { headers: { Authorization: `Bearer ${props.token}` } }
          )
          .then((res) => {
            setPaymentLoading(false);
            window.location.href =
              "https://www.thetarzanway.com/itinerary/physicswallah/" +
              data.itinerary +
              "?payment_status=success";
          })
          .catch((err) => {
            setPaymentLoading(false);
            window.location.href =
              "https://www.thetarzanway.com/itinerary/physicswallah/" +
              data.itinerary +
              "?payment_status=fail";
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
    var rzp1 = new window.Razorpay(razorpayOptions);
    rzp1.open();
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

  return (
    <SummaryContainer
      className="border-thin"
      style={{ marginBottom: props.traveleritinerary ? "12.5vh" : "0" }}
    >
      {window.innerWidth > 768 ? null : (
        <FontAwesomeIcon
          icon={faTimes}
          onClick={props.hide}
          style={{ textAlign: "right" }}
        />
      )}
      {props.hasUserPaid ? (
        <Heading
          bold
          blur={props.blur}
          margin="0 auto 1.5rem auto"
          noline
          align="center"
        >
          {"You're all set!"}
        </Heading>
      ) : null}
      {!props.hasUserPaid ? (
        <Heading
          bold
          blur={props.blur}
          margin="0 auto 1.5rem auto"
          noline
          align="center"
        >
          {"Book Now"}
        </Heading>
      ) : null}

      {!oldaccommodation ? (
        <div
          style={{
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridColumnGap: "1rem",
          }}
        >
          {props.payment.itinerary_status ===
            ITINERARY_STATUSES.itinerary_finalized || props.plan.featured ? (
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "1px",
                marginBottom: "0.25rem",
              }}
              className={
                props.blur
                  ? "font-lexend text-enter blurry-text"
                  : "font-lexend text-enter"
              }
            >
              {"STARTING DATE "}
            </p>
          ) : (
            <div></div>
          )}
          {props.payment.itinerary_status ===
            ITINERARY_STATUSES.itinerary_finalized || props.plan.featured ? (
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "1px",
                marginBottom: "0.25rem",
              }}
              className={
                props.blur
                  ? "font-lexend text-enter blurry-text"
                  : "font-lexend text-enter"
              }
            >
              PAX
            </p>
          ) : (
            <div></div>
          )}
          {props.payment.itinerary_status ===
            ITINERARY_STATUSES.itinerary_finalized || props.plan.featured ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.75rem",
                fontWeight: "400",
                letterSpacing: "1px",
                marginBottom: "0",
              }}
              className={
                props.blur
                  ? "font-lexend text-enter blurry-text"
                  : "font-lexend text-enter"
              }
            >
              {props.payment.meta_info
                ? props.payment.meta_info.start_date
                  ? getHumanDate(
                      props.payment.meta_info.start_date.replaceAll("-", "/")
                    )
                  : null
                : null}
            </div>
          ) : (
            <SelectDate
              date={date}
              setDate={setDate}
              token={props.token}
            ></SelectDate>
          )}
          {props.payment.meta_info &&
          (props.payment.itinerary_status ===
            ITINERARY_STATUSES.itinerary_finalized ||
            props.plan.featured) ? (
            <div>
              <FontAwesomeIcon
                icon={faMale}
                style={{ marginRight: "0.25rem" }}
              ></FontAwesomeIcon>
              <p
                className="font-lexend"
                style={{
                  marginRight: "1rem",
                  display: "inline",
                  fontWeight: "100",
                }}
              >
                {props.payment.meta_info.number_of_adults}
              </p>
              <FontAwesomeIcon
                icon={faChild}
                style={{ marginRight: "0.25rem" }}
              ></FontAwesomeIcon>
              <p
                className="font-lexend"
                style={{
                  marginRight: "1rem",
                  display: "inline",
                  fontWeight: "100",
                }}
              >
                {props.payment.meta_info.number_of_children}
              </p>
              <FontAwesomeIcon
                icon={faBaby}
                style={{ marginRight: "0.25rem" }}
              ></FontAwesomeIcon>
              <p
                className="font-lexend"
                style={{
                  marginRight: "1rem",
                  display: "inline",
                  fontWeight: "100",
                }}
              >
                {props.payment.meta_info.number_of_infants}
              </p>
            </div>
          ) : (
            <SelectPax
              number_of_adults={
                props.payment
                  ? props.payment.meta_info
                    ? props.payment.meta_info.number_of_adults
                    : 5
                  : 5
              }
              setPax={setPax}
              token={props.token}
              setShowLoginModal={props.setShowLoginModal}
            ></SelectPax>
          )}
        </div>
      ) : null}
      <div style={{ marginBottom: "1.5rem" }}>
        <Accordion
          stayBookings={props.stayBookings}
          flightBookings={props.flightBookings}
          activityBookings={props.activityBookings}
          transferBookings={props.transferBookings}
          payment={props.payment}
        ></Accordion>

        {!oldaccommodation && !props.payment.are_prices_hidden ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto max-content",
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
              {"Service Fee"}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: "300",
                textAlign: "right",
                letterSpacing: "1px",
                marginBottom: "0.25rem",
                marginRight: "24px",
              }}
              className={
                props.blur
                  ? "font-lexend text-enter blurry-text"
                  : "font-lexend text-enter"
              }
            >
              {"₹ " +
                getIndianPrice(
                  Math.round(props.payment.total_service_fee / 100)
                )}
            </p>
          </div>
        ) : null}
        {!oldaccommodation && !props.payment.are_prices_hidden ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto max-content",
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
              {"GST"}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                textAlign: "right",
                fontWeight: "300",
                letterSpacing: "1px",
                marginBottom: "0.25rem",
                marginRight: "24px",
              }}
              className={
                props.blur
                  ? "font-lexend text-enter blurry-text"
                  : "font-lexend text-enter"
              }
            >
              {"₹ " + getIndianPrice(Math.round(props.payment.gst / 100))}
            </p>
          </div>
        ) : null}
      </div>
      <div></div>
      {props.payment ? (
        props.payment.coupon ? (
          props.payment.coupon.code ? (
            <div
              className="text-center font-lexend"
              style={{ marginBottom: "1rem" }}
            >
              {"Coupon Applied: " + props.payment.coupon.code}
            </div>
          ) : null
        ) : null
      ) : null}
      <div
        style={{
          display: "flex",
          width: "max-content",
          margin: "auto",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <StrikedCost
          show_per_person_cost={props.payment.show_per_person_cost}
          coupon={props.payment.coupon}
          className={props.blur ? "font-lexend blurry-text" : "font-lexend"}
        >
          <FontAwesomeIcon
            style={{ marginRight: "2px" }}
            icon={faRupeeSign}
          ></FontAwesomeIcon>
          {getIndianPrice(
            Math.round(props.payment.per_person_total_cost / 100) * 2
          )}
        </StrikedCost>
        <INR
          show_per_person_cost={props.payment.show_per_person_cost}
          coupon={props.payment.coupon}
          className={props.blur ? "font-lexend blurry-text" : "font-lexend"}
        >
          <FontAwesomeIcon
            style={{ marginRight: "0.25rem" }}
            icon={faRupeeSign}
          />
          {getIndianPrice(
            Math.round(Math.round(props.payment.per_person_total_cost) / 100)
          ) + " /-"}
        </INR>
      </div>
      <p className="font-lexend text-center">Per Member</p>
      {props.token ? null : (
        <Button
          borderRadius="5px"
          bgColor="#f7e700"
          width="100%"
          margin="0 0 0.25rem 0"
          hoverBgColor="black"
          hoverColor="white"
          borderWidth="0"
          onclick={props.setShowLoginModal}
          onclickparam={true}
        >
          Login
        </Button>
      )}
      {props.payment &&
      props.token &&
      !(
        props.payment.itinerary_status ===
        ITINERARY_STATUSES.itinerary_finalized
      ) &&
      !props.payment.paid_user ? (
        props.payment.email_reverification_needed ? (
          <Button
            borderRadius="5px"
            bgColor="#f7e700"
            width="100%"
            margin="0 0 0.25rem 0"
            hoverBgColor="black"
            hoverColor="white"
            borderWidth="0"
            onclick={setShowVerification}
            onclickparam={true}
          >
            Pay Now
          </Button>
        ) : (
          <Button
            borderRadius="5px"
            bgColor="#f7e700"
            width="100%"
            margin="0 0 0.25rem 0"
            hoverBgColor="black"
            hoverColor="white"
            borderWidth="0"
            onclick={setShowRegistartion}
            onclickparam={true}
          >
            Pay Now
          </Button>
        )
      ) : null}
      {props.payment ? (
        props.payment.itinerary_status ===
        ITINERARY_STATUSES.itinerary_finalized ? (
          <p
            onClick={() => setShowRegisteredUsers(true)}
            className="hover-pointer font-lexend text-center"
            style={{ fontSize: "0.85rem", textDecoration: "underline" }}
          >
            Registered Members
          </p>
        ) : null
      ) : null}
      {props.payment &&
      props.token &&
      props.payment.itinerary_status ===
        ITINERARY_STATUSES.itinerary_finalized &&
      !props.payment.paid_user ? (
        props.payment.email_reverification_needed ? (
          <Button
            borderRadius="5px"
            bgColor="#f7e700"
            width="100%"
            margin="0 0 0.25rem 0"
            hoverBgColor="black"
            hoverColor="white"
            borderWidth="0"
            onclick={setShowVerification}
            onclickparam={true}
          >
            Pay Now
          </Button>
        ) : props.payment.user_allowed_to_pay ? (
          <Button
            borderRadius="5px"
            bgColor="#f7e700"
            width="100%"
            margin="0 0 0.25rem 0"
            hoverBgColor="black"
            hoverColor="white"
            borderWidth="0"
            onclick={_saleCreateHandler}
            onclickparam={props.id}
            loading={paymentLoading}
          >
            Pay Now
          </Button>
        ) : null
      ) : null}
      {props.payment ? (
        props.payment.paid_user ? (
          <Button
            fontWeight="700"
            borderRadius="5px"
            bgColor="#f7e700"
            width="100%"
            margin="0 0 0.25rem 0"
            hoverBgColor="#f7e700"
            hoverColor="black"
            borderWidth="0"
            onclick={() => console.log("")}
            onclickparam={props.id}
          >
            PAID
          </Button>
        ) : null
      ) : null}

      <Button
        onclick={() =>
          (window.location.href = urls.WHATSAPP + "?text=" + message)
        }
        hoverColor="black"
        hoverBgColor="#128C7E"
        onclickparam={null}
        width="100%"
        bgColor="white"
        borderRadius="5px"
        borderWidth="1px"
        borderColor="#e4e4e4"
        margin="0"
      >
        <FontAwesomeIcon icon={faWhatsapp} style={{ marginRight: "0.5rem" }} />
        Connect on WhatsApp
      </Button>
      <div
        style={{ color: "blue", margin: "1rem 0 0 0", fontSize: "0.85rem" }}
        className=" text-center hover-pointer font-lexend"
        onClick={() => setShowTerms(true)}
      >
        Terms & Conditions
      </div>
      <RegistrationModal
        number_of_adults={
          props.payment
            ? props.payment.meta_info
              ? props.payment.meta_info.number_of_adults
              : 5
            : 5
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
        registered_users={props.payment ? props.payment.registered_users : null}
        show={showRegisteredUsers}
        hide={() => setShowRegisteredUsers(false)}
      ></RegisteredUsersModal>
      <TermsModal
        show={showTerms}
        hide={() => setShowTerms(false)}
      ></TermsModal>
    </SummaryContainer>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderDetails: (details) =>
      dispatch(orderaction.setOrderDetails(details)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
