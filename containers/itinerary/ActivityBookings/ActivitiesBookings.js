import React, { useEffect, useState } from 'react';
import ImageLoader from '../../../components/ImageLoader';
import StarRating from '../../../components/StarRating';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
import { FaBed, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import FullScreenGallery from '../../../components/fullscreengallery/Index';
import BookingModal from '../../../components/modals/bookingupdated/Index';
import * as ga from '../../../services/ga/Index';
import Flickity from '../../../components/FlickityCarousel';
import ButtonYellow from '../../../components/ButtonYellow';
import AccommodationModal from '../../../components/modals/accommodation/Index';
import styled from 'styled-components';

import {
  getDate,
  convertDateYearFormat,
} from '../../../helper/ConvertDateFormat';
import { connect } from 'react-redux';

const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;
const ActivitiesBookings = (props) => {
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [bookingsAccommodationsDesktopJSX, setBookingAccommodationsDesktopJSX] =
    useState([]);
  const [bookingsAccommodationsMobileJSX, setBookingAccommodationsMobileJSX] =
    useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [images, setImages] = useState(null);
  const [alternates, setAlternates] = useState(null);
  console.log(props.stayBookings);
  const _changeBookingHandler = (
    name,
    itinerary_id,
    tailored_id,
    accommodation,
    id,
    check_in,
    check_out,
    pax,
    city,
    room_type,
    number_of_rooms,
    itinerary_name,
    cost,
    costings_breakdown,
    images
  ) => {
    ga.event({
      action: 'Itinerary-bookings-acc_change',
      params: { name: name },
    });

    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      accommodation: accommodation,
      id: id,
      tailored_id: tailored_id,
      check_in: check_in,
      check_out: check_out,
      pax: pax,
      city: city,
      room_type: room_type,

      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      images: images,
    });
    props.setShowBookingModal();
  };
  let bookings_accommodations = [];

  let alternatesarr = [];

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
  const _setImagesHandler = (images) => {
    setImages(images);
  };

  // setBookingAccommodationsDesktopJSX(
  //   <DesktopCardContainer>{bookings_accommodations}</DesktopCardContainer>
  // );
  // setBookingAccommodationsMobileJSX(
  //   <Flickity
  //     initialIndex={props.stayFlickityIndex}
  //     cards={bookings_accommodations}
  //   ></Flickity>
  // );
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);
  // useEffect(() => {
  //   if (props.stayBookings)
  //     for (var i = 0; i < props.stayBookings.length; i++) {
  //       if (props.stayBookings[i].alternate_to) {
  //         if (!alternatesarr[props.stayBookings[i].alternate_to])
  //           alternatesarr[props.stayBookings[i].alternate_to] = [];
  //       }
  //       if (!bookingcities[props.stayBookings[i].city]) {
  //         bookingcities[props.stayBookings[i].city] = [];
  //         alternatesarr[props.stayBookings[i].city] = [];
  //       }

  //       let oldbooking = false;
  //       if (props.stayBookings[i].version === 'v1') oldbooking = true;
  //       if (props.traveleritinerary) oldbooking = true;
  //       let name = props.stayBookings[i]['name'];
  //       let costings_breakdown = props.stayBookings[i]['costings_breakdown'];
  //       let cost = props.stayBookings[i]['booking_cost'];
  //       let itinerary_id = props.stayBookings[i]['itinerary_id'];
  //       let itinerary_name = props.stayBookings[i]['itinerary_name'];
  //       let booking_type = props.stayBookings[i]['booking_type'];
  //       let images = props.stayBookings[i]['images'];
  //       let accommodation = props.stayBookings[i]['accommodation'];
  //       let tailored_id = props.stayBookings[i]['tailored_itinerary'];
  //       let id = props.stayBookings[i]['id'];
  //       let check_in = props.stayBookings[i]['check_in'];
  //       let check_out = props.stayBookings[i]['check_out'];
  //       let pax = {
  //         number_of_adults: props.stayBookings[i]['number_of_adults'],
  //         number_of_children: props.stayBookings[i]['number_of_children'],
  //         number_of_infants: props.stayBookings[i]['number_of_infants'],
  //       };
  //       let city = props.stayBookings[i]['city'];
  //       let room_type = props.stayBookings[i]['room_type'];
  //       if (oldbooking) {
  //         bookings_accommodations.push(
  //           <OldBookingCard
  //             payment={props.payment}
  //             city={props.stayBookings[i].city}
  //             type={props.stayBookings[i].booking_type}
  //             key={i}
  //             setShowBookingModal={(props) =>
  //               _changeBookingHandler(
  //                 name,
  //                 itinerary_id,
  //                 tailored_id,
  //                 accommodation,
  //                 id,
  //                 check_in,
  //                 check_out,
  //                 pax,
  //                 city,
  //                 room_type,
  //                 number_of_rooms,
  //                 itinerary_name
  //               )
  //             }
  //             showBookingModal={props.showBookingModal}
  //             setHideBookingModal={props.setHideBookingModal}
  //             blur={props.blur}
  //             setImagesHandler={props.setImagesHandler}
  //             accommodation
  //             heading={props.stayBookings[i]['name']}
  //             setImagesHandler={_setImagesHandler}
  //             rating={props.stayBookings[i]['user_rating']}
  //             details={props.stayBookings[i]['points']}
  //             rating={props.stayBookings[i]['weighted_rating']}
  //             images={props.stayBookings[i]['images']}
  //             price={props.stayBookings[i]['booking_cost']}
  //             number_of_rooms={props.stayBookings[i]['number_of_rooms']}
  //             check_in={props.stayBookings[i]['check_in']}
  //             check_out={props.stayBookings[i]['check_out']}
  //             room_type={props.stayBookings[i]['room_type']}
  //           ></OldBookingCard>
  //         );
  //       } else {
  //         if (props.stayBookings[i].booking_type === 'Accommodation') {
  //           let number_of_rooms;
  //           if (props.stayBookings[i].costings_breakdown.length)
  //             number_of_rooms =
  //               props.stayBookings[i].costings_breakdown[0]['number_of_rooms'];
  //           if (
  //             !props.stayBookings[i].user_selected &&
  //             !props.stayBookings[i].alternate_to
  //           ) {
  //             bookings_accommodations.push(
  //               <StayBookingCard
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 isDatePresent={props.isDatePresent}
  //                 token={props.token}
  //                 setShowLoginModal={setShowLoginModal}
  //                 is_selecting={
  //                   props.stayBookings[i].id === props.selectingBooking
  //                 }
  //                 _deselectBookingHandler={props._deselectStayBookingHandler}
  //                 is_stock={props.is_stock}
  //                 is_selected={true}
  //                 is_auth={props.is_auth}
  //                 are_prices_hidden={
  //                   props.payment ? props.payment.are_prices_hidden : false
  //                 }
  //                 setShowBookingModal={(props) =>
  //                   _changeBookingHandler(
  //                     name,
  //                     itinerary_id,
  //                     tailored_id,
  //                     accommodation,
  //                     id,
  //                     check_in,
  //                     check_out,
  //                     pax,
  //                     city,
  //                     room_type,
  //                     number_of_rooms,
  //                     itinerary_name,
  //                     cost,
  //                     costings_breakdown,
  //                     images
  //                   )
  //                 }
  //                 showBookingModal={props.showBookingModal}
  //                 setHideBookingModal={props.setHideBookingModal}
  //                 setImagesHandler={_setImagesHandler}
  //                 data={props.stayBookings[i]}
  //               ></StayBookingCard>
  //             );
  //             //set as selectable booking
  //           } else if (
  //             !props.stayBookings[i].user_selected &&
  //             props.stayBookings[i].alternate_to
  //           ) {
  //             //add in alternate list
  //             alternatesarr[props.stayBookings[i].alternate_to].push(
  //               props.stayBookings[i]
  //             );
  //           } else
  //             bookings_accommodations.push(
  //               <StayBookingCard
  //                 is_registration_needed={
  //                   props.payment ? props.payment.is_registration_needed : false
  //                 }
  //                 isDatePresent={props.isDatePresent}
  //                 setShowLoginModal={setShowLoginModal}
  //                 token={props.token}
  //                 is_selecting={
  //                   props.stayBookings[i].id === props.selectingBooking
  //                 }
  //                 _deselectBookingHandler={props._deselectStayBookingHandler}
  //                 is_stock={props.is_stock}
  //                 is_selected={true}
  //                 is_auth={props.is_auth}
  //                 are_prices_hidden={
  //                   props.payment ? props.payment.are_prices_hidden : false
  //                 }
  //                 setShowBookingModal={(props) =>
  //                   _changeBookingHandler(
  //                     name,
  //                     itinerary_id,
  //                     tailored_id,
  //                     accommodation,
  //                     id,
  //                     check_in,
  //                     check_out,
  //                     pax,
  //                     city,
  //                     room_type,
  //                     number_of_rooms,
  //                     itinerary_name,
  //                     cost,
  //                     costings_breakdown,
  //                     images
  //                   )
  //                 }
  //                 showBookingModal={props.showBookingModal}
  //                 setHideBookingModal={props.setHideBookingModal}
  //                 setImagesHandler={_setImagesHandler}
  //                 data={props.stayBookings[i]}
  //               ></StayBookingCard>
  //             );
  //         }
  //       }
  //     }
  //   setAlternates(alternatesarr);

  //   // setBookingAccommodationsDesktopJSX(
  //   //   <DesktopCardContainer>{bookings_accommodations}</DesktopCardContainer>
  //   // );
  //   // setBookingAccommodationsMobileJSX(
  //   //   <Flickity
  //   //     initialIndex={props.stayFlickityIndex}
  //   //     cards={bookings_accommodations}
  //   //   ></Flickity>
  //   // );
  // }, [
  //   props.stayBookings,
  //   props.selectingBooking,
  //   props.stayFlickityIndex,
  //   props.token,
  //   props.payment,
  // ]);
  function handleClickAc(i) {
    let name = props.stayBookings[i]['name'];
    let costings_breakdown = props.stayBookings[i]['costings_breakdown'];
    let cost = props.stayBookings[i]['booking_cost'];
    let itinerary_id = props.stayBookings[i]['itinerary_id'];
    let itinerary_name = props.stayBookings[i]['itinerary_name'];
    let booking_type = props.stayBookings[i]['booking_type'];
    let accommodation = props.stayBookings[i]['accommodation'];
    let tailored_id = props.stayBookings[i]['tailored_itinerary'];
    let id = props.stayBookings[i]['id'];
    let check_in = props.stayBookings[i]['check_in'];
    let check_out = props.stayBookings[i]['check_out'];
    let pax = {
      number_of_adults:
        props.stayBookings[i].costings_breakdown[0]['number_of_adults'],
      number_of_children:
        props.stayBookings[i].costings_breakdown[0]['number_of_children'],
      number_of_infants:
        props.stayBookings[i].costings_breakdown[0]['number_of_infants'],
    };
    let city = props.stayBookings[i]['city'];
    let room_type = props.stayBookings[i]['room_type'];
    _changeBookingHandler(
      name,
      itinerary_id,
      tailored_id,
      accommodation,
      id,
      check_in,
      check_out,
      pax,
      city,
      room_type,

      itinerary_name
    );

    props.setShowBookingModal;
  }
  function handleClick(i, id) {
    setBookingId(id);

    setShowDetails(true);
  }
  console.log('activityBookings');
  console.log(props.activityBookings);

  return (
    <div className="lg:w-[60vw] w-full">
      <div className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit">
        Activities
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.activityBookings
        ? props.activityBookings.map((booking, index) => (
            <div className="flex gap-1 pt-4  flex-col justify-start">
              <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
                {booking?.city}:{' '}
                {booking.duration && <span>({booking?.duration}N)</span>}
              </div>
              <div className=" shadow-md rounded-lg transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-500/50 border-[#ECEAEA]  hover:border-[#ffa500] shadow-[#ECEAEA] lg:p-4 p-2">
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
                          {booking.check_in && getDate(booking.check_in)}
                          {booking.check_out &&
                            ' - ' + ' ' + getDate(booking.check_out)}
                        </div>
                      </div>
                    </div>
                    {booking.costings_breakdown[0] && (
                      <div>
                        <div
                          className={`flex ${
                            noOfWords(
                              booking.costings_breakdown[0]?.room_type,
                              4
                            )
                              ? 'lg:flex-row flex-col'
                              : 'flex-row'
                          } gap-3`}
                        >
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
                              {Addons(
                                booking.costings_breakdown[0].pricing_type
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                    <div className="flex flex-row gap-3 items-center w-full">
                      {booking.accommodation && (
                        <ButtonYellow
                          className="lg:w-fit w-1/2"
                          onClick={() =>
                            handleClick(index, booking.accommodation)
                          }
                        >
                          <div className="text-[#01202B] ">View Detail</div>
                        </ButtonYellow>
                      )}
                      {props?.stayBookings[index] && (
                        <ButtonYellow
                          primary={false}
                          className="lg:w-fit w-1/2"
                          onClick={() => {
                            handleClickAc(index);
                          }}
                        >
                          <div className="text-[#01202B] ">Change</div>
                        </ButtonYellow>
                      )}
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
      <AccommodationModal
        _setImagesHandler={_setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={bookingId}
        show={showDetails}
      ></AccommodationModal>

      {props.showBookingModal ? (
        <BookingModal
          _setImagesHandler={_setImagesHandler}
          getPaymentHandler={props.getPaymentHandler}
          _updateStayBookingHandler={props._updateStayBookingHandler}
          alternates={alternates}
          tailored_id={
            props.stayBookings
              ? props.stayBookings[0]['tailored_itinerary']
              : null
          }
          _updatePaymentHandler={props._updatePaymentHandler}
          _updateBookingHandler={props._updateBookingHandler}
          selectedBooking={selectedBooking}
          setShowBookingModal={props.setShowBookingModal}
          showBookingModal={props.showBookingModal}
          setHideBookingModal={props.setHideBookingModal}
        ></BookingModal>
      ) : null}
      {images ? (
        <FullScreenGallery
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      ) : null}
    </div>
  );
};
const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToPros, mapDispatchToProps)(ActivitiesBookings);
