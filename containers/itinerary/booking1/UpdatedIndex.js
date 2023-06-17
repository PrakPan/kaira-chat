import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BookingCard from "../../../components/cards/bookings/activitybooking/Index";
import SummaryContainer from "./TailoredDetails";
import GITSummaryContainer from "./gittailored/Index";
import ComingSoon from "./ComingSoon";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import Timer from "../timer/Index";
import { connect } from "react-redux";
import BookingModal from "../../../components/modals/bookingupdated/Index";
import FlightModal from "../../../components/modals/flights/Index";
import OldBookingCard from "../../../components/cards/Booking";
import { useRouter } from "next/router";
import media from "../../../components/media";
import DesktopBanner from "../../../components/containers/Banner";
import Banner from "../../homepage/banner/Mobile";
import DesktopCardContainer from "./DesktopCardCotainer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getIndianPrice } from "../../../services/getIndianPrice";
import * as ga from "../../../services/ga/Index";
import urls from "../../../services/urls";
import StayBookingCard from "../../../components/cards/bookings/staybooking/Index";
import FlightBookingCard from "../../../components/cards/bookings/flightbooking/Index";
import TaxiBookingCard from "../../../components/cards/bookings/taxibooking/Index";
import BusBookingCard from "../../../components/cards/bookings/busbooking/Index";
import FooterBannerMobile from "./FooterBannerMobile";
import ImageLoader from "../../../components/ImageLoader";
import LogInModal from "../../../components/modals/Login";
import TaxiModal from "../../../components/modals/taxis/Index";
import FerryBookingCard from "../../../components/cards/bookings/ferrybooking/Index";
import openTailoredModal from "../../../services/openTailoredModal";
import SwiperCarousel from "../../../components/SwiperCarousel";

const Container = styled.div`
  width: 100%;
  margin: auto;

  @media screen and (min-width: 768px) {
    width: 90%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    margin-top: 10vh;
  }
`;
const MobileWidthContainer = styled.div`
  width: 90%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 100%;
  }
`;
const CardsContainer = styled.div`
  margin: auto;
  padding: 0;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    background-color: hsl(0, 0%, 97%);
    padding: 0.5rem;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
  }
`;
const BookingsContainer = styled.div`
  border-radius: 10px;
  @media screen and (min-width: 768px) {
    min-height: 50vh;
    padding: 1rem;
  }
`;

const MessageContainer = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 1rem;
  border-radius: 5px;
  background-color: hsl(0, 0%, 97%);
  font-weight: 300;
  font-size: 0.9rem;
  margin: 1rem 0.25rem;
  @media screen and (min-width: 768px) {
    margin: 0 0 2rem 0;
  }
`;
const BookingSuccessContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-column-gap: 1rem;
  background-color: rgba(0, 128, 10, 0.1);
  padding: 1rem;
  border-radius: 5px;
  margin: 0.5rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 10fr;

    margin: 0;
  }
`;

const BookingSuccessText = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    margin: 0;
  }
`;
const CopyLink = styled.div`
  position: relative;
  display: inline-block;
  border-style: solid;
  border-color: rgb(0, 128, 10);
  border-width: 1px;
  width: max-content;
  padding: 0 0.25rem;
  margin-top: 0.5rem;
  border-radius: 5px;

  @media screen and (min-width: 768px) {
    font-size: 12px;
    margin-left: 0.5rem;
    margin-top: 0;

    &:hover {
      cursor: pointer;
      background-color: rgb(0, 128, 10);
      color: white;
    }
  }
`;
const LinkCopied = styled.div`
  position: absolute;
  left: 100%;
  margin-left: 0.25rem;
  top: 0;
`;
const TargetContainer = styled.div`
  padding: 1rem 0;
  min-height: 50vh;
