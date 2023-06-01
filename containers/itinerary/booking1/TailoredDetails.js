import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Heading from '../../../components/newheading/heading/Index';
import Option from '../../../components/forms/Option';
import Dropdown from '../../../components/forms/Dropdown';
import { RiArrowDropDownLine, RiWhatsappFill } from 'react-icons/ri';
import Button from '../../../components/Button';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { connect } from 'react-redux';
import * as orderaction from '../../../store/actions/order';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdEdit } from 'react-icons/md';
import {
  faRupeeSign,
  faTimes,
  faMale,
  faChild,
  faBaby,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { getIndianPrice } from '../../../services/getIndianPrice';
import { getHumanDate } from '../../../services/getHumanDate';
import urls from '../../../services/urls';
import {
  ITINERARY_STATUSES,
  MIS_SERVER_HOST,
} from '../../../services/constants';
import axiossalecreateinstance from '../../../services/sales/itinerary/SaleCreate';
import axios from 'axios';
import Accordion from './Accordion';
import Spinner from '../../../components/Spinner';
import ButtonYellow from '../../../components/ButtonYellow';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
const SummaryContainer = styled.div`
  height: max-content;
  border-radius: 10px;
  padding: 1rem;
  margin: 0rem 0;
  @media screen and (min-width: 768px) {
    margin: 0;
    width: 27vw;
    position: sticky;
    top: 11vh;
  }
`;
const INR = styled.div`
  font-weight: 500;
  font-size: 1.8rem;

  &:after {
    content: 'Per Adult';
    display: ${(props) => (props.show_per_person_cost ? 'block' : 'none')};
    font-size: 1.5rem;
    font-weight: 800;
  }
`;
const BookingListCostContainer = styled.div`
  border-style: none none solid none;
  border-width: 1px;
  border-color: hsl(0, 0%, 95%);
  @media screen and (min-width: 768px) {
    max-height: 30vh;
    overflow-y: auto;
  }
`;
const Details = (props) => {
  const [iscouponApplied, setiscouponApplied] = useState(
    props.payment?.coupon ? true : false
  );

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [acoordianceOpen, setAcordianOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    props.payment?.coupon ? props.payment?.coupon?.code : ''
  );
  const [showAdultsModal, setShowAdultsModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const getPaymentHandler = (coupon) => {
    setPaymentLoading(true);
    //  props.checkAuthState();

    axios
      .post(
        MIS_SERVER_HOST + '/payment/coupon/apply/',
        {
          itinerary_id: props.id,
          coupon: coupon,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        props.getPaymentHandler();
        console.log(res.data);
        setPaymentLoading(false);
        setIsDisabled(true);
        setiscouponApplied(true);

        //check if user has already paid
        // try{
        // let email = localStorage.getItem('email');

        // }catch{

        // }
      })
      .catch((error) => {
        setPaymentLoading(false);
        setIsDisabled(false);
        setiscouponApplied(false);
        setInputValue('');
        console.log(error);
      });
  };
  const RemoveCoupon = () => {
    setPaymentLoading(true);
    //  props.checkAuthState();

    axios
      .post(
        MIS_SERVER_HOST + '/payment/coupon/apply/',
        {
          itinerary_id: props.id,
          coupon: null,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        props.getPaymentHandler();
        console.log(res.data);
        setPaymentLoading(false);
        setIsDisabled(false);
        setiscouponApplied(false);
        setInputValue('');

        //check if user has already paid
        // try{
        // let email = localStorage.getItem('email');

        // }catch{

        // }
      })
      .catch((error) => {
        setPaymentLoading(false);
        setIsDisabled(true);

        console.log(error);
      });
  };
  function handleSubmit(e) {
    if (inputValue !== '') {
      getPaymentHandler(inputValue);
    }
  }
  function handleSubmitRemove(e) {
    RemoveCoupon();
  }
  const setBookingSummary = () => {
    try {
      if (props.payment) {
        if (props.payment.costings_breakdown)
          for (const booking in props.payment.costings_breakdown) {
            if (props.payment.costings_breakdown[booking].user_selected) {
              if (
                props.payment.costings_breakdown[booking].booking_type ===
                'Accommodation'
              ) {
                bookingslist.push(
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      letterSpacing: '1px',
                      marginBottom: '0.25rem',
                    }}
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text'
                        : 'font-lexend text-enter'
                    }
                  >
                    {props.payment.costings_breakdown[booking].detail[
                      'duration'
                    ] +
                      'N at ' +
                      props.payment.costings_breakdown[booking].detail['name']}
                  </p>
                );
                bookinglistwithcost.push(
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1fr',
                      margin: '0.5rem 0',
                      gridGap: '1rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        marginBottom: '0.25rem',
                      }}
                      className={
                        props.blur
                          ? 'font-lexend text-enter blurry-text'
                          : 'font-lexend text-enter'
                      }
                    >
                      {props.payment.costings_breakdown[booking].detail[
                        'duration'
                      ] +
                        'N at ' +
                        props.payment.costings_breakdown[booking].detail[
                          'name'
                        ]}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        marginBottom: '0.25rem',
                      }}
                      className={
                        props.blur
                          ? 'font-lexend text-enter blurry-text'
                          : 'font-lexend text-enter'
                      }
                    >
                      {'₹ ' +
                        getIndianPrice(
                          Math.ceil(
                            props.payment.costings_breakdown[booking][
                              'booking_cost'
                            ] / 100
                          )
                        )}
                    </p>
                  </div>
                );
              } else {
                bookingslist.push(
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      letterSpacing: '1px',
                      marginBottom: '0.25rem',
                    }}
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text'
                        : 'font-lexend text-enter'
                    }
                  >
                    {props.payment.costings_breakdown[booking].detail['name']}
                  </p>
                );
                bookinglistwithcost.push(
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1fr',
                      margin: '0.5rem 0',
                      gridGap: '1rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        marginBottom: '0.25rem',
                      }}
                      className={
                        props.blur
                          ? 'font-lexend text-enter blurry-text'
                          : 'font-lexend text-enter'
                      }
                    >
                      {props.payment.costings_breakdown[booking].detail['name']}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        marginBottom: '0.25rem',
                      }}
                      className={
                        props.blur
                          ? 'font-lexend text-enter blurry-text'
                          : 'font-lexend text-enter'
                      }
                    >
                      {'₹ ' +
                        getIndianPrice(
                          Math.ceil(
                            props.payment.costings_breakdown[booking][
                              'booking_cost'
                            ] / 100
                          )
                        )}
                    </p>
                    {/* <div></div> */}
                  </div>
                );
              }
            }
          }
      }
    } catch {}
  };

  let bookingslist = [];
  let bookinglistwithcost = [];
  //Date on which agoda changes made to box
  let oldaccommodation = false;
  // if(props.payment) if(props..version ==='v1') oldaccommodation = true;
  if (props.traveleritinerary) oldaccommodation = true;

  setBookingSummary();
  let message =
    'Hey TTW! I need some help with my tailored experience - https://dev.thetarzanway.com/' +
    router.asPath;
  // const [paymentLoading, setPaymentLoading] = useState(false);

  const _startRazorpayHandler = (data) => {
    //Razorpay payload
    let razorpayOptions = {
      amount: data.amount,
      // "currency": "INR",
      name: 'The Tarzan Way Payment Portal',
      description: ' data.data.description',
      image:
        'https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480',
      order_id: data.order_id,
      //Payment successfull handler passed to razorpay
      handler: function (response) {
        setPaymentLoading(true);
        axios
          .post(
            'https://suppliers.tarzanway.com/sales/verify/',
            { ...response },
            { headers: { Authorization: `Bearer ${props.token}` } }
          )
          .then((res) => {
            setPaymentLoading(false);
            //  router.push('/itinerary/'+data.itinerary+"?payment_status=success")
            window.location.href =
              'https://dev.thetarzanway.com/itinerary/' +
              data.itinerary +
              '?payment_status=success';
          })
          .catch((err) => {
            setPaymentLoading(false);
            // router.push('/itinerary/'+data.itinerary+"?payment_status=fail")
            window.location.href =
              'https://dev.thetarzanway.com/itinerary/' +
              data.itinerary +
              '?payment_status=fail';
          });
      },
      //User details will be present as user is logged in
      prefill: {
        name: props.name,
        email: props.email,
        contact: props.phone,
      },
      theme: {
        color: '#F7e700',
      },
    };
    var rzp1 = new window.Razorpay(razorpayOptions);
    rzp1.open();
  };
  const _saleCreateHandler = (id) => {
    setPaymentLoading(true);
    axiossalecreateinstance
      .post(
        '/',
        {
          itinerary_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        setPaymentLoading(false);

        // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id
        _startRazorpayHandler(res.data);
      })
      .catch((err) => {
        // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id
        setPaymentLoading(false);
      });
  };
  return (
    <SummaryContainer
      className="font-lexend ml-4 flex flex-col rounded-xl shadow-md  border-2 border-[#ECEAEA] shadow-[#ECEAEA]"
      style={{ marginBottom: props.traveleritinerary ? '12.5vh' : '0' }}
    >
      <div className="bg-[#F7E70033] -mt-[1rem] -mx-[1rem] mb-2">
        <div className=" mx-[1rem] mt-[1rem]">
          <div className="flex flex-row justify-between">
            {iscouponApplied && (
              <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                <span>₹</span>
                <div>
                  {' '}
                  {getIndianPrice(Math.round(props.payment.total_cost / 100))}
                </div>
              </div>
            )}

            {iscouponApplied && (
              <div className="bg-[#EB5757] font-bold flex flex-row gap-1 items-center justify-center text-sm px-2 py-1 text-white">
                <div>{props?.payment?.coupon?.discount_value}</div>
                <div>
                  {props?.payment?.coupon?.discount_type == 'Flat'
                    ? 'Flat'
                    : '%  OFF'}
                </div>{' '}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {props?.payment && (
              <div className="flex flex-row gap-1">
                <div
                  show_per_person_cost={props.payment.show_per_person_cost}
                  className={
                    props.blur
                      ? 'font-lexend blurry-text'
                      : 'font-lexend text-3xl flex flex-row items-center font-semibold'
                  }
                >
                  <span>₹</span>
                  <div>
                    {getIndianPrice(
                      Math.round(
                        Math.round(props.payment.discounted_cost) / 100
                      )
                    )}
                    {/* {!props.payment.show_per_person_cost
                      ? ' ' +
                        getIndianPrice(
                          Math.round(props.payment.total_cost / 100)
                        )
                      : ' ' +
                        getIndianPrice(
                          Math.round(Math.round(props.payment.total_cost) / 100)
                        )} */}
                  </div>
                </div>
                {/* <div className="flex flex-row items-center text-black font-bold text-2xl">
              <span>₹</span>
              <div>
                {getIndianPrice(
                  Math.round(Math.round(props?.payment.total_cost) / 100)
                )}
              </div>
            </div> */}
                <div className="font-medium text-base self-end">Total Cost</div>
              </div>
            )}

            <div className="text-[#7A7A7A] text-sm">
              Exclusive applicable taxes
            </div>
          </div>
        </div>

        <div
          className="mx-[1rem]  font-medium text-sm flex gap-0 flex-row cursor-pointer"
          onClick={() => setAcordianOpen(!acoordianceOpen)}
        >
          <div>
            {acoordianceOpen ? <span>Hide</span> : <span>View</span>} breakup
          </div>

          <RiArrowDropDownLine
            className={` text-2xl  mt-1 transition-all duration-100 ${
              acoordianceOpen ? '-rotate-180 ' : 'rotate-180 animate-bounce'
            }`}
          ></RiArrowDropDownLine>
        </div>
        <div
          className={`mb-[0.8rem] mx-[1rem] Transition-Height-${
            acoordianceOpen ? 'in' : 'out'
          } `}
        >
          {acoordianceOpen && (
            <div className="">
              {/* <p style={{fontSize: "0.75rem", fontWeight: "600", letterSpacing: "1px", marginBottom: '0.25rem'}}  className={props.blur ? "font-lexend text-enter blurry-text" : "font-lexend text-enter"}>WHAT'S INCLUDED?</p> */}
              {/* <BookingListCostContainer>
           {oldaccommodation || props.payment.are_prices_hidden ? bookingslist : bookinglistwithcost}
           </BookingListCostContainer> */}
              <Accordion
                stayBookings={props.stayBookings}
                flightBookings={props.flightBookings}
                activityBookings={props.activityBookings}
                transferBookings={props.transferBookings}
                payment={props.payment}
              ></Accordion>

              {!oldaccommodation && !props.payment.are_prices_hidden ? (
                <div className="flex flex-row justify-between">
                  <div
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text '
                        : 'font-lexend text-enter text-sm font-normal'
                    }
                  >
                    {'Service Fee'}
                  </div>
                  <div
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text font-bold'
                        : 'font-lexend text-enter '
                    }
                  >
                    {'₹ ' +
                      getIndianPrice(
                        Math.round(props.payment.total_service_fee / 100)
                      )}
                  </div>
                </div>
              ) : null}
              {!oldaccommodation && !props.payment.are_prices_hidden ? (
                <div className="flex flex-row justify-between">
                  <div
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text  '
                        : 'font-lexend text-enter text-sm font-normal'
                    }
                  >
                    {'GST'}
                  </div>
                  <div
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text '
                        : 'font-lexend text-enter '
                    }
                  >
                    {'₹ ' + getIndianPrice(Math.round(props.payment.gst / 100))}
                  </div>
                </div>
              ) : null}
              {props.payment ? (
                props.payment.coupon && iscouponApplied ? (
                  props.payment.coupon.code ? (
                    <div className="flex flex-row justify-between pt-2">
                      <div
                        className={
                          props.blur
                            ? 'font-lexend text-enter blurry-text  '
                            : 'font-lexend text-enter text-sm font-bold  flex flex-col'
                        }
                      >
                        {'Coupon Discount'}
                        <div className="flex flex-row gap-1">
                          <div className="text-[#02BF2B]">
                            {props.payment.coupon.code}
                          </div>
                          <div className="font-normal ">
                            (
                            {props?.payment?.coupon?.discount_type == 'Flat'
                              ? 'Flat'
                              : props.payment.coupon.discount_value + '%'}{' '}
                            OFF)
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          props.blur
                            ? 'font-lexend text-enter blurry-text '
                            : 'font-lexend text-enter font-bold'
                        }
                      >
                        {props?.payment?.coupon?.discount_type == 'Flat' ? (
                          <div>
                            (-) {'₹' + props.payment.coupon.discount_value}
                          </div>
                        ) : (
                          <div className="flex flex-row">
                            <div className="flex flex-row">
                              <div className="font-normal pr-1">(-)</div>
                              <span>₹</span>
                            </div>
                            {getIndianPrice(
                              Math.round(
                                (props.payment.total_cost / 100) *
                                  (props.payment.coupon.discount_value / 100)
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : // <div
                  //   className="text-center font-lexend"
                  //   style={{ marginBottom: '1rem' }}
                  // >
                  //   {'Coupon Applied: ' + props.payment.coupon.code}
                  // </div>
                  null
                ) : null
              ) : null}
              {/* <div style={{display: 'grid', gridTemplateColumns: '3fr 1fr', margin: '0.5rem 0', gridGap: '1rem'}}>
                  <p style={{fontSize: "0.75rem", fontWeight: "300", letterSpacing: "1px", marginBottom: '0.25rem'}} className={props.blur ? "font-lexend text-enter blurry-text" : "font-lexend text-enter"}>{'GST'}</p>
                  <p style={{fontSize: "0.75rem", fontWeight: "300", letterSpacing: "1px", marginBottom: '0.25rem'}}  className={props.blur ? "font-lexend text-enter blurry-text" : "font-lexend text-enter"}>{"Rs 1000 /-"}</p>
        </div> */}
              {/* {props.payment.show_per_person_cost ? (
                <div
                  style={{
                    borderWidth: '1px',
                    borderColor: 'hsl(0,0%,95%)',
                    borderStyle: 'solid none none none ',
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr',
                    padding: '0.5rem 0',
                    gridGap: '1rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '300',
                      letterSpacing: '1px',
                      marginBottom: '0.25rem',
                    }}
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text'
                        : 'font-lexend text-enter'
                    }
                  >
                    {'Total cost'}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '300',
                      letterSpacing: '1px',
                      marginBottom: '0.25rem',
                    }}
                    className={
                      props.blur
                        ? 'font-lexend text-enter blurry-text'
                        : 'font-lexend text-enter'
                    }
                  >
                    {'₹ ' +
                      getIndianPrice(
                        Math.round(props.payment.total_cost / 100)
                      )}
                  </p>
                </div>
              ) : null} */}
            </div>
          )}
        </div>
      </div>

      <div>
        {/* <p style={{fontSize: "0.75rem", fontWeight: "400", letterSpacing: "1px"}} className="font-lexend text-enter">29th July 2021</p> */}
        {/* <Datepicker handleDateChange={handleDateChange} selectedDate={details.date}/> */}
      </div>

      <div className="px-3 pb-2">
        {props?.payment?.allow_coupon_discount ? (
          <div>
            <div className="relative  rounded-md shadow-sm cursor-pointer">
              <input
                class=" px-3 w-full py-2 mt-3 border-2 border-[#ECEAEA] rounded-md focus:outline-none focus:border-indigo-500"
                type="text"
                readOnly={iscouponApplied}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                id="name"
                name="name"
                placeholder="Have a coupon code?"
              />
              {iscouponApplied ? (
                <button
                  className=" absolute  inset-y-0 -right-1 top-4 flex items-center pr-3  "
                  type="submit"
                  onClick={(e) => handleSubmitRemove(e)}
                >
                  <div
                    className=" font-bold text-black cursor-pointer"
                    aria-hidden="true"
                  >
                    Remove
                  </div>
                </button>
              ) : (
                <button
                  className=" absolute  inset-y-0 right-1 top-4 flex items-center pr-3  "
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                >
                  <div
                    className=" font-semibold text-black cursor-pointer"
                    aria-hidden="true"
                  >
                    Apply
                  </div>
                </button>
              )}
            </div>
          </div>
        ) : null}

        <div className="border-y-2 border-[#F0F0F0] my-3">
          <div className=" group flex flex-row gap-3 items-center py-[0.7rem]">
            <BsCalendar2 className="text-md text-[#7A7A7A]" />
            <div className="text-md font-medium text-black flex flex-row items-center gap-2">
              <div>
                {/* {getDate(booking.check_in)}-{getDate(booking.check_out)} */}
                {props.payment.meta_info
                  ? props.payment.meta_info.start_date
                    ? getHumanDate(
                        props.payment.meta_info.start_date.replaceAll('-', '/')
                      )
                    : null
                  : null}{' '}
                - Feb 09, 2023
              </div>
              <div className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:text-blue-500 group-hover:scale-110  active:scale-90">
                <MdEdit
                  className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
                  onClick={() => props.setShowDateModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="group text-md font-medium gap-3 flex flex-row items-center">
          <BsPeopleFill className="text-md text-[#7A7A7A]" />
          <div className="gap-2 flex flex-row items-center text-md font-medium text-black">
            {/* {booking.number_of_adults} */}
            <div> {props.payment.meta_info.number_of_adults} Adults</div>
            <div className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90">
              <MdEdit
                className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
                onClick={() => props.setShowAdultsModal(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <Button blur={props.blur} width="100%" bgColor="#F7e700" borderRadius="5px" borderWidth="0px" margin="0 0 0.5rem 0" onclick={_startCheckoutHandler} ><p style={{margin: '0'}} className={props.blur ? "blurry-text" : ''}>Proceed</p></Button> */}
      {/* <Button width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4" >
          <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
          Connect on WhatsApp</Button> */}
      {/* <Button onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="white" hoverBgColor="black"  onclickparam={null} width="100%" bgColor="#f7e700" borderRadius="5px" borderWidth="0px" borderColor="#e4e4e4"   margin="0 0 0.5rem 0" >
       Proceed to Payment</Button> */}
      {/* <Accordion></Accordion> */}

      {props.payment && props.token ? (
        props.payment.itinerary_status ===
          ITINERARY_STATUSES.itinerary_finalized &&
        !props.payment.paid_user &&
        props.payment.user_allowed_to_pay ? (
          <ButtonYellow
            styleClass="w-full"
            onClick={() => _saleCreateHandler(props.id)}
          >
            Pay Now
            {paymentLoading ? (
              <Spinner
                color="white"
                display="inline"
                size={16}
                margin="0 0.5rem"
              ></Spinner>
            ) : null}
          </ButtonYellow>
        ) : null
      ) : null}
      {props.payment && props.token ? (
        props.payment.paid_user ? (
          <ButtonYellow
            styleClass="w-full"
            onClick={() => console.log(' ')}
            onclickparam={null}
          >
            PAID
          </ButtonYellow>
        ) : null
      ) : null}
      {!props.token ? (
        <ButtonYellow
          styleClass="w-full"
          onClick={() => props.setShowLoginModal(true)}
        >
          Login
        </ButtonYellow>
      ) : null}
      <ButtonYellow
        styleClass="w-full mt-2"
        primary={false}
        onClick={() =>
          (window.location.href = urls.WHATSAPP + '?text=' + message)
        }
      >
        <div className="flex flex-row justify-center items-center">
          <RiWhatsappFill className="text-[#4da750] mr-2 text-xl" />
          <div className="text-[#01202B] ">Chat on Whatsapp</div>
        </div>
      </ButtonYellow>
    </SummaryContainer>
  );
};
const mapStateToProps = (state) => {
  return {
    experience: state.experience.experience,
    durationSelected: state.experience.durationSelected,
    pax: state.experience.pax,
    selectedDate: state.experience.selectedDate,
    experienceCost: state.experience.experienceCost,
    serviceFee: state.experience.serviceFee,
    totalCost: state.experience.totalCost,
    token: state.auth.token,
    name: state.auth.name,
    phone: state.auth.phone,
    email: state.auth.email,
    checkoutStarted: state.experience.checkoutStarted,
    orderCreated: state.experience.orderCreated,
    couponApplied: state.experience.couponApplied,
    couponInvalid: state.experience.couponInvalid,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setOrderDetails: (details) =>
      dispatch(orderaction.setOrderDetails(details)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Details);
