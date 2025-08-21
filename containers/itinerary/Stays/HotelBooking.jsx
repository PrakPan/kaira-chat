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
          <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
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
            className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3"
          >
            <div className={`relative flex lg:flex-row w-full flex-col gap-4`}>
              <div
                className={`relative lg:h-[12rem] lg:w-[30%] w-full  h-[12rem]`}
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
                    className={`text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-sm font-[400]nsition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl   absolute top-0 rounded-3xl`}
                  >
                    {booking.star_category} star hotel
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <div className={`text-2xl font-semibold`}>
                      {booking?.name}
                    </div>

                    <div
                      className={`ml-auto text-md font-semibold ${
                        booking?.user_selected
                          ? "text-[#277004]"
                          : "text-[#E00000]"
                      }`}
                    >
                      {/* {booking?.user_selected ? "Included" : "Excluded"} */}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div
                      className="text-sm font-normal"
                      style={{ marginTop: "-0.5rem" }}
                    >
                      {booking?.city_name || booking?.city}
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
                          <div className="text-sm text-[#7A7A7A] font-[400] underline">
                            {booking.user_ratings_total} reviews
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {tripsPage ? (
                    <div className="flex flex-row gap-2 items-center">
                      <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400]">
                        {booking ? booking?.duration : 1} Nights stay
                      </div>

                      {booking?.number_of_adults ? (
                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                          <div className="text-sm font-[400] min-w-fit">
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
                          <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                          <div>
                            <div className="text-sm font-[400]">
                              {getDate(booking.check_in)}-
                              {getDate(booking.check_out)}
                            </div>
                          </div>
                        </div>
                      )}

                      {booking?.number_of_adults ? (
                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                          <div className="text-sm font-[400] min-w-fit">
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
                    <BiBed className="text-sm text-[#7A7A7A]" />
                    <div className="text-sm font-[400] line-clamp-1">
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
                      <div className="text-sm font-[400] line-clamp-1">
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
                      <ImSpoonKnife className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400]">
                        {Addons(booking?.hotel_details?.pricing_type)}
                      </div>
                    </div>
                  ) : null}

                  {booking && booking?.wifi && (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      <MdWifi className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400]"> Free Wifi</div>
                    </div>
                  )}

                  {booking && booking?.meals && (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      <ImSpoonKnife className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400]"> {booking.meals}</div>
                    </div>
                  )}
                </div>

                <div
                  className={`hidden lg:!flex flex-row gap-2 items-end justify-end w-full ${
                    payment?.paid_user || !payment?.user_allowed_to_pay
                      ? "lh:mb-0 mb-2"
                      : "lg:mb-0 mb-0"
                  }`}
                >
                  {isPageWide && (
                    <Button
                      padding="0.6rem 2.2rem"
                      borderRadius="8px"
                      hoverColor="white"
                      fontWeight="400"
                      onclick={() => handleViewDetails(booking.name)}
                    >
                      View Detail
                    </Button>
                  )}

                  {payment?.is_registration_needed ? null : (
                    // payment?.paid_user
                    // || !payment?.user_allowed_to_pay ? null
                    // :
                    <div
                      onClick={(e) =>
                        handleChangeHotel(e, "Change", booking?.name)
                      }
                    >
                      <Button
                        padding="0.6rem 2.2rem"
                        bgColor={"#F7E700"}
                        borderRadius="8px"
                        fontWeight="400"
                        onclick={() => console.log("")}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                <div className="lg:hidden pr-2 w-full">
                  <button
                    onClick={() => handleViewDetails(booking.name)}
                    className=" mt-2 w-full text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] p-3 ">
            <div className="flex flex-col">
              <div className="font-medium  inline">
                <div className="font-bold flex flex-row lg:text-2xl text-xl lg:pb-2 pb-1 text-[#01202B]">
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
                  <div className="flex flex-row gap-2 items-center">
                    <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                    <div>
                      <div className="text-sm font-[400] ">
                        {booking?.check_in && formatDate(booking?.check_in)} -{" "}
                        {booking?.check_out && formatDate(booking?.check_out)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={(e) =>
                handleChangeHotel(
                  e,
                  "Change",
                  booking?.city_name ||
                    booking?.city ||
                    cities[index]?.city?.name,
                  "Add"
                )
              }
            >
              <Button
                bgColor={"#F7E700"}
                borderRadius="8px"
                fontWeight="400"
                padding="0.6rem 2.2rem"
                hoverColor="white"
                margin={!isPageWide ? "0.75rem 0 0 0" : "0"}
                onclick={() => console.log("")}
              >
                Add Stay in{" "}
                {booking?.city_name ||
                  booking?.city ||
                  cities[index]?.city?.name}
              </Button>
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
            // {() => {
            //   handleClickAc(
            //     bookingFunData.index,
            //     bookingFunData.booking,
            //     bookingFunData.city_id
            //   );
            // }}
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
