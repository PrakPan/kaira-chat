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
import POIDetailsDrawer from '../../../components/drawers/poiDetails/POIDetailsDrawer';

const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

const PoiList = ({
  setFloatingButtonView,
  _updatePoiHandler,
  selectedData,
  getPaymentHandler,
  data,
  setShowDrawer,
  loginModal,
  setLoginModal,
  token,
}) => {
  const [isSelect, setisSelect] = useState(false);
  const [showDetails, setShowDetails] = useState({
    show: false,
    data: {},
  });
  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDetails({ show: false, data: {} });
  };
  function handleCheckboxChange(e) {
    if (token) {
      _updatePoiHandler(data);
      setisSelect(!isSelect);

      setShowDrawer(false);
      getPaymentHandler();
      e.stopPropagation();
    } else {
      setLoginModal(!loginModal);
    }
  }
  return (
    <>
      <div
        onClick={() => setFloatingButtonView(true)}
        className={`flex gap-1  lg:w-[50vw] w-[100vw] py-2 px-3 flex-col justify-start `}
      >
        {data.activity_data.activity.name ? (
          data?.activity_data?.activity?.cost && (
            <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ">
              <div
                onClick={() => setShowDetails({ show: true, data: data })}
                id="Activity"
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
                    <div className="text-xl font-semibold  w-[80%]">
                      {data.activity_data.activity.name}
                    </div>
                    <div className="text-sm font-normal">
                      {data.activity_data.city.name}
                    </div>
                    <div className="font-normal text-sm my-2 text-[#01202B] line-clamp-2">
                      {data.text}
                    </div>
                    <div>
                      <div className="flex flex-row gap-1">
                        <div className="text-2xl font-bold">
                          <span>₹</span>
                          {data.activity_data.activity.cost}
                        </div>
                        <div className="font-normal text-base self-end">
                          per person*
                        </div>
                      </div>
                      <div className="text-base font-light text[#7A7A7A]">
                        Exclusive applicable taxes
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div
                  onClick={(e) => {
                    handleCheckboxChange(e);
                  }}
                  className="flex mt-2 mr-2 flex-row gap-1 items-end justify-start  cursor-pointer"
                >
                  <CheckboxFormComponent checked={isSelect} className="mb-1" />
                  <label className="text-center">
                    {isSelect ? 'Selected' : 'Select'}
                  </label>
                </div>
                {data.activity_data?.activity?.experience_filters[0] && (
                  <ClippathComp className="absolute text-sm font-bold bg-[#F7E700] text-#090909 pl-4   pr-2 py-1 top-3 right-1 -m-3">
                    {data.activity_data?.activity?.experience_filters[0]}
                  </ClippathComp>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ">
            <div
              onClick={() => setShowDetails({ show: true, data: data })}
              id="POI"
              className={`relative flex lg:flex-row w-full flex-col gap-4 `}
            >
              <div className="flex flex-col lg:w-[50%] w-full">
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
              </div>

              <div className="flex flex-col gap-2 text-[#01202B] lg:w-[90%] w-full  justify-between">
                <div>
                  <div className="text-xl font-bold block w-[80%]">
                    {data.activity_data.poi.name}
                  </div>
                  <div className="text-sm font-[300]">
                    {data.activity_data.city.name}
                  </div>
                  <div className="text-sm font-normal my-2 text-[#01202B] line-clamp-3">
                    {data.text}
                  </div>

                  {data.activity_data.poi?.tips
                    .slice(0, 1)
                    .map((tip, index) => (
                      <div>
                        <div className='text-[13px]  font-normal text-[#01202B] line-clamp-2"'>
                          <div className="font-bold inline pr-1">
                            Tips & Tricks:
                          </div>
                          {tip}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div
                onClick={(e) => {
                  handleCheckboxChange(e);
                }}
                className="flex mt-2 mr-2 flex-row gap-1 items-end justify-start  cursor-pointer"
              >
                <CheckboxFormComponent checked={isSelect} className="mb-1" />
                <label className="text-center">
                  {isSelect ? 'Selected' : 'Select'}
                </label>
              </div>
              {data.activity_data?.poi?.experience_filters[0] && (
                <ClippathComp className="absolute text-sm font-bold bg-[#F7E700] text-#090909 pl-4   pr-2 py-1 top-3 right-1 -m-3">
                  {data.activity_data?.poi?.experience_filters[0]}
                </ClippathComp>
              )}
            </div>
          </div>
        )}
        {/* {data.activity_data?.poi?.experience_filters[0] && (
          <ClippathComp className="absolute text-md font-bold bg-yellow-400 text-#090909 pl-12   pr-4 py-1 top-6 right-3 -m-3">
            {data.activity_data?.poi?.experience_filters[0]}
          </ClippathComp>
        )} */}
      </div>
      <POIDetailsDrawer
        // show={props.showDrawer.isOpen}
        show={showDetails.show}
        iconId={
          showDetails.data?.activity_data?.poi &&
          showDetails.data?.activity_data?.poi?.id
        }
        ActivityiconId={
          showDetails.data.activity_data?.activity &&
          showDetails.data.activity_data?.activity?.id
        }
        // handleCloseDrawer={props.handleCloseDrawer}
        handleCloseDrawer={handleCloseDrawer}
        Topheading={'Select Our Point Of Interest'}
      />
    </>
  );
};

export default PoiList;
