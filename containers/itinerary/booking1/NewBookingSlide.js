import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { RiArrowDropDownLine, RiWhatsappFill } from "react-icons/ri";
import Button from "../../../components/ui/button/Index";
import { connect, useDispatch, useSelector } from "react-redux";
import * as orderaction from "../../../store/actions/order";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { getHumanDateWithYear } from "../../../services/getHumanDateWithYear";
import urls from "../../../services/urls";
import { ITINERARY_STATUSES } from "../../../services/constants";
import axiossalecreateinstance, {
  myplansv2,
} from "../../../services/sales/itinerary/SaleCreate";
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
import {
  axiosGetItineraryStatus,
  axiosUpdateItineraryDates,
} from "../../../services/itinerary/daybyday/preview";
import UpdateItineraryDates from "./UpdateItineraryDates";
import {
  applyCoupon,
  fetchCoupons,
  paymentInitiate,
  removeCoupon,
  repriceBookings,
} from "../../../services/sales/itinerary/Purchase";
import { LuClock4 } from "react-icons/lu";
import { openNotification } from "../../../store/actions/notification";
import setCart from "../../../store/actions/Cart";
import ReactDOM from "react-dom";
import setItinerary from "../../../store/actions/itinerary";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { updateCartPricing } from "../../../services/sales/Bookings";
import { useChatContext } from "../../../components/Chatbot/context/ChatContext";
import { currencySymbols } from "../../../data/currencySymbols";

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const CouponModal = ({
  show,
  onHide,
  onApplyCoupon,
  appliedCoupon,
  setAppliedCoupon,
  token,
  payment,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applyingCouponId, setApplyingCouponId] = useState(null);
  const ItineraryId = useSelector((state) => state.ItineraryId);
  const currency = useSelector(state=>state.currency);

  const Cart = useSelector((state) => state.Cart);

  useEffect(() => {
    if (show) {
      setAvailableCoupons([]);
      fetchAvailableCoupons();
    }
  }, [show]);

  // Auto-apply coupon from payment props if available
  useEffect(() => {
    if (
      payment?.coupon_usage &&
      payment.coupon_usage.status === "COUPON_APPLIED"
    ) {
      if (!appliedCoupon) {
        setAppliedCoupon(payment.coupon_usage.id);
      }
    }
  }, [payment, appliedCoupon, setAppliedCoupon]);

  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetchCoupons.get(`/?currency=${currency?.currency || 'INR'}&itinerary_id=${ItineraryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedCoupons = response.data.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        title: `Save ${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${coupon.discount_value}`,
        description: coupon.description,
        expiry: new Date(coupon.end_time).toLocaleDateString("en-IN"),
        type: coupon.discount_type.toLowerCase(),
        discount: coupon.discount_value,
        is_applicable: coupon.is_applicable,
        message: coupon.message,
        usage_description: coupon.usage_description,
        applicability_error: coupon.applicability_error,
      }));

      setAvailableCoupons(formattedCoupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async (coupon) => {
    setApplyingCouponId(coupon.id);
    try {
      await onApplyCoupon(coupon.id, coupon.code);
      // Only hide modal after successful application
      onHide();
    } catch (error) {
      console.error("Error applying coupon:", error);
    } finally {
      setApplyingCouponId(null);
    }
  };

  // Skeleton loader component
  const CouponSkeleton = () => (
    <div className="border-b-2 border-gray-200 rounded-lg p-2 animate-pulse">
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-2 bg-gray-200 rounded w-32"></div>
    </div>
  );

  // Pulse loader for button
  const PulseLoader = () => (
    <div className="flex items-center justify-center">
      <div className="w-4 h-4 bg-current rounded-full animate-pulse"></div>
    </div>
  );

  if (!show) return null;

  return ReactDOM.createPortal(
    <Drawer
      show={true}
      anchor={"right"}
      backdrop
      width={"30%"}
      mobileWidth={"50%"}
      style={{ zIndex: 1601 }}
      onHide={() => onHide()}
    >

      <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
        <h2 className="text-lg font-semibold">Apply Coupons</h2>
        <button
          onClick={onHide}
          className=""
        >
          <IoMdClose />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        <div>
          <h3 className="font-semibold text-base mb-4">Available Coupons</h3>

          <div className="space-y-4">
            {loading ? (
              // Show skeleton loaders while loading
              <>
                <CouponSkeleton />
                <CouponSkeleton />
                <CouponSkeleton />
              </>
            ) : availableCoupons?.length > 0 ? (
              availableCoupons.map((coupon, index) => (
                <div
                  key={index}
                  className="border-b-1 border-gray-200 p-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-3 ">
                    <div className="flex-1">
                      <div className="text-base inline-block border-sm border-dashed border-pureBlack py-xxs px-lg mb-md">
                        {coupon.code}
                      </div>
                      <div className="text-md  font-500 leading-lg mb-2">
                        {coupon.title}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(coupon)}
                      disabled={
                        appliedCoupon === coupon.code ||
                        appliedCoupon === coupon.id ||
                        applyingCouponId === coupon.id ||
                        (payment?.coupon_usage &&
                          payment.coupon_usage.id === coupon.id) ||
                        payment?.is_applicable
                      }
                      className={`px-3 py-1 rounded font-medium text-sm transition-colors whitespace-nowrap min-w-[60px] h-8 flex items-center justify-center ${appliedCoupon === coupon.code ||
                        appliedCoupon === coupon.id ||
                        (payment?.coupon_usage &&
                          payment.coupon_usage.id === coupon.id)
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : applyingCouponId === coupon.id
                          ? "bg-blue-400  cursor-not-allowed"
                          : "bg-blue-500  hover:bg-blue-600"
                        }`}
                    >
                      {applyingCouponId === coupon.id ? (
                        <PulseLoader />
                      ) : appliedCoupon === coupon.code ||
                        appliedCoupon === coupon.id ||
                        (payment?.coupon_usage &&
                          payment.coupon_usage.id === coupon.id) ? (
                        "Applied"
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {coupon?.is_applicable ? (
                    <div>
                      <div className="text-gray-600 text-sm mb-2">
                        {coupon.description}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Expires on: {coupon.expiry}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm mb-2">
                      {coupon?.applicability_error}
                    </div>
                  )}
                </div>
              ))
            ) : (
              "No coupons available at the moment."
            )}
          </div>
        </div>
      </div>
    </Drawer>,
    document.body
  );
};

const LivePriceTimer = ({ priceValidUntil, lockInAmount = 2000 }) => {
  const targetTime = priceValidUntil
    ? new Date(priceValidUntil.replace(" ", "T")).getTime()
    : null;
  const { itinerary_status, transfers_status, pricing_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const currency = useSelector(state=>state.currency);
  const Itinerary = useSelector((state) => state.Itinerary);

  const isItineraryInFuture = () => {
    const startDate = new Date(Itinerary.start_date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return startDate >= currentDate;
  };

  const Cart = useSelector((state) => state.Cart);

  const calculateTimeLeft = () => {
    if (!targetTime) return 0;
    return Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  const [isInitialized, setIsInitialized] = useState(false);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    setIsInitialized(true);

    if (!targetTime) return;

    setTimeLeft(calculateTimeLeft());

    if (targetTime <= Date.now()) return;

    let animationFrameId;
    let intervalId;

    const updateTime = () => {
      const now = Date.now();

      if (now - lastUpdateRef.current > 2000) {
        setTimeLeft(calculateTimeLeft());
      }

      lastUpdateRef.current = now;
      animationFrameId = requestAnimationFrame(updateTime);
    };

    updateTime();

    intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [targetTime]);

  if (!isInitialized) return null;

  if (!isItineraryInFuture()) {
    return (
      <div className="bg-red-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-medium mb-3 inline-block">
        Itinerary dates have expired. Please update the dates to view updated
        prices.
      </div>
    );
  }

  // if (!Cart?.lock_in_fee_paid && (!targetTime || timeLeft <= 0)) {
  //   return (
  //     <div className="bg-red-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-medium mb-3 inline-block">
  //       Prices Expired! -Lock this trip with ₹{lockInAmount?.toLocaleString('en-IN')} to refresh prices
  //     </div>
  //   );
  // }

  if (!targetTime || timeLeft <= 0) {
    return (
      <div className="bg-red-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-medium mb-3 inline-block">
        Prices Expired! Refresh Prices to check updated itinerary cost
      </div>
    );
  }

  // Format time left into hours, minutes, and seconds (always show seconds)
  const formatTimeLeft = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return { hours, minutes, remainingSeconds };
  };

  const { hours, minutes, remainingSeconds } = formatTimeLeft(timeLeft);

  return (
    <div
      className={`${Cart?.paid_user ? "bg-[#98F0AB33]" : "bg-[#F7E70033]"
        } border-sm border-primary-yellow p-sm rounded-sm text-xs font-medium w-100`}
    >
      <div className="flex items-center gap-2xl">
        <div className="flex flex-col items-center">
          <span className="text-md-lg font-600 leading-xl">{hours}</span>
          <span className="text-xs tex-spacegrey font-400">Hours</span>
        </div>

        <span className="text-md-lg font-600 leading-xl">:</span>

        <div className="flex flex-col items-center">
          <span className="text-md-lg font-600 leading-xl">{minutes}</span>
          <span className="text-xs tex-spacegrey font-400">Mins</span>
        </div>

        <span className="text-md-lg font-600 leading-xl">:</span>

        <div className="flex flex-col items-center">
          <span className="text-md-lg font-600 leading-xl">{remainingSeconds}</span>
          <span className="text-xs tex-spacegrey font-400">Secs</span>
        </div>
      </div>
    </div>
  );
};
const PaymentSuccess = ({ amount, onDownloadInvoice, loading }) => {
  const currency = useSelector(state=>state.currency);
  return (
    <div className="bg-white rounded-lg">
      <div className="mb-2">
        <div className="mb-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px" viewBox="0 0 24 24" fill="none">
            <circle opacity="1" cx="12" cy="12" r="10" fill="#FFD201" />
            <path d="M7.37756 11.6296H6.62756H7.37756ZM7.37756 12.5556L6.81609 13.0528C6.95137 13.2056 7.14306 13.2966 7.34695 13.3049C7.55084 13.3133 7.74932 13.2382 7.89662 13.0969L7.37756 12.5556ZM9.51905 11.5414C9.81805 11.2547 9.82804 10.7799 9.54137 10.4809C9.2547 10.182 8.77994 10.172 8.48095 10.4586L9.51905 11.5414ZM6.56148 10.5028C6.28686 10.1927 5.81286 10.1639 5.50277 10.4385C5.19267 10.7131 5.16391 11.1871 5.43852 11.4972L6.56148 10.5028ZM14.9317 9.0093C15.213 9.31337 15.6875 9.33184 15.9915 9.05055C16.2956 8.76927 16.3141 8.29476 16.0328 7.9907L14.9317 9.0093ZM12.0437 6.25C9.05802 6.25 6.62756 8.653 6.62756 11.6296H8.12756C8.12756 9.49251 9.87531 7.75 12.0437 7.75V6.25ZM6.62756 11.6296L6.62756 12.5556H8.12756L8.12756 11.6296H6.62756ZM7.89662 13.0969L9.51905 11.5414L8.48095 10.4586L6.85851 12.0142L7.89662 13.0969ZM7.93904 12.0583L6.56148 10.5028L5.43852 11.4972L6.81609 13.0528L7.93904 12.0583ZM16.0328 7.9907C15.0431 6.9209 13.6212 6.25 12.0437 6.25V7.75C13.1879 7.75 14.2154 8.23504 14.9317 9.0093L16.0328 7.9907Z" fill="#fff" />
            <path d="M16.6188 11.4443L17.1795 10.9462C17.044 10.7937 16.8523 10.703 16.6485 10.6949C16.4447 10.6868 16.2464 10.7621 16.0993 10.9034L16.6188 11.4443ZM14.4805 12.4581C14.1817 12.745 14.1722 13.2198 14.4591 13.5185C14.746 13.8173 15.2208 13.8269 15.5195 13.54L14.4805 12.4581ZM17.4393 13.4972C17.7144 13.8068 18.1885 13.8348 18.4981 13.5597C18.8078 13.2846 18.8358 12.8106 18.5607 12.5009L17.4393 13.4972ZM9.04688 15.0047C8.76342 14.7027 8.28879 14.6876 7.98675 14.9711C7.68472 15.2545 7.66966 15.7292 7.95312 16.0312L9.04688 15.0047ZM11.9348 17.7499C14.9276 17.7499 17.3688 15.3496 17.3688 12.3703H15.8688C15.8688 14.5047 14.1158 16.2499 11.9348 16.2499V17.7499ZM17.3688 12.3703V11.4443H15.8688V12.3703H17.3688ZM16.0993 10.9034L14.4805 12.4581L15.5195 13.54L17.1383 11.9853L16.0993 10.9034ZM16.0581 11.9425L17.4393 13.4972L18.5607 12.5009L17.1795 10.9462L16.0581 11.9425ZM7.95312 16.0312C8.94543 17.0885 10.3635 17.7499 11.9348 17.7499V16.2499C10.792 16.2499 9.76546 15.7704 9.04688 15.0047L7.95312 16.0312Z" fill="#fff" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-600">
          Your full payment of {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{amount?.toLocaleString("en-IN")} has been
          received. No pending balance.
        </p>
      </div>

      <GetInTouchContainer>
        <Button
          color="#111"
          fontWeight="500"
          fontSize="1rem"
          borderWidth="1px"
          width="100%"
          borderRadius="8px"
          bgColor="#f8e000"
          padding="12px"
          onclick={onDownloadInvoice}
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
            {loading ? <PulseLoader /> : <span>Get in touch!</span>}
          </div>
        </Button>
      </GetInTouchContainer>
    </div>
  );
};

const PaymentFailed = ({ onClickButton, loading }) => {
  return (
    <div className="bg-white rounded-lg">
      <div className="mb-2">
        <div className="mb-lg">
          <img src="/assets/icons/payment-failed.png" width="72px" alt="" />
        </div>
        <div className="flex justify-between max-ph:flex-col">
          <div>
            <h2 className="text-lg font-600 leading-xl">Your last payment was failed.</h2>
            <p className="text-md font-400 leading-xl text-text-spacegrey mb-zero max-ph:mb-md">
              Oops! Something went wrong. Tap “Retry” to give it another shot.
            </p>
          </div>
          <GetInTouchContainer>
            <Button
              color="#fff"
              fontWeight="500"
              fontSize="16px"
              borderWidth="1px"
              borderRadius="6px"
              bgColor="#07213A"
              padding="6px 30px"
              onclick={onClickButton}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                {loading ? <PulseLoader /> : <span>Retry</span>}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-base mb-1">
                  {paymentCompleted
                    ? "Pay remaining amount now"
                    : "Pay full amount now to get discounts"}
                </div>
                <div className="text-xl font-semibold">
                  {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{getIndianPrice(Math.round(Math.round(totalPayable)))}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Get instant booking confirmation
              </div>
              {/* <div className="text-xl font-semibold">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CouponSection = ({
  appliedCoupon,
  savedAmount,
  onRemoveCoupon,
  onApplyCoupon,
  onViewCoupons,
  isRemoving = false,
  payment,
}) => {
  const currency = useSelector(state=>state.currency);
  // Pulse loader component
  const PulseLoader = () => (
    <div className="flex items-center justify-center">
      <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
    </div>
  );

  // Get coupon data from payment props if available
  const getCouponDisplayData = () => {
    if (payment) {
      return {
        code: appliedCoupon || `Coupon Applied`,
        savings: payment.discount,
        message: payment.message,
        usage_description: payment?.usage_description,
        applicability_error: payment?.applicability_error,
        is_applicable: payment?.is_applicable,
      };
    }
    return {
      code: appliedCoupon,
      savings: savedAmount,
    };
  };

  const couponData = getCouponDisplayData();
  const hasCouponApplied = appliedCoupon;
  // console.log("Coupon", couponData)
  return (
    <div className="mb-4">
      {/* <h3 className="font-medium text-base mb-3">Coupons</h3> */}

      {hasCouponApplied ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          {/* Show message from payment if available */}

          {couponData.usage_description && (
            <div className=" text-green-600 mb-2 font-medium">
              {couponData.usage_description}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-green-600">
                {couponData?.message}
              </div>
              {/* <div className="text-sm text-green-600">saved ₹{couponData.savings}</div> */}
            </div>
            <button
              className={`text-sm font-medium transition-colors min-w-[60px] h-8 flex items-center justify-center rounded px-2 ${isRemoving
                ? "text-red-400 cursor-not-allowed"
                : "text-red-500 hover:text-red-600"
                }`}
              onClick={() => onRemoveCoupon(couponData?.code || appliedCoupon)}
              disabled={isRemoving}
            >
              {isRemoving ? <PulseLoader /> : "Remove"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="w-full py-md border-y-sm text-left flex items-center justify-between"
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-500 leading-lg">Apply coupon</span>
              </div>
              <button onClick={onViewCoupons} className="border-sm border-primary-indigo text-primary-indigo text-xs font-500 leading-md rounded-md-lg px-md"> Apply</button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Note: Coupons and discounts are not applicable on the itinerary
            lock-in fee.
          </p>
        </div>
      )}
    </div>
  );
};

// 4. Price Details Component (Add after coupon section)
const PriceDetails = ({
  itineraryCost,
  lockInCost,
  couponDiscount,
  totalPayable,
  surchargesTaxes,
  selectedPaymentOption,
}) => {
  const Cart = useSelector((state) => state.Cart);
  const currency = useSelector(state=>state.currency);

  const numericItineraryCost =
    typeof itineraryCost === "string"
      ? parseFloat(itineraryCost.replace(/,/g, ""))
      : itineraryCost;
  const numericTotalPayable =
    typeof totalPayable === "string"
      ? parseFloat(totalPayable.replace(/,/g, ""))
      : totalPayable;

  // if (numericTotalPayable === 0) {
  //   return (
  //     <div className="mb-4">
  //       <div className="text-center p-4 bg-gray-50 rounded-lg">
  //         <p className="text-sm text-gray-600">
  //           No inclusions selected. Please select items to see pricing.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  const finalTotal =
    (typeof itineraryCost === "string"
      ? parseFloat(itineraryCost.replace(/,/g, "")) || 0
      : itineraryCost || 0) -
    Math.abs(couponDiscount || 0);

  return (
    <div className="mb-4">
      <h3 className={`leading-md inline-block pb-xxs mb-md ${numericTotalPayable === 0 ? 'text-md font-500' : 'text-sm border-b-sm border-primary-yellow font-400'}`}> {numericTotalPayable === 0 ? 'Payment Summary' : 'PRICE DETAILS'} </h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-400 leading-md mb-sm">
          <span> Total Itinerary Cost </span>
          <span>
            {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}
            {typeof itineraryCost === "string"
              ? itineraryCost
              : itineraryCost.toLocaleString("en-IN")}
          </span>
        </div>

        {/* {
          surchargesTaxes > 0 && (
            <div className="flex justify-between text-sm font-400 leading-md mb-sm">
              <span>Surcharges and Taxes</span>
              <span>₹{surchargesTaxes.toLocaleString("en-IN")}</span>
            </div>
          )
        } */}

        {
        couponDiscount >=0 ? (
          <div className="flex justify-between text-green-600 text-sm font-400 leading-md mb-sm">
            <span>Coupon Discount</span>
            <span>
              {couponDiscount
                ? `-${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` + Math.abs(couponDiscount).toLocaleString("en-IN")
                : `${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}0`}
            </span>
          </div>
        ) : null}

        <div className="border-t-sm border-text-disabled pt-2 mt-2">
          <div className="flex justify-between font-semibold text-md font-500 leading-xl">
            <span>Total Amount</span>
            <span>
              {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}
              {typeof totalPayable === "string"
                ? totalPayable
                : totalPayable.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Main Payment Button
const PaymentButton = ({
  amount,
  isLoading = false,
  onClick,
  paymentType = "full",
}) => {
  const currency = useSelector(state=>state.currency);
  return (
    <button
      className="ttw-btn-secondary-fill w-full"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-text-white mr-2"></div>
          Processing...
        </div>
      ) : paymentType === "lockin" ? (
        `Pay ${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${getIndianPrice(Math.round(Math.round(amount)))} Now`
      ) : (
        `Pay ${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${getIndianPrice(Math.round(Math.round(amount)))} Now`
      )}
    </Button>
  );
};

const ItineraryInclusions = ({
  Cart,
  selectedInclusions,
  onToggleInclusion,
  arePricesHidden,
  updatingInclusions = {},
  defaultExpanded = false,
  disableOnExpiry=false
}) => {
  const [expandedCategories, setExpandedCategories] = useState({
    Hotels: true,
    Transfers: true,
    Flights: true,
    Activities: true,
  });
  const currency = useSelector(state=>state.currency);

  const categorizeBookings = () => {
    const categories = {
      Hotels: [],
      Transfers: [],
      Flights: [],
      Activities: [],
    };

    if (Cart?.summary) {
      Object.entries(Cart.summary).forEach(([category, data]) => {
        if (data.bookings && data.bookings.length > 0) {
          categories[category] = data.bookings.map((booking) => ({
            id: booking.id,
            booking_cost: booking.booking_cost,
            detail: {
              name: booking.name,
              check_in: booking.check_in,
              check_out: booking.check_out,
              duration: booking.duration,
              pax: booking.pax,
              transfer_type: booking.transfer_type,
            },
            status: booking.status,
            booking_type:
              category === "Hotels"
                ? "Accommodation"
                : category === "Flights"
                  ? "Flight"
                  : category === "Transfers"
                    ? "Transfer"
                    : "Activity",
          }));
        }
      });
    }

    return categories;
  };

  const categories = categorizeBookings();

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const updateCartBooking = async () => {
    try {
      setBookingLoading(true);
      const response = await updateCartPricing.get(`/${ItineraryId}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, "MMM dd");
  };

  const colors = ["#FD6D6C", "#F7E700", "#AD5BE7", "#5BD5E7", "#2AB0FC"]

  const getCategoryIcon = (category) => {
    const icons = {
      Hotels: "🏨",
      Flights: "✈️",
      Transfers: "🚂",
      Activities: "🎯",
    };
    return icons[category] || "📍";
  };


  return (
    <div className="mb-4">
      {/* <h3 className="font-medium text-base mb-3">Itinerary Inclusions</h3> */}

      {Object.entries(categories).map(([category, bookings], index) => {
        if (bookings.length === 0) return null;

        const categoryTotal = bookings.reduce(
          (sum, booking) =>
            selectedInclusions[booking.id] ? sum + booking.booking_cost : sum,
          0
        );
        const selectedCount = bookings.filter(
          (b) => selectedInclusions[b.id]
        ).length;

        return (
          <div
            key={category}
            className="mb-3 rounded-lg overflow-hidden shadow-[0_4px_34px_1px_rgba(195,195,195,0.25)]"
          >
            {/* Category Header */}
            <div
              className={`flex items-center justify-between p-3 bg-gray-50 cursor-pointer bg-text-white transition-colors ${!expandedCategories[category] ? 'border-l-xl' : ''} `} style={{ borderColor: colors[index] }}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center gap-2 flex-1 ">
                {/* <span className="text-lg">{getCategoryIcon(category)}</span> */}
                <div className={`flex-1 ${expandedCategories[category] ? 'border-l-xl' : ''}  ml-[-16px] pl-md`} style={{ borderColor: colors[index] }}>
                  <div className="text-md leading-xl font-500">{category}</div>
                  <div className="text-sm font-400 leading-md text-text-spacegrey">
                    {selectedCount} of {bookings.length} selected
                  </div>
                </div>
              </div>

              {categoryTotal > 0 && !arePricesHidden && (
                <div className="font-semibold text-sm mr-2">
                  {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{getIndianPrice(Math.round(categoryTotal))}
                </div>

              </>
              )}



              <RiArrowDropDownLine
                className={`text-2xl transition-transform ${expandedCategories[category] ? "rotate-180" : ""
                  }`}
              />
            </div>

            {/* Category Items */}
            {expandedCategories[category] && (
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                      !selectedInclusions[booking.id] ? "opacity-50" : ""
                    }`}
                  >
                    
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      {updatingInclusions[booking.id] ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedInclusions[booking.id]}
                          onChange={() => onToggleInclusion(booking.id)}
                          disabled={disableOnExpiry || booking.status === "Paid"}
                          className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-md font-500 leading-xl mb-sm">
                        {booking.detail.name}
                      </div>
                      {booking.status === "Paid" && (
                        <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded mb-1">
                          PAID
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          {/* <BsCalendar2 className="flex-shrink-0" /> */}
                          <span className="text-sm font-400 leading-md text-text-spacegrey">{formatDate(booking.detail.check_in)}</span>
                        </div>
                        {booking.detail.duration && (
                          <span className="ml-1">
                            ({booking.detail.duration}N)
                          </span>
                        )}

                        {booking.detail.pax && (<>
                          <div className="border-r-sm border-text-spacegrey h-[12px]"></div>
                          <div className="flex items-center gap-1 ">
                            {/* <span>•</span> */}
                            {/* <BsPeopleFill className="flex-shrink-0" /> */}
                            <span className="text-sm font-400 leading-md text-text-spacegrey">
                              {(booking.detail.pax.number_of_adults +
                                (booking.detail?.pax?.number_of_children || 0) +
                                (booking.detail?.pax?.number_of_infants ||
                                  0)) > 1 ? (booking.detail.pax.number_of_adults +
                                (booking.detail?.pax?.number_of_children || 0) +
                                (booking.detail?.pax?.number_of_infants ||
                                  0)) + " Travelers" : (booking.detail.pax.number_of_adults +
                                (booking.detail?.pax?.number_of_children || 0) +
                                (booking.detail?.pax?.number_of_infants ||
                                  0)) + " Traveler" }{" "}
                              
                            </span>
                          </div>
                        </>
                        )}

                        {/* Show individual booking cost */}
                        {
                          !arePricesHidden &&
                          booking.booking_cost > 0 && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <span>•</span>
                              <span>
                                {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}
                                {getIndianPrice(
                                  Math.round(booking.booking_cost)
                                )}
                              </span>
                            </div>
                          )
                        }
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="pt-0.5">
                      {updatingInclusions[booking.id] ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                        </div>
                      ) : (
                        <span className="relative mr-xl">
                          <label
                            className="cursor-pointer ttw-custom-greenCheckbox-label" >
                            <input
                              type="checkbox"
                              checked={selectedInclusions[booking.id]}
                              onChange={() => onToggleInclusion(booking.id)}
                              disabled={booking.status === "Paid"}
                              className=" accent-primary-yellow cursor-pointer ttw-custom-greenCheckbox"
                            />
                          </label>
                        </span>
                        // <input
                        //   type="checkbox"
                        //   checked={selectedInclusions[booking.id]}
                        //   onChange={() => onToggleInclusion(booking.id)}
                        //   disabled={booking.status === "Paid"}
                        //   className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        // />
                      )}
                    </div>

                    {/* Price - Desktop only */}
                    {!arePricesHidden && booking.booking_cost > 0 && (
                      <div className="hidden md:block font-semibold text-sm whitespace-nowrap">
                        {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}{getIndianPrice(Math.round(booking.booking_cost))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="text-xs text-gray-500 mt-2 px-1">
        Note: Unselect items you don't want to include in your booking
      </div>
    </div>
  );
};

const Details = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const dispatch = useDispatch();
  const [isDirectlyOpenPaymentDrawer, setIsDirectlyOpenPaymentDrawer] =
    useState(props?.openPaymentDrawer || false);
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
  const { itinerary_status, transfers_status, pricing_status, final_status } =
    useSelector((state) => state.ItineraryStatus);
  const Itinerary = useSelector((state) => state.Itinerary);
  const Cart = useSelector((state) => state.Cart);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("full");

  const [selectedOption, setSelectedOption] = useState("full");
  const [showExpandedPayment, setShowExpandedPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lockInCompleted, setLockInCompleted] = useState(false);
  const [paymentStep, setPaymentStep] = useState("initial"); // 'initial', 'options', 'detailed'
  const [showDetailedPayment, setShowDetailedPayment] = useState(false);

  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [repriceLoading, setRepriceLoading] = useState(false);

  // Add these new state variables after your existing useState declarations
  const [appliedCoupon, setAppliedCoupon] = useState(
    Cart?.coupon_usage ? Cart?.coupon?.code : null
  );
  const [couponSavedAmount, setCouponSavedAmount] = useState(
    Cart?.coupon_usage?.discount || 0
  );
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);
  const [couponUsageData, setCouponUsageData] = useState(
    Cart?.coupon_usage || null
  );
  const [sessionPaymentCompleted, setSessionPaymentCompleted] = useState(false);
  const passengersDetail = useSelector((state) => state.Passengers);
  const [selectedInclusions, setSelectedInclusions] = useState({});
  const [inclusionsExpanded, setInclusionsExpanded] = useState(
    Cart?.sales?.some((sale) => sale.status === "Completed") &&
    Cart?.total_payable_amount !== 0
  );
  const [updatingInclusions, setUpdatingInclusions] = useState({});
  const {resetSession} = useChatContext();
  const currency = useSelector(state=>state.currency);

  const { trackWhatsAppClicked,trackPaymentSelected,trackPaymentDeselected,trackPaymentAttempted, trackPaymentBookingConfirmed} = useAnalytics();

  useEffect(() => {
    if (props?.openPaymentDrawer && isDirectlyOpenPaymentDrawer) {
      handleProceedToPayment();
    }
  }, [props?.openPaymentDrawer]);

  useEffect(() => {
    if (Cart?.summary) {
      const initialSelections = {};
      Object.values(Cart.summary).forEach((category) => {
        if (category.bookings) {
          category.bookings.forEach((booking) => {
            initialSelections[booking.id] = booking.selected ?? true;
          });
        }
      });
      setSelectedInclusions(initialSelections);
    }
  }, [Cart?.summary]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    // console.log("loading is:", props.loadpricing);
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

  const handleToggleInclusion = async (bookingId) => {
    setUpdatingInclusions((prev) => ({ ...prev, [bookingId]: true }));

    try {
      const newSelections = {
        ...selectedInclusions,
        [bookingId]: !selectedInclusions[bookingId],
      };
      setSelectedInclusions(newSelections);

      let bookingType = "";
      let clickedBooking = null;

      if (Cart?.summary) {
        Object.entries(Cart.summary).forEach(([category, data]) => {
          if (data.bookings && data.bookings.length > 0) {
            const found = data.bookings.find(
              (booking) => booking.id === bookingId
            );
            if (found) {
              clickedBooking = found;
              bookingType =
                category === "Hotels"
                  ? "accommodation"
                  : category === "Flights"
                    ? "flight"
                    : category === "Transfers"
                      ? "transfer"
                      : "activity";
            }
          }
        });
      }

      const payload = [
        {
          booking_type: bookingType.toLowerCase(),
          booking_id: bookingId,
          selected: newSelections[bookingId],
        },
      ];

      const response = await updateCartPricing.patch(
        `/${router.query.id}/cart/`,
        payload,
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response.data) {
        dispatch(setCart(response.data));


        dispatch(
          openNotification({
            text: "Cart updated successfully",
            heading: "Success",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);

      // Revert the selection on error
      setSelectedInclusions((prev) => ({
        ...prev,
        [bookingId]: !prev[bookingId],
      }));

      dispatch(
        openNotification({
          text: error?.response?.data?.message || "Failed to update cart",
          heading: "Error!",
          type: "error",
        })
      );
    } finally {
      setUpdatingInclusions((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const calculateFilteredTotal = () => {
    if (!Cart) return 0;

    let total = Cart?.total_payable_amount || 0;

    // If total is 0, return 0 early
    if (total === 0) return 0;

    // Apply coupon if applicable
    // if (couponUsageData?.discount) {
    //   total = Math.max(0, total - couponUsageData.discount);
    // }

    return Math.round(total);
  };

  const handleCloseDrawer = () => {
    console.log("handle paymenmt close");
    if (isDirectlyOpenPaymentDrawer) {
      setIsDirectlyOpenPaymentDrawer(false);
      props.setShowFooterBannerMobile();
    }
    setShowPaymentDrawer(false);
    setShowDetailedPayment(false);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
      },
      undefined,
      { scroll: false }
    );
  };

  const scrollToElement = (elementId) => {
    scroller.scrollTo(elementId, {
      duration: 500,
      smooth: "easeInOutQuart",
      spy: true,
      offset: -150,
    });
  };

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

  const handleRepriceBookings = async () => {
    setRepriceLoading(true);
    try {
      const response = await repriceBookings.get(
        `${router.query.id}/reprice/bookings`,
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response.data) {
        setItinerary(response.data);
        fetchItineraryStatus();
        dispatch(
          openNotification({
            text:
              response.data.coupon_usage?.message ||
              "Itinerary repriced successfully",
            heading: "Success",
            type: "success",
          })
        );
        // Refresh payment data
        if (props?.fetchData)
          await props.fetchData(true);

        if (resetSession) {
          await resetSession();
        }
      }
    } catch (error) {
      console.error("Error Repricing :", error);
      dispatch(
        openNotification({
          text:
            error?.response?.data?.message ||
            error.message ||
            "Failed to reprice itinerary",
          heading: "Error!",
          type: "error",
        })
      );
    } finally {
      setRepriceLoading(false);
    }
  };

  const handleApplyCoupon = async (couponId, couponCode) => {
    try {
      const response = await applyCoupon.post(
        "/",
        {
          payment_information_id: Cart?.id,
          coupon_id: couponId,
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response.data.coupon_usage) {
        setAppliedCoupon(couponCode);
        setCouponUsageData(response.data.coupon_usage);
        setCouponSavedAmount(response.data.coupon_usage.discount);
        dispatch(setCart(response.data));
        // Show success message
        // alert(response.data.coupon_usage.message);
        dispatch(
          openNotification({
            text: response.data.coupon_usage.message || "Coupon applied",
            heading: "Success",
            type: "success",
          })
        );
        // Refresh payment data
        props.fetchData(true);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      dispatch(
        openNotification({
          text: "Something went wrong",
          heading: "Error!",
          type: "error",
        })
      );
      // alert('Failed to apply coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = async (couponId) => {
    setIsRemovingCoupon(true);
    try {
      const response = await removeCoupon.post(
        "/",
        {
          payment_information_id: Cart?.id,
          coupon_id: couponId,
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response.data) {
        setAppliedCoupon(null);
        setCouponUsageData(null);
        dispatch(setCart(response.data));
        setCouponSavedAmount(0);
        setIsRemovingCoupon(false);
        // Refresh payment data
        props.fetchData(true);
      }
    } catch (error) {
      setIsRemovingCoupon(false);
      console.error("Error removing coupon:", error);
      // alert('Failed to remove coupon. Please try again.');
      dispatch(
        openNotification({
          text: "Something went wrong",
          heading: "Error!",
          type: "error",
        })
      );
    }
  };

  const handleViewCoupons = () => {
    setShowCouponModal(true);
  };

  let bookingslist = [];
  let bookinglistwithcost = [];
  // Date on which agoda changes made to box
  let oldaccommodation = false;
  if (props.traveleritinerary) oldaccommodation = true;

  // setBookingSummary();

  function getURL() {
    const url = router.asPath.split("?")[0];
    const searchParams = new URLSearchParams(router.asPath.split("?")[1]);
    searchParams.delete("t");
    const newPath =
      url + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    return newPath;
  }

  let message =
    "Hey TTW! I need some help with my tailored experience - https://www.thetarzanway.com" +
    getURL();

  const _startRazorpayHandler = (data, paymentType) => {
    let razorpayOptions = {
      // key: "rzp_test_FEKg5ZWGWl9i7c",
      key: "rzp_live_t1AzJZflHj0jWg",
      amount: data.amount * 100 || data?.discounted_cost * 100,
      name: "The Tarzan Way Payment Portal",
      description: " data.data.description",
      image:
        "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
      order_id: data?.sales[0]?.orders[0]?.order_id,
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        },
      },
      handler: function (response) {
        setPaymentLoading(true);

        axios
          .post(
            "https://dev.mercury.tarzanway.com/payment/verify/",
            { ...response },
            { headers: { Authorization: `Bearer ${props.token}` } }
          )
          .then((res) => {
            setPaymentLoading(false);

            // Set session completion based on payment type
            if (paymentType === "full") {
              setSessionPaymentCompleted(true);
              setPaymentCompleted(true);
              trackPaymentBookingConfirmed(router?.query?.id,Cart);
            } else {
              setLockInCompleted(true);
              setSelectedPaymentOption("full");
            }

            props.getPaymentHandler();
          })
          .catch((err) => {
            setPaymentLoading(false);
          });
      },
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
    } catch (error) { }
  };

  const _fullPaymentHandler = async (id) => {
    setPaymentLoading(true);

    try {
      const response = await paymentInitiate.post(
        "",
        {
          payment_information_id: Cart?.id,
          payment_type: "full_payment",
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response.data) {
        dispatch(setCart(response.data));
        props.fetchData(true);

        const fullPaymentSale = response.data?.sales?.find(
          (sale) =>
            sale.payment_type === "full_payment" && sale.status === "Created"
        );

        trackPaymentAttempted(router.query.id,Cart);

        if (!fullPaymentSale || !fullPaymentSale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(
            openNotification({
              text: "Payment order not found. Please refresh and try again.",
              heading: "Error!",
              type: "error",
            })
          );
          return;
        }

        const razorpayData = {
          amount: calculateFilteredTotal() + Cart?.surcharges_and_taxes,
          sales: [fullPaymentSale],
        };

        // Update the Razorpay handler to set session completion
        _startRazorpayHandler(razorpayData, "full");
      }
    } catch (error) {
      console.error("Error initiating full payment:", error);

      props.getPaymentHandler();
      dispatch(
        openNotification({
          text: "Something went wrong",
          heading: "Error!",
          type: "error",
        })
      );
      setPaymentLoading(false);
      return;
    }
  };

  const _lockInPaymentHandler = async (id) => {
    setPaymentLoading(true);

    try {
      const response = await paymentInitiate.post(
        "",
        {
          payment_information_id: Cart?.id,
          payment_type: "lock_payment",
        },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      );

      if (response.data) {
        dispatch(setCart(response.data));
        props.fetchData(true);

        const lockPaymentSale = response.data?.sales?.find(
          (sale) =>
            sale.payment_type === "lock_payment" && sale.status === "Created"
        );

        if (!lockPaymentSale || !lockPaymentSale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(
            openNotification({
              text: "Payment order not found. Please refresh and try again.",
              heading: "Error!",
              type: "error",
            })
          );
          return;
        }

        const razorpayData = {
          amount: lockPaymentSale.remaining_amount,
          sales: [lockPaymentSale],
        };

        _startRazorpayHandler(razorpayData, "lockin");
      }
    } catch (error) {
      console.error("Error initiating lock payment:", error);
      dispatch(
        openNotification({
          text:
            error?.response?.data?.errors?.[0]?.detail?.[0] ||
            "Something went wrong",
          heading: "Error!",
          type: "error",
        })
      );
      setPaymentLoading(false);
      return;
    }
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
    scrollToElement("Hotels");

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
    } else if (label === "lockin") {
      _lockInPaymentHandler(Cart?.id);
    } else if (label === "full") {
      _fullPaymentHandler(Cart?.id);
    } else {
      setShowVerification(true);
    }

    // logEvent({
    //   action: "Button_Click",
    //   params: {
    //     page: "Itinerary Page",
    //     event_category: "Button Click",
    //     event_label:
    //       selectedPaymentOption === "full"
    //         ? "Pay Full Amount"
    //         : "Lock-in Price",
    //     event_action: "Booking Slide",
    //   },
    // });
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
    trackWhatsAppClicked(router?.query?.id, Cart?.discounted_cost, "Rupees");
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

  const handleProceedToPayment = () => {
    setShowDetailedPayment(true);
    setShowPaymentDrawer(true);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}/`,
        query: {
          drawer: "payment",
        },
      },
      undefined,
      { scroll: false }
    );
  };

  const areAllInclusionsPaid = () => {
    if (!Cart?.summary) return false;

    let allPaid = true;
    Object.values(Cart.summary).forEach((category) => {
      if (category.bookings && category.bookings.length > 0) {
        category.bookings.forEach((booking) => {
          if (booking.status !== "Paid") {
            allPaid = false;
          }
        });
      }
    });

    return allPaid;
  };

  const areAnyInclusionsPaid = () => {
    if (!Cart?.summary) return false;

    let anyPaid = false;
    Object.values(Cart.summary).forEach((category) => {
      if (category.bookings && category.bookings.length > 0) {
        category.bookings.forEach((booking) => {
          if (booking.status == "Paid") {
            anyPaid = true;
          }
        });
      }
    });

    return anyPaid;
  };

  const isItineraryInFuture = () => {
    const startDate = new Date(Itinerary.start_date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return startDate >= currentDate;
  };

  const hasFullPaymentCompleted = Cart?.sales?.some(
    (sale) =>
      sale.payment_type === "full_payment" && sale.status === "Completed"
  );

  const hasPlanExpired =
    !Cart?.price_valid_until ||
    new Date(Cart.price_valid_until.replace(" ", "T")).getTime() <= Date.now();

  return (
    <>
      {!isDirectlyOpenPaymentDrawer && (
        <div>
          {pricing_status === "PENDING" || props?.loadpricing ? (
            <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
              <PricingSkeleton />
            </div>
          ) : (
            <div
              className={`${
                Cart?.paid_user ? "bg-[#98F0AB33]" : "bg-[#F7E70033]"
              }  -mt-[1rem] -mx-[1rem] mb-0`}
            >
              {!(final_status == "Paid" || final_status == "Released") && (
                <LivePriceTimer priceValidUntil={Cart?.price_valid_until} />
              )}
              <div className=" mx-[1rem] mt-[1rem]">
                <div className="flex flex-row justify-between">
                  {props.iscouponApplied &&
                  Cart?.discounted_cost != Cart?.total_cost &&
                  Cart?.show_per_person_cost !=
                    Cart?.per_person_discounted_cost ? (
                    <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                      <span>{`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}</span>
                      <div>
                        {Cart?.show_per_person_cost || Cart?.pay_only_for_one
                          ? getIndianPrice(
                              Math.round(Cart?.per_person_total_cost)
                            )
                          : getIndianPrice(Math.round(Cart?.total_cost))}
                        {"/-"}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {props.iscouponApplied && Cart?.coupon_usage && (
                    <div className="bg-[#EB5757] font-bold flex flex-row gap-1 items-center justify-center text-sm px-2 py-1 lg:mt-4 mt-0 text-white">
                      <div>{Cart?.coupon_usage?.usage_description}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row gap-1">
                    <div
                      show_per_person_cost={Cart?.show_per_person_cost}
                      className={
                        props.blur
                          ? "font-lexend blurry-text"
                          : "font-lexend text-3xl flex flex-row items-center font-semibold"
                      }
                    >
                      {Cart && <span>{`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}</span>}
                      {Cart && (
                        <div>
                          {Cart?.pay_only_for_one || Cart?.show_per_person_cost
                            ? getIndianPrice(
                                Math.round(
                                  Math.round(Cart?.per_person_discounted_cost)
                                )
                              )
                            : getIndianPrice(
                                Math.round(Math.round(Cart?.total_cost))
                              )}
                          {"/-"}
                        </div>
                      )}
                    </div>

                    {Cart?.paid_user ? (
                      <div className="font-[400] pl-2 text-base self-end">
                        PAID
                      </div>
                    ) : (
                      <div className="font-medium text-base self-end">
                        {Cart?.pay_only_for_one || Cart?.show_per_person_cost
                          ? "Per Person Cost"
                          : Cart?.is_estimated_price
                          ? `${Cart?.total_cost == 0 ? "" : "Estimated Price"}`
                          : Cart
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

                  {Cart && pricing_status === "SUCCESS" && (
                    <div className="text-[#7A7A7A] text-sm">
                      {Cart?.total_cost == 0
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
                  {Cart?.itinerary_status ===
                    ITINERARY_STATUSES?.itinerary_finalized ||
                  props?.plan?.featured ? null : (
                    <div></div>
                  )}

                  {Cart?.itinerary_status ===
                    ITINERARY_STATUSES.itinerary_finalized ||
                  props?.plan?.featured ? null : (
                    <div></div>
                  )}
                </div>
              ) : null}

              {Cart && (
                <div
                  className="mx-[1rem]  font-medium text-sm flex gap-0 flex-row cursor-pointer"
                  onClick={() => setAcordianOpen(!acoordianceOpen)}
                >
                  <div>
                    {acoordianceOpen ? <span>Hide</span> : <span>View</span>}{" "}
                    {!Cart?.are_prices_hidden ? "breakup" : "inclusions"}
                  </div>

                  <RiArrowDropDownLine
                    className={` text-2xl  mt-1 transition-all duration-100 ${
                      acoordianceOpen
                        ? "-rotate-180 "
                        : "rotate-180 animate-bounce"
                    }`}
                  ></RiArrowDropDownLine>
                </div>
              )}

              <div
                className={`mb-[0.8rem] mx-[1rem] Transition-Height-${
                  acoordianceOpen ? "in" : "out"
                } `}
              >
                {Cart && acoordianceOpen && (
                  <div className="">
                    <Accordion
                      stayBookings={Cart?.summary?.Stays?.bookings || []}
                      flightBookings={Cart?.summary?.Flights?.bookings || []}
                      activityBookings={
                        Cart?.summary?.Activities?.bookings || []
                      }
                      transferBookings={
                        Cart?.summary?.Transfers?.bookings || []
                      }
                      payment={Cart}
                      mercuryItinerary={props?.mercuryItinerary}
                    />

                    {!oldaccommodation && !Cart?.are_prices_hidden ? (
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
                          {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` +
                            getIndianPrice(
                              Math.round(Cart?.surcharges_and_taxes)
                            )}
                        </div>
                      </div>
                    ) : null}

                    {Cart ? (
                      Cart?.coupon && props.iscouponApplied ? (
                        Cart?.coupon.code ? (
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
                                  {Cart?.coupon.code}
                                </div>
                                <div className="font-normal ">
                                  {Cart?.coupon?.discount_type == "Flat"
                                    ? "(Flat  OFF!)"
                                    : Cart?.coupon?.discount_type ==
                                      "1 Night Free Stay"
                                    ? Cart?.coupon_usage?.discount
                                      ? `(INR ${getIndianPrice(
                                          Math.round(
                                            Cart?.coupon_usage?.discount
                                          )
                                        )}  OFF!)`
                                      : Cart?.coupon.discount_value
                                      ? Cart?.coupon.discount_value + "%  OFF!"
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
                              {Cart?.coupon_usage?.discount ? (
                                <div>
                                  (-){" "}
                                  {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` +
                                    getIndianPrice(
                                      Math.round(Cart?.coupon_usage?.discount)
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
        </div>
      )}

      {!isDirectlyOpenPaymentDrawer && (
        <div>
          <div className="px-0 pb-4">
            {props.couponJSX}
            <div className=" border-y border-[#F0F0F0] mb-3 mt-1">
              <div className=" group flex flex-row gap-3 items-center py-[1rem]">
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
                  )}
                </div>
              </div>
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
                    {pluralDetector(
                      "Infant",
                      props.itinerary?.number_of_infants
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isDirectlyOpenPaymentDrawer && (
        <div>
          <>
            {props.tripsPage ? (
              <Button
                color="#111"
                fontWeight="500"
                fontSize="1rem"
                borderWidth="1px"
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
                {props?.token ? (
                  <>
                    {pricing_status === "SUCCESS" &&
                    !(props.payment?.total_payable_amount === 0) &&
                    hasFullPaymentCompleted &&
                    !showDetailedPayment &&
                    areAllInclusionsPaid() ? (
                      <PaymentSuccess
                        amount={getIndianPrice(
                          Math.round(Cart?.discounted_cost)
                        )}
                        onDownloadInvoice={handleGetInTouch}
                        loading={props?.loading}
                      />
                    ) : (
                      <>
                        {/* Check for pricing failure first */}
                        {pricing_status === "FAILURE" ? (
                          <GetInTouchContainer>
                            <Button
                              color="#111"
                              fontWeight="500"
                              fontSize="1rem"
                              borderWidth="1px"
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
                                  url={
                                    "media/icons/login/customer-service-black.png"
                                  }
                                />
                                {props?.loading ? (
                                  <PulseLoader />
                                ) : (
                                  <span>Get in touch!</span>
                                )}
                              </div>
                            </Button>
                          </GetInTouchContainer>
                        ) : (
                          <>
                            {pricing_status === "SUCCESS" && (
                              <div>
                                {(() => {
                                  const isItineraryInPast = () => {
                                    if (!props?.itinerary?.start_date)
                                      return false;
                                    const startDate = new Date(
                                      props?.itinerary?.start_date
                                    );
                                    const currentDate = new Date();
                                    currentDate.setHours(0, 0, 0, 0);
                                    startDate.setHours(0, 0, 0, 0);
                                    return startDate < currentDate;
                                  };

                                  if (
                                    isItineraryInPast() ||
                                    Math.round(Cart?.total_cost) === 0
                                  ) {
                                    return (
                                      <>
                                        <GetInTouchContainer>
                                          <Button
                                            color="#111"
                                            fontWeight="500"
                                            fontSize="1rem"
                                            borderWidth="1px"
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
                                                dimensions={{
                                                  height: 50,
                                                  width: 50,
                                                }}
                                                dimensionsMobile={{
                                                  height: 50,
                                                  width: 50,
                                                }}
                                                height={"20px"}
                                                width={"20px"}
                                                widthmobile={"20px"}
                                                leftalign
                                                url={
                                                  "media/icons/login/customer-service-black.png"
                                                }
                                              />{" "}
                                              {props?.loading ? (
                                                <PulseLoader />
                                              ) : (
                                                <span>Get in touch!</span>
                                              )}
                                            </div>
                                          </Button>
                                        </GetInTouchContainer>
                                        <Button
                                          width="100%"
                                          margin="0.5rem 0 0 0"
                                          borderRadius="8px"
                                          hoverColor="white"
                                          fontWeight="400"
                                          padding="12px"
                                          borderWidth="1px"
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
                                      </>
                                    );
                                  }

                                  return (
                                    <>
                                      <div className="mb-4">
                                        {!hasPlanExpired && (
                                          <h3 className="font-medium text-base mb-3">
                                            Payment Options
                                          </h3>
                                        )}

                                        {/* Pay Full Amount Option */}
                                        {!hasPlanExpired && (
                                          <div
                                            className={`border-2 ${
                                              selectedPaymentOption === "full"
                                                ? "border-yellow-400 bg-yellow-50"
                                                : "border-gray-200"
                                            } rounded-lg p-3 mb-3 cursor-pointer`}
                                            onClick={() =>
                                              setSelectedPaymentOption("full")
                                            }
                                          >
                                            <div className="flex items-center gap-3">
                                              <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                  selectedPaymentOption ===
                                                  "full"
                                                    ? "border-yellow-400 bg-yellow-400"
                                                    : "border-gray-300"
                                                }`}
                                              >
                                                {selectedPaymentOption ===
                                                  "full" && (
                                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <div className="font-medium text-base">
                                                  {hasFullPaymentCompleted
                                                    ? "Pay the remaining amount now to get discounts"
                                                    : "Pay full amount now to get discounts"}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {hasPlanExpired ? (
                                        <Button
                                          color="#111"
                                          fontWeight="500"
                                          fontSize="1rem"
                                          borderWidth="1px"
                                          width="100%"
                                          borderRadius="8px"
                                          bgColor="#f8e000"
                                          padding="12px"
                                          onclick={handleRepriceBookings}
                                          disabled={repriceLoading}
                                        >
                                          {repriceLoading ? (
                                            <div className="flex items-center justify-center">
                                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                              Repricing...
                                            </div>
                                          ) : (
                                            "Refresh Prices"
                                          )}
                                        </Button>
                                      ) : (
                                        <PaymentButton
                                          amount={
                                            selectedPaymentOption === "full"
                                              ? Cart?.total_payable_amount
                                              : Cart?.lock_in_fee
                                          }
                                          isLoading={paymentLoading}
                                          paymentType={"full"}
                                          onClick={handleProceedToPayment}
                                        />
                                      )}

                                      {
                                        // Cart?.lock_in_fee_paid && !hasFullPaymentCompleted ? (
                                        //   <div className="text-sm mt-2">
                                        //     <span>
                                        //       <LuClock4 color="green" className="inline align-middle mr-1 font-semibold" />
                                        //       {`Your lock-in fee of ₹2,000 has been received. Please pay the remaining ₹${getIndianPrice(
                                        //         Math.round(
                                        //           Math.round(Cart?.total_payable_amount)
                                        //         )
                                        //       )} now or before 5 Sept 2025 to confirm your trip.`}
                                        //     </span>
                                        //   </div>
                                        // ) :
                                        hasFullPaymentCompleted ? (
                                          <div className="text-sm mt-2">
                                            <span>
                                              <LuClock4
                                                color="green"
                                                className="inline align-middle mr-1 font-semibold"
                                              />
                                              {`Your Itinerary fee of ${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${Math.round(
                                                Cart?.discounted_cost
                                              )} has been received. Please pay the remaining now or before 5 Sept 2025 to confirm your trip.`}
                                            </span>
                                          </div>
                                        ) : null
                                      }

                                      {selectedPaymentOption === "full" &&
                                        !hasFullPaymentCompleted &&
                                        !hasPlanExpired && (
                                          <div className="text-center text-sm text-gray-600 mt-3">
                                            Apply your coupon code at checkout
                                            in next step.
                                          </div>
                                        )}
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div>
                    <Button
                      color="#111"
                      fontWeight="400"
                      fontSize="0.45rem"
                      borderWidth="1px"
                      width="100%"
                      borderRadius="10px"
                      bgColor="#F7E700"
                      onclick={handleLoginButton}
                    >
                      Log in to proceed & Pay
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      )}

      {/* Payment Drawer - shows full pricing + detailed payment when proceeding */}
      {showPaymentDrawer && (
        <Drawer
          show={showPaymentDrawer}
          anchor={"right"}
          backdrop
          width={"100%"}
          mobileWidth={"100%"}
          style={{ zIndex: 1600 }}
          className={`!bg-primary-cornsilk ${showCouponModal ? "overflow-hidden" : "overflow-y-auto"
            }`}
          onHide={() => handleCloseDrawer()}
        >
          {/* Close button */}

          {/* Full pricing section in drawer */}
          {pricing_status === "PENDING" || props?.loadpricing ? (
            <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
              <PricingSkeleton />
            </div>
          ) : (
            <div
              className={`${
                Cart?.paid_user ? "bg-[#98F0AB33]" : "bg-[#F7E70033]"
              }  mb-0`}
            >
              {!(final_status == "Paid" || final_status == "Released") && (
                <LivePriceTimer priceValidUntil={Cart?.price_valid_until} />
              )}
              <div className="flex justify-end -mt-[1.8rem] mr-2">
                <IoMdClose
                  className="hover:cursor-pointer text-2xl hover:text-gray-600 transition-colors"
                  onClick={() => handleCloseDrawer()}
                />
              </div>
              <div className="p-lg">
                <div className="flex flex-row justify-between">
                  {props.iscouponApplied &&
                  Cart?.discounted_cost != Cart?.total_cost &&
                  Cart?.show_per_person_cost !=
                    Cart?.per_person_discounted_cost ? (
                    <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                      <span>{`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}</span>
                      <div>
                        {getIndianPrice(Math.round(Cart?.total_cost))}
                        {"/-"}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {props.iscouponApplied && Cart?.coupon_usage && (
                    <div className="bg-[#EB5757] font-bold flex flex-row gap-1 items-center justify-center text-sm px-2 py-1 lg:mt-4 mt-0 text-white">
                      <div>{Cart?.coupon_usage?.usage_description}</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row gap-1">
                    <div
                      className={
                        props.blur
                          ? "font-lexend blurry-text"
                          : "font-lexend text-3xl flex flex-row items-center font-semibold"
                      }
                    >
                      {Cart && <span>{`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}</span>}
                      {Cart && (
                        <div>
                          {Cart?.pay_only_for_one || Cart?.show_per_person_cost
                            ? getIndianPrice(
                                Math.round(Math.round(Cart?.total_cost))
                              )
                            : getIndianPrice(
                                Math.round(Math.round(Cart?.total_cost))
                              )}
                          {"/-"}
                        </div>
                      )}
                    </div>

                    {Cart?.paid_user ? (
                      <div className="font-[400] pl-2 text-base self-end">
                        PAID
                      </div>
                    ) : (
                      <div className="font-medium text-base self-end">
                        {
                          // Cart?.pay_only_for_one || Cart?.show_per_person_cost
                          //   ? "Per Person Cost"
                          //   : Cart?.is_estimated_price
                          //   ?
                          // `${Cart?.total_cost == 0 ? "" : "Estimated Price"}`
                          Cart ? "Total Cost" : ""
                        }
                      </div>
                    )}
                  </div>

                  {pricing_status === "FAILURE" ? (
                    <p className="text-red-600 text-sm">
                      Get in touch to finalize the pricing!
                    </p>
                  ) : null}

                  {Cart && pricing_status === "SUCCESS" && (
                    <div className="text-[#7A7A7A] text-sm">
                      {Cart?.total_cost == 0
                        ? "No bookings added yet"
                        : "Inclusive of applicable taxes"}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`mb-[0.8rem] mx-[1rem] Transition-Height-${
                  acoordianceOpen ? "in" : "out"
                } `}
              >
                {Cart && acoordianceOpen && (
                  <div className="">
                    <Accordion
                      stayBookings={props.stayBookings}
                      flightBookings={props.flightBookings}
                      activityBookings={props.activityBookings}
                      transferBookings={props.transferBookings}
                      payment={Cart}
                      mercuryItinerary={props?.mercuryItinerary}
                    ></Accordion>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date and passenger info */}
          <div className="px-lg pb-lg">
            {props.couponJSX}
            <div className=" border-y border-[#F0F0F0] mb-3 mt-1">
              <div className=" group flex flex-row gap-3 items-center py-[1rem]">
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
                  )}
                </div>
              </div>
            </div>

            <div className="group text-md font-medium gap-3 flex flex-row items-center mb-4 ml-1">
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
                    {pluralDetector(
                      "Infant",
                      props.itinerary?.number_of_infants
                    )}
                  </div>
                ) : null}
              </div>
            </div>

                  {Cart?.total_payable_amount == 0 &&
                    areAllInclusionsPaid() &&
                    Cart?.discounted_cost > 0 ? (
                    <PaymentSuccess
                      amount={getIndianPrice(Math.round(Cart?.discounted_cost))}
                      onDownloadInvoice={() => handleGetInTouch()}
                    />
                  ) : !isItineraryInFuture() && !areAnyInclusionsPaid() ? (
                    // Show only update dates when itinerary is in past
                    <div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <p className="text-amber-700 text-sm font-medium mb-2">
                          Your itinerary dates are in the past. Please update the
                          dates to view current pricing and continue with booking.
                        </p>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-medium text-base mb-3">
                          Update Travel Dates
                        </h3>
                        <UpdateItineraryDates
                          itinerary={props?.itinerary}
                          token={props?.token}
                          onUpdateSuccess={props.fetchData}
                          resetRef={props?.resetRef}
                          convertDFormat={convertDFormat}
                          showPhoneView={true}
                          handleCloseDrawer={handleCloseDrawer}
                        />
                      </div>

                      <Button
                        width="100%"
                        margin="0.5rem 0 0 0"
                        borderRadius="8px"
                        hoverColor="white"
                        fontWeight="400"
                        padding="12px"
                        borderWidth="1px"
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
              </div>
            ) : !isItineraryInFuture() && areAnyInclusionsPaid() ? (
              <>
                <GetInTouchContainer>
                  <Button
                    color="#111"
                    fontWeight="500"
                    fontSize="1rem"
                    borderWidth="1px"
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
                      />
                      {props?.loading ? (
                        <PulseLoader />
                      ) : (
                        <span>Get in touch!</span>
                      )}
                    </div>
                  </Button>
                </GetInTouchContainer>
              </>
            ) : hasPlanExpired &&
              isItineraryInFuture() &&
              pricing_status == "SUCCESS" ? (
              // Show only refresh prices button when expired
              <div>

                 <ItineraryInclusions
                  Cart={Cart}
                  selectedInclusions={selectedInclusions}
                  onToggleInclusion={handleToggleInclusion}
                  arePricesHidden={Cart?.are_prices_hidden}
                  updatingInclusions={updatingInclusions}
                  defaultExpanded={
                    Cart?.sales?.some((sale) => sale.status === "Completed") &&
                    Cart?.total_payable_amount !== 0
                  }
                  disableOnExpiry={true}
                />
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm font-medium mb-2">
                    Your itinerary prices have expired. Please refresh to get
                    the latest prices.
                  </p>
                </div>

                      <Button
                        color="#111"
                        fontWeight="500"
                        fontSize="1rem"
                        borderWidth="1px"
                        width="100%"
                        borderRadius="8px"
                        bgColor="#f8e000"
                        padding="12px"
                        onclick={handleRepriceBookings}
                        disabled={repriceLoading}
                      >
                        {repriceLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                            Repricing...
                          </div>
                        ) : (
                          "Refresh Prices"
                        )}
                      </Button>

                      <Button
                        width="100%"
                        margin="0.5rem 0 0 0"
                        borderRadius="8px"
                        hoverColor="white"
                        fontWeight="400"
                        padding="12px"
                        borderWidth="1px"
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
                    </div>
                  ) : (
                    <div>
                      <div className="text-md font-500 leading-lg mb-xs"> {localStorage.getItem("name") || ""} </div>

                      <div className="flex flex-row gap-xs text-sm font-400 leading-md">
                        <div> Dates :     {convertDFormat(
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
                        <div className="border-r-sm border-text-disabled"> </div>
                        <div> Trip : {props.trip_name}</div>
                        <div className="border-r-sm border-text-disabled"> </div>
                        <div> Travellers : {pax} {pluralDetector("Adult", pax)}{" "}
                          {props.itinerary?.number_of_children ? (
                            <div>, {props.itinerary?.number_of_children} Children</div>
                          ) : null}
                          {props.itinerary?.number_of_infants ? (
                            <div>
                              , {props.itinerary?.number_of_infants}{" "}
                              {pluralDetector(
                                "Infant",
                                props.itinerary?.number_of_infants
                              )}
                            </div>
                          ) : null}</div>
                      </div>
                    </div>
                  )}
                  <hr className="text-text-placeholder" />

                  <div>
                    <div>
                      <ItineraryInclusions
                        Cart={Cart}
                        selectedInclusions={selectedInclusions}
                        onToggleInclusion={handleToggleInclusion}
                        arePricesHidden={Cart?.are_prices_hidden}
                        updatingInclusions={updatingInclusions}
                        defaultExpanded={
                          Cart?.sales?.some((sale) => sale.status === "Completed") &&
                          Cart?.total_payable_amount !== 0
                        }
                      />

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="">
                  {pricing_status === "PENDING" || props?.loadpricing ? (
                    <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
                      <PricingSkeleton />
                    </div>
                  ) : (
                    <div>
                      {!(final_status == "Paid" || final_status == "Released") && (
                        <LivePriceTimer priceValidUntil={Cart?.price_valid_until} />
                      )}
                    </div>
                  )}


                  <div className="mt-md">

                    {!(selectedPaymentOption === "lockin") &&
                      !hasFullPaymentCompleted &&
                      !hasPlanExpired &&
                      calculateFilteredTotal() !== 0 && (
                        <CouponSection
                          appliedCoupon={appliedCoupon}
                          savedAmount={couponSavedAmount}
                          onRemoveCoupon={handleRemoveCoupon}
                          onApplyCoupon={handleApplyCoupon}
                          onViewCoupons={() => setShowCouponModal(true)}
                          isRemoving={isRemovingCoupon}
                          payment={couponUsageData} // Pass payment data
                        />
                      )}

                    {
                      <PriceDetails
                        itineraryCost={getIndianPrice(
                          Math.round(
                            Cart?.discounted_cost +
                            (couponUsageData?.discount || 0)
                          )
                        )}
                        lockInCost={0}
                        couponDiscount={appliedCoupon ? -couponSavedAmount : 0}
                        surchargesTaxes={
                          Math.round(Cart?.surcharges_and_taxes) || 0
                        }
                        totalPayable={getIndianPrice(
                          Math.round(calculateFilteredTotal())
                        )}
                        selectedPaymentOption={selectedPaymentOption}
                        selectedInclusions={selectedInclusions}
                        totalBookingsCost={Cart?.total_bookings_cost}
                      />
                    }

                {hasFullPaymentCompleted && (
                  <div className="text-sm mt-2 mb-4">
                    <span>
                      <LuClock4
                        color="green"
                        className="inline align-middle mr-1 font-semibold"
                      />
                      {`You have paid ${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}${Math.round(
                        Cart?.amount_paid
                      )} for your itinerary. Please pay the remaining balance at least 7 days before your trip starts to confirm your booking.`}
                    </span>
                  </div>
                )}


                    {console.log(`${pricing_status} - ${isItineraryInFuture()} - ${hasPlanExpired}`)}
                    {/* {!lockInCompleted && ( */}
                    {hasPlanExpired &&
                      isItineraryInFuture() &&
                      pricing_status == "SUCCESS" ? (
                      <></>
                    ) : calculateFilteredTotal() === 0 ? (
                      <>

                        <GetInTouchContainer>
                          <Button
                            color="#111"
                            fontWeight="500"
                            fontSize="1rem"
                            borderWidth="1px"
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
                              />
                              {props?.loading ? (
                                <PulseLoader />
                              ) : (
                                <span>Get in touch!</span>
                              )}
                            </div>
                          </Button>
                        </GetInTouchContainer>

                        <div className="text-center text-sm text-amber-600 mt-3 p-2 bg-amber-50 rounded">
                          Please select at least one inclusion to proceed
                        </div>
                      </>
                    ) : (
                      <PaymentButton
                        amount={calculateFilteredTotal()}
                        isLoading={paymentLoading}
                        paymentType={"full"}
                        onClick={() => handlePayNow("full")}
                      />
                    )}


                    {Cart.total_payable_amount === 0 && <>    <hr className="text-text-placeholder" /> <div>
                      <div className="text-md font-500 leading-xl"> Need help with your trip? </div>
                      <div className="text-sm-md font-400 leading-xl text-text-spacegrey"> About any issue related o your bookings</div>
                    </div> </>}
                    <button
                      className="border-sm border-primary-indigo text-primary-indigo text-sm font-500 leading-md rounded-md-lg py-xs px-md w-full mt-md"
                      onClick={handleWhatsappChat}
                    >
                      <div className="flex flex-row justify-center items-center">
                        <RiWhatsappFill className="text-[#4da750] mr-2 text-xl" />
                        <div>Chat on WhatsApp</div>
                      </div>
                    </button>

                    <div className="flex flex-row justify-center items-center text-[#01202B] mt-2">
                      <Link
                        href="/terms-conditions"
                        target="_blank"
                        onClick={handleTermsConditions}
                      >
                        <div className="text-sm">Terms & Conditions</div>
                      </Link>
                    </div>


                    <div className="bg-primary-lightPurple p-sm mt-xl">
                      <div className="text-sm font-500 leading-xl mb-sm"> Your Trip Will have  </div>
                      <div>
                        {tripCondition.map((item, index) => (
                          <div key={index} className="flex gap-md mb-md">
                            <img src={item.icon} alt="icon" width={20} height={20} className="rounded-circle w-[25px] h-[25px] flex p-[5px] bg-text-white" />
                            <div>
                              <div className="text-sm font-500 leading-sm-md mb-xxs"> {item.title} </div>
                              <div className="text-sm font-400 leading-sm-md text-text-spacegrey"> {item.subheading} </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* </div> */}
          </div>
          <CouponModal
            show={showCouponModal}
            onHide={() => setShowCouponModal(false)}
            onApplyCoupon={handleApplyCoupon}
            appliedCoupon={appliedCoupon ? true : false}
            setAppliedCoupon={setAppliedCoupon}
            token={props?.token}
            payment={Cart} // Pass payment data
          />
          <TrustFactor />
        </Drawer >

      )}

      <RegistrationModal
        number_of_adults={
          props?.itinerary ? props?.itinerary?.number_of_adults : 5
        }
        payment={Cart}
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
        registered_users={Cart ? Cart?.registered_users : null}
        show={showRegisteredUsers}
        hide={() => setShowRegisteredUsers(false)}
      ></RegisteredUsersModal>

      <TermsModal
        show={showTerms}
        hide={() => setShowTerms(false)}
      ></TermsModal>

      {
        props.token && Newitinerary && (
          <MakeYourPersonalised
            date={Cart?.meta_info?.start_date}
            onHide={() => setNewitinerary(false)}
            show={Newitinerary}
          />
        )
      }

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