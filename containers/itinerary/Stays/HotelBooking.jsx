import React, { useEffect, useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { BsCalendar2, BsPeopleFill, BsPlus } from "react-icons/bs";
import { BiBed } from "react-icons/bi";
import { ImSpoonKnife } from "react-icons/im";
import Skeleton from "../../../components/ui/SkeletonCard";
import { getDate } from "../../../helper/ConvertDateFormat";
import Button from "../../../components/ui/button/Index";
import styled from "styled-components";
import { ITINERARY_STATUSES } from "../../../services/constants";
import { MdWifi } from "react-icons/md";
import { logEvent } from "../../../services/ga/Index";
import { getStars } from "../../../components/itinerary/itineraryCity/SlabElement";
import BookingModal from "../../../components/modals/bookingupdated/Index";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import ViewHotelDetails from "../../../components/modals/ViewHotelDetails/viewHotelDetails";
import AccommodationModal from "../../../components/modals/accommodation/Index";
import media from "../../../components/media";
import { CONTENT_SERVER_HOST } from "../../../services/constants";
import { isDateOlderThanCurrent } from "../../../helper/isDateOlderThanCurrent";
import { format } from "date-fns";
import { connect, useSelector } from "react-redux";
import * as ga from "../../../services/ga/Index";
import { useRouter } from "next/router";


const svgIcons = {
  "loaction": <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
    <path d="M4.99968 13.6666C3.8219 13.6666 2.86079 13.4805 2.11634 13.1083C1.3719 12.736 0.999675 12.2555 0.999675 11.6666C0.999675 11.3999 1.08023 11.1527 1.24134 10.9249C1.40245 10.6971 1.62745 10.4999 1.91634 10.3333L2.96634 11.3166C2.86634 11.361 2.75801 11.411 2.64134 11.4666C2.52468 11.5221 2.43301 11.5888 2.36634 11.6666C2.51079 11.8444 2.84412 11.9999 3.36634 12.1333C3.88856 12.2666 4.43301 12.3333 4.99968 12.3333C5.56634 12.3333 6.11357 12.2666 6.64134 12.1333C7.16912 11.9999 7.50523 11.8444 7.64968 11.6666C7.5719 11.5777 7.4719 11.5055 7.34968 11.4499C7.22746 11.3944 7.11079 11.3444 6.99968 11.2999L8.03301 10.2999C8.34412 10.4777 8.58301 10.6805 8.74968 10.9083C8.91634 11.136 8.99968 11.3888 8.99968 11.6666C8.99968 12.2555 8.62746 12.736 7.88301 13.1083C7.13857 13.4805 6.17745 13.6666 4.99968 13.6666ZM5.01634 9.99992C6.11634 9.18881 6.94412 8.37492 7.49968 7.55825C8.05523 6.74158 8.33301 5.92214 8.33301 5.09992C8.33301 3.96659 7.9719 3.11103 7.24968 2.53325C6.52745 1.95547 5.77745 1.66659 4.99968 1.66659C4.2219 1.66659 3.4719 1.95547 2.74968 2.53325C2.02745 3.11103 1.66634 3.96659 1.66634 5.09992C1.66634 5.84436 1.93856 6.61936 2.48301 7.42492C3.02745 8.23047 3.8719 9.08881 5.01634 9.99992ZM4.99968 11.6666C3.43301 10.511 2.26356 9.38881 1.49134 8.29992C0.719119 7.21103 0.333008 6.14436 0.333008 5.09992C0.333008 4.31103 0.474675 3.61936 0.758008 3.02492C1.04134 2.43047 1.40523 1.93325 1.84968 1.53325C2.29412 1.13325 2.79412 0.833252 3.34968 0.633252C3.90523 0.433252 4.45523 0.333252 4.99968 0.333252C5.54412 0.333252 6.09412 0.433252 6.64968 0.633252C7.20523 0.833252 7.70523 1.13325 8.14968 1.53325C8.59412 1.93325 8.95801 2.43047 9.24134 3.02492C9.52468 3.61936 9.66634 4.31103 9.66634 5.09992C9.66634 6.14436 9.28023 7.21103 8.50801 8.29992C7.73579 9.38881 6.56634 10.511 4.99968 11.6666ZM4.99968 6.33325C5.36634 6.33325 5.68023 6.2027 5.94134 5.94159C6.20245 5.68047 6.33301 5.36658 6.33301 4.99992C6.33301 4.63325 6.20245 4.31936 5.94134 4.05825C5.68023 3.79714 5.36634 3.66658 4.99968 3.66658C4.63301 3.66658 4.31912 3.79714 4.05801 4.05825C3.7969 4.31936 3.66634 4.63325 3.66634 4.99992C3.66634 5.36658 3.7969 5.68047 4.05801 5.94159C4.31912 6.2027 4.63301 6.33325 4.99968 6.33325Z" fill="#ACACAC" />
  </svg>,
  "forkKnife": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.5 8.17993L4.125 8.08228C3.62973 7.95376 3.24289 7.69825 2.94629 7.31177C2.64666 6.92116 2.50006 6.4894 2.5 6.00024V1.83325H2.83301V5.83325H4.5V1.83325H4.83301V5.83325H6.5V1.83325H6.83301V6.00024C6.83294 6.48947 6.68643 6.92112 6.38672 7.31177C6.09005 7.69833 5.70342 7.95379 5.20801 8.08228L4.83301 8.17993V14.1663H4.5V8.17993ZM11.167 7.9563L10.8252 7.84204C10.3606 7.68716 9.96663 7.36068 9.65039 6.80981C9.33149 6.25416 9.16699 5.6159 9.16699 4.88306C9.16703 3.98692 9.4016 3.25792 9.84863 2.66821C10.2952 2.07924 10.7855 1.83335 11.333 1.83325C11.879 1.83325 12.3699 2.08008 12.8174 2.67505C13.2656 3.27107 13.5 4.00364 13.5 4.89966C13.5 5.63238 13.3354 6.2666 13.0176 6.81567C12.7019 7.36102 12.308 7.68663 11.8418 7.84204L11.5 7.9563V14.1663H11.167V7.9563Z" stroke="#ACACAC" />
  </svg>,
  "calender": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.33333 14.6666C2.96667 14.6666 2.65267 14.5361 2.39133 14.2753C2.13044 14.0139 2 13.6999 2 13.3333V3.99992C2 3.63325 2.13044 3.31947 2.39133 3.05859C2.65267 2.79725 2.96667 2.66659 3.33333 2.66659H4V1.33325H5.33333V2.66659H10.6667V1.33325H12V2.66659H12.6667C13.0333 2.66659 13.3473 2.79725 13.6087 3.05859C13.8696 3.31947 14 3.63325 14 3.99992V13.3333C14 13.6999 13.8696 14.0139 13.6087 14.2753C13.3473 14.5361 13.0333 14.6666 12.6667 14.6666H3.33333ZM3.33333 13.3333H12.6667V6.66659H3.33333V13.3333ZM3.33333 5.33325H12.6667V3.99992H3.33333V5.33325ZM3.33333 5.33325V3.99992V5.33325Z" fill="#ACACAC" />
  </svg>,
  "user": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
    <path d="M11.1133 6.75342C12.0266 7.37342 12.6666 8.21342 12.6666 9.33342V11.3334H15.3333V9.33342C15.3333 7.88008 12.9533 7.02008 11.1133 6.75342Z" fill="#ACACAC" />
    <path d="M9.99995 6.00008C11.4733 6.00008 12.6666 4.80675 12.6666 3.33341C12.6666 1.86008 11.4733 0.666748 9.99995 0.666748C9.68661 0.666748 9.39328 0.733415 9.11328 0.826748C9.66661 1.51341 9.99995 2.38675 9.99995 3.33341C9.99995 4.28008 9.66661 5.15341 9.11328 5.84008C9.39328 5.93341 9.68661 6.00008 9.99995 6.00008Z" fill="#ACACAC" />
    <path d="M6.00065 6.00008C7.47398 6.00008 8.66732 4.80675 8.66732 3.33341C8.66732 1.86008 7.47398 0.666748 6.00065 0.666748C4.52732 0.666748 3.33398 1.86008 3.33398 3.33341C3.33398 4.80675 4.52732 6.00008 6.00065 6.00008ZM6.00065 2.00008C6.73398 2.00008 7.33398 2.60008 7.33398 3.33341C7.33398 4.06675 6.73398 4.66675 6.00065 4.66675C5.26732 4.66675 4.66732 4.06675 4.66732 3.33341C4.66732 2.60008 5.26732 2.00008 6.00065 2.00008Z" fill="#ACACAC" />
    <path d="M6.00033 6.66675C4.22033 6.66675 0.666992 7.56008 0.666992 9.33341V11.3334H11.3337V9.33341C11.3337 7.56008 7.78032 6.66675 6.00033 6.66675ZM10.0003 10.0001H2.00033V9.34008C2.13366 8.86008 4.20033 8.00008 6.00033 8.00008C7.80032 8.00008 9.86699 8.86008 10.0003 9.33341V10.0001Z" fill="#ACACAC" />
  </svg>,



}

const RoomTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1rem auto auto;
  gap: 0.4rem;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  width: fit-content;
`;

const HotelBooking = ({
  key,
  index,
  booking,
  tripsPage,
  plan,
  token,
  payment,
  setShowLoginModal,
  cities,
  stayBookings,
  getPaymentHandler,
  _updateStayBookingHandler,
  _updatePaymentHandler,
  _updateBookingHandler,
  setHideBookingModal,
  _GetInTouch,
  CityData,
  start_date,
  setStayBookings,
  itinerary_city_id,
}) => {
  const router = useRouter();


  let isPageWide = media("(min-width: 768px)");
  const [imageFail, setImageFail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { hotels_status } = useSelector((state) => state.ItineraryStatus);
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [showFilter, setshowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [AddHotel, setAddHotel] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [images, setImages] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingFunData, setBookingFunData] = useState(null);
  const [dates, setDates] = useState({ check_in: "", check_out: "" });
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);


  const {
    drawer = null,
    booking_id = null,
    idx = null,
    city_id = null,
    itineraryCityId = null,
    clickType = null,
    check_in = null,
    check_out = null,
    duration = null,
    city_name = null,
  } = router.query;
  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDetails(false);
    setShowBookingModal(false);
  };

  function handleClick(i, id, data, city_id, check_in, check_out) {
    setShowDetails(true);
    setDates({ check_in, check_out });

    setBookingId(id);
    setCurrentBooking(data);
    setBookingFunData({ index: i, booking: data, city_id: city_id });
  }

  const starRating = (rating) => {
    var stars = getStars(rating);
    return stars;
  };

  function Addons(Shorthand) {
    switch (Shorthand) {
      case "EP":
        return "No Meals Included";
      case "CP":
        return "Complementary Breakfast Included";
      case "MAP":
        return "Breakfast and Lunch/Dinner Included";
      case "AP":
        return "All meals Included";
      case "TBO":
        return null;
      default:
        return null;
    }
  }


  const handleViewDetails = (value) => {
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showHotelDetail",
          idx: index,
          booking_id: booking.id,
          city_id: booking.city_id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
    handleBookedHotelViewDetails(index, booking.id, booking, booking.city_id);
    logEvent({
      action: "Hotel_Details",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "View Details",
        event_value: value,
        event_action: "Stays",
      },
    });
  };

  const handleChangeHotel = (e, label, value, clickType) => {
    e.stopPropagation();
    if (token) {
      router.push(
        {
          pathname: `/itinerary/${router.query.id}`,
          query: {
            drawer: "changeHotelBooking",
            clickType: clickType,
            itineraryCityId: itinerary_city_id,
            booking_id: booking.id,
            check_in: stayBookings[index]["check_in"],
            check_out: stayBookings[index]["check_out"],
            duration: booking?.duration,
            city_id: booking.city_id,
            city_name: stayBookings[index]["city_name"],
          },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
    if (token) handleClickAc(index, booking, booking.city_id, clickType);
    else setShowLoginModal(true);
    setBookingId(key);

    logEvent({
      action: "Hotel_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: value,
        event_action: "Stays",
      },
    });
  };

  let hotel_image = "";
  if (booking && booking?.images && booking?.images.length) {
    for (let i = 0; i < booking.images.length; i++) {
      if (booking.images[i]) {
        hotel_image = booking.images[i]?.image;
        break;
      }
    }
  }

  function formatDate(dateInput) {
    const date = new Date(dateInput);
    const options = { day: "2-digit", month: "long", year: "numeric" };

    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
      date
    );

    const day = date.getDate();
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = day + ordinalSuffix(day);

    return formattedDate.replace(day, dayWithSuffix);
  }

  function handleBookedHotelViewDetails(i, id, data, city_id) {
    setOpenViewDetails(true);
    setBookingId(id);
    setCurrentBooking(booking);
    setBookingFunData({ index: i, booking: data, city_id: city_id });
  }

  function handleClickAc(i, data, city_id, clickType) {
    let name = stayBookings[i]?.["name"];
    let itinerary_id = stayBookings[i]["itinerary_id"];
    let itinerary_name = stayBookings[i]["itinerary_name"];
    let accommodation = stayBookings[i]["accommodation"];
    let tailored_id = stayBookings[i]["tailored_itinerary"];
    let user_rating = stayBookings[i]?.star_category;
    let number_of_reviews = stayBookings[i]?.user_ratings_total;
    let id = stayBookings[i]["id"];
    let check_in = stayBookings[i]["check_in"];
    let check_out = stayBookings[i]["check_out"];
    let pax = {
      number_of_adults: stayBookings[i]["number_of_adults"],
      number_of_children: stayBookings[i]["number_of_children"],
      number_of_infants: stayBookings[i]["number_of_infants"],
    };
    let city = stayBookings[i]["city_name"];
    let cityId = city_id;
    let room_type = stayBookings[i]["room"];
    let occupancies = stayBookings[i]["occupancies"];
    _changeBookingHandler(
      name,
      itinerary_id,
      tailored_id,
      accommodation,
      id,
      check_in,
      check_out,
      pax,
      city,
      cityId,
      room_type,
      user_rating,
      number_of_reviews,
      itinerary_name,
      clickType,
      occupancies
    );
    const newData = booking;
    newData.clickType = clickType;
    setCurrentBooking(newData);
    setShowBookingModal(true);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "changeHotelBooking",
          clickType: clickType,
          itineraryCityId: itinerary_city_id,
          booking_id: booking.id,
          check_in: stayBookings[index]["check_in"],
          check_out: stayBookings[index]["check_out"],
          duration: booking?.duration,
          city_id: booking.city_id,
          city_name: stayBookings[index]["city_name"],
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  }

  const _setImagesHandler = (images) => {
    setImages(images);
  };

  const _changeBookingHandler = (
    name,
    itinerary_id,
    tailored_id,
    accommodation,
    id,
    check_in,
    check_out,
    pax,
    city,
    cityId,
    room_type,
    itinerary_name,
    cost,
    costings_breakdown,
    images,
    clickType,
    occupancies
  ) => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "Itinerary-bookings-acc_change",
          params: { name: name },
        });
    }

    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      accommodation: accommodation,
      id: id,
      tailored_id: tailored_id,
      check_in: format(new Date(check_in), "yyyy-MM-dd")?.replaceAll("-", "/"),
      check_out: format(new Date(check_out), "yyyy-MM-dd")?.replaceAll("-", "/"),
      pax: pax,
      city: city,
      cityId: cityId,
      room_type: room_type,

      itinerary_name: itinerary_name,
      cost: Math.round(cost),
      costings_breakdown: costings_breakdown,
      images: images,
      clickType: clickType,
      occupancies: occupancies,
    });
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setShowDetails(false);
  };

  return (
    <div className={`${!isPageWide ? "w-full" : "max-w-[54vw]"}`}>
      {hotels_status === "PENDING" ? (
        <div className="animate-pulse">
          {/* Skeleton loader for city name */}
          <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
            <div className="bg-gray-300 h-6 w-1/2 mb-2"></div>
            <span className="ml-1 bg-gray-200 h-4 w-12 inline-block"></span>
          </div>

          {/* Skeleton loader for hotel image */}
          <div className="relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3">
            <div className="relative flex lg:flex-row w-full flex-col gap-4">
              <div className="relative lg:h-[12rem] lg:w-[30%] w-full h-[12rem]">
                <div className="h-full w-full bg-gray-300 rounded-2xl"></div>
              </div>

              {/* Skeleton loader for hotel details */}
              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <div className="bg-gray-300 h-6 w-2/3"></div>
                    <div className="bg-gray-300 h-4 w-16"></div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-300 h-4 w-32 mb-1"></div>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="bg-gray-300 h-5 w-1/2"></div>
                      <div className="bg-gray-300 h-3 w-16"></div>
                    </div>
                  </div>

                  {/* Skeleton loader for trip info */}
                  {tripsPage && (
                    <div className="flex flex-row gap-2 items-center">
                      <div className="bg-gray-300 h-3 w-10"></div>
                      <div className="bg-gray-300 h-3 w-20"></div>
                    </div>
                  )}

                  {/* Skeleton loader for room and bed */}
                  <div className="flex flex-row gap-2 items-center my-0">
                    <div className="bg-gray-300 h-3 w-20"></div>
                  </div>

                  {/* Skeleton loader for meals and wifi */}
                  <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                    <div className="bg-gray-300 h-3 w-24"></div>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-end justify-end w-full">
                  <div className="bg-gray-300 h-8 w-24 rounded"></div>
                  <div className="bg-gray-300 h-8 w-24 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : booking?.id ? (
        <>
          <div className="text-black text-md-lg font-600 leading-xl-sm pb-md">
            {booking?.city_name || booking?.city || cities[index]?.city?.name}
            <span className="ml-1">
              (
              {booking?.duration
                ? booking.duration || cities[index]?.duration
                : cities[index]?.duration
                  ? cities[index]?.duration
                  : 1}
              N)
            </span>
          </div>

          <div
            onClick={handleViewDetails}
            className="rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite cursor-pointer"
          >
            <div className={`relative flex lg:flex-row w-full flex-col gap-4`}>
              <div
                className={`relative lg:h-[12rem] lg:w-[35%] w-full  h-[12rem]`}
              >
                <div style={{ display: imageLoaded ? "initial" : "none" }}>
                  <ImageLoader
                    dimensions={{ width: 400, height: 400 }}
                    dimensionsMobile={{ width: 400, height: 400 }}
                    borderRadius="16px"
                    hoverpointer
                    onclick={() => console.log("")}
                    width="100%"
                    height="100%"
                    leftalign
                    widthmobile="100%"
                    noLazy
                    url={
                      hotel_image && !imageFail
                        ? hotel_image
                        : "media/icons/bookings/notfounds/noroom.png"
                    }
                    onfail={() => {
                      setImageFail(true);
                      setImageLoaded(true);
                    }}
                    onload={() => {
                      setTimeout(() => {
                        setImageLoaded(true);
                      }, 1000);
                    }}
                  ></ImageLoader>
                </div>

                <div
                  style={{
                    height: "100%",
                    overflow: "hidden",
                    borderRadius: "16px",
                    display: !imageLoaded ? "block" : "none",
                  }}
                >
                  <Skeleton />
                </div>
                {booking?.star_category && booking?.star_category != "0" ? (
                  <div
                    starHotel
                    className={`bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md`}
                  >
                    {booking.star_category} star hotel
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <div className={`text-md-lg leading-xl-sm font-600 mb-0`}>
                      {booking?.name}
                    </div>

                    <div
                      className={`ml-auto text-md font-semibold ${booking?.user_selected
                        ? "text-[#277004]"
                        : "text-[#E00000]"
                        }`}
                    >
                      {/* {booking?.user_selected ? "Included" : "Excluded"} */}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className=" gap-2 flex flex-row items-center">    {svgIcons.loaction}
                      <div
                        className="text-sm-md text-text-spacegrey font-[400]"
                      >

                        {booking?.city_name || booking?.city}
                      </div>
                    </div>

                    {booking?.rating ? (
                      <div className="gap-1 flex flex-row  items-center">
                        <div className="flex flex-row text-[#FFD201]">
                          {starRating(booking.rating)}
                        </div>
                        <div>
                          {booking.rating}
                          {" . "}
                        </div>
                        {booking?.user_ratings_total ? (
                          <div className="text-sm-md text-text-spacegrey font-[400] underline">
                            {booking.user_ratings_total} reviews
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {tripsPage ? (
                    <div className="flex flex-row gap-2 items-center">
                      {svgIcons.calender}
                      <div className="text-sm-md text-text-spacegrey font-[400]">
                        {booking ? booking?.duration : 1} Nights stay
                      </div>

                      {booking?.number_of_adults ? (
                        <div className=" gap-2 flex flex-row items-center">
                          {svgIcons.user}
                          <div className="text-sm-md text-text-spacegrey font-[400] min-w-fit">
                            {booking.number_of_adults} Adults
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : booking?.check_in &&
                    ITINERARY_STATUSES.itinerary_prepared !==
                    plan?.itinerary_status ? (
                    <div className="flex flex-row gap-3 lg:mt-2 mt-0">
                      {booking.check_in && (
                        <div className="flex flex-row gap-2 items-center">
                          {/* <BsCalendar2 className="text-sm text-[#7A7A7A]" /> */}
                          {svgIcons.calender}
                          <div>
                            <div className="text-sm-md text-text-spacegrey font-[400]">
                              {getDate(booking.check_in)}-
                              {getDate(booking.check_out)}
                            </div>
                          </div>
                        </div>
                      )}

                      {booking?.number_of_adults ? (
                        <div className="text-sm-md text-text-spacegrey font-[400] gap-2 flex flex-row items-center">
                          {svgIcons.user}
                          <div className="text-sm-md text-text-spacegrey font-[400] min-w-fit">
                            {booking.number_of_adults} Adults{" "}
                            {booking?.number_of_children
                              ? booking?.number_of_children + " Children"
                              : null}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : null}

                  <RoomTypeGrid>
                    <BiBed className="text-md text-text-svgIconFill" />
                    <div className="text-sm-md text-text-spacegrey font-[400] line-clamp-1">
                      {booking?.room}
                    </div>
                    {/* <div>
                  {"("}
                  {booking?.room
                    ? booking.room
                    : 1}{" "}
                  {booking?.room > 1 ? "Rooms" : "Room"}
                  {")"}
                </div> */}
                  </RoomTypeGrid>

                  {booking?.number_of_extra_beds &&
                    booking?.number_of_extra_beds > 0 ? (
                    <div className="flex flex-row items-center my-0">
                      <BsPlus className="text-md text-[#7A7A7A]" />
                      <div className="text-sm-md text-text-spacegrey font-[400] line-clamp-1">
                        {booking?.number_of_extra_beds}{" "}
                        {booking?.number_of_extra_beds > 1
                          ? "Extra beds"
                          : "Extra bed"}
                      </div>
                    </div>
                  ) : null}

                  {booking.hotel_details &&
                    Addons(booking?.hotel_details?.pricing_type) ? (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      {svgIcons.forkKnife}
                      <div className="text-sm-md text-text-spacegrey font-[400]">
                        {Addons(booking?.hotel_details?.pricing_type)}
                      </div>
                    </div>
                  ) : null}

                  {booking && booking?.wifi && (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      <MdWifi className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm-md text-text-spacegrey font-[400]"> Free Wifi</div>
                    </div>
                  )}

                  {booking && booking?.meals && (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      {svgIcons.forkKnife}
                      <div className="text-sm-md text-text-spacegrey font-[400]"> {booking.meals}</div>
                    </div>
                  )}
                </div>

                <div
                  className={`hidden lg:!flex flex-row gap-2 items-end justify-end w-full ${payment?.paid_user || !payment?.user_allowed_to_pay
                    ? "lh:mb-0 mb-2"
                    : "lg:mb-0 mb-0"
                    }`}
                >
                  {isPageWide && (
                    <button
                      className="ttw-btn-secondary"
                      onClick={() => handleViewDetails(booking.name)}
                    >
                       Details
                    </button>
                  )}

                  {payment?.is_registration_needed ? null : (
                    // payment?.paid_user
                    // || !payment?.user_allowed_to_pay ? null
                    // :
                    <div>
                      <button className="ttw-btn-fill-yellow ">
                        Change
                      </button>
                    </div>
                  )}
                </div>
                <div className="lg:hidden pr-2 w-full">
                  <button
                    onClick={() => handleViewDetails(booking.name)}
                    className="ttw-btn-secondary max-ph:w-full"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite cursor-pointer">
            <div className="flex flex-col">
              <div className="font-medium  inline">
                <div className="text-black text-md-lg font-600 leading-xl-sm pb-xs">
                  <div>
                    {booking?.city_name ||
                      booking?.city ||
                      cities[index]?.city?.name}{" "}
                    <span>
                      ({booking?.duration || cities[index]?.duration}N)
                    </span>
                  </div>
                </div>
              </div>
              {booking?.check_in && (
                <div className="font-medium  inline">
                  <div className="flex flex-row gap-2 items-center max-ph:pb-sm">
                    {svgIcons.calender}
                    <div>
                      <div className="text-sm-md text-text-spacegrey font-[400]">
                        {booking?.check_in && formatDate(booking?.check_in)} -{" "}
                        {booking?.check_out && formatDate(booking?.check_out)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
            >
              <button
                className="ttw-btn-fill-yellow max-ph:w-full"
                onClick={(e) =>
                  handleChangeHotel(
                    e,
                    "Change",
                    booking?.city_name ||
                    booking?.city ||
                    cities[index]?.city?.name,
                    "Add"
                  )
                }>
                Add Stay in{" "}
                {booking?.city_name ||
                  booking?.city ||
                  cities[index]?.city?.name}
              </button>
            </div>
          </div>
        </div>
      )}

      <ViewHotelDetails
        mercury
        _setImagesHandler={_setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={bookingId}
        currentBooking={currentBooking}
        check_in={dates.check_in}
        check_out={dates.check_out}
        show={showDetails}
        payment={payment}
        plan={stayBookings}
        BookingButton={!isDateOlderThanCurrent(start_date) ? true : false}
        bookingFunData={bookingFunData}
        BookingButtonFun={() => {
          if (!localStorage.getItem("access_token")) {
            setShowLoginModal(true);
            return;
          }
          handleClickAc(
            bookingFunData.index,
            bookingFunData.booking,
            bookingFunData.city_id
          );
        }}
        provider={currentBooking?.source}
        setStayBookings={setStayBookings}
        setShowDetails={setShowDetails}
        CityData={CityData}
        handleCloseDrawer={handleCloseDrawer}
        setShowLoginModal={setShowLoginModal}
        handleClose={closeBookingModal}
        city_id={booking.city_id}
      ></ViewHotelDetails>
      {drawer === "showHotelDetail" && booking_id == booking?.id && (
        <>
          <AccommodationModal
            mercury
            _setImagesHandler={_setImagesHandler}
            onHide={() => setOpenViewDetails(false)}
            id={booking_id}
            currentBooking={currentBooking}
            check_in={dates.check_in}
            check_out={dates.check_out}
            show={booking_id == booking?.id}
            payment={payment}
            plan={stayBookings}
            BookingButton={!isDateOlderThanCurrent(start_date) ? true : false}
            bookingFunData={bookingFunData}
            handleClickAc={handleClickAc}
            index={idx}
            booking={bookingFunData?.booking}
            city_id={city_id || bookingFunData?.city_id}
            provider={currentBooking?.source}
            setStayBookings={setStayBookings}
            setShowDetails={setOpenViewDetails}
            CityData={CityData}
            handleCloseDrawer={handleCloseDrawer}
            setShowLoginModal={setShowLoginModal}
          />
        </>
      )}

      {drawer == "changeHotelBooking" &&
        itineraryCityId == itinerary_city_id && (
          <BookingModal
            mercury
            showFilter={showFilter}
            setshowFilter={setshowFilter}
            payment={payment}
            plan={stayBookings}
            _setImagesHandler={_setImagesHandler}
            getPaymentHandler={getPaymentHandler}
            _updateStayBookingHandler={_updateStayBookingHandler}
            tailored_id={
              stayBookings && stayBookings[0]
                ? stayBookings[0]["tailored_itinerary"]
                : null
            }
            _updatePaymentHandler={_updatePaymentHandler}
            _updateBookingHandler={_updateBookingHandler}
            selectedBooking={selectedBooking}
            setShowBookingModal={setShowBookingModal}
            currentBooking={currentBooking}
            showBookingModal={itineraryCityId == itinerary_city_id}
            setHideBookingModal={setHideBookingModal}
            AddHotel={AddHotel}
            _GetInTouch={_GetInTouch}
            handleClick={handleClick}
            stayBookings={stayBookings}
            setStayBookings={setStayBookings}
            CityData={CityData}
            onHide={() => {
              if (!drawer || itineraryCityId != itinerary_city_id) return;
              router.push(
                {
                  pathname: `/itinerary/${router?.query?.id}`,
                  query: {}, // remove "drawer"
                },
                undefined,
                { scroll: false }
              );
              setOpenViewDetails(false);
            }}
            itinerary_city_id={itinerary_city_id}
            clickType={clickType}
            check_in={check_in.split(" ")[0]}
            check_out={check_out.split(" ")[0]}
            duration={duration}
            city_id={city_id}
            city_name={city_name}
            booking_id={booking_id}
          ></BookingModal>
        )}

      {images ? (
        <FullScreenGallery
          mercury
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
    tripsPage: state.TripsPage,
    plan: state.Plan,
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(HotelBooking);
