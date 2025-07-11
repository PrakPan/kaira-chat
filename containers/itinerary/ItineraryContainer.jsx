import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Menu from "./MenuV2";
import Spinner from "../../containers/loaderbar/Index";
import axiosdaybydayinstance, {
  axiosGetItinerary,
  axiosGetItineraryStatus,
} from "../../services/itinerary/daybyday/preview";
import axiosbreifinstance from "../../services/itinerary/brief/preview";
import * as authaction from "../../store/actions/auth";
import { ITINERARY_STATUSES } from "../../services/constants";
import { TRAVELER_ITINERARIES } from "../../services/constants";
import axiosPoiRoutes from "../../services/itinerary/brief/route";
import axiosbookingupdateinstance from "../../services/bookings/UpdateBookings";
import Overview from "../newitinerary/overview/Index";
import { openNotification } from "../../store/actions/notification";
import { setItineraryRoutes } from "../../store/actions/itineraryRoutes";
import setItineraryDaybyDay from "../../store/actions/itineraryDaybyDay";
import setItinerary from "../../store/actions/itinerary";
import setPlan from "../../store/actions/plan";
import { setBookings } from "../../store/actions/bookings";
import { setItineraryActivities } from "../../store/actions/itineraryActivities";
import setBreif from "../../store/actions/breif";
import axiosPaymentInstance, {
  axiosGetPaymentInfo,
} from "../../services/itinerary/payment";
import axiosBookingsInstance, {
  axiosGetAllStays,
  axiosGetTransfers,
} from "../../services/itinerary/bookings";
import { setTransfersBookings } from "../../store/actions/transferBookingsStore";
import { setStays } from "../../store/actions/StayBookings";
import setItineraryStatus from "../../store/actions/itineraryStatus";
import { toast, ToastContainer } from "react-toastify";
import SetPassengers from "../../store/actions/passengers";
import ItineraryContainerOld from "../../containers/itinerary/IndexsV2/Index";

const Container = styled.div`
  width: 90%;
  margin: 5vh auto 0 auto;
  @media screen and (min-width: 768px) {
    width: 85%;
    margin: -5vh auto 0 auto;
  }
`;

