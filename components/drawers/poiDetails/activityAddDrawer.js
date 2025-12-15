import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { activtySearch } from "../../../services/poi/reccommendedactivities";
import axiosaddActivityinstance from "../../../services/poi/addActivities";
import { BiErrorCircle } from "react-icons/bi";
import PoiListSkeleton from "../../../containers/newitinerary/itineraryelements/PoiListSkeleton";
import { getDate } from "../../../helper/DateUtils";
import { connect, useSelector } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { IoMdSearch } from "react-icons/io";
import useMediaQuery from "../../../hooks/useMedia";
import useDebounce from "../../../hooks/useDebounce";
import Button from "../../ui/button/Index";
import ImageLoader from "../../../components/ImageLoader";
import { logEvent } from "../../../services/ga/Index";
import NewActivityBooking from "../../../containers/newitinerary/itineraryelements/NewActivityBooking";
import { Pax } from "./Pax";
import { getHumanDate } from "../../../services/getHumanDate";
import DyamicFilters from "./filters/DynamicFilters";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import Image from "next/image";
import { Navigation } from "../../NewNavigation";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import NewPoiBooking from "../../../containers/newitinerary/itineraryelements/NewPoiBooking";
import Drawer from "../../ui/Drawer";
import BackArrow from "../../ui/BackArrow";
import { TbArrowBack } from "react-icons/tb";
import { useRouter } from "next/router";

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
  z-index: 1;
  cursor: pointer;
`;
const EmptyMsg = styled.div`
  margin-top: 5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
