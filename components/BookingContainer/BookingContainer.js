import React from 'react';
import styled from 'styled-components';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
import ButtonYellow from '../ButtonYellow';
import { getIndianPrice } from '../../services/getIndianPrice';
import { getHumanDate } from '../../services/getHumanDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
const font = styled.div`
  font-family: 'Lexend';
`;
const BookingContainer = (props) => {
  console.log(props.payment);

  return (
    <font>
      <div className="font-lexend ml-4 flex flex-col rounded-xl shadow-md   border-2 border-[#ECEAEA] shadow-[#ECEAEA]">
        <div className="flex flex-col  bg-[#F7E70033] ">
          <div className="p-3">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                <span>₹</span>
                <div>
                  {' '}
                  {getIndianPrice(
                    Math.round(props.payment.per_person_total_cost / 100) * 2
                  )}
                </div>
              </div>
              <div className="bg-[#EB5757] font-bold text-sm px-2 py-1 text-white">
                20% OFF
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row gap-1">
                <div className="flex flex-row items-center text-black font-bold text-2xl">
                  <span>₹</span>
                  <div>
                    {getIndianPrice(
                      Math.round(
                        Math.round(props.payment.per_person_total_cost) / 100
                      )
                    )}
                  </div>
                </div>
                <div className="font-medium text-base self-end">per person</div>
              </div>
              <div className="text-[#7A7A7A]">Exclusive applicable taxes</div>
            </div>
            <div className=" font-semibold flex gap-0 flex-row cursor-pointer">
              <div>View breakup</div>

              <RiArrowDropDownLine className="text-2xl animate-bounce mt-1"></RiArrowDropDownLine>
            </div>
          </div>
        </div>

        <div className="px-3 ">
          <div>
            <div className="relative  rounded-md shadow-sm">
              <input
                class="w-full px-3 py-2 mt-3 border-2 border-[#ECEAEA] rounded-md focus:outline-none focus:border-indigo-500"
                type="text"
                id="name"
                name="name"
                placeholder="Having a coupon code?"
              />
              <div className="pointer-events-none absolute inset-y-0 right-2 top-4 flex items-center pr-3 cursor-pointer">
                <div
                  className=" font-bold text-black cursor-pointer"
                  aria-hidden="true"
                >
                  Apply
                </div>
              </div>
            </div>
          </div>
          <div className="border-y-2 border-[#F0F0F0] my-3">
            <div className="flex flex-row gap-3 items-center py-[0.7rem]">
              <BsCalendar2 className="text-md text-[#7A7A7A]" />
              <div>
                <div className="text-md font-semibold text-black">
                  {/* {getDate(booking.check_in)}-{getDate(booking.check_out)} */}
                  {props.payment.meta_info
                    ? props.payment.meta_info.start_date
                      ? getHumanDate(
                          props.payment.meta_info.start_date.replaceAll(
                            '-',
                            '/'
                          )
                        )
                      : null
                    : null}{' '}
                  - Feb 09, 2023
                </div>
              </div>
            </div>
          </div>
          <div className="text-md font-medium gap-3 flex flex-row items-center">
            <BsPeopleFill className="text-md text-[#7A7A7A]" />
            <div className="text-md font-semibold text-black">
              {/* {booking.number_of_adults} */}
              {props.payment.meta_info.number_of_adults} Adults
            </div>
          </div>
        </div>
        <div className="px-3 gap-2 flex flex-col w-full my-2">
          <ButtonYellow styleClass="w-full">
            <div className="text-[#01202B] ">View Detail</div>
          </ButtonYellow>
          <ButtonYellow
            styleClass="w-full"
            primary={false}
            onclick={() =>
              (window.location.href = urls.WHATSAPP + '?text=' + message)
            }
          >
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faWhatsapp}
                style={{ marginRight: '0.5rem' }}
              />
              <div className="text-[#01202B] ">Chat on Whatsapp</div>
            </div>
          </ButtonYellow>
          {/* <Button
        
        hoverColor="black"
        hoverBgColor="#128C7E"
        onclickparam={null}
        width="100%"
        bgColor="white"
        borderRadius="5px"
        borderWidth="1px"
        borderColor="#e4e4e4"
        margin="0"
      >
       
        Connect on WhatsApp
      </Button> */}
        </div>
      </div>
    </font>
  );
};

export default BookingContainer;
