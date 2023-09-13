import React, { useState } from 'react';
import styled from 'styled-components';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
import ButtonYellow from '../ButtonYellow';
import { getIndianPrice } from '../../services/getIndianPrice';
import { getHumanDate } from '../../services/getHumanDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RiWhatsappFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Accordion from '../../containers/itinerary/booking1/Accordion';
const font = styled.div`
  font-family: 'Lexend';
`;
const Container = styled.div`
  width: ${(props) => props.width || '100%'};
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px;
  height: ${(props) => props.ContainerHeight + 'px'};
  transition: all 0.25s;
  overflow: clip;
`;
const BookingContainer = (props) => {
  const [iscouponApplied, setiscouponApplied] = useState(false);
  const [percentoff, setPercentoff] = useState(0);
  const router = useRouter();
  const [acoordianceOpen, setAcordianOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  let message =
    'Hey TTW! I need some help with my tailored experience - https://thetarzanway.com/' +
    router.asPath;
  // props.setUserDetails();
  const [showVerification, setShowVerification] = useState(false);
  const [showRegistration, setShowRegistartion] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // const handleInputChange = (event) => {
  //   setInputValue(event.target.value);
  //   console.log(inputValue);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue.length > 0) {
      if (props.payment.coupon.code == inputValue) {
        setiscouponApplied(true);
        setPercentoff(props.payment.coupon.discount_value);
      }

      setShowVerification(true);
      setShowRegistartion(false);
    }
  };
  let bookingslist = [];
  let bookinglistwithcost = [];
  //Date on which agoda changes made to box
  let oldaccommodation = false;
  // if(props.payment) if(props..version ==='v1') oldaccommodation = true;
  if (props.traveleritinerary) oldaccommodation = true;

  const [pax, setPax] = useState(5);

  useEffect(() => {
    try {
      setPax(props.payment.meta_info.number_of_adults);
    } catch {}
    // _calculateServiceFee(props.payment.payment_info[0]["starting_point"], 1)
  }, [props.payment]);
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
                        ? 'font-opensans text-enter blurry-text'
                        : 'font-opensans text-enter'
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
                          ? 'font-opensans text-enter blurry-text'
                          : 'font-opensans text-enter'
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
                          ? 'font-opensans text-enter blurry-text'
                          : 'font-opensans text-enter'
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
                        ? 'font-opensans text-enter blurry-text'
                        : 'font-opensans text-enter'
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
                          ? 'font-opensans text-enter blurry-text'
                          : 'font-opensans text-enter'
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
                          ? 'font-opensans text-enter blurry-text'
                          : 'font-opensans text-enter'
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
              'https://dev.thetarzanway.com/itinerary/physicswallah/' +
              data.itinerary +
              '?payment_status=success';
          })
          .catch((err) => {
            setPaymentLoading(false);
            // router.push('/itinerary/'+data.itinerary+"?payment_status=fail")
            window.location.href =
              'https://dev.thetarzanway.com/itinerary/physicswallah/' +
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
  setBookingSummary();
  return (
    <font>
      <div className="font-lexend ml-4 flex flex-col rounded-xl shadow-md   border-2 border-[#ECEAEA] shadow-[#ECEAEA]">
        <div className="flex flex-col  bg-[#F7E70033] ">
          <div className="p-3">
            <div className="flex flex-row justify-between">
              {/* <div className="flex flex-row items-center text-[#7A7A7A] gap-1 text-base font-light line-through">
                <span>₹</span>
                <div>
                  {' '}
                  {getIndianPrice(
                    Math.round(props.payment.per_person_total_cost / 100) * 2
                  )}
                </div>
              </div> */}
              {iscouponApplied && (
                <div className="bg-[#EB5757] font-bold text-sm px-2 py-1 text-white">
                  {percentoff}% OFF
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {props?.payment && (
                <div className="flex flex-row gap-1">
                  <div className="flex flex-row items-center text-black font-bold text-2xl">
                    <span>₹</span>
                    <div>
                      {getIndianPrice(
                        Math.round(Math.round(props?.payment.total_cost) / 100)
                      )}
                    </div>
                  </div>
                  <div className="font-medium text-base self-end">
                    Total Cost
                  </div>
                </div>
              )}

              <div className="text-[#7A7A7A]">Exclusive applicable taxes</div>
            </div>
            <div
              className=" font-semibold flex gap-0 flex-row cursor-pointer"
              onClick={() => setAcordianOpen(!acoordianceOpen)}
            >
              <div>
                {acoordianceOpen ? <span>Hide</span> : <span>View</span>}{' '}
                breakup
              </div>

              <RiArrowDropDownLine
                className={` text-2xl  mt-1 transition-all duration-100 ${
                  acoordianceOpen ? '-rotate-180 ' : 'rotate-180 animate-bounce'
                }`}
              ></RiArrowDropDownLine>
            </div>

            <div
              className={`Transition-Height-${acoordianceOpen ? 'in' : 'out'} `}
            >
              {acoordianceOpen && (
                <div>
                  <Accordion
                    className="bg-[#F7E70033] text-lg font-bold"
                    stayBookings={props.stayBookings}
                    flightBookings={props.flightBookings}
                    activityBookings={props.activityBookings}
                    transferBookings={props.transferBookings}
                    payment={props.payment}
                  ></Accordion>
                  {!oldaccommodation && !props.payment.are_prices_hidden ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto max-content',

                        gridGap: '1rem',
                      }}
                    >
                      <div
                        className={
                          props.blur
                            ? 'font-opensans text-enter blurry-text'
                            : 'text-sm font-semibold'
                        }
                      >
                        {'Service Fee'}
                      </div>
                      <div
                        className={
                          props.blur
                            ? 'font-opensans text-enter blurry-text'
                            : 'text-sm font-semibold'
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
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto max-content',

                        gridGap: '1rem',
                      }}
                    >
                      <div
                        className={
                          props.blur
                            ? 'font-opensans text-enter blurry-text'
                            : 'text-sm font-semibold'
                        }
                      >
                        {'GST'}
                      </div>
                      <div
                        className={
                          props.blur
                            ? 'font-opensans text-enter blurry-text'
                            : 'text-sm font-semibold'
                        }
                      >
                        {'₹ ' +
                          getIndianPrice(Math.round(props.payment.gst / 100))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-3 ">
          {props?.payment?.allow_coupon_discount ? (
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="relative  rounded-md shadow-sm cursor-pointer">
                <input
                  class=" px-3 w-9/12 py-2 mt-3 border-2 border-[#ECEAEA] rounded-md focus:outline-none focus:border-indigo-500"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  id="name"
                  name="name"
                  placeholder="Have a coupon code?"
                />
                <button
                  className="pointer-events-none absolute  inset-y-0 right-1 top-4 flex items-center pr-3  "
                  type="submit"
                >
                  <div
                    className=" font-bold text-black cursor-pointer"
                    aria-hidden="true"
                  >
                    Apply
                  </div>
                </button>
              </div>
            </form>
          ) : null}

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
              <RiWhatsappFill className="text-[#4da750] mr-2 text-xl" />
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

export default React.memo(BookingContainer);
