import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../ui/button/Index";

import * as ga from "../../services/ga/Index";
import { format } from "date-fns";
import media from "../media";
import ButtonLoader from '../ui/button/ButtonLoader'
import axiostailoredinstance from "../../services/leads/tailored";
import Spinner from "../Spinner";
import LoadingLottie from "../ui/LoadingLottie";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import Flickity from "./Flickity";
import { EXPERIENCE_FILTERS_BOX } from "../../services/constants";
import { fadeIn } from "react-animations";
import Popup from "../ErrorPopup";
import { RxCross2 } from "react-icons/rx";
import Cookies from "js-cookie";
import usePageLoaded from "../custom hooks/usePageLoaded";

const fadeInAnimation = keyframes`${fadeIn}`;
const Container = styled.div`
  height: max-content;
  color: black;
  z-index: ${(props) => (props.showBlack ? "1006" : "2")};
  position: relative;
  background-color: ${(props) =>
    props.slideIndex || props.tailoredFormModal
      ? "white"
      : "rgba(255,255,255,0.9)"};
  width: 100%;
  border: none !important;
  border-radius: ${(props) =>
    props.tailoredFormModal ? "12px !important" : "8px !important"};
  @media screen and (min-width: 768px) {
    ${(props) => props.tailoredFormModal && "height : 100%"};
    margin: auto 0;

    min-height: 400px;
  }
`;
const CloseIcon = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: right;
  border-bottom: 1px solid #0000004a;
  padding-block: 1rem;
`;
const Heading = styled.p`
  font-size: 1.35rem;
  margin: 0.5rem 0 0.5rem 0;
  ${(props) => props.tailoredFormModal && "margin : 1rem 0"};
  text-align: left;
  font-weight: 600;
  color: black;
  line-height: normal;

  @media screen and (min-width: 815px) {
    font-size: 1.5rem;
    margin: 0.25rem 0 0.25rem 0;
    ${(props) => props.tailoredFormModal && "margin : 1rem 0"};

    height: 1.8rem;
    overflow: hidden;
  }
`;
const CountryCodeOption = styled.div`
  &:hover {
    cursor: pointer;
  }
  text-align: center;
  height: 2rem !important;
  margin: 0.5rem;
`;

const CountryImg = styled.img`
  height: 100%;
`;
const Card = styled.div`
  width: 80%;
  margin: 2px 1rem;
