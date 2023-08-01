import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import media from "../../media";
// import LeftSideBar from './leftsidebar/Index';
import Accommodation from "./accommodation/Index";
import AccommodationSearched from "./new-accommodation-searched/Index";
// import AccommodationModal from '../accommodation/Index';
import axiosaccommodationinstance from "../../../services/bookings/FetchAccommodations";
import axiosagodaaccommodationionstance from "../../../services/bookings/FetchAccomodationsAgoda";
import Spinner from "../../Spinner";

//  import CurrentlyReplacing from './leftsidebar/CurrentlyReplacing';
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
// import updateaccommodations from '../../../services/bookings/UpdateBookings';
import { connect } from "react-redux";
// import Button from '../../Button';
import Button from "../../ui/button/Index";
import LogInModal from "../Login";
import AccommodationSelected from "./new-accommodation-selected/Index";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import LoadingLottie from "../../ui/LoadingLottie";
import Drawer from "../../ui/Drawer";
import HotelBookingContainer from "../../../containers/itinerary/HotelsBooking/HotelBookingContainer";
import { storeAndRetrieveValue } from "../../../helper/storeAndRetrieveValue";
import Slide from "../../../Animation/framerAnimation/Slide";
import { openNotification } from "../../../store/actions/notification";
import { BsXOctagon } from "react-icons/bs";
const GridContainer = styled.div`
@media screen and (min-width: 768px) {

    display: grid;
    grid-template-columns: 1fr;
    width: 100vw;
    @media screen and (min-width: 768px) {
      width: 50vw;
    }
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  width: 100%;
  position: relative;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
    width: 95%;
    margin: auto;
  }
`;
const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;

