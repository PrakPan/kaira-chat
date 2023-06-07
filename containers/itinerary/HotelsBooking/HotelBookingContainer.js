import React, { useEffect, useState } from 'react';
import ImageLoader from '../../../components/ImageLoader';
import StarRating from '../../../components/StarRating';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
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

const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const HotelBookingContainer = ({
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
  tailored_id,
  openDetails,
  loginModal,
  setLoginModal,
  token,
}) => {
  const [addbooking, setaddboking] = useState(
    !currentBooking ? booking?.user_selected : true
  );
  const [isSelect, setisSelect] = useState(booking?.user_selected);

  function Addons(Shorthand) {
    switch (Shorthand) {
      case 'EP':
        return 'Room Only';
      case 'CP':
        return 'Complementary Breakfast Included';
      case 'MAP':
        return 'Breakfast/Lunch Included';
      case 'AP':
        return 'All Meals Included';
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
  if (booking) {
    for (var i = 0; i < booking.rooms_available.length; i++) {
      if (booking.rooms_available[i].prices.min_price) {
        room.push(booking.rooms_available[i].room_type);
      }
    }
  }
  function handleCheckboxChange(e) {
    if (token) {
      _SelectedBookingHandler({
        itinerary_id: itinerary_id,
        tailored_id: tailored_id,
        user_selected: !booking?.user_selected,
        index: index,
      });
      setaddboking(!addbooking);
      e.stopPropagation();
    } else {
      setLoginModal(!loginModal);
    }
  }
  function handleSelectChange() {
    setisSelect(!isSelect);
  }
  const isMobile = useMediaQuery('(min-width:768px)');
  return (
    <div className={`flex gap-1 pt-4  flex-col justify-start `}>
      {handleClick && (
        <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
          {cityName} <span>({booking ? booking?.duration : 1}N)</span>
        </div>
      )}
      {booking ? (
        <div
          id={booking?.id}
          className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3 "
        >
          <div
            onClick={() => {
              currentBooking
                ? openDetails()
                : handleClick(index, booking.accommodation, booking);
            }}
            className={`relative flex lg:flex-row w-full flex-col gap-4  ${
              addbooking ? 'grayscale-0' : 'grayscale'
            } `}
          >
            <div
              className={`relative  ${
                currentBooking
                  ? 'lg:h-[12rem]'
                  : `${handleClick ? 'lg:h-[15rem]' : 'lg:h-[12rem]'}`
              }  lg:w-[30%] w-full  h-[12rem]`}
            >
              {booking.images[0]?.image ? (
                <ImageLoader
                  dimensions={{ width: 400, height: 400 }}
                  dimensionsMobile={{ width: 400, height: 400 }}
                  borderRadius="16px"
                  hoverpointer
                  onclick={() => console.log('')}
                  width="100%"
                  height="100%"
                  leftalign
                  widthmobile="100%"
                  url={booking.images[0]?.image}
                ></ImageLoader>
              ) : (
                <ImageLoader
                  dimensions={{ width: 400, height: 400 }}
                  dimensionsMobile={{ width: 400, height: 400 }}
                  borderRadius="16px"
                  hoverpointer
                  onclick={() => console.log('')}
                  width="100%"
                  height="100%"
                  leftalign
                  widthmobile="100%"
                  url={'media/website/grey.png'}
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
                    currentBooking ? 'text-lg' : 'text-2xl'
                  } font-semibold `}
                >
                  {booking?.name}
                </div>
                <div className="flex flex-col gap-1">
                  {!currentBooking && (
                    <div className="text-sm font-normal">{booking?.city}</div>
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
                </div>
                {booking.check_in ? (
                  <div className="flex flex-row gap-3 mt-2">
                    <div className="flex flex-row gap-2 items-center">
                      <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                      <div>
                        <div className="text-sm font-[400] ">
                          {getDate(booking.check_in)}-
                          {getDate(booking.check_out)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                      <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400] min-w-fit">
                        {booking.number_of_adults} Adults
                      </div>
                    </div>
                  </div>
                ) : (
                  currentBooking && (
                    <div className="flex flex-row gap-3 mt-2">
                      <div className="flex flex-row gap-2 items-center">
                        <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                        <div>
                          <div className="text-sm font-[400] ">
                            {getDate(currentBooking.check_in)}-
                            {getDate(currentBooking.check_out)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                        <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                        <div className=" text-sm font-[400] min-w-fit">
                          {booking.number_of_adults} Adults
                        </div>
                      </div>
                    </div>
                  )
                )}

                {booking.costings_breakdown ? (
                  <div className={`flex ${'flex-row'} gap-3 lg:mt-2 mt-0`}>
                    <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                      <BiBed className="text-sm text-[#7A7A7A]" />
                      <div className="text-sm font-[400] line-clamp-1">
                        {booking.costings_breakdown[0].room_type}
                      </div>
                    </div>
                  </div>
                ) : (
                  currentBooking.number_of_adults && (
                    <div className={`flex ${'flex-row'} gap-3 lg:mt-2 mt-0`}>
                      {room[0] && (
                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                          <BiBed className="text-sm text-[#7A7A7A]" />
                          <div className="text-sm font-[400] line-clamp-1">
                            {room[0]}
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

              {currentBooking && (
                <div className="flex flex-row gap-3 items-center w-full font-bold">
                  {booking.price_lower_range_ext ? (
                    <div className="font-lexend">
                      {'₹ ' +
                        getIndianPrice(
                          Math.round(booking.price_lower_range_ext / 100)
                        ) +
                        ' /-'}
                    </div>
                  ) : null}
                </div>
              )}
              {handleClick && (
                <div className="flex flex-row gap-3 items-center justify-between w-full">
                  {/* <ButtonYellow
                  className=" w-1/2"
                  onClick={() =>
                    handleClick(index, booking.accommodation, booking)
                  }
                >
                  <div className="text-[#01202B] ">View Detail</div>
                </ButtonYellow> */}
                  <ButtonYellow
                    className="w-1/2"
                    onClick={() => {
                      handleClickAc(index, booking);
                    }}
                  >
                    <div className="text-[#01202B] ">Change</div>
                  </ButtonYellow>
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

              <div className="absolute bottom-10 right-8 -m-3">
                <div
                  onClick={(e) => {
                    handleCheckboxChange(e);
                  }}
                  className="flex flex-row gap-1 items-center  cursor-pointer"
                >
                  <CheckboxFormComponent checked={addbooking} />
                  <label className="text-center">
                    {addbooking ? 'Added Booking' : 'Add Booking'}
                  </label>
                </div>
              </div>
            </div>
          )}
          {currentBooking && (
            <div className="absolute  bottom-4 right-8 -m-3">
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
                <div className=" z-50">
                  <DropDown
                    itinerary_id={itinerary_id}
                    tailored_id={tailored_id}
                    fontSize="1rem"
                    new_booking={booking}
                    fontSizeDesktop="1.25rem"
                    onclick={_updateSearchedAccommodation}
                    onclick1={() => handleSelectChange()}
                    onclickparam={{
                      alternates: alternates,
                      new_booking: booking,
                      itinerary_id: itinerary_id,
                      tailored_id: tailored_id,
                    }}
                  >
                    <div className="flex flex-row gap-1 items-center justify-center  cursor-pointer">
                      <CheckboxFormComponent
                        checked={isSelect}
                        className="mb-0"
                      />
                      <label className="text-center">
                        {isSelect ? 'Selected' : 'Select'}
                      </label>
                    </div>
                  </DropDown>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Add Hotels</div>
      )}
    </div>
  );
};

export default HotelBookingContainer;