`;
const BlackContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1005;
  width: 100vw;
  display: none;
  height: 100vh;
  animation: 0.5s ${fadeInAnimation};
  @media screen and (min-width: 768px) {
    display: initial;
  }
`;
const LoadingText = styled.div`
font-size: 1.2rem;
    position: absolute;
    bottom: 30%;
    opacity: 0.8;
`;
const Enquiry = (props) => {
  const router = useRouter();
  const routerquery = router.query;
  const initialInputId = Date.now();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [flexible, setFlexible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [valueStart, setValueStart] = useState(null);
  const [valueEnd, setValueEnd] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfInfants, setNumberOfInfants] = useState(0);
  const [budget, setBudget] = useState("Affordable");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const [focusedDate, setFocusedDate] = useState(null);
  const [groupType, setGroupType] = useState(null);
  const [startingLocation, setStartingLocation] = useState(false);
  const isPageLoaded = usePageLoaded()
  const [destination, setDestination] = useState(
    routerquery.destination || props.destination
  );
  const popupObj = {
    dateStart: false,
    dateEnd: false,
    group: false,
    InputOne: false,
  };
  const [showPopup, setShowPopup] = useState(popupObj);
  const [showBlack, setShowBlack] = useState(false);
  const [submitSecondSlide, setSubmitSecondSlide] = useState(false);
 
  useEffect(() => {
    if (slideIndex === 2 && props.token) _submitDataHandler();
    setShowPopup(popupObj);
  }, [slideIndex, props.token]);
  const _handleHideBlack = () => {
    setShowBlack(false);
    setShowCities(false);
    setShowSearchStarting(false);
  };
  let isPageWide = media("(min-width: 768px)");
          const LocationCookie = Cookies.get("userLocation");

  useEffect(() => {
      if (!startingLocation) {
        if (LocationCookie) {
          const userLocation = JSON.parse(LocationCookie);
          if (userLocation.text && userLocation.place_id)
            setStartingLocation({
              name: userLocation.text,
              place_id: userLocation.place_id,
            });
        }
      }
  }, [LocationCookie]);

  const [selectedCities, setSelectedCities] = useState(
    !router.pathname.split("/").includes("[city]")
      ? [
          {
            destination_id: routerquery.page_id || props.page_id,
            name: routerquery.destination || props.destination,
            input_id: initialInputId,
          },
        ]
      : [
          {
            id: routerquery.page_id || props.page_id,
            name: routerquery.destination || props.destination,
            input_id: initialInputId,
          },
        ]
  );
   useEffect(() => {
     setShowPopup(popupObj);
   }, [
     valueStart,
     valueEnd,
     startingLocation,
     destination,
     showSearchStarting,
     showCities,
     groupType,
     selectedCities.length,
     slideIndex
   ]);

  // const ContainerRef = useRef()

  const _submitDataHandler = () => {
    const value_start = new Date(valueStart);
    const value_end = new Date(valueEnd);
    setLoading(true);
    let cityids = [];
    let locations = [];
    let stateIds = [];
    let countryIds = []
    // let starting_location = null;
    let preferences = [];
    for (var i = 0; i < selectedPreferences.length; i++) {
      for (var j = 0; j < EXPERIENCE_FILTERS_BOX.length; j++) {
        if (selectedPreferences[i] === EXPERIENCE_FILTERS_BOX[j].display) {
          for (var k = 0; k < EXPERIENCE_FILTERS_BOX[j].actual.length; k++) {
            preferences.push(EXPERIENCE_FILTERS_BOX[j].actual[k]);
          }
          break;
        }
      }
    }
    try {
      for (var i = 0; i < selectedCities.length; i++) {
        if (
          cityids.indexOf(selectedCities[i].id) == -1 &&
          selectedCities[i].id
        ) {
          if (selectedCities[i].type == "State")
            stateIds.push(parseInt(selectedCities[i].id));
          else if (selectedCities[i].type == "Country") countryIds.push(parseInt(selectedCities[i].id))
          else {
            cityids.push(parseInt(selectedCities[i].id));
          }
          locations.push(selectedCities[i].name);
        }
      }
    } catch {}

    const start_date = format(value_start, "yyyy-MM-dd");
    const end_date = format(value_end, "yyyy-MM-dd");

    let number_of_adults = 2,
      number_of_children = 0,
      number_of_infants = 0;
    if (groupType === "Solo") {
      number_of_adults = 1;
    } else if (groupType === "Couple") {
      number_of_adults = 2;
    } else {
      number_of_adults = numberOfAdults;
      number_of_children = numberOfChildren;
      number_of_infants = numberOfInfants;
    }
    let data = null;

    data = {
      // "locations": locations,
      experience_filters_selected: preferences,
      budget: budget,
      // "city_id": cityids,
      group_type: groupType,
      number_of_adults: number_of_adults,
      number_of_children: number_of_children,
      number_of_infants: number_of_infants,
      start_date: start_date,
      end_date: end_date,
      flexible_dates: flexible,
      user_location: {
        place_id: startingLocation
          ? startingLocation.place_id
          : "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
      },
    };

    if (selectedCities[0].destination_id)
      data.destination_id = [selectedCities[0].destination_id];
    if (stateIds.length) data.state_id = stateIds;
    if(countryIds.length) data.country_ids = countryIds;
    if (cityids.length) data.city_id = cityids;
    if (locations.length) data.locations = locations;

    if (startingLocation) data;

    setLoading(true);
    localStorage.removeItem("MyPlans");

    axiostailoredinstance
      .post("", data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        console.log('response: ', response);
        setSubmitted(true);
        if (!response.data.auto_itinerary_created) {
          // window.location.href =
          //   "https://www.blog.thetarzanway.com/thank-you-page-enquiry";
          router.push("/thank-you");
        } else {
          // ga.event({action: 'C-Andaman-Form-success', params: {key : ''}})

          // setTimeout(function () {
        if(response.data.loader_time) router.push(
              "/itinerary/" +
                response.data.itinerary.itinerary_id +
                "?t=" +
                response.data.loader_time
            );
         else router.push("/itinerary/" + response.data.itinerary.itinerary_id);
          // }, 10000);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        // window.location.href =
        //   "https://www.blog.thetarzanway.com/thank-you-page-enquiry";
        router.push("/thank-you");

        if (err.response.data.email) {
        }
      });
  };
  const _prevSlideHandler = () => {
    if (slideIndex) setSlideIndex(slideIndex - 1);
  };
  // const [valueStart, setValueStart] =useState((moment().add(5, 'day')));
  // const [valueEnd, setValueEnd] =useState((moment().add(10,'day')));

  const getHeading = () => {
    if (props.tailoredFormModal && focusedDate) {
      if (focusedDate == "startDate") return "Please select start date.";
      if (focusedDate == "endDate") return "Please select end date.";
    } else return "Get your free travel plan now";
  };
  const _SlideOneSubmitHandler = () => {
    if (!selectedCities[0].destination_id && !selectedCities[0].id) {
      return setShowPopup({ ...showPopup, InputOne: true });
    }
    if (!valueStart && !flexible)
      return setShowPopup({ ...showPopup, dateStart: true });
    if (!valueEnd && !flexible)
      return setShowPopup({ ...showPopup, dateEnd: true });
    setShowPopup(popupObj);
    setSlideIndex(slideIndex + 1);
    // window.scrollBy(0, -200 , 'smooth');
    // ContainerRef.current.scrollIntoView(0,-150)
    if (props.HeroBanner && isPageWide)
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const _SlideTwoSubmitHandler = () => {
    if (!submitSecondSlide) return setShowPopup({ ...showPopup, group: true });
    setShowPopup(popupObj);
    setSlideIndex(slideIndex + 1);
  };
  if (!loading && !submitted)
    return (
      <div style={{}}>
        {showBlack && !props.tailoredFormModal ? (
          <BlackContainer onClick={() => _handleHideBlack()}></BlackContainer>
        ) : null}

        <Container
          showBlack={showBlack}
          tailoredFormModal={props.tailoredFormModal}
          slideIndex={slideIndex}
          className={isPageWide ? "center-div border" : "center-div"}
          onClick={() => {
            setShowBlack(true);
          }}
          //  ref={ContainerRef}
        >
          {showPopup.InputOne && (
            <Popup
              setShowPopup={setShowPopup}
              top={props.tailoredFormModal ? "17rem" : "12.6rem"}
              mobileTop="14rem"
              left="10px"
              text="Please select your destination!"
            />
          )}
          {showPopup.dateStart && !flexible && (
            <Popup
              setShowPopup={setShowPopup}
              bottom={props.tailoredFormModal ? "1.3rem" : "5.6rem"}
              left="10px"
              text="Please select starting date!"
            />
          )}
          {showPopup.dateEnd && !flexible && (
            <Popup
              setShowPopup={setShowPopup}
              bottom={props.tailoredFormModal ? "1.3rem" : "5.6rem"}
              left="170px"
              mobileleft={"135px"}
              text="Please select ending date!"
            />
          )}
          {showPopup.group && (
            <Popup
              setShowPopup={setShowPopup}
              top={props.tailoredFormModal ? "16rem" : "190px"}
              left="20%"
              tipLeft="45%"
              text="Please select your group type!"
            />
          )}

          {/* <Modal  backdrop={true} show={props.show}  size="md" centered onHide={_hideModalHandler} style={{padding: "0"}}> */}
          {/* <Modal.Body style={{padding: "1rem", minHeight: '60vh'}} className="center-div" > */}

          {/* <div onClick={(e) => _prevSlideHandler}>Back</div> */}

          <div
            style={{
              padding: props.tailoredFormModal ? "0rem 1rem" : "0.5rem 1rem",
              width: "100%",
              marginBottom: slideIndex === 2 ? "0rem" : "0rem",
              display: props.tailoredFormModal ? "initial" : "grid",
              gridTemplateColumns: "max-content auto",
            }}
          >
            {slideIndex && !props.tailoredFormModal ? (
              <div className="center-div">
                <BiArrowBack
                  onClick={_prevSlideHandler}
                  className="hover-pointer"
                  style={{ marginTop: "2px", fontSize: "1.5rem" }}
                ></BiArrowBack>
              </div>
            ) : (
              <></>
            )}
            <div style={{ width: "100%" }}>
              {props.tailoredFormModal && (
                <CloseIcon>
                  {slideIndex ? (
                    <BiArrowBack
                      onClick={_prevSlideHandler}
                      className="hover-pointer"
                      style={{ marginTop: "2px", fontSize: "1.5rem" }}
                    ></BiArrowBack>
                  ) : (
                    <div></div>
                  )}
                  <RxCross2
                    style={{
                      fontSize: "1.75rem",
                      textAlign: "right",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      !focusedDate ? props.onHide() : console.log("");
                    }}
                  />
                </CloseIcon>
              )}

              <Heading
                tailoredFormModal={props.tailoredFormModal}
                style={{ textAlign: !slideIndex ? "left" : "center" }}
              >
                {getHeading()}
              </Heading>
            </div>
          </div>
          {/* <div key={index}  style={{width: '80%', margin: props.experience ? "2px 1rem" : '2px 0.5rem'}} ><div>{card}</div></div> */}
          <div style={{ padding: "0 1rem 1rem 1rem", width: "100%" }}>
            <div
              style={{
                borderStyle: "solid none none none",
                borderWidth: "1px",
                color: "#D3D3D3",
                height: "1px",
                width: "100%",
                marginBottom: "1.5rem",
              }}
            ></div>

            <Flickity
              initialInputId={initialInputId}
              focusedDate={focusedDate}
              setFocusedDate={setFocusedDate}
              tailoredFormModal={props.tailoredFormModal}
              flexible={flexible}
              setFlexible={setFlexible}
              startingLocation={startingLocation}
              setStartingLocation={setStartingLocation}
              children_cities={props.children_cities}
              showSearchStarting={showSearchStarting}
              setShowSearchStarting={setShowSearchStarting}
              showCities={showCities}
              setShowCities={setShowCities}
              destination={destination}
              setDestination={setDestination}
              token={props.token}
              // _handlePrev={_prevSlideHandler}
              slideIndex={slideIndex}
              cities={props.cities}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              valueStart={valueStart}
              valueEnd={valueEnd}
              setValueStart={setValueStart}
              setValueEnd={setValueEnd}
              groupType={groupType}
              setGroupType={setGroupType}
              numberOfAdults={numberOfAdults}
              setNumberOfAdults={setNumberOfAdults}
              numberOfChildren={numberOfChildren}
              setNumberOfChildren={setNumberOfChildren}
              numberOfInfants={numberOfInfants}
              setNumberOfInfants={setNumberOfInfants}
              setBudget={setBudget}
              selectedPreferences={selectedPreferences}
              setSelectedPreferences={setSelectedPreferences}
              setSubmitSecondSlide={setSubmitSecondSlide}
            ></Flickity>
            {/* {slideIndex !==2 ? <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={() => setSlideIndex(slideIndex+1)}>
            Continue
            </Button> : <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={_submitDataHandler}>
            Submit
            </Button> } */}

            {slideIndex === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  //  visibility:
                  //  showCities &&
                  //  props.cities ? "hidden" : "visible",
                }}
              >
                <Button
                  fontSize="1rem"
                  width={!isPageWide ? "auto" : "100%"}
                  style={
                    !isPageWide && isPageLoaded
                      ? {
                          position: "fixed",
                          left: "1rem",
                          right: "1rem",
                          bottom: "0",
                        }
                      : {}
                  }
                  padding="0.5rem 2rem"
                  fontWeight="500"
                  margin="1rem 0"
                  borderRadius="5px"
                  borderWidth="1px"
                  bgColor="#f7e700"
                  onclick={() => _SlideOneSubmitHandler()}
                >
                  Continue
                  {/* <ButtonLoader height={'1.25rem'} /> */}
                </Button>
              </div>
            ) : null}
            {slideIndex === 1 ? (
              !props.token ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    fontSize="1rem"
                    width={!isPageWide ? "auto" : "100%"}
                    style={
                      !isPageWide
                        ? {
                            position: "fixed",
                            left: "1rem",
                            right: "1rem",
                            bottom: "0",
                          }
                        : {}
                    }
                    padding="0.5rem 2rem"
                    fontWeight="500"
                    margin="1rem 0"
                    borderRadius="5px"
                    borderWidth="1px"
                    bgColor="#f7e700"
                    onclick={_SlideTwoSubmitHandler}
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    fontSize="1rem"
                    width={!isPageWide ? "auto" : "100%"}
                    style={
                      !isPageWide
                        ? {
                            position: "fixed",
                            left: "1rem",
                            right: "1rem",
                            bottom: "0",
                          }
                        : {}
                    }
                    padding="0.5rem 2rem"
                    fontWeight="500"
                    margin="1rem 0"
                    borderRadius="5px"
                    borderWidth="1px"
                    bgColor="#f7e700"
                    onclick={_submitDataHandler}
                  >
                      {loading ? <ButtonLoader height={'1.25rem'} /> : 'Submit'}

                    
                  </Button>
                </div>
              )
            ) : null}
            {/* <Grid container spacing={2}> */}
            {/* <Grid item xs={12}>
                    {!loading ? 
                    <Button onclickparam={null} onclick={_submitDataHandler} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">Continue</Button>
                        : 
                        <Button onclickparam={null} onclick={() => null} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">
                            Preparing Plan
                            <Spinner display="inline-block" size={16} margin="0 0 0 0.5rem" color={loading ? 'white' : 'black'}></Spinner>
                        </Button>

                    }
                    </Grid> */}
            {/* </Grid> */}

            {/* </Modal.Body> */}
            {/* </Modal> */}
          </div>
        </Container>
      </div>
    );
  else
   return (
     <div>
       {showBlack ? (
         <BlackContainer onClick={() => setShowBlack(false)}></BlackContainer>
       ) : null}

       <Container className="border center-div">
         <LoadingLottie height="50%" width="50%"></LoadingLottie>
         <LoadingText>Finalizing your plan...</LoadingText>
       </Container>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToPros, mapDispatchToProps)(Enquiry);
