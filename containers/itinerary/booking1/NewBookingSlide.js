import React, { useCallback, useEffect, useRef, useState } from "react";
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
import TrustFactor from "../../../components/tailoredform/TrustFactor";
import NavigationMenu from "../../../components/revamp/home/NavigationMenu";
import { TbClockExclamation } from "react-icons/tb";
import { FcCalendar } from "react-icons/fc";
import { MdArrowBackIosNew } from "react-icons/md";
import { currencySymbols } from "../../../data/currencySymbols";
import usePaymentGateway from "../../../hooks/usePaymentGateway";
import { resetChatSession } from "../../../store/actions/chatState";

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;
const ScrollContainer = styled.div`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
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
  const Cart = useSelector((state) => state.Cart);
  const { currency } = useSelector((state) => state.currency);

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
      const response = await fetchCoupons.get(
        `/?itinerary_id=${ItineraryId}&currency=${currency || "INR"}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const formattedCoupons = response.data.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        title: `Save ${currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}${coupon.discount_value}`,
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
        <button onClick={onHide} className="">
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
                      className={`px-3 py-1 rounded font-medium text-sm transition-colors whitespace-nowrap min-w-[60px] h-8 flex items-center justify-center ${
                        appliedCoupon === coupon.code ||
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
    document.body,
  );
};

const LivePriceTimer = ({ priceValidUntil, lockInAmount = 2000 }) => {
  const targetTime = priceValidUntil
    ? new Date(priceValidUntil.replace(" ", "T")).getTime()
    : null;
  const { itinerary_status, transfers_status, pricing_status } = useSelector(
    (state) => state.ItineraryStatus,
  );
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
        Prices Expired! Click on reprice itinerary to check updated itinerary
        cost
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
      className={`${
        Cart?.paid_user ? "bg-[#98F0AB33]" : "bg-[#ffffe7]"
      } border-sm border-primary-yellow p-sm rounded-sm text-xs font-medium w-100`}
    >
      <div className="flex items-center gap-2xl justify-evenly">
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
          <span className="text-md-lg font-600 leading-xl">
            {remainingSeconds}
          </span>
          <span className="text-xs tex-spacegrey font-400">Secs</span>
        </div>
      </div>
    </div>
  );
};

const PaymentCreated = ({ onClickButton, loading }) => {
  return (
    <div className="bg-white rounded-lg">
      <div className="mb-2">
        <div className="mb-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="72px"
            height="72px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle opacity="1" cx="12" cy="12" r="10" fill="#FFD201" />
            <path
              d="M7.37756 11.6296H6.62756H7.37756ZM7.37756 12.5556L6.81609 13.0528C6.95137 13.2056 7.14306 13.2966 7.34695 13.3049C7.55084 13.3133 7.74932 13.2382 7.89662 13.0969L7.37756 12.5556ZM9.51905 11.5414C9.81805 11.2547 9.82804 10.7799 9.54137 10.4809C9.2547 10.182 8.77994 10.172 8.48095 10.4586L9.51905 11.5414ZM6.56148 10.5028C6.28686 10.1927 5.81286 10.1639 5.50277 10.4385C5.19267 10.7131 5.16391 11.1871 5.43852 11.4972L6.56148 10.5028ZM14.9317 9.0093C15.213 9.31337 15.6875 9.33184 15.9915 9.05055C16.2956 8.76927 16.3141 8.29476 16.0328 7.9907L14.9317 9.0093ZM12.0437 6.25C9.05802 6.25 6.62756 8.653 6.62756 11.6296H8.12756C8.12756 9.49251 9.87531 7.75 12.0437 7.75V6.25ZM6.62756 11.6296L6.62756 12.5556H8.12756L8.12756 11.6296H6.62756ZM7.89662 13.0969L9.51905 11.5414L8.48095 10.4586L6.85851 12.0142L7.89662 13.0969ZM7.93904 12.0583L6.56148 10.5028L5.43852 11.4972L6.81609 13.0528L7.93904 12.0583ZM16.0328 7.9907C15.0431 6.9209 13.6212 6.25 12.0437 6.25V7.75C13.1879 7.75 14.2154 8.23504 14.9317 9.0093L16.0328 7.9907Z"
              fill="#fff"
            />
            <path
              d="M16.6188 11.4443L17.1795 10.9462C17.044 10.7937 16.8523 10.703 16.6485 10.6949C16.4447 10.6868 16.2464 10.7621 16.0993 10.9034L16.6188 11.4443ZM14.4805 12.4581C14.1817 12.745 14.1722 13.2198 14.4591 13.5185C14.746 13.8173 15.2208 13.8269 15.5195 13.54L14.4805 12.4581ZM17.4393 13.4972C17.7144 13.8068 18.1885 13.8348 18.4981 13.5597C18.8078 13.2846 18.8358 12.8106 18.5607 12.5009L17.4393 13.4972ZM9.04688 15.0047C8.76342 14.7027 8.28879 14.6876 7.98675 14.9711C7.68472 15.2545 7.66966 15.7292 7.95312 16.0312L9.04688 15.0047ZM11.9348 17.7499C14.9276 17.7499 17.3688 15.3496 17.3688 12.3703H15.8688C15.8688 14.5047 14.1158 16.2499 11.9348 16.2499V17.7499ZM17.3688 12.3703V11.4443H15.8688V12.3703H17.3688ZM16.0993 10.9034L14.4805 12.4581L15.5195 13.54L17.1383 11.9853L16.0993 10.9034ZM16.0581 11.9425L17.4393 13.4972L18.5607 12.5009L17.1795 10.9462L16.0581 11.9425ZM7.95312 16.0312C8.94543 17.0885 10.3635 17.7499 11.9348 17.7499V16.2499C10.792 16.2499 9.76546 15.7704 9.04688 15.0047L7.95312 16.0312Z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="flex justify-between max-ph:flex-col">
          <div>
            <h2 className="text-lg font-600 leading-xl">
              Your last payment was cancelled.
            </h2>
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
                  color: "white",
                }}
              >
                {loading ? <PulseLoader color="white" /> : <span>Retry</span>}
              </div>
            </Button>
          </GetInTouchContainer>
        </div>
      </div>
      <hr />
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
            <h2 className="text-lg font-600 leading-xl">
              Your last payment was failed.
            </h2>
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
                {loading ? <PulseLoader color="white" /> : <span>Retry</span>}
              </div>
            </Button>
          </GetInTouchContainer>
        </div>
      </div>
      <hr />
    </div>
  );
};

const PaymentSuccess = ({ amount, onDownloadInvoice, loading }) => {
  const { currency } = useSelector((state) => state.currency);
  return (
    <div className="bg-white px-2 rounded-lg">
      <div className="mb-2">
        <div className="mb-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.20951 44.1553L7.18399 49.2875C7.17889 50.3185 7.36264 51.2858 7.73013 52.1815C8.10272 53.0875 8.65144 53.9041 
            9.37362 54.6264C10.0958 55.3486 10.9151 55.8973 11.8185 56.2699C12.7142 56.6374 13.6815 56.8211 14.7125 56.816L19.8446 56.7905C20.4801 56.7854 
            21.0645 56.8977 21.6004 57.1197C22.1287 57.3366 22.6187 57.6735 23.0679 58.1303L26.679 61.7772C27.4038 62.5096 28.2179 63.066 29.1111 
            63.4385C30.0094 63.8137 30.9741 64 32 64C33.0259 64 33.9906 63.8111 34.8889 63.4385C35.7847 63.066 36.5962 62.5121 37.321 61.7772L40.9321 58.1303C41.3813 57.6786 41.8738 57.3392 42.3996 57.1197C42.9355 56.8977 43.5225 56.7879 44.1553 56.7905L49.2875 56.816C50.3185 56.8211 51.2858 56.6374 52.1815 56.2699C53.0875 55.8973 53.9041 55.3486 54.6264 54.6264C55.3486 53.9042 55.8973 53.0849 56.2699 52.1815C56.6374 51.2858 56.8211 50.3185 56.816 49.2875L56.7905 44.1553C56.7854 43.5199 56.8977 42.9355 57.1197 42.3996C57.3366 41.8713 57.6735 41.3813 58.1303 40.9321L61.7772 37.321C62.5096 36.5962 63.066 35.7821 63.4385 34.8889C63.8137 33.9906 64 33.0259 64 32C64 30.9741 63.8111 30.0094 63.4385 29.1111C63.066 28.2153 62.5121 27.4038 61.7772 26.679L58.1303 23.0679C57.6786 22.6187 57.3392 22.1262 57.1197 21.6004C56.8977 21.0645 56.7879 20.4775 56.7905 19.8446L56.816 14.7125C56.8211 13.6815 56.6374 12.7142 56.2699 11.8185C55.8973 10.9125 55.3486 10.0959 54.6264 9.37362C53.9041 8.65137 53.0849 8.10271 52.1815 7.73012C51.2858 7.36263 50.3185 7.17888 49.2875 7.18399L44.1553 7.20951C43.5199 7.21461 42.9329 7.10232 42.3996 6.88029C41.8713 6.66337 41.3813 6.3265 40.9321 5.86967L37.321 2.22284C36.5962 1.4904 35.7821 0.934032 34.8889 0.561444C33.9906 0.186294 33.0259 0 32 0C30.9741 0 30.0094 0.188849 29.1111 0.561444C28.2153 0.934039 27.4038 1.48785 26.679 2.22284L23.0679 5.86967C22.6187 6.32138 22.1262 6.66078 21.6004 6.88029C21.0645 7.10232 20.4775 7.21206 19.8446 7.20951L14.7125 7.18399C13.6815 7.17888 12.7142 7.36263 11.8185 7.73012C10.9125 8.10272 10.0959 8.65144 9.37362 9.37362C8.65138 10.0959 8.10272 10.9151 7.73013 11.8185C7.36264 12.7142 7.17889 13.6815 7.18399 14.7125L7.20951 19.8446C7.21462 20.4801 7.10233 21.0671 6.8803 21.6004C6.66338 22.1287 6.32651 22.6187 5.86968 23.0679L2.22284 26.679C1.49041 27.4038 0.934039 28.2179 0.56145 29.1111C0.186301 30.0094 0 30.9741 0 32C0 33.0259 0.188849 33.9906 0.56145 34.8889C0.934045 35.7847 1.48786 36.5962 2.22284 37.321L5.86968 40.9321C6.32139 41.3813 6.66078 41.8738 6.8803 42.3996C7.10232 42.9355 7.21206 43.5225 7.20951 44.1553ZM45.2118 24.9053L28.9095 41.2076C28.3226 41.7945 27.3757 41.7945 26.7888 41.2076L18.7987 33.2175C18.2117 32.6305 18.2117 31.6837 18.7987 31.0967C19.3857 30.5097 20.3325 30.5097 20.9194 31.0967L27.8505 38.0278L43.0912 22.7871C43.6781 22.2002 44.625 22.2002 45.2119 22.7871C45.7989 23.3741 45.7989 24.3209 45.2119 24.9079L45.2118 24.9053Z"
              fill="#5CBA66"
            />
          </svg>
        </div>
        <div className="flex justify-between max-ph:flex-col">
          <div>
            <h2 className="text-lg font-600 leading-xl">
              All set—your payment was successful.
            </h2>
            <p className="text-md font-400 leading-xl text-text-spacegrey mb-zero max-ph:mb-md">
              Your full payment of{" "}
              {currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}
              {amount?.toLocaleString("en-IN")} has been received. No pending
              balance.
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
              onclick={onDownloadInvoice}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  alignItems: "center",
                  color: `white`,
                }}
              >
                {loading ? (
                  <PulseLoader color="white" />
                ) : (
                  <span>Get in touch</span>
                )}
              </div>
            </Button>
          </GetInTouchContainer>
        </div>
      </div>
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
              className={`text-sm font-medium transition-colors min-w-[60px] h-8 flex items-center justify-center rounded px-2 ${
                isRemoving
                  ? "text-red-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-600"
              }`}
              onClick={() => onRemoveCoupon(couponData?.code || appliedCoupon)}
              disabled={isRemoving}
            >
              {isRemoving ? <PulseLoader color="white" /> : "Remove"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full py-md border-y-sm text-left flex items-center justify-between">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-500 leading-lg">
                  Apply coupon
                </span>
              </div>
              <button
                onClick={onViewCoupons}
                className="border-sm border-primary-indigo text-primary-indigo text-xs font-500 leading-md rounded-md-lg px-md"
              >
                {" "}
                Apply
              </button>
            </div>
          </div>

          {/* <p className="text-xs text-gray-500 mt-2">
            Note: Coupons and discounts are not applicable on the itinerary
            lock-in fee.
          </p> */}
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
  const { currency } = useSelector((state) => state.currency);

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
    typeof totalPayable === "string"
      ? parseFloat(totalPayable.replace(/,/g, "")) || 0
      : totalPayable || 0;

  return (
    <div className="mb-4">
      <h3
        className={`leading-md inline-block pb-xxs mb-md ${
          numericTotalPayable === 0
            ? "text-md font-500"
            : "text-sm border-b-sm border-primary-yellow font-400"
        }`}
      >
        {" "}
        {numericTotalPayable === 0 ? "Payment Summary" : "PRICE DETAILS"}{" "}
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-400 leading-md mb-sm">
          <span> Total Itinerary Cost </span>
          <span>
            {currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}
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

        {Cart?.taxation_policy == "TCS" && (
          <div className="flex justify-between text-sm font-400 leading-md mb-sm">
            <span>GST</span>
            <span>
              {currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}
              {Cart?.gst?.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {Cart?.taxation_policy == "TCS" && (
          <div className="flex justify-between text-sm font-400 leading-md mb-sm">
            <span>TCS</span>
            <span>
              {currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}
              {Cart?.tcs?.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {couponDiscount >= 0 || couponDiscount < 0 ? (
          <div className="flex justify-between text-green-600 text-sm font-400 leading-md mb-sm">
            <span>Coupon Discount</span>
            <span>
              {couponDiscount
                ? currencySymbols?.[currency]
                  ? "-" +
                    currencySymbols?.[currency] +
                    Math.abs(couponDiscount).toLocaleString("en-IN")
                  : "-₹" + Math.abs(couponDiscount).toLocaleString("en-IN")
                : `${currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}0`}
            </span>
          </div>
        ) : null}

        <div className="border-t-sm border-text-disabled pt-2 mt-2">
          <div className="flex justify-between font-semibold text-md font-500 leading-xl">
            <span>Total Amount</span>
            <span>
              {" "}
              {currencySymbols?.[currency]
                ? currencySymbols?.[currency]
                : "₹"}{" "}
              {finalTotal.toLocaleString("en-IN")}
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
  return (
    <button
      className="ttw-btn-secondary-fill w-full !bg-[#f8e000] !text-black border-black"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          {/* <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-text-white mr-2"></div> */}
          Processing...
        </div>
      ) : paymentType === "lockin" ? (
        `Proceed to Pay`
      ) : (
        `Proceed to Pay`
      )}

      {/* ) : paymentType === "lockin" ? (
        `Proceed to Pay₹${getIndianPrice(Math.round(Math.round(amount)))} Now`
      ) : (
        `Procced to pay ₹${getIndianPrice(Math.round(Math.round(amount)))} Now`
      )} */}
    </button>
  );
};

const ItineraryInclusions = ({
  Cart,
  selectedInclusions,
  onToggleInclusion,
  arePricesHidden,
  updatingInclusions = {},
  defaultExpanded = false,
  arePricesExpired = false,
}) => {
  const [expandedCategories, setExpandedCategories] = useState({
    Stays: true,
    Transfers: true,
    Flights: true,
    Activities: true,
  });
  const { currency } = useSelector((state) => state.currency);

  const categorizeBookings = () => {
    const categories = {
      Flights: [],
      Stays: [],
      "Activities & Ancillaries": [],
      Transfers: [],
    };

    if (!Cart?.summary) return categories;

    const orderedCategories = [
      { key: "Flights", ui: "Flights", type: "Flight" },
      { key: "Stays", ui: "Stays", type: "Accommodation" },
      { key: "Activities", ui: "Activities & Ancillaries", type: "Activity" },
      { key: "Ancillaries", ui: "Activities & Ancillaries", type: "Ancillary" },
      { key: "Transfers", ui: "Transfers", type: "Transfer" },
    ];

    orderedCategories.forEach(({ key, ui, type }) => {
      const data = Cart.summary[key];
      if (!data?.bookings?.length) return;

      const bookings = data.bookings.map((booking) => ({
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
        booking_type: type,
      }));

      // For Activities & Ancillaries, append bookings instead of replacing
      if (ui === "Activities & Ancillaries") {
        categories[ui] = [...(categories[ui] || []), ...bookings];
      } else {
        categories[ui] = bookings;
      }
    });

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

  const colors = ["#FD6D6C", "#F7E700", "#AD5BE7", "#5BD5E7", "#2AB0FC"];

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
          0,
        );
        const selectedCount = bookings.filter(
          (b) => selectedInclusions[b.id],
        ).length;

        return (
          <div
            key={category}
            className="mb-3 rounded-lg overflow-hidden shadow-[0_4px_34px_1px_rgba(195,195,195,0.25)]"
          >
            {/* Category Header */}
            <div
              className={`flex items-center justify-between p-3 bg-gray-50 cursor-pointer bg-text-white transition-colors ${
                !expandedCategories[category] ? "border-l-xl" : ""
              } `}
              style={{ borderColor: colors[index] }}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center gap-2 flex-1 ">
                {/* <span className="text-lg">{getCategoryIcon(category)}</span> */}
                <div
                  className={`flex-1 ${
                    expandedCategories[category] ? "border-l-xl" : ""
                  }  ml-[-16px] pl-md`}
                  style={{ borderColor: colors[index] }}
                >
                  <div className="text-md leading-xl font-500">{category}</div>
                  <div className="text-sm font-400 leading-md text-text-spacegrey">
                    {selectedCount} of {bookings.length} selected
                  </div>
                </div>
              </div>

              {categoryTotal > 0 && (
                <>
                  {!arePricesHidden && (
                    <div className="text-md leading-xl font-500 border-r-sm border-text-disabled pr-md mr-sm">
                      {currencySymbols?.[currency]
                        ? currencySymbols?.[currency]
                        : "₹"}{" "}
                      {getIndianPrice(Math.round(categoryTotal))}
                    </div>
                  )}
                </>
              )}

              <RiArrowDropDownLine
                className={`text-2xl transition-transform ${
                  expandedCategories[category] ? "rotate-180" : ""
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
                      !selectedInclusions[booking.id] ? "" : ""
                    }`}
                  >
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
                          <span className="text-sm font-400 leading-md text-text-spacegrey">
                            {formatDate(booking.detail.check_in)}{" "}
                            {category == "Stays"
                              ? "- " + formatDate(booking.detail.check_out)
                              : null}
                          </span>
                        </div>

                        {booking.detail.duration && (
                          <>
                            <div className="border-r-sm border-text-spacegrey h-[12px]"></div>
                            <span className="text-sm font-400 leading-md text-text-spacegrey">
                              {booking.detail.duration}N
                            </span>
                          </>
                        )}

                        {booking.detail.pax && (
                          <>
                            <div className="border-r-sm border-text-spacegrey h-[12px]"></div>
                            <div className="flex items-center gap-1 ">
                              {/* <span>•</span> */}
                              {/* <BsPeopleFill className="flex-shrink-0" /> */}
                              <span className="text-sm font-400 leading-md text-text-spacegrey">
                                {booking.detail.pax.number_of_adults +
                                  (booking.detail?.pax?.number_of_children ||
                                    0) +
                                  (booking.detail?.pax?.number_of_infants ||
                                    0) >
                                1
                                  ? booking.detail.pax.number_of_adults +
                                    (booking.detail?.pax?.number_of_children ||
                                      0) +
                                    (booking.detail?.pax?.number_of_infants ||
                                      0) +
                                    " Travelers"
                                  : booking.detail.pax.number_of_adults +
                                    (booking.detail?.pax?.number_of_children ||
                                      0) +
                                    (booking.detail?.pax?.number_of_infants ||
                                      0) +
                                    " Traveler"}{" "}
                              </span>
                            </div>
                          </>
                        )}

                        {/* Show individual booking cost */}
                        {/* {
                          !arePricesHidden &&
                          booking.booking_cost > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-500 leading-md">
                                {currencySymbols?.[currency] ? currencySymbols?.[currency] : '₹'}
                                {getIndianPrice(
                                  Math.round(booking.booking_cost)
                                )}
                              </span>
                            </div>
                          )
                        } */}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="pt-0.5">
                      {updatingInclusions[booking.id] ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                        </div>
                      ) : arePricesExpired ? (
                        <div className="relative group cursor-pointer">
                          <span className="relative mr-xl pointer-events-none">
                            <label className="ttw-custom-greenCheckbox-label opacity-60">
                              <input
                                type="checkbox"
                                checked={selectedInclusions[booking.id]}
                                disabled
                                className="ttw-custom-greenCheckbox"
                              />
                            </label>
                          </span>

                          {/* Tooltip */}
                          <div
                            className="absolute z-[999] bottom-full -left-20 -translate-x-1/2 mb-2
                       hidden group-hover:!block whitespace-nowrap overflow-visible
                      bg-black text-white text-xs px-2 py-1 rounded cursor-pointer"
                          >
                            Reprice itinerary to add/remove this booking
                          </div>
                        </div>
                      ) : (
                        <span className="relative mr-xl">
                          <label className="cursor-pointer ttw-custom-greenCheckbox-label">
                            <input
                              type="checkbox"
                              checked={selectedInclusions[booking.id]}
                              onChange={() => onToggleInclusion(booking.id)}
                              disabled={booking.status === "Paid"}
                              className="accent-primary-yellow cursor-pointer
                     disabled:cursor-not-allowed disabled:opacity-50
                     ttw-custom-greenCheckbox"
                            />
                          </label>
                        </span>
                      )}
                    </div>

                    {/* Price - Desktop only */}
                    {!arePricesHidden && booking.booking_cost > 0 && (
                      <div className="hidden md:block font-semibold text-sm whitespace-nowrap">
                        {currencySymbols?.[currency]
                          ? currencySymbols?.[currency]
                          : "₹"}
                        {getIndianPrice(Math.round(booking.booking_cost))}
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
  const { currency } = useSelector((state) => state.currency);
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
    Cart?.coupon_usage ? Cart?.coupon?.code : null,
  );
  const [couponSavedAmount, setCouponSavedAmount] = useState(
    Cart?.coupon_usage?.discount || 0,
  );
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);
  const [couponUsageData, setCouponUsageData] = useState(
    Cart?.coupon_usage || null,
  );
  const [sessionPaymentCompleted, setSessionPaymentCompleted] = useState(false);
  const passengersDetail = useSelector((state) => state.Passengers);
  const [selectedInclusions, setSelectedInclusions] = useState({});
  const [inclusionsExpanded, setInclusionsExpanded] = useState(
    Cart?.sales?.some((sale) => sale.status === "Completed") &&
      Cart?.total_payable_amount !== 0,
  );
  const [updatingInclusions, setUpdatingInclusions] = useState({});
  // const { resetSession } = useChatContext();

  const {
    currentGateway,
    setCurrentGateway,
    gatewayLoadError,
    paymentLoading: gatewayLoading,
    isInitialized,
    initiatePayment,
    setPaymentLoading: setGatewayPaymentLoading,
  } = usePaymentGateway(props);

  const handlePaymentSuccess = useCallback(
    (data, paymentType) => {
      if (paymentType === "full_payment") {
        setSessionPaymentCompleted(true);
        setPaymentCompleted(true);
        trackPaymentBookingConfirmed(router?.query?.id, Cart);
      } else if (paymentType === "lock_payment") {
        setLockInCompleted(true);
        setSelectedPaymentOption("full");
      }

      // Refresh payment data
      props.getPaymentHandler?.();
    },
    [router?.query?.id, Cart, props],
  );

  useEffect(() => {
    setPaymentLoading(gatewayLoading);
  }, [gatewayLoading]);

  const {
    trackWhatsAppClicked,
    trackPaymentSelected,
    trackPaymentDeselected,
    trackPaymentAttempted,
    trackPaymentBookingConfirmed,
  } = useAnalytics();

  useEffect(() => {
    if (props?.openPaymentDrawer && isDirectlyOpenPaymentDrawer) {
      handleProceedToPayment();
    }
  }, [props?.openPaymentDrawer]);

  const handlePaymentError = useCallback(
    (error) => {
      console.error("Payment error:", error);
      props.getPaymentHandler?.();
    },
    [props],
  );

  const handlePaymentCancel = useCallback(() => {
    console.log("Payment cancelled by user");
  }, []);

  // Full payment handler
  const handleFullPayment = useCallback(async () => {
    if (!isInitialized) {
      dispatch(
        openNotification({
          text: "Payment system is still initializing. Please wait...",
          heading: "Please Wait",
          type: "info",
        }),
      );
      return;
    }

    trackPaymentAttempted(router.query.id, Cart);

    await initiatePayment("full_payment", Cart, {
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError,
      onCancel: handlePaymentCancel,
    });
  }, [
    isInitialized,
    initiatePayment,
    Cart,
    router.query.id,
    dispatch,
    handlePaymentSuccess,
    handlePaymentError,
    handlePaymentCancel,
  ]);

  // Lock-in payment handler
  const handleLockInPayment = useCallback(async () => {
    if (!isInitialized) {
      dispatch(
        openNotification({
          text: "Payment system is still initializing. Please wait...",
          heading: "Please Wait",
          type: "info",
        }),
      );
      return;
    }

    await initiatePayment("lock_payment", Cart, {
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError,
      onCancel: handlePaymentCancel,
    });
  }, [
    isInitialized,
    initiatePayment,
    Cart,
    dispatch,
    handlePaymentSuccess,
    handlePaymentError,
    handlePaymentCancel,
  ]);

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
    getCurrentDateIfOlder(props?.itinerary?.start_date),
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
              (booking) => booking.id === bookingId,
            );
            if (found) {
              clickedBooking = found;
              bookingType =
                category === "Hotels" || category === "Stays"
                  ? "accommodation"
                  : category === "Flights"
                    ? "flight"
                    : category === "Transfers"
                      ? "transfer"
                      : category === "Ancillaries"
                        ? "ancillary"
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
        },
      );

      if (response.data) {
        dispatch(setCart(response.data));

        if (newSelections[bookingId]) {
          trackPaymentSelected(
            router?.query?.id,
            bookingType?.toLowerCase(),
            bookingId,
          );
        } else {
          trackPaymentDeselected(
            router?.query?.id,
            bookingType?.toLowerCase(),
            bookingId,
          );
        }

        dispatch(
          openNotification({
            text: "Cart updated successfully",
            heading: "Success",
            type: "success",
          }),
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
        }),
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
      { scroll: false },
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
        setItineraryStatus("pricing_status", status?.PRICING || "PENDING"),
      );
      dispatch(
        setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING"),
      );
      dispatch(
        setItineraryStatus("hotels_status", status?.HOTELS || "PENDING"),
      );
      dispatch(
        setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING"),
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
        },
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
          }),
        );
        // Refresh payment data
        if (props?.fetchData) await props.fetchData(true);

        // if (resetSession) {
        //   await resetSession();
        // }
        dispatch(resetChatSession());
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
        }),
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
        },
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
          }),
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
        }),
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
        },
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
        }),
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
      key: "rzp_live_t1AzJZflHj0jWg",
      amount: data.amount * 100 || data?.discounted_cost * 100,
      name: "The Tarzan Way Payment Portal",
      description: "Payment for your itinerary",
      image:
        "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
      order_id: data?.sales[0]?.orders[0]?.order_id,
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        },
      },
      handler: function (response) {
        _handlePaymentVerification(response, "Razorpay", paymentType);
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
    } catch (error) {
      console.error("Razorpay error:", error);
      _tryAlternativeGateway(data, paymentType);
    }
  };

  // New Revolut handler
  const _startRevolutHandler = async (data, paymentType) => {
    console.log("OORDERR", data);
    try {
      const orderData = {
        revolut_token: data?.sales[0]?.orders[0]?.revolut_token,
        public_id: data?.sales[0]?.orders[0]?.public_id,
        customer_email: props.email,
      };

      await revolutPaymentHandler.openPaymentModal(orderData, {
        onSuccess: (response) => {
          _handlePaymentVerification(response, "Revolut", paymentType);
        },
        onError: (error) => {
          console.error("Revolut payment error:", error);
          setPaymentLoading(false);
          _tryAlternativeGateway(data, paymentType);
        },
        onCancel: () => {
          setPaymentLoading(false);
          dispatch(
            openNotification({
              text: "Payment was cancelled",
              heading: "Payment Cancelled",
              type: "warning",
            }),
          );
        },
      });
    } catch (error) {
      console.error("Error starting Revolut payment:", error);
      _tryAlternativeGateway(data, paymentType);
    }
  };

  // Gateway router - decides which payment handler to use
  const _startPaymentHandler = (data, paymentType) => {
    if (!currentGateway) {
      dispatch(
        openNotification({
          text: "Payment gateway not initialized. Please refresh the page.",
          heading: "Error!",
          type: "error",
        }),
      );
      setPaymentLoading(false);
      return;
    }

    if (currentGateway === "Razorpay") {
      _startRazorpayHandler(data, paymentType);
    } else if (currentGateway === "Revolut") {
      _startRevolutHandler(data, paymentType);
    }
  };

  // Try alternative gateway if current one fails
  const _tryAlternativeGateway = async (data, paymentType) => {
    const availableGateways = paymentGatewayService.availableGateways;
    const currentIndex = availableGateways.indexOf(currentGateway);
    const nextGateway =
      availableGateways[(currentIndex + 1) % availableGateways.length];

    if (nextGateway === currentGateway) {
      dispatch(
        openNotification({
          text: "All payment gateways failed. Please try again later.",
          heading: "Error!",
          type: "error",
        }),
      );
      setPaymentLoading(false);
      return;
    }

    try {
      dispatch(
        openNotification({
          text: `Switching to alternative payment method...`,
          heading: "Please Wait",
          type: "info",
        }),
      );

      await paymentGatewayService.loadGatewayScript(nextGateway);

      if (nextGateway === "Revolut") {
        await revolutPaymentHandler.initialize(process.env.REVOLUT_PUBLIC_KEY);
      }

      setCurrentGateway(nextGateway);

      // Retry payment with new gateway
      if (nextGateway === "Razorpay") {
        _startRazorpayHandler(data, paymentType);
      } else if (nextGateway === "Revolut") {
        _startRevolutHandler(data, paymentType);
      }
    } catch (error) {
      console.error("Failed to switch gateway:", error);
      dispatch(
        openNotification({
          text: "Failed to initialize alternative payment method.",
          heading: "Error!",
          type: "error",
        }),
      );
      setPaymentLoading(false);
    }
  };

  const _handlePaymentVerification = async (response, gateway, paymentType) => {
    setPaymentLoading(true);

    try {
      const verifyPayload = paymentGatewayService.prepareVerifyPayload(
        response,
        gateway,
      );

      const res = await axios.post(
        "https://dev.mercury.tarzanway.com/payment/verify/",
        verifyPayload,
        { headers: { Authorization: `Bearer ${props.token}` } },
      );

      setPaymentLoading(false);

      // Set session completion based on payment type
      if (paymentType === "full") {
        setSessionPaymentCompleted(true);
        setPaymentCompleted(true);
        trackPaymentBookingConfirmed(router?.query?.id, Cart);
      } else {
        setLockInCompleted(true);
        setSelectedPaymentOption("full");
      }

      dispatch(
        openNotification({
          text: "Payment successful!",
          heading: "Success",
          type: "success",
        }),
      );

      props.getPaymentHandler();
    } catch (err) {
      setPaymentLoading(false);
      console.error("Payment verification error:", err);

      dispatch(
        openNotification({
          text: err?.response?.data?.message || "Payment verification failed",
          heading: "Error!",
          type: "error",
        }),
      );
    }
  };

  // Updated full payment handler
  const _fullPaymentHandler = async (id) => {
    setPaymentLoading(true);

    try {
      const payload = paymentGatewayService.prepareInitiatePayload(
        { id: Cart?.id, type: "full_payment" },
        currentGateway,
      );

      const response = await paymentInitiate.post("", payload, {
        headers: { Authorization: `Bearer ${props.token}` },
      });

      if (response.data) {
        dispatch(setCart(response.data));
        props.fetchData(true);

        const fullPaymentSale = response.data?.sales?.find(
          (sale) =>
            sale.payment_type === "full_payment" && sale.status === "Created",
        );

        trackPaymentAttempted(router.query.id, Cart);

        if (!fullPaymentSale || !fullPaymentSale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(
            openNotification({
              text: "Payment order not found. Please refresh and try again.",
              heading: "Error!",
              type: "error",
            }),
          );
          return;
        }

        const paymentData = {
          amount: calculateFilteredTotal() + Cart?.surcharges_and_taxes,
          sales: [fullPaymentSale],
          discounted_cost: calculateFilteredTotal(),
        };

        _startPaymentHandler(paymentData, "full");
      }
    } catch (error) {
      console.error("Error initiating full payment:", error);
      props.getPaymentHandler();

      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        "Something went wrong";

      dispatch(
        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        }),
      );
      setPaymentLoading(false);
    }
  };

  // Updated lock-in payment handler
  const _lockInPaymentHandler = async (id) => {
    setPaymentLoading(true);

    try {
      const payload = paymentGatewayService.prepareInitiatePayload(
        { id: Cart?.id, type: "lock_payment" },
        currentGateway,
      );

      const response = await paymentInitiate.post("", payload, {
        headers: { Authorization: `Bearer ${props.token}` },
      });

      if (response.data) {
        dispatch(setCart(response.data));
        props.fetchData(true);

        const lockPaymentSale = response.data?.sales?.find(
          (sale) =>
            sale.payment_type === "lock_payment" && sale.status === "Created",
        );

        if (!lockPaymentSale || !lockPaymentSale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(
            openNotification({
              text: "Payment order not found. Please refresh and try again.",
              heading: "Error!",
              type: "error",
            }),
          );
          return;
        }

        const paymentData = {
          amount: lockPaymentSale.remaining_amount,
          sales: [lockPaymentSale],
        };

        _startPaymentHandler(paymentData, "lockin");
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
        }),
      );
      setPaymentLoading(false);
    }
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

  const handlePayNow = useCallback(
    (type) => {
      if (type === "full") {
        handleFullPayment();
      } else if (type === "lockin") {
        handleLockInPayment();
      } else {
        setShowVerification(true);
      }
    },
    [handleFullPayment, handleLockInPayment],
  );

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
      "_blank",
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
      { scroll: false },
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
      sale.payment_type === "full_payment" && sale.status === "Completed",
  );

  const hasPlanExpired =
    !Cart?.price_valid_until ||
    new Date(Cart.price_valid_until.replace(" ", "T")).getTime() <= Date.now();

  const tripCondition = [
    {
      icon: "/assets/trip-condition/trip-condition-1.svg",
      title: "All Taxes & Fees Included",
      subheading:
        "What you see is what you pay. No last-minute taxes, service fees, or surprises at checkout.",
    },
    {
      icon: "/assets/trip-condition/trip-condition-2.svg",
      title: "Transparent Inclusions",
      subheading:
        "A clear breakdown of stays, transfers, experiences, and support — shared before confirmation.",
    },
    {
      icon: "/assets/trip-condition/trip-condition-3.svg",
      title: "Secure Payments",
      subheading:
        "Safe, encrypted payment gateways with flexible payment options where applicable.",
    },
    {
      icon: "/info.svg",
      title: "On-Ground & Remote Support",
      subheading:
        "Local assistance during your trip plus WhatsApp support from our team whenever you need it.",
    },
  ];

  useEffect(() => {
    if (Cart?.sales?.length > 0 && Cart?.sales[0]?.orders?.length > 0) {
      console.log(Cart?.sales[0]?.orders[0].status);
    }
  }, [Cart]);

  return (
    <>
      {/* Payment Drawer - shows full pricing + detailed payment when proceeding */}

      {showPaymentDrawer && (
        <Drawer
          show={showPaymentDrawer}
          anchor={"right"}
          backdrop
          width={"100%"}
          mobileWidth={"100%"}
          style={{ zIndex: 1600 }}
          className={`!bg-primary-cornsilk ${
            showCouponModal ? "overflow-hidden" : ""
          }`}
          onHide={() => handleCloseDrawer()}
        >
          <NavigationMenu />
          <div className="container mt-xl">
            <div className="row">
              <div className="col-12 col-sm-12 col-lg-12 col-md-12 mb-sm">
                <div className="flex items-center w-100 justify-between">
                  <div
                    className="font-400 leading-xl-md flex items-center gap-1 cursor-pointer"
                    onClick={() => handleCloseDrawer()}
                  >
                    <MdArrowBackIosNew /> Back to Itinerary
                  </div>
                  <div>
                    <IoMdClose
                      className="cursor-pointer"
                      onClick={() => handleCloseDrawer()}
                      size={18}
                    ></IoMdClose>
                  </div>
                </div>
              </div>
            </div>

            {/* Updated row with proper overflow handling */}
            <div className="row py-md bg-text-white">
              {/* Left column - Scrollable content */}
              <div
                className="col-md-8 border-r-sm border-text-disabled overflow-y-auto max-h-[calc(100vh-210px)] pr-md"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div>
                  {/* Payment Status Messages */}
                  {Cart?.sales?.length > 0 &&
                    Cart?.sales[Cart?.sales?.length - 1]?.orders?.length > 0 &&
                    Cart?.sales[Cart?.sales?.length - 1]?.orders[
                      Cart?.sales[Cart?.sales?.length - 1]?.orders.length - 1
                    ].status === "Failed" && (
                      <div>
                        <PaymentFailed
                          loading={paymentLoading}
                          onClickButton={() => handlePayNow("full")}
                        />
                      </div>
                    )}

                  {/* {Cart?.sales?.length > 0 && isItineraryInFuture() && 
                    Cart?.sales[Cart?.sales?.length - 1]?.orders?.length > 0 &&
                    Cart?.sales[Cart?.sales?.length - 1]?.orders[
                      Cart?.sales[Cart?.sales?.length - 1]?.orders.length - 1
                    ].status === "Created" && (
                      <div>
                        <PaymentCreated
                          loading={paymentLoading}
                          onClickButton={() => handlePayNow("full")}
                        />
                      </div>
                 )} */}

                  {/* Rest of your conditional content */}
                  {Cart?.total_payable_amount == 0 &&
                  areAllInclusionsPaid() &&
                  Cart?.discounted_cost > 0 ? (
                    <PaymentSuccess
                      amount={getIndianPrice(Math.round(Cart?.discounted_cost))}
                      onDownloadInvoice={() => {}}
                    />
                  ) : !isItineraryInFuture() && !areAnyInclusionsPaid() ? (
                    // Update dates section
                    <div>
                      <div className="bg-white rounded-lg">
                        <div className="mb-2">
                          <div className="mb-lg">
                            <FcCalendar size={36} />
                          </div>
                          <div className="flex justify-between max-ph:flex-col">
                            <div>
                              <h2 className="text-lg font-500 leading-xl">
                                Update Itinerary Dates
                              </h2>
                              <p className="text-md font-400 leading-xl text-text-spacegrey mb-zero max-ph:mb-md">
                                Your itinerary dates are in the past. Please
                                update the dates to view current pricing and
                                continue with booking.
                              </p>
                            </div>

                            <div className="bg-[#07213A] px-6 py-2 rounded-lg h-fit items-center">
                              <UpdateItineraryDates
                                itinerary={props?.itinerary}
                                token={props?.token}
                                onUpdateSuccess={props.fetchData}
                                resetRef={props?.resetRef}
                                convertDFormat={convertDFormat}
                                showPhoneView={true}
                                handleCloseDrawer={handleCloseDrawer}
                                cartValue={true}
                              />
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                  ) : !isItineraryInFuture() && areAnyInclusionsPaid() ? (
                    <GetInTouchContainer>
                      <div>
                        <div className="bg-white rounded-lg">
                          <div className="mb-2">
                            <div className="mb-lg">
                              <TbClockExclamation size={34} color="red" />
                            </div>
                            <div className="flex justify-between max-ph:flex-col">
                              <div>
                                <h2 className="text-lg font-500 leading-xl">
                                  Itinerary Prices Expired.
                                </h2>
                                <p className="text-md font-400 leading-xl text-text-spacegrey mb-zero max-ph:mb-md">
                                  Your itinerary prices have expired. Click on
                                  reprice itinerary to get the latest prices.
                                </p>
                              </div>

                              <Button
                                color="#fff"
                                fontWeight="500"
                                fontSize="16px"
                                borderWidth="1px"
                                borderRadius="6px"
                                bgColor="#07213A"
                                padding="6px 30px"
                                onclick={handleRepriceBookings}
                                disabled={repriceLoading}
                              >
                                {repriceLoading ? (
                                  <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2 text-white font-normal"></div>
                                    Repricing...
                                  </div>
                                ) : (
                                  "Reprice Itinerary"
                                )}
                              </Button>
                            </div>
                          </div>
                          <hr />
                        </div>
                      </div>
                      {/* <Button
                        color="white"
                        fontWeight="500"
                        fontSize="1rem"
                        borderWidth="1px"
                        width="100%"
                        borderRadius="8px"
                        bgColor="#07213A"
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
                            url={"media/icons/login/customer-service.png"}
                          />
                          {props?.loading ? (
                            <PulseLoader />
                          ) : (
                            <span>Get in touch!</span>
                          )}
                        </div>
                      </Button> */}
                    </GetInTouchContainer>
                  ) : hasPlanExpired &&
                    isItineraryInFuture() &&
                    pricing_status == "SUCCESS" ? (
                    // Refresh prices section
                    <div>
                      <div className="bg-white rounded-lg">
                        <div className="mb-2">
                          <div className="mb-lg">
                            <TbClockExclamation size={34} color="red" />
                          </div>
                          <div className="flex justify-between max-ph:flex-col">
                            <div>
                              <h2 className="text-lg font-500 leading-xl">
                                Itinerary Prices Expired.
                              </h2>
                              <p className="text-md font-400 leading-xl text-text-spacegrey mb-zero max-ph:mb-md">
                                Your itinerary prices have expired. Click on
                                reprice itinerary to get the latest prices.
                              </p>
                            </div>

                            <Button
                              color="#fff"
                              fontWeight="500"
                              fontSize="16px"
                              borderWidth="1px"
                              borderRadius="6px"
                              bgColor="#07213A"
                              padding="6px 30px"
                              onclick={handleRepriceBookings}
                              disabled={repriceLoading}
                            >
                              {repriceLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2 text-white font-normal"></div>
                                  Repricing...
                                </div>
                              ) : (
                                "Reprice Itinerary"
                              )}
                            </Button>
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-md font-500 leading-lg mb-xs">
                        {Itinerary?.customer_name || ""}
                      </div>

                      <div className="flex flex-row gap-xs text-sm font-400 leading-md flex-wrap">
                        <div>
                          Dates:{" "}
                          {convertDFormat(
                            props?.itinerary?.start_date
                              ? props?.itinerary?.start_date
                              : null,
                          )}{" "}
                          -{" "}
                          {convertDFormat(
                            props?.itinerary?.end_date
                              ? props?.itinerary?.end_date
                              : null,
                          )}
                        </div>
                        <div className="border-r-sm border-text-disabled"></div>
                        <div>Trip: {props.trip_name}</div>
                        <div className="border-r-sm border-text-disabled"></div>
                        <div>
                          Travellers: {pax} {pluralDetector("Adult", pax)}
                          {props.itinerary?.number_of_children ? (
                            <span>
                              , {props.itinerary?.number_of_children} Children
                            </span>
                          ) : null}
                          {props.itinerary?.number_of_infants ? (
                            <span>
                              , {props.itinerary?.number_of_infants}{" "}
                              {pluralDetector(
                                "Infant",
                                props.itinerary?.number_of_infants,
                              )}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="text-text-placeholder" />

                  {/* Itinerary Inclusions */}
                  <div>
                    <ItineraryInclusions
                      Cart={Cart}
                      selectedInclusions={selectedInclusions}
                      onToggleInclusion={handleToggleInclusion}
                      arePricesHidden={Cart?.are_prices_hidden}
                      updatingInclusions={updatingInclusions}
                      defaultExpanded={
                        Cart?.sales?.some(
                          (sale) => sale.status === "Completed",
                        ) && Cart?.total_payable_amount !== 0
                      }
                      arePricesExpired={
                        (!isItineraryInFuture() && areAnyInclusionsPaid()) ||
                        (hasPlanExpired && isItineraryInFuture()) ||
                        !isItineraryInFuture()
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right column - Fixed/Sticky pricing section */}
              <div className="col-md-4">
                <div
                  className="md:sticky md:top-4 md:max-h-[calc(100vh-120px)] md:overflow-y-auto"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {pricing_status === "PENDING" || props?.loadpricing ? (
                    <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
                      <PricingSkeleton />
                    </div>
                  ) : (
                    <div>
                      {!(
                        final_status == "Paid" || final_status == "Released"
                      ) && (
                        <LivePriceTimer
                          priceValidUntil={Cart?.price_valid_until}
                        />
                      )}
                    </div>
                  )}

                  <div className="mt-md">
                    {/* Coupon Section */}
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
                          payment={couponUsageData}
                        />
                      )}

                    {/* Price Details */}

                    <PriceDetails
                      itineraryCost={getIndianPrice(
                        Math.round(
                          Cart?.taxation_policy == "TCS"
                            ? Cart?.total_itinerary_cost
                            : Cart?.total_cost,
                        ),
                      )}
                      lockInCost={0}
                      couponDiscount={appliedCoupon ? -couponSavedAmount : 0}
                      surchargesTaxes={
                        Math.round(Cart?.surcharges_and_taxes) || 0
                      }
                      totalPayable={getIndianPrice(
                        Math.round(calculateFilteredTotal()),
                      )}
                      selectedPaymentOption={selectedPaymentOption}
                      selectedInclusions={selectedInclusions}
                      totalBookingsCost={Cart?.total_bookings_cost}
                    />

                    {/* Payment Status Message */}
                    {hasFullPaymentCompleted && (
                      <div className="text-sm mt-2 mb-4">
                        <span>
                          <LuClock4
                            color="green"
                            className="inline align-middle mr-1 font-semibold"
                          />
                          {`You have paid ${currencySymbols?.[currency] ? currencySymbols?.[currency] : "₹"}${Math.round(
                            Cart?.amount_paid,
                          )} for your itinerary. ${
                            Cart.total_payable_amount != 0
                              ? "Please pay the remaining balance at least 7 days before your trip starts to confirm your booking."
                              : ""
                          }`}
                        </span>
                      </div>
                    )}

                    {/* Payment Buttons */}
                    {hasPlanExpired &&
                    isItineraryInFuture() &&
                    pricing_status == "SUCCESS" ? (
                      <></>
                    ) : calculateFilteredTotal() === 0 ? (
                      <>
                        <GetInTouchContainer>
                          <Button
                            color="white"
                            fontWeight="500"
                            fontSize="1rem"
                            borderWidth="1px"
                            width="100%"
                            borderRadius="8px"
                            bgColor="#07213A"
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
                                url={"media/icons/login/customer-service.png"}
                              />
                              {props?.loading ? (
                                <PulseLoader color="white" />
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

                    {/* WhatsApp Button */}
                    {/* Help Section */}
                    {
                      <>
                        <hr className="text-text-placeholder" />
                        <div>
                          <div className="flex gap-2 items-center">
                            <img src={"/info.svg"} />
                            <div className="text-md font-500 leading-xl">
                              Need help with your trip?
                            </div>
                          </div>
                          <div className="text-sm-md font-400 leading-xl text-text-spacegrey mb-2">
                            Connect with a travel expert on WhatsApp
                          </div>

                          <Button
                            color="#000000"
                            fontWeight="500"
                            fontSize="1rem"
                            borderWidth="1px"
                            width="60%"
                            borderRadius="8px"
                            bgColor="#ffffff"
                            padding="6px"
                            onclick={handleWhatsappChat}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              {props?.loading ? (
                                <PulseLoader color="white" />
                              ) : (
                                <div className="flex flex-row justify-center items-center">
                                  <RiWhatsappFill className="text-[#4da750] mr-2 text-xl" />
                                  <div className="font-normal">
                                    Chat on WhatsApp
                                  </div>
                                </div>
                              )}
                            </div>
                          </Button>
                        </div>
                      </>
                    }

                    {/* Trip Conditions */}
                    <div className="bg-primary-lightPurple p-sm mt-xl">
                      <div className="text-sm font-500 leading-xl mb-sm">
                        Your Trip Will have
                      </div>
                      <div>
                        {tripCondition.map((item, index) => (
                          <div key={index} className="flex gap-md mb-md">
                            <img
                              src={item.icon}
                              alt="icon"
                              width={20}
                              height={20}
                              className="rounded-circle w-[25px] h-[25px] flex p-[5px] bg-text-white"
                            />
                            <div>
                              <div className="text-sm font-500 leading-sm-md mb-xxs">
                                {item.title}
                              </div>
                              <div className="text-sm font-400 leading-sm-md text-text-spacegrey">
                                {item.subheading}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex flex-row justify-center items-center text-[#01202B] mt-2">
                      <Link
                        href="/terms-conditions"
                        target="_blank"
                        onClick={handleTermsConditions}
                      >
                        <div className="text-sm">Terms & Conditions</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Modal */}
          <CouponModal
            show={showCouponModal}
            onHide={() => setShowCouponModal(false)}
            onApplyCoupon={handleApplyCoupon}
            appliedCoupon={appliedCoupon ? true : false}
            setAppliedCoupon={setAppliedCoupon}
            token={props?.token}
            payment={Cart}
          />
          <TrustFactor />
        </Drawer>
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

      {props.token && Newitinerary && (
        <MakeYourPersonalised
          date={Cart?.meta_info?.start_date}
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
