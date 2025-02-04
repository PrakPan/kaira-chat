import React, { useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { BsCalendar2, BsPeopleFill, BsPlus } from "react-icons/bs";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { ImSpoonKnife } from "react-icons/im";
import Skeleton from "../../../components/ui/SkeletonCard";
import { getDate } from "../../../helper/ConvertDateFormat";
import Button from "../../../components/ui/button/Index";
import media from "../../../components/media";
import styled from "styled-components";
import { ITINERARY_STATUSES } from "../../../services/constants";
import { MdWifi } from "react-icons/md";
import { logEvent } from "../../../services/ga/Index";
import { connect } from "react-redux";

const RoomTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1rem auto 5.5rem;
  gap: 0.4rem;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  width: fit-content;
`;

const HotelBooking = ({
  index,
  booking,
  tripsPage,
  plan,
  token,
  payment,
  handleClick,
  handleClickAc,
  setShowLoginModal,
}) => {
  let isPageWide = media("(min-width: 768px)");
  const [imageFail, setImageFail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const starRating = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar />);
    }
    if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
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
    handleClick(index, booking.id, booking, booking.hotel_details.city);

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

  const handleChageHotel = (e, label, value) => {
    e.stopPropagation();
    if (token) handleClickAc(index, booking, booking.hotel_details.city);
    else setShowLoginModal(true);

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
  if (
    booking &&
    booking?.hotel_details?.images &&
    booking?.hotel_details?.images.length
  ) {
    for (let i = 0; i < booking.hotel_details.images.length; i++) {
      if (booking.hotel_details.images[i]) {
        hotel_image = booking.hotel_details.images[i];
        break;
      }
    }
  }

  return (
    <div>
      <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
        {booking.hotel_details?.city_name}
        <span className="ml-1">
          ({booking?.duration ? booking.duration : 1}N)
        </span>
      </div>

      <div
        onClick={handleViewDetails}
        className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3"
      >
        <div className={`relative flex lg:flex-row w-full flex-col gap-4`}>
          <div className={`relative lg:h-[12rem] lg:w-[30%] w-full  h-[12rem]`}>
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
            {booking.hotel_details?.star_category ? (
              <starHotel
                starHotel
                className={`text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-sm font-[400]nsition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl   absolute top-0 rounded-3xl`}
              >
                {booking.hotel_details.star_category} star hotel
              </starHotel>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <div className={`text-2xl font-semibold`}>{booking?.name}</div>

                <div
                  className={`ml-auto text-md font-semibold ${
                    booking?.user_selected ? "text-[#277004]" : "text-[#E00000]"
                  }`}
                >
                  {booking?.user_selected ? "Included" : "Excluded"}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div
                  className="text-sm font-normal"
                  style={{ marginTop: "-0.5rem" }}
                >
                  {booking?.hotel_details.city_name}
                </div>

                {booking?.rating && (
                  <div className="gap-1 flex flex-row  items-center">
                    <div className="flex flex-row text-[#FFD201]">
                      {starRating(booking.rating)}
                    </div>
                    <div>
                      {booking.rating}
                      {" . "}
                    </div>
                    {booking?.user_ratings_total && (
                      <div className="text-sm text-[#7A7A7A] font-[400] underline">
                        {booking.user_ratings_total}{" "}
                        {booking?.booking_source === "Agoda"
                          ? "user reviews"
                          : "Google reviews"}
                      </div>
                    )}
                  </div>
                )}
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
                        {booking.number_of_adults} Adults
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
                  {booking?.hotel_details?.room_type_name}
                </div>
                <div>
                  {"("}
                  {booking?.hotel_details?.room_count
                    ? booking.hotel_details.room_count
                    : 1}{" "}
                  {booking?.hotel_details?.room_count > 1 ? "Rooms" : "Room"}
                  {")"}
                </div>
              </RoomTypeGrid>

              {booking?.hotel_details?.number_of_extra_beds &&
              booking?.hotel_details?.number_of_extra_beds > 0 ? (
                <div className="flex flex-row items-center my-0">
                  <BsPlus className="text-md text-[#7A7A7A]" />
                  <div className="text-sm font-[400] line-clamp-1">
                    {booking?.hotel_details?.number_of_extra_beds}{" "}
                    {booking?.hotel_details?.number_of_extra_beds > 1
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

              {booking?.hotel_details?.amenities &&
              booking?.hotel_details?.amenities?.length &&
              booking?.hotel_details?.amenities?.includes("WIFI") ? (
                <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                  <MdWifi className="text-sm text-[#7A7A7A]" />
                  <div className="text-sm font-[400]">WIFI available</div>
                </div>
              ) : null}
            </div>

            <div
              className={`flex flex-row gap-2 items-end justify-end w-full ${
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

              {payment?.is_registration_needed ? null : payment?.paid_user ||
                !payment?.user_allowed_to_pay ? null : (
                <div
                  onClick={(e) => handleChageHotel(e, "Change", booking?.name)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    tripsPage: state.TripsPage,
    plan: state.Plan,
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(HotelBooking);
