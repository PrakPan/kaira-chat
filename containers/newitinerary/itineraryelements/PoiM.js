import { useState, useEffect, useRef } from "react";
import ImageLoader from "../../../components/ImageLoader";
import Button from "../../../components/ui/button/Index";
import {
  EXPERIENCE_FILTERS_BOX,
  ITINERARY_ELEMENT_TYPES,
} from "../../../services/constants";
import StarRating from "../../../components/StarRating";
import { MdEdit, MdNavigateNext } from "react-icons/md";
import Drawer from "../../../components/ui/Drawer";
import { TbArrowBack } from "react-icons/tb";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import axiosaxtivitiesinstance, { activtySearch } from "../../../services/poi/reccommendedactivities";
import axiositineraryeditinstance from "../../../services/itinerary/edit";
import PoiList from "./PoiList";
import PoiListSkeleton from "./PoiListSkeleton";
import LogInModal from "../../../components/modals/Login";
import { Navigation } from "../../../components/NewNavigation";
import { IoMdClose } from "react-icons/io";
import { FaFilter, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ButtonYellow from "../../../components/ButtonYellow";
import useMediaQuery from "../../../hooks/useMedia";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { BiErrorCircle } from "react-icons/bi";
import { IoMdSearch } from "react-icons/io";
import styled from "styled-components";
import useDebounce from "../../../hooks/useDebounce";
import { logEvent } from "../../../services/ga/Index";
import { getDate } from "../../../helper/DateUtils";
import Filters from "../../../components/drawers/poiDetails/filters/Filters";

const GridContainer = styled.div`
  display: grid;

  grid-template-columns: ${(props) =>
    props.image ? "1.6fr 2.5fr" : "44px auto"};
  grid-column-gap: ${(props) => (props.image ? "0.5rem" : "0")};
`;

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

const GridResponsive = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
`;

const MoreIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const RatingContainer = styled.div`
  margin-top: 0.4rem;
  span {
    font-size: 0.75rem;
    font-weight: 300;
    color: #727272;
  }
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

const ItineraryPoiElementM = (props) => {
  const [show, setShow] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showFilter, setshowFilter] = useState(false);
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
  const drawerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const items = [
    { id: 1, label: "Point of Interest", link: "POIS" },
    { id: 2, label: "Activities", link: "Activitiess" },
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

    axiosaxtivitiesinstance
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

  const searchHandler = (e) => {
    if (e.target.id === "icon" && selectSearch.trim().length > 0) {
      fetchData();
    } else {
      setSelectedSearch(e.target.value);
      setOffSet(0);
    }
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const setFocus = (dayIndex, elementIndex, activityId) => {
    const element = document.getElementById(
      `${dayIndex}-${elementIndex}-${activityId}`
    );
    element.scrollIntoView({ block: "center" });
    element.style.borderWidth = "1px";
    element.style.borderRadius = "10px";
    element.style.borderColor = "#f8e000";
    element.style.boxShadow = "0 0 10px #f8e000";
    const timeoutId = setTimeout(() => {
      element.style.borderColor = "";
      element.style.borderWidth = "";
      element.style.borderRadius = "";
      element.style.boxShadow = "";
    }, 4000);

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
  };

  const _handleLoginClose = () => {
    setShowLoginModal(false);
  };

  function Poi_activities(activity) {
    setFetchingPoi(true);
    if (props.city_id) setShowDrawer(true);
    setElementType(activity.id ? "Activity" : "POI");
  }

  const ClickHandler = (child) => {
    setOffSet(0);
    if (child == "Activities") {
      setElementType("Activity");
    } else {
      setElementType("POI");
    }
  };

  const handleClearSearch = () => {
    setSelectedSearch("");
  };

  const _getStars = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar style={{ fontSize: "0.75rem" }} />);
    }
    if (Math.floor(rating) < rating)
      stars.push(<FaStarHalfAlt style={{ fontSize: "0.75rem" }} />);

    return (
      <div
        style={{ color: "#ffa500", marginBottom: "-0.2rem" }}
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
    if (isEdit) Poi_activities(props.activity);
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
    <div
      id={`${props?.day_slab_index}-${props?.data?.element_index}-${props?.activity_data.id}`}
      className="font-lexend p-2"
    >
      <GridContainer
        image={
          props.image && props.image !== "media/icons/default/activity.svg"
        }
      >
        <div onClick={() => handleEditActivity(props?.heading, false)}>
          {props.image && props.image !== "media/icons/default/activity.svg" ? (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onClick={() => setShow(true)}
              width="8rem"
              leftalign
              widthmobile="100%"
              url={props.image}
              noLazy
            ></ImageLoader>
          ) : (
            <div style={{ display: "flex", justifyContent: "left" }}>
              <ImageLoader
                dimensions={{ width: 300, height: 300 }}
                dimensionsMobile={{ width: 300, height: 300 }}
                borderRadius="8px"
                hoverpointer
                onClick={() => setShow(true)}
                width="3.25rem"
                widthmobile="30px"
                leftalign
                url={"media/icons/general/dice.png"}
                noLazy
              ></ImageLoader>
            </div>
          )}
        </div>
        <div>
          <div className=" " style={{ lineHeight: "1" }}>
            <span className="inline text-[1.2rem]">
              <span
                onClick={() => handleEditActivity(props?.heading, false)}
                className="inline cursor-pointer"
              >
                {props.heading}
              </span>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditActivity(props?.heading, true);
                }}
                className="inline-block  cursor-pointer min-w-max text-lg w-4 h-4 pl-2 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
              >
                <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
              </div>
            </span>
          </div>

          {props?.rating && <StarRating initialRating={4}></StarRating>}
          {props?.poi?.rating && (
            <RatingContainer>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {_getStars(props.poi.rating)}{" "}
                <span style={{ marginBlock: "-0.15rem -0.3rem" }}>
                  {props.poi.rating}
                </span>
              </div>
              <span>
                {props.poi.user_ratings_total
                  ? `${props.poi.user_ratings_total} Google reviews`
                  : ""}
              </span>
            </RatingContainer>
          )}
          <div className="flex flex-row">
            <div className="font-normal border-2 lg:text-base text-sm border-[#9F9F9F] rounded-md px-1 py-[2px] mt-2    block  bg-white text-[#9F9F9F]">
              {props.activity_data &&
                props.activity_data.activity &&
                props.activity_data.activity.id
                ? "ACTIVITY"
                : "Self Exploration"}
            </div>
          </div>

          {props.poi ? <div></div> : null}
        </div>
      </GridContainer>
      <div className={`pt-2 text-sm font-[350] line-clamp-3`}>{props.text}</div>
      <MoreIcon onClick={() => setShow(true)}>
        <span>More</span>
        <MdNavigateNext style={{ fontSize: "1.3rem", marginTop: "0.1rem" }} />
      </MoreIcon>
      {showLoginModal && (
        <div>
          <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
        </div>
      )}
      <POIDetailsDrawer
        itineraryDrawer
        width={"100%"}
        show={show}
        iconId={props?.poi?.id ? props?.poi?.id : props?.activity_data?.id}
        ActivityiconId={props?.activity?.id}
        handleCloseDrawer={handleCloseDrawer}
        name={props.heading}
        image={props.image}
        text={props.text}
        Topheading={"Back To Itinerary"}
      />

      <Drawer
        ref={drawerRef}
        show={showDrawer}
        anchor={"right"}
        backdrop
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={() => setShowDrawer(false)}
      >
        <div className=" sticky px-2 top-0 bg-white z-[900] flex flex-col gap-3 my-4 justify-start items-start mx-auto w-[95%]">
          <div className="flex flex-row gap-3 my-0 justify-start items-center">
            <IoMdClose
              onClick={(e) => {
                e.stopPropagation();
                setShowDrawer(false);
              }}
              className="hover-pointer"
              style={{
                fontSize: "1.75rem",
                textAlign: "right",
              }}
            ></IoMdClose>
            <div className="line-clamp-1 text-2xl font-normal ">
              Replacing {props.heading}
            </div>
          </div>
          <div className="w-full flex flex-row items-center relative">
            <IoMdSearch
              id={"icon"}
              onClick={searchHandler}
              className="absolute cursor-pointer left-4 text-2xl"
            />

            <input
              type="text"
              value={selectSearch}
              onChange={searchHandler}
              placeholder={`Search ${elementType === "POI" ? "attractions" : "activities"
                }`}
              className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700]"
            ></input>
          </div>

          {elementType !== "POI" && (
            <Filters
              filters={filtersObj}
              filterState={filterState}
              showDynamicfilters={showDynamicfilters}
              setShowDynamicfilters={setShowDynamicfilters}
              setFilterState={setFilterState} />
          )}

          <div>
            Showing {optionsJSX.length}
            {elementType === "POI" ? " attractions" : " activities"}
            {totalResults ? ` out of ${totalResults}` : null}
            {props?.data?.activity_data?.city?.name
              ? ` in ${props?.data?.activity_data?.city?.name}`
              : null}
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
              className="flex flex-col items-center mb-3 h-[100vh] overflow-y-scroll"
            >
              {optionsJSX}{" "}

              {selectSearch !== "" ? (
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
          ) : (
            <div className="flex flex-col items-center gap-3">
              <EmptyMsg className="flex flex-row items-start px-1">
                <BiErrorCircle className="" />
                <span className="">
                  Oops, it looks like there are no{" "}
                  {elementType === "POI" ? "places to visit" : "things to do"}{" "}
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
                        url={"media/icons/login/customer-service-black.png"}
                      />{" "}
                      <span>Get in touch!</span>
                    </div>
                  </Button>
                </GetInTouchContainer>
              )}
            </div>
          )
        ) : (
          <PoiListSkeleton name={"Activity"} />
        )}
      </Drawer>

      <Drawer
        show={showFilter}
        anchor={"right"}
        backdrop
        style={{ zIndex: 1503 }}
        className="font-lexend"
        onHide={() => setshowFilter(false)}
      >
        <div className="w-[100vw] px-2 h-[95vh] flex flex-col gap-3 my-4 justify-between items-start mx-auto ">
          <div className="w-[100%]">
            <div className="flex flex-row gap-3 my-0 justify-start items-center">
              <IoMdClose
                onClick={() => setshowFilter(false)}
                className="hover-pointer"
                style={{
                  fontSize: "1.75rem",
                  textAlign: "right",
                }}
              ></IoMdClose>
              <div className="text-2xl font-normal line-clamp-1">Filters</div>
            </div>

            <div className="flex w-[100%] flex-row justify-between mt-0">
              <div className="flex w-[100%] flex-col justify-start items-baseline">
                <div className="mb-2 text-sm font-normal mt-3">
                  Experience Types
                </div>
                <GridResponsive>
                  {EXPERIENCE_FILTERS_BOX.map((currentfilter, i) => (
                    <button
                      onClick={() => {
                        if (SelectedExprience !== i) SetSelectedExprience(i);
                        else SetSelectedExprience(-1);
                      }}
                      className={`flex  font-normal min-w-fit text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${SelectedExprience == i
                        ? "text-white border-0 bg-black "
                        : "border-2 bg-white text-black"
                        } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                      key={i}
                    >
                      {currentfilter.display}
                    </button>
                  ))}
                </GridResponsive>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-3 flex-row justify-between mt-0">
            <ButtonYellow
              primary={false}
              className="w-1/2 "
              onClick={() => setshowFilter(false)}
            >
              <div className="text-[#01202B] ">Cancel</div>
            </ButtonYellow>
            <ButtonYellow
              className="w-1/2"
              onClick={() => {
                setshowFilter(false);
              }}
            >
              <div className="text-[#01202B] ">Apply</div>
            </ButtonYellow>
          </div>
        </div>

        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={() => setShowDrawer(false)}
        />
      </Drawer>

      {!isDesktop && showDrawer && (
        <div className="absolute bottom-0 right-10 z-[1510]">
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={() => setShowDrawer(false)}
            />
          </FloatingView>
        </div>
      )}

      {!isDesktop && showDrawer && (
        <div className="absolute bottom-0 right-10 z-[1502]">
          <Floating>
            <FaFilter
              className="text-white"
              style={{ height: "18px", width: "18px" }}
              cursor={"pointer"}
              onClick={(e) => {
                if (elementType === "POI") {
                  setshowFilter(true);
                } else {
                  setShowDynamicfilters(true);
                }
              }}
            />
          </Floating>
        </div>
      )}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
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

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(ItineraryPoiElementM);
