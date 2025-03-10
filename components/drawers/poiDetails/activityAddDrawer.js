import { useEffect, useState } from "react";
import Drawer from "../../ui/Drawer";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import { Navigation } from "../../NewNavigation";
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
import Filters from "./filters/Filters";
import { FaFilter } from "react-icons/fa";


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

const items = [{ id: 1, label: "Things To Do", link: "Activities" }];

const ActivityAddDrawer = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [selectedExprience, setSelectedExprience] = useState(-1);
  const [elementType, setElementType] = useState("Activity");
  const [options, setOptions] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [selectSearch, setSelectedSearch] = useState(null);
  const debouncedSearch = useDebounce(selectSearch);
  const [loading, setLoading] = useState(true);
  const [offSet, setOffSet] = useState(0);
  const [showDynamicfilters, setShowDynamicfilters] = useState(false);
  const itineraryFilters = useSelector((state) => state.ItineraryFilters);
  const num_adults = itineraryFilters.occupancies.reduce((sum, item) => sum + item.num_adults, 0);
  const [filterState, setFilterState] = useState({
    recommended_only: false,
    rating: [],
    category: [],
    tour_type: [],
    guide: [],
    pax: {
      number_of_travelers: num_adults,
      traveler_ages: Array(num_adults).fill(null),
    }
  })
  const [filtersObj, setFiltersObj] = useState({
    ratings: [1, 2, 3, 4, 5],
    category: [],
    tour_type: [],
    guide: [],
  });

  useEffect(() => {
    if (props.showDrawer) {
      setLoading(true);
      fetchData();
    }
  }, [elementType, selectedExprience, props.showDrawer, debouncedSearch, filterState]);

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
            text: "There seems to be a problem, please try again!",
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
    setFiltersObj(prev => ({
      ...prev,
      category: filters?.category,
      tour_type: filters?.tour_type,
      guide: filters?.guide
    }))
  }

  function fetchData(showMore = false) {
    const requestData = {
      city: props?.cityID,
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
                _updatePoiHandler={_addActivityHandler}
                setShowDrawer={props?.setShowDrawer}
                data={res.data.data.activities[i]}
                setLoginModal={props.setShowLoginModal}
                date={props.date}
                getAccommodationAndActivitiesHandler={props.getAccommodationAndActivitiesHandler}
              ></NewActivityBooking>
            );
          }

          if (showMore) setOptions((prev) => [...prev, ...options]);
          else setOptions(options);

          if (res.data.next) {
            setShowMoreResults(true);
            setOffSet((prev) => prev + 30);
          } else {
            setShowMoreResults(false);
            setOffSet(0);
          }
        } else {
          setOptions([]);
          setTotalResults(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

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

  const navigationHandler = (child) => {
    if (child == "Things To Do") {
      setElementType("Activity");
    } else {
      setElementType("POI");
    }
  };

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (offsetHeight + scrollTop >= scrollHeight) {
      if (showMoreResults) fetchData(true);
    }
  };

  return (
    <Drawer
      show={props.showDrawer}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={() => props.setShowDrawer(false)}
      mobileWidth={"100vw"}
      width="50vw"
    >
      <div className="sticky px-2 top-0 bg-white z-[900] flex flex-col gap-3 py-4 pb-1 justify-start items-start mx-auto w-[98%]">
        <div className="flex flex-row gap-3 my-0 justify-between w-full items-center">
          <div className="flex flex-row gap-3 items-center">
            <IoMdClose
              onClick={() => props.setShowDrawer(false)}
              className="hover-pointer"
              style={{
                fontSize: "1.75rem",
                textAlign: "right",
              }}
            ></IoMdClose>
            <div className="line-clamp-1 text-2xl font-normal ">
              Adding activity in {props.cityName}
            </div>
          </div>

          {isDesktop && (
            <div className="md:w-[50%] flex flex-row items-center relative">
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
          )}
        </div>

        <Filters
          filters={filtersObj}
          filterState={filterState}
          showDynamicfilters={showDynamicfilters}
          setShowDynamicfilters={setShowDynamicfilters}
          setFilterState={setFilterState} />

        {!isDesktop && (
          <div className="absolute bottom-0 right-10 z-[1502]">
            <div className="fixed bottom-[10px] right-[10px] bg-[#01202b] rounded-full w-[50px] h-[50px] flex items-center justify-center">
              <FaFilter
                className="text-white"
                style={{ height: "18px", width: "18px" }}
                cursor={"pointer"}
                onClick={(e) => {
                  setShowDynamicfilters(true);
                }}
              />
            </div>
          </div>
        )}

        {!isDesktop && (
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
        )}

        <div className="flex flex-row items-center justify-between w-full">
          <div>
            Showing {options.length}
            {elementType === "POI" ? " attractions" : " activities"}
            {totalResults ? ` out of ${totalResults}` : null}
            {props?.cityName ? ` in ${props?.cityName}` : null}
          </div>

          {isDesktop && (
            <button
              onClick={() => setShowDynamicfilters(true)}
              className="ml-2 border-2 border-black w-fit px-2 py-1 rounded-full hover:bg-black hover:text-white transition-all">More filters</button>
          )}
        </div>

        <Navigation
          items={items}
          BarName="TabsName"
          ClickHandler={navigationHandler}
        />
      </div>

      {!loading ? (
        options.length ? (
          <div
            onScroll={handleScroll}
            className="flex flex-col items-center mb-3 h-[100vh] overflow-y-scroll"
          >
            {options}
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
                      url={"media/icons/login/customer-service-black.png"}
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
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    itineraryActivities: state.itineraryActivities,
    itinerary_id: state.ItineraryId,
    plan: state.Plan
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ActivityAddDrawer);
