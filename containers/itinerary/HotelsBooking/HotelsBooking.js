import React, { useEffect, useState } from 'react';
import ImageLoader from '../../../components/ImageLoader';
import StarRating from '../../../components/StarRating';
import { BsCalendar2, BsPeopleFill } from 'react-icons/bs';
import { FaBed, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import FullScreenGallery from '../../../components/fullscreengallery/Index';
import BookingModal from '../../../components/modals/bookingupdated/Index';
import * as ga from '../../../services/ga/Index';
import axiosbookingupdateinstance from '../../../services/bookings/UpdateBookings';

import ButtonYellow from '../../../components/ButtonYellow';
import AccommodationModal from '../../../components/modals/accommodation/Index';
import styled from 'styled-components';
import { FaFilter } from 'react-icons/fa';
import {
  getDate,
  convertDateYearFormat,
} from '../../../helper/ConvertDateFormat';
import { connect } from 'react-redux';
import HotelBookingContainer from './HotelBookingContainer';
import LogInModal from '../../../components/modals/Login';
import useMediaQuery from '../../../hooks/useMedia';
import { TbArrowBack } from 'react-icons/tb';
import { isDateOlderThanCurrent } from '../../../helper/isDateOlderThanCurrent';
import Modal from '../../../components/ui/Modal';
import MakeYourPersonalised from '../../../components/MakeYourPersonalised';
import { useRouter } from 'next/router';
const starHotel = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;
const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;
const Floating = styled.div`
  position: fixed;

  bottom: 10px;
  background: #01202b;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 10px;

  cursor: pointer;
`;
const FloatingView = styled.div`
  position: fixed;

  bottom: 100px;
  background: #f7e700;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 10px;

  cursor: pointer;
`;
const HotelsBooking = (props) => {
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const isDesktop = useMediaQuery('(min-width:1148px)');
  const [bookingsAccommodationsDesktopJSX, setBookingAccommodationsDesktopJSX] =
    useState([]);
  const [showFilter, setshowFilter] = useState(false);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [bookingsAccommodationsMobileJSX, setBookingAccommodationsMobileJSX] =
    useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [images, setImages] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
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
  const _handleLoginClose = () => {
    // props.getPaymentHandler();
    setShowLoginModal(false);
  };
  const _SelectedBookingHandler = ({
    itinerary_id,
    tailored_id,
    itinerary_name,
    user_selected,
    index,
  }) => {
    setUpdateBookingState(true);
    // const token = localStorage.getItem('access_token');
    let updated_bookings_arr = [
      {
        id: props.stayBookings[index]['id'],
        costings_breakdown: props.stayBookings[index]['costings_breakdown'],
        accommodation: props.stayBookings[index]['accommodation'],
        is_estimated_price: true,
        alternate_to: null,
        booking_type: 'Accommodation',
        itinerary_type: 'Tailored',
        user_selected: user_selected,
        itinerary_id: props.stayBookings[index]['itinerary_id'],
        tailored_itinerary: tailored_id,
        itinerary_name: itinerary_name,
        itinerary_db_id: null,
      },
    ];

    // const token = localStorage.getItem('access_token');
    axiosbookingupdateinstance
      .post(
        '?booking_type=Accommodation&itinerary_id=' +
          props.stayBookings[index]['itinerary_id'],
        updated_bookings_arr,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        props._updateStayBookingHandler(res.data.bookings);
        setTimeout(function () {
          props.getPaymentHandler();
        }, 1000);
        // props._updatePaymentHandler(res.data.payment_info);
        setUpdateBookingState(false);
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        setUpdateBookingState(false);
        setUnauthorized(true);

        // window.alert("There seems to be a problem, please try again!")
      });
  };
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
  // setBookingAccommodationsDesktopJSX(
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
  function handleClickAc(i, data) {
    let name = props.stayBookings[i]['name'];
    let costings_breakdown = props.stayBookings[i]['costings_breakdown'];
    let cost = props.stayBookings[i]['booking_cost'];
    let itinerary_id = props.stayBookings[i]['itinerary_id'];
    let itinerary_name = props.stayBookings[i]['itinerary_name'];
    let booking_type = props.stayBookings[i]['booking_type'];
    let accommodation = props.stayBookings[i]['accommodation'];
    let tailored_id = props.stayBookings[i]['tailored_itinerary'];
    let user_rating = props.stayBookings[i].user_rating;
    let number_of_reviews = props.stayBookings[i].number_of_reviews;
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
      user_rating,
      number_of_reviews,
      itinerary_name
    );
    setCurrentBooking(data);
    props.setShowBookingModal;
  }
  function handleClick(i, id, data) {
    setBookingId(id);
    setCurrentBooking(data);
    setShowDetails(true);
  }
  const HotelArray = [];
  if (props.breif) {
    if (props.breif.city_slabs) {
      if (props.stayBookings) {
        for (var i = 1; i < props.breif.city_slabs.length - 1; i++) {
          if (
            props.breif.city_slabs[i]?.accommodation_booking == null ||
            props.breif.city_slabs[i]?.accommodation_booking == ''
          ) {
            HotelArray.push(
              <HotelBookingContainer
                booking={null}
                index={i - 1}
                key={i}
                handleClick={handleClick}
                cityName={props.breif.city_slabs[i].city_name}
                handleClickAc={handleClickAc}
                _SelectedBookingHandler={_SelectedBookingHandler}
                setHideBookingModal={props.setHideBookingModal}
                loginModal={showLoginModal}
                setLoginModal={setShowLoginModal}
                token={props.token}
              ></HotelBookingContainer>
            );
          } else {
            HotelArray.push(
              <HotelBookingContainer
                booking={props.stayBookings[i - 1]}
                index={i - 1}
                cityName={props.breif.city_slabs[i].city_name}
                key={i}
                handleClick={handleClick}
                handleClickAc={handleClickAc}
                _SelectedBookingHandler={_SelectedBookingHandler}
                setHideBookingModal={props.setHideBookingModal}
                loginModal={showLoginModal}
                setLoginModal={setShowLoginModal}
                token={props.token}
              ></HotelBookingContainer>
            );
          }
        }
      }
    }
  }

  return (
    <div className="lg:w-[60vw] w-full lg:mx-0 ">
      <div
        id="Stays-Head"
        className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit"
      >
        Stays
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.breif.city_slabs[1]?.accommodation_booking
        ? HotelArray
        : props.stayBookings
        ? props.stayBookings.map((booking, index) => (
            <HotelBookingContainer
              booking={booking}
              index={index}
              key={index}
              handleClick={handleClick}
              handleClickAc={handleClickAc}
              _SelectedBookingHandler={_SelectedBookingHandler}
              setHideBookingModal={props.setHideBookingModal}
              loginModal={showLoginModal}
              setLoginModal={setShowLoginModal}
              token={props.token}
            ></HotelBookingContainer>
          ))
        : null}

      <AccommodationModal
        _setImagesHandler={_setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={bookingId}
        currentBooking={currentBooking}
        show={showDetails}
      ></AccommodationModal>
      {showLoginModal && (
        <div>
          <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
        </div>
      )}
      {props.showBookingModal ? (
        <BookingModal
          showFilter={showFilter}
          setshowFilter={setshowFilter}
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
          currentBooking={currentBooking}
          showBookingModal={props.showBookingModal}
          setHideBookingModal={props.setHideBookingModal}
        ></BookingModal>
      ) : null}
      {!isDesktop && props.showBookingModal && (
        <div className="absolute bottom-0 right-10 z-[1502]">
          <Floating>
            <FaFilter
              className="text-white"
              style={{ height: '32px', width: '32px' }}
              cursor={'pointer'}
              onClick={(e) => {
                setshowFilter(true);
              }}
            />
          </Floating>
        </div>
      )}
      {!isDesktop && props.showBookingModal && (
        <div className="absolute bottom-0 right-10 z-[1510]">
          {/* <Slide
              hideTime={4}
              onUnmount={() => setFloatingButtonView(!floatingButtonView)}
              isActive={floatingButtonView}
              direction={5}
              duration={2}
              xdistance={-50}
            > */}
          <FloatingView>
            <TbArrowBack
              style={{ height: '32px', width: '32px' }}
              cursor={'pointer'}
              onClick={props.setHideBookingModal}
            />
          </FloatingView>
          {/* </Slide> */}
        </div>
      )}
      {props.showBookingModal && (
        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={props.setHideBookingModal}
        />
      )}

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

export default connect(mapStateToPros, mapDispatchToProps)(HotelsBooking);
