import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import AccommodationSearched from "./new-accommodation-searched/Index";
import AccommodationModal from "../accommodation/Index";
import { hotelSearch } from "../../../services/bookings/FetchAccommodations";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../ui/button/Index";
import LogInModal from "../Login";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import LoadingLottie from "../../ui/LoadingLottie";
import Drawer from "../../ui/Drawer";
import Slide from "../../../Animation/framerAnimation/Slide";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import useDebounce from "../../../hooks/useDebounce";
import ImageLoader from "../../../components/ImageLoader";
import { getDate } from "../../../helper/DateUtils";
import Filters from "./filtersmobile/Filters";
import { setItineraryFilters } from "../../../store/actions/setItineraryFilters";

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
  // const [filtersState, setItineraryFilters] = useState({
  //   free_breakfast: true,
  //   is_refundable: false,
  //   budget: {
  //     price_lower_range: 3000,
  //     price_upper_range: 8000,
  //   },
  //   star_category: null,
  //   sort: "price: low to high",
  //   type: null,
  //   user_ratings: null,
  //   facilities: null,
  //   tags: null,
  //   occupancies: [
  //     {
  //       num_adults: props?.plan?.number_of_adults || 1,
  //       child_ages: []
  //     }
  //   ]
  // });
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [traceId, setTraceID] = useState("");
  const [provider, setProvider] = useState(null);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [filtersObj, setFiltersObj] = useState({
    type: [],
    star_category: [1, 2, 3, 4, 5],
    user_ratings: [1, 2, 3, 4, 5],
    sort: [
      "Price: low to high",
      "Price: high to low",
    ],
    facilities: [],
    tags: [],
  });
  const [selectSearch, setSelectedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(selectSearch);
  const dispatch=useDispatch();
  const filtersState=useSelector((state)=>state.ItineraryFilters)

  useEffect(() => {
    if (props?.showBookingModal) {
      fetchHotels();
    }
  }, [
    filtersState,
    props?.showBookingModal,
    debouncedSearch,
  ]);

  useEffect(() => {
    if (!props?.showBookingModal) {
      // setItineraryFilters({
      //   free_breakfast: true,
      //   is_refundable: false,
      //   budget: {
      //     price_lower_range: 3000,
      //     price_upper_range: 8000,
      //   },
      //   type: null,
      //   star_category: null,
      //   user_ratings: null,
      //   sort: "price: low to high",
      //   facilities: null,
      //   tags: null,
      //   occupancies: [
      //     {
      //       num_adults: props?.plan?.number_of_adults || 1,
      //       child_ages: []
      //     }
      //   ]
      // });
      setNextPage(1);
      // setProvider(null);
      setSelectedSearch("");
    }
  }, [props?.showBookingModal]);

  const handleClearSearch = () => {
    setSelectedSearch("");
  };

  const _addFilterHandler = (filter, heading) => {
    dispatch(setItineraryFilters({ [heading]: filter }));
  };

  const _updateStarFilterHandler = (star) => {
    dispatch(setItineraryFilters({ star_category: star }));
  };

  const updateUserStarHandler = (star) => {
    dispatch(setItineraryFilters({ user_ratings: star }));
  }

  const _removeFilterHandler = (heading) => {
    let oldfilters = {
      budget: "",
      type: "",
      star_category: "",
      sort: "recommended",
    };
    dispatch(setItineraryFilters({ [heading]: oldfilters[heading] }));
  };

  const setDynamicFilters = (filters) => {
    setFiltersObj({
      ...filtersObj,
      type: filters?.accommodation_types ? filters.accommodation_types : [],
      facilities: filters?.facilities ? filters.facilities : [],
      tags: filters?.tags ? filters.tags : []
    });
  }

  const fetchHotels = () => {
    setLoading(true);
    setUpdateLoadingState(true);
    setNoResults(false);
    setFetchingIsError({
      error: false,
      errorMsg: "",
    });
    console.log('bookingupdated provider is:',provider)

    const requestData = {
      check_in: getDate(props?.selectedBooking?.check_in),
      check_out: getDate(props?.selectedBooking?.check_out),
      city_id: props?.selectedBooking?.cityId,
      occupancies: filtersState.occupancies,
      filter_by: {
        price_lower_range: filtersState.budget.price_lower_range,
        price_upper_range: filtersState.budget.price_upper_range,
        hotel_name: debouncedSearch ? debouncedSearch : null,
        sub_location_ids: null,
        free_breakfast: filtersState.free_breakfast,
        is_refundable: filtersState.is_refundable,
        facilities: filtersState.facilities,
        tags: filtersState.tags,
        type: filtersState.type && filtersState.type[0] !== "All" ? filtersState.type : null,
        star_category: filtersState.star_category,
        user_ratings: filtersState.user_ratings,
        page: nextPage
      },
      occupancies:filtersState.occupancies,
      sort_by: {
        price_order: filtersState.sort === "price: high to low" ? "desc" : "asc"
      },
      source: provider
    }

    hotelSearch.post("", requestData).then(res => {
      setUpdateLoadingState(false);

      setProvider(res.data?.source);
      console.log("booking updated source from response is:",res?.data?.source)
      
      if (res.data?.trace_details?.id) {
        localStorage.setItem("trace_id", res?.data?.trace_details?.id );
      }

      if (res.data?.data?.length) {
        if (res.data?.total_count) setTotalCount(res.data.total_count);

        setNoResults(false);

        let options = [];
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].name !== props?.selectedBooking.name)
            if (
              res.data.data[i]?.images &&
              res.data.data[i]?.images?.length &&
              res.data.data[i]?.price
            ) {
              let img = false;
              for (let j = 0; j < res.data.data[i].images.length; j++) {
                if (res.data.data[i].images[j]?.image) {
                  img = res.data.data[i].images[j].image;
                  break;
                }
              }

              if (img)
                options.push(
                  <AccommodationSearched
                    handleClick={props?.handleClick}
                    payment={props.payment}
                    plan={props.plan}
                    currentBooking={props.currentBooking}
                    _setImagesHandler={props._setImagesHandler}
                    itinerary_id={props.itinerary_id}
                    tailored_id={props.tailored_id}
                    accommodation={res.data.data[i]}
                    selectedBooking={props.selectedBooking}
                    key={i}
                    images={res.data.data[i].images}
                    banner_image={img}
                    bookings={props.bookings}
                    traceId={res.data?.trace_details?.id ? res.data.trace_details.id : ""}
                    provider={res.data?.data?.[0]?.source}
                    setUpdateBookingState={setUpdateBookingState}
                    setUnauthorized={setUnauthorized}
                    _updateStayBookingHandler={props._updateStayBookingHandler}
                    getPaymentHandler={props.getPaymentHandler}
                    setStayBookings={props.setStayBookings}
                  ></AccommodationSearched>
                );
            }
        }

        setDynamicFilters({
          accommodation_types: res.data?.available_types,
          facilities: res.data?.available_facilities,
          tags: res.data?.tags
        })

        if (res.data?.previous) {
          setMoreOptionsJSX(prev => [...prev, ...options]);
        } else {
          setMoreOptionsJSX(options);
        }

        if (res.data?.next) {
          setViewMoreStatus(true);
          setNextPage(res.data.next);
        } else {
          setViewMoreStatus(false);
        }
      } else {
        setNoResults(true);
        setViewMoreStatus(false);
        setMoreOptionsJSX([]);
      }
      setLoading(false);

    }).catch(err => {
      console.log("error on booking updated:",err)
      setLoading(false);
      setFetchingIsError({
        error: true,
        errorMsg: `Sorry, we could not find any hotels in ${props?.selectedBooking?.city} for given dates at the moment. Please contact us to complete this booking`,
      });
    })
  }

  if (props?.token)
    return (
      <div>
        <Drawer
          show={props?.showBookingModal}
          anchor={"right"}
          backdrop
          className="font-lexend "
          onHide={props?.setHideBookingModal}
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
                  fetchHotels={
                    fetchHotels
                  }
                ></SectionOne>

                <SectionTwo
                  loading={loading}
                  showFilter={props?.showFilter}
                  setshowFilter={props?.setshowFilter}
                  filtersState={filtersState}
                  FILTERS={filtersObj}
                  _updateStarFilterHandler={_updateStarFilterHandler}
                  updateUserStarHandler={updateUserStarHandler}
                  _removeFilterHandler={_removeFilterHandler}
                  _addFilterHandler={_addFilterHandler}
                  booking_city={props?.selectedBooking?.city}
                  No_of_stays={totalCount}
                  payment={props?.payment}
                  plan={props?.plan || props?.booking}
                  TotalCount={totalCount}
                  setShowFilters={setShowFilters}
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
                          {isFetchingError.errorMsg}
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
                    ) : loading ? (<Skeleton />) : !noResults && !updateBookingState ? (
                      <OptionsContainer id="options">
                        <div className="mb-3" style={{ clear: "right" }}>
                          {moreOptionsJSX.length ? (
                            <>
                              {moreOptionsJSX}
                              {updateLoadingState && <Skeleton />}
                            </>
                          ) : null}

                          <div className="mt-3">
                            {viewMoreStatus ? (
                              <Button
                                boxShadow
                                onclickparam={null}
                                onclick={fetchHotels}
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

              <Filters
                showFilter={showFilters}
                setshowFilter={setShowFilters}
                filtersState={filtersState}
                FILTERS={filtersObj}
                _addFilterHandler={_addFilterHandler}
                updateUserStarHandler={updateUserStarHandler}
              />

              <AccommodationModal
                mercury
                check_in={props?.selectedBooking.check_in}
                check_out={props?.selectedBooking.check_out}
                _setImagesHandler={props?._setImagesHandler}
                onHide={() => setShowDetails(false)}
                id={props?.currentBooking?.agoda_accommodation}
                currentBooking={props?.currentBooking}
                show={showDetails}
                handleClick={props?.handleClick}
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
    itinerary_id: state.ItineraryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