export const ItineraryStatusLoader = ({ displayText, isVisible }) => {
  if (!isVisible || !displayText) {
    return null;
  }

  return (
    <div className="">
      <div className="bg-[#fefad8] border border-yellow-200 rounded-lg px-4 py-3 shadow-lg max-w-sm">
        <div className="flex items-center gap-3">
          {/* Rotating Hourglass Timer Icon */}
          <div className="flex-shrink-0">
            <div className="w-5 h-5 animate-spin">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Hourglass outline */}
                <path 
                  d="M6 2V6.5L10.5 12L6 17.5V22H18V17.5L13.5 12L18 6.5V2H6Z" 
                  stroke="#000000" 
                  strokeWidth="1.5" 
                  fill="none"
                />
                
                {/* Top sand */}
                <path 
  d="M8 4H16V6L12 10L8 6V4Z" 
  fill="#000000"
>
  <animate 
    attributeName="opacity" 
    values="1;0.7;1" 
    dur="2s" 
    repeatCount="indefinite"
  />
</path>

                
                {/* Bottom sand */}
                <path 
                  d="M8 20H16V18L12 14L8 18V20Z" 
                  fill="#ffffff"
                  className="animate-pulse"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.3;1;0.3" 
                    dur="2s" 
                    repeatCount="indefinite"
                  />
                </path>
                
                {/* Falling sand particles */}
                <circle r="0.5" fill="#F59E0B">
                  <animate 
                    attributeName="cy" 
                    values="10;14" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="cx" 
                    values="12;12" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="1;0" 
                    dur="1s" 
                    repeatCount="indefinite"
                  />
                </circle>
                
                <circle r="0.3" fill="#F59E0B">
                  <animate 
                    attributeName="cy" 
                    values="9;13" 
                    dur="1.2s" 
                    repeatCount="indefinite"
                    begin="0.3s"
                  />
                  <animate 
                    attributeName="cx" 
                    values="11.5;11.5" 
                    dur="1.2s" 
                    repeatCount="indefinite"
                    begin="0.3s"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="1;0" 
                    dur="1.2s" 
                    repeatCount="indefinite"
                    begin="0.3s"
                  />
                </circle>
                
                <circle r="0.4" fill="#F59E0B">
                  <animate 
                    attributeName="cy" 
                    values="10.5;14.5" 
                    dur="1.1s" 
                    repeatCount="indefinite"
                    begin="0.6s"
                  />
                  <animate 
                    attributeName="cx" 
                    values="12.5;12.5" 
                    dur="1.1s" 
                    repeatCount="indefinite"
                    begin="0.6s"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="1;0" 
                    dur="1.1s" 
                    repeatCount="indefinite"
                    begin="0.6s"
                  />
                </circle>
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-black leading-tight">
              {displayText}
            </div>
            <div className="text-xs text-black mt-1">
              This might take a few seconds...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItineraryContainer = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const { itinerary_status, transfers_status, pricing_status, hotels_status } =
    useSelector((state) => state.ItineraryStatus);
  const [totalduration, setTotalduration] = useState(0);
  const [itineraryReleased, setItineraryReleased] = useState(false);
  const [itineraryDate, setItineraryDate] = useState("");
  const [booking, setBooking] = useState(null);
  const [itineraryLoading, setItineraryLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [cardUpdateLoading, setCardUpdateLoading] = useState(null);
  const [stayBookings, setStayBookings] = useState(null);
  const [transferBookings, setTransferBookings] = useState(null);
  const [activityBookings, setActivityBookings] = useState(null);
  const [flightBookings, setFlightBookings] = useState(null);
  const [selectingBooking, setSelectingBooking] = useState(null);
  const [stayFlickityIndex, setStayFlickityIndex] = useState(0);
  const [transferFlickityIndex, setTransferFlickityIndex] = useState(0);
  const [flightFlickityIndex, setFlightFlickityIndex] = useState(0);
  const [activityFlickityIndex, setActivityFlickityIndex] = useState(0);
  const [payment, setPayment] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showStayBookingModal, setShowStayBookingModal] = useState(false);
  const [isDatePresent, setIsDatePresent] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [travellerType, settravellerType] = useState(false);
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [group_type, setgroup_type] = useState(null);
  const [duration_time, setduration_time] = useState(null);
  const [hasUserPaid, setHasUserPaid] = useState(false);
  const [isPastTravelerItinerary, setIsPastTravelerItinerary] = useState(false);
  const [is_stock, setIsStock] = useState(false);
  const [editRoute, setEditRoute] = useState(false);
  const [showMercuryItinerary, setShowMercuryItinerary] = useState(false);
  const [cities, setCities] = useState([]);
  // const [cityTransferBookings, setCityTransferBookings] = useState(null);
  const [loadbookings, setLoadBookings] = useState(false);
  const [loadpricing, setLoadPricing] = useState(false);
  const cityTransferBookings = useSelector(
    (state) => state.TransferBookings
  )?.transferBookings;

  const [polling, setPolling] = useState(true);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [displayText, setDisplayText] = useState(null);
  const [oldOne,setOldOne] = useState(false);

  const itinerarySuccessRef = useRef(false);
  const pricingSuccessRef = useRef(false);
  const transfersSuccessRef = useRef(false);
  const hotelsSuccessRef = useRef(false);

  const resetRef = () => {
    itinerarySuccessRef.current = false;
    pricingSuccessRef.current = false;
    transfersSuccessRef.current = false;
    hotelsSuccessRef.current = false;
  };

  function addDaysToDate(dateString, daysToAdd) {
    const date = new Date(dateString);

    date.setDate(date.getDate() + daysToAdd);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // const newDate = addDaysToDate(dateString, 2);
  // console.log(newDate);

  //  const transferBooking = useSelector((state) => state.TransferBookings)?.transferBookings
  //   console.log("Transfer Booking",transferBooking);

  // useEffect(() => {
  //   if (hasRendered.current) {
  //     if (props.token) getPaymentHandler();
  //   } else hasRendered.current = true;
  // }, [props.token]);

  // useEffect(() => {
  //   if (props.itinerary.name !== "Loading Itinerary") {
  //     let activities =[];
  //     if(props?.mercuryItinerary)
  //      activities = getItineraryActivities();
  //     else
  //     activities = getItineraryActivitiesOld();
  //     props.setItineraryActivities(activities);
  //   }
  // }, [props.itinerary]);

  const getItineraryActivities = () => {
    let itenaryActivities = [];
    props.itinerary?.cities?.map((day_slab, index) => {
      day_slab?.day_by_day?.slab_elements?.map((element, index) => {
        if (element.element_type === "activity") {
          itenaryActivities.push({
            activity: element,
            date: day_slab.day_by_day?.start_date,
          });
        }
      });
    });
    return itenaryActivities;
  };

  const getBreifHandler = () => {
    axiosbreifinstance
      .get(`/?itinerary_id=` + props.id)
      .then((res) => {
        props.setBreif(res.data);
        if (res.data) {
          if (res.data.city_slabs) {
            if (res.data.city_slabs.length)
              for (var i = 0; i < res.data.city_slabs.length; i++) {
                if (res.data.city_slabs[i].duration)
                  setTotalduration(
                    totalduration + parseInt(res.data.city_slabs[i].duration)
                  );
              }
          }
        }
        if (res.data.city_slabs)
          if (!res.data.city_slabs.length)
            if (!props.breif.city_slabs)
              if (!props.breif.city_slabs.length)
                setTimeout(getBreifHandler, 3000);
      })
      .catch((error) => {
        // window.location.href = "/thank-you";
      });
  };

  const getPaymentHandler = () => {
    if (!props?.mercuryItinerary) {
      setPaymentLoading(true);

      axiosPaymentInstance
        .post(
          "",
          {
            itinerary_type: "Tailored",
            itinerary_id: props.id,
          },
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        )
        .then((res) => {
          if (
            props.token &&
            !res.data.user_allowed_to_pay &&
            res.data.itinerary_status == ITINERARY_STATUSES.itinerary_unclaimed
          ) {
            authaction
              .ClaimItinary(props.id, props.token)
              .then((res) => {
                setPayment(res); //
                setPaymentLoading(false);
              })
              .catch((err) => {});
          } else {
            setPayment(res.data);
            setPaymentLoading(false);
          }
          let email = localStorage.getItem("email");
          if (props.token)
            for (var i = 0; i < res.data.registered_users.length; i++) {
              if (res.data.registered_users[i].email === email) {
                if (res.data.registered_users[i].payment_status)
                  if (
                    res.data.registered_users[i].payment_status === "captured"
                  )
                    setHasUserPaid(true);
                break;
              }
            }
        })
        .catch((error) => {
          setPaymentLoading(false);
        });
    } else {
      getPaymentInfo();
    }
  };

  const getAllStays = async () => {
    try {
      const res = await axiosGetAllStays.get(props.id + "/bookings/hotels/");

      let data = res.data;
      let stays = [];
      for (let i = 0; i < data?.cities.length; i++) {
        console.log("itinerary city id2 is:".data?.cities[i])
        let hotels = data?.cities[i]?.hotels;
        let city_name = data?.cities[i]?.city?.name;
        let city_id = data?.cities[i]?.city?.id;
        let itinerary_city_id=data?.cities[i]?.id

        if (hotels.length === 0) {
          stays.push({
            itinerary_city_id,
            city_name,
            city_id,
            trace_city_id: data?.cities[i]?.id,
            duration: data?.cities[i]?.duration,
            check_in: data?.cities[i]?.start_date,
            check_out:
              data?.cities[i]?.start_date && data?.cities[i]?.duration
                ? addDaysToDate(
                    data?.cities[i]?.start_date,
                    data?.cities[i]?.duration
                  )
                : null,
          });
        } else {
          for (let hotel of hotels) {
            hotel.itinerary_city_id=itinerary_city_id,
            hotel.gmaps_place_id = data?.cities[i]?.city?.gmaps_place_id,
            hotel.city_name = city_name;
            hotel.city_id = city_id;
            hotel.source = hotel?.images?.[0]?.source;
            stays.push(hotel);
          }
        }
      }

      console.log("Prepared stays data:", stays);

      setStayBookings(stays);
      dispatch(setStays(stays));
      dispatch(setItineraryStatus("hotels_status", "SUCCESS"));

      props.setBookings({
        ...props.bookings,
        stayBookings: data?.cities ? data?.cities : null,
      });

      console.log("Stay bookings:", stays);
    } catch (error) {
      console.log("ERROR[HotelBookingInfo][Itinerary]", error);
    }
  };

  const getPaymentInfo = async () => {
    console.log("I'm Inside Payment");
    let stay_data = {};
    let activity_data = {};
    let transfer_data = {};
    let flight_data = {};
    const token = localStorage.getItem("access_token");

    try {
      const res = await axiosGetPaymentInfo.get(props.id + "/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = res.data;
      setPayment(data);
      dispatch(setItineraryStatus("pricing_status", "SUCCESS"));

      for (let category in data.summary) {
        let categoryData = data.summary[category];

        if (category === "Stays") {
          stay_data = { ...categoryData };
        } else if (category === "Activities") {
          activity_data = { ...categoryData };
        } else if (category === "Transfers") {
          transfer_data = { ...categoryData };
        } else if (category === "Flights") {
          flight_data = { ...categoryData };
        }
      }

      // console.log("Stay Data:", stay_data);
      // console.log("Activity Data:", activity_data);
      // console.log("Transfer Data:", transfer_data);
      // console.log("Flight Data:", flight_data);

      // setStayBookings(stay_data);
      // setActivityBookings(activity_data);
      // setTransferBookings(transfer_data);
      // setFlightBookings(flight_data);

      // setStayBookings(stay_bookings);
      //       if (activity_bookings.length) {
      //         setActivityBookings(activity_bookings);
      //       } else {
      //         setActivityBookings(null);
      //       }

      //       if (flight_bookings.length) {
      //         setFlightBookings(flight_bookings);
      //       } else {
      //         setFlightBookings(null);
      //       }

      //       if (transfer_bookings.length) {
      //         setTransferBookings(transfer_bookings);
      //       } else {
      //         setTransferBookings(null);
      //       }
    } catch (error) {
      console.log("ERROR[PaymentInfo][Itinerary]", error);
      setPaymentLoading(false);
    }
  };

  const getAccommodationAndActivitiesHandler = () => {
    let stay_bookings = [];
    let activity_bookings = [];
    let transfer_bookings = [];
    let flight_bookings = [];

    const access_token = localStorage.getItem("access_token");

    axiosBookingsInstance
      .get("?itinerary_id=" + props.id, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        getPaymentHandler();
        if (response.status === 200) {
          const data = response.data;
          for (var i = 0; i < data.bookings.length; i++) {
            if (data.bookings[i].booking_type === "Accommodation")
              stay_bookings.push(data.bookings[i]);
            else if (data.bookings[i].booking_type === "Activity")
              activity_bookings.push(data.bookings[i]);
            else {
              transfer_bookings.push(data.bookings[i]);
              if (data.bookings[i].booking_type === "Flight") {
                flight_bookings.push(data.bookings[i]);
              }
            }
          }

          // setStayBookings(stay_bookings);
          if (activity_bookings.length) {
            setActivityBookings(activity_bookings);
          } else {
            setActivityBookings(null);
          }

          if (flight_bookings.length) {
            setFlightBookings(flight_bookings);
          } else {
            setFlightBookings(null);
          }

          // if (transfer_bookings.length) {
          //   setTransferBookings(transfer_bookings);
          // } else {
          //   setTransferBookings(null);
          // }
        }
      })
      .catch((err) => {});
  };

  const getAllBookings = () => {
    axiosGetTransfers
      .get(`/${props.id}/bookings/transfers/`)
      .then((res) => {
        dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
        const data = res.data;
        setTransferBookings(data);
        // setCityTransferBookings(data);
        dispatch(setTransfersBookings(data));
        console.log("New Transfer Data", data);
      })
      .catch((err) => {
        console.error("Error fetching all bookings", err.message);
      });
  };

  async function getRoutes(itinaryId) {
    const res = await axiosPoiRoutes.get(`/?itinerary_id=${itinaryId}`);
    const data = res.data;
    return data;
  }

  async function fetchData(poll) {
    if (TRAVELER_ITINERARIES.includes(props.id))
      setIsPastTravelerItinerary(true);
    
    const fetchStatus = async () => {
  try {
    const res = await axiosGetItineraryStatus.get(`/${props.id}/status/`);
    const status = res.data?.celery;

    setDisplayText(status?.display_text || null);
    setConsecutiveErrors(0);

   
    if (status?.PRICING === "FAILURE") {
      dispatch(setItineraryStatus("pricing_status", "FAILURE"));
    }
    if (status?.TRANSFERS === "FAILURE") {
      dispatch(setItineraryStatus("transfers_status", "FAILURE"));
    }
    if (status?.HOTELS === "FAILURE") {
      dispatch(setItineraryStatus("hotels_status", "FAILURE"));
    }

    const itineraryFailure = status?.ITINERARY === "FAILURE";
    // const notPrepared = res.data?.status == "Not Prepared";

    if (itineraryFailure) {
      console.log("Itinerary failure or status not PREPARED. Redirecting to thank-you.");
      setPolling(false);
      router.push("/thank-you");
      return;
    }

    const allStatusesCompleted = ["ITINERARY", "TRANSFERS", "PRICING", "HOTELS"].every(
      (key) => status?.[key] === "SUCCESS" || status?.[key] === "FAILURE"
    );

    if (allStatusesCompleted) {
      dispatch(setItineraryStatus("finalized_status", "SUCCESS"));
      setPolling(false);
    } else {
      setPolling(true);
    }

    fetchItinerary(
      status?.ITINERARY,
      status?.HOTELS,
      status?.TRANSFERS,
      status?.PRICING
    );
  } catch (err) {
    console.error("[ERROR]: axiosGetItineraryStatus: ", err.message, err.response?.status);

    if (
      err.response?.data?.errors?.[0]?.message?.[0]?.includes("Itinerary matching query does not exist")
    ) {
      console.log("Itinerary not found error detected, redirecting to v1 version");
      setPolling(false);
      setItineraryLoading(false);
      setOldOne(true);
     
      // router.push(`/itinerary/v1/${props.id}`);

      return;
    }

    handleApiError();
  }
};



    const fetchItinerary = async (itinerary, hotels, transfers, pricing) => {
      try {
        if (itinerary === "SUCCESS" && !itinerarySuccessRef.current) {
          if (true) window.scrollTo(0, 0);
          itinerarySuccessRef.current = true;
          const res = await axiosGetItinerary.get(`/${props.id}/`);
          const data = res.data;

          if (data?.version === "v1" || !data) {
            setShowMercuryItinerary(false);
             setItineraryLoading(false);
            // router.push(`/itinerary/v1/${props.id}`);
            setOldOne(true);
           
            return;
          } else {
            setShowMercuryItinerary(true);
            dispatch(setItineraryStatus("itinerary_status", "SUCCESS"));
          }

          dispatch(setItinerary(data));
          // props.setItinerary(data);
          props.setItineraryDaybyDay(data);
          props.setBreif(data);
          setCities(data?.cities);
          setItineraryDate(data.start_date);

          let activities = getItineraryActivities();
          props.setItineraryActivities(activities);
          setItineraryLoading(false);
        }

        if (hotels === "SUCCESS" && !hotelsSuccessRef.current) {
          hotelsSuccessRef.current = true;
          // setTimeout(() => {
          getAllStays();

          // }, 20000);
        }

        if (transfers === "SUCCESS" && !transfersSuccessRef.current) {
          transfersSuccessRef.current = true;
          setLoadBookings(true);
          // setTimeout(() => {
          getAllBookings();
          // }, 20000);
        }

        if (hotels === "FAILURE" && !hotelsSuccessRef.current) {
          hotelsSuccessRef.current = true;
          getAllStays();
        }

        if (transfers === "FAILURE" && !transfersSuccessRef.current) {
          transfersSuccessRef.current = true;
          getAllBookings();
        }

        if (pricing === "SUCCESS" && !pricingSuccessRef.current) {
          pricingSuccessRef.current = true;
          setLoadPricing(true);
          getPaymentInfo();
        }
        if (pricing === "FAILURE" && !pricingSuccessRef.current) {
          pricingSuccessRef.current = true;
          getPaymentInfo();
        }
      } catch (err) {
        console.error("[ERROR]: axiosGetItinerary: ", err.message, err.response?.status);
      
        if (
            err.response?.data?.errors?.[0]?.message?.[0]?.includes("Itinerary matching query does not exist")) {
          
          console.log("Itinerary not found error detected in fetchItinerary, redirecting to v1 version");
          setPolling(false);
           setItineraryLoading(false);
          // router.push(`/itinerary/v1/${props.id}`);
          setOldOne(true);
          return;
        }
      
        handleApiError();
        setItineraryLoading(false);
      }
    };
    const handleApiError = () => {
      setConsecutiveErrors(prev => {
        const newCount = prev + 1;
        console.log(`API error occurred. Consecutive errors: ${newCount}`);
        
        if (newCount >= 2) {
          console.log("Two consecutive API errors detected, redirecting to thank you page");
          setPolling(false);
          router.push("/thank-you");
        }
        
        return newCount;
      });
    };
    
    if (poll) {
      fetchStatus();
    }
  }
  useEffect(() => {
    const start=Date.now()
    const fetchPaymentInfo = async () => {
      setLoadPricing(false);
      try {
        if (payment != null) {
          pricingSuccessRef.current = true;
          await getPaymentInfo();
        }
      } catch (error) {
      } finally {
        const end = Date.now(); // End time
      console.log("finally called after", (end - start), "ms");
        setLoadPricing(true);
      }
    };

    fetchPaymentInfo();
  }, [CallPaymentInfo]);

  // useEffect(() => {
  //   const fetchPassengers = async () => {
  //     try {
  //       const res = await axiosGetItinerary.get(`/${props.id}/guests/`);
  //       dispatch(SetPassengers(res?.data));
  //     } catch (error) {}
  //   };
  //   if (props?.token) {
  //     fetchPassengers();
  //   }
  // }, [props?.token]);

  useEffect(() => {
    fetchData(true);
  }, [props.id]);

 
useEffect(() => {
  let interval;

  console.log("Polling:", polling);

  if (polling) {
    fetchData(true);

    interval = setInterval(() => {
      const isAnyFailure =
        itinerary_status === "FAILURE" ||
        transfers_status === "FAILURE" ||
        pricing_status === "FAILURE" ||
        hotels_status === "FAILURE";

      if (isAnyFailure) {
        clearInterval(interval);
        router.push("/thank-you");
        return;
      }

      fetchData(true);
    }, 5000);
  } else {
    clearInterval(interval);
  }

  return () => clearInterval(interval);
}, [polling, itinerary_status, transfers_status, pricing_status, hotels_status]);


  const _updateTransferBooking = (arr1, arr2) => {
    const combinedArray = [...arr1]; // Copy arr1 to avoid modifying the original array 

    arr2.forEach((element) => {
      const newId = element.id;

      // Check if the ID already exists in the combined array
      const existingElementIndex = combinedArray.findIndex(
        (el) => el.id === newId
      );

      if (existingElementIndex !== -1) {
        // Replace the existing element's value with the new value
        combinedArray[existingElementIndex] = element;
      } else {
        // Add the new element to the combined array
        combinedArray.push(element);
      }
    });

    return combinedArray;
  };

  const _updateFlightBookingHandler = (json) => {
    setShowFlightModal(false);
    // setTransferBookings(_updateTransferBooking(transferBookings, json));
  };

  const _updateBookingHandler = (json) => {
    setShowStayBookingModal(false);
    setShowBookingModal(false);
    setShowFlightModal(false);
    setBooking(json);
  };

  const _updateStayBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowStayBookingModal(false);
    setShowFlightModal(false);
    // setStayBookings(_updateTransferBooking(stayBookings, json));
    // props.setBookings({
    //   ...props.bookings,
    //   stayBookings: _updateTransferBooking(props.bookings.stayBookings, json),
    // });
  };

  const _updateActivityBookingHandler = (json) => {
    setActivityBookings(json);
  };

  const _updateTransferBookingHandler = (json) => {
    setShowBookingModal(false);
    setShowStayBookingModal(false);
    setShowFlightModal(false);
    //setTransferBookings(json);
    // setTransferBookings(json);
  };

  const _updateTaxiBookingHandler = (json) => {
    setShowTaxiModal(false);

    // setTransferBookings(_updateTransferBooking(transferBookings, json));
    // setTransferBookings(_updateTransferBooking(transferBookings, json));
  };

  const _selectTaxiHandler = (
    bookings,
    booking_id,
    booking_name,
    booking_type,
    itinerary_id,
    tailored_id,
    itinerary_name,
    taxi_type,
    transfer_type,
    city_id,
    destination_city_id,
    duration,
    check_in
  ) => {
    let data = [];
    setCardUpdateLoading(booking_id);
    data.push({
      id: booking_id,
      booking_type: booking_type,
      itinerary_type: "Tailored",
      user_selected: true,
      itinerary_id: itinerary_id,
      tailored_itinerary: tailored_id,
      itinerary_name: itinerary_name,
      itinerary_db_id: null,
      taxi_type: taxi_type,
      transfer_type: transfer_type,
      city_id: city_id,
      destination_city_id: destination_city_id,
      duration: duration,
      check_in: check_in,
    });

    axiosbookingupdateinstance
      .post("/?booking_type=Taxi,Bus,Ferry", data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        setCardUpdateLoading(null);
        _updateTransferBookingHandler(res.data.bookings);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain."
        );
      });
  };

  const _deselectStayBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < stayBookings.length; i++) {
      if (stayBookings[i].id === booking.id) {
        setStayFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);
    setSelectingBooking(booking.id);
    let costings_breakdown = [];
    for (var i = 0; i < booking.costings_breakdown.length; i++) {
      costings_breakdown.push({
        id: booking.costings_breakdown[i].id,
        room_type: booking.costings_breakdown[i].room_type,
        pricing_type: booking.costings_breakdown[i].pricing_type,
        room_type_name: booking.costings_breakdown[i].room_type_name,
        number_of_rooms: booking.costings_breakdown[i].number_of_rooms,
        number_of_adults: booking.costings_breakdown[i].number_of_adults,
        number_of_infants: booking.costings_breakdown[i].number_of_infants,
        number_of_children: booking.costings_breakdown[i].number_of_children,
      });
    }
    let data = [];
    data.push({
      id: booking.id,
      booking_type: "Accommodation",
      city: booking.city,
      user_selected: user_selected,
      accommodation: booking.accommodation,
      itinerary_id: booking.itinerary_id,
      tailored_itinerary: booking.tailored_itinerary,
      costings_breakdown: costings_breakdown,
      itinerary_name: booking.itinerary_name,
      itinerary_db_id: null,
      is_estimated_price: booking.is_estimated_price,
      itinerary_type: "Tailored",
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Accommodation&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateStayBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain."
        );
      });
  };

  const _deselectFlightBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < flightBookings.length; i++) {
      if (flightBookings[i].id === booking.id) {
        setFlightFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);

    setSelectingBooking(booking.id);
    let data = [];

    data.push({
      id: booking.id,
      booking_type: booking.booking_type,
      itinerary_type: "Tailored",
      user_selected: user_selected,
      itinerary_id: booking.itinerary_id,
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Flight&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateFlightBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain."
        );
      });
  };

  const _deselectTransferBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < transferBookings.length; i++) {
      if (transferBookings[i].id === booking.id) {
        setTransferFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);

    setSelectingBooking(booking.id);
    let data = [];
    data.push({
      id: booking.id,
      booking_type: booking.booking_type,
      itinerary_type: "Tailored",
      user_selected: user_selected,
      taxi_type: booking.taxi_type,
      transfer_type: booking.transfer_type,
      itinerary_id: booking.itinerary_id,
      costings_breakdown: booking.costings_breakdown,
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Taxi,Bus,Ferry&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateTransferBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        props.openNotification({
          type: "error",
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
        });
      });
  };

  const _deselectActivityBookingHandler = (booking, user_selected) => {
    for (var i = 0; i < activityBookings.length; i++) {
      if (activityBookings[i].id === booking.id) {
        setActivityFlickityIndex(i);
        break;
      }
    }
    setPaymentLoading(true);

    setSelectingBooking(booking.id);
    let data = [];

    data.push({
      id: booking.id,
      booking_type: booking.booking_type,
      itinerary_type: "Tailored",
      user_selected: user_selected,
      itinerary_id: booking.itinerary_id,
      tailored_itinerary: booking.tailored_itinerary,
      itinerary_name: booking.itinerary_name,
      itinerary_db_id: null,
      check_in: booking.check_in,
      check_out: booking.check_out,
      city: booking.city,
      costings_breakdown: booking.costings_breakdown,
      accommodation: booking.accommodation,
      is_estimated_price: booking.is_estimated_price,
    });

    axiosbookingupdateinstance
      .post(
        "/?booking_type=Activity&itinerary_id=" + booking.itinerary_id,
        data,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        setCardUpdateLoading(null);
        _updateActivityBookingHandler(res.data.bookings);
        setSelectingBooking(null);
        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
      })
      .catch((err) => {
        setSelectingBooking(null);

        setCardUpdateLoading(null);

        window.alert(
          "You're not authorized to take this action, please contact your experience captain."
        );
      });
  };

  const _updatePaymentHandler = (json) => {
    setPayment(json);
  };

  const setHideBookingModal = () => {
    setShowBookingModal(false);
    setShowStayBookingModal(false);
  };

  const setHidePoiModal = () => {
    setShowPoiModal(false);
  };

  if (itineraryLoading) {
    return <Spinner></Spinner>;
  }


  const shouldShowLoader = () => {
  if (!displayText) return false;
  return true;
  
  // const allStatusesCompleted = ["ITINERARY", "TRANSFERS", "PRICING", "HOTELS"].every(
  //   (key) => itinerary_status === "SUCCESS" || itinerary_status === "FAILURE" ||
  //            transfers_status === "PEN" || transfers_status === "FAILURE" ||
  //            pricing_status === "SUCCESS" || pricing_status === "FAILURE" ||
  //            hotels_status === "SUCCESS" || hotels_status === "FAILURE"
  // );
  
  // return !allStatusesCompleted;
};

