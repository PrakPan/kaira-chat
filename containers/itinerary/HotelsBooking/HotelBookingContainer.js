import React, { useEffect, useState } from 'react';
import ImageLoader from '../../../components/ImageLoader';
import StarRating from '../../../components/StarRating';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
import { FaBed, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import {
  getDate,
  convertDateYearFormat,
} from '../../../helper/ConvertDateFormat';
import ButtonYellow from '../../../components/ButtonYellow';

import styled from 'styled-components';

const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const HotelBookingContainer = ({
  booking,
  index,
  handleClick,
  handleClickAc,
}) => {
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
      const words = sentence.trim().split(/\s+/);
      if (words.length > number) {
        return true;
      } else {
        return false;
      }
    }
  };
  return (
    <div className="flex gap-1 pt-4  flex-col justify-start">
      <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
        {booking?.city} Hotel <span>({booking?.duration}N)</span>
      </div>
      <div className="relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3 ">
        <div
          className={`relative flex lg:flex-row w-full flex-col gap-4  ${
            booking?.user_selected ? 'grayscale-0' : 'grayscale'
          } `}
        >
          <div className="relative   lg:h-[15rem] lg:w-[30%] w-full  h-[12rem]">
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
            {booking.star_category ? (
              <starHotel
                starHotel
                className={`text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-md font-semibold transition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl   absolute top-0 rounded-3xl`}
              >
                {booking.star_category} star hotel
              </starHotel>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 text-[#01202B] lg:w-[50%] w-full  justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold ">{booking?.name}</div>
              <div className="flex flex-col gap-1">
                <div className="text-md font-normal">{booking?.city}</div>
                {booking?.user_rating && (
                  <div className="gap-1 flex flex-row  items-center">
                    <div className="flex flex-row text-[#FFD201]">
                      {starRating(booking?.user_rating)}
                    </div>
                    <div>{booking?.user_rating}</div>
                    {booking.number_of_reviews && (
                      <div className="text-md text-[#7A7A7A] font-semibold underline">
                        {booking.number_of_reviews} Google reviews
                      </div>
                    )}
                  </div>
                )}
              </div>
              {booking.check_in && (
                <div className="flex flex-row gap-2 items-center">
                  <BsCalendar2 className="text-md text-[#7A7A7A]" />
                  <div>
                    <div className="text-md font-semibold ">
                      {getDate(booking.check_in)}-{getDate(booking.check_out)}
                    </div>
                  </div>
                </div>
              )}
              {booking.costings_breakdown && (
                <div
                  className={`flex ${
                    noOfWords(booking.costings_breakdown[0].room_type, 4)
                      ? 'lg:flex-row flex-col'
                      : 'flex-row'
                  } gap-3`}
                >
                  <div className="text-md font-semibold gap-2 flex flex-row items-center">
                    <BsPeopleFill className="text-md text-[#7A7A7A]" />
                    <div className="text-md font-semibold min-w-fit">
                      {booking.number_of_adults} Adults
                    </div>
                  </div>
                  <div className="text-md font-semibold gap-2 flex flex-row items-center">
                    <FaBed className="text-md text-[#7A7A7A]" />
                    <div className="text-md font-semibold">
                      {booking.costings_breakdown[0].room_type}
                    </div>
                  </div>
                </div>
              )}
              {booking.costings_breakdown &&
              Addons(booking.costings_breakdown[0].pricing_type) ? (
                <div className="flex flex-row gap-2 items-center">
                  <ImSpoonKnife className="text-md text-[#7A7A7A]" />
                  <div className="text-md font-semibold">
                    {Addons(booking.costings_breakdown[0].pricing_type)}
                  </div>
                </div>
              ) : null}
            </div>
            {handleClick && (
              <div className="flex flex-row gap-3 items-center w-full">
                <ButtonYellow
                  className=" w-1/2"
                  onClick={() =>
                    handleClick(index, booking.accommodation, booking)
                  }
                >
                  <div className="text-[#01202B] ">View Detail</div>
                </ButtonYellow>
                <ButtonYellow
                  primary={false}
                  className=" w-1/2"
                  onClick={() => {
                    handleClickAc(index, booking);
                  }}
                >
                  <div className="text-[#01202B] ">Change</div>
                </ButtonYellow>
              </div>
            )}
          </div>
        </div>

        {/* <ClippathComp className="absolute text-md font-bold bg-yellow-400 text-#090909 pl-12   pr-4 py-1 top-6 right-3 -m-3">
        TTW Recommendation
      </ClippathComp> */}
        {booking?.user_selected ? (
          <div className="absolute text-md font-bold  text-[#277004] top-6 right-8 -m-3">
            Included
          </div>
        ) : (
          <div className="absolute text-md font-bold text-[#E00000] top-6 right-8 -m-3">
            Excluded
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBookingContainer;
