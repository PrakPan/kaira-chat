import React from 'react';
import ImageLoader from '../../../components/ImageLoader';
import StarRating from '../../../components/StarRating';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
import { FaBed, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import ButtonYellow from '../../../components/ButtonYellow';
import styled from 'styled-components';
import {
  getDate,
  convertDateYearFormat,
} from '../../../helper/ConvertDateFormat';

const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;
const HotelsBooking = (props) => {
  console.log(props.stayBookings);
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

  return (
    <div className="lg:w-[60vw] w-full">
      <div className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit">
        Stays
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.stayBookings
        ? props.stayBookings.map((booking) => (
            <div className="flex gap-1 pt-4  flex-col justify-start">
              <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
                {booking?.city}: <span>({booking?.duration}N)</span>
              </div>
              <div className=" shadow-md rounded-lg  border-2 border-[#ECEAEA] shadow-[#ECEAEA] lg:p-4 p-2">
                <div className="relative flex lg:flex-row flex-col gap-4">
                  <div className="relative lg:w-1/3 lg:h-[15rem] w-full h-[12rem]">
                    <ImageLoader
                      dimensions={{ width: 400, height: 400 }}
                      dimensionsMobile={{ width: 400, height: 400 }}
                      borderRadius="8px"
                      hoverpointer
                      onclick={() => console.log('')}
                      width="100%"
                      height="100%"
                      leftalign
                      widthmobile="100%"
                      url={booking.images[0]?.image}
                    ></ImageLoader>
                    {booking.star_category ? (
                      <div
                        className={`text-white bg-[#01202B] lg:px-3 px-2 lg:py-2 py-1 m-2 shadow-sm shadow-[#00000060] absolute top-0 rounded-2xl`}
                      >
                        {booking.star_category} star hotel
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 text-[#01202B]">
                    <div className="text-lg font-bold ">{booking?.name}</div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium">{booking?.city}</div>
                      {booking?.user_rating && (
                        <div className="gap-1 flex flex-row  items-center">
                          <div className="flex flex-row text-[#ffa500]">
                            {starRating(booking?.user_rating)}
                          </div>
                          <div>{booking?.user_rating}</div>
                          {booking.number_of_reviews && (
                            <div className="text-sm text-[#7A7A7A] font-medium underline">
                              {booking.number_of_reviews} Google reviews
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <BsCalendar2 className="text-md text-[#7A7A7A]" />
                      <div>
                        <div className="text-md font-medium ">
                          {getDate(booking.check_in)}-
                          {getDate(booking.check_out)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row gap-3">
                      <div className="text-md font-medium gap-2 flex flex-row items-center">
                        <BsPeopleFill className="text-md text-[#7A7A7A]" />
                        <div className="text-md font-medium min-w-fit">
                          {booking.number_of_adults} Adults
                        </div>
                      </div>
                      <div className="text-md font-medium gap-2 flex flex-row items-center">
                        <FaBed className="text-md text-[#7A7A7A]" />
                        <div className="text-md font-medium">
                          {booking.costings_breakdown[0].room_type}
                        </div>
                      </div>
                    </div>
                    {Addons(booking.costings_breakdown[0].pricing_type) ? (
                      <div className="flex flex-row gap-2 items-center">
                        <ImSpoonKnife className="text-md text-[#7A7A7A]" />
                        <div className="text-md font-medium">
                          {Addons(booking.costings_breakdown[0].pricing_type)}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-row gap-3 items-center w-full">
                      <ButtonYellow className="lg:w-fit w-1/2">
                        <div className="text-[#01202B] ">View Detail</div>
                      </ButtonYellow>
                      <ButtonYellow primary={false} className="lg:w-fit w-1/2">
                        <div className="text-[#01202B] ">Change</div>
                      </ButtonYellow>
                    </div>
                  </div>
                  {/* {booking.costings_breakdown && (
                    <ClippathComp className="absolute text-md font-bold bg-yellow-400 text-#090909 pl-12   pr-4 py-1 top-6 right-0 -m-6">
                      TTW Recommendation
                    </ClippathComp>
                  )} */}
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default React.memo(HotelsBooking);
