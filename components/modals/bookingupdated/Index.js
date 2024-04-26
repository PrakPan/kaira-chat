import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import AccommodationSearched from "./new-accommodation-searched/Index";
import AccommodationModal from "../accommodation/Index";
import axiosaccommodationinstance from "../../../services/bookings/FetchAccommodations";
import axiosagodaaccommodationionstance from "../../../services/bookings/FetchAccommodationsAgoda";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { connect } from "react-redux";
import Button from "../../ui/button/Index";
import LogInModal from "../Login";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import LoadingLottie from "../../ui/LoadingLottie";
import Drawer from "../../ui/Drawer";
import { storeAndRetrieveValue } from "../../../helper/storeAndRetrieveValue";
import Slide from "../../../Animation/framerAnimation/Slide";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import useDebounce from "../../../hooks/useDebounce";
import ImageLoader from "../../../components/ImageLoader";

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

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const Booking = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showDetails, setShowDetails] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState({
    budget: "",
    type: "",
    star_category: "",
    sort: "recommended",
  });
  const [offset, setOffset] = useState(0);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [traceId, setTraceID] = useState("");
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [sourceChange, setSourceChange] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [filtersObj, setFiltersObj] = useState({
    budget: ["Affordable", "Average", "Luxury", "Luxury+"],
    type: [],
    star_category: ["3", "4", "5"],
    sort: [
      "Recommended",
      "Popular",
      "Price: high to low",
      "Price: low to high",
    ],
  });
  const [selectSearch, setSelectedSearch] = useState("");
  const debouncedSearch = useDebounce(selectSearch);

  useEffect(() => {
    if (props?.showBookingModal) {
      _updateOptionsHandlerWithFilter();
    } else {
      setFiltersState({
        budget: "",
        type: "",
        star_category: "",
        sort: "recommended",
      });
    }
  }, [
    filtersState.budget,
    filtersState.type,
    filtersState.star_category,
    filtersState.sort,
    props?.showBookingModal,
    debouncedSearch,
  ]);

  useEffect(() => {
    let options = [];
    if (props.alternates)
      for (var i = 0; i < props.alternates.length; i++) {
        if (
          props.alternates[i].images &&
          props.alternates[i].images.length &&
          props.alternates[i].price
        ) {
          let img = false;
          for (let j = 0; j < props.alternates[i].images.length; j++) {
            if (props.alternates[i].images.image) {
              img = props.alternates[i].images.image;
              break;
            }
          }

          if (img)
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
                banner_image={img}
                key={i}
              ></AccommodationSearched>
            );
        }
      }
    setOptionsJSX(options);
  }, [props?.alternates, props?.bookings]);

  useEffect(() => {
    setSelectedSearch("");
  }, [props?.showBookingModal]);

  const handleClearSearch = () => {
    setSelectedSearch("");
  };

  const _addFilterHandler = (filter, heading) => {
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
  const _removeFilterHandler = (heading) => {
    let oldfilters = {
      budget: "",
      type: "",
      star_category: "",
      sort: "recommended",
    };
    setFiltersState((prev) => ({ ...prev, [heading]: oldfilters[heading] }));
  };
  const _generateFilterKeys = (filtersState) => {
    let budgetarr = filtersState.budget;
    let typearr = filtersState.type;
    let sta_catgeoryarr = filtersState.star_category;
    let sort = filtersState.sort;

    let type = [];
    let price_lower_range = null;
    let price_upper_range = null;
    let sort_by = "price";
    let price_set = false;
    if (sort === "popular") sort_by = "popularity";
    if (sort === "recommended") sort_by = "recommended";
    if (sort === "price: high to low" || sort === "price: low to high")
      sort_by = "price";

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
    if (budgetarr === "Affordable") {
      price_lower_range = 0;
      price_upper_range = 300000;
    } else if (budgetarr === "Average") {
      price_lower_range = 300000;
      price_upper_range = 600000;
    } else if (budgetarr === "Luxury") {
      price_lower_range = 600000;
      price_upper_range = 1000000;
    } else if (budgetarr === "Luxury+") {
      price_lower_range = 1000000;
      price_upper_range = null;
    } else {
      price_lower_range: null;
      price_upper_range: null;
    }
    return {
      type: type,
      price_lower_range: price_lower_range,
      price_upper_range: price_upper_range,
      sort_by: sort_by,
    };
  };

  const _updateOptionsHandlerWithFilter = (gear) => {
    setLoading(true);
    setOffset(0);
    setUpdateLoadingState(true);
    setNoResults(false);
    setFetchingIsError({
      error: false,
      errorMsg: "",
    });
    let budgetarr = filtersState.budget;

    let filters = _generateFilterKeys(filtersState);
    let sort_order = "asc";
    if (filtersState.sort === "price: high to low") sort_order = "desc";

    setViewMoreStatus(false);
    setUpdateLoadingState(true);
    setMoreOptionsJSX([]);
    let limit = 10;
    var agodaAccomodation = axiosaccommodationinstance;
    if (props?.currentBooking && props?.currentBooking.source) {
      if (props?.currentBooking.source === "Agoda") {
        if (gear === "second") {
          agodaAccomodation = axiosaccommodationinstance;
          limit = 10;
        } else {
          agodaAccomodation = axiosagodaaccommodationionstance;
          limit = 30;
        }
      } else {
        if (gear === "second") {
          agodaAccomodation = axiosagodaaccommodationionstance;
          limit = 30;
        } else {
          agodaAccomodation = axiosaccommodationinstance;
          limit = 10;
        }
      }
    } else {
      if (gear === "second") {
        agodaAccomodation = axiosagodaaccommodationionstance;
        limit = 30;
      } else {
        agodaAccomodation = axiosaccommodationinstance;
        limit = 10;
      }
    }

    agodaAccomodation
      .post("/?limit=" + limit + "&offset=0", {
        city: props?.selectedBooking?.city,
        check_in: props?.selectedBooking?.check_in,
        check_out: props?.selectedBooking?.check_out,

        trace: traceId,
        star_category: filtersState.star_category,
        accommodation_type: filtersState.type != "" ? [filtersState.type] : [],
        city_id: props?.selectedBooking?.cityId,
        price_lower_range: filters.price_lower_range,
        price_upper_range: filters.price_upper_range,
        number_of_adults: props?.selectedBooking?.pax?.number_of_adults,
        number_of_children: props?.selectedBooking?.pax?.number_of_children,
        number_of_infants: props?.selectedBooking?.pax?.number_of_infants,
        sort_by: filters.sort_by,
        sort_order: sort_order,
        live: true,
        q: debouncedSearch,
      })
      .then((res) => {
        setUpdateLoadingState(false);
        if (res.data.results.length) {
          if (
            res.data.search &&
            res.data.search.accommodation_types &&
            res.data.search.accommodation_types.length
          ) {
            let accommodation_types = Array.from(
              new Set(res.data.search.accommodation_types)
            );
            setFiltersObj({
              ...filtersObj,
              type: accommodation_types,
            });
          }
          if (res.data.count) setTotalCount(res.data.count);
          setNoResults(false);
          let options = [];
          for (var i = 0; i < res.data.results.length; i++) {
            if (res.data.results[i].name !== props?.selectedBooking.name)
              if (
                res.data.results[i].images &&
                res.data.results[i].images.length &&
                res.data.results[i].price
              ) {
                let img = false;
                for (let j = 0; j < res.data.results[i].images.length; j++) {
                  if (res.data.results[i].images[j].image) {
                    img = res.data.results[i].images[j].image;
                    break;
                  }
                }

                if (img)
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
                      banner_image={img}
                      bookings={props.bookings}
                    ></AccommodationSearched>
                  );
              }
          }
          if (res.data.next) {
            setViewMoreStatus(true);
            setOffset(limit);
          } else {
            setSourceChange(true);
            // setViewMoreStatus(true);
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
      })
      .catch((err) => {
        if (err?.response?.status === 400 && gear !== "second") {
          setSourceChange(true);
          _updateOptionsHandlerWithFilter("second");
          return;
        }
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
        trace: traceId ? traceId : storeAndRetrieveValue(),
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
                text: "You're not authorized to take this action, please contact your experience captain.",
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
                text: "You're not authorized to take this action, please contact your experience captain.",
                heading: "Error!",
              });
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
                text: "You're not authorized to take this action, please contact your experience captain.",
                heading: "Error!",
              });
              // window.alert("There seems to be a problem, please try again!")
            });
    }
  };

  const _loadAccommodationsHandler = () => {
    setUpdateLoadingState(true);
    setViewMoreStatus(false);
    setFetchingIsError({
      error: false,
      errorMsg: "",
    });

    let filters = _generateFilterKeys(filtersState);
    let limit = 10;
    var agodaAccomodation = axiosagodaaccommodationionstance;

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
        star_category: filtersState.star_category,
        accommodation_types: filters.type,
        price_lower_range: filters.price_lower_range,
        price_upper_range: filters.price_upper_range,
        sort_by: filters.sort_by,
        sort_order: "asc",
        live: true,
        q: selectSearch,
      })
      .then((res) => {
        if (res.data.results.length) {
          setNoResults(false);
          if (res.data.results.length) {
            if (
              res.data.search &&
              res.data.search.accommodation_types &&
              res.data.search.accommodation_types.length
            ) {
              let accommodation_types = Array.from(
                new Set(res.data.search.accommodation_types)
              );
              setFiltersObj({
                ...filtersObj,
                type: accommodation_types,
              });
            }
          }
          if (res.data.count) setTotalCount(res.data.count);
          let options = moreOptionsJSX.slice();
          for (var i = 0; i < res.data.results.length; i++) {
            try {
              if (
                res.data.results[i].name !== props.selectedBooking.name &&
                res.data.results[i].rooms_available[0].prices.min_price
              )
                if (
                  res.data.results[i].images &&
                  res.data.results[i].images.length &&
                  res.data.results[i].price
                ) {
                  let img = false;
                  for (let j = 0; j < res.data.results[i].images.length; j++) {
                    if (res.data.results[i].images[j].image) {
                      img = res.data.results[i].images[j].image;
                      break;
                    }
                  }

                  if (img)
                    options.push(
                      <AccommodationSearched
                        payment={props.payment}
                        plan={props.plan}
                        currentBooking={props.currentBooking}
                        _setImagesHandler={props._setImagesHandler}
                        token={props.token}
                        _updateSearchedAccommodation={
                          _updateSearchedAccommodation
                        }
                        _SelectedBookingHandler={_SelectedBookingHandler}
                        itinerary_id={props.payment.tailored_itinerary}
                        tailored_id={props.tailored_id}
                        _updateBookingHandler={_newUpdateBookingHandler}
                        accommodation={res.data.results[i]}
                        selectedBooking={props.selectedBooking}
                        key={i}
                        images={res.data.results.images}
                        bookings={props.bookings}
                        banner_image={img}
                      ></AccommodationSearched>
                    );
                }
            } catch {
              if (
                res.data.results[i].images &&
                res.data.results[i].images.length &&
                res.data.results[i].price
              ) {
                let img = false;
                for (let j = 0; j < res.data.results[i].images.length; j++) {
                  if (res.data.results[i].images[j].image) {
                    img = res.data.results[i].images[j].image;
                    break;
                  }
                }

                if (img)
                  options.push(
                    <AccommodationSearched
                      payment={props.payment}
                      plan={props.plan}
                      currentBooking={props.currentBooking}
                      _setImagesHandler={props._setImagesHandler}
                      token={props.token}
                      _updateSearchedAccommodation={
                        _updateSearchedAccommodation
                      }
                      _SelectedBookingHandler={_SelectedBookingHandler}
                      itinerary_id={props.payment.tailored_itinerary}
                      tailored_id={props.tailored_id}
                      _updateBookingHandler={_newUpdateBookingHandler}
                      accommodation={res.data.results[i]}
                      selectedBooking={props.selectedBooking}
                      key={i}
                      images={res.data.results.images}
                      banner_image={img}
                      bookings={props.bookings}
                    ></AccommodationSearched>
                  );
              }
            }
          }
          setMoreOptionsJSX([...options]);

          if (res.data.next) {
            setOffset(offset + limit);
            setViewMoreStatus(true);
          } else {
            if (sourceChange) {
              setOffset(0);
              setViewMoreStatus(false);
            } else {
              setSourceChange(true);
              setViewMoreStatus(true);
              setOffset(0);
            }
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
        if (!optionsJSX.length && !moreOptionsJSX)
          setFetchingIsError({
            error: true,
            errorMsg: `Sorry, e we could not find any hotels in ${props?.selectedBooking?.city} for given dates at the moment. Please contact us to complete this booking`,
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

  if (props?.token)
    return (
      <div>
        <Drawer
          show={props?.showBookingModal}
          anchor={"right"}
          backdrop
          // style={{ zIndex: 1501 }}
          className="font-lexend "
          onHide={props?.setHideBookingModal}
          // zIndex='1501'
        >
          {props?.showBookingModal ? (
            <>
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
                  setHideBookingModal={props?.setHideBookingModal}
                  selectSearch={selectSearch}
                  setSelectedSearch={setSelectedSearch}
                  _updateOptionsHandlerWithFilter={
                    _updateOptionsHandlerWithFilter
                  }
                ></SectionOne>
                <SectionTwo
                  loading={loading}
                  showFilter={props?.showFilter}
                  setshowFilter={props?.setshowFilter}
                  filtersState={filtersState}
                  FILTERS={filtersObj}
                  _updateStarFilterHandler={_updateStarFilterHandler}
                  _removeFilterHandler={_removeFilterHandler}
                  _addFilterHandler={_addFilterHandler}
                  booking_city={props?.selectedBooking?.city}
                  No_of_stays={optionsJSX.length + moreOptionsJSX.length}
                  payment={props?.payment}
                  plan={props?.plan}
                  TotalCount={totalCount}
                ></SectionTwo>
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
                    You're not authorized to take this action, please contact
                    your experience captain.
                  </p>
                ) : null}

                <GridContainer style={{ clear: "right" }}>
                  <ContentContainer style={{ position: "relative" }}>
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
                      <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                        <div className="flex flex-row items-center justify-center text-center font-lexend">
                          {isFetchingError.errorMsg} hello
                        </div>
                        <GetInTouchContainer>
                          <Button
                            color="#111"
                            fontWeight="500"
                            fontSize="1rem"
                            borderWidth="2px"
                            width="100%"
                            borderRadius="8px"
                            bgColor="#f8e000"
                            padding="12px"
                            onclick={props._GetInTouch}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <ImageLoader
                                dimensions={{ height: 50, width: 50 }}
                                dimensionsMobile={{ height: 50, width: 50 }}
                                height={"20px"}
                                width={"20px"}
                                leftalign
                                url={
                                  "media/icons/login/customer-service-black.png"
                                }
                              />{" "}
                              <span>Get in touch!</span>
                            </div>
                          </Button>
                        </GetInTouchContainer>
                      </div>
                    ) : !noResults && !updateBookingState ? (
                      <OptionsContainer id="options">
                        <div className="mb-3" style={{ clear: "right" }}>
                          {optionsJSX.length ? (
                            <>
                              {optionsJSX}
                              {updateLoadingState && <Skeleton />}
                            </>
                          ) : moreOptionsJSX.length ? (
                            <>
                              {moreOptionsJSX}
                              {updateLoadingState && <Skeleton />}
                            </>
                          ) : null}
                          {loading && !optionsJSX.length ? <Skeleton /> : null}
                          <div className="mt-3">
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
                            ) : selectSearch !== "" ? (
                              <Button
                                boxShadow
                                onclickparam={null}
                                onclick={handleClearSearch}
                                margin="0.25rem auto"
                                borderWidth="1px"
                                borderRadius="2rem"
                                padding="0.25rem 1rem"
                              >
                                Show All
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </OptionsContainer>
                    ) : null}

                    {noResults ? (
                      <OptionsContainer className="px-2 center-div space-y-5">
                        <div className="font-lexend center-div text-center">
                          Oops, we couldn't find what you were searching but we
                          are already adding new and approved accommodations to
                          our database everyday!
                        </div>
                        {debouncedSearch !== "" ? (
                          <Button
                            boxShadow
                            onclickparam={null}
                            onclick={handleClearSearch}
                            margin="0.25rem auto"
                            borderWidth="1px"
                            borderRadius="2rem"
                            padding="0.25rem 1rem"
                          >
                            Show All
                          </Button>
                        ) : (
                          <GetInTouchContainer>
                            <Button
                              color="#111"
                              fontWeight="500"
                              fontSize="1rem"
                              borderWidth="2px"
                              width="100%"
                              borderRadius="8px"
                              bgColor="#f8e000"
                              padding="12px"
                              onclick={props._GetInTouch}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "0.5rem",
                                  alignItems: "center",
                                }}
                              >
                                <ImageLoader
                                  dimensions={{ height: 50, width: 50 }}
                                  dimensionsMobile={{ height: 50, width: 50 }}
                                  height={"20px"}
                                  width={"20px"}
                                  leftalign
                                  url={
                                    "media/icons/login/customer-service-black.png"
                                  }
                                />{" "}
                                <span>Get in touch!</span>
                              </div>
                            </Button>
                          </GetInTouchContainer>
                        )}
                      </OptionsContainer>
                    ) : null}
                  </ContentContainer>
                </GridContainer>
              </div>
              <AccommodationModal
                check_in={props?.selectedBooking.check_in}
                check_out={props?.selectedBooking.check_out}
                _setImagesHandler={props?._setImagesHandler}
                onHide={() => setShowDetails(false)}
                id={props?.currentBooking?.agoda_accommodation}
                currentBooking={props?.currentBooking}
                show={showDetails}
              ></AccommodationModal>
            </>
          ) : (
            <></>
          )}
        </Drawer>
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
