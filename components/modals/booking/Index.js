import React, { useRef, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import media from "../../media";
import LeftSideBar from "./leftsidebar/Index";
import Accommodation from "./accommodation/Index";

import FullScreenGallery from "../../fullscreengallery/Index";
import axiosaccommodationinstance from "../../../services/bookings/FetchAccommodations";
import MobileFilters from "./filtersmobile/Index";
import Spinner from "../../Spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, animateScroll as scroll } from "react-scroll";
import CurrentlyReplacing from "./leftsidebar/CurrentlyReplacing";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { connect } from "react-redux";
import InfiniteScroller from "./InfniteScroller";
// import Button from '../../Button';
import Button from "../../ui/button/Index";
import { openNotification } from "../../../store/actions/notification";
const GridContainer = styled.div`
@media screen and (min-width: 768px) {

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 1rem;
    @media screen and (min-width: 768px) {

    }
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  width: 100%;
  position: relative;
  max-height: 65vh;

  @media screen and (min-width: 768px) {
    max-height: 80vh;
  }
`;
const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;
const InfiniteOptionsContainer = styled.div``;
const Cross = styled.img`
  width: 1rem;
  margin: 0.5rem;
  &:hover {
    cursor: pointer;
  }
`;
const ButtonToTop = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 1.25rem;
  background-color: rgba(0, 0, 0, 0.6);
  width: max-content;
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
`;
const StyledLink = styled(Link)`
  &:hover {
    cursor: pointer;
  }
`;

const Booking = (props) => {
  let isPageWide = media("(min-width: 768px)");

  let OptionsJSX = [];
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersState, setFiltersState] = useState({
    budget: [],
    type: [],
    star_category: [],
  });
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);

  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(true);

  const [moreLoadingState, setMoreLoadingState] = useState(false);

  const [noResults, setNoResults] = useState(false);

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
    axiosaccommodationinstance
      .post("/?limit=20&offset=0", {
        cities: props.selectedBooking.city,

        check_in: props.selectedBooking.check_in,
        check_out: props.selectedBooking.check_out,

        number_of_adults: props.selectedBooking.pax.number_of_adults,
        number_of_children: props.selectedBooking.pax.number_of_children,
        number_of_infants: props.selectedBooking.pax.number_of_infants,
      })
      .then((res) => {
        setUpdateLoadingState(false);
        if (res.data.results.length) {
          setNoResults(false);
          let options = [];
          for (var i = 0; i < res.data.results.length; i++) {
            // if(res.data.results[i].name !== props.selectedBooking.name)
            // options.push(<Accommodation selectedBooking={props.selectedBooking} tailored_id={props.tailored_id} updateLoadingState={updateLoadingState} booking_id={props.selectedBooking.id} itinerary_id={props.selectedBooking.itinerary_id}  accommodation_id={res.data.results[i].id} room_type={res.data.results[i].live_data.roomtypeName} pricing_type={res.data.results[i].live_data.includeBreakfast ? "CP" : "EP"}  _updateBookingHandler={_updateBookingHandler} type={res.data.results[i].accommodation_type} review_score={res.data.results[i].live_data.reviewScore}   review_count={res.data.results[i].live_data.reviewCount} key={i} name={res.data.results[i].name} description={res.data.results[i].description} location={res.data.results[i].location} star={res.data.results[i].star_category} cost={Math.ceil(res.data.results[i].live_data.dailyRate/100)} images={res.data.results[i].images}  room_type={res.data.results[i].live_data.roomtypeName}  includeBreakfast={res.data.results[i].live_data.includeBreakfast} ></Accommodation>)
            options.push(
              <Accommodation
                check_in={props.selectedBooking.check_in}
                check_out={props.selectedBooking.check_out}
                _setImagesHandler={props._setImagesHandler}
                selectedBooking={props.selectedBooking}
                cost={Math.ceil(res.data.results[i].price_lower_range)}
                images={res.data.results[i].images}
                accommodation={res.data.results[i]}
              ></Accommodation>
            );
          }
          setOptionsJSX(options);
          if (res.data.next) {
            setViewMoreStatus(true);
            setOffset(offset + 20);
          } else {
            setViewMoreStatus(tfalse);
            setOffset(0);
          }
        } else {
          setNoResults(true);
          setOffset(0);
          setViewMoreStatus(false);
          setOptionsJSX([]);
        }
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

  const _updateOptionsHandlerWithFilter = () => {
    setOffset(0);
    setUpdateLoadingState(true);
    setNoResults(false);
    let budgetarr = filtersState.budget;
    let typearr = filtersState.type;
    let sta_catgeoryarr = filtersState.star_category;

    let type = [];
    let price_lower_range = null;
    let price_upper_range = null;
    let price_set = false;
    //TYPE FILTERS
    if (!typearr.length) {
      //send empty type
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
      // for(var i = 0 ; i < budgetarr.length; i++){
      // }

      if (budgetarr.includes("Below ₹3,000")) {
        price_lower_range = 0;
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
          price_lower_range = 0;
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

    setViewMoreStatus(false);
    axiosaccommodationinstance
      .post("/?limit=" + limit + "&offset=0", {
        cities: [props.selectedBooking.city],
        // "check_in": "2022-02-01",
        // "check_out": "2022-02-04",
        check_in: props.selectedBooking.check_in,
        check_out: props.selectedBooking.check_out,
        accommodation_types: type,
        price_lower_range: price_lower_range,
        price_upper_range: price_upper_range,
        number_of_adults: props.selectedBooking.pax.number_of_adults,
        number_of_children: props.selectedBooking.pax.number_of_children,
        number_of_infants: props.selectedBooking.pax.number_of_infants,
      })
      .then((res) => {
        setUpdateLoadingState(false);
        if (res.data.results.length) {
          setNoResults(false);
          let options = [];
          for (var i = 0; i < res.data.results.length; i++) {
            if (res.data.results[i].images.length > 3)
              if (res.data.results[i].name !== props.selectedBooking.name)
                //rmeove
                options.push(
                  <Accommodation
                    _setImagesHandler={props._setImagesHandler}
                    selectedBooking={props.selectedBooking}
                    tailored_id={props.tailored_id}
                    updateLoadingState={updateLoadingState}
                    booking_id={props.selectedBooking.id}
                    itinerary_id={props.selectedBooking.itinerary_id}
                    accommodation_id={res.data.results[i].id}
                    room_type={res.data.results[i].live_data.roomtypeName}
                    pricing_type={
                      res.data.results[i].live_data.includeBreakfast
                        ? "CP"
                        : "EP"
                    }
                    _updateBookingHandler={_updateBookingHandler}
                    type={res.data.results[i].accommodation_type}
                    review_score={res.data.results[i].live_data.reviewScore}
                    review_count={res.data.results[i].live_data.reviewCount}
                    key={i}
                    name={res.data.results[i].name}
                    description={res.data.results[i].description}
                    location={res.data.results[i].location}
                    star={res.data.results[i].star_category}
                    cost={Math.ceil(
                      res.data.results[i].live_data.dailyRate / 100
                    )}
                    images={res.data.results[i].images}
                    includeBreakfast={
                      res.data.results[i].live_data.includeBreakfast
                    }
                  ></Accommodation>
                );
          }
          if (res.data.next) {
            setViewMoreStatus(true);
            setOffset(20);
          } else {
            setViewMoreStatus(false);
            setOffset(0);
          }
          setOptionsJSX(options);
        } else {
          setNoResults(true);
          setOffset(0);
          setViewMoreStatus(false);
          setOptionsJSX([]);
        }
        setLoading(false);
        // setUpdateLoadingState(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const _addFilterHandler = (filter, heading) => {
    let oldfilters = filtersState;
    let oldfiltersheadingarr = filtersState[heading];

    oldfiltersheadingarr.push(filter);
    let newfilters = {
      ...oldfilters,
      [heading]: oldfiltersheadingarr,
    };
    setFiltersState(newfilters);
    _updateOptionsHandlerWithFilter();
  };
  const _updateStarFilterHandler = (lower, upper) => {
    let oldfilters = filtersState;
    let newfilters = {
      ...oldfilters,
      star_category: [lower, upper],
    };

    setFiltersState(newfilters);
    _updateOptionsHandlerWithFilter();
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
    _updateOptionsHandlerWithFilter();
  };

  const _updateBookingHandler = ({
    booking_id,
    itinerary_id,
    tailored_id,
    accommodation_id,
    costing_breakdown,
    itinerary_name,
  }) => {
    // setUpdateLoadingState(true);
    setUpdateBookingState(true);
    axiosbookingupdateinstance
      .post(
        "/",
        [
          {
            id: booking_id,
            booking_type: "Accommodation",
            itinerary_type: "Tailored",
            city: props.selectedBooking.city,
            user_selected: true,
            accommodation: accommodation_id,
            itinerary_id: itinerary_id,
            tailored_itinerary: tailored_id,
            costings_breakdown: costing_breakdown,
            itinerary_name: itinerary_name,
            itinerary_db_id: null,
          },
        ],
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        /* props._updateBookingHandler(res.data.bookings);
        props._updatePaymentHandler(res.data.payment_info); */
        // setUpdateLoadingState(false);
        setUpdateBookingState(false);
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        setUpdateBookingState(false);

        // window.alert('There seems to be a problem, please try again!');
        props.openNotification({
          type: "error",
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
        });
      });
  };
  const _loadAccommodationsHandler = () => {
    // setUpdateLoadingState(true);
    setViewMoreStatus(false);
    setMoreLoadingState(true);

    axiosaccommodationinstance
      .post("/?limit=" + limit + "&offset=" + offset, {
        cities: [props.selectedBooking.city],
        // "check_in": "2022-02-01",
        // "check_out": "2022-02-04",
        check_in: props.selectedBooking.check_in,
        check_out: props.selectedBooking.check_out,
        accommodation_types: [],

        number_of_adults: props.selectedBooking.pax.number_of_adults,
        number_of_children: props.selectedBooking.pax.number_of_children,
        number_of_infants: props.selectedBooking.pax.number_of_infants,
      })
      .then((res) => {
        // setOffset(res.data.nextOffset);
        // setOffset(offset+40);

        // let oldoptions = optionsJSX;
        if (res.data.results.length) {
          setNoResults(false);

          let options = optionsJSX;
          for (var i = 0; i < res.data.results.length; i++) {
            if (res.data.results[i].images.length > 3)
              if (res.data.results[i].name !== props.selectedBooking.name)
                //rmeove
                options.push(
                  <Accommodation
                    _setImagesHandler={props._setImagesHandler}
                    selectedBooking={props.selectedBooking}
                    tailored_id={props.tailored_id}
                    updateLoadingState={updateLoadingState}
                    booking_id={props.selectedBooking.id}
                    itinerary_id={props.selectedBooking.itinerary_id}
                    accommodation_id={res.data.results[i].id}
                    room_type={res.data.results[i].live_data.roomtypeName}
                    pricing_type={
                      res.data.results[i].live_data.includeBreakfast
                        ? "CP"
                        : "EP"
                    }
                    _updateBookingHandler={_updateBookingHandler}
                    type={res.data.results[i].accommodation_type}
                    review_score={res.data.results[i].live_data.reviewScore}
                    review_count={res.data.results[i].live_data.reviewCount}
                    key={i}
                    name={res.data.results[i].name}
                    description={res.data.results[i].description}
                    location={res.data.results[i].location}
                    star={res.data.results[i].star_category}
                    cost={Math.ceil(
                      res.data.results[i].live_data.dailyRate / 100
                    )}
                    images={res.data.results[i].images}
                    includeBreakfast={
                      res.data.results[i].live_data.includeBreakfast
                    }
                  ></Accommodation>
                );
          }
          setOptionsJSX(options);
          // setUpdateLoadingState(false);
          if (res.data.next) {
            setOffset(offset + 20);
            setViewMoreStatus(true);
          } else {
            setOffset(0);
            setViewMoreStatus(false);
          }
        } else {
          setNoResults(true);
          setOffset(0);
          setViewMoreStatus(false);
          setOptionsJSX([]);
        }
        setMoreLoadingState(false);
      })
      .catch((err) => {
        setMoreLoadingState(false);
      });
  };

  return (
    <div>
      <Modal
        id="bookingedit-modal"
        show={props.showBookingModal}
        size="xl"
        onHide={props.setHideBookingModal}
        style={{ padding: "0" }}
      >
        {/* <Modal.Header>2</Modal.Header> */}
        <Modal.Body
          style={{
            padding: "0.5rem",
            borderStyle: "solid",
            borderColor: "#F7e700",
            borderWidth: "0.5rem",
            borderRadius: "16px",
            backgroundColor: "white",
          }}
        >
          <FontAwesomeIcon
            className="hover-pointer"
            icon={faChevronLeft}
            onClick={props.setHideBookingModal}
            style={{ margin: "0.5rem", position: "sticky", top: "0" }}
          ></FontAwesomeIcon>
          <GridContainer style={{ clear: "right" }}>
            <LeftSideBar
              selectedBooking={props.selectedBooking}
              filtersState={filtersState}
              _updateStarFilterHandler={_updateStarFilterHandler}
              _removeFilterHandler={_removeFilterHandler}
              _addFilterHandler={_addFilterHandler}
              filters={filters}
              replacing={props.selectedBooking.name}
              setHideBookingModal={props.setHideBookingModal}
            ></LeftSideBar>
            {!isPageWide ? (
              <MobileFilters
                _updateStarFilterHandler={_updateStarFilterHandler}
                _removeFilterHandler={_removeFilterHandler}
                _addFilterHandler={_addFilterHandler}
                filters={filters}
              ></MobileFilters>
            ) : null}
            <ContentContainer style={{ position: "relative" }}>
              {updateLoadingState ? (
                <div
                  className="center-div"
                  style={{ width: "max-content", margin: "auto" }}
                >
                  <Spinner></Spinner>Fetching accommodations for you
                </div>
              ) : null}
              {updateBookingState ? (
                <div style={{ width: "max-content", margin: "auto" }}>
                  <Spinner></Spinner>
                </div>
              ) : null}
              {!noResults && !updateLoadingState ? (
                <OptionsContainer id="options">
                  <div style={{ clear: "right" }}>
                    {optionsJSX.length ? optionsJSX : null}
                    {/* {loading ? <div style={{width: 'max-content', margin: 'auto'}}><Spinner/></div> : null} */}
                  </div>
                  {moreLoadingState ? (
                    <div style={{ width: "max-content", margin: "auto" }}>
                      <Spinner></Spinner>
                    </div>
                  ) : null}
                  {viewMoreStatus ? (
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
                <p className="font-lexend text-center">
                  Oops, we couldn't find what you were searching but we are
                  already adding new and approved accommodation to our database
                  everyday!
                </p>
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
          {!isPageWide ? (
            <CurrentlyReplacing
              selectedBooking={props.selectedBooking}
              replacing={props.selectedBooking.name}
            ></CurrentlyReplacing>
          ) : null}
        </Modal.Body>
      </Modal>
      {/* {showPhotos ? <FullScreenGallery images={[]} closeGalleryHandler={closePhotosHandler}></FullScreenGallery> : null} */}
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
