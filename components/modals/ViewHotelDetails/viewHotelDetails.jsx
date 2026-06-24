import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { TbArrowBack } from "react-icons/tb";
import media from "../../media";
import Overview from "./Overview/Overview";
import Drawer from "../../ui/Drawer";
import Skeleton from "./Skeleton";
import { openNotification } from "../../../store/actions/notification";
import fetchaccommodations, {
  hotelDetails,
} from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import HotelBookingDetails from "./Overview/HotelBookingDetails";
import { updateAccommodationBooking } from "../../../services/bookings/UpdateBookings";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import SetRefetchAirportTransfers from "../../../store/actions/refetchAirportTransfers";
import BackArrow from "../../ui/BackArrow";
import Image from "next/image";

const ViewHotelDetails = (props) => {

  // console.log("plan is:", props?.currentBooking)
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const { drawer, booking_id, idx, city_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("50%");
  const dispatch = useDispatch();
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const currency = useSelector(state=>state.currency);
  
  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth <= 986 ? "100%" : "50%");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (props.show && drawer !== "showHotelDetail") {
      fetchDetails();
    }
  }, [props.id, props.show, props.provider]);

  const fetchDetails = () => {
    setLoading(true);
    setError(false);

    if (props?.mercury) {
      const requestData = {
        trace_id: props?.traceId,
        check_in: (props?.check_in)?.split("/")?.join("-"),
        check_out: (props?.check_out)?.split("/")?.join("-"),
        hotel_id: props?.id,
        occupancies: props?.occupancies?.map((item) => {
          return {
            num_adults: item.adults,
            child_ages: item.childAges,
          };
        }),
        source: props?.source,
        currency: "INR",
        city_id: props?.city_id
      };
      hotelDetails
        .post(`?currency=${currency?.currency || 'INR'}`, requestData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      setLoading(true);
      setError(false);
      if (props?.check_in?.includes("/")) {
        check_in = props.check_in?.split("/")?.reverse()?.join("-");
        check_out = props.check_out?.split("/")?.reverse()?.join("-");
      }
      let paramsObj = {
        accommodation_id: props.id,
        show_rooms: true,
      };
      if (
        // props.currentBooking &&
        // props.currentBooking.source &&
        props.source == "Agoda"
      ) {
        paramsObj.source = "Agoda";
      }
      fetchaccommodations
        .get("", {
          params: paramsObj,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          props.openNotification({
            type: "error",
            text: error?.response?.data?.errors[0]?.message[0] || "There seems to be a problem, please try again!",
            heading: "Error!",
          });
        });
    }
  };

  // const index = props?.plan?.findIndex((item) => item.itinerary_city_id == props?.itinerary_city_id);

  const updateBooking = (recommendation_id, rates) => {
    props.setUpdateBookingState(true);
    let stayBookings = props?.plan;
    let index = stayBookings?.findIndex(item => {
      const sameCity = item?.itinerary_city_id == props?.itinerary_city_id;
      const sameBooking = item.id == props?.bookingId;

      const duplicateCityCount = stayBookings.filter(
        b => b.itinerary_city_id == props?.itinerary_city_id
      ).length;

      return duplicateCityCount > 1 ? (sameCity && sameBooking) : sameCity;
    });

    const requestData = {
      rates: rates,
      itinerary_code: data?.itinerary_code,
      items: data?.items,
      recommendation_id: recommendation_id,
      trace_id: localStorage.getItem("trace_id"),
      itinerary_id: router?.query?.id,
      hotel_id: data?.id,
      source: props.provider,
      booking_id: props?.bookingId != "" ? props?.bookingId : null,
      itinerary_city: props?.itinerary_city_id,
      city_id: props.currentBooking.city_id,
    };

    updateAccommodationBooking
      .post(`${router?.query?.id}/bookings/accommodation/`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        props._updateStayBookingHandler([response.data]);
        props.setUpdateBookingState(false);
        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        // The backend reprices this city's airport transfers and deletes the
        // previous bookings on a hotel change — re-poll status & re-fetch.
        dispatch(SetRefetchAirportTransfers());
        setTimeout(() => {
          props.getPaymentHandler();
        }, 1000);

        props.openNotification({
          type: "success",
          text: "Hotel added successfully.",
          heading: "Success!",
        });
        props?.onHide();


        try {
          stayBookings[index] = {
            city_id: props.currentBooking.city_id,
            city_name: props.currentBooking.city_name,
            ...response?.data,
            lat:response?.data?.latitude,
            long:response?.data?.longitude,
            source: response?.data?.images?.[0]?.source,
            itinerary_city_id: props?.itinerary_city_id,
          };
          props.setStayBookings(stayBookings);
          props.openNotification({
            type: "success",
            text: `${data?.name} added to itinerary Successfully`,
            heading: "Success!",
          });
          props?.handleClose();
        } catch (error) {
          props.openNotification({
            type: "error",
            text: `${error.response?.data?.errors[0]?.message[0]}`,
            heading: "Error!",
          });
        }
      })
      .catch((err) => {
        props.setUpdateBookingState(false);
        props.openNotification({
          type: "error",
          text: `${err.response?.data?.errors[0]?.message[0]}`,
          heading: "Error!",
        });
      });
  };

  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      className="!overflow-y-hidden"
      bgColor="#fafaf5"
      onHide={props.onHide}
      style={{ zIndex: props.zIndex ?? 1252 }}
      width={"50%"}
      mobileWidth={"100%"}
    >
      {!loading ? (
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4">
          <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0">
            <Image src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={(e) => props.onHide(e)} />
            <div className="ttw-type-h2 font-semibold text-[#0b1220]">Hotel Details</div>
          </div>
          {!error ? (
            <div>
              {" "}
              {props.mercury ? (
                <HotelBookingDetails
                  _setImagesHandler={props._setImagesHandler}
                  user_rating={props.user_rating}
                  number_of_reviews={props.number_of_reviews}
                  data={data}
                  images={data?.images ? data.images : []}
                  experience_filters={
                    props.poi ? props.poi.experience_filters : null
                  }
                  name={props.poi ? props.poi.name : null}
                  duration={props.poi ? props.poi.ideal_duration_hours : null}
                  BookingButton={props.BookingButton}
                  BookingButtonFun={props.BookingButtonFun}
                  payment={props.payment}
                  updateBooking={updateBooking}
                  handleClick={props?.handleClick}
                  setShowDetails={props?.setShowDetails}
                  id={props?.id}
                  setShowLoginModal={props.setShowLoginModal}
                  onHide={props?.onHide}
                />
              ) : (
                <Overview
                  _setImagesHandler={props._setImagesHandler}
                  user_rating={props.user_rating}
                  currentBooking={props.currentBooking}
                  number_of_reviews={props.number_of_reviews}
                  data={data}
                  images={data?.images ? data.images : []}
                  experience_filters={
                    props.poi ? props.poi.experience_filters : null
                  }
                  name={props.poi ? props.poi.name : null}
                  duration={props.poi ? props.poi.ideal_duration_hours : null}
                  BookingButton={props.BookingButton}
                  BookingButtonFun={props.BookingButtonFun}
                  payment={props.payment}
                  updateBooking={updateBooking}
                  bookingId={props?.bookingId}
                ></Overview>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-16 gap-3">
              <div className="text-[#445069] text-center ttw-type-body">
                Oops! There seems to be a problem, please try again later!
              </div>
              <button
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
                onClick={fetchDetails}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      ) : (
        <Skeleton onHide={props.onHide} />
      )}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    itineraryId: state.ItineraryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ViewHotelDetails);
