import styled from "styled-components";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isPast, parseISO } from "date-fns";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import Slide from "../../Animation/framerAnimation/Slide";
import CouponSlide from "./booking1/CouponSlide";
import BookingSlide from "./booking1/BookingSlide";
import NewBookingSlide from "./booking1/NewBookingSlide";

const SummaryContainer = styled.div`
  height: max-content;
  border-radius: 10px;
  padding: ${(props) => (props.couponSlide ? "0" : "1rem")};
  margin: 0rem 0;
  @media screen and (min-width: 768px) {
    margin: 0;
    width: 27vw;
    position: sticky;
    top: 11vh;
  }
`;

const NewSummaryContainer = (props) => {
  const [couponSlide, setCouponSlide] = useState(false);
  const [isDatePast, setIsDatePast] = useState(false);
  const [iscouponApplied, setiscouponApplied] = useState(
    props.payment?.coupon ? true : false,
  );
  const [inputValue, setInputValue] = useState(
    props.payment?.coupon ? props.payment?.coupon?.code : "",
  );
  const [couponLoading, setCouponLoading] = useState(false);
  const [isSucess, setIsSucess] = useState({
    value: false,
    errorMsg: "",
  });
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: "",
  });

  useEffect(() => {
    if (props.plan?.start_date) {
      if (isPast(parseISO(props.plan?.start_date))) {
        setIsDatePast(true);
      } else {
        setIsDatePast(false);
      }
    } else {
      setIsDatePast(true);
    }
  }, [props.plan?.start_date]);

  function handleSubmitRemove(e) {
    RemoveCoupon();
  }

  const RemoveCoupon = () => {
    setCouponLoading(true);
    axios
      .post(
        MIS_SERVER_HOST + "/payment/coupon/apply/",
        {
          itinerary_id: props.id,
          coupon: null,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        setCouponLoading(false);
        setIsSucess({
          value: true,
          Msg: "Coupon Removed Successfully",
        });
        setiscouponApplied(false);
        setInputValue("");

        props.getPaymentHandler();
      })
      .catch((error) => {
        setCouponLoading(false);
        setIsError({
          error: true,
          errorMsg: "Coupon Removed Failed",
        });
      });
  };

  function handleSubmit(e) {
    if (props.token) {
      if (inputValue !== "") {
        getCouponHandler(inputValue);
      } else {
        setIsError({
          error: true,
          errorMsg: "Please Enter Something",
        });
      }
    } else {
      props.setShowLoginModal(true);
    }
  }

  const getCouponHandler = (coupon) => {
    setCouponLoading(true);
    axios
      .post(
        MIS_SERVER_HOST + "/payment/coupon/apply/",
        {
          itinerary_id: props.id,
          coupon: coupon,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then((res) => {
        setCouponLoading(false);

        setIsSucess({
          value: true,
          Msg: res.data.coupon_usage.message,
        });
        setiscouponApplied(true);

        setIsError({
          error: false,
          errorMsg: "",
        });

        props.getPaymentHandler();
      })
      .catch((error) => {
        setCouponLoading(false);
        setiscouponApplied(false);

        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          setIsError({
            error: true,
            errorMsg: errorMessage,
          });
        } else {
          setIsError({
            error: true,
            errorMsg: "Invalid Coupon Or Coupon Expired",
          });
        }
        setInputValue("");
      });
  };

  const couponJSX = (
    <div>
      {props?.payment?.allow_coupon_discount &&
      !isDatePast &&
      !props?.payment?.paid_user ? (
        <div>
          <div className="relative  rounded-md cursor-pointer mt-3">
            <input
              class=" px-3 w-full py-2  border-2 border-[#ECEAEA] rounded-md focus:outline-none focus:border-yellow-400"
              type="text"
              readOnly={iscouponApplied}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              id="name"
              name="name"
              placeholder="Have a coupon code?"
            />
            <div className="absolute left-[15px] -bottom-[18px]">
              {isError.error && (
                <Slide
                  hideTime={2}
                  onUnmount={() =>
                    setIsError({
                      error: false,
                      errorMsg: "",
                    })
                  }
                  isActive={isError.error}
                  direction={-1}
                  duration={0.2}
                  ydistance={20}
                >
                  <div className="text-red-500 text-center font-normal text-sm ">
                    {isError.errorMsg}
                  </div>
                </Slide>
              )}
              {isSucess.value && (
                <Slide
                  hideTime={2}
                  onUnmount={() =>
                    setIsSucess({
                      value: false,
                      Msg: "",
                    })
                  }
                  isActive={isSucess.value}
                  direction={-1}
                  duration={0.1}
                  ydistance={12}
                >
                  <div className="text-green-500 text-center font-normal text-sm ">
                    {isSucess.Msg}
                  </div>
                </Slide>
              )}
            </div>

            {iscouponApplied ? (
              <button
                className=" absolute  inset-y-0 right-1 top-0 flex items-center pr-3  "
                type="submit"
                onClick={(e) => handleSubmitRemove(e)}
              >
                <div
                  className=" font-bold text-black cursor-pointer"
                  aria-hidden="true"
                >
                  {!couponLoading ? (
                    "Remove"
                  ) : (
                    <PulseLoader size={5} speedMultiplier={0.6} color="black" />
                  )}
                </div>
              </button>
            ) : (
              <button
                className=" absolute inset-y-0 right-1 top-0 flex items-center pr-3  "
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
                <div
                  className=" font-semibold text-black cursor-pointer"
                  aria-hidden="true"
                >
                  {!couponLoading ? (
                    "Apply"
                  ) : (
                    <PulseLoader size={5} speedMultiplier={0.6} color="black" />
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );

  console.log("Iti1",props?.itinerary)
  return (
    <SummaryContainer
      className="font-lexend ml-4 flex flex-col rounded-xl shadow-md  border-2 border-[#ECEAEA] shadow-[#ECEAEA] mt-5"
      style={{ marginBottom: props.traveleritinerary ? "12.5vh" : "0" }}
      couponSlide={couponSlide}
    >
      {couponSlide ? (
        <CouponSlide
          itinerary_id={props.itinerary_id}
          closeCouponSlide={() => setCouponSlide(false)}
          setInputValue={setInputValue}
          couponJSX={couponJSX}
          payment={props.payment}
          submitCoupon={getCouponHandler}
        ></CouponSlide>
      ) : (
        <NewBookingSlide
          {...props}
          loadpricing={props?.loadpricing}
          itinerary={props?.itinerary}
          openCouponSlide={() => setCouponSlide(true)}
          setiscouponApplied={setiscouponApplied}
          iscouponApplied={iscouponApplied}
          couponJSX={couponJSX}
          paymentInfo={props?.payment}
          mercuryItinerary={props?.mercuryItinerary}
          itineraryDate={props?.itineraryDate}
        />
      )}
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
    itinerary_id: state.ItineraryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderDetails: (details) =>
      dispatch(orderaction.setOrderDetails(details)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSummaryContainer);
