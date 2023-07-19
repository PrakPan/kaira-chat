import React, { useEffect, useState } from 'react';
import ImageLoader from '../../../components/ImageLoader';
import StarRating from '../../../components/StarRating';
import { BsCalendar2, BsPeopleFill, BsPlus } from 'react-icons/bs';
import { FaBed, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { BiBed } from 'react-icons/bi';
import { ImSpoonKnife } from 'react-icons/im';
import {
  getDate,
  convertDateYearFormat,
} from '../../../helper/ConvertDateFormat';
import ButtonYellow from '../../../components/ButtonYellow';

import styled from 'styled-components';
import { getIndianPrice } from '../../../services/getIndianPrice';
import DropDown from '../../../components/modals/bookingupdated/new-accommodation-searched/Dropdown';
import CheckboxFormComponent from '../../../components/FormComponents/CheckboxFormComponent';
import useMediaQuery from '../../../hooks/useMedia';
import { getHumanDate } from '../../../services/getHumanDate';
import { ITINERARY_STATUSES } from '../../../services/constants';
import { PulseLoader } from 'react-spinners';
import { MdHotel } from 'react-icons/md';
import {BiDollarCircle} from 'react-icons/bi'
const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const HotelBookingContainer = ({
  SelectedBookingin,
  currentBooking,
  booking,
  index,

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

  // const AddbookingStatus = (booking) => {
  //   if (booking?.version == 'v2') {
  //     if (booking?.status == 'BOOKING_EXPIRED') {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   } else {
  //     return !currentBooking ? booking?.user_selected : true;
  //   }
  // };

  // const [addbooking, setaddboking] = useState(AddbookingStatus(booking));
  // console.log('addbooking', addbooking);
  // const [expiredBooking, setexpiredBooking] = useState(
  //   booking?.status == 'BOOKING_EXPIRED' ? true : false
  // );

  const [isSelect, setisSelect] = useState(booking?.user_selected);
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
      case 'EP':
        return 'No Meals Included';
      case 'CP':
        return 'Complementary Breakfast Included';
      case 'MAP':
        return 'Breakfast and Lunch/Dinner Included';
      case 'AP':
        return 'All meals Included';
      case 'TBO':
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
  // if (booking) {
  //   for (var i = 0; i < booking.rooms_available.length; i++) {
  //     if (booking.rooms_available[i].prices.min_price) {
  //       room.push(booking.rooms_available[i].room_type);
  //     }
  //   }
  // }
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
    });
  }
  const isMobile = useMediaQuery('(min-width:768px)');
  return (
    <div id={city_id} className={`flex gap-1 pt-4  flex-col justify-start `}>
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

          <div
            id={booking?.id}
            className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3 "
          >
            <div
              onClick={() => {
                currentBooking
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
                {booking?.images[0]?.image ? (
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
                    url={booking.images[0]?.image}
                  ></ImageLoader>
                ) : (
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
                    url={"media/website/grey.png"}
                  ></ImageLoader>
                )}
                {booking.star_category ? (
                  <starHotel
                    starHotel
                    className={`text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-sm font-[400]nsition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl   absolute top-0 rounded-3xl`}
                  >
                    {booking.star_category} star hotel
                  </starHotel>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[55%] w-full  justify-between">
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
                        <div className="text-sm font-normal">
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
                          <div>{booking?.user_rating}</div>
                          {booking.number_of_reviews && (
                            <div className="text-sm text-[#7A7A7A] font-[400] underline">
                              {booking.number_of_reviews} Google reviews
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
                    plan.itinerary_status ? (
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

                      <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                        <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                        <div className="text-sm font-[400] min-w-fit">
                          {booking.number_of_adults
                            ? booking.number_of_adults
                            : currentBooking.number_of_adults}{" "}
                          Adults
                        </div>
                      </div>
                    </div>
                  ) : (
                    currentBooking &&
                    ITINERARY_STATUSES.itinerary_prepared !==
                      plan.itinerary_status && (
                      <div className="flex flex-row gap-3 lg:mt-2 mt-0">
                        {currentBooking.check_in && (
                          <div className="flex flex-row gap-2 items-center">
                            <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                            <div>
                              <div className="text-sm font-[400] ">
                                {getDate(currentBooking.check_in)}-
                                {getDate(currentBooking.check_out)}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                          <div className=" text-sm font-[400] min-w-fit">
                            {booking.number_of_adults
                              ? booking.number_of_adults
                              : currentBooking.number_of_adults}{" "}
                            Adults
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {booking.costings_breakdown ? (
                    <>
                      <div className={`flex ${"flex-row"} gap-3 lg:mt-2 mt-0`}>
                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BiBed className="text-sm text-[#7A7A7A]" />
                          <div className="text-sm font-[400] line-clamp-1">
                            {booking.costings_breakdown[0].room_type}
                          </div>
                          <div>
                            {"( "}
                            {booking.costings_breakdown[0].number_of_rooms}{" "}
                            {booking.costings_breakdown[0].number_of_rooms > 1
                              ? "Rooms"
                              : "Room"}
                            {" )"}
                          </div>
                        </div>
                      </div>
                      {booking.costings_breakdown[0].number_of_extra_beds &&
                      booking.costings_breakdown[0].number_of_extra_beds>0 ? (
                        <div className="flex flex-row items-center lg:my-0 my-2">
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
                    booking?.room_count && (
                      <div className={`flex ${"flex-row"} gap-3 lg:mt-2 mt-0`}>
                        {booking?.room_count && (
                          <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                            <BiBed className="text-sm text-[#7A7A7A]" />
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking?.room_count} room options
                            </div>
                          </div>
                        )}
                      </div>
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
                </div>

                {currentBooking && booking?.price && (
                  <div className="flex flex-row gap-1 items-center w-full font-bold">
                    <div className="text-2xl font-bold">
                      {"₹ " + getIndianPrice(Math.round(booking?.price))}
                    </div>
                    <div className="font-normal text-base self-end">
                      for {currentBooking?.duration} Nights
                    </div>
                  </div>
                )}
                {handleClick && (
                  <div
                    className={`flex flex-row gap-3 items-center justify-between w-full ${
                      payment?.paid_user || !payment?.user_allowed_to_pay
                        ? "lh:mb-0 mb-2"
                        : "lg:mb-0 mb-0"
                    }`}
                  >
                    {/* <ButtonYellow
                  className=" w-1/2"
                  onClick={() =>
                    handleClick(index, booking.accommodation, booking)
                  }
                >
                  <div className="text-[#01202B] ">View Detail</div>
                </ButtonYellow> */}
                    {payment?.is_registration_needed ? null : token ? (
                      payment?.paid_user ||
                      !payment?.user_allowed_to_pay ? null : (
                        <ButtonYellow
                          className="w-1/2"
                          onClick={() => {
                            handleClickAc(index, booking, city_id);
                          }}
                        >
                          <div className="text-[#01202B] ">
                            {!isSelect ? "Add Hotel" : "Change"}
                          </div>
                        </ButtonYellow>
                      )
                    ) : (
                      <ButtonYellow
                        className="w-1/2"
                        onClick={() => {
                          setShowLoginModal(true);
                        }}
                      >
                        <div className="text-[#01202B] ">
                          {!isSelect ? "Add Hotel" : "Change"}
                        </div>
                      </ButtonYellow>
                    )}

                    {/* <div
                  onClick={(e) => {
                    handleCheckboxChange(e);
                  }}
                  className="flex flex-row gap-3 items-center cursor-pointer"
                >
                  <CheckboxFormComponent checked={addbooking} />
                  <label>{addbooking ? 'Added Booking' : 'Add Booking'}</label>
                </div> */}
                  </div>
                )}
              </div>
            </div>

            {/* <ClippathComp className="absolute text-sm font-bold bg-yellow-400 text-#090909 pl-12   pr-4 py-1 top-6 right-3 -m-3">
        TTW Recommendation
      </ClippathComp> */}

            {!currentBooking && (
              <div>
                {/* {isMobile && (
                <div>
                  {addbooking ? (
                    <div className="absolute text-sm font-bold  text-[#277004] lg:top-6 top-[14rem] right-8 -m-3">
                      Included
                    </div>
                  ) : (
                    <div className="absolute text-sm font-bold text-[#E00000] lg:top-6 top-[14rem] right-8 -m-3">
                      Excluded
                    </div>
                  )}
                </div>
              )} */}

                {isSelect && payment?.user_allowed_to_pay && (
                  <div
                    className={`absolute  ${
                      SelectedBookingin
                        ? "lg:bottom-4 bottom-[1.5rem] "
                        : `${
                            payment?.paid_user || !payment?.user_allowed_to_pay
                              ? "lg:bottom-10 bottom-[1.2rem]"
                              : "lg:bottom-10 bottom-[1.2rem]"
                          }`
                    } right-6 -m-3`}
                  >
                    {loading && (
                      <PulseLoader
                        style={{
                          position: "absolute",
                          top: "-15%",
                          left: "50%",
                          transform: "translate(-50% , -50%)",
                        }}
                        size={12}
                        speedMultiplier={0.6}
                        color="#111"
                      />
                    )}
                    <div
                      onClick={(e) => {
                        handleCheckboxChange(e);
                      }}
                      className="flex flex-row gap-1 items-center  cursor-pointer"
                    >
                      <CheckboxFormComponent checked={isSelect} />
                      <label className="text-center">
                        {isSelect ? "Added Booking" : "Add Booking"}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
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

            <div
              className="px-4 lg:mt-0 mt-2 lg:w-[35%] flex justify-center items-center bg-[#F7E700] py-[11px] cursor-pointer rounded-lg shadow-sm  border-2 border-black  text-black font-medium text-sm"
              onClick={() => {
                handleClickAc(index, cityData, city_id);
              }}
            >
              <div className="text-[#01202B] ">Add Stay in {cityName}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelBookingContainer;
