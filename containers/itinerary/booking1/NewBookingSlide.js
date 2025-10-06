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
import axiossalecreateinstance, { myplansv2 } from "../../../services/sales/itinerary/SaleCreate";
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
import { applyCoupon, fetchCoupons, paymentInitiate, removeCoupon, repriceBookings } from "../../../services/sales/itinerary/Purchase";
import { LuClock4 } from "react-icons/lu";
import { openNotification } from "../../../store/actions/notification";
import setCart from "../../../store/actions/Cart";
import ReactDOM from "react-dom";
import setItinerary from "../../../store/actions/itinerary";
import { useAnalytics } from "../../../hooks/useAnalytics";

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const CouponModal = ({ show, onHide, onApplyCoupon, appliedCoupon, setAppliedCoupon, token, payment }) => {
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applyingCouponId, setApplyingCouponId] = useState(null);
  const ItineraryId = useSelector((state) => state.ItineraryId);

  const Cart = useSelector((state) => state.Cart);

  useEffect(() => {
    if (show) {
      setAvailableCoupons([]);
      fetchAvailableCoupons();
    }
  }, [show]);

  // Enhanced useEffect to prevent body scrolling and handle modal positioning
  useEffect(() => {
    if (show) {
      // Store the current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollTop}px`;
      document.body.style.left = `-${scrollLeft}px`;
      document.body.style.width = '100%';
    } else {
      // Restore the scroll position
      const scrollTop = Math.abs(parseInt(document.body.style.top || '0'));
      const scrollLeft = Math.abs(parseInt(document.body.style.left || '0'));

      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';

      // Restore scroll position
      window.scrollTo(scrollLeft, scrollTop);
    }

    // Cleanup function
    return () => {
      if (show) {
        const scrollTop = Math.abs(parseInt(document.body.style.top || '0'));
        const scrollLeft = Math.abs(parseInt(document.body.style.left || '0'));

        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';

        window.scrollTo(scrollLeft, scrollTop);
      }
    };
  }, [show]);

  // Auto-apply coupon from payment props if available
  useEffect(() => {
    if (payment?.coupon_usage && payment.coupon_usage.status === 'COUPON_APPLIED') {
      if (!appliedCoupon) {
        setAppliedCoupon(payment.coupon_usage.id);
      }
    }
  }, [payment, appliedCoupon, setAppliedCoupon]);

  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetchCoupons.get(`/?itinerary_id=${ItineraryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedCoupons = response.data.map(coupon => ({
        id: coupon.id,
        code: coupon.code,
        title: `Save ₹${coupon.discount_value}`,
        description: coupon.description,
        expiry: new Date(coupon.end_time).toLocaleDateString('en-IN'),
        type: coupon.discount_type.toLowerCase(),
        discount: coupon.discount_value,
        is_applicable: coupon.is_applicable,
        message: coupon.message,
        usage_description: coupon.usage_description,
        applicability_error: coupon.applicability_error,
      }));

      setAvailableCoupons(formattedCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
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
      console.error('Error applying coupon:', error);
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
    <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Enhanced Backdrop with proper positioning */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
        onClick={onHide}
      ></div>

      {/* Modal with enhanced centering */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col mx-auto my-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
          <h2 className="text-lg font-semibold">Apply Coupons</h2>
          <button onClick={onHide} className="text-gray-400 hover:text-gray-600">
            <IoMdClose className="text-2xl" />
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
              ) : (
                availableCoupons?.length > 0 ? availableCoupons.map((coupon, index) => (
                  <div key={index} className="border-b-2 border-gray-200 rounded-lg p-2 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-base mb-1">{coupon.code}</div>
                        <div className="text-green-600 font-medium text-sm mb-2">{coupon.title}</div>
                      </div>
                      <button
                        onClick={() => handleApplyCoupon(coupon)}
                        disabled={
                          appliedCoupon === coupon.code ||
                          appliedCoupon === coupon.id ||
                          applyingCouponId === coupon.id ||
                          (payment?.coupon_usage && payment.coupon_usage.id === coupon.id) || payment?.is_applicable
                        }
                        className={`px-3 py-1 rounded font-medium text-sm transition-colors whitespace-nowrap min-w-[60px] h-8 flex items-center justify-center ${appliedCoupon === coupon.code ||
                          appliedCoupon === coupon.id ||
                          (payment?.coupon_usage && payment.coupon_usage.id === coupon.id)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : applyingCouponId === coupon.id
                            ? 'bg-blue-400  cursor-not-allowed'
                            : 'bg-blue-500  hover:bg-blue-600'
                          }`}
                      >
                        {applyingCouponId === coupon.id ? (
                          <PulseLoader />
                        ) : (appliedCoupon === coupon.code ||
                          appliedCoupon === coupon.id ||
                          (payment?.coupon_usage && payment.coupon_usage.id === coupon.id)) ? (
                          'Applied'
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {coupon?.is_applicable ? <div>
                      <div className="text-gray-600 text-sm mb-2">{coupon.description}</div>
                      <div className="text-gray-500 text-xs">Expires on: {coupon.expiry}</div>
                    </div> : <div className="text-gray-600 text-sm mb-2">{coupon?.applicability_error}</div>}
                  </div>
                ))
                  : "No coupons available at the moment.")}
            </div>
          </div>
        </div>
      </div>
    </div>
    ,
    document.body
  );
};


const LivePriceTimer = ({ priceValidUntil, lockInAmount = 2000 }) => {
  const targetTime = priceValidUntil ? new Date(priceValidUntil.replace(" ", "T")).getTime() : null;
  const { itinerary_status, transfers_status, pricing_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const Itinerary = useSelector(state => state.Itinerary);

  const isItineraryInFuture = () => {
    const startDate = new Date(Itinerary.start_date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return startDate >= currentDate;
  };

  const Cart = useSelector(state => state.Cart);

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
        Itinerary dates have expired. Please update the dates to view updated prices.
      </div>
    );;
  }

  // if (!Cart?.lock_in_fee_paid && (!targetTime || timeLeft <= 0)) {
  //   return (
  //     <div className="bg-red-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-medium mb-3 inline-block">
  //       Prices Expired! -Lock this trip with ₹{lockInAmount?.toLocaleString('en-IN')} to refresh prices
  //     </div>
  //   );
  // }

  if ((!targetTime || timeLeft <= 0)) {
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

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  return (
    <div className="bg-red-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-medium mb-3 inline-block">
      Live prices valid for {formatTimeLeft(timeLeft)} ⏰
    </div>
  );
};
const PaymentSuccess = ({ amount, onDownloadInvoice, loading }) => {
  return (
    <div className="bg-white p-2 rounded-lg text-center">
      <div className="mb-2">
        {/* Confetti background could be added with CSS animation */}
        <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-600">
          Your full payment of ₹{amount?.toLocaleString('en-IN')} has been received. No pending balance.
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
            {loading ? (
              <PulseLoader />
            ) : (
              <span>Get in touch!</span>
            )}
          </div>
        </Button>
      </GetInTouchContainer>
    </div>
  );
};

// 2. Payment Options Component (Add before the buttons)
const PaymentOptions = ({
  totalAmount,
  firstTimeDiscount,
  lockInAmount,
  selectedOption,
  setSelectedOption,
  lockInFeePaid,
  lockInCompleted,
  paymentCompleted,
  totalPayable,
  hasPlanExpired
}) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium text-base mb-3">Payment Options</h3>

      {/* Pay Full Amount Option */}
      {!hasPlanExpired && <div
        className={`border-2 ${selectedOption === 'full' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} rounded-lg p-4 mb-3 cursor-pointer`}
        onClick={() => setSelectedOption('full')}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === 'full' ? 'border-yellow-400 bg-yellow-400' : 'border-gray-300'}`}>
              {selectedOption === 'full' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium text-base mb-1">
                {paymentCompleted ? "Pay remaining amount now" : "Pay full amount now to get discounts"}
              </div>
              <div className="text-xl font-semibold">
                ₹{getIndianPrice(
                  Math.round(
                    Math.round(totalPayable)
                  )
                )}
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
      </div>}
    </div>
  );
};

