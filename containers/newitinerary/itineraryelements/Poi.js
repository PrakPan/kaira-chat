import styled from "styled-components";
import { useState, useEffect } from "react";
import ImageLoader from "../../../components/ImageLoader";
import Button from "../../../components/ui/button/Index";
import { ITINERARY_ELEMENT_TYPES } from "../../../services/constants";
import { newDayContainerTextpadding } from "../../itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdEdit, MdNavigateNext } from "react-icons/md";
import Drawer from "../../../components/ui/Drawer";
import { IoMdClose } from "react-icons/io";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import axiosactivitiesinstance, { activtySearch } from "../../../services/poi/reccommendedactivities";
import axiositineraryeditinstance from "../../../services/itinerary/edit";
import PoiList from "./PoiList";
import PoiListSkeleton from "./PoiListSkeleton";
import LogInModal from "../../../components/modals/Login";
import { Navigation } from "../../../components/NewNavigation";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { EXPERIENCE_FILTERS_BOX } from "../../../services/constants";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdSearch } from "react-icons/io";
import useDebounce from "../../../hooks/useDebounce";
import { logEvent } from "../../../services/ga/Index";
import { getDate } from "../../../helper/DateUtils";
import NewActivityBooking from "./NewActivityBooking";
import Filters from "../../../components/drawers/poiDetails/filters/Filters";


