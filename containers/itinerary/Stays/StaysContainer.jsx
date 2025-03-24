import { connect, useSelector } from "react-redux";
import HotelBooking from "./HotelBooking";
import React, { useState } from "react";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import BookingModal from "../../../components/modals/bookingupdated/Index";
import * as ga from "../../../services/ga/Index";
import AccommodationModal from "../../../components/modals/accommodation/Index";
import { isDateOlderThanCurrent } from "../../../helper/isDateOlderThanCurrent";
import { format, parse } from "date-fns";
import { CONTENT_SERVER_HOST } from "../../../services/constants";
const StaysContainer = (props) => {
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [showFilter, setshowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [AddHotel, setAddHotel] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [images, setImages] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingFunData, setBookingFunData] = useState(null);
  const [dates, setDates] = useState({ check_in: "", check_out: "" });
  const itineraryFilter=useSelector((state)=>state.ItineraryFilters)
  const _setImagesHandler = (images) => {
    setImages(images);
  };

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
    images,
    clickType
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
      cost: Math.round(cost),
      costings_breakdown: costings_breakdown,
      images: images,
      clickType:clickType
    });
    props.setShowBookingModal();
  };

  function handleClickAc(i, data, city_id,clickType) {
    let name = props.stayBookings[i]?.["name"];
    let itinerary_id = props.stayBookings[i]["itinerary_id"];
    let itinerary_name = props.stayBookings[i]["itinerary_name"];
    let accommodation = props.stayBookings[i]["accommodation"];
    let tailored_id = props.stayBookings[i]["tailored_itinerary"];
    let user_rating = props.stayBookings[i]?.star_category;
    let number_of_reviews = props.stayBookings[i]?.user_ratings_total;
    let id = props.stayBookings[i]["id"];
    let check_in = props.stayBookings[i]["check_in"];
    let check_out = props.stayBookings[i]["check_out"];
    let pax = {
      number_of_adults: props.stayBookings[i]["number_of_adults"],
      number_of_children: props.stayBookings[i]["number_of_children"],
      number_of_infants: props.stayBookings[i]["number_of_infants"],
    };
    let city = props.stayBookings[i]["city_name"];
    let cityId = city_id;
    let room_type = props.stayBookings[i]["room"];
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
      itinerary_name,
      clickType
    );
    data.clickType=clickType
    setCurrentBooking(data);
    props.setShowBookingModal();
  }

  function  handleClick(i, id, data, city_id) {
    let check_in = itineraryFilter.check_in;
    let check_out = itineraryFilter.check_out;
    setDates({ check_in, check_out });

    setBookingId(id);
    setCurrentBooking(data);
    setBookingFunData({ index: i, booking: data, city_id: city_id });
    setShowDetails(true);
  }


  return (
    <div id="stays" className="mt-16">
      <div
        id="staysBooking"
        className="text-[#262626] text-3xl font-bold cursor-pointer group transition duration-300 max-w-fit"
      >
        Stays
        <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>

      <div className="mt-4 space-y-6">
        {props.stayBookings &&
          props.stayBookings.map((booking, index) => (
            <HotelBooking
              key={booking?.id}
              index={index}
              booking={booking}
              payment={props.payment}
              handleClick={handleClick}
              handleClickAc={handleClickAc}
              setBookingId={setBookingId}
              setShowLoginModal={props.setShowLoginModal}
              plan={props.stayBookings}
              setStayBookings={props.setStayBookings}
              setShowDetails={setShowDetails}
            />
          ))}
      </div>

      <AccommodationModal
        mercury
        _setImagesHandler={_setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={bookingId}
        currentBooking={currentBooking}
        check_in={dates.check_in}
        check_out={dates.check_out}
        show={showDetails}
        payment={props.payment}
        plan={props.stayBookings}
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
        provider={currentBooking?.source}
        setStayBookings={props.setStayBookings}
        setShowDetails={setShowDetails}
      ></AccommodationModal>

      <BookingModal
        mercury
        showFilter={showFilter}
        setshowFilter={setshowFilter}
        payment={props.payment}
        plan={props.stayBookings}
        _setImagesHandler={_setImagesHandler}
        getPaymentHandler={props.getPaymentHandler}
        _updateStayBookingHandler={props._updateStayBookingHandler}
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
        handleClick={handleClick}
        stayBookings={props?.stayBookings}
        setStayBookings={props.setStayBookings}
      ></BookingModal>

      {images ? (
        <FullScreenGallery
          mercury
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
    plan: state.Plan,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

export default connect(mapStateToPros)(StaysContainer);