if(oldOne){
  return (<>
         <ItineraryContainerOld id={router.query.id}/>
      </>)
}

  return (
    <Container>
      <Overview
        mercuryItinerary
        title={props.itinerary.name}
        itinerary={props?.itinerary}
        group_type={group_type || props.itinerary?.group_type}
        duration_time={duration_time || props.itinerary?.duration_time}
        images={props.itinerary.images}
        travellerType={travellerType}
        start_date={
          props?.plan
            ? props.plan.start_date
            : props.itinerary.start_date
            ? props.itinerary.start_date
            : null
        }
        end_date={
          props?.plan
            ? props.plan.end_date
            : props.itinerary.end_date
            ? props.itinerary.end_date
            : null
        }
        duration={
          props?.plan
            ? props.plan.duration_number + " " + props?.plan?.duration_unit ||
              "nights"
            : props.itinerary?.duration
            ? props.itinerary?.duration + " " + "nights"
            : null
        }
        budget={
          props?.plan
            ? props.plan?.budget
            : props.itinerary?.budget
            ? props.itinerary?.budget
            : null
        }
        number_of_adults={
          props?.plan
            ? props.plan?.number_of_adults
            : props.itinerary.number_of_adults
            ? props.itinerary.number_of_adults
            : null
        }
        number_of_children={
          props?.plan
            ? props.plan?.number_of_children
            : props.itinerary.number_of_children
            ? props.itinerary.number_of_children
            : null
        }
        number_of_infants={
          props?.plan
            ? props.plan?.number_of_infants
            : props.itinerary.number_of_infants
            ? props.itinerary.number_of_infants
            : null
        }
        setEditRoute={setEditRoute}
        cities={props?.cities}
        resetRef={resetRef}
        fetchData={fetchData}
        
      ></Overview>

      <div id="itinerary-anchor">
        <Menu
          mercuryItinerary
          loadbookings={!loadbookings}
          resetRef={resetRef}
          loadpricing={!loadpricing}
          setLoadPricing={setLoadPricing}
          showMercuryItinerary={showMercuryItinerary}
          hasUserPaid={hasUserPaid}
          isDatePresent={isDatePresent}
          _updateTaxiBookingHandler={_updateTaxiBookingHandler}
          showTaxiModal={showTaxiModal}
          setShowTaxiModal={setShowTaxiModal}
          paymentLoading={paymentLoading}
          budget={
            props?.plan
              ? props.plan?.budget
              : props.itinerary?.budget
              ? props.itinerary?.budget
              : null
          }
          _deselectActivityBookingHandler={_deselectActivityBookingHandler}
          activityFlickityIndex={activityFlickityIndex}
          transferFlickityIndex={transferFlickityIndex}
          stayFlickityIndex={stayFlickityIndex}
          setStayFlickityIndex={setStayFlickityIndex}
          selectingBooking={selectingBooking}
          _deselectTransferBookingHandler={_deselectTransferBookingHandler}
          _deselectFlightBookingHandler={_deselectFlightBookingHandler}
          flightFlickityIndex={flightFlickityIndex}
          _deselectStayBookingHandler={_deselectStayBookingHandler}
          getPaymentHandler={getPaymentHandler}
          flightBookings={flightBookings}
          cardUpdateLoading={cardUpdateLoading}
          _selectTaxiHandler={_selectTaxiHandler}
          _updateTransferHandler={_updateTransferBookingHandler}
          _updateStayBookingHandler={_updateStayBookingHandler}
          activityBookings={activityBookings}
          setTransferBookings={setTransferBookings}
          cityTransferBookings={cityTransferBookings}
          stayBookings={stayBookings}
          user_email={userEmail}
          setItinerary={props.setItinerary}
          traveleritinerary={isPastTravelerItinerary}
          id={props.id}
          is_stock={is_stock}
          _updatePaymentHandler={_updatePaymentHandler}
          setHidePoiModal={setHidePoiModal}
          setHideBookingModal={setHideBookingModal}
          setShowPoiModal={setShowPoiModal}
          setShowBookingModal={setShowBookingModal}
          setShowStayBookingModal={setShowStayBookingModal}
          _updateFlightBookingHandler={_updateFlightBookingHandler}
          showFlightModal={showFlightModal}
          setShowFlightModal={setShowFlightModal}
          showPoiModal={showPoiModal}
          showBookingModal={showBookingModal}
          showStayBookingModal={showStayBookingModal}
          _updateBookingHandler={_updateBookingHandler}
          itineraryReleased={itineraryReleased}
          itineraryDate={itineraryDate}
          payment={payment}
          booking={booking}
          token={props.token}
          fetchData={fetchData}
          getAccommodationAndActivitiesHandler={
            getAccommodationAndActivitiesHandler
          }
          group_type={group_type || props.itinerary?.group_type}
          duration_time={duration_time || props.itinerary?.duration_time}
          travellerType={travellerType}
          editRoute={editRoute}
          setEditRoute={setEditRoute}
          getPaymentInfo={getPaymentInfo}
          cities={cities}
          itinerary={props?.itinerary}
          setStayBookings={setStayBookings}
          setActivityBookings={setActivityBookings}
          shouldShowLoader={shouldShowLoader}
          displayText={displayText}
        ></Menu>
      </div>
      <ToastContainer />
      
    </Container>
  );
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
    // bookings: gs,
    itineraryActivities: state.itineraryActivities,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    openNotification: (payload) => dispatch(openNotification(payload)),
    setItineraryRoutes: (payload) => dispatch(setItineraryRoutes(payload)),
    setItinerary: (payload) => dispatch(setItinerary(payload)),
    setPlan: (payload) => dispatch(setPlan(payload)),
    setBookings: (payload) => dispatch(setBookings(payload)),
    setItineraryActivities: (payload) =>
      dispatch(setItineraryActivities(payload)),
    setBreif: (payload) => dispatch(setBreif(payload)),
    setItineraryDaybyDay: (payload) => dispatch(setItineraryDaybyDay(payload)),
    setTransfersBookings: (payload) => dispatch(setTransfersBookings(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ItineraryContainer);
