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
import { getHumanDate } from "../../../services/getHumanDate";

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
  setBookingId,
  index,
  booking,
  tripsPage,
  plan,
  token,
  payment,
  handleClick,
  handleClickAc,
  setShowLoginModal,
  setShowDetails
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
    handleClick(index, booking.id, booking, booking.city_name);

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

  const handleChangeHotel = (e, label, value,clickType) => {
    // console.log("clicktype is:",clickType)
    e.stopPropagation();
    if (token) handleClickAc(index, booking, booking.city_id,clickType);
    else setShowLoginModal(true);
    setBookingId(key)

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
    booking?.images &&
    booking?.images.length
  ) {
    for (let i = 0; i < booking.images.length; i++) {
      if (booking.images[i]) {
        hotel_image = booking.images[i]?.image;
        break;
      }
    }
  }


  return (
    <div className={`${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}>
      {booking?.user_ratings_total && booking?.id?
      <>
      <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
        {booking?.city_name}
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
            {(booking?.star_category && booking?.star_category!="0") ? (
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
                <div className={`text-2xl font-semibold`}>{booking?.name}</div>

                <div
                  className={`ml-auto text-md font-semibold ${
                    booking?.user_selected ? "text-[#277004]" : "text-[#E00000]"
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
                  {booking?.city_name}
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
                        {booking.user_ratings_total} reviews
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

              {booking &&
              booking?.wifi && (
                <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                  <MdWifi className="text-sm text-[#7A7A7A]" />
                  <div className="text-sm font-[400]"> Free Wifi</div>
                </div>
              )}

              {booking &&
              booking?.meals && (
                <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                  <ImSpoonKnife className="text-sm text-[#7A7A7A]" />
                  <div className="text-sm font-[400]"> {booking.meals}</div>
                </div>
              )}
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

              {payment?.is_registration_needed ? null : 
              // payment?.paid_user 
              // || !payment?.user_allowed_to_pay ? null 
              // : 
              (
                <div
                  onClick={(e) => handleChangeHotel(e, "Change", booking?.name)}
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
      </>:
      <div>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] p-3 ">
            <div className="flex flex-col">
              <div className="font-medium  inline">
                <div className="font-bold flex flex-row lg:text-2xl text-xl lg:pb-2 pb-1 text-[#01202B]">
                  <div>
                    {booking?.city_name}{" "}
                    <span>({booking?.duration}N)</span>
                  </div>
                </div>
              </div>
              {booking?.check_in && (
                <div className="font-medium  inline">
                  <div className="flex flex-row gap-2 items-center">
                    <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                    <div>
                      <div className="text-sm font-[400] ">
                        {getHumanDate(booking?.check_in)} -{" "}
                        {getHumanDate(booking?.check_out)}
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
                  onClick={(e) => handleChangeHotel(e, "Change", booking?.city_name,"Add")}
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
              Add Stay in {booking?.city_name}
            </Button>
            </div>
          </div>
        </div>}
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
