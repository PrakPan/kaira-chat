import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import AccommodationSearched from "./new-accommodation-searched/Index";
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
import { setItineraryFilters } from "../../../store/actions/setItineraryFilters";
import { TbArrowBack } from "react-icons/tb";
import { ItineraryStatusLoader } from "../../../containers/itinerary/ItineraryContainer";
import { useRouter } from "next/router";
import ViewHotelDetails from "../ViewHotelDetails/viewHotelDetails";

const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 251;
  cursor: pointer;
`;

const GridContainer = styled.div`
@media screen and (min-width: 768px) {

    display: grid;
    grid-template-columns: 1fr;

`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
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
  const [paginationStatus, setPaginationStatus] = useState({
    traceId: null,
    page: 1,
    totalPages: 1,
  });
  let isPageWide = media("(min-width: 768px)");
  const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: "",
  });
  const [isFetchingError, setFetchingIsError] = useState({
    error: false,
    errorMsg: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [provider, setProvider] = useState(null);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const filtersState = useSelector((state) => state.ItineraryFilters);
  const itinerary = useSelector((state) => state.Itinerary);
  const [hasUserSearched, setHasUserSearched] = useState(false);
  const [filters, setFilters] = useState({
    free_breakfast: false,
    is_refundable: false,
    budget: {
      price_lower_range: 1000,
      price_upper_range: 10000,
    },
    star_category: null,
    sort: "price: low to high",
    type: null,
    user_ratings: null,
    facilities: null,
    tags: null,
    trace_id: null,
    occupancies: itinerary?.hotels_config?.room_configuration || [
      { adults: 1, childAges: [] },
    ],
    applyFilter: false,
    page: 1,
  });
  const [filtersObj, setFiltersObj] = useState({
    type: [],
    star_category: [1, 2, 3, 4, 5],
    user_ratings: [1, 2, 3, 4, 5],
    sort: ["Price: low to high", "Price: high to low"],
    facilities: [],
    tags: [],
  });
  const [selectSearch, setSelectedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const debouncedSearch = useDebounce(selectSearch);

  const currentBooking = {
    check_in: props?.check_in || props?.currentBooking?.check_in,
    check_out: props?.check_out || props?.currentBooking?.check_out,
    duration: props?.duration || props?.currentBooking?.duration,
    city_id: props?.city_id,
    city_name: props?.city_name,
    booking_id: props?.booking_id,
  };
  useEffect(() => {
    if (
      props?.showBookingModal &&
      currentBooking?.check_in 
    ) {
      console.log("filters useEffect triggered", filters);
      setMoreOptionsJSX([]);
      fetchHotelsFilter();
    }
  }, [filters.applyFilter]);

  useEffect(() => {
    if (debouncedSearch.length > 2||hasUserSearched) {
      console.log("searching in debounced search")
       setHasUserSearched(true);
      setMoreOptionsJSX([]);
      fetchHotelsFilter();
    }
  }, [debouncedSearch]);

  // useEffect(() => {
  //   setMoreOptionsJSX([]);
  //   if (props?.showBookingModal && currentBooking?.check_in) {
  //     fetchHotelsFilter();
  //   }
  // }, [filters.applyFilter]);

  const getDate = (dateString) => {
    try {
      if (!dateString) return dateString;

      dateString = dateString.replace(/\//g, "-");
      const dateParts = dateString.split("-");

      if (
        dateParts.length === 3 &&
        dateParts[0].length === 2 &&
        dateParts[1].length === 2 &&
        dateParts[2].length === 4
      ) {
        const [day, month, year] = dateParts;
        return `${year}-${month}-${day}`;
      }

      const isoParts = dateString.split("-");
      if (
        isoParts.length === 3 &&
        isoParts[0].length === 4 &&
        isoParts[1].length === 2 &&
        isoParts[2].length === 2
      ) {
        return dateString;
      }
      return dateString.replaceAll();
    } catch (err) {
      return dateString;
    }
  };

  const resetPaginationStatus = () => {
    setPaginationStatus({
      traceId: null,
      page: 0,
      totalPages: 1,
    });
  };

  useEffect(() => {
    if (!props?.showBookingModal) {
      setNextPage(1);
      setSelectedSearch("");
    }
  }, [props?.showBookingModal]);

  const handleClearSearch = () => {
    setSelectedSearch("");
  };

  const _addFilterHandler = (filter, heading) => {
    console.log("add filter handler called")
    setFilters((prev) => ({
      ...prev,
      [heading]: filter,
      applyFilter: !filters.applyFilter,
    }));
  };

  const _updateStarFilterHandler = (star) => {
    setFilters((prev) => ({
      ...prev,
      star_category: star,
      applyFilter: !filters.applyFilter,
    }));
  };

  const updateUserStarHandler = (star) => {
    setFilters((prev) => ({
      ...prev,
      user_ratings: star,
      applyFilter: !filters.applyFilter,
    }));
  };

  const _removeFilterHandler = (heading) => {
    let oldfilters = {
      budget: "",
      type: "",
      star_category: "",
      sort: "recommended",
    };
    dispatch(setItineraryFilters({ [heading]: oldfilters[heading] }));
  };
  const handleClose = () => {
    resetPaginationStatus();

    setMoreOptionsJSX([]);
    setLoading(true);
    setFilters((prev) => ({
      free_breakfast: false,
      is_refundable: false,
      budget: {
        price_lower_range: 1000,
        price_upper_range: 10000,
      },
      star_category: null,
      sort: "price: low to high",
      type: null,
      user_ratings: null,
      facilities: null,
      tags: null,
      trace_id: null,
      occupancies: itinerary?.hotels_config?.room_configuration || [
        { adults: 1, childAges: [] },
      ],
      applyFilter: false,
      page: 1,
    }));
    setMoreOptionsJSX([]);
    setNoResults(false);
    props?.setShowBookingModal(false);
    props.onHide();
  };

  const setDynamicFilters = (filters) => {
    setFiltersObj({
      ...filtersObj,
      type: filters?.accommodation_types ? filters.accommodation_types : [],
      facilities: filters?.facilities ? filters.facilities : [],
      tags: filters?.tags ? filters.tags : [],
    });
  };

  const fetchHotelsFilter = () => {
    if (props?.itinerary_city_id != router?.query?.itineraryCityId) return;
    setLoading(true);
    setUpdateLoadingState(true);
    setNoResults(false);
    setFetchingIsError({
      error: false,
      errorMsg: "",
    });
    const requestData = {
      check_in: getDate(currentBooking?.check_in),
      check_out: getDate(currentBooking?.check_out),
      city_id: currentBooking?.city_id || props?.selectedBooking?.city_id,
      filter_by: {
        price_lower_range: filters.budget.price_lower_range,
        price_upper_range: filters.budget.price_upper_range,
        hotel_name: selectSearch ? selectSearch : null,
        sub_location_ids: null,
        free_breakfast: filters.free_breakfast,
        is_refundable: filters.is_refundable,
        facilities: filters.facilities,
        tags: filters.tags,
        type: filters.type && filters.type[0] !== "All" ? filters.type : null,
        star_category: filters.star_category,
        user_ratings: filters.user_ratings,
        page: 1,
      },
      occupancies: filters.occupancies.map((room) => {
        return {
          num_adults: room.adults,
          child_ages: room.childAges,
        };
      }),
      sort_by: {
        price_order: filters.sort === "price: high to low" ? "desc" : "asc",
      },
      trace_id: null,
    };

    hotelSearch
      .post("", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setUpdateLoadingState(false);
        setProvider(res.data?.source);

        if (res.data?.trace_details?.id) {
          localStorage.setItem("trace_id", res?.data?.trace_details?.id);
        }

        if (res.data?.data?.length) {
          if (res.data?.count) setTotalCount(res.data.count);
          setNoResults(false);

          let options = [];
          for (var i = 0; i < res.data.data.length; i++) {
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
                    mercury
                    source={res?.data?.data?.[i]?.source}
                    handleClick={props?.handleClick}
                    payment={props.payment}
                    plan={props.plan}
                    currentBooking={currentBooking}
                    _setImagesHandler={props._setImagesHandler}
                    itinerary_id={props.itinerary_id}
                    tailored_id={props.tailored_id}
                    accommodation={res.data.data[i]}
                    key={i}
                    images={res.data.data[i].images}
                    banner_image={img}
                    bookings={props.bookings}
                    num_adults={(filters?.occupancies).reduce(
                      (sum, room) => sum + (room.adults || 0),
                      0
                    )}
                    occupancies={filters.occupancies}
                    traceId={
                      res.data?.trace_details?.id
                        ? res.data.trace_details.id
                        : ""
                    }
                    provider={res.data?.data?.[0]?.source}
                    setUpdateBookingState={setUpdateBookingState}
                    setUnauthorized={setUnauthorized}
                    _updateStayBookingHandler={props._updateStayBookingHandler}
                    getPaymentHandler={props.getPaymentHandler}
                    setStayBookings={props.setStayBookings}
                    setShowLoginModal={props?.setShowLoginModal}
                    handleClose={handleClose}
                    itinerary_city_id={props.itinerary_city_id}
                    city_id={currentBooking?.city_id}
                  ></AccommodationSearched>
                );
            }
          }
          if (
            filtersObj?.type?.length == 0 &&
            filtersObj?.facilities?.length == 0 &&
            filtersObj?.tags?.length == 0
          ) {
            setDynamicFilters({
              accommodation_types: res.data?.available_types,
              facilities: res.data?.available_facilities,
              tags: res.data?.tags,
            });
          }
          // setFilters((prev) => ({
          //   ...prev,
          //   facilities: res?.data?.selected_filters?.facilities,
          //   type: res?.data?.selected_filters?.type,
          //   tags: res?.data?.selected_filters?.tags,
          //   page: 1,
          //   trace_id: null,
          // }));
          // setTotalCount(res?.data?.count);
          setMoreOptionsJSX(options);
          setPaginationStatus({
            traceId: res?.data?.trace_details?.id,
            page: res?.data?.current_page,
            totalPages: res?.data?.total_pages,
          });
        } else {
          setNoResults(true);
          setMoreOptionsJSX([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setUpdateLoadingState(false);
        setMoreOptionsJSX([]);

        setFetchingIsError({
          error: true,
          errorMsg: `Sorry, we could not find any hotels in ${currentBooking?.city_name} for given dates at the moment. Please contact us to complete this booking`,
        });
      });
  };

  const fetchHotels = () => {
    try {
      if (props?.itinerary_city_id != router?.query?.itineraryCityId) return;
      setLoading(true);
      setUpdateLoadingState(true);
      setNoResults(false);
      setFetchingIsError({
        error: false,
        errorMsg: "",
      });
      const requestData = {
        check_in: getDate(currentBooking?.check_in),
        check_out: getDate(currentBooking?.check_out),
        city_id: currentBooking?.city_id,
        filter_by: {
          price_lower_range: filters.budget.price_lower_range,
          price_upper_range: filters.budget.price_upper_range,
          hotel_name: selectSearch ? selectSearch : null,
          sub_location_ids: null,
          free_breakfast: filters.free_breakfast,
          is_refundable: filters.is_refundable,
          facilities: filters.facilities,
          tags: filters.tags,
          type: filters.type && filters.type[0] !== "All" ? filters.type : null,
          star_category: filters.star_category,
          user_ratings: filters.user_ratings,
          page: paginationStatus?.page + 1,
        },
        occupancies: filters.occupancies.map((room) => {
          return {
            num_adults: room.adults,
            child_ages: room.childAges,
          };
        }),
        sort_by: {
          price_order: filters.sort === "price: high to low" ? "desc" : "asc",
        },
        trace_id: paginationStatus?.traceId,
      };

      hotelSearch
        .post("", requestData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setUpdateLoadingState(false);
          setProvider(res.data?.source);

          if (res.data?.trace_details?.id) {
            localStorage.setItem("trace_id", res?.data?.trace_details?.id);
          }

          if (res.data?.data?.length) {
            if (res.data?.count) setTotalCount(res.data.count);
            setNoResults(false);

            let options = [];
            for (var i = 0; i < res.data.data.length; i++) {
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
                      mercury
                      itinerary_city_id={props.itinerary_city_id}
                      source={res?.data?.data?.[i]?.source}
                      handleClick={props?.handleClick}
                      payment={props.payment}
                      plan={props.plan}
                      currentBooking={currentBooking}
                      _setImagesHandler={props._setImagesHandler}
                      itinerary_id={props.itinerary_id}
                      tailored_id={props.tailored_id}
                      accommodation={res.data.data[i]}
                      key={i}
                      images={res.data.data[i].images}
                      banner_image={img}
                      bookings={props.bookings}
                      num_adults={(filters?.occupancies).reduce(
                        (sum, room) => sum + (room.adults || 0),
                        0
                      )}
                      occupancies={filters.occupancies}
                      traceId={
                        res.data?.trace_details?.id
                          ? res.data.trace_details.id
                          : ""
                      }
                      provider={res.data?.data?.[0]?.source}
                      setUpdateBookingState={setUpdateBookingState}
                      setUnauthorized={setUnauthorized}
                      _updateStayBookingHandler={
                        props._updateStayBookingHandler
                      }
                      getPaymentHandler={props.getPaymentHandler}
                      setStayBookings={props.setStayBookings}
                      setShowLoginModal={props?.setShowLoginModal}
                      handleClose={handleClose}
                      city_id={currentBooking?.city_id}
                    ></AccommodationSearched>
                  );
              }
            }
            if (
              filtersObj?.type?.length == 0 &&
              filtersObj?.facilities?.length == 0 &&
              filtersObj?.tags?.length == 0
            ) {
              setDynamicFilters({
                accommodation_types: res.data?.available_types,
                facilities: res.data?.available_facilities,
                tags: res.data?.tags,
              });
            }
            // setTotalCount(res?.data?.count);
            setMoreOptionsJSX([...moreOptionsJSX, ...options]);
            // setFilters((prev) => ({
            //   ...prev,
            //   facilities: res?.data?.selected_filters?.facilities,
            //   type: res?.data?.selected_filters?.type,
            //   tags: res?.data?.selected_filters?.tags,
            //   trace_id: paginationStatus?.traceId,
            //   page: paginationStatus?.page,
            // }));
            setPaginationStatus({
              traceId: res?.data?.trace_details?.id,
              page: res?.data?.current_page,
              totalPages: res?.data?.total_pages,
            });
          } else {
            setNoResults(true);
            setMoreOptionsJSX([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setUpdateLoadingState(false);
          if (err?.response.status == 400) {
            setPaginationStatus(() => ({
              traceId: null,
              page: 1,
              totalPages: 1,
            }));
          }
          props.openNotification({
            text: "Sorry, No more hotels available!",
            heading: "Error!",
            type: "error",
          });
          setFetchingIsError({
            error: true,
            errorMsg: `Sorry, we could not find any hotels in ${currentBooking?.city_name} for given dates at the moment. Please contact us to complete this booking`,
          });
        });
    } catch (error) {
      console.log("error in accommodation search:", error);
    }
  };

  if (props?.token)
    return (
      <div>
        <Drawer
          show={props?.showBookingModal}
          anchor={"right"}
          backdrop
          style={{ zIndex: 1251 }}
          className="font-lexend "
          onHide={handleClose}
          width={"50vw"}
          mobileWidth={"100vw"}
        >
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

            <div className="lg:w-[50vw] w-[100vw] py-2 top-0 bg-white z-[900]">
              <SectionOne
                booking_city={
                  currentBooking?.city_name || props?.selectedBooking?.city_name
                }
                setHideBookingModal={props?.setHideBookingModal}
                selectSearch={selectSearch}
                setSelectedSearch={setSelectedSearch}
                fetchHotels={fetchHotels}
                resetPaginationStatus={resetPaginationStatus}
                setMoreOptionsJSX={setMoreOptionsJSX}
                clickType={props?.clickType}
                setFilters={setFilters}
                hotelsConf={
                  itinerary?.hotels_config?.room_configuration || [
                    { adults: 1, childAges: [] },
                  ]
                }
                handleClose={handleClose}
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
                booking_city={
                  currentBooking?.city_name || props?.selectedBooking?.city_name
                }
                No_of_stays={totalCount}
                payment={props?.payment}
                plan={props?.plan || props?.booking}
                TotalCount={totalCount}
                setShowFilters={setShowFilters}
                showFilters={showFilters}
                filters={filters}
                setFilters={setFilters}
              ></SectionTwo>
            </div>

            <div className="flex items-center justify-center sticky top-2/3 z-[900]">
              {loading && (
                <ItineraryStatusLoader
                  displayText={"Finding best hotels for you"}
                  isVisible={loading}
                />
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

                  {!loading &&
                  isFetchingError.error &&
                  moreOptionsJSX?.length == 0 ? (
                    <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
                      <div className="flex flex-row items-center justify-center text-center font-lexend">
                        {isFetchingError.errorMsg}
                      </div>
                      <GetInTouchContainer>
                        <Button
                          color="#111"
                          fontWeight="500"
                          fontSize="1rem"
                          borderWidth="1px"
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
                      <div className="mb-3">
                        {moreOptionsJSX.length ? (
                          <>
                            {moreOptionsJSX?.map((item) => (
                              <>{item}</>
                            ))}
                            {updateLoadingState && <Skeleton />}
                          </>
                        ) : null}
                        {loading && <Skeleton />}

                        {paginationStatus.page <
                          paginationStatus.totalPages && (
                          <div className="mt-3">
                            {/* {viewMoreStatus ? ( */}
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
                            {/* // ) : selectSearch !== "" ? (
                              //   <Button
                              //     boxShadow
                              //     onclickparam={null}
                              //     onclick={handleClearSearch}
                              //     margin="0.25rem auto"
                              //     borderWidth="1px"
                              //     borderRadius="2rem"
                              //     padding="0.25rem 1rem"
                              //   >
                              //     Show All
                              //   </Button>
                              // ) : null} */}
                          </div>
                        )}
                      </div>
                    </OptionsContainer>
                  ) : null}

                  {!loading && noResults ? (
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
            {!isPageWide && (
              <FloatingView>
                <TbArrowBack
                  style={{ height: "28px", width: "28px" }}
                  cursor={"pointer"}
                  onClick={handleClose}
                />
              </FloatingView>
            )}
            {/* <ViewHotelDetails
              mercury={true}
              check_in={props?.selectedBooking.check_in}
              check_out={props?.selectedBooking.check_out}
              _setImagesHandler={props?._setImagesHandler}
              onHide={() => setShowDetails(false)}
              id={props?.currentBooking?.agoda_accommodation}
              currentBooking={props?.currentBooking}
              show={showDetails}
              handleClick={props?.handleClick}
              setStayBookings={props?.setStayBookings}
              itineraryDaybyDay={props?.itineraryDaybyDay}
              occupancies={filters.occupancies}
              setShowLoginModal={props?.setShowLoginModal}
              handleClose={handleClose}
              city_id={props?.selectedBooking?.cityId}
              plan={props.plan}
              itinerary_city_id={props.itinerary_city_id}
            ></ViewHotelDetails> */}
          </>
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
