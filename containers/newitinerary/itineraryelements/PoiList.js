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
import { getIndianPrice } from '../../../services/getIndianPrice';
import DropDown from '../../../components/modals/bookingupdated/new-accommodation-searched/Dropdown';
import CheckboxFormComponent from '../../../components/FormComponents/CheckboxFormComponent';

const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const PoiList = ({ data }) => {
  const [isSelect, setisSelect] = useState(false);
  console.log(data);
  return (
    <div
      className={`flex gap-1 pt-4 lg:w-[50vw] w-[100vw]  flex-col justify-start `}
    >
      <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3 ">
        {data.activity_data.activity.image ? (
          <div
            onClick={() => {
              currentBooking
                ? openDetails()
                : handleClick(index, booking.accommodation, booking);
            }}
            className={`relative flex lg:flex-row w-full flex-col gap-4 `}
          >
            <div
              className={`relative 'lg:h-[15rem]'
              lg:w-[30%] w-full  h-[12rem]`}
            >
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
                url={data.activity_data.activity.image}
              ></ImageLoader>
            </div>
            <div className="flex flex-col gap-2 text-[#01202B] lg:w-[55%] w-full  justify-between">
              <div>
                <div className="text-xl font-bold">
                  {data.activity_data.activity.name}
                </div>
                <div className="text-sm font-normal">
                  {data.activity_data.city.name}
                </div>
                <div className="text-base font-normal my-2 text-[#01202B] line-clamp-2">
                  {data.text}
                </div>
                <div>
                  <div className="flex flex-row gap-1">
                    <div className="text-2xl font-bold">
                      <span>₹</span>
                      {data.activity_data.activity.cost}
                    </div>
                    <div className="font-medium text-base self-end">
                      per person*
                    </div>
                  </div>
                  <div className="text-base font-light text[#7A7A7A]">
                    Exclusive applicable taxes
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              currentBooking
                ? openDetails()
                : handleClick(index, booking.accommodation, booking);
            }}
            className={`relative flex lg:flex-row w-full flex-col gap-4 `}
          >
            <div className="flex flex-col lg:w-[30%] w-full">
              {' '}
              <div
                className={`relative 'lg:h-[15rem]'
                h-[12rem]`}
              >
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
                  url={data.activity_data.poi.image}
                ></ImageLoader>
              </div>
              <div className="flex mt-2 flex-row gap-1 items-center justify-start  cursor-pointer">
                <CheckboxFormComponent checked={isSelect} className="mt-1" />
                <label className="text-center">
                  {isSelect ? 'Selected' : 'Select'}
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[#01202B] lg:w-[55%] w-full  justify-between">
              <div>
                <div className="text-xl font-bold">
                  {data.activity_data.poi.name}
                </div>
                <div className="text-sm font-normal">
                  {data.activity_data.city.name}
                </div>
                <div className="text-base font-normal my-2 text-[#01202B] line-clamp-2">
                  {data.text}
                </div>
                <div>
                  <div className="font-bold">Tips</div>
                  {data.activity_data.poi?.tips
                    .slice(0, 2)
                    .map((tip, index) => (
                      <div className='text-base font-normal text-[#01202B] line-clamp-2"'>
                        {tip}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <ClippathComp className="absolute text-md font-bold bg-yellow-400 text-#090909 pl-12   pr-4 py-1 top-6 right-3 -m-3">
        TTW Recommendation
      </ClippathComp> */}
      </div>
    </div>
  );
};

export default PoiList;