`;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <TargetContainer>{children}</TargetContainer>}
    </div>
  );
}

const Booking = (props) => {
  const router = useRouter();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    const tabs = ["S", "T", "A"];
    ga.event({
      action: "Itinerary-bookings-tabs-" + tabs[newValue],
      params: { key: "" },
    });

    setValue(newValue);
  };

  let isPageWide = media("(min-width: 768px)");
  const [alternates, setAlternates] = useState(null);
  const [showpayment, setShowpayment] = useState(false);
  const [images, setImages] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFooterBannerMobile, setShowFooterBannerMobile] = useState(true);

  const [bookingsAccommodationsDesktopJSX, setBookingAccommodationsDesktopJSX] =
    useState([]);
  const [bookingsAccommodationsMobileJSX, setBookingAccommodationsMobileJSX] =
    useState([]);

  const [bookingsTransfersDesktopJSX, setBookingTransfersDesktopJSX] = useState(
    []
  );
  const [bookingsTransfersMobileJSX, setBookingTransfersMobileJSX] = useState(
    []
  );

  const [bookingsFlightsDesktopJSX, setBookingFlightsDesktopJSX] = useState([]);

  const [bookingsFlightsMobileJSX, setBookingFlightsMobileJSX] = useState([]);

  const [bookingsAcivityDesktopJSX, setBookingActivityDesktopJSX] = useState(
    []
  );
  const [bookingsActivityMobileJSX, setBookingActivityMobileJSX] = useState([]);

  const [summaryContainerJSX, setSummaryContainerJSX] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });

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
      action: "Itinerary-bookings-acc_change",
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
      number_of_rooms: number_of_rooms,
      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      images: images,
    });
    props.setShowBookingModal();
  };
  const _changeFlightHandler = (
    name,
    itinerary_id,
    tailored_id,
    id,
    check_in,
    check_out,
    pax,
    city,
    itinerary_name,
    cost,
    costings_breakdown,
    origin_iata,
    destination_iata
  ) => {
    ga.event({
      action: "Itinerary-bookings-flight_change",
      params: { name: name },
    });
    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      id: id,
      tailored_id: tailored_id,
      check_in: check_in,
      check_out: check_out,
      pax: pax,
      city: city,
      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      origin_iata: origin_iata,
      destination_iata: destination_iata,
    });
    props.setShowFlightModal();
  };
  const _changeTaxiHandler = (
    name,
    itinerary_id,
    tailored_id,
    id,
    check_in,
    check_out,
    pax,
    city,
    itinerary_name,
    cost,
    costings_breakdown,
    origin_iata,
    destination_iata,
    destination_city,
    taxi_type,
    transfer_type
  ) => {
    ga.event({
      action: "Itinerary-bookings-taxi_change",
      params: { name: name },
    });
    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      id: id,
      tailored_id: tailored_id,
      check_in: check_in,
      check_out: check_out,
      pax: pax,
      city: city,
      itinerary_name: itinerary_name,
      cost: Math.round(cost / 100),
      costings_breakdown: costings_breakdown,
      origin_iata: origin_iata,
      destination_iata: destination_iata,
      destination_city: destination_city,
      taxi_type: taxi_type,
      transfer_type: transfer_type,
    });
    props.setShowTaxiModal(true);
  };

  useEffect(() => {
    if (isPageWide) setShowpayment(true);
    // if(props.loadtopayment) setShowpayment(true);
  }, []);

  const _showPaymentHandler = () => {
    setShowFooterBannerMobile(false);
    setShowpayment(true);
  };
  const _hidePaymentHandler = () => {
    setShowFooterBannerMobile(true);
    setShowpayment(false);
  };

  let bookingcities = {};
  // let bookingsDesktop = [];
  // let bookingsFlickity  = [];

  let bookings_accommodations = [];
  let bookings_transfers = [];
  let bookings_activities = [];
  let bookings_flights = [];
  let alternatesarr = [];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    if (props.stayBookings)
      for (var i = 0; i < props.stayBookings.length; i++) {
        if (props.stayBookings[i].alternate_to) {
          if (!alternatesarr[props.stayBookings[i].alternate_to])
            alternatesarr[props.stayBookings[i].alternate_to] = [];
        }
        if (!bookingcities[props.stayBookings[i].city]) {
          bookingcities[props.stayBookings[i].city] = [];
          alternatesarr[props.stayBookings[i].city] = [];
        }

        let oldbooking = false;
        if (props.stayBookings[i].version === "v1") oldbooking = true;
        if (props.traveleritinerary) oldbooking = true;
        let name = props.stayBookings[i]["name"];
        let costings_breakdown = props.stayBookings[i]["costings_breakdown"];
        let cost = props.stayBookings[i]["booking_cost"];
        let itinerary_id = props.stayBookings[i]["itinerary_id"];
        let itinerary_name = props.stayBookings[i]["itinerary_name"];
        let booking_type = props.stayBookings[i]["booking_type"];
        let images = props.stayBookings[i]["images"];
        let accommodation = props.stayBookings[i]["accommodation"];
        let tailored_id = props.stayBookings[i]["tailored_itinerary"];
        let id = props.stayBookings[i]["id"];
        let check_in = props.stayBookings[i]["check_in"];
        let check_out = props.stayBookings[i]["check_out"];
        let pax = {
          number_of_adults: props.stayBookings[i]["number_of_adults"],
          number_of_children: props.stayBookings[i]["number_of_children"],
          number_of_infants: props.stayBookings[i]["number_of_infants"],
        };
        let city = props.stayBookings[i]["city"];
        let room_type = props.stayBookings[i]["room_type"];
        if (oldbooking) {
          bookings_accommodations.push(
            <OldBookingCard
              payment={props.payment}
              city={props.stayBookings[i].city}
              type={props.stayBookings[i].booking_type}
              key={i}
              setShowBookingModal={(props) =>
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
                  number_of_rooms,
                  itinerary_name
                )
              }
              showBookingModal={props.showBookingModal}
              setHideBookingModal={props.setHideBookingModal}
              blur={props.blur}
              setImagesHandler={props.setImagesHandler}
              accommodation
              heading={props.stayBookings[i]["name"]}
              setImagesHandler={_setImagesHandler}
              rating={props.stayBookings[i]["user_rating"]}
              details={props.stayBookings[i]["points"]}
              rating={props.stayBookings[i]["weighted_rating"]}
              images={props.stayBookings[i]["images"]}
              price={props.stayBookings[i]["booking_cost"]}
              number_of_rooms={props.stayBookings[i]["number_of_rooms"]}
              check_in={props.stayBookings[i]["check_in"]}
              check_out={props.stayBookings[i]["check_out"]}
              room_type={props.stayBookings[i]["room_type"]}
            ></OldBookingCard>
          );
        } else {
          if (props.stayBookings[i].booking_type === "Accommodation") {
            let number_of_rooms;
            if (props.stayBookings[i].costings_breakdown.length)
              number_of_rooms =
                props.stayBookings[i].costings_breakdown[0]["number_of_rooms"];
            if (
              !props.stayBookings[i].user_selected &&
              !props.stayBookings[i].alternate_to
            ) {
              bookings_accommodations.push(
                <StayBookingCard
                  is_registration_needed={
                    props.payment ? props.payment.is_registration_needed : false
                  }
                  isDatePresent={props.isDatePresent}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  is_selecting={
                    props.stayBookings[i].id === props.selectingBooking
                  }
                  _deselectBookingHandler={props._deselectStayBookingHandler}
                  is_stock={props.is_stock}
                  is_selected={true}
                  is_auth={props.is_auth}
                  are_prices_hidden={
                    props.payment ? props.payment.are_prices_hidden : false
                  }
                  setShowBookingModal={(props) =>
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
                      number_of_rooms,
                      itinerary_name,
                      cost,
                      costings_breakdown,
                      images
                    )
                  }
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  setImagesHandler={_setImagesHandler}
                  data={props.stayBookings[i]}
                ></StayBookingCard>
              );
              //set as selectable booking
            } else if (
              !props.stayBookings[i].user_selected &&
              props.stayBookings[i].alternate_to
            ) {
              //add in alternate list
              alternatesarr[props.stayBookings[i].alternate_to].push(
                props.stayBookings[i]
              );
            } else
              bookings_accommodations.push(
                <StayBookingCard
                  is_registration_needed={
                    props.payment ? props.payment.is_registration_needed : false
                  }
                  isDatePresent={props.isDatePresent}
                  setShowLoginModal={setShowLoginModal}
                  token={props.token}
                  is_selecting={
                    props.stayBookings[i].id === props.selectingBooking
                  }
                  _deselectBookingHandler={props._deselectStayBookingHandler}
                  is_stock={props.is_stock}
                  is_selected={true}
                  is_auth={props.is_auth}
                  are_prices_hidden={
                    props.payment ? props.payment.are_prices_hidden : false
                  }
                  setShowBookingModal={(props) =>
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
                      number_of_rooms,
                      itinerary_name,
                      cost,
                      costings_breakdown,
                      images
                    )
                  }
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  setImagesHandler={_setImagesHandler}
                  data={props.stayBookings[i]}
                ></StayBookingCard>
              );
          }
        }
      }
    setAlternates(alternatesarr);

    setBookingAccommodationsDesktopJSX(
      <DesktopCardContainer>{bookings_accommodations}</DesktopCardContainer>
    );
    setBookingAccommodationsMobileJSX(
      <SwiperCarousel
        slidesPerView={1}
        pageDots
        centeredSlides
        cards={bookings_accommodations}
      ></SwiperCarousel>
    );
  }, [
    props.stayBookings,
    props.selectingBooking,
    props.stayFlickityIndex,
    props.token,
    props.payment,
  ]);

  useEffect(() => {
    if (props.transferBookings)
      for (var i = 0; i < props.transferBookings.length; i++) {
        if (true) {
          let oldbooking = false;
          if (props.transferBookings[i].version === "v1") oldbooking = true;
          if (props.traveleritinerary) oldbooking = true;
          let name = props.transferBookings[i]["name"];
          let costings_breakdown =
            props.transferBookings[i]["costings_breakdown"];
          let cost = props.transferBookings[i]["booking_cost"];
          let itinerary_id = props.transferBookings[i]["itinerary_id"];
          let itinerary_name = props.transferBookings[i]["itinerary_name"];
          let booking_type = props.transferBookings[i]["booking_type"];

          // let accommodation = props.transferBookings[i]["accommodation"];
          let tailored_id = props.transferBookings[i]["tailored_itinerary"];
          let id = props.transferBookings[i]["id"];
          let check_in = props.transferBookings[i]["check_in"];
          let check_out = props.transferBookings[i]["check_out"];
          let pax = {
            number_of_adults: props.transferBookings[i]["number_of_adults"],
            number_of_children: props.transferBookings[i]["number_of_children"],
            number_of_infants: props.transferBookings[i]["number_of_infants"],
          };
          let city = props.transferBookings[i]["city"];
          let room_type = props.transferBookings[i]["room_type"];
          let taxi_type = props.transferBookings[i]["taxi_type"];
          let transfer_type = props.transferBookings[i]["transfer_type"];
          let city_id = props.transferBookings[i]["city_id"];
          let destination_city = props.transferBookings[i]["destination_city"];
          let duration = props.transferBookings[i]["duration"];
          let origin_iata = props.transferBookings[i]["origin_city_iata_code"];
          let destination_iata =
            props.transferBookings[i]["destination_city_iata_code"];
          if (oldbooking) {
            bookings_transfers.push(
              <OldBookingCard
                payment={props.payment}
                key={i}
                setShowBookingModal={(props) =>
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
                    number_of_rooms,
                    itinerary_name
                  )
                }
                showBookingModal={props.showBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                blur={props.blur}
                setImagesHandler={props.setImagesHandler}
                accommodation
                heading={props.transferBookings[i]["name"]}
                details={props.transferBookings[i]["points"]}
                rating={props.transferBookings[i]["user_rating"]}
                setImagesHandler={_setImagesHandler}
                images={props.transferBookings[i]["images"]}
              ></OldBookingCard>
            );
          } else {
            if (props.transferBookings[i].booking_type === "Taxi")
              bookings_transfers.push(
                <TaxiBookingCard
                  is_registration_needed={
                    props.payment ? props.payment.is_registration_needed : false
                  }
                  isDatePresent={props.isDatePresent}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  setShowTaxiModal={(props) =>
                    _changeTaxiHandler(
                      name,
                      itinerary_id,
                      tailored_id,
                      id,
                      check_in,
                      check_out,
                      pax,
                      city,
                      itinerary_name,
                      cost,
                      costings_breakdown,
                      origin_iata,
                      destination_iata,
                      destination_city,
                      taxi_type,
                      transfer_type
                    )
                  }
                  _deselectTransferBookingHandler={
                    props._deselectTransferBookingHandler
                  }
                  transferFlickityIndex={props.transferFlickityIndex}
                  is_selecting={
                    props.transferBookings[i].id === props.selectingBooking
                  }
                  data={props.transferBookings[i]}
                  cardUpdateLoading={props.cardUpdateLoading}
                  is_stock={props.is_stock}
                  _selectTaxiHandler={props._selectTaxiHandler}
                  is_auth={props.is_auth}
                  are_prices_hidden={
                    props.payment ? props.payment.are_prices_hidden : false
                  }
                  payment={props.payment}
                  key={i}
                  setImagesHandler={_setImagesHandler}
                  setHideTaxiModal={() => props.setShowTaxiModal(false)}
                ></TaxiBookingCard>
              );
            else if (props.transferBookings[i].booking_type === "Bus")
              bookings_transfers.push(
                <BusBookingCard
                  is_registration_needed={
                    props.payment ? props.payment.is_registration_needed : false
                  }
                  isDatePresent={props.isDatePresent}
                  setShowLoginModal={setShowLoginModal}
                  token={props.token}
                  _deselectTransferBookingHandler={
                    props._deselectTransferBookingHandler
                  }
                  transferFlickityIndex={props.transferFlickityIndex}
                  is_selecting={
                    props.transferBookings[i].id === props.selectingBooking
                  }
                  data={props.transferBookings[i]}
                  cardUpdateLoading={props.cardUpdateLoading}
                  is_stock={props.is_stock}
                  _selectTaxiHandler={props._selectTaxiHandler}
                  is_auth={props.is_auth}
                  are_prices_hidden={
                    props.payment ? props.payment.are_prices_hidden : false
                  }
                  payment={props.payment}
                  key={i}
                  setImagesHandler={_setImagesHandler}
                ></BusBookingCard>
              );
            else if (props.transferBookings[i].booking_type === "Ferry")
              bookings_transfers.push(
                <FerryBookingCard
                  is_registration_needed={
                    props.payment ? props.payment.is_registration_needed : false
                  }
                  isDatePresent={props.isDatePresent}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  setShowTaxiModal={(props) =>
                    _changeTaxiHandler(
                      name,
                      itinerary_id,
                      tailored_id,
                      id,
                      check_in,
                      check_out,
                      pax,
                      city,
                      itinerary_name,
                      cost,
                      costings_breakdown,
                      origin_iata,
                      destination_iata,
                      destination_city,
                      taxi_type,
                      transfer_type
                    )
                  }
                  _deselectTransferBookingHandler={
                    props._deselectTransferBookingHandler
                  }
                  transferFlickityIndex={props.transferFlickityIndex}
                  is_selecting={
                    props.transferBookings[i].id === props.selectingBooking
                  }
                  data={props.transferBookings[i]}
                  cardUpdateLoading={props.cardUpdateLoading}
                  is_stock={props.is_stock}
                  _selectTaxiHandler={props._selectTaxiHandler}
                  is_auth={props.is_auth}
                  are_prices_hidden={
                    props.payment ? props.payment.are_prices_hidden : false
                  }
                  payment={props.payment}
                  key={i}
                  setImagesHandler={_setImagesHandler}
                  setHideTaxiModal={() => props.setShowTaxiModal(false)}
                ></FerryBookingCard>
              );
            else if (props.transferBookings[i].booking_type === "Rental")
              bookings_transfers.push(
                <TaxiBookingCard
                  rental
                  isDatePresent={props.isDatePresent}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  setShowTaxiModal={(props) =>
                    _changeTaxiHandler(
                      name,
                      itinerary_id,
                      tailored_id,
                      id,
                      check_in,
                      check_out,
                      pax,
                      city,
                      itinerary_name,
                      cost,
                      costings_breakdown,
                      origin_iata,
                      destination_iata,
                      destination_city,
                      taxi_type,
                      transfer_type
                    )
                  }
                  _deselectTransferBookingHandler={
                    props._deselectTransferBookingHandler
                  }
                  transferFlickityIndex={props.transferFlickityIndex}
                  is_selecting={
                    props.transferBookings[i].id === props.selectingBooking
                  }
                  data={props.transferBookings[i]}
                  cardUpdateLoading={props.cardUpdateLoading}
                  is_stock={props.is_stock}
                  _selectTaxiHandler={props._selectTaxiHandler}
                  is_auth={props.is_auth}
                  are_prices_hidden={
                    props.payment ? props.payment.are_prices_hidden : false
                  }
                  is_registration_needed={
                    props.payment ? props.payment.is_registration_needed : false
                  }
                  payment={props.payment}
                  key={i}
                  setImagesHandler={_setImagesHandler}
                  setHideTaxiModal={() => props.setShowTaxiModal(false)}
                ></TaxiBookingCard>
              );
          }
        }

        // setAlternates(alternatesarr);
        setBookingTransfersDesktopJSX([...bookings_transfers]);
        setBookingTransfersMobileJSX(
          <SwiperCarousel
        slidesPerView={1}
        pageDots
        centeredSlides
            cards={[...bookings_transfers]}
          ></SwiperCarousel>
        );
      }
  }, [
    props.transferBookings,
    props.cardUpdateLoading,
    props.selectingBooking,
    props.token,
    props.payment,
  ]);

  useEffect(() => {
    if (props.flightBookings)
      for (var i = 0; i < props.flightBookings.length; i++) {
        let oldbooking = false;
        if (props.flightBookings[i].version === "v1") oldbooking = true;
        if (props.traveleritinerary) oldbooking = true;
        let name = props.flightBookings[i]["name"];
        let costings_breakdown = props.flightBookings[i]["costings_breakdown"];
        let cost = props.flightBookings[i]["booking_cost"];
        let itinerary_id = props.flightBookings[i]["itinerary_id"];
        let itinerary_name = props.flightBookings[i]["itinerary_name"];
        let booking_type = props.flightBookings[i]["booking_type"];

        // let accommodation = props.transferBookings[i]["accommodation"];
        let tailored_id = props.flightBookings[i]["tailored_itinerary"];
        let id = props.flightBookings[i]["id"];
        let check_in = props.flightBookings[i]["check_in"];
        let check_out = props.flightBookings[i]["check_out"];
        let pax = {
          number_of_adults: props.flightBookings[i]["number_of_adults"],
          number_of_children: props.flightBookings[i]["number_of_children"],
          number_of_infants: props.flightBookings[i]["number_of_infants"],
        };
        let city = props.flightBookings[i]["city"];
        let room_type = props.flightBookings[i]["room_type"];
        let origin_iata = props.flightBookings[i]["origin_code"];
        let destination_iata = props.flightBookings[i]["destination_code"];
        if (oldbooking) {
          bookings_flights.push(
            <OldBookingCard
              payment={props.payment}
              setShowLoginModal={setShowLoginModal}
              token={props.token}
              key={i}
              setShowBookingModal={(props) =>
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
                  number_of_rooms,
                  itinerary_name
                )
              }
              showBookingModal={props.showBookingModal}
              setHideBookingModal={props.setHideBookingModal}
              blur={props.blur}
              setImagesHandler={props.setImagesHandler}
              accommodation
              heading={props.flightBookings[i]["name"]}
              details={props.flightBookings[i]["points"]}
              rating={props.flightBookings[i]["user_rating"]}
              images={props.flightBookings[i]["images"]}
            ></OldBookingCard>
          );
        } else {
          bookings_flights.push(
            <FlightBookingCard
              is_registration_needed={
                props.payment ? props.payment.is_registration_needed : false
              }
              isDatePresent={props.isDatePresent}
              setShowLoginModal={setShowLoginModal}
              token={props.token}
              _deselectFlightBookingHandler={
                props._deselectFlightBookingHandler
              }
              flightFlickityIndex={props.flightFlickityIndex}
              is_selecting={
                props.flightBookings[i].id === props.selectingBooking
              }
              data={props.flightBookings[i]}
              bookings={props.flightBookings}
              setShowFlightModal={(props) =>
                _changeFlightHandler(
                  name,
                  itinerary_id,
                  tailored_id,
                  id,
                  check_in,
                  check_out,
                  pax,
                  city,
                  itinerary_name,
                  cost,
                  costings_breakdown,
                  origin_iata,
                  destination_iata
                )
              }
              showFlightModal={props.showFlightModal}
              is_auth={props.is_auth}
              are_prices_hidden={
                props.payment ? props.payment.are_prices_hidden : false
              }
              is_stock={props.is_stock}
              payment={props.payment}
              key={i}
              setShowBookingModal={(props) =>
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
                  number_of_rooms,
                  itinerary_name,
                  cost,
                  costings_breakdown
                )
              }
              showBookingModal={props.showBookingModal}
              setHideBookingModal={props.setHideBookingModal}
              setImagesHandler={_setImagesHandler}
            ></FlightBookingCard>
          );
        }
      }
    // setAlternates(alternatesarr);
    setBookingFlightsDesktopJSX([...bookings_flights]);
    setBookingFlightsMobileJSX(
       <SwiperCarousel
        slidesPerView={1}
        pageDots
        centeredSlides
        cards={[...bookings_flights]}
      ></SwiperCarousel>
    );
  }, [
    props.flightBookings,
    props.cardUpdateLoading,
    props.selectingBooking,
    props.token,
    props.payment,
  ]);

  useEffect(() => {
    if (props.activityBookings)
      for (var i = 0; i < props.activityBookings.length; i++) {
        if (props.activityBookings[i].alternate_to) {
          if (!alternatesarr[props.activityBookings[i].alternate_to])
            alternatesarr[props.activityBookings[i].alternate_to] = [];
        }
        if (!bookingcities[props.activityBookings[i].city]) {
          bookingcities[props.activityBookings[i].city] = [];
          alternatesarr[props.activityBookings[i].city] = [];
        }

        let oldbooking = false;
        if (props.activityBookings[i].version === "v1") oldbooking = true;
        if (props.traveleritinerary) oldbooking = true;
        let name = props.activityBookings[i]["name"];
        let costings_breakdown =
          props.activityBookings[i]["costings_breakdown"];
        let cost = props.activityBookings[i]["booking_cost"];
        let itinerary_id = props.activityBookings[i]["itinerary_id"];
        let itinerary_name = props.activityBookings[i]["itinerary_name"];
        let booking_type = props.activityBookings[i]["booking_type"];

        let accommodation = props.activityBookings[i]["accommodation"];
        let tailored_id = props.activityBookings[i]["tailored_itinerary"];
        let id = props.activityBookings[i]["id"];
        let check_in = props.activityBookings[i]["check_in"];
        let check_out = props.activityBookings[i]["check_out"];
        let pax = {
          number_of_adults: props.activityBookings[i]["number_of_adults"],
          number_of_children: props.activityBookings[i]["number_of_children"],
          number_of_infants: props.activityBookings[i]["number_of_infants"],
        };
        let city = props.activityBookings[i]["city"];
        let room_type = props.activityBookings[i]["room_type"];

        if (oldbooking) {
          bookings_activities.push(
            <OldBookingCard
              payment={props.payment}
              key={i}
              setShowBookingModal={(props) =>
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
                  number_of_rooms,
                  itinerary_name
                )
              }
              showBookingModal={props.showBookingModal}
              setHideBookingModal={props.setHideBookingModal}
              blur={props.blur}
              setImagesHandler={props.setImagesHandler}
              accommodation
              heading={props.activityBookings[i]["name"]}
              details={props.activityBookings[i]["points"]}
              rating={props.activityBookings[i]["user_rating"]}
              setImagesHandler={_setImagesHandler}
              images={props.activityBookings[i]["images"]}
            ></OldBookingCard>
          );
        } else {
          bookings_activities.push(
            <BookingCard
              is_registration_needed={
                props.payment ? props.payment.is_registration_needed : false
              }
              isDatePresent={props.isDatePresent}
              is_selecting={
                props.activityBookings[i].id === props.selectingBooking
              }
              setShowLoginModal={setShowLoginModal}
              token={props.token}
              _deselectActivityBookingHandler={
                props._deselectActivityBookingHandler
              }
              activityFlickityIndex={props.activityFlickityIndex}
              data={props.activityBookings[i]}
              check_in={check_in}
              is_stock={props.is_stock}
              tailored_id={tailored_id}
              booking_id={id}
              booking_name={name}
              booking_type={booking_type}
              itinerary_id={itinerary_id}
              itinerary_name={itinerary_name}
              _selectTaxiHandler={props._selectTaxiHandler}
              is_selected={props.activityBookings[i].user_selected}
              price={props.activityBookings[i]["booking_cost"]}
              is_auth={props.is_auth}
              are_prices_hidden={
                props.payment ? props.payment.are_prices_hidden : false
              }
              _stock={props.is_stock}
              payment={props.payment}
              key={i}
              blur={props.blur}
              setImagesHandler={_setImagesHandler}
              accommodation
              heading={props.activityBookings[i]["name"]}
              details={props.activityBookings[i]["points"]}
              rating={props.activityBookings[i]["user_rating"]}
              images={props.activityBookings[i]["images"]}
            ></BookingCard>
          );
        }
      }
    setAlternates(alternatesarr);

    setBookingActivityDesktopJSX(
      <DesktopCardContainer>{bookings_activities}</DesktopCardContainer>
    );
    setBookingActivityMobileJSX(
      <SwiperCarousel
        slidesPerView={1}
        pageDots
        centeredSlides
        cards={bookings_activities}
      ></SwiperCarousel>
    );
  }, [
    props.activityBookings,
    props.selectingBooking,
    props.token,
    props.payment,
  ]);

  useEffect(() => {
     if (props.payment) {
      if (!props.payment.is_registration_needed)
        setSummaryContainerJSX(
          <SummaryContainer
            setUserDetails={props.setUserDetails}
            id={props.id}
            stayBookings={props.stayBookings}
            flightBookings={props.flightBookings}
            activityBookings={props.activityBookings}
            transferBookings={props.transferBookings}
            setShowFooterBannerMobile={() => setShowFooterBannerMobile(true)}
            payment={props.payment}
            traveleritinerary={props.traveleritinerary}
            blur={props.blur}
            hide={_hidePaymentHandler}
            experienceId={props.experienceId}
            token={props.token}
            setShowLoginModal={setShowLoginModal}
          ></SummaryContainer>
        );
      //   // setSummaryContainerJSX(S)
      else
        setSummaryContainerJSX(
          <GITSummaryContainer
            hasUserPaid={
              props.payment ? (props.payment.paid_user ? true : false) : false
            }
            payment_status={props.payment_status}
            plan={props.plan}
            itinerary={props.itinerary}
            getPaymentHandler={props.getPaymentHandler}
            setUserDetails={props.setUserDetails}
            id={props.id}
            stayBookings={props.stayBookings}
            flightBookings={props.flightBookings}
            activityBookings={props.activityBookings}
            transferBookings={props.transferBookings}
            setShowFooterBannerMobile={() => setShowFooterBannerMobile(true)}
            payment={props.payment}
            traveleritinerary={props.traveleritinerary}
            blur={props.blur}
            hide={_hidePaymentHandler}
            experienceId={props.experienceId}
            token={props.token}
            setShowLoginModal={setShowLoginModal}
          ></GITSummaryContainer>
        );
    }
  }, [
    props.payment,
    props.traveleritinerary,
    props.stayBookings,
    props.transferBookings,
    props.hasUserPaid,
  ]);

  let message =
    "Hey TTW! I need some help with my tailored experience - https://www.thetarzanway.com" +
    router.asPath;
  const _setImagesHandler = (images) => {
    setImages(images);
  };
  const _handleLoginClose = () => {
    // props.getPaymentHandler();
    setShowLoginModal(false);
  };
  const REGISTRATION_PAYMENT_MESSAGES = {
    CREATED_ONE: "Your payment of amount INR ",
    CREATED_TWO:
      " was successful and your Payment Reference Id has been sent to you via email. An invitation email has already been sent to all the registered users but you can also copy this itinerary's link and share it yourself.",
    FAILURE:
      "Your payment was not completed successfully. Please contact us using WhatsApp or any other means with this reference id: ",
  };
  const TAILORED_PAYMENT_MESSAGES = {
    CREATED_ONE: "Your payment of amount INR ",
    CREATED_TWO:
      " was successful and your Payment Reference Id has been sent to you via email.",
    FAILURE:
      "Your payment was not completed successfully. Please contact us using WhatsApp or any other means with this reference id: ",
  };

  if (true) {
    if (!images) {
      if (isPageWide) {
        if (!showLoginModal)
          return (
            <div>
              {props.showTimer && !props.hideTimer ? (
                <Timer
                  hideTimer={props.hideTimer}
                  _handleTimerClose={props._handleTimerClose}
                  booking
                  openItinerary={props.openItinerary}
                  _hideTimerHandler={props._hideTimerHandler}
                ></Timer>
              ) : null}
              <Container>
                <BookingsContainer style={{ marginTop: "0" }}>
                  {props.payment && props.payment_status ? (
                    props.payment.paid_user ? (
                      <BookingSuccessContainer
                        style={{
                          backgroundColor: props.payment.paid_user
                            ? "rgba(0,128,10,0.1)"
                            : "rgba(255,0,0,0.1)",
                        }}
                      >
                        <div className="center-div">
                          <ImageLoader
                            url={
                              props.payment.paid_user
                                ? "media/icons/bookings/payment/success-green.svg"
                                : "media/icons/bookings/payment/fail-red.svg"
                            }
                            height="max-content"
                            margin="0"
                            widthmobile="100%
  margin-left: 0.5rem;"
                          ></ImageLoader>
                        </div>
                        <BookingSuccessText
                          style={{
                            color: props.payment.paid_user ? "green" : "red",
                          }}
                        >
                          <div
                            style={{ lineHeight: "2" }}
                            className="font-lexend"
                          >
                            {props.payment.paid_user
                              ? props.is_registration_needed
                                ? REGISTRATION_PAYMENT_MESSAGES.CREATED_ONE +
                                  getIndianPrice(
                                    Math.round(
                                      props.payment.per_person_total_cost / 100
                                    )
                                  ) +
                                  REGISTRATION_PAYMENT_MESSAGES.CREATED_TWO
                                : TAILORED_PAYMENT_MESSAGES.CREATED_ONE +
                                  getIndianPrice(
                                    Math.round(
                                      props.payment.per_person_total_cost / 100
                                    )
                                  ) +
                                  TAILORED_PAYMENT_MESSAGES.CREATED_TWO
                              : REGISTRATION_PAYMENT_MESSAGES.FAILURE}
                            {/* { props.payment_status==="success" ? <CopyLink onClick={() => navigator.clipboard.writeText(window.location.protocol + '//' + window.location.host + window.location.pathname)}> Copy Link
                   </CopyLink>: null} */}
                          </div>
                        </BookingSuccessText>
                      </BookingSuccessContainer>
                    ) : null
                  ) : null}

                  {!props.payment_status && props.payment ? (
                    props.payment.paid_user ? (
                      <BookingSuccessContainer
                        style={{ backgroundColor: "rgba(0,128,10,0.1)" }}
                      >
                        <div className="center-div">
                          <ImageLoader
                            url={
                              "media/icons/bookings/payment/success-green.svg"
                            }
                            height="max-content"
                            margin="0"
                            widthmobile="100%
  margin-left: 0.5rem;"
                          ></ImageLoader>
                        </div>
                        <BookingSuccessText style={{ color: "green" }}>
                          <div
                            style={{ lineHeight: "2" }}
                            className="font-lexend"
                          >
                            {props.is_registration_needed
                              ? REGISTRATION_PAYMENT_MESSAGES.CREATED_ONE +
                                getIndianPrice(
                                  Math.round(
                                    props.payment.per_person_total_cost / 100
                                  )
                                ) +
                                REGISTRATION_PAYMENT_MESSAGES.CREATED_TWO
                              : TAILORED_PAYMENT_MESSAGES.CREATED_ONE +
                                getIndianPrice(
                                  Math.round(
                                    props.payment.per_person_total_cost / 100
                                  )
                                ) +
                                TAILORED_PAYMENT_MESSAGES.CREATED_TWO}
                          </div>
                        </BookingSuccessText>
                      </BookingSuccessContainer>
                    ) : null
                  ) : null}

                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={!isPageWide ? "scrollable" : "fullWidth"}
                    scrollButtons={!isPageWide ? true : false}
                    allowScrollButtonsMobile
                    indicatorColor="#f7e700"
                    id="poimodal-tabs"
                  >
                    <Tab
                      label={
                        props.stayBookings
                          ? "Stays" + " (" + props.stayBookings.length + ")"
                          : "Stays"
                      }
                      className="bookingdetail-tab font-lexend"
                    ></Tab>
                    <Tab
                      label={
                        props.transferBookings
                          ? "Transfers" +
                            " (" +
                            props.transferBookings.length +
                            ")"
                          : "Transfers"
                      }
                      className="bookingdetail-tab font-lexend"
                      id="bookingdetail-tab-transfers"
                    ></Tab>
                    {props.flightBookings ? (
                      props.flightBookings.length ? (
                        <Tab
                          label={props.flightBookings ? "Flights" : "Flights"}
                          className="bookingdetail-tab font-lexend"
                          id="bookingdetail-tab-flights"
                        ></Tab>
                      ) : (
                        <Tab
                          label={"Flights"}
                          className="bookingdetail-tab font-lexend"
                          id="bookingdetail-tab-flights"
                          style={{ display: "none" }}
                        ></Tab>
                      )
                    ) : (
                      <Tab
                        label={"Flights"}
                        className="bookingdetail-tab font-lexend"
                        id="bookingdetail-tab-flights"
                        style={{ display: "none" }}
                      ></Tab>
                    )}

                    {props.activityBookings ? (
                      props.activityBookings.length ? (
                        <Tab
                          label={
                            props.activityBookings
                              ? "Activities" +
                                " (" +
                                props.activityBookings.length +
                                ")"
                              : "Activities"
                          }
                          className="bookingdetail-tab font-lexend"
                        ></Tab>
                      ) : (
                        <Tab
                          label={"Activities"}
                          className="bookingdetail-tab font-lexend"
                          style={{ display: "none" }}
                        ></Tab>
                      )
                    ) : (
                      <Tab
                        label={"Activities"}
                        className="bookingdetail-tab font-lexend"
                        style={{ display: "none" }}
                      ></Tab>
                    )}
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    {props.stayBookings ? (
                      props.stayBookings.length ? (
                        bookingsAccommodationsDesktopJSX
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        url="media/website/undraw_best_place_re_lne9.svg"
                        width="30%"
                        widthmobile="50%"
                      ></ImageLoader>
                    )}
                    {!props.stayBookings ? (
                      <div className="center-div">
                        <p
                          className="font-lexend text-center"
                          style={{ margin: "1rem 0" }}
                        >
                          Nothing to see here
                        </p>
                      </div>
                    ) : !props.stayBookings.length ? (
                      <div className="center-dov">
                        <p
                          className="font-lexend text-center"
                          style={{ margin: "1rem 0" }}
                        >
                          Nothing to see here
                        </p>
                      </div>
                    ) : null}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {props.flightBookings ? (
                      props.flightBookings.length ? (
                        <DesktopCardContainer>
                          {bookingsFlightsDesktopJSX}
                          {/* {bookingsTransfersDesktopJSX} */}
                        </DesktopCardContainer>
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        url="media/website/undraw_best_place_re_lne9.svg"
                        width="30%"
                        widthmobile="50%"
                      ></ImageLoader>
                    )}
                    {/* {!props.flightBookings ? <div className='center-div'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : !props.flightBookings.length ? <div className='center-dov'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : null } */}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {props.transferBookings ? (
                      props.transferBookings.length ? (
                        <DesktopCardContainer>
                          {/* {bookingsFlightsDesktopJSX} */}
                          {bookingsTransfersDesktopJSX}
                        </DesktopCardContainer>
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        url="media/website/undraw_best_place_re_lne9.svg"
                        width="30%"
                        widthmobile="50%"
                      ></ImageLoader>
                    )}
                    {/* {!props.transferBookings ? <div className='center-div'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : !props.transferBookings.length ? <div className='center-dov'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : null } */}
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    {true ? (
                      true ? (
                        bookingsAcivityDesktopJSX
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        url="media/website/undraw_best_place_re_lne9.svg"
                        width="30%"
                        widthmobile="50%"
                      ></ImageLoader>
                    )}
                    {/* {!props.activityBookings ? <div className='center-div'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : !props.activityBookings.length ? <div className='center-dov'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : null } */}
                  </TabPanel>
                </BookingsContainer>
                {summaryContainerJSX}
                {props.showBookingModal ? (
                  <BookingModal
                    _setImagesHandler={_setImagesHandler}
                    getPaymentHandler={props.getPaymentHandler}
                    _updateStayBookingHandler={props._updateStayBookingHandler}
                    alternates={alternates[selectedBooking.id]}
                    tailored_id={
                      props.stayBookings
                        ? props.stayBookings[0]["tailored_itinerary"]
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
                {props.traveleritinerary ? (
                  <DesktopBanner
                    onclick={() => openTailoredModal(router)}
                    text="Want to personalize your own experience like this?"
                  ></DesktopBanner>
                ) : null}
                {props.showFlightModal ? (
                  <FlightModal
                    getPaymentHandler={props.getPaymentHandler}
                    _updateFlightBookingHandler={
                      props._updateFlightBookingHandler
                    }
                    _updateBookingHandler={props._updateBookingHandler}
                    itinerary_id={
                      props.stayBookings.length
                        ? props.flightBookings[0]["itinerary_id"]
                        : null
                    }
                    setHideFlightModal={props.setHideFlightModal}
                    alternates={alternates[selectedBooking.id]}
                    tailored_id={props.flightBookings[0]["tailored_itinerary"]}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    _updateFlightHandler={props._updateFlightHandler}
                    selectedBooking={selectedBooking}
                    setShowFlightModal={props.setShowFlightModal}
                    showFlightModal={props.showFlightModal}
                  ></FlightModal>
                ) : null}
                {props.showTaxiModal ? (
                  <TaxiModal
                    getPaymentHandler={props.getPaymentHandler}
                    _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                    setHideTaxiModal={() => props.setShowTaxiModal(false)}
                    showTaxiModal={props.showTaxiModal}
                    _updatePaymentHandler={props._updatePaymentHandler}
                    selectedBooking={selectedBooking}
                  ></TaxiModal>
                ) : null}
              </Container>
              {/* <Accommodation token={props.token} show={true} id="a7c63401-3cc4-4542-9e3a-505f73e98614"></Accommodation> */}
            </div>
          );
        else
          return (
            <div>
              <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
            </div>
          );
      } else {
        if (!showLoginModal)
          return (
            <Container style={{ marginTop: "0" }}>
              {/* {props.showTimer && !props.hideTimer? <Timer hideTimer={props.hideTimer} _handleTimerClose={props._handleTimerClose} booking hours={props.hours} minutes={props.minutes} seconds={props.seconds}  startingTimer={props.startingTimer} itineraryDate={props.itineraryDate} openItinerary={props.openItinerary} booking  _hideTimerHandler={props._hideTimerHandler}></Timer> : <div></div>} */}
              {!showpayment ? (
                <BookingsContainer
                  style={{ marginTop: props.showTimer ? "-50vh" : "0" }}
                >
                  {props.payment_status && props.payment ? (
                    props.payment.is_registration_needed ? (
                      props.payment.paid_user ? (
                        <BookingSuccessContainer
                          style={{
                            backgroundColor: props.payment.paid_user
                              ? "rgba(0,128,10,0.1)"
                              : "rgba(255,0,0,0.1)",
                          }}
                        >
                          <div className="center-div">
                            <ImageLoader
                              url={
                                props.payment.paid_user
                                  ? "media/icons/bookings/payment/success-green.svg"
                                  : "media/icons/bookings/payment/fail-red.svg"
                              }
                              height="max-content"
                              margin="0"
                              widthmobile="100%
  margin-left: 0.5rem;"
                            ></ImageLoader>
                          </div>
                          <BookingSuccessText
                            style={{
                              color: props.payment.paid_user ? "green" : "red",
                            }}
                          >
                            <div
                              style={{ lineHeight: "2" }}
                              className="font-lexend"
                            >
                              {props.payment.paid_user
                                ? props.payment.is_registration_needed
                                  ? REGISTRATION_PAYMENT_MESSAGES.CREATED_ONE +
                                    getIndianPrice(
                                      Math.round(
                                        props.payment.per_person_total_cost /
                                          100
                                      )
                                    ) +
                                    REGISTRATION_PAYMENT_MESSAGES.CREATED_TWO
                                  : TAILORED_PAYMENT_MESSAGES.CREATED_ONE +
                                    getIndianPrice(
                                      Math.round(
                                        props.payment.per_person_total_cost /
                                          100
                                      )
                                    ) +
                                    TAILORED_PAYMENT_MESSAGES.CREATED_TWO
                                : REGISTRATION_PAYMENT_MESSAGES.FAILURE}{" "}
                            </div>
                            {/* { props.payment_status==="success" ? <CopyLink onClick={() => navigator.clipboard.writeText(window.location.protocol + '//' + window.location.host + window.location.pathname)}> Copy Link
                   </CopyLink>: null } */}
                          </BookingSuccessText>
                        </BookingSuccessContainer>
                      ) : null
                    ) : null
                  ) : null}

                  {!props.payment_status && props.payment ? (
                    props.payment.paid_user ? (
                      <BookingSuccessContainer
                        style={{ backgroundColor: "rgba(0,128,10,0.1)" }}
                      >
                        <div className="center-div">
                          <ImageLoader
                            url={
                              "media/icons/bookings/payment/success-green.svg"
                            }
                            height="max-content"
                            margin="0"
                            widthmobile="100%
  margin-left: 0.5rem;"
                          ></ImageLoader>
                        </div>
                        <BookingSuccessText style={{ color: "green" }}>
                          <div
                            style={{ lineHeight: "2" }}
                            className="font-lexend"
                          >
                            {props.payment.is_registration_needed
                              ? REGISTRATION_PAYMENT_MESSAGES.CREATED_ONE +
                                getIndianPrice(
                                  Math.round(
                                    props.payment.per_person_total_cost / 100
                                  )
                                ) +
                                REGISTRATION_PAYMENT_MESSAGES.CREATED_TWO
                              : TAILORED_PAYMENT_MESSAGES.CREATED_ONE +
                                getIndianPrice(
                                  Math.round(
                                    props.payment.per_person_total_cost / 100
                                  )
                                ) +
                                TAILORED_PAYMENT_MESSAGES.CREATED_TWO}
                          </div>
                        </BookingSuccessText>
                      </BookingSuccessContainer>
                    ) : null
                  ) : null}

                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={!isPageWide ? "scrollable" : "fullWidth"}
                    scrollButtons={false}
                    allowScrollButtonsMobile
                    indicatorColor="#f7e700"
                    id="poimodal-tabs"
                  >
                    <Tab
                      label={
                        props.stayBookings
                          ? "Stays" + " (" + props.stayBookings.length + ")"
                          : "Stays"
                      }
                      className="bookingdetail-tab font-lexend"
                    ></Tab>
                    <Tab
                      label={
                        props.transferBookings
                          ? "Transfers" +
                            " (" +
                            props.transferBookings.length +
                            ")"
                          : "Transfers"
                      }
                      className="bookingdetail-tab font-lexend"
                      id="bookingdetail-tab-transfers"
                    ></Tab>
                    {props.flightBookings ? (
                      props.flightBookings.length ? (
                        <Tab
                          label={props.flightBookings ? "Flights" : "Flights"}
                          className="bookingdetail-tab font-lexend"
                          id="bookingdetail-tab-flights"
                        ></Tab>
                      ) : (
                        <Tab
                          label={"Flights"}
                          style={{ display: "none" }}
                          className="bookingdetail-tab font-lexend"
                          id="bookingdetail-tab-flights"
                        ></Tab>
                      )
                    ) : (
                      <Tab
                        label={"Flights"}
                        style={{ display: "none" }}
                        className="bookingdetail-tab font-lexend"
                        id="bookingdetail-tab-flights"
                      ></Tab>
                    )}

                    {props.activityBookings ? (
                      props.activityBookings.length ? (
                        <Tab
                          label={
                            props.activityBookings
                              ? "Activities" +
                                " (" +
                                props.activityBookings.length +
                                ")"
                              : "Activities (0)"
                          }
                          className="bookingdetail-tab font-lexend"
                        ></Tab>
                      ) : (
                        <Tab
                          label={"Activities"}
                          className="bookingdetail-tab font-lexend"
                          style={{ display: "none" }}
                        ></Tab>
                      )
                    ) : (
                      <Tab
                        label={"Activities"}
                        className="bookingdetail-tab font-lexend"
                        style={{ display: "none" }}
                      ></Tab>
                    )}
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    {props.stayBookings ? (
                      props.stayBookings.length ? (
                        bookingsAccommodationsMobileJSX
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        height="auto"
                        width="50%"
                        widthmobile="50%"
                        url="media/website/undraw_best_place_re_lne9.svg"
                      ></ImageLoader>
                    )}
                    {!props.stayBookings ? (
                      <div className="center-div">
                        <p
                          className="font-lexend text-center"
                          style={{ margin: "1rem 0" }}
                        >
                          Nothing to see here
                        </p>
                      </div>
                    ) : !props.stayBookings.length ? (
                      <div className="center-dov">
                        <p
                          className="font-lexend text-center"
                          style={{ margin: "1rem 0" }}
                        >
                          Nothing to see here
                        </p>
                      </div>
                    ) : null}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {props.flightBookings ? (
                      props.flightBookings.length ? (
                        bookingsFlightsMobileJSX
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        height="auto"
                        width="50%"
                        widthmobile="50%"
                        url="media/website/undraw_best_place_re_lne9.svg"
                      ></ImageLoader>
                    )}
                    {/* {!props.flightBookings ? <div className='center-div'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : !props.flightBookings.length ? <div className='center-dov'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : null } */}

                    {/* {bookingsTransfersMobileJSX} */}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {/* {bookingsFlightsMobileJSX} */}
                    {props.transferBookings ? (
                      props.transferBookings.length ? (
                        bookingsTransfersMobileJSX
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        height="auto"
                        width="50%"
                        widthmobile="50%"
                        url="media/website/undraw_best_place_re_lne9.svg"
                      ></ImageLoader>
                    )}
                    {/* {!props.transferBookings ? <div className='center-div'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : !props.transferBookings.length ? <div className='center-dov'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : null } */}
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    {props.activityBookings ? (
                      props.activityBookings.length ? (
                        bookingsActivityMobileJSX
                      ) : (
                        <ImageLoader
                          url="media/website/undraw_best_place_re_lne9.svg"
                          width="50%"
                          widthmobile="50%"
                        ></ImageLoader>
                      )
                    ) : (
                      <ImageLoader
                        height="auto"
                        width="50%"
                        widthmobile="50%"
                        url="media/website/undraw_best_place_re_lne9.svg"
                      ></ImageLoader>
                    )}
                    {/* {!props.activityBookings ? <div className='center-div'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : !props.activityBookings.length ? <div className='center-dov'><p className="font-lexend text-center" style={{margin: '1rem 0'}}>Nothing to see here</p></div> : null } */}
                  </TabPanel>
                  {/* <MobileWidthContainer><Button width="100%" bgColor={props.traveleritinerary ? 'white' : "#F7e700"} borderRadius="5px" borderWidth={props.traveleritinerary ? '1px': "0px"} margin="0.5rem 0 0.5rem 0"  borderColor="#e4e4e4" onclick={_showPaymentHandler} ><p style={{margin: '0'}} className={props.blur ? "blurry-text" : ''}>{props.traveleritinerary ? 'View Details' : 'Buy Now'}</p></Button>
             <Button onclick={()=> window.location.href=urls.WHATSAPP+"?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"   margin="0 0 12.5vh 0" >
      <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
       Connect on WhatsApp</Button></MobileWidthContainer> */}
                </BookingsContainer>
              ) : (
                summaryContainerJSX
              )}
              {/* {showpayment &&props.payment.payment_info ?
             <SummaryContainer hide={_hidePaymentHandler} payment={props.payment} experienceId={props.experienceId}></SummaryContainer> : null} */}
              {props.showBookingModal ? (
                <BookingModal
                  budget={props.budget}
                  _setImagesHandler={_setImagesHandler}
                  getPaymentHandler={props.getPaymentHandler}
                  alternates={alternates[selectedBooking.id]}
                  tailored_id={props.stayBookings[0]["tailored_itinerary"]}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  _updateStayBookingHandler={props._updateStayBookingHandler}
                  _updateBookingHandler={props._updateBookingHandler}
                  selectedBooking={selectedBooking}
                  setShowBookingModal={props.setShowBookingModal}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                ></BookingModal>
              ) : null}
              {props.traveleritinerary ? (
                <div className="hidden-desktop">
                  <Banner
                    text="Want to craft your own travel experience like this?"
                    buttontext="Start Now"
                    color="black"
                    buttonbgcolor="#f7e700"
                  ></Banner>
                </div>
              ) : null}
              {props.showFlightModal ? (
                <FlightModal
                  _updateFlightBookingHandler={
                    props._updateFlightBookingHandler
                  }
                  getPaymentHandler={props.getPaymentHandler}
                  _updateBookingHandler={props._updateBookingHandler}
                  itinerary_id={props.flightBookings[0]["itinerary_id"]}
                  setHideFlightModal={props.setHideFlightModal}
                  alternates={alternates[selectedBooking.id]}
                  tailored_id={props.flightBookings[0]["tailored_itinerary"]}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  _updateFlightHandler={props._updateFlightHandler}
                  selectedBooking={selectedBooking}
                  setShowFlightModal={props.setShowFlightModal}
                  showFlightModal={props.showFlightModal}
                ></FlightModal>
              ) : null}
              {props.showTaxiModal ? (
                <TaxiModal
                  getPaymentHandler={props.getPaymentHandler}
                  _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                  setHideTaxiModal={() => props.setShowTaxiModal(false)}
                  showTaxiModal={props.showTaxiModal}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  selectedBooking={selectedBooking}
                ></TaxiModal>
              ) : null}

              {showFooterBannerMobile ? (
                <FooterBannerMobile
                  hasUserPaid={
                    props.payment
                      ? props.payment.paid_user
                        ? true
                        : false
                      : false
                  }
                  paymentLoading={props.paymentLoading}
                  payment={props.payment}
                  openWhatsapp={() =>
                    (window.location.href = urls.WHATSAPP + "?text=" + message)
                  }
                  openBooking={_showPaymentHandler}
                ></FooterBannerMobile>
              ) : null}
              {/* <Accommodation token={props.token} show={true} id="a7c63401-3cc4-4542-9e3a-505f73e98614"></Accommodation> */}
            </Container>
          );
        else
          return (
            <div>
              <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
            </div>
          );
      }
    } else
      return (
        <FullScreenGallery
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      );
  } else
    return (
      <div>
        <ComingSoon></ComingSoon>
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

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
