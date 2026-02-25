import styled, { keyframes } from "styled-components";
import SlideOne from "./slideone/SlideOne";
import SlideThree from "./slidetwo/SlideThree";
import { fadeIn } from "react-animations";
import Login from "../userauth/LogInModal";
import SlideFour from "./slidefour/SlideFour";
import SlideTwo from "./slideTwo/SlideTwo";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
const fadeInAnimation = keyframes`${fadeIn}`;

const Card = styled.div`
  width: 100%;
  margin: 0;
  animation: 1s ${fadeInAnimation};
  @media screen and (max-width: 768px) {
    margin-bottom:100px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const FlickityComp = (props) => {
  const router=useRouter()
    const slideIndex = Number(router.query.slideIndex) || 0;
    const selectedPreferences = useSelector(
  (state) => state.tailoredInfoReducer.slideOne.selectedPreferences
);
  return (
    <div style={{ width: "100%" }} className="font-inter h-full">
      {(!slideIndex || slideIndex==0) ? (
        <Card>
          <SlideOne
            initialInputId={props.initialInputId}
            tailoredFormModal={props.tailoredFormModal}
            startingLocation={props.startingLocation}
            setStartingLocation={props.setStartingLocation}
            showSearchStarting={props.showSearchStarting}
            setShowSearchStarting={props.setShowSearchStarting}
            destination={props.destination}
            showCities={props.showCities}
            setShowCities={props.setShowCities}
            cities={props.cities}
            setDestination={props.setDestination}
            selectedCities={props.selectedCities}
            eventDates={props.eventDates}
            selectedPreferences={selectedPreferences}
            errors={props.errors}
          ></SlideOne>
        </Card>
      ) : null}

      {slideIndex === 1 ? (
        <Card className="flex flex-col h-full">
          <SlideTwo
            routes={props?.route}
            setLocationsLatLong={props.setLocationsLatLong}
            locationsLatLong={props.locationsLatLong}
            className="flex-1"
            setIsRouteChanged={props.setIsRouteChanged}
          >

          </SlideTwo>
        </Card>
      ) : null}

      {slideIndex === 2 ? (
        <Card>
          <SlideThree
            setSubmitSecondSlide={props.setSubmitSecondSlide}
          ></SlideThree>
        </Card>
      ) : null}

      {slideIndex === 3 ?
      <Card> 
        <SlideFour/> 
        </Card> : null}

      
    </div>
  );
};

export default FlickityComp;
