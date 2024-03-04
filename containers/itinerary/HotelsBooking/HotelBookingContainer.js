import React, { useEffect, useState } from "react";
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
import { getIndianPrice } from "../../../services/getIndianPrice";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import useMediaQuery from "../../../hooks/useMedia";
import { getHumanDate } from "../../../services/getHumanDate";
import { ITINERARY_STATUSES } from "../../../services/constants";
import { MdWifi } from "react-icons/md";
import { logEvent } from "../../../services/ga/Index";

const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;

const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const RoomTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1rem auto 5.5rem;
  gap: 0.4rem;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  width: fit-content;
`;

const HotelBookingContainer = ({
  SelectedBookingin,
  currentBooking,
  booking,
  index,
  banner_image,
  handleClick,
  handleClickAc,
  cityName,
  _updateSearchedAccommodation,
  _SelectedBookingHandler,
  itinerary_id,
  alternates,
  cityData,
  city_id,
  setShowLoginModal,
  tailored_id,
  openDetails,
  loginModal,
  payment,
  selectedBooking,
  setLoginModal,
  token,
  plan,
}) => {
  let isDesktop = media("(min-width: 1147px)");
  let isPageWide = media("(min-width: 768px)");
  const [isSelect, setisSelect] = useState(booking?.user_selected);
  const [imageFail, setImageFail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSearchedBooking, setisSearchedBooking] = useState(
    booking?.user_selected ? false : true
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setisSelect(booking?.user_selected);
    setisSearchedBooking(booking?.user_selected ? false : true);
  }, [booking]);

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

  const starRating = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar />);
    }
    if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
    return stars;
  };

  const noOfWords = (sentence, number) => {
    if (sentence) {
      const words = sentence.toString().trim().split(/\s+/);
      if (words.length > number) {
        return true;
      } else {
        return false;
      }
    }
  };

  let room = [];
  function handleCheckboxChange(e) {
    if (!payment?.is_registration_needed) {
      if (token) {
        setLoading(true);
        _SelectedBookingHandler({
          SelectedBookingId: selectedBooking?.id,
          itinerary_id: itinerary_id,
          tailored_id: tailored_id,
          user_selected: isSelect,
          index: index,
          check_in: selectedBooking?.check_in,
          check_out: selectedBooking?.check_out,
        })
          .then((data) => {
            setLoading(false);

            setisSelect(false);
            // Handle success
            // Access the response data using 'data'
          })
          .catch((error) => {
            setLoading(false);

            // Handle failure
            // Access the error object using 'error'
          });

        e.stopPropagation();
      } else {
        setLoginModal(!loginModal);
      }
    }
  }

  function handleSelectChange() {
    setisSelect(!isSelect);
  }

  function _handleUpdateChange(e) {
    e.stopPropagation();
    handleSelectChange();
    _updateSearchedAccommodation({
      SelectedBookingId: selectedBooking?.id,
      Selected_id: booking?.id,
      itinerary_id: itinerary_id,
      result_index: booking?.result_index,
      category_id: booking?.category_id,
      check_in: selectedBooking?.check_in,
      check_out: selectedBooking?.check_out,
      source: booking?.source,
    });
  }

  const handleViewDetails = (value) => {
    logEvent({
      action: "Hotel Details",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "View Details",
        event_value: value,
        event_action: "Stays",
      },
    });

    handleClick(index, booking.accommodation, booking);
  };

  const handleChageHotel = (e, label, value) => {
    e.stopPropagation();

    logEvent({
      action: "Hotel Add/Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: value,
        event_action: "Stays",
      },
    });

    if (token) handleClickAc(index, booking, city_id);
    else setShowLoginModal(true);
  };

  const handleAddStay = (label, value) => {
    logEvent({
      action: "Hotel Add/Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: value,
        event_action: "Stays",
      },
    });

    handleClickAc(index, cityData, city_id);
  };

  const isMobile = useMediaQuery("(min-width:768px)");
  let img = "";
  if (banner_image) img = banner_image;
  if (booking && booking.images && booking.images.length && !banner_image)
    for (let i = 0; i < booking.images.length; i++) {
      if (booking.images[i].image) {
        img = booking.images[i].image;
        break;
      }
    }

  return (
    <div
      id={booking?.id}
      className={`flex gap-1 pt-4  flex-col justify-start `}
    >
      {booking ? (
        <div>
          <div>
            {handleClick && (
              <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
                {cityName ? cityName : booking?.city}{" "}
                <span>({booking ? booking?.duration : 1}N)</span>
              </div>
            )}
          </div>

          <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3">
            <div
              onClick={() => {
                currentBooking || SelectedBookingin
                  ? openDetails()
                  : handleClick(index, booking.accommodation, booking, city_id);
              }}
              className={`relative flex lg:flex-row w-full flex-col gap-4  ${
                isSelect || isSearchedBooking ? "grayscale-0" : "grayscale"
              } `}
            >
              <div
                className={`relative  ${
                  currentBooking
                    ? "lg:h-[12rem]"
                    : `${handleClick ? "lg:h-[15rem]" : "lg:h-[12rem]"}`
                }  lg:w-[30%] w-full  h-[12rem]`}
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
                      img && !imageFail
                        ? img
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
                {booking.star_category ? (
                  <starHotel
                    starHotel
                    className={`text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-sm font-[400]nsition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl   absolute top-0 rounded-3xl`}
                  >
                    {booking.star_category} star hotel
                  </starHotel>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                <div className="flex flex-col gap-2">
                  <div
                    className={`${
                      currentBooking ? "text-lg" : "text-2xl"
                    } font-semibold `}
                  >
                    {booking?.name}
                  </div>
                  {booking && (
                    <div className="flex flex-col gap-1">
                      {!currentBooking && (
                        <div
                          className="text-sm font-normal"
                          style={{ marginTop: "-0.5rem" }}
                        >
                          {booking?.city}
                        </div>
                      )}
                      {booking?.addr1 && (
                        <div className="text-sm font-normal line-clamp-2">
                          {booking?.addr1}
                        </div>
                      )}

                      {booking?.user_rating && (
                        <div className="gap-1 flex flex-row  items-center">
                          <div className="flex flex-row text-[#FFD201]">
                            {starRating(booking?.user_rating)}
                          </div>
                          <div>
                            {booking?.user_rating}
                            {" . "}
                          </div>
                          {booking.number_of_reviews && (
                            <div className="text-sm text-[#7A7A7A] font-[400] underline">
                              {booking.number_of_reviews}{" "}
                              {booking?.source === "Agoda"
                                ? "user reviews"
                                : "Google reviews"}
                            </div>
                          )}
                        </div>
                      )}
                      {booking?.rating_ext ? (
                        <div className="gap-1 flex flex-row  items-center">
                          <div className="flex flex-row text-[#FFD201]">
                            {starRating(booking?.rating_ext)}
                          </div>
                          <div>{booking?.rating_ext}</div>
                          {booking?.num_reviews_ext && (
                            <div className="text-sm text-[#7A7A7A] font-[400] underline">
                              {booking?.num_reviews_ext} User reviews
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                  {booking.check_in &&
                  ITINERARY_STATUSES.itinerary_prepared !==
                    plan?.itinerary_status ? (
                    <div className="flex flex-row gap-3 lg:mt-2 mt-0">
                      {booking.check_in && (
                        <div className="flex flex-row gap-2 items-center">
                          <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                          <div>
                            <div className="text-sm font-[400] ">
                              {getDate(booking.check_in)}-
                              {getDate(booking.check_out)}
                            </div>
                          </div>
                        </div>
                      )}

                      {booking?.number_of_adults ||
                      currentBooking?.number_of_adults ? (
                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                          <div className="text-sm font-[400] min-w-fit">
                            {booking?.number_of_adults
                              ? booking?.number_of_adults
                              : currentBooking?.number_of_adults}{" "}
                            Adults
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    currentBooking &&
                    ITINERARY_STATUSES.itinerary_prepared !==
                      plan.itinerary_status && (
                      <div className="flex flex-row gap-3 lg:mt-2 mt-0">
                        {currentBooking?.check_in && (
                          <div className="flex flex-row gap-2 items-center">
                            <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                            <div>
                              <div className="text-sm font-[400] ">
                                {getDate(currentBooking?.check_in)}-
                                {getDate(currentBooking?.check_out)}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                          <div className=" text-sm font-[400] min-w-fit">
                            {booking.number_of_adults
                              ? booking.number_of_adults
                              : currentBooking?.number_of_adults}{" "}
                            Adults
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {booking.costings_breakdown ? (
                    <>
                      <RoomTypeGrid>
                        <BiBed className="text-sm text-[#7A7A7A]" />
                        <div className="text-sm font-[400] line-clamp-1">
                          {booking.costings_breakdown[0].room_type}
                        </div>
                        <div>
                          {"("}
                          {booking.costings_breakdown[0].number_of_rooms}{" "}
                          {booking.costings_breakdown[0].number_of_rooms > 1
                            ? "Rooms"
                            : "Room"}
                          {")"}
                        </div>
                      </RoomTypeGrid>

                      {booking.costings_breakdown[0].number_of_extra_beds &&
                      booking.costings_breakdown[0].number_of_extra_beds > 0 ? (
                        <div className="flex flex-row items-center my-0">
                          <BsPlus className="text-md text-[#7A7A7A]" />
                          <div className="text-sm font-[400] line-clamp-1">
                            {/* Extra beds cost - ₹
                          {booking.costings_breakdown[0].price * booking.costings_breakdown[0].extra_bed_percent_cost * 0.01}
                          /- */}
                            {booking.costings_breakdown[0].number_of_extra_beds}{" "}
                            {booking.costings_breakdown[0]
                              .number_of_extra_beds > 1
                              ? "Extra beds"
                              : "Extra bed"}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    (booking?.room_count || booking.room_type_name) && (
                      <>
                        <div
                          className={`flex ${"flex-row"} gap-3 lg:mt-2 mt-0`}
                        >
                          <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                            <BiBed className="text-sm text-[#7A7A7A]" />
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking.source &&
                              booking.source === "Agoda" &&
                              booking.room_type_name ? (
                                <>{booking.room_type_name}</>
                              ) : (
                                <> {booking?.room_count} room options</>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )}
                  {booking.costings_breakdown &&
                  Addons(booking.costings_breakdown[0].pricing_type) ? (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      <ImSpoonKnife className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400]">
                        {Addons(booking.costings_breakdown[0].pricing_type)}
                      </div>
                    </div>
                  ) : null}
                  {booking.amenities &&
                  booking.amenities.length &&
                  booking.amenities.includes("WIFI") ? (
                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                      <MdWifi className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400]">WIFI available</div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                {currentBooking && booking?.price && (
                  <div className="flex flex-row gap-1 items-center w-full font-bold">
                    <div className="text-2xl font-bold">
                      {booking.source === "Agoda"
                        ? "₹" +
                          getIndianPrice(Math.round(+booking.price / 100)) +
                          "/-"
                        : "₹" +
                          getIndianPrice(Math.round(booking?.price)) +
                          "/-"}
                    </div>
                    <div
                      className="font-normal text-base self-end"
                      style={{
                        height: "auto",
                        marginBottom: "0.15rem",
                        fontWeight: 300,
                      }}
                    >
                      {booking.source === "Agoda" ? (
                        <>per night</>
                      ) : (
                        <>for {currentBooking?.duration} Nights</>
                      )}
                    </div>
                  </div>
                )}
                {handleClick && (
                  <div
                    className={`flex flex-row gap-2 items-end justify-end w-full ${
                      payment?.paid_user || !payment?.user_allowed_to_pay
                        ? "lh:mb-0 mb-2"
                        : "lg:mb-0 mb-0"
                    }`}
                  >
                    {isDesktop && (
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
                        onClick={(e) =>
                          handleChageHotel(
                            e,
                            `${!isSelect ? "Add Hotel" : "Change"}`,
                            booking.name
                          )
                        }
                      >
                        <Button
                          padding="0.6rem 2.2rem"
                          bgColor={"#F7E700"}
                          borderRadius="8px"
                          fontWeight="400"
                          onclick={() => console.log("")}
                        >
                          {!isSelect ? "Add Hotel" : "Change"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {currentBooking && (
              <div className="absolute  bottom-[28px] right-8 -m-3">
                {alternates ? (
                  <div className="">
                    <div
                      fontSize="1rem"
                      fontSizeDesktop="1.25rem"
                      onClick={(e) => {
                        e.stopPropagation();
                        _updateSearchedAccommodation;
                      }}
                      onclickparam={{
                        alternates: alternates,
                        new_booking: booking,
                        itinerary_id: itinerary_id,
                        tailored_id: tailored_id,
                      }}
                    >
                      Select
                    </div>
                  </div>
                ) : (
                  <div
                    className=" z-50"
                    onClick={(e) => _handleUpdateChange(e)}
                  >
                    <div className="flex flex-row gap-1 items-center justify-center  cursor-pointer">
                      <CheckboxFormComponent
                        checked={isSelect}
                        className="mb-0"
                      />
                      <label className="text-center">
                        {isSelect ? "Selected" : "Select"}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] p-3 ">
            <div className="flex flex-col">
              {/* <div className="text-2xl">Add Stay in {cityName}</div> */}
              <div className="font-medium  inline">
                <div className="font-bold flex flex-row lg:text-2xl text-xl lg:pb-2 pb-1 text-[#01202B]">
                  <div>
                    {cityName ? cityName : cityData?.city}{" "}
                    <span>({cityData ? cityData?.duration : 1}N)</span>
                  </div>
                </div>
              </div>
              {cityData?.checkin_date && (
                <div className="font-medium  inline">
                  <div className="flex flex-row gap-2 items-center">
                    <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                    <div>
                      <div className="text-sm font-[400] ">
                        {getHumanDate(cityData?.checkin_date)} -{" "}
                        {getHumanDate(cityData?.checkout_date)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              bgColor={"#F7E700"}
              borderRadius="8px"
              fontWeight="400"
              padding="0.6rem 2.2rem"
              hoverColor="white"
              margin={!isPageWide ? "0.75rem 0 0 0" : "0"}
              onclick={() => handleAddStay(`Add Stay in ${cityName}`, cityName)}
            >
              Add Stay in {cityName}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelBookingContainer;