// 3. Coupon Section Component (Add after payment options)
const CouponSection = ({
  appliedCoupon,
  savedAmount,
  onRemoveCoupon,
  onApplyCoupon,
  onViewCoupons,
  isRemoving = false,
  payment
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
        is_applicable: payment?.is_applicable
      };
    }
    return {
      code: appliedCoupon,
      savings: savedAmount,
    };
  };

  const couponData = getCouponDisplayData();
  const hasCouponApplied = appliedCoupon;
  console.log("Coupon", couponData)
  return (
    <div className="mb-4">
      <h3 className="font-medium text-base mb-3">Coupons</h3>

      {hasCouponApplied ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          {/* Show message from payment if available */}

          {(couponData.usage_description) && (
            <div className=" text-green-600 mb-2 font-medium">
              {couponData.usage_description}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-green-600">{couponData?.message}</div>
              {/* <div className="text-sm text-green-600">saved ₹{couponData.savings}</div> */}
            </div>
            <button
              className={`text-sm font-medium transition-colors min-w-[60px] h-8 flex items-center justify-center rounded px-2 ${isRemoving
                ? 'text-red-400 cursor-not-allowed'
                : 'text-red-500 hover:text-red-600'
                }`}
              onClick={() => onRemoveCoupon(couponData?.code || appliedCoupon)}
              disabled={isRemoving}
            >
              {isRemoving ? <PulseLoader /> : 'Remove'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Full width button instead of input */}
          <button
            onClick={onViewCoupons}
            className="w-full px-4 py-3 border border-gray-300 cursor-pointer rounded-lg text-left text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-between"
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Apply coupon code</span>
              </div>
              <span className="text-blue underline text-sm">View Coupons</span>
            </div>
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Note: Coupons and discounts are not applicable on the itinerary lock-in fee.
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
  selectedPaymentOption
}) => {
  const Cart = useSelector((state) => state.Cart);

  const numericItineraryCost = typeof itineraryCost === 'string'
    ? parseFloat(itineraryCost.replace(/,/g, ''))
    : itineraryCost;
  const numericTotalPayable = typeof totalPayable === 'string'
    ? parseFloat(totalPayable.replace(/,/g, ''))
    : totalPayable;

  if (numericTotalPayable === 0) {
    return (
      <div className="mb-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            No inclusions selected. Please select items to see pricing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="font-medium text-base mb-3">Price Details</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Itinerary Cost</span>
          <span>₹{typeof itineraryCost === 'string' ? itineraryCost : itineraryCost.toLocaleString('en-IN')}</span>
        </div>

        {
          // !Cart?.are_prices_hidden && 
          surchargesTaxes > 0 && (
            <div className="flex justify-between">
              <span>Surcharges and Taxes</span>
              <span>₹{surchargesTaxes.toLocaleString('en-IN')}</span>
            </div>
          )}

        {couponDiscount !== 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>
              {couponDiscount ? "-₹" + Math.abs(couponDiscount).toLocaleString('en-IN') : '₹0'}
            </span>
          </div>
        )}

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Payable</span>
            <span>₹{typeof totalPayable === 'string' ? totalPayable : totalPayable.toLocaleString('en-IN')}</span>
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
  paymentType = "full"
}) => {
  return (
    <Button
      color="#111"
      fontWeight="500"
      fontSize="1rem"
      borderWidth="1px"
      width="100%"
      borderRadius="8px"
      bgColor="#f8e000"
      padding="12px"
      onclick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
          Processing...
        </div>
      ) : (
        paymentType === 'lockin'
          ? `Pay ₹${getIndianPrice(
            Math.round(
              Math.round(amount)
            )
          )} Now`
          : `Pay ₹${getIndianPrice(
            Math.round(
              Math.round(amount)
            )
          )} Now`
      )}
    </Button>
  );
};

