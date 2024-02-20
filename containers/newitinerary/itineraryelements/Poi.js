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
import axiosaxtivitiesinstance from "../../../services/poi/reccommendedactivities";
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
  color: #01202b;
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
  span {
    font-weight: 600;
    cursor: pointer;
    font-size: 0.875rem;
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

const RatingContainer = styled.div`
  margin-top: 0.3rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  span {
    font-size: 0.85rem;
    font-weight: 300;
    color: #727272;
  }
`;

const SectionOneText = styled.span``;

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  margin-top: 1rem;

  grid-column-gap: 0.5rem;
`;

const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
`;

const Heading = styled.span`
  margin-bottom: 0rem;
  margin-right: 0.25rem;
  font-weight: 500;
  line-height: 1;
`;

const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;

const BoldTags = styled.p`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.25rem;
`;

const ColorTags = styled.span`
  border-style: solid;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1px;

  font-weight: 400;
  padding: 0.25rem 0.5rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
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

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const fetchData = (showMore = false) => {
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
                  // loginModal={showLoginModal}
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
  };

  useEffect(() => {
    if (props.city_id && showDrawer) {
      setFetchingPoi(true);
      setShowDrawer(true);
      fetchData();
    }
  }, [showDrawer, elementType, SelectedExprience, debouncedSearch]);

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
      element.style.borderColor = "#f8e000";
      element.style.boxShadow = "0 0 10px #f8e000";
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
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
    // props.getPaymentHandler();
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

  return (
    <Container>
      {/* <div>{props.time}</div> */}
      <div
        id={`${props?.day_slab_index}-${props?.data?.element_index}-${props?.activity_data.id}`}
        className="group flex flex-row items-center p-2"
      >
        <div className="bg-white w-[6rem]" onClick={() => setShow(true)}>
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
                className="flex flex-row w-full  justify-start items-center"
                style={{ lineHeight: "1" }}
              >
                <div
                  className="text-xl font-normal cursor-pointer"
                  onClick={() => setShow(true)}
                >
                  {props.heading}
                </div>
                <div
                  onClick={() => setShowDrawer(true)}
                  className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                >
                  <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div
                  className="font-normal border-2 border-[#9F9F9F] rounded-md px-2 py-[1px] mt-1    block  bg-white text-[#9F9F9F]"
                  // onClick={() => setViewMore(!viewMore)}
                >
                  {props?.activity_data &&
                  props?.activity_data?.activity &&
                  props?.activity_data?.activity?.id
                    ? "ACTIVITY"
                    : "Self Exploration"}
                </div>
                {props?.poi?.rating && (
                  <RatingContainer>
                    {/* <StarRating initialRating={4}></StarRating> */}
                    <div>{_getStars(props?.poi?.rating)}</div>
                    <span>
                      {props.poi.rating}{" "}
                      {props.poi.user_ratings_total
                        ? ` · ${props.poi.user_ratings_total} Google reviews`
                        : ""}
                    </span>
                  </RatingContainer>
                )}
              </div>
            </div>
          </div>
          <TextContainer>
            <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
              {props.text}
            </div>
            <MoreIcon onClick={() => setShow(true)}>
              <span>...More</span>
              <MdNavigateNext
                style={{ fontSize: "1.3rem", marginTop: "0.1rem" }}
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
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={() => setShowDrawer(false)}
        mobileWidth={"100vw"}
        width="50vw"
      >
        <div className="sticky px-2 top-0 bg-white z-[900] flex flex-col gap-3 py-4 pb-1 justify-start items-start mx-auto w-[98%]">
          <div className="flex flex-row gap-3 my-0 justify-start items-center">
            <IoMdClose
              onClick={() => setShowDrawer(false)}
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

          <div className="flex flex-row justify-between mt-0">
            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 text-sm font-normal">Experience Types</div>
              <FiltersContainer>
                {EXPERIENCE_FILTERS_BOX.map((currentfilter, i) => (
                  <button
                    onClick={() => {
                      if (SelectedExprience !== i) SetSelectedExprience(i);
                      else SetSelectedExprience(-1);
                    }}
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                      SelectedExprience == i
                        ? "text-white border-0 bg-black "
                        : "border-2 bg-white text-black"
                    } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                    key={i}
                  >
                    {currentfilter.display}
                  </button>
                ))}
              </FiltersContainer>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <div>
              Showing {optionsJSX.length}
              {elementType === "POI" ? " attractions" : " activities"}
              {totalResults ? ` out of ${totalResults}` : null}
              {props?.data?.activity_data?.city?.name
                ? ` in ${props?.data?.activity_data?.city?.name}`
                : null}
            </div>
            <div className="lg:w-[50%] md:w-[50%] flex flex-row items-center relative">
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
                className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700]"
              ></input>
            </div>
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
              {optionsJSX.map((option, index) => option)}
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
            <div className="flex flex-col">
              <EmptyMsg className="flex flex-row items-start px-1">
                <BiErrorCircle className="" />
                <span className="">
                  Oops, it looks like there are no{" "}
                  {elementType === "POI" ? "places to visit" : "things to do"}{" "}
                  available.
                </span>
              </EmptyMsg>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(ItineraryPoiElement);
