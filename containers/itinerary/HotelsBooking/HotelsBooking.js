import React, { useState } from "react";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import BookingModal from "../../../components/modals/bookingupdated/Index";
import * as ga from "../../../services/ga/Index";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import AccommodationModal from "../../../components/modals/accommodation/Index";
import styled from "styled-components";
import { FaFilter } from "react-icons/fa";
import { connect } from "react-redux";
import HotelBookingContainer from "./HotelBookingContainer";
import LogInModal from "../../../components/modals/Login";
import useMediaQuery from "../../../hooks/useMedia";
import { TbArrowBack } from "react-icons/tb";
import { isDateOlderThanCurrent } from "../../../helper/isDateOlderThanCurrent";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";
import { format, parse } from "date-fns";
import Slide from "../../../Animation/framerAnimation/Slide";
import { CONTENT_SERVER_HOST } from "../../../services/constants";

const Floating = styled.div`
  position: fixed;
  bottom: 10px;
  background: #01202b;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 10px;

  cursor: pointer;
`;

const FloatingView = styled.div`
  position: fixed;
  bottom: 68px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const [showFilter, setshowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [AddHotel, setAddHotel] = useState(false);
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: "",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [images, setImages] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [alternates, setAlternates] = useState(null);
  const [bookingFunData, setBookingFunData] = useState(null);
  const [dates, setDates] = useState({ check_in: "", check_out: "" });

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
    cityId,
    room_type,
    itinerary_name,
    cost,
    costings_breakdown,
    images
  ) => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "Itinerary-bookings-acc_change",
          params: { name: name },
        });
    }

    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      accommodation: accommodation,
      id: id,
      tailored_id: tailored_id,
      check_in: format(new Date(check_in), "dd-MM-yyyy").replaceAll("-", "/"),
      check_out: format(new Date(check_out), "dd-MM-yyyy").replaceAll("-", "/"),
      pax: pax,
      city: city,
      cityId: cityId,
      room_type: room_type,

      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      images: images,
    });
    props.setShowBookingModal();
  };

  const _setImagesHandler = (images) => {
    setImages(images);
  };

  const _handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const _SelectedBookingHandler = ({ index }) => {
    return new Promise((resolve, reject) => {
      let updated_bookings_arr = [
        {
          id: props.stayBookings[index]["id"],

          accommodation: props.stayBookings[index]["accommodation"],

          booking_type: "Accommodation",

          remove_user_selected: true,

          itinerary_id: props.stayBookings[index]["itinerary_id"],
        },
      ];

      axiosbookingupdateinstance
        .patch(
          "update/?booking_type=Accommodation&itinerary_id=" +
            props.stayBookings[index]["itinerary_id"],
          updated_bookings_arr[0],
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        )
        .then((res) => {
          props._updateStayBookingHandler([res.data]);
          setTimeout(function () {
            props.getPaymentHandler();
          }, 1000);
          resolve(res.data); // Resolve the promise with the response data
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 400) {
              setIsError({
                error: true,
                errorMsg: err.response.data.message,
              });
            }
          }
          reject(err); // Reject the promise with the error object
        });
    });
  };

  const findObjectByDate = (array, date) =>
    array.find((obj) => obj.check_in === date);

  const isObjectByDate = (array, date) => {
    if (array) {
      const booking = findObjectByDate(array, date);
      if (booking) {
        return true;
      } else {
        return false;
      }
    }
  };

  const findObjectById = (array, id) => array.find((obj) => obj.id === id);
  const findIndexById = (array, id) => {
    const result_id = array.findIndex((obj) => obj.check_in === id);
    if (result_id === -1) return 0;
    else return result_id;
  };

  function handleClickAc(i, data, city_id) {
    let name = props.stayBookings[i]["name"];
    let itinerary_id = props.stayBookings[i]["itinerary_id"];
    let itinerary_name = props.stayBookings[i]["itinerary_name"];
    let accommodation = props.stayBookings[i]["accommodation"];
    let tailored_id = props.stayBookings[i]["tailored_itinerary"];
    let user_rating = props.stayBookings[i].user_rating;
    let number_of_reviews = props.stayBookings[i].number_of_reviews;
    let id = props.stayBookings[i]["id"];
    let check_in = props.stayBookings[i]["check_in"];
    let check_out = props.stayBookings[i]["check_out"];
    let pax = {
      number_of_adults:
        props.stayBookings[i].costings_breakdown[0]["number_of_adults"],
      number_of_children:
        props.stayBookings[i].costings_breakdown[0]["number_of_children"],
      number_of_infants:
        props.stayBookings[i].costings_breakdown[0]["number_of_infants"],
    };
    let city = props.stayBookings[i]["city"];
    let cityId = city_id;
    let room_type = props.stayBookings[i]["room_type"];

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
      cityId,
      room_type,
      user_rating,
      number_of_reviews,
      itinerary_name
    );
    setCurrentBooking(data);
    props.setShowBookingModal();
  }

  const _changeBookingNewHandler = (check_in, check_out, pax, city, cityId) => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "Itinerary-bookings-acc_change",
          params: { name: name },
        });
    }
    setAddHotel(true);
    setSelectedBooking({
      check_in: check_in,
      check_out: check_out,
      pax: pax,
      city: city,
      cityId: cityId,
    });
    props.setShowBookingModal();
  };

  function handleClickNewAc(i, data, city_id) {
    let check_in = data.checkin_date;
    let check_out = data.checkout_date;
    let pax = {
      number_of_adults: props.payment.meta_info["number_of_adults"],
      number_of_children: props.payment.meta_info["number_of_children"],
      number_of_infants: props.payment.meta_info["number_of_infants"],
    };
    let city = data.city_name;

    let cityId = data.city_id;

    _changeBookingNewHandler(check_in, check_out, pax, city, cityId);
    setCurrentBooking(data);
    props.setShowBookingModal;
  }

  function handleClick(i, id, data, city_id) {
    let check_in = props.stayBookings[i]["check_in"];
    let check_out = props.stayBookings[i]["check_out"];
    setDates({ check_in, check_out });

    if (data.source === "Agoda") {
      setBookingId(data.agoda_accommodation);
    } else setBookingId(id);
    setCurrentBooking(data);
    setBookingFunData({ index: i, booking: data, city_id: city_id });
    setShowDetails(true);
  }

  function convertDateFormat(dateString) {
    if (dateString) {
      const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
      const formattedDate = format(parsedDate, "yyyy-MM-dd");
      return formattedDate;
    }
  }

  const HotelArray = [];
  if (props.breif.city_slabs[1]?.hasOwnProperty("accommodation_booking")) {
    if (props.breif.city_slabs) {
      if (true) {
        for (var i = 0; i < props.breif.city_slabs.length - 1; i++) {
          if (props.breif.city_slabs[i].duration >= 1) {
            if (
              props.breif.city_slabs[i]?.accommodation_booking == null ||
              props.breif.city_slabs[i]?.accommodation_booking == ""
            ) {
              if (
                isObjectByDate(
                  props.stayBookings,
                  convertDateFormat(props.breif.city_slabs[i]?.checkin_date)
                )
              ) {
                const foundObject = findObjectByDate(
                  props.stayBookings,
                  convertDateFormat(props.breif.city_slabs[i]?.checkin_date)
                );
                HotelArray.push(
                  <HotelBookingContainer
                    booking={foundObject}
                    setShowLoginModal={props.setShowLoginModal}
                    index={findIndexById(
                      props.stayBookings,
                      convertDateFormat(props.breif.city_slabs[i]?.checkin_date)
                    )}
                    cityName={props.breif.city_slabs[i].city_name}
                    key={i}
                    handleClick={handleClick}
                    handleClickAc={handleClickAc}
                    _SelectedBookingHandler={_SelectedBookingHandler}
                    setHideBookingModal={props.setHideBookingModal}
                    city_id={props.breif.city_slabs[i].city_id}
                    loginModal={showLoginModal}
                    setLoginModal={setShowLoginModal}
                    token={props.token}
                    payment={props.payment}
                    plan={props.plan}
                  ></HotelBookingContainer>
                );
              } else {
                if (props.breif.city_slabs[i]?.duration != 0) {
                  HotelArray.push(
                    <HotelBookingContainer
                      booking={null}
                      index={i - 1}
                      key={i}
                      setShowLoginModal={props.setShowLoginModal}
                      handleClick={handleClick}
                      cityName={props.breif.city_slabs[i].city_name}
                      handleClickAc={handleClickNewAc}
                      _SelectedBookingHandler={_SelectedBookingHandler}
                      setHideBookingModal={props.setHideBookingModal}
                      loginModal={showLoginModal}
                      city_id={props.breif.city_slabs[i].city_id}
                      cityData={props.breif.city_slabs[i]}
                      setLoginModal={setShowLoginModal}
                      token={props.token}
                      payment={props.payment}
                      plan={props.plan}
                    ></HotelBookingContainer>
                  );
                }
              }
            } else {
              if (props.stayBookings) {
                const idsArray =
                  props.breif.city_slabs[i]?.accommodation_booking.split(",");
                idsArray.map((item) => {
                  const foundObject = findObjectById(props.stayBookings, item);
                  HotelArray.push(
                    <HotelBookingContainer
                      booking={foundObject}
                      setShowLoginModal={props.setShowLoginModal}
                      index={findIndexById(
                        props.stayBookings,
                        convertDateFormat(
                          props.breif.city_slabs[i]?.checkin_date
                        )
                      )}
                      cityName={props.breif.city_slabs[i].city_name}
                      key={i}
                      handleClick={handleClick}
                      handleClickAc={handleClickAc}
                      _SelectedBookingHandler={_SelectedBookingHandler}
                      setHideBookingModal={props.setHideBookingModal}
                      city_id={props.breif.city_slabs[i].city_id}
                      loginModal={showLoginModal}
                      setLoginModal={setShowLoginModal}
                      token={props.token}
                      payment={props.payment}
                      plan={props.plan}
                    ></HotelBookingContainer>
                  );
                });
              }
            }
          }
        }
      }
    }
  }

  return (
    <div className="lg:w-[60vw] w-full lg:mx-0 lg:mt-16">
      <div
        id="staysBooking"
        className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit"
      >
        Stays
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>

      <div className=" fixed right-[10px] top-[50px] z-[200] ">
        {isError.error && (
          <Slide
            hideTime={8}
            onUnmount={() =>
              setIsError({
                error: false,
                errorMsg: "",
              })
            }
            isActive={isError.error}
            direction={-2}
            duration={1.3}
            ydistance={25}
          >
            <div className="text-white  font-lexend px-2 py-1 border-2 border-red bg-red-500 rounded-lg  text-center font-normal text-sm ">
              {isError.errorMsg}
            </div>
          </Slide>
        )}
      </div>

      {props.breif.city_slabs[1]?.hasOwnProperty("accommodation_booking")
        ? HotelArray
        : props.stayBookings
        ? props.stayBookings.map((booking, index) => (
            <HotelBookingContainer
              setShowLoginModal={props.setShowLoginModal}
              booking={booking}
              index={index}
              key={index}
              handleClick={handleClick}
              handleClickAc={handleClickAc}
              selectedBooking={booking}
              city_id={props?.breif?.city_slabs[index]?.city_id}
              _SelectedBookingHandler={_SelectedBookingHandler}
              setHideBookingModal={props.setHideBookingModal}
              loginModal={showLoginModal}
              setLoginModal={setShowLoginModal}
              token={props.token}
              payment={props.payment}
              plan={props.plan}
            ></HotelBookingContainer>
          ))
        : null}

      <AccommodationModal
        _setImagesHandler={_setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={bookingId}
        currentBooking={currentBooking}
        check_in={dates.check_in}
        check_out={dates.check_out}
        show={showDetails}
        payment={props.payment}
        plan={props.plan}
        BookingButton={
          !isDateOlderThanCurrent(props?.plan?.start_date) ? true : false
        }
        bookingFunData={bookingFunData}
        BookingButtonFun={() =>
          handleClickAc(
            bookingFunData.index,
            bookingFunData.booking,
            bookingFunData.city_id
          )
        }
      ></AccommodationModal>

      {showLoginModal && (
        <div>
          <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
        </div>
      )}

      <BookingModal
        showFilter={showFilter}
        setshowFilter={setshowFilter}
        payment={props.payment}
        plan={props.plan}
        _setImagesHandler={_setImagesHandler}
        getPaymentHandler={props.getPaymentHandler}
        _updateStayBookingHandler={props._updateStayBookingHandler}
        alternates={alternates}
        tailored_id={
          props.stayBookings && props.stayBookings[0]
            ? props.stayBookings[0]["tailored_itinerary"]
            : null
        }
        _updatePaymentHandler={props._updatePaymentHandler}
        _updateBookingHandler={props._updateBookingHandler}
        selectedBooking={selectedBooking}
        setShowBookingModal={props.setShowBookingModal}
        currentBooking={currentBooking}
        showBookingModal={props.showBookingModal}
        setHideBookingModal={props.setHideBookingModal}
        AddHotel={AddHotel}
        _GetInTouch={props._GetInTouch}
      ></BookingModal>

      {!isDesktop && props.showBookingModal && (
        <div className="absolute bottom-0 right-10 z-[1502]">
          <Floating>
            <FaFilter
              className="text-white"
              style={{ height: "18px", width: "18px" }}
              cursor={"pointer"}
              onClick={(e) => {
                setshowFilter(true);
              }}
            />
          </Floating>
        </div>
      )}

      {!isDesktop && props.showBookingModal && (
        <div className="absolute bottom-0 right-10 z-[1510]">
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={props.setHideBookingModal}
            />
          </FloatingView>
        </div>
      )}

      {props.token && props.showBookingModal && (
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

export default connect(mapStateToPros)(HotelsBooking);
