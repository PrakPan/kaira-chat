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
import axiosaxtivitiesinstance from "../../../services/poi/reccommendedactivities";
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

const Container = styled.div``;

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;

  grid-template-columns: ${(props) =>
    props.image ? "1.6fr 2.5fr" : "44px auto"};
  grid-column-gap: ${(props) => (props.image ? "0.5rem" : "0")};
`;
const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: 500;
`;
const Heading = styled.span`
  margin-bottom: 0rem;
  margin-right: 0.25rem;
  font-weight: 400;
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
  // display: flex;
  // gap: 0.5rem;
  // align-items: center;
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
  const [showDrawerListData, setshowDrawerListData] = useState(false);
  const [showDrawerData, setShowDrawerData] = useState(false);
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
  const Experiences = [
    "Adventure",
    "Heritage",
    "Spiritual",
    "Hidden Gem",
    "Very popular",
  ];

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
      if (props.city_id) setShowDrawer(true);
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
        props.openNotification({
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
          type: "error",
        });
      });
  };

  const _handleLoginClose = () => {
    // props.getPaymentHandler();
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

  return (
    <Container
      id={`${props?.day_slab_index}-${props?.data?.element_index}-${props?.activity_data.id}`}
      className="font-lexend p-2"
    >
      <GridContainer
        image={
          props.image && props.image !== "media/icons/default/activity.svg"
        }
      >
        <div onClick={() => setShow(true)}>
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
                onClick={() => setShow(true)}
                className="inline cursor-pointer"
              >
                {props.heading}
              </span>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  Poi_activities(props.activity);
                }}
                className="inline-block  cursor-pointer min-w-max text-lg w-4 h-4 pl-2 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
              >
                <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
              </div>

              {/* <HiPencil className="text-lg min-w-max"></HiPencil> */}
            </span>
          </div>

          {props?.rating && <StarRating initialRating={4}></StarRating>}
          {props?.poi?.rating && (
            <RatingContainer>
              {/* <StarRating initialRating={4}></StarRating> */}
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
        // show={props.showDrawer.isOpen}
        itineraryDrawer
        width={"100%"}
        show={show}
        iconId={props?.poi?.id ? props?.poi?.id : props?.activity_data?.id}
        ActivityiconId={props?.activity?.id}
        // handleCloseDrawer={props.handleCloseDrawer}
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
        // zIndex='1501'
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
              placeholder={`Search ${
                elementType === "POI" ? "attractions" : "activities"
              }`}
              className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700]"
            ></input>
          </div>

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
        {/* <PoiListSkeleton /> */}
        {!fetchingPoi ? (
          // <POIDetails data={data} handleCloseDrawer={props.handleCloseDrawer} />
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
        <div className="w-[100vw] px-2 h-[95vh]    flex flex-col gap-3 my-4 justify-between items-start mx-auto ">
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
                      className={`flex  font-normal min-w-fit text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                        SelectedExprience == i
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
          {/* <Slide
              hideTime={4}
              onUnmount={() => setFloatingButtonView(!floatingButtonView)}
              isActive={floatingButtonView}
              direction={5}
              duration={2}
              xdistance={-50}
            > */}
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={() => setShowDrawer(false)}
            />
          </FloatingView>
          {/* </Slide> */}
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
                setshowFilter(true);
              }}
            />
          </Floating>
        </div>
      )}

      {/* {!ErrorNotDef(props.poi) ? (
        !ErrorNotDef(props.poi.tips) ? (
          <Tips tips={props.poi.tips}></Tips>
        ) : null
      ) : null} */}
    </Container>
  );
};

// export default ItineraryPoiElementM;
const mapStateToPros = (state) => {
  return {};
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