`;

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
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

const items = [
  { id: 1, label: "Things To Do", link: "" },
  { id: 2, label: "Places To Visit", link: "" },
];
const ActivityAddDrawer = (props) => {
  const router=useRouter()
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [selectedExprience, setSelectedExprience] = useState(-1);
  const [nextUrl, setNextUrl] = useState(null);
  const [elementType, setElementType] = useState("Activity");
  const [options, setOptions] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [selectSearch, setSelectedSearch] = useState("");
  const debouncedSearch = useDebounce(selectSearch);
  const [loaded, setLoaded] = useState(false);
  const [loadingPoi, setLoadingPoi] = useState(true);
  const [offSet, setOffSet] = useState(0);
  const [showDynamicfilters, setShowDynamicfilters] = useState(false);
  const itineraryFilters = useSelector((state) => state.ItineraryFilters);
  const itinerary = useSelector((state) => state.Itinerary);
  const num_adults = itinerary.number_of_adults;
  const [filterState, setFilterState] = useState({
    recommended_only: false,
    rating: [],
    category: ["All"],
    tour_type: ["All"],
    guide: ["All"],
    pax: {
      number_of_travelers: num_adults,
      traveler_ages: Array(num_adults).fill(null),
    },
    experienceFilters: ["All"],
    experienceFiltersActivity: ["All"],


  });
  const [filtersObj, setFiltersObj] = useState({
    ratings: [1, 2, 3, 4, 5],
    category: [],
    tour_type: [],
    guide: [],
    experienceFilters: [],
    experienceFiltersActivity: [],
  });
  const [pax, setPax] = useState({
    adults: itinerary.number_of_adults,
    children: itinerary.number_of_children,
  });
  const [showPax, setShowPax] = useState(false);
  const prevPaxRef = useRef(pax);
  const [selectedRating, setSelectedRating] = useState([]);
  const [recommended, setRecommended] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [changed, setChanged] = useState(false);
  const [startDate, setStartDate] = useState(props?.date);
  const [showCalender, setShowCalender] = useState(false);

  const filtersRef = useRef(null);
  const calendarRef = useRef(null);
  const [height, setHeight] = useState(0);

  const [showSkeleton, setShowSkeleton] = useState(false);

  const [error, setError] = useState(null);
  const currency = useSelector(state=>state.currency);

  const dateObj = new Date(props.date);

const pad = (n) => (n < 10 ? `0${n}` : n);
const formattedDate =
  pad(dateObj.getDate()) +
  "/" +
  pad(dateObj.getMonth() + 1) +
  "/" +
  dateObj.getFullYear();

  
  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight(); // initial run
    window.addEventListener("resize", updateHeight);

    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowDynamicfilters(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalender(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const hasRatingChanged =
      filterState.rating.length !== selectedRating.length ||
      filterState.rating.some((rating) => !selectedRating.includes(rating)) ||
      selectedRating.some((rating) => !filterState.rating.includes(rating)) ||
      JSON.stringify(prevPaxRef.current) !== JSON.stringify(pax);
    prevPaxRef.current = pax;
    let handler;
    if (hasRatingChanged) {
      handler = setTimeout(() => {
        setFilterState((prev) => ({
          ...prev,
          rating: selectedRating,
          num_adults: 4,
          num_children: pax.children,
        }));
      }, 2000);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [pax, selectedRating]);

  useEffect(() => {
    if (props.showDrawer) {
      fetchData();
    }
  }, [
    elementType,
    selectedExprience,
    props.showDrawer,
    debouncedSearch,
    filterState,
    startDate,
    nearby
  ]);

  useEffect(() => {
    setSelectedSearch("");
    setOptions([]);
    setOffSet(0);
  }, [props.showDrawer]);

  const setFocus = (dayIndex, elementIndex, activityId) => {
    const element = document.getElementById(
      `${dayIndex}-${elementIndex}-${activityId}`
    );
    let timeoutId;
    if (element) {
      element.scrollIntoView({ block: "center" });
      element.style.borderWidth = "1px";
      element.style.borderRadius = "10px";
      element.style.borderColor = "#f8e000";
      element.style.boxShadow = "0 0 10px #f8e000";

      timeoutId = setTimeout(() => {
        element.style.borderWidth = "";
        element.style.borderRadius = "";
        element.style.borderColor = "";
        element.style.boxShadow = "";
      }, 4000);
    }

    // Cleanup the timeout to avoid memory leaks
    if (timeoutId) return () => clearTimeout(timeoutId);
  };

  const _addActivityHandler = (activityID) => {
    axiosaddActivityinstance
      .post(
        "/",
        {
          itinerary_id: props.itinerary_id,
          activity_id: activityID,
          check_in: getDate(props.date),
          day_slab_index: props.day_slab_index,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((response) => {
        props.setItinerary(response.data);
        props.getAccommodationAndActivitiesHandler();
        props.openNotification({
          text: "Your Activity added successfully!",
          heading: "Success!",
          type: "success",
        });
        const lastElement = [
          ...response.data.day_slabs[props.day_slab_index].slab_elements,
        ].pop();
        setTimeout(() => {
          setFocus(props.day_slab_index, lastElement.element_index, activityID);
        }, 1000);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          props.openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else {
          props.openNotification({
            text:  err?.response?.data?.errors?.[0]?.message?.[0] || "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
      });

    logEvent({
      action: "Add_Activity",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Select",
        event_action: "Add Activity",
      },
    });
  };

  const setDynamicFilters = (filters) => {
    setFiltersObj((prev) => ({
      ...prev,
      category: filters?.category,
      tour_type: filters?.tour_type,
      guide: filters?.guide,
    }));
  };

  const fetchData = async (showMore = false) => {
    if (elementType == "Activity" || elementType == "") {
      setLoaded(false);
      try {
        const requestData = {
          city: props?.cityID,
          start_date: getDate(startDate),
          number_of_adults: pax?.adults || 1,
          number_of_children: pax?.children || 0,
          traveler_ages: filterState.pax.traveler_ages,
          filter_by: {
            name: debouncedSearch,
            recommended_only: filterState.recommended_only,
            rating: filterState.rating,
            category:
              filterState.category && filterState.category[0] !== "All"
                ? filterState.category
                : null,
            tour_type:
              filterState.tour_type && filterState.tour_type[0] !== "All"
                ? filterState.tour_type
                : null,
            guide:
              filterState.guide && filterState.guide[0] !== "All"
                ? filterState.guide
                : null,
            experience_filters:
              filterState?.experienceFiltersActivity &&
              filterState.experienceFiltersActivity[0] !== "All"
                ? filterState.experienceFiltersActivity
                : null,
          },
          sort_by: {},
          load_nearby: nearby
        };
        activtySearch
          .post(`/?limit=30&offset=${offSet}&currency=${currency?.currency || 'INR'}`, requestData)
          .then((res) => {
            if (res.data?.data?.activities?.length) {
              setTotalResults(res.data.results);
              if (res.data?.data?.filter_by) {
                setDynamicFilters(res.data.data.filter_by);
              }
              let options = [];

              for (var i = 0; i < res.data.data.activities.length; i++) {
                options.push(
                  <NewActivityBooking
                    key={i}
                    activityAddDrawer
                    _updatePoiHandler={_addActivityHandler}
                    setShowDrawer={props?.setShowDrawer}
                    data={res.data.data.activities[i]}
                    setLoginModal={props.setShowLoginModal}
                    date={startDate}
                    getAccommodationAndActivitiesHandler={
                      props.getAccommodationAndActivitiesHandler
                    }
                    cityId={props?.cityID}
                    itinerary_city_id={props?.itinerary_city_id}
                    setActivities={props?.setActivities}
                    activities={props?.activities}
                    setItinerary={props?.setItinerary}
                    activityBookings={props?.activityBookings}
                    setActivityBookings={props?.setActivityBookings}
                    pax={pax}
                  ></NewActivityBooking>
                );
              }

              if (showMore) setOptions((prev) => [...prev, ...options]);
              else setOptions(options);
              setNextUrl(res?.data?.next);

              if (res.data.next) {
                setShowMoreResults(true);
              } else {
                setShowMoreResults(false);
                setOffSet(0);
              }
            } else {
              setOptions([]);
              setTotalResults(null);
            }
            setLoaded(true);
          })
          .catch((err) => {
            console.log("error in activity search:", err);
            setLoaded(true);
          });
      } catch (error) {
        setError(error.response?.data?.errors[0]?.message[0]);
      }
    } else {
      setLoadingPoi(true);
      try {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/geos/poi/?fields=id,name,city,display_name,one_liner_description,image,rating,experience_filters,short_description,tags,is_very_popular,tips_tricks,is_hidden_gem,gmaps_place_id,user_ratings_total&city_id=${
            props?.cityID
          }&name=${debouncedSearch}&is_very_popular=${
            filterState?.recommended_only
          }&filters=${filterState?.experienceFilters.join(",")}`
        );
        setTotalResults(res.data.results);
        const result = [];
        for (var i = 0; i < res.data.data.pois.length; i++) {
          result.push(
            <NewPoiBooking
              key={i}
              setShowDrawer={props?.setShowDrawer}
              data={res.data.data.pois[i]}
              setLoginModal={props.setShowLoginModal}
              date={startDate}
              cityId={props?.cityID}
              itinerary_city_id={props?.itinerary_city_id}
              dayIndex={(new Date(startDate.split("/").reverse().join("-")) - new Date(props.start_date)) / (1000 * 60 * 60 * 24)}
              setShowLoginModal={props.setShowLoginModal}
            ></NewPoiBooking>
          );
        }
        for (var i = 0; i < res.data.data.suggested_places.length; i++) {
          result.push(
            <NewPoiBooking
              key={i}
              setShowDrawer={props?.setShowDrawer}
              data={res.data.data.suggested_places[i]}
              setLoginModal={props.setShowLoginModal}
              date={startDate}
              cityId={props?.cityID}
              itinerary_city_id={props?.itinerary_city_id}
              dayIndex={(new Date(startDate.split("/").reverse().join("-")) - new Date(props.start_date)) / (1000 * 60 * 60 * 24)}
              setShowLoginModal={props.setShowLoginModal}
            ></NewPoiBooking>
          );
        }
        for (var i = 0; i < res.data.data.suggested_places.length; i++) {
          result.push(
            <NewPoiBooking
              key={i}
              setShowDrawer={props?.setShowDrawer}
              data={res.data.data.suggested_places[i]}
              setLoginModal={props.setShowLoginModal}
              date={startDate}
              cityId={props?.cityID}
              itinerary_city_id={props?.itinerary_city_id}
              dayIndex={props?.day_slab_index}
              setShowLoginModal={props.setShowLoginModal}
            ></NewPoiBooking>
          );
        }
        setNextUrl(res?.data?.next);
        setOptions(result);
      } catch (error) {
        setError(error.response?.data?.errors[0]?.message[0]);
      }
      setLoadingPoi(false);
    }
  };

  const handleViewMore = async () => {
    setShowSkeleton(true);

    try {
      let options = [];
      if (elementType == "Activity" || elementType == "") {
        const requestData = {
          city: props?.cityID,
          start_date: getDate(startDate),
          number_of_adults: pax?.adults || 1,
          number_of_children: pax?.children || 0,
          traveler_ages: filterState.pax.traveler_ages,
          filter_by: {
            name: debouncedSearch,
            recommended_only: filterState.recommended_only,
            rating: filterState.rating,
            category:
              filterState.category && filterState.category[0] !== "All"
                ? filterState.category
                : null,
            tour_type:
              filterState.tour_type && filterState.tour_type[0] !== "All"
                ? filterState.tour_type
                : null,
            guide:
              filterState.guide && filterState.guide[0] !== "All"
                ? filterState.guide
                : null,
          },
          sort_by: {},
        };
        const res = await axios.post(nextUrl, requestData);
        for (var i = 0; i < res.data.data.activities.length; i++) {
          options.push(
            <NewActivityBooking
              key={i}
              activityAddDrawer
              _updatePoiHandler={_addActivityHandler}
              setShowDrawer={props?.setShowDrawer}
              data={res.data.data.activities[i]}
              setLoginModal={props.setShowLoginModal}
              date={startDate}
              getAccommodationAndActivitiesHandler={
                props.getAccommodationAndActivitiesHandler
              }
              cityId={props?.cityID}
              itinerary_city_id={props?.itinerary_city_id}
              setActivities={props?.setActivities}
              activities={props?.activities}
              setItinerary={props?.setItinerary}
              activityBookings={props?.activityBookings}
              setActivityBookings={props?.setActivityBookings}
              pax={pax}
            ></NewActivityBooking>
          );
        }
        setOptions((prev) => [...prev, ...options]);
        setNextUrl(res?.data?.next);
        if (res.data.next) {
          setShowMoreResults(true);
        } else {
          setShowMoreResults(false);
          setOffSet(0);
        }
      } else {
        const res = await axios.get(nextUrl);

        for (var i = 0; i < res.data.data.pois.length; i++) {
          options.push(
            <NewPoiBooking
              key={i}
              setShowDrawer={props?.setShowDrawer}
              data={res.data.data.pois[i]}
              setLoginModal={props.setShowLoginModal}
              date={startDate}
              cityId={props?.cityID}
              itinerary_city_id={props?.itinerary_city_id}
              dayIndex={props?.day_slab_index}
              setShowLoginModal={props.setShowLoginModal}
            ></NewPoiBooking>
          );
        }
        for (var i = 0; i < res.data.data.suggested_places.length; i++) {
          options.push(
            <NewPoiBooking
              key={i}
              setShowDrawer={props?.setShowDrawer}
              data={res.data.data.suggested_places[i]}
              setLoginModal={props.setShowLoginModal}
              date={startDate}
              cityId={props?.cityID}
              itinerary_city_id={props?.itinerary_city_id}
              dayIndex={props?.day_slab_index}
              setShowLoginModal={props.setShowLoginModal}
            ></NewPoiBooking>
          );
        }
        setOptions((prev) => [...prev, ...options]);
        setNextUrl(res?.data?.next);
      }
    } catch (error) {
      console.log("error is:", error);
    }
    setShowSkeleton(false);
  };

  const searchHandler = (e) => {
    if (e.target.id === "icon" && debouncedSearch.trim().length > 0) {
      fetchData();
    } else {
      setSelectedSearch(e.target.value);
      setOffSet(0);
    }
  };

  const handleClearSearch = () => {
    setSelectedSearch("");
  };
  const handleRecommneded = () => {
    setRecommended((prev) => !prev);
    setFilterState((prev) => ({
      ...prev,
      recommended_only: !recommended,
    }));
  };

    const handleNearby = () => {
    setNearby((prev) => !prev);
  };

  const convertToISODate = (dateStr) => {
    if (!dateStr) return;
    const [day, month, year] = dateStr?.split("/");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };

  const ClickHandler = (child) => {
    setOffSet(0);
    if (child === "Things To Do") {
      setElementType("Activity");
    } else {
      setElementType("POI");
    }
    setLoaded(false);
    setLoadingPoi(true);
    setOptions([]);
  };
  const handleCloseDrawer = () => {
    const { id, drawer } = router.query;
    if (!drawer || !props?.showDrawer) return;
    router.push(
      {
        pathname: `/itinerary/${id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
  };
  return (
    <Drawer
      show={props.showDrawer}
      anchor={"right"}
      backdrop
      width={"50%"}
      mobileWidth={"100%"}
      style={{ zIndex: 1501 }}
      className={` !overflow-y-hidden`}
      onHide={handleCloseDrawer}
    >
      {error == null ? (
        <>
          <div
            className={`overflow-y-scroll px-lg max-ph:px-sm`}
            style={{ height: `${height}px` }}
          >
            <div className="py-4 bg-white z-[900] flex flex-col gap-3  pb-1 justify-start items-start mx-auto">
                   <div>
                      <Image src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={(e) => handleCloseDrawer(e)} />
                    </div>
              <div className="flex max-sm:flex-col max-sm:!items-start justify-between w-full items-center">
                <div className=" line-clamp-1 text-[24px] font-semibold ">
                  Add {elementType == "POI" ? "Places to visit" : elementType}{" "}
                  in {props.cityName}
                </div>
                {elementType == "Activity" && (
                  <Pax
                    setShowPax={setShowPax}
                    pax={pax}
                    setPax={setPax}
                    showPax={showPax}
                  />
                )}
              </div>
              <div className="grid w-full gap-2 sm:grid-cols-[3fr_2fr_1fr]">
                <div className=" flex flex-row items-center relative h-[44px]">
                  <IoMdSearch
                    id={"icon"}
                    onClick={searchHandler}
                    className="absolute cursor-pointer left-4 text-2xl"
                  />

                  <input
                    type="text"
                    value={selectSearch}
                    onChange={searchHandler}
                    placeholder={`Search ${
                      elementType === "POI" ? "attractions" : "activities"
                    }`}
                    className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700] h-[44px]"
                  ></input>
                </div>
                <select
                  className="px-[16px] py-[12px] rounded-[8px] bg-white border-1 border-[#979393] h-[44px] text-[14px] font-medium flex items-center justify-between max-sm:hidden"
                  onChange={(e) => setStartDate(e.target.value)}
                  defaultValue={formattedDate}
                >
                  {[...Array(props.duration)].map((_, i) => {
                    const baseDateStr = props?.mercuryItinerary
                      ? props?.start_date
                      : convertToISODate(props?.start_date);

                    const baseDate = new Date(baseDateStr);
                    if (isNaN(baseDate.getTime())) return null;

                    const currentDate = new Date(baseDate);
                    currentDate.setDate(currentDate.getDate() + i);

                    const isoDate = `${pad(currentDate.getDate())}/${pad(
                      currentDate.getMonth() + 1
                    )}/${currentDate.getFullYear()}`;
                    const formattedDate = getHumanDate(isoDate);

                    return (
                      <option key={i} value={isoDate}>
                        {formattedDate} | Day {i + 1}
                      </option>
                    );
                  })}
                </select>

                <div className="relative inline-block">
                  <div
                    className="relative px-[16px] py-[12px] bg-[#1B1B1B] text-white rounded-[8px] h-[44px] flex items-center gap-2 max-sm:hidden cursor-pointer"
                    onClick={() => setShowDynamicfilters(true)}
                  >
                    <Image
                      src="/filter.svg"
                      width={20}
                      height={20}
                      alt="Filter Icon"
                    />
                    <button>Filters</button>
                    {changed && (
                      <div className="absolute -right-1 -top-1 h-[20px] w-[20px] rounded-full bg-red-500"></div>
                    )}
                  </div>

                  {showDynamicfilters && (
                    <div
                    className={`
                      z-[1091] bg-white shadow-2xl drop-shadow-3xl p-[16px] rounded-lg space-y-5 text-sm
                
                      sm:absolute sm:top-[calc(100%+8px)] sm:right-0 sm:block 
                
                       max-sm:fixed max-sm:bottom-0 max-sm:w-full max-sm:left-0 max-sm:block
                    `}
                      ref={filtersRef}
                    >
                      <DyamicFilters
                        filters={filtersObj}
                        showFilter={showDynamicfilters}
                        setshowFilter={setShowDynamicfilters}
                        filterState={filterState}
                        setFilterState={setFilterState}
                        FILTERS={filtersObj}
                        setChanged={setChanged}
                        elementType={elementType}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:hidden flex justify-between w-full">
                {/* <button
                  onClick={handleRecommneded}
                  className="flex flex-row items-center gap-1 cursor-pointer"
                >
                  <CheckboxFormComponent checked={recommended} />
                  Top Recommended
                </button> */}
                
                  <button
                    onClick={handleNearby}
                    className="flex flex-row items-center gap-1 cursor-pointer"
                  >
                    <CheckboxFormComponent checked={nearby} />
                    Nearby Activities
                  </button>
               
                <div className="flex gap-4">
                  <div
                    className="rounded-[12px] border-2 px-[16px] py-[12px] border-black cursor-pointer"
                    onClick={() => setShowCalender(true)}
                  >
                    <Image
                      src="/calender.svg"
                      width={"20"}
                      height={"20"}
                      color="white"
                    />
                  </div>
                  <div
                    className="relative px-[16px] py-[12px] bg-[#1B1B1B] text-white rounded-[8px] h-[44px] flex items-center gap-2  cursor-pointer"
                    onClick={() => setShowDynamicfilters(true)}
                  >
                    <Image
                      src="/filter.svg"
                      width={"20"}
                      height={"20"}
                      color="white"
                    />
                    {changed && (
                      <div className="absolute -right-1 -top-1 h-[20px] w-[20px] rounded-full !bg-red-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between w-full mb-[20px]">
                <div>
                  Showing {options.length}
                  {elementType === "POI" ? " attractions" : nearby ? " nearby activities" : " activities"}
                  {totalResults ? ` out of ${totalResults}` : null}
                  {props?.cityName ? ` in ${props?.cityName}` : null}
                </div>
                {/* <div className="max-sm:hidden">
                  <button
                    onClick={handleRecommneded}
                    className="flex flex-row items-center gap-1 cursor-pointer"
                  >
                    <CheckboxFormComponent checked={recommended} />
                    Top Recommended
                  </button>
                </div> */}
                <div className="max-sm:hidden">
                  <button
                    onClick={handleNearby}
                    className="flex flex-row items-center gap-1 cursor-pointer"
                  >
                    <CheckboxFormComponent checked={nearby} />
                    Nearby Activities
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="z-[900]"> */}
            <Navigation
              items={items}
              BarName="TabsName"
              ClickHandler={ClickHandler}
              selectedItem={
                elementType === "Activity" ? `${items[0].id}` : `${items[1].id}`
              }
            />
            {/* </div> */}

            <>
              {(elementType === "Activity" ? loaded : !loadingPoi) ? (
                options.length ? (
                  <div
                    // onScroll={handleScroll}
                    className="z-[99] flex flex-col items-center mb-3 h-[calc(100vh-360px)]"
                  >
                    {options}
                    <div className="w-[100%]">
                      {showSkeleton && <PoiListSkeleton />}
                    </div>
                    {nextUrl !== null ? (
                      <Button
                        boxShadow
                        onclickparam={null}
                        onclick={handleViewMore}
                        margin="0.25rem auto"
                        borderWidth="1px"
                        borderRadius="2rem"
                        padding="0.25rem 1rem"
                      >
                        View more
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <EmptyMsg className="flex flex-row items-start px-1">
                      <BiErrorCircle className="" />
                      <span className="">
                        Oops, it looks like there are no{" "}
                        {elementType === "POI"
                          ? "places to visit"
                          : "things to do"}{" "}
                        available.
                      </span>
                      
                    </EmptyMsg>
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
                      <GetInTouchContainer className="">
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
                            <span className="">Get in touch!</span>
                          </div>
                        </Button>
                      </GetInTouchContainer>
                    )}
                  </div>
                )
              ) : (
                <PoiListSkeleton />
              )}
            </>
          </div>
          {showCalender && (
            <div
              className="fixed bottom-0 w-full bg-white shadow-2xl drop-shadow-3xl p-[16px] rounded-lg space-y-5 text-sm z-[1091]"
              ref={calendarRef}
            >
              <div className="font-medium text-[14px]">Select Days</div>
              {[...Array(props.duration)].map((_, i) => {
                const baseDateStr = props?.mercuryItinerary
                  ? props?.date
                  : convertToISODate(props?.date);

                const baseDate = new Date(baseDateStr);
                const currentDate = new Date(baseDate);
                currentDate.setDate(currentDate.getDate() + i);

                // Pad function to ensure two digits
                const pad = (n) => (n < 10 ? `0${n}` : n);

                const year = currentDate.getFullYear();
                const month = pad(currentDate.getMonth() + 1);
                const day = pad(currentDate.getDate());

                const dateString = `${day}/${month}/${year}`; // Keep for onClick value

                // Format date for display as "Aug 7, 2025"
                const displayDate = getHumanDate(dateString);

                return (
                  <div
                    key={i}
                    className="cursor-pointer"
                    onClick={() => setStartDate(dateString)}
                  >
                    <span className="font-bold text-[14px]">
                      {displayDate + " | "}
                    </span>
                    <span>Day {i + 1}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="h-[100vh]">
          <OptionsContainer className="px-2 center-div space-y-5">
            {error}
          </OptionsContainer>
        </div>
      )}

      {/* {!isDesktop && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={handleCloseDrawer}
          />
        </FloatingView>
      )} */}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    itineraryActivities: state.itineraryActivities,
    itinerary_id: state.ItineraryId,
    plan: state.Plan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ActivityAddDrawer);
