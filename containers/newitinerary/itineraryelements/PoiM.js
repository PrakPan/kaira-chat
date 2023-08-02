import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { AiFillCar } from "react-icons/ai";
import ImageLoader from "../../../components/ImageLoader";
import Button from "../../../components/ui/button/Index";
import { ITINERARY_ELEMENT_TYPES } from "../../../services/constants";
import { HiPencil } from "react-icons/hi";
import Rating from "./Rating";
import Tips from "./Tips";
import StarRating from "../../../components/StarRating";
import { MdEdit, MdNavigateNext } from "react-icons/md";
import Drawer from "../../../components/ui/Drawer";
import { TbArrowBack } from "react-icons/tb";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import axiosaxtivitiesinstance from "../../../services/poi/reccommendedactivities";
import axiositineraryeditinstance from "../../../services/itinerary/edit";
import POIDetailsSkeleton from "../../../components/drawers/poiDetails/POIDetailsSkeleton";
import PoiList from "./PoiList";
import PoiListSkeleton from "./PoiListSkeleton";
import LogInModal from "../../../components/modals/Login";
import { Navigation } from "../../../components/NewNavigation";
import { IoMdClose } from "react-icons/io";
import { FaFilter, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ButtonYellow from "../../../components/ButtonYellow";
import useMediaQuery from "../../../hooks/useMedia";
import Slide from "../../../Animation/framerAnimation/Slide";
import ScrollVisibleHOC from "../../../helper/withScrollVisibility";
import MakeYourPersonalised from "../../../components/MakeYourPersonalised";

const Container = styled.div`
`;

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;

  grid-template-columns: ${(props) => (props.image ? "1.6fr 2.5fr" : "1fr")};
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
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 10px;

  cursor: pointer;
`;
const FloatingView = styled.div`
  position: fixed;

  bottom: 100px;
  background: #f7e700;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 10px;

  cursor: pointer;
`;
const GridResponsive = styled.div`
  display: grid;
  width: 90%;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;
const MoreIcon = styled.div`
display : flex;
justify-content : flex-end;
align-items : center;
`
const RatingContainer = styled.div`
  margin-top: 0.3rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  span {
    font-size: 0.75rem;
    font-weight: 300;
    color: #727272;
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [SelectedExprience, SetSelectedExprience] = useState();
  const [floatingButtonView, setFloatingButtonView] = useState(false);
  const items = [
    { id: 1, label: "Point of Interest", link: "POIS" },
    { id: 2, label: "Activities", link: "Activitiess" },
  ];
  const drawerRef = useRef(null);
  useEffect(() => {}, []);
  function ErrorNotDef(elem) {
    return elem === undefined || elem === null || !elem;
  }

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const _updatePoiHandler = (poi) => {
    // setUpdateLoadingState(true);

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
      })
      .catch((err) => {
        // setUpdateLoadingState(false);

        window.alert("There seems to be a problem, please try again!");
      });
  };
  const _handleLoginClose = () => {
    // props.getPaymentHandler();
    setShowLoginModal(false);
  };
  function Poi_activities(activity) {
    setFetchingPoi(true);
    if (props.city_id) setShowDrawer(true);
    axiosaxtivitiesinstance
      .post("/", {
        location: props.city_id,
        duration: 10,
        element_type: `${activity.id ? "Activity" : "POI"}`,
      })
      .then((res) => {
        if (res.data.length) {
          let options = [];

          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].heading !== props.heading)
              // if(res.data.results[i].name !== props.selectedBooking.name)
              options.push(
                <PoiList
                  setFloatingButtonView={setFloatingButtonView}
                  key={i}
                  _updatePoiHandler={_updatePoiHandler}
                  selectedData={props.data}
                  setShowDrawer={setShowDrawer}
                  getPaymentHandler={props.getPaymentHandler}
                  // _openPoiModal={_openPoiModal}
                  data={res.data[i]}
                  loginModal={showLoginModal}
                  setLoginModal={setShowLoginModal}
                  token={props.token}
                  // tailored_id={props.tailored_id}
                  // updateLoadingState={updateLoadingState}
                  // itinerary_id={
                  //   props.selectedBooking
                  //     ? props.selectedBooking.itinerary_id
                  //     : ''
                  // }
                ></PoiList>
              );
          }
          setOptionsJSX(options);
        } else {
          setOptionsJSX([]);
        }
        setFetchingPoi(false);
      })
      .catch((err) => {});
  }
  const Experiences = [
    "Adventure",
    "Heritage",
    "Spiritual",
    "Hidden Gem",
    "Very popular",
  ];
  const ClickHandler = (child) => {
    if (child == "Activities") {
      Poi_activities({ id: 3 });
    } else {
      Poi_activities();
    }
    console.log(child);
  };
  const isDesktop = useMediaQuery("(min-width:1148px)");

  const _getStars = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar style={{ fontSize: "0.75rem" }} />);
    }
    if (Math.floor(rating) < rating)
      stars.push(<FaStarHalfAlt style={{ fontSize: "0.75rem" }} />);

    return (
      <div
        style={{ color: "#ffa500", marginBottom: "0.1rem" }}
        className="flex flex-row"
      >
        {stars}
      </div>
    );
  };

  return (
    <Container onClick={() => setShow(true)} className="font-lexend">
      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
        <SectionOneText>{props.time}</SectionOneText>
        <AiFillCar
          className="text-xl"
          style={{ margin: '-2px 0  0 0.5rem' }}
        ></AiFillCar>
        {props.booking ? (
          <div
            style={{
              flexGrow: '1',
              justifyContent: 'flex-end',
              display: 'flex',
            }}
          >
            <Button
              borderRadius="8px"
              fontWeight="700"
              fontSize="12px"
              borderWidth="1.5px"
              padding="0.5rem 0.5rem"
              onclick={() => console.log('')}
            >
              View Booking
            </Button>
          </div>
        ) : null}
      </div> */}
      <GridContainer image={props.image}>
        {props.image ? (
          <ImageLoader
            dimensions={{ width: 250, height: 200 }}
            dimensionsMobile={{ width: 250, height: 200 }}
            borderRadius="8px"
            hoverpointer
            onclick={() => console.log("")}
            width="70%"
            leftalign
            widthmobile="100%"
            url={props.image}
          ></ImageLoader>
        ) : null}
        <div>
          <div className=" " style={{ lineHeight: "1" }}>
            <span className="inline text-[1.2rem]">
              <span className="inline ">{props.heading}</span>
              {!props.payment?.is_registration_needed &&
                props.city_id &&
                props.payment?.user_allowed_to_pay &&
                !props.payment.paid_user && (
                  <div
                    onClick={() => Poi_activities(props.activity)}
                    className="inline-block  cursor-pointer min-w-max text-lg w-4 h-4 pl-2 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                  >
                    <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                  </div>
                )}

              {/* <HiPencil className="text-lg min-w-max"></HiPencil> */}
            </span>
          </div>

          {props?.rating && <StarRating initialRating={4}></StarRating>}
          {props.poi.rating && (
            <RatingContainer>
              {/* <StarRating initialRating={4}></StarRating> */}
              <div>{_getStars(props.poi.rating)}</div>
              <span>{props.poi.rating}</span>
            </RatingContainer>
          )}
          <div className="flex flex-row">
            <div className="font-normal border-2 lg:text-base text-sm border-[#9F9F9F] rounded-md px-1 py-[2px] mt-2    block  bg-white text-[#9F9F9F]">
              {true ? "ATTRACTION" : "View Less"}
            </div>
          </div>

          {props.poi ? <div></div> : null}
          {/* <Rating margin="0.25rem 0"></Rating> */}

          {/* {props.poi !== undefined ? (
          //   props.poi.experience_filters ? (
          //     <div
          //       className={`grid grid-flow-col grid-rows-${Math.ceil(
          //         props.poi.experience_filters.length / 2
          //       )} gap-0`}
          //     >
          //       {props.poi.experience_filters.map((element, index) =>
          //         element.toString() != 'Hidden Gem' ? (
          //           <div className="flex flex-row items-end min-w-max">
          //             <span className="font-bold text-xl pr-1">.</span>

          //             <div
          //               className="flex  items-center text-sm  font-bold"
          //               key={index}
          //             >
          //               {' '}
          //               {element.split(' ').length > 2
          //                 ? element.split(' ')[0]
          //                 : element}{' '}
          //             </div>
          //           </div>
          //         ) : (
          //           <div className="flex font-bold" key={index}>
          //             <div
          //               className="border-solid border-2 text-sm font-bold rounded-md px-2 border-[#9C54F6]"
          //               style={{ color: index % 2 ? '#9C54F6' : '#5363F5' }}
          //             >
          //               {element}
          //             </div>
          //           </div>
          //         )
          //       )}
          //     </div>
          //   ) : null
          // ) : null} */}
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
        <div></div>
        <div
          onClick={() => setFloatingButtonView(true)}
          className=" sticky px-2 top-0 bg-white z-[900] flex flex-col gap-3 my-4 justify-start items-start mx-auto w-[95%]"
        >
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

          <div>
            Showing 40 attractions
            {props?.data?.activity_data?.city?.name
              ? ` in ${props?.data?.activity_data?.city?.name}`
              : null}
          </div>
          <Navigation
            items={items}
            BarName="TabsName"
            ClickHandler={ClickHandler}
          />
        </div>

        {!fetchingPoi ? (
          // <POIDetails data={data} handleCloseDrawer={props.handleCloseDrawer} />
          optionsJSX
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
        <div
          onClick={() => setFloatingButtonView(true)}
          className="w-[100vw] px-2 h-[95vh]    flex flex-col gap-3 my-4 justify-between items-start mx-auto "
        >
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
                <div className="mb-2 text-sm font-normal">Experience Types</div>
                <GridResponsive>
                  {Experiences.map((currentfilter, i) => (
                    <button
                      onClick={() => SetSelectedExprience(i)}
                      className={`flex  font-normal min-w-fit text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                        SelectedExprience == i
                          ? "text-white border-0 bg-black "
                          : "border-2 bg-white text-black"
                      } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                      key={i}
                    >
                      {currentfilter}
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
              // onClick={() => {
              //   handleClickAc(index, booking);
              // }}
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
              style={{ height: "32px", width: "32px" }}
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
              style={{ height: "32px", width: "32px" }}
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

export default ItineraryPoiElementM;