const ItineraryInclusions = ({
  costingsBreakdown,
  selectedInclusions,
  onToggleInclusion,
  arePricesHidden
}) => {
  const [expandedCategories, setExpandedCategories] = useState({
    Stays: true,
    Transfers: true,
    Flights: true,
    Activities: true
  });

  const categorizeBookings = () => {
    const categories = {
      Stays: [],
      Transfers: [],
      Flights: [],
      Activities: []
    };

    Object.entries(costingsBreakdown || {}).forEach(([id, booking]) => {
      const type = booking.booking_type;
      let category = 'Activities';

      if (type === 'Accommodation') category = 'Stays';
      else if (type === 'Flight') category = 'Flights';
      else if (type === 'Train' || type === 'Taxi' || type === 'Bus' || type === 'Ferry') category = 'Transfers';
      else if (type === 'Activity') category = 'Activities';

      categories[category].push({ id, ...booking });
    });

    return categories;
  };

  const categories = categorizeBookings();

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return format(date, 'MMM dd');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Stays': '🏨',
      'Flights': '✈️',
      'Transfers': '🚂',
      'Activities': '🎯'
    };
    return icons[category] || '📍';
  };

  return (
    <div className="mb-4">
      <h3 className="font-medium text-base mb-3">Itinerary Inclusions</h3>

      {Object.entries(categories).map(([category, bookings]) => {
        if (bookings.length === 0) return null;

        const categoryTotal = bookings.reduce((sum, booking) =>
          selectedInclusions[booking.id] ? sum + booking.booking_cost : sum, 0
        );
        const selectedCount = bookings.filter(b => selectedInclusions[b.id]).length;

        return (
          <div key={category} className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <div
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">{getCategoryIcon(category)}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{category}</div>
                  <div className="text-xs text-gray-500">
                    {selectedCount} of {bookings.length} selected
                  </div>
                </div>
              </div>

              {categoryTotal > 0 && (
                <div className="font-semibold text-sm mr-2">
                  ₹{getIndianPrice(Math.round(categoryTotal))}
                </div>
              )}

              <RiArrowDropDownLine
                className={`text-2xl transition-transform ${expandedCategories[category] ? 'rotate-180' : ''
                  }`}
              />
            </div>

            {/* Category Items */}
            {expandedCategories[category] && (
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!selectedInclusions[booking.id] ? 'opacity-50' : ''
                      }`}
                  >
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={selectedInclusions[booking.id]}
                        onChange={() => onToggleInclusion(booking.id)}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 cursor-pointer"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1 line-clamp-2">
                        {booking.detail.name}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <BsCalendar2 className="flex-shrink-0" />
                          <span>{formatDate(booking.detail.check_in)}</span>
                        </div>

                        {booking.detail.duration && (
                          <span className="ml-1">
                            ({booking.detail.duration}N)
                          </span>
                        )}

                        {booking.detail.pax && (
                          <div className="flex items-center gap-1">
                            <span>•</span>
                            <BsPeopleFill className="flex-shrink-0" />
                            <span>{booking.detail.pax.number_of_adults} Adults</span>
                          </div>
                        )}

                        {/* Show individual booking cost */}
                        {
                          // !arePricesHidden && 
                          booking.booking_cost > 0 && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <span>•</span>
                              <span>₹{getIndianPrice(Math.round(booking.booking_cost))}</span>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Price - Desktop only */}
                    {!arePricesHidden && booking.booking_cost > 0 && (
                      <div className="hidden md:block font-semibold text-sm whitespace-nowrap">
                        ₹{getIndianPrice(Math.round(booking.booking_cost))}
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
  const { itinerary_status, transfers_status, pricing_status, final_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const Itinerary = useSelector(state => state.Itinerary);
  const Cart = useSelector((state) => state.Cart);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('full');

  const [selectedOption, setSelectedOption] = useState('full');
  const [showExpandedPayment, setShowExpandedPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lockInCompleted, setLockInCompleted] = useState(false);
  const [paymentStep, setPaymentStep] = useState('initial'); // 'initial', 'options', 'detailed'
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
  const [couponUsageData, setCouponUsageData] = useState(Cart?.coupon_usage || null);
  const [sessionPaymentCompleted, setSessionPaymentCompleted] = useState(false);
  const passengersDetail = useSelector((state) => state.Passengers);
  // Add after existing state declarations
  const [selectedInclusions, setSelectedInclusions] = useState({});
  const [inclusionsExpanded, setInclusionsExpanded] = useState(false);
  //console.log("Iti",props?.itinerary);
  const { trackWhatsAppClicked } = useAnalytics();

  useEffect(() => {
    if (Cart?.costings_breakdown) {
      const initialSelections = {};
      Object.keys(Cart.costings_breakdown).forEach(bookingId => {
        // All inclusions are selected by default
        initialSelections[bookingId] = true;
      });
      setSelectedInclusions(initialSelections);
    }
  }, [Cart?.costings_breakdown]);


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

  const handleToggleInclusion = (bookingId) => {
    setSelectedInclusions(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const calculateFilteredTotal = () => {
    if (!Cart?.costings_breakdown) return 0;

    let total = 0;
    Object.entries(Cart.costings_breakdown).forEach(([id, booking]) => {
      if (selectedInclusions[id]) {
        total += booking.booking_cost || 0;
      }
    });

    // If total is 0, return 0 early
    if (total === 0) return 0;

    // Add surcharges proportionally only if prices are not hidden
    if (
      // !Cart?.are_prices_hidden && 
      Cart?.surcharges_and_taxes) {
      // const selectedRatio = total / (Cart.total_bookings_cost || 1);
      // total += Cart.surcharges_and_taxes ;
      // * selectedRatio;
    }

    // Apply coupon if applicable
    if (couponUsageData?.discount) {
      total = Math.max(0, total - couponUsageData.discount);
    }

    return Math.round(total);
  };

  const handleCloseDrawer = () => {
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
      const response = await repriceBookings.get(`${router.query.id}/reprice/bookings`, {
        headers: { Authorization: `Bearer ${props.token}` }
      });

      if (response.data) {
        setItinerary(response.data);
        fetchItineraryStatus();
        dispatch(
          openNotification({
            text: response.data.coupon_usage?.message || "Itinerary repriced successfully",
            heading: "Success",
            type: "success",
          })
        );
        // Refresh payment data
        props.fetchData(true);
      }
    } catch (error) {
      console.error('Error Repricing :', error);
      dispatch(
        openNotification({
          text: error?.response?.data?.message || error.message || "Failed to reprice itinerary",
          heading: "Error!",
          type: "error",
        })
      );
    } finally {
      setRepriceLoading(false);
    }
  }


  const handleApplyCoupon = async (couponId, couponCode) => {
    try {
      const response = await applyCoupon.post('/', {
        payment_information_id: Cart?.id,
        coupon_id: couponId
      }, {
        headers: { Authorization: `Bearer ${props.token}` }
      });

      if (response.data.coupon_usage) {
        setAppliedCoupon(couponCode);
        setCouponUsageData(response.data.coupon_usage)
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
      console.error('Error applying coupon:', error);
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
      const response = await removeCoupon.post('/', {
        payment_information_id: Cart?.id,
        coupon_id: couponId
      }, {
        headers: { Authorization: `Bearer ${props.token}` }
      });

      if (response.data) {
        setAppliedCoupon(null);
        setCouponUsageData(null);
        dispatch(setCart(response.data));
        setCouponSavedAmount(0);
        setIsRemovingCoupon(false)
        // Refresh payment data
        props.fetchData(true);
      }
    } catch (error) {
      setIsRemovingCoupon(false)
      console.error('Error removing coupon:', error);
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

  const setBookingSummary = () => {
    try {
      if (Cart) {
        if (Cart?.costings_breakdown)
          for (const booking in Cart?.costings_breakdown) {
            if (Cart?.costings_breakdown[booking].user_selected) {
              if (
                Cart?.costings_breakdown[booking].booking_type ===
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
                    {Cart?.costings_breakdown[booking].detail[
                      "duration"
                    ] +
                      "N at " +
                      Cart?.costings_breakdown[booking].detail["name"]}
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
                      {Cart?.costings_breakdown[booking].detail[
                        "duration"
                      ] +
                        "N at " +
                        Cart?.costings_breakdown[booking].detail[
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
                            Cart?.costings_breakdown[booking][
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
                    {Cart?.costings_breakdown[booking].detail["name"]}
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
                        Cart?.costings_breakdown[booking].detail[
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
                            Cart?.costings_breakdown[booking][
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
    } catch { }
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
    "Hey TTW! I need some help with my tailored experience - https://www.thetarzanway.com" +
    getURL();

  const _startRazorpayHandler = (data, paymentType) => {
    let razorpayOptions = {
      key: "rzp_test_FEKg5ZWGWl9i7c",
      amount: data.amount * 100 || data?.discounted_cost * 100,
      name: "The Tarzan Way Payment Portal",
      description: " data.data.description",
      image: "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
      order_id: data?.sales[0]?.orders[0]?.order_id,
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        }
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
            if (paymentType === 'full') {
              setSessionPaymentCompleted(true);
              setPaymentCompleted(true);
            } else {
              setLockInCompleted(true);
              setSelectedPaymentOption('full');
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
      const response = await paymentInitiate.post('', {
        payment_information_id: Cart?.id,
        payment_type: 'full_payment'
      }, {
        headers: { Authorization: `Bearer ${props.token}` }
      });

      if (response.data) {
        dispatch(setCart(response.data));
        props.fetchData(true);

        const fullPaymentSale = response.data?.sales?.find(sale =>
          sale.payment_type === "full_payment" && sale.status === "Created"
        );

        if (!fullPaymentSale || !fullPaymentSale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(openNotification({
            text: "Payment order not found. Please refresh and try again.",
            heading: "Error!",
            type: "error",
          }));
          return;
        }

        const razorpayData = {
          amount: fullPaymentSale.remaining_amount,
          sales: [fullPaymentSale]
        };

        // Update the Razorpay handler to set session completion
        _startRazorpayHandler(razorpayData, 'full');
      }
    } catch (error) {
      console.error('Error initiating full payment:', error);
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
      const response = await paymentInitiate.post('', {
        payment_information_id: Cart?.id,
        payment_type: 'lock_payment'
      }, {
        headers: { Authorization: `Bearer ${props.token}` }
      });

      if (response.data) {
        dispatch(setCart(response.data));
        props.fetchData(true);

        const lockPaymentSale = response.data?.sales?.find(sale =>
          sale.payment_type === "lock_payment" && sale.status === "Created"
        );

        if (!lockPaymentSale || !lockPaymentSale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(openNotification({
            text: "Payment order not found. Please refresh and try again.",
            heading: "Error!",
            type: "error",
          }));
          return;
        }

        const razorpayData = {
          amount: lockPaymentSale.remaining_amount,
          sales: [lockPaymentSale]
        };

        _startRazorpayHandler(razorpayData, 'lockin');
      }
    } catch (error) {
      console.error('Error initiating lock payment:', error);
      dispatch(
        openNotification({
          text: error?.response?.data?.errors?.[0]?.detail?.[0] || "Something went wrong",
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
    } else if (label === "lockin") {
      _lockInPaymentHandler(Cart?.id); //  payment.id as payment_information_id
    } else if (label === "full") {
      _fullPaymentHandler(Cart?.id);
    } else {
      setShowVerification(true);
    }

    logEvent({
      action: "Button_Click",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: selectedPaymentOption === 'full' ? "Pay Full Amount" : "Lock-in Price",
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
    trackWhatsAppClicked(router?.query?.id, Cart?.discounted_cost, 'Rupees');
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

  const hasFullPaymentCompleted = Cart?.sales?.some(
    (sale) => sale.payment_type === 'full_payment' && sale.status === 'Completed'
  );

  const hasPlanExpired = (!Cart?.price_valid_until ||
    new Date(Cart.price_valid_until.replace(" ", "T")).getTime() <= Date.now());

  // useEffect(() => {
  //   const isItineraryInFuture = () => {
  //     if (Itinerary?.start_date) return true;
  //     const startDate = new Date(Itinerary?.start_date);
  //     const currentDate = new Date();
  //     currentDate.setHours(0, 0, 0, 0);
  //     startDate.setHours(0, 0, 0, 0);
  //     return startDate >= currentDate;
  //   };

  //   const hasPlanExpired = (!Cart?.price_valid_until ||
  //     new Date(Cart.price_valid_until.replace(" ", "T")).getTime() <= Date.now());
  //   if (isItineraryInFuture() && hasPlanExpired && !Cart?.lock_in_fee_paid && !hasFullPaymentCompleted) {
  //     setSelectedPaymentOption('lockin');
  //   } else {
  //     setSelectedPaymentOption('full');
  //   }
  // }, [Cart?.price_valid_until, Cart?.lock_in_fee_paid, hasFullPaymentCompleted, Itinerary?.start_date]);



  return (

    <>

      {pricing_status === "PENDING" || props?.loadpricing ? (
        <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
          <PricingSkeleton />
        </div>
      ) : (
        <div
          className={`${Cart?.paid_user ? "bg-[#98F0AB33]" : "bg-[#F7E70033]"
            }  -mt-[1rem] -mx-[1rem] mb-0`}
        >
          {!(final_status == "Paid" || final_status == "Released") && <LivePriceTimer priceValidUntil={Cart?.price_valid_until} />}
          <div className=" mx-[1rem] mt-[1rem]">
            <div className="flex flex-row justify-between">
              {props.iscouponApplied &&
                Cart?.discounted_cost != Cart?.total_cost &&
                Cart?.show_per_person_cost !=
                Cart?.per_person_discounted_cost ? (
                <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                  <span>₹</span>
                  <div>
                    {Cart?.show_per_person_cost ||
                      Cart?.pay_only_for_one
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
                  {Cart && <span>₹</span>}
                  {Cart && (
                    <div>
                      {Cart?.pay_only_for_one ||
                        Cart?.show_per_person_cost
                        ? getIndianPrice(
                          Math.round(
                            Math.round(
                              Cart?.per_person_discounted_cost
                            )
                          )
                        )
                        : getIndianPrice(
                          Math.round(
                            Math.round(Cart?.total_cost)
                          )
                        )}
                      {"/-"}
                    </div>
                  )}
                </div>

                {Cart?.paid_user ? (
                  <div className="font-[400] pl-2 text-base self-end">PAID</div>
                ) : (
                  <div className="font-medium text-base self-end">
                    {Cart?.pay_only_for_one ||
                      Cart?.show_per_person_cost
                      ? "Per Person Cost"
                      : Cart?.is_estimated_price
                        ? `${Cart?.total_cost == 0
                          ? ""
                          : "Estimated Price"
                        }`
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
                className={` text-2xl  mt-1 transition-all duration-100 ${acoordianceOpen ? "-rotate-180 " : "rotate-180 animate-bounce"
                  }`}
              ></RiArrowDropDownLine>
            </div>
          )}

          <div
            className={`mb-[0.8rem] mx-[1rem] Transition-Height-${acoordianceOpen ? "in" : "out"
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
                      {"₹ " +
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
                                      ? Cart?.coupon.discount_value +
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
                          {Cart?.coupon_usage?.discount ? (
                            <div>
                              (-){" "}
                              {"₹" +
                                getIndianPrice(
                                  Math.round(
                                    Cart?.coupon_usage?.discount
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
                {pluralDetector("Infant", props.itinerary?.number_of_infants)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <>
        {/* Main content - always visible */}
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
                {(pricing_status === "SUCCESS" && props.payment?.total_payable_amount === 0 && hasFullPaymentCompleted) && !showDetailedPayment ? (
                  <PaymentSuccess
                    amount={getIndianPrice(Math.round(Cart?.discounted_cost))}
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
                          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", alignItems: "center" }}>
                            <ImageLoader
                              dimensions={{ height: 50, width: 50 }}
                              dimensionsMobile={{ height: 50, width: 50 }}
                              height={"20px"}
                              width={"20px"}
                              widthmobile={"20px"}
                              leftalign
                              url={"media/icons/login/customer-service-black.png"}
                            />
                            {props?.loading ? <PulseLoader /> : <span>Get in touch!</span>}
                          </div>
                        </Button>
                      </GetInTouchContainer>
                    ) : (
                      <>
                        {(
                          pricing_status === "SUCCESS" && (
                            <div>
                              {(() => {
                                const isItineraryInPast = () => {
                                  if (!props?.itinerary?.start_date) return false;
                                  const startDate = new Date(props?.itinerary?.start_date);
                                  const currentDate = new Date();
                                  currentDate.setHours(0, 0, 0, 0);
                                  startDate.setHours(0, 0, 0, 0);
                                  return startDate < currentDate;
                                };

                                if (isItineraryInPast() || Math.round(Cart?.total_cost) === 0) {
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
                                      {!hasPlanExpired && <h3 className="font-medium text-base mb-3">Payment Options</h3>}

                                      {/* Pay Full Amount Option */}
                                      {!hasPlanExpired && (
                                        <div
                                          className={`border-2 ${selectedPaymentOption === 'full' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} rounded-lg p-3 mb-3 cursor-pointer`}
                                          onClick={() => setSelectedPaymentOption('full')}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentOption === 'full' ? 'border-yellow-400 bg-yellow-400' : 'border-gray-300'}`}>
                                              {selectedPaymentOption === 'full' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <div className="flex-1">
                                              <div className="font-medium text-base">
                                                {hasFullPaymentCompleted ? "Pay the remaining amount now to get discounts" : "Pay full amount now to get discounts"}
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
                                          'Refresh Prices'
                                        )}
                                      </Button>
                                    ) : (
                                      <PaymentButton
                                        amount={selectedPaymentOption === 'full' ? Cart?.total_payable_amount : Cart?.lock_in_fee}
                                        isLoading={paymentLoading}
                                        paymentType={'full'}
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
                                            <LuClock4 color="green" className="inline align-middle mr-1 font-semibold" />
                                            {`Your Itinerary fee of ${Math.round(Cart?.discounted_cost)} has been received. Please pay the remaining now or before 5 Sept 2025 to confirm your trip.`}
                                          </span>
                                        </div>
                                      ) : null}

                                    {selectedPaymentOption === 'full' && !hasFullPaymentCompleted && !hasPlanExpired && (
                                      <div className="text-center text-sm text-gray-600 mt-3">
                                        Apply your coupon code at checkout in next step.
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )
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

        {/* Payment Drawer - shows full pricing + detailed payment when proceeding */}
        <Drawer
          show={showPaymentDrawer}
          anchor={"right"}
          backdrop
          width={"50%"}
          mobileWidth={"100%"}
          style={{ zIndex: 1600 }}
          className={`font-lexend ${showCouponModal ? "overflow-hidden" : "overflow-y-auto"}`}
          onHide={handleCloseDrawer}
        >
          {/* Close button */}


          {/* Full pricing section in drawer */}
          {pricing_status === "PENDING" || props?.loadpricing ? (
            <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-0">
              <PricingSkeleton />
            </div>
          ) : (
            <div
              className={`${Cart?.paid_user ? "bg-[#98F0AB33]" : "bg-[#F7E70033]"
                }  mb-0`}
            >
              {!(final_status == "Paid" || final_status == "Released") && <LivePriceTimer priceValidUntil={Cart?.price_valid_until} />}
              <div className="flex justify-end -mt-[1.8rem] mr-2">
                <IoMdClose
                  className="hover:cursor-pointer text-2xl hover:text-gray-600 transition-colors"
                  onClick={handleCloseDrawer}
                />
              </div>
              <div className="p-3">
                <div className="flex flex-row justify-between">
                  {props.iscouponApplied &&
                    Cart?.discounted_cost != Cart?.total_cost &&
                    Cart?.show_per_person_cost !=
                    Cart?.per_person_discounted_cost ? (
                    <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                      <span>₹</span>
                      <div>
                        {Cart?.show_per_person_cost ||
                          Cart?.pay_only_for_one
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
                      {Cart && <span>₹</span>}
                      {Cart && (
                        <div>
                          {Cart?.pay_only_for_one ||
                            Cart?.show_per_person_cost
                            ? getIndianPrice(
                              Math.round(
                                Math.round(
                                  Cart?.total_cost
                                )
                              )
                            )
                            : getIndianPrice(
                              Math.round(
                                Math.round(Cart?.total_cost)
                              )
                            )}
                          {"/-"}
                        </div>
                      )}
                    </div>

                    {Cart?.paid_user ? (
                      <div className="font-[400] pl-2 text-base self-end">PAID</div>
                    ) : (
                      <div className="font-medium text-base self-end">
                        {Cart?.pay_only_for_one ||
                          Cart?.show_per_person_cost
                          ? "Per Person Cost"
                          : Cart?.is_estimated_price
                            ? `${Cart?.total_cost == 0
                              ? ""
                              : "Estimated Price"
                            }`
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

              {/* {Cart && (
                <div
                  className="mx-[1rem]  font-medium text-sm flex gap-0 flex-row cursor-pointer"
                  onClick={() => setAcordianOpen(!acoordianceOpen)}
                >
                  <div>
                    {acoordianceOpen ? <span>Hide</span> : <span>View</span>}{" "}
                    {!Cart?.are_prices_hidden ? "breakup" : "inclusions"}
                  </div>

                  <RiArrowDropDownLine
                    className={` text-2xl  mt-1 transition-all duration-100 ${acoordianceOpen ? "-rotate-180 " : "rotate-180 animate-bounce"
                      }`}
                  ></RiArrowDropDownLine>
                </div>
              )} */}

              <div
                className={`mb-[0.8rem] mx-[1rem] Transition-Height-${acoordianceOpen ? "in" : "out"
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
          <div className="px-4 pb-4">
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
                    {pluralDetector("Infant", props.itinerary?.number_of_infants)}
                  </div>
                ) : null}
              </div>
            </div>

            {hasFullPaymentCompleted && Cart?.total_payable_amount == 0 ? (
              <PaymentSuccess
                amount={getIndianPrice(
                  Math.round(Cart?.discounted_cost)
                )}
                onDownloadInvoice={() => {/* Add download invoice logic */ }}
              />
            ) : (
              // Detailed payment view
              <div>
                <ItineraryInclusions
                  costingsBreakdown={Cart?.costings_breakdown}
                  selectedInclusions={selectedInclusions}
                  onToggleInclusion={handleToggleInclusion}
                  arePricesHidden={Cart?.are_prices_hidden}
                />

                {!(selectedPaymentOption === 'lockin') && !hasFullPaymentCompleted && !hasPlanExpired && calculateFilteredTotal() !== 0 && <CouponSection
                  appliedCoupon={appliedCoupon}
                  savedAmount={couponSavedAmount}
                  onRemoveCoupon={handleRemoveCoupon}
                  onApplyCoupon={handleApplyCoupon}
                  onViewCoupons={() => setShowCouponModal(true)}
                  isRemoving={isRemovingCoupon}
                  payment={couponUsageData} // Pass payment data
                />}

                {!hasFullPaymentCompleted && <PriceDetails
                  itineraryCost={getIndianPrice(Math.round(calculateFilteredTotal() + (couponUsageData?.discount || 0)))}
                  lockInCost={0}
                  couponDiscount={appliedCoupon ? -couponSavedAmount : 0}
                  surchargesTaxes={Cart?.surcharges_and_taxes || 0}
                  totalPayable={getIndianPrice(Math.round(calculateFilteredTotal() + Cart?.surcharges_and_taxes))}
                  selectedPaymentOption={selectedPaymentOption}
                  selectedInclusions={selectedInclusions}
                  totalBookingsCost={Cart?.total_bookings_cost}
                />}

                {hasFullPaymentCompleted && <div className="text-sm mt-2 mb-4"><span>
                  <LuClock4 color="green" className="inline align-middle mr-1 font-semibold" />
                  {`Your Itinerary fee of ${Math.round(Cart?.discounted_cost)} has been received. Please pay the remaining now or before 5 Sept 2025 to confirm your trip.`}
                </span></div>}

                {/* {!lockInCompleted && ( */}
                {calculateFilteredTotal() === 0 ? (
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
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", alignItems: "center" }}>
                          <ImageLoader
                            dimensions={{ height: 50, width: 50 }}
                            dimensionsMobile={{ height: 50, width: 50 }}
                            height={"20px"}
                            width={"20px"}
                            widthmobile={"20px"}
                            leftalign
                            url={"media/icons/login/customer-service-black.png"}
                          />
                          {props?.loading ? <PulseLoader /> : <span>Get in touch!</span>}
                        </div>
                      </Button>
                    </GetInTouchContainer>

                    <div className="text-center text-sm text-amber-600 mt-3 p-2 bg-amber-50 rounded">
                      Please select at least one inclusion to proceed
                    </div>
                  </>
                ) : (
                  <PaymentButton
                    amount={calculateFilteredTotal() + Cart.surcharges_and_taxes}
                    isLoading={paymentLoading}
                    paymentType={'full'}
                    onClick={() => handlePayNow('full')}
                  />
                )}
                {/* )} */}

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
            )}
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

        </Drawer>

      </>

      <div className="flex flex-row justify-center items-center text-[#01202B] mt-4">
        {!isPageWide && (
          <SocialShareMobile
            social_title={props?.social_title}
            more
          />
        )}
      </div>

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
        registered_users={
          Cart ? Cart?.registered_users : null
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