const padding = {
  initialLeft: "60px",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  padding: 0px 0px 0px 0px;
  color: #0b1220;
`;

export const TInfoContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    & > div {
      padding-left: ${padding.initialLeft};
      width: 100%;
    }
  }
`;

const TextContainer = styled.div`
  position: relative;
`;

const MoreIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0px;
  transform: translate(0, 7%);
  right: 0;
  background: white;
  padding-left: 10px;
`;

const EmptyMsg = styled.div`
  margin-top: 5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
`;

const RatingContainer = styled.div`
  margin-top: 0.3rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  span {
    font-size: 0.85rem;
    font-weight: 300;
    color: #445069;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const ItineraryPoiElement = (props) => {
  const [show, setShow] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [fetchingPoi, setFetchingPoi] = useState(false);
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [SelectedExprience, SetSelectedExprience] = useState(-1);
  const [selectSearch, setSelectedSearch] = useState("");
  const debouncedSearch = useDebounce(selectSearch);
  const [elementType, setElementType] = useState("POI");
  const [offSet, setOffSet] = useState(0);
  const items = [
    { id: 1, label: "Places To Visit", link: "" },
    { id: 2, label: "Things To Do", link: "" },
  ];
  const [showDynamicfilters, setShowDynamicfilters] = useState(false);
  const [filterState, setFilterState] = useState({
    recommended_only: false,
    rating: [],
    category: [],
    tour_type: [],
    guide: [],
    pax: {
      number_of_travelers: props.plan?.number_of_adults,
      traveler_ages: Array(props.plan?.number_of_adults).fill(null),
    }
  })
  const [filtersObj, setFiltersObj] = useState({
    ratings: [1, 2, 3, 4, 5],
    category: [],
    tour_type: [],
    guide: [],
  });

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const fetchPois = (showMore = false) => {
    const added_activities = props.itineraryActivities?.map((element, index) => {
      return {
        id:
          element.activity?.activity_data?.activity?.id ||
          element.activity?.activity_data?.poi?.id,
        date: element.date,
      };
    });
    let ticketsCount = 1;
    if (props.payment && props.payment.meta_info) {
      ticketsCount =
        props.payment.meta_info.number_of_adults +
        props.payment.meta_info.number_of_children +
        props.payment.meta_info.number_of_infants;
    }

    axiosactivitiesinstance
      .post(`/?limit=30&offset=${offSet}`, {
        location: props?.city_id,
        duration: 10,
        element_type: elementType,
        experience_filters: EXPERIENCE_FILTERS_BOX[SelectedExprience]
          ? EXPERIENCE_FILTERS_BOX[SelectedExprience].actual
          : [],
        search_query: debouncedSearch,
        added_activities,
      })
      .then((res) => {
        if (res.data.results.length) {
          setTotalResults(res.data.count);
          let options = [];

          for (var i = 0; i < res.data.results.length; i++) {
            if (res.data.results[i].heading !== props.heading)
              options.push(
                <PoiList
                  key={i}
                  _updatePoiHandler={_updatePoiHandler}
                  selectedData={props.data}
                  setShowDrawer={setShowDrawer}
                  data={res.data.results[i]}
                  ticketsCount={ticketsCount}
                  setLoginModal={props.setShowLoginModal}
                ></PoiList>
              );
          }

          if (showMore) setOptionsJSX((prev) => [...prev, ...options]);
          else setOptionsJSX(options);

          if (res.data.next) {
            setShowMoreResults(true);
            setOffSet((prev) => prev + 30);
          } else {
            setShowMoreResults(false);
            setOffSet(0);
          }
        } else {
          setOptionsJSX([]);
          setTotalResults(null);
        }
        setFetchingPoi(false);
      })
      .catch((err) => {
        setFetchingPoi(false);
      });
  }

  const setDynamicFilters = (filters) => {
    setFiltersObj(prev => ({
      ...prev,
      category: filters?.category,
      tour_type: filters?.tour_type,
      guide: filters?.guide
    }))
  }

  const fetchActivities = (showMore = false) => {
    const requestData = {
      city: props?.city_id,
      start_date: getDate(props.date),
      number_of_travelers: filterState.pax.number_of_travelers,
      traveler_ages: filterState.pax.traveler_ages,
      filter_by: {
        name: debouncedSearch,
        recommended_only: filterState.recommended_only,
        rating: filterState.rating,
        category: filterState.category && filterState.category[0] !== "All" ? filterState.category : null,
        tour_type: filterState.tour_type && filterState.tour_type[0] !== "All" ? filterState.tour_type : null,
        guide: filterState.guide && filterState.guide[0] !== "All" ? filterState.guide : null
      },
      sort_by: {
        // no sorting filters added yet.
      }
    }
    activtySearch
      .post(`/?limit=30&offset=${offSet}`, requestData)
      .then((res) => {
        if (res.data?.data?.activities?.length) {
          setTotalResults(res.data.results);
          if (res.data?.data?.filter_by) {
            setDynamicFilters(res.data.data.filter_by)
          }

          let options = [];

          for (var i = 0; i < res.data.data.activities.length; i++) {
            options.push(
              <NewActivityBooking
                key={i}
                activityAddDrawer
                _updatePoiHandler={_updatePoiHandler}
                setShowDrawer={setShowDrawer}
                data={res.data.data.activities[i]}
                setLoginModal={props.setShowLoginModal}
                date={props.date}
                getAccommodationAndActivitiesHandler={props.getAccommodationAndActivitiesHandler}
              ></NewActivityBooking>
            );
          }

          if (showMore) setOptionsJSX((prev) => [...prev, ...options]);
          else setOptionsJSX(options);

          if (res.data?.next) {
            setShowMoreResults(true);
            setOffSet((prev) => prev + 30);
          } else {
            setShowMoreResults(false);
            setOffSet(0);
          }
        } else {
          setOptionsJSX([]);
          setTotalResults(null);
        }
        setFetchingPoi(false);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        setFetchingPoi(false);
      });
  }

  const fetchData = (showMore = false) => {
    if (elementType === "POI") {
      fetchPois(showMore);
    } else {
      fetchActivities(showMore);
    }
  };

  useEffect(() => {
    if (props.city_id && showDrawer) {
      setFetchingPoi(true);
      setShowDrawer(true);
      fetchData();
    }
  }, [showDrawer, elementType, SelectedExprience, debouncedSearch, filterState]);

  useEffect(() => {
    setSelectedSearch("");
    setOptionsJSX([]);
  }, [showDrawer]);

  const searchHandler = (e) => {
    if (e.target.id === "icon" && selectSearch.trim().length > 0) {
      fetchData();
    } else {
      setSelectedSearch(e.target.value);
      setOffSet(0);
    }
  };

  const handleClearSearch = () => {
    setSelectedSearch("");
  };

  const setFocus = (dayIndex, elementIndex, activityId) => {
    const element = document.getElementById(
      `${dayIndex}-${elementIndex}-${activityId}`
    );
    let timeoutId;
    if (element) {
      element.scrollIntoView({ block: "center" });
      element.style.borderWidth = "1px";
      element.style.borderRadius = "10px";
      element.style.borderColor = "#f7e700";
      element.style.boxShadow = "0 0 10px #f7e700";
      timeoutId = setTimeout(() => {
        element.style.borderColor = "";
        element.style.borderWidth = "";
        element.style.borderRadius = "";
        element.style.boxShadow = "";
      }, 4000);
    }

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  };

  const _updatePoiHandler = (poi) => {
    axiositineraryeditinstance
      .post(
        "/",
        {
          itinerary_id: props.itinerary_id,
          day_slab_index: props.day_slab_index,
          slab_element_index: props.slab_elements_index,

          element_data: {
            ...poi,
            element_index: props.data.element_index,
            keys: ["icon", "heading", "text", "activity_data", "meta"],
            element_type: ITINERARY_ELEMENT_TYPES.activity,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        props.setItinerary(res.data);
        props.getAccommodationAndActivitiesHandler();
        props.openNotification({
          text: "Your Itinerary updated successfully!",
          heading: "Success!",
          type: "success",
        });
        setTimeout(() => {
          setFocus(
            props.day_slab_index,
            props.data.element_index,
            poi.activity_data.id
          );
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
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
      });

    logEvent({
      action: "Change_Activity",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Select",
        event_action: "",
      },
    });
  };

  const _handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const ClickHandler = (child) => {
    setOffSet(0);
    if (child === "Things To Do") {
      setElementType("Activity");
    } else {
      setElementType("POI");
    }
  };

  const _getStars = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar style={{ fontSize: "0.85rem" }} />);
    }
    if (Math.floor(rating) < rating)
      stars.push(<FaStarHalfAlt style={{ fontSize: "0.85rem" }} />);

    return (
      <div
        style={{ color: "#ffa500", marginBottom: "0.1rem" }}
        className="flex flex-row"
      >
        {stars}
      </div>
    );
  };

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop >= scrollHeight) {
      if (showMoreResults) fetchData(true);
    }
  };

  const handleEditActivity = (label, isEdit) => {
    if (isEdit) setShowDrawer(true);
    else setShow(true);

    logEvent({
      action: "View_Activity",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  return (
    <Container>
      <div
        id={`${props?.day_slab_index}-${props?.data?.element_index}-${props?.activity_data.id}`}
        className="group flex flex-row items-center p-2"
      >
        <div
          className="bg-white w-[6rem]"
          onClick={() => handleEditActivity(props?.heading, false)}
        >
          {props.image && props.image !== "media/icons/default/activity.svg" ? (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log("")}
              width="8rem"
              leftalign
              widthmobile="6rem"
              url={props.image}
              noLazy
            ></ImageLoader>
          ) : (
            <div
              style={{
                width: "6rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ImageLoader
                dimensions={{ width: 300, height: 300 }}
                dimensionsMobile={{ width: 300, height: 300 }}
                borderRadius="8px"
                hoverpointer
                onclick={() => console.log("")}
                width="3.25rem"
                height="3.25rem"
                leftalign
                widthmobile="6rem"
                url={"media/icons/general/dice.png"}
                noLazy
              ></ImageLoader>
            </div>
          )}
        </div>

        <div style={{ paddingLeft: newDayContainerTextpadding.initialLeft }}>
          <div className="w-full ">
            <div className="w-full">
              <div
                className="flex flex-row w-full justify-start items-center"
                style={{ lineHeight: "1" }}
              >
                <div
                  className="ttw-type-h3 font-normal cursor-pointer"
                  onClick={() => handleEditActivity(props?.heading, false)}
                >
                  {props.heading}
                </div>
                <div
                 // onClick={() => handleEditActivity(props?.heading, true)}
                  className="cursor-pointer min-w-max ttw-type-h4 w-4 h-4 pl-3 transition-transform duration-300 ase-in-out group-hover:scale-110 active:scale-90"
                >
                  {/* <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" /> */}
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <span className="ttw-type-small bg-[#eef2fb] text-[#1a2436] px-2 py-0.5 rounded-full mt-1">
                  {props?.activity_data &&
                    props?.activity_data?.activity &&
                    props?.activity_data?.activity?.id
                    ? "ACTIVITY"
                    : "Self Exploration"}
                </span>
                {props?.poi?.rating ? (
                  <RatingContainer>
                    <div>{_getStars(props?.poi?.rating)}</div>
                    <span>{props.poi.rating} .</span>
                    <span className="underline">
                      {props.poi.user_ratings_total
                        ? `${props.poi.user_ratings_total} Google reviews`
                        : ""}
                    </span>
                  </RatingContainer>
                ) : props?.activity?.rating ? (
                  <RatingContainer>
                    <div>{_getStars(props?.activity?.rating)}</div>
                    <span>{props.activity.rating} .</span>
                    <span className="underline">
                      {props.activity.user_ratings_total
                        ? `${props.activity.user_ratings_total} user reviews`
                        : ""}
                    </span>
                  </RatingContainer>
                ) : null}
              </div>
            </div>
          </div>
          <TextContainer>
            <div className="pt-1 line-clamp-3 font-normal ttw-type-body mb-3">
              {props.text}
            </div>
            <MoreIcon onClick={() => setShow(true)}>
              <span className="ttw-type-small font-500 text-[#0b1220] underline cursor-pointer">...More</span>
              <MdNavigateNext
                style={{ fontSize: "1.3rem", marginTop: "0.1rem" }}
                className="text-[#0b1220]"
              />
            </MoreIcon>
          </TextContainer>
        </div>
      </div>

      <POIDetailsDrawer
        itineraryDrawer
        show={show}
        iconId={props?.poi?.id ? props?.poi?.id : props?.activity_data?.id}
        ActivityiconId={props?.activity?.id}
        handleCloseDrawer={handleCloseDrawer}
        name={props.heading}
        image={props.image}
        text={props.text}
        Topheading={"Select Our Point Of Interest"}
      />

      {showLoginModal && (
        <div>
          <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
        </div>
      )}

      <Drawer
        show={showDrawer}
        anchor={"right"}
        backdrop
        bgColor="#fafaf5"
        style={{ zIndex: props.zIndex || 1501 }}
        className=""
        onHide={() => setShowDrawer(false)}
        mobileWidth={"100%"}
        width="50%"
      >
        <div className="sticky px-6 max-ph:px-4 top-0 bg-[#fafaf5] z-[900] flex flex-col gap-3 py-4 pb-1 justify-start items-start w-full">
          <div className="flex flex-row max-ph:flex-col gap-3 my-0 justify-between items-center max-ph:items-start w-full">
            <div className="flex flex-row gap-3 items-center">
              <IoMdClose
                onClick={() => setShowDrawer(false)}
                className="hover-pointer text-[#0b1220]"
                style={{
                  fontSize: "1.75rem",
                  textAlign: "right",
                }}
              ></IoMdClose>
              <div className="line-clamp-1 ttw-type-h2 font-semibold text-[#0b1220]">
                Replacing {props.heading}
              </div>
            </div>

            <div className="md:w-[50%] max-ph:w-full flex flex-row items-center relative">
              <IoMdSearch
                id={"icon"}
                onClick={searchHandler}
                className="absolute cursor-pointer left-4 ttw-type-h2 text-[#445069]"
              />

              <input
                type="text"
                value={selectSearch}
                onChange={searchHandler}
                placeholder={`Search ${elementType === "POI" ? "attractions" : "activities"
                  }`}
                className="w-full flex items-center ttw-type-body text-[#0b1220] border border-[#ececec] rounded-xl px-5 py-2 focus:outline-none focus:border-[#f7e700]"
              ></input>
            </div>
          </div>

          {elementType === "POI" ? (
            <div className="flex flex-row justify-between mt-0">
              <div className="flex flex-col justify-start items-baseline">
                <div className="mb-2 ttw-type-small text-[#445069]">Experience Types</div>
                <FiltersContainer>
                  {EXPERIENCE_FILTERS_BOX.map((currentfilter, i) => (
                    <button
                      onClick={() => {
                        if (SelectedExprience !== i) SetSelectedExprience(i);
                        else SetSelectedExprience(-1);
                      }}
                      className={`flex ttw-type-small cursor-pointer justify-center items-center transition-colors rounded-full px-2 py-0.5 ${SelectedExprience == i
 ? "bg-black text-white border border-black"
 : "bg-[#f4f3ec] text-[#445069] border border-[#ececec] hover:bg-[#eef2fb]"
 }`}
                      key={i}
                    >
                      {currentfilter.display}
                    </button>
                  ))}
                </FiltersContainer>
              </div>
            </div>
          ) : (
            <Filters
              filters={filtersObj}
              filterState={filterState}
              showDynamicfilters={showDynamicfilters}
              setShowDynamicfilters={setShowDynamicfilters}
              setFilterState={setFilterState} />
          )}

          <div className="flex flex-row items-center justify-between w-full">
            <div className="ttw-type-small text-[#445069]">
              Showing {optionsJSX.length}
              {elementType === "POI" ? " attractions" : " activities"}
              {totalResults ? ` out of ${totalResults}` : null}
              {props?.data?.activity_data?.city?.name
                ? ` in ${props?.data?.activity_data?.city?.name}`
                : null}
            </div>

            {elementType !== "POI" && (
              <button
                onClick={() => setShowDynamicfilters(true)}
                className="ttw-btn-secondary whitespace-nowrap ttw-type-body ml-2">
                More filters
              </button>
            )}

          </div>

          <Navigation
            items={items}
            BarName="TabsName"
            ClickHandler={ClickHandler}
            selectedItem={
              elementType === "POI" ? `${items[0].id}` : `${items[1].id}`
            }
          />
        </div>

        {!fetchingPoi ? (
          optionsJSX.length ? (
            <div
              onScroll={handleScroll}
              className="flex flex-col items-center mb-3 h-[100vh] overflow-y-scroll px-6 max-ph:px-4 pb-24"
            >
              {optionsJSX.map((option, index) => option)}

              {selectSearch !== "" ? (
                <button
                  onClick={() => handleClearSearch()}
                  className="w-fit mt-4 py-2 px-4 rounded-xl border border-[#ececec] ttw-type-small font-500 text-[#0b1220] hover:bg-[#f4f3ec] transition-colors"
                >
                  Show All
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <EmptyMsg className="flex flex-row items-start px-1 ttw-type-small text-[#445069]">
                <BiErrorCircle className="text-[#445069]" />
                <span className="">
                  Oops, it looks like there are no{" "}
                  {elementType === "POI" ? "places to visit" : "things to do"}{" "}
                  available.
                </span>
              </EmptyMsg>
              {debouncedSearch !== "" ? (
                <button
                  onClick={() => handleClearSearch()}
                  className="w-fit mt-4 py-2 px-4 rounded-xl border border-[#ececec] ttw-type-small font-500 text-[#0b1220] hover:bg-[#f4f3ec] transition-colors"
                >
                  Show All
                </button>
              ) : (
                <GetInTouchContainer>
                  <button
                    onClick={() => props._GetInTouch()}
                    className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <ImageLoader
                      dimensions={{ height: 50, width: 50 }}
                      dimensionsMobile={{ height: 50, width: 50 }}
                      height={"20px"}
                      width={"20px"}
                      leftalign
                      url={"media/icons/login/customer-service-black.png"}
                    />{" "}
                    <span>Get in touch!</span>
                  </button>
                </GetInTouchContainer>
              )}
            </div>
          )
        ) : (
          <PoiListSkeleton />
        )}

        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={() => setShowDrawer(false)}
        />
      </Drawer>
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    itineraryActivities: state.itineraryActivities,
    token: state.auth.token,
    plan: state.Plan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ItineraryPoiElement);
