import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';

import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { FaHome } from 'react-icons/fa';
import { LivelyButton } from '../../../components/LiveleyButton';
import { TransparentButton } from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
import { Link } from 'react-scroll';
import { MdDoneAll } from 'react-icons/md';

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: ${(props) => (props.image ? '1fr 2fr' : '1fr')};
  grid-column-gap: 0.5rem;
`;
const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
`;
const Heading = styled.p`
  margin-bottom: 0.35rem;
  font-weight: 600;
  line-height: 1;
`;
const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;
const ItineraryElementM = (props) => {
   function getUserSelectedByBookings(id) {
     if (props.booking && props.booking.length && id)
       for (let i = 0; i < props.booking.length; i++) {
         if (props.booking[i].id === id) {
           return props.booking[i].user_selected;
         }
       }
     return null;
   }
  return (
    <div className="font-lexend">
      <div>
        <div className="flex flex-row items-start">
          <div className="flex justify-center items-center">
            <FaHome className="text-black text-[28px] mr-4" />
          </div>

          {/* {props.icon ? (
            <div className="mr-4">
              
              <ImageLoader
                dimensions={{ width: 90, height: 90 }}
                dimensionsMobile={{ width: 90, height: 90 }}
                borderRadius="8px"
                hoverpointer
                onclick={() => console.log('')}
                width="22px"
                leftalign
                widthmobile="35px"
                url={props.icon}
              ></ImageLoader>
            </div>
          ) : null} */}
          <div className="flex flex-col">
            <div className="text-[1.2rem] font-normal">{props.heading}</div>
            {props.data?.bookings && (
              <Link
                to={
                  props.data.bookings
                    ? `${props.data.bookings[0]?.id}`
                    : "Stays-Head"
                }
                offset={-90}
              >
                {props.data &&
                props.data.bookings &&
                props.data.bookings.length ? (
                  <>
                    {getUserSelectedByBookings(
                      props.data.bookings &&
                        props.data.bookings[0] &&
                        props.data.bookings[0] &&
                        props.data.bookings[0].id
                        ? props.data.bookings[0].id
                        : null
                    ) ? (
                      <TransparentButton>
                        <MdDoneAll
                          style={{
                            display: "inline",
                            marginRight: "0.35rem",
                          }}
                        />{" "}
                        Stay added
                      </TransparentButton>
                    ) : (
                      <TransparentButton>Add Stay</TransparentButton>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Link>
            )}
          </div>
        </div>

        <div>
          <div className="pb-0 pt-2 text-sm font-[350]">
            {props.text ? props.text : null}
          </div>
          {/* {props.booking ? (
            <div className="flex flex-row items-end justify-between w-full">
              <LivelyButton className="font-medium mt-3  border-2 border-black rounded-md px-4 py-2  bg-white text-black">
                View Booking
              </LivelyButton>
              <div className="text-sm font-medium">
                {props.booking.user_selected ? (
                  <div className="text-[#287E00]">Included</div>
                ) : (
                  <div className="text-[#D20A0A]">Excluded</div>
                )}
              </div>
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default ItineraryElementM;