const Booking = (props) => {
  let isPageWide = media("(min-width: 768px)");

  const [optionsJSX, setOptionsJSX] = useState([]);
  const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: "",
  });
  const [isFetchingError, setFetchingIsError] = useState({
    error: false,
    errorMsg: "",
  });
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState();
  const [filtersState, setFiltersState] = useState({
    budget: "",
    type: "",
    star_category: "",
  });
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [traceId, setTraceID] = useState("");
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);

  const [moreLoadingState, setMoreLoadingState] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    _updateOptionsHandlerWithFilter();
  }, [filtersState]);
  const filters = {
    budget: [
      "Below ₹3,000",
      "₹3,000 - ₹6,000",
      "₹6,000 - ₹10,000",
      "Above ₹10,000",
    ],
    type: [
      "Hotel",
      "Homestay",
      "Camp",
      "Guest House",
      "Cottage",
      "Villa",
      "Resort",
      "Lodge",
      "Service Appartment",
      "Bed and Breakfast",
      "Farmstay",
      // "Speciality Lodging",
      // "Boat / Cruise",
      // "Holiday Park / Caravan Park",
      // "Country House",
      "Entire House",
      // "Capsule Hotel",
      "Unique",
    ],
    star_category: ["1 star", "2 star", "3 star", "4 star", "5 star", "All"],
  };

  useEffect(() => {
    let options = [];
    if (props.alternates)
      for (var i = 0; i < props.alternates.length; i++) {
        options.push(
          <AccommodationSearched
            payment={props.payment}
            plan={props.plan}
            currentBooking={props.currentBooking}
            _setImagesHandler={props._setImagesHandler}
            alternates={props.alternates}
            bookings={props.bookings}
            selectedBooking={props.selectedBooking}
            tailored_id={props.tailored_id}
            updateLoadingState={updateLoadingState}
            itinerary_id={props.payment.tailored_itinerary}
            accommodation={props.alternates[i]}
            _updateSearchedAccommodation={_newUpdateBookingHandler}
            _SelectedBookingHandler={_SelectedBookingHandler}
            key={i}
          ></AccommodationSearched>
        );
      }
    setOptionsJSX(options);
  }, [props.alternates, props.bookings]);

  useEffect(() => {
    if (!props.alternates) {
      let FILTERS_KEY;
      let BUDGET_TEXT;
      try {
        switch (props.budget) {
          case "Luxury":
            BUDGET_TEXT = FILTERS.budget[2];
          case "Luxury +":
            BUDGET_TEXT = FILTERS.budget[3];
          case "Affordable":
            BUDGET_TEXT = FILTERS.budget[0];
          case "Average":
            BUDGET_TEXT = FILTERS.budget[1];
          default:
            BUDGET_TEXT = FILTERS.budget[1];
        }
      } catch {
        BUDGET_TEXT = FILTERS.budget[1];
      }
      if (props.budget)
        FILTERS_KEY = {
          budget: [BUDGET_TEXT],
          type: [],
          star_category: [],
        };
      else
        FILTERS_KEY = {
          budget: [],
          type: [],
          star_category: [],
        };
      let filters = _generateFilterKeys(FILTERS_KEY);
      var agodaAccomodation = axiosaccommodationinstance;
      if (props.currentBooking && props.currentBooking.source) {
        if (props.currentBooking.source === "Agoda")
          agodaAccomodation = axiosagodaaccommodationionstance;
      }
      agodaAccomodation
        .post("/?limit=" + limit + "&offset=" + offset, {
          city: props.selectedBooking.city,
          check_in: props.selectedBooking.check_in,
          check_out: props.selectedBooking.check_out,
          city_id: props.selectedBooking.cityId,
          number_of_adults: props.selectedBooking.pax.number_of_adults,
          number_of_children: props.selectedBooking.pax.number_of_children,
          number_of_infants: props.selectedBooking.pax.number_of_infants,
          accommodation_types: filters.type,
          trace: storeAndRetrieveValue(props.selectedBooking.city),
          price_lower_range: filters.price_lower_range,
          price_upper_range: filters.price_upper_range,
        })
        .then((res) => {
          setUpdateLoadingState(false);
          if (res.data.results.length) {
            setNoResults(false);
            let is_min_price_present = false;
            if (res.data.results[0].min_price) {
              is_min_price_present = true;
            }
            storeAndRetrieveValue(
              props.selectedBooking.city,
              res.data.search.trace
            );
            setTraceID(res.data.search.trace);
            let options = [];
            setTotalCount(res?.data?.count);
            for (var i = 0; i < res.data.results.length; i++) {
              try {
                options.push(
                  <AccommodationSearched
                    payment={props.payment}
                    plan={props.plan}
                    _setImagesHandler={props._setImagesHandler}
                    _updateSearchedAccommodation={_updateSearchedAccommodation}
                    _SelectedBookingHandler={_SelectedBookingHandler}
                    currentBooking={props.currentBooking}
                    itinerary_id={props.payment.tailored_itinerary}
                    tailored_id={props.tailored_id}
                    _updateBookingHandler={_newUpdateBookingHandler}
                    accommodation={res.data.results[i]}
                    selectedBooking={props.selectedBooking}
                    key={i}
                    bookings={props.bookings}
                  ></AccommodationSearched>
                );
              } catch {
                options.push(
                  <AccommodationSearched
                    payment={props.payment}
                    plan={props.plan}
                    currentBooking={props.currentBooking}
                    _setImagesHandler={props._setImagesHandler}
                    _updateSearchedAccommodation={_updateSearchedAccommodation}
                    _SelectedBookingHandler={_SelectedBookingHandler}
                    itinerary_id={props.payment.tailored_itinerary}
                    tailored_id={props.tailored_id}
                    _updateBookingHandler={_newUpdateBookingHandler}
                    accommodation={res.data[i]}
                    selectedBooking={props.selectedBooking}
                    key={i}
                    bookings={props.bookings}
                  ></AccommodationSearched>
                );
              }
            }
            if (!options.length) setNoResults(true);
            setMoreOptionsJSX(options);
            if (res.data.next) {
              setViewMoreStatus(true);
              setOffset(offset + limit);
            } else {
              setViewMoreStatus(false);
              setOffset(0);
            }
          } else {
            setNoResults(true);
            setOffset(0);
            setViewMoreStatus(false);
            setMoreOptionsJSX([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx

            console.log(err.response.data); // The response body
            console.log(err.response.status); // The status code
            console.log(err.response.headers); // The response headers
            /* if (err.response.status == 400) {
              setIsError({
                error: true,
                errorMsg: err.response.data.message,
              });
            } */
            setFetchingIsError({
              error: true,
              errorMsg: `Sorry, we could not find any hotels in ${props?.selectedBooking?.city} for given dates at the moment. Please contact us to complete this booking`,
            });
          }
        });
    }
  }, [props.alternates, props.budget]);

  const _addFilterHandler = (filter, heading) => {
    let oldfilters = filtersState;
    let oldfiltersheadingarr = filtersState[heading];
    /* 
    let newfilters = {
      ...oldfilters,
      [heading]: filter,
    };
    setFiltersState(newfilters); */
    setFiltersState((prevState) => ({
      ...prevState,
      [heading]: filter,
    }));
  };
  const _updateStarFilterHandler = (star) => {
    /* let oldfilters = { ...filtersState };
    let newfilters = {
      ...oldfilters,
      star_category: star,
    };
    setFiltersState(newfilters); */
    setFiltersState((prevState) => ({
      ...prevState,
      star_category: star,
    }));
  };
  const _removeFilterHandler = (filter, heading) => {
    let oldfilters = filtersState;
    let oldfiltersheadingarr = filtersState[heading];
    const index = oldfiltersheadingarr.indexOf(filter);

    oldfiltersheadingarr.splice(index, 1);
    let newfilters = {
      ...oldfilters,
      [heading]: oldfiltersheadingarr,
    };

    setFiltersState(newfilters);
  };
  const _generateFilterKeys = (filtersState) => {
    let budgetarr = filtersState.budget;
    let typearr = filtersState.type;
    let sta_catgeoryarr = filtersState.star_category;

    let type = [];
    let price_lower_range = null;
    let price_upper_range = null;
    let price_set = false;
    if (!typearr.length) {
    } else {
      for (var i = 0; i < typearr.length; i++) {
        if (typearr[i] === "All") null;
        else {
          if (typearr[i] === "Unique") {
            type.push("Speciality Lodging");
            type.push("Boat / Cruise");
            type.push("Holiday Park / Caravan Park");
            type.push("Capsule Hotel");
          } else type.push(typearr[i]);
        }
      }
    }

    //BUDGET FILTERS
    if (!budgetarr.length) {
      //send default
      price_lower_range = 0;
      price_upper_range = 100000000;
    } else {
      if (budgetarr.includes("Below ₹3,000")) {
        price_lower_range = 1;
        price_upper_range = 300000;
        if (budgetarr.includes("Above ₹10,000")) {
          price_upper_range = null;
        } else if (budgetarr.includes("₹6,000 - ₹10,000")) {
          price_upper_range = 1000000;
        } else if (budgetarr.includes("₹3,000 - ₹6,000")) {
          price_upper_range = 600000;
        }
        price_set = true;
      }
      if (budgetarr.includes("Above ₹10,000")) {
        price_upper_range = 100000000;
        price_lower_range = 1000000;
        if (budgetarr.includes("Below ₹3,000")) {
          price_lower_range = 1;
        } else if (budgetarr.includes("₹3,000 - ₹6,000")) {
          price_lower_range = 300000;
        } else if (budgetarr.includes("₹6,000 - ₹10,000")) {
          price_lower_range = 600000;
        }
        price_set = true;
      }
      if (!price_set) {
        if (budgetarr.includes("₹3,000 - ₹6,000")) {
          price_lower_range = 300000;
          if (budgetarr.includes("₹6,000 - ₹10,000")) {
            price_upper_range = 1000000;
          } else price_upper_range = 600000;
        } else if (budgetarr.includes("₹6,000 - ₹10,000")) {
          price_lower_range = 600000;
          if (budgetarr.includes("Above ₹10,000")) {
            price_upper_range = 100000000;
          } else price_upper_range = 1000000;
        }
      }
    }
    return {
      type: type,
      price_lower_range: price_lower_range,
      price_upper_range: price_upper_range,
    };
  };
  const _updateOptionsHandlerWithFilter = () => {
    setOffset(0);
    setUpdateLoadingState(true);
    setNoResults(false);
    let budgetarr = filtersState.budget;

    let filters = _generateFilterKeys(filtersState);
    //BUDGET FILTERS

    setViewMoreStatus(false);
    setUpdateLoadingState(true);
    setMoreOptionsJSX([]);
    // axiosaccommodationinstance
    var agodaAccomodation = axiosaccommodationinstance;
    if (props.currentBooking && props.currentBooking.source) {
      if (props.currentBooking.source === "Agoda")
        agodaAccomodation = axiosagodaaccommodationionstance;
    }
    agodaAccomodation
      .post("/?limit=" + limit + "&offset=" + offset, {
        city: props.selectedBooking.city,
        check_in: props.selectedBooking.check_in,
        check_out: props.selectedBooking.check_out,

        trace: traceId,
        star_category: filtersState.star_category,
        accommodation_type: filtersState.type,
        city_id: props.selectedBooking.cityId,
        price_lower_range: filters.price_lower_range,
        price_upper_range: filters.price_upper_range,
        number_of_adults: props.selectedBooking.pax.number_of_adults,
        number_of_children: props.selectedBooking.pax.number_of_children,
        number_of_infants: props.selectedBooking.pax.number_of_infants,
      })
      .then((res) => {
        setUpdateLoadingState(false);
        if (res.data.results.length) {
          setNoResults(false);
          let options = [];
          setTotalCount(res?.data?.count);
          for (var i = 0; i < res.data.results.length; i++) {
            //  if(res.data.results[i].images.length > 1)
            if (res.data.results[i].name !== props.selectedBooking.name)
              options.push(
                <AccommodationSearched
                  payment={props.payment}
                  plan={props.plan}
                  currentBooking={props.currentBooking}
                  _setImagesHandler={props._setImagesHandler}
                  s
                  _updateSearchedAccommodation={_newUpdateBookingHandler}
                  _SelectedBookingHandler={_SelectedBookingHandler}
                  itinerary_id={props.payment.tailored_itinerary}
                  tailored_id={props.tailored_id}
                  _updateBookingHandler={_newUpdateBookingHandler}
                  accommodation={res.data.results[i]}
                  selectedBooking={props.selectedBooking}
                  key={i}
                  images={res.data.results.images}
                  bookings={props.bookings}
                ></AccommodationSearched>
              );
          }
          if (res.data.next) {
            setViewMoreStatus(true);
            setOffset(limit);
          } else {
            setViewMoreStatus(false);
            setOffset(0);
          }
          setMoreOptionsJSX(options);
        } else {
          setNoResults(true);
          setOffset(0);
          setViewMoreStatus(false);
          setMoreOptionsJSX([]);
        }
        setLoading(false);
        // setUpdateLoadingState(false);
      })
      .catch((err) => {
        setLoading(false);
        setFetchingIsError({
          error: true,
          errorMsg: `Sorry, we could not find any hotels in ${props?.selectedBooking?.city} for given dates at the moment. Please contact us to complete this booking`,
        });
      });
  };

  const _updateSearchedAccommodation = ({
    SelectedBookingId,
    Selected_id,
    itinerary_id,
    result_index,
    category_id,
    check_in,
    check_out,
    source,
  }) => {
    setUpdateBookingState(true);
    // const token = localStorage.getItem('access_token');
    /* let room = [];
    try {
      for (var i = 0; i < new_booking.rooms_available.length; i++) {
        if (new_booking.rooms_available[i].prices.min_price) {
          room.push(new_booking.rooms_available[i]);
          break;
        }
      }
    } catch {} */

    // let _in = check_in;
    // let _out = check_out;
    // if (check_in.includes("/")) {
    //   _in = check_in.split("/").reverse().join("-");
    //   _out = check_out.split("/").reverse().join("-");
    // }

    let updated_bookings_arr = [
      {
        id: SelectedBookingId,
        accommodation: Selected_id,
        result_index: result_index,
        category_id: category_id,

        booking_type: "Accommodation",

        itinerary_id: itinerary_id,
        check_in: check_in,
        check_out: check_out,
        source: source,
        trace: traceId
          ? traceId
          : storeAndRetrieveValue(props?.selectedBooking?.city),
      },
    ];
    {
      props.AddHotel
        ? axiosbookingupdateinstance
            .post(
              "add/?booking_type=Accommodation" +
                props.selectedBooking.itinerary_id,
              updated_bookings_arr[0],
              {
                headers: {
                  Authorization: `Bearer ${props.token}`,
                },
              }
            )
            .then((res) => {
              props._updateStayBookingHandler([res.data]);
              // props._updatePaymentHandler(res.data.payment_info);
              props.getPaymentHandler();
              props.openNotification({
                type: "success",
                text: "Hotel added successfully.",
                heading: "Sucess!",
              });
              setUpdateBookingState(false);
            })
            .catch((err) => {
              // setUpdateLoadingState(false);
              setUpdateBookingState(false);
              setUnauthorized(true);
              props.openNotification({
                type: "error",
                text: "Something went wrong! Please try after some time.",
                heading: "Error!",
              });
              // window.alert("There seems to be a problem, please try again!")
            })
        : axiosbookingupdateinstance
            .patch(
              "update/?booking_type=Accommodation&itinerary_id=" +
                props.selectedBooking.itinerary_id,
              updated_bookings_arr[0],
              {
                headers: {
                  Authorization: `Bearer ${props.token}`,
                },
              }
            )
            .then((res) => {
              props._updateStayBookingHandler([res.data]);
              // props._updatePaymentHandler(res.data.payment_info);
              props.getPaymentHandler();

              setUpdateBookingState(false);
              props.openNotification({
                type: "success",
                text: "Hotel changed successfully.",
                heading: "Sucess!",
              });
            })
            .catch((err) => {
              // setUpdateLoadingState(false);
              setUpdateBookingState(false);
              setUnauthorized(true);
              props.openNotification({
                type: "error",
                text: "Something went wrong! Please try after some time.",
                heading: "Error!",
              });
              // window.alert("There seems to be a problem, please try again!")
            });
    }
  };

  const _newUpdateBookingHandler = ({
    SelectedBookingId,
    Selected_id,
    itinerary_id,
    result_index,
    category_id,
    check_in,
    check_out,
    source,
  }) => {
    setUpdateBookingState(true);
    // const token = localStorage.getItem('access_token');
    /* let room = [];
    try {
      for (var i = 0; i < new_booking.rooms_available.length; i++) {
        if (new_booking.rooms_available[i].prices.min_price) {
          room.push(new_booking.rooms_available[i]);
          break;
        }
      }
    } catch {} */
    let updated_bookings_arr = [
      {
        id: SelectedBookingId,
        accommodation: Selected_id,
        result_index: result_index,
        category_id: category_id,

        booking_type: "Accommodation",

        itinerary_id: itinerary_id,
        check_in: check_in,
        check_out: check_out,
        source: source,
        trace: traceId
          ? traceId
          : storeAndRetrieveValue(props?.selectedBooking?.city),
      },
    ];
    /* for (var i = 0; i < alternates.length; i++) {
      if (new_booking.id === alternates[i].id)
        updated_bookings_arr.push({
          id: alternates[i].id,
          alternate_to: alternates[i].alternate_to,
          accommodation: alternates[i].accommodation,
          booking_type: 'Accommodation',
          itinerary_type: 'Tailored',
          user_selected: true,
          itinerary_id: itinerary_id,
          tailored_itinerary: tailored_id,
          itinerary_name: itinerary_name,
          itinerary_db_id: null,
          costings_breakdown: alternates[i].costings_breakdown,
        });
      else {
        updated_bookings_arr.push({
          id: alternates[i].id,
          alternate_to: alternates[i].alternate_to,

          accommodation: alternates[i].accommodation,
          booking_type: 'Accommodation',
          itinerary_type: 'Tailored',
          user_selected: false,
          itinerary_id: itinerary_id,
          tailored_itinerary: tailored_id,
          itinerary_name: itinerary_name,
          itinerary_db_id: null,
          costings_breakdown: alternates[i].costings_breakdown,
        });
      }
    } */

    // const token = localStorage.getItem('access_token');
    {
      props.AddHotel
        ? axiosbookingupdateinstance
            .post("add/?booking_type=Accommodation", updated_bookings_arr[0], {
              headers: {
                Authorization: `Bearer ${props.token}`,
              },
            })
            .then((res) => {
              props._updateStayBookingHandler([res.data]);
              setTimeout(function () {
                props.getPaymentHandler();
              }, 1000);
              // props._updatePaymentHandler(res.data.payment_info);
              setUpdateBookingState(false);
              props.openNotification({
                type: "success",
                text: "Hotel added successfully.",
                heading: "Sucess!",
              });
            })
            .catch((err) => {
              // setUpdateLoadingState(false);
              setUpdateBookingState(false);
              setUnauthorized(true);
              props.openNotification({
                type: "error",
                text: "Something went wrong! Please try after some time.",
                heading: "Error!",
              });
              // window.alert("There seems to be a problem, please try again!")
            })
        : axiosbookingupdateinstance
            .patch(
              "update/?booking_type=Accommodation",
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
              // props._updatePaymentHandler(res.data.payment_info);
              setUpdateBookingState(false);
              props.openNotification({
                type: "success",
                text: "Hotel changed successfully.",
                heading: "Sucess!",
              });
            })
            .catch((err) => {
              // setUpdateLoadingState(false);
              setUpdateBookingState(false);
              setUnauthorized(true);
              props.openNotification({
                type: "error",
                text: "Something went wrong! Please try after some time.",
                heading: "Error!",
              });
              // window.alert("There seems to be a problem, please try again!")
            });
    }
  };
  const _SelectedBookingHandler = ({
    SelectedBookingId,
    Selected_id,
    itinerary_id,
    result_index,
    category_id,
    check_in,
    check_out,
  }) => {
    setUpdateBookingState(true);
    // const token = localStorage.getItem('access_token');
    /* let room = [];
    try {
      for (var i = 0; i < new_booking.rooms_available.length; i++) {
        if (new_booking.rooms_available[i].prices.min_price) {
          room.push(new_booking.rooms_available[i]);
          break;
        }
      }
    } catch {} */
    let updated_bookings_arr = [
      {
        id: SelectedBookingId,
        accommodation: Selected_id,
        result_index: result_index,
        category_id: category_id,

        booking_type: "Accommodation",

        itinerary_id: itinerary_id,
        check_in: check_in,
        check_out: check_out,
        trace: traceId
          ? traceId
          : storeAndRetrieveValue(props?.selectedBooking?.city),
      },
    ];
    {
      props.AddHotel
        ? axiosbookingupdateinstance
            .post("add/?booking_type=Accommodation", updated_bookings_arr[0], {
              headers: {
                Authorization: `Bearer ${props.token}`,
              },
            })
            .then((res) => {
              props._updateStayBookingHandler([res.data]);
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
            })
        : axiosbookingupdateinstance
            .patch("update/?booking_type=Accommodation", updated_bookings_arr, {
              headers: {
                Authorization: `Bearer ${props.token}`,
              },
            })
            .then((res) => {
              props._updateStayBookingHandler([res.data]);
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
    }
    // const token = localStorage.getItem('access_token');
  };
  const _loadAccommodationsHandler = () => {
    setUpdateLoadingState(true);
    setViewMoreStatus(false);
    // setMoreLoadingState(true);
    let filters = _generateFilterKeys(filtersState);
    var agodaAccomodation = axiosaccommodationinstance;
    if (props.currentBooking && props.currentBooking.source) {
      if (props.currentBooking.source === "Agoda")
        agodaAccomodation = axiosagodaaccommodationionstance;
    }
    agodaAccomodation
      .post("/?limit=" + limit + "&offset=" + offset, {
        city: props.selectedBooking.city,
        check_in: props.selectedBooking.check_in,
        check_out: props.selectedBooking.check_out,
        city_id: props.selectedBooking.cityId,
        trace: traceId,
        number_of_adults: props.selectedBooking.pax.number_of_adults,
        number_of_children: props.selectedBooking.pax.number_of_children,
        number_of_infants: props.selectedBooking.pax.number_of_infants,
        accommodation_types: filters.type,
        price_lower_range: filters.price_lower_range,
        price_upper_range: filters.price_upper_range,
      })
      .then((res) => {
        // let oldoptions = optionsJSX;
        setTotalCount(res?.data?.count);
        if (res.data.results.length) {
          setNoResults(false);

          let options = moreOptionsJSX.slice();
          for (var i = 0; i < res.data.results.length; i++) {
            try {
              if (
                res.data.results[i].name !== props.selectedBooking.name &&
                res.data.results[i].rooms_available[0].prices.min_price
              )
                options.push(
                  <AccommodationSearched
                    payment={props.payment}
                    plan={props.plan}
                    currentBooking={props.currentBooking}
                    _setImagesHandler={props._setImagesHandler}
                    token={props.token}
                    _updateSearchedAccommodation={_updateSearchedAccommodation}
                    _SelectedBookingHandler={_SelectedBookingHandler}
                    itinerary_id={props.payment.tailored_itinerary}
                    tailored_id={props.tailored_id}
                    _updateBookingHandler={_newUpdateBookingHandler}
                    accommodation={res.data.results[i]}
                    selectedBooking={props.selectedBooking}
                    key={i}
                    images={res.data.results.images}
                    bookings={props.bookings}
                  ></AccommodationSearched>
                );
            } catch {
              options.push(
                <AccommodationSearched
                  payment={props.payment}
                  plan={props.plan}
                  currentBooking={props.currentBooking}
                  _setImagesHandler={props._setImagesHandler}
                  token={props.token}
                  _updateSearchedAccommodation={_updateSearchedAccommodation}
                  _SelectedBookingHandler={_SelectedBookingHandler}
                  itinerary_id={props.payment.tailored_itinerary}
                  tailored_id={props.tailored_id}
                  _updateBookingHandler={_newUpdateBookingHandler}
                  accommodation={res.data.results[i]}
                  selectedBooking={props.selectedBooking}
                  key={i}
                  images={res.data.results.images}
                  bookings={props.bookings}
                ></AccommodationSearched>
              );
            }
          }
          setMoreOptionsJSX([...options]);

          if (res.data.next) {
            setOffset(offset + limit);
            setViewMoreStatus(true);
          } else {
            setOffset(0);
            setViewMoreStatus(false);
          }
        } else {
          setNoResults(true);
          setOffset(0);
          setViewMoreStatus(false);
          setMoreOptionsJSX([]);
        }
        setUpdateLoadingState(false);
      })
      .catch((err) => {
        setUpdateLoadingState(false);
        setFetchingIsError({
          error: true,
          errorMsg: `Sorry, we could not find any hotels in ${props?.selectedBooking?.city} for given dates at the moment. Please contact us to complete this booking`,
        });
      });
  };
  const FILTERS = {
    budget: ["Affordable", "Average", "Luxury", "Luxury+"],
    type: [
      "Hotels",
      "Homestays",
      "Hostels",
      "Camps",
      "Guest House",
      "Cottage",
      "Villa",
      "Resort",
      "Bed and Breakfast",
      "Unique",
      "Entire House",
      "Capsule Hotel",
    ],
    star_category: ["3", "4", "5"],
  };
  let room = [];
  try {
    for (var i = 0; i < props.accommodation.rooms_available.length; i++) {
      if (props.accommodation.rooms_available[i].prices.min_price) {
        room.push(props.accommodation.rooms_available[i].room_type);
      }
    }
  } catch {}
  if (props.token)
    return (
      <div>
        <Drawer
          show={props.showBookingModal}
          anchor={"right"}
          backdrop
          style={{ zIndex: 1501 }}
          className="font-lexend "
          onHide={props.setHideBookingModal}
          // zIndex='1501'
        >
          <div className="absolute right-[10px] top-[20px] z-[9999]">
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
          <div className="sticky lg:w-[50vw] w-[100vw] py-2 top-0 bg-white z-[900]">
            <SectionOne
              booking_city={props?.selectedBooking?.city}
              setHideBookingModal={props.setHideBookingModal}
            ></SectionOne>
            {!loading && (
              <SectionTwo
                loading={loading}
                showFilter={props.showFilter}
                setshowFilter={props.setshowFilter}
                filtersState={filtersState}
                FILTERS={FILTERS}
                _updateStarFilterHandler={_updateStarFilterHandler}
                _removeFilterHandler={_removeFilterHandler}
                _addFilterHandler={_addFilterHandler}
                booking_city={props?.selectedBooking?.city}
                No_of_stays={optionsJSX.length + moreOptionsJSX.length}
                payment={props.payment}
                plan={props.plan}
                TotalCount={totalCount}
              ></SectionTwo>
            )}
          </div>

          <div className="lg:w-[100%] w-[95%] mx-auto">
            {unauthorized ? (
              <p
                style={{
                  borderRadius: "5px",
                  padding: "0.25rem",
                  backgroundColor: "rgba(255,0,0,0.1)",
                  color: "red",
                  margin: "1rem",
                }}
                className="text-center font-lexend"
              >
                You're not authorized to take this action, please contact your
                experience captain.
              </p>
            ) : null}

            <GridContainer style={{ clear: "right" }}>
              {/* <LeftSideBar selectedBooking={props.selectedBooking} filtersState={filtersState} _updateStarFilterHandler={_updateStarFilterHandler} _removeFilterHandler={_removeFilterHandler}_addFilterHandler={_addFilterHandler} filters={filters} replacing={props.selectedBooking.name} setHideBookingModal={props.setHideBookingModal}></LeftSideBar> */}
              {/* {!isPageWide ? <MobileFilters _updateStarFilterHandler={_updateStarFilterHandler}  _removeFilterHandler={_removeFilterHandler}_addFilterHandler={_addFilterHandler} filters={filters} ></MobileFilters> : null} */}
              <ContentContainer style={{ position: "relative" }}>
                {/* {updateLoadingState ? <div className='center-div' style={{width: 'max-content', margin: 'auto'}}><Spinner></Spinner>Fetching accommodations for you</div> : null } */}
                {updateBookingState ? (
                  <div
                    style={{
                      width: "max-content",
                      margin: "auto",
                      height: isPageWide ? "80vh" : "40vh",
                    }}
                    className="center-div text-center font-lexend"
                  >
                    <LoadingLottie
                      height={"5rem"}
                      width={"5rem"}
                      margin="none"
                    />
                    Please wait while we update your bookings
                  </div>
                ) : null}
                {isFetchingError.error ? (
                  <div className="flex flex-row items-center justify-center h-[80vh] text-center font-lexend">
                    {isFetchingError.errorMsg}
                  </div>
                ) : !noResults && !updateBookingState ? (
                  <OptionsContainer id="options">
                    <div style={{ clear: "right" }}>
                      {!props.AddHotel && (
                        <HotelBookingContainer
                          SelectedBookingin={true}
                          _setImagesHandler={props._setImagesHandler}
                          selectedBooking={props.selectedBooking}
                          booking={props.currentBooking}
                          payment={props.payment}
                          plan={props.plan}
                        ></HotelBookingContainer>
                      )}

                      {optionsJSX.length
                        ? optionsJSX
                        : moreOptionsJSX.length
                        ? moreOptionsJSX
                        : null}
                      {/* {moreOptionsJSX} */}
                      {loading && !optionsJSX.length ? (
                        <div
                          className="center-div"
                          style={{ height: isPageWide ? "80vh" : "40vh" }}
                        >
                          <LoadingLottie
                            height={"5rem"}
                            width={"5rem"}
                            margin="none"
                          />
                          Fetching stay recommendations for you
                        </div>
                      ) : null}
                      {/* {loading && !optionsJSX.length? <div className='center-div' style={{height: isPageWide ? '80vh' : '40vh'}}><Spinner/>Fetching stay recommendations for you</div> : null} */}
                    </div>

                    {/* {updateLoadingState ?  <div style={{width: 'max-content', margin: 'auto'}}><Spinner></Spinner></div> : null}  */}

                    {viewMoreStatus && !optionsJSX.length ? (
                      <Button
                        boxShadow
                        onclickparam={null}
                        onclick={_loadAccommodationsHandler}
                        margin="0.25rem auto"
                        borderWidth="1px"
                        borderRadius="2rem"
                        padding="0.25rem 1rem"
                      >
                        View More
                      </Button>
                    ) : null}
                    {/* {noResults ? 'NO RESULTS' : null} */}
                  </OptionsContainer>
                ) : null}

                {noResults ? (
                  <OptionsContainer className="font-lexend center-div text-center">
                    Oops, we couldn't find what you were searching but we are
                    already adding new and approved accommodations to our
                    database everyday!
                  </OptionsContainer>
                ) : null}
                {/* <Button onclickparam={null} onclick={_loadAccommodationsHandler} margin="0.25rem auto" borderWidth="1px" borderRadius="2rem" padding="0.25rem 1rem">More</Button> */}
                {/* {
                   !updateLoadingState ? <InfiniteOptionsContainer><InfiniteScroller next={_loadAccommodationsHandler} hasMore={true} dataLength={optionsJSX.length} jsx={optionsJSX}></InfiniteScroller>{optionsJSX}</InfiniteOptionsContainer> : null
                   } 
             */}
                {/* <ButtonToTop className='center-div'>
                   <FontAwesomeIcon icon={faChevronUp} style={{color: 'white', margin: '0'}}/>
                </ButtonToTop> */}
              </ContentContainer>
            </GridContainer>
          </div>
        </Drawer>

        {/* {showPhotos ? <FullScreenGallery images={[]} closeGalleryHandler={closePhotosHandler}></FullScreenGallery> : null} */}
      </div>
    );
  else
    return (
      <div>
        <LogInModal show={true} onhide={props.setHideBookingModal}></LogInModal>
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
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
