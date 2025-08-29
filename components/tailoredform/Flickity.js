import styled, { keyframes } from "styled-components";
import SlideOne from "./slideone/SlideOne";
import SlideThree from "./slidetwo/SlideThree";
import { fadeIn } from "react-animations";
import Login from "../userauth/LogInModal";
import SlideFour from "./slidefour/SlideFour";
import SlideTwo from "./slideTwo/SlideTwo";
const fadeInAnimation = keyframes`${fadeIn}`;

const Card = styled.div`
  width: 100%;
  margin: 0;
  animation: 1s ${fadeInAnimation};
`;
const FlickityComp = (props) => {
  return (
    <div style={{ width: "100%" }} className="font-inter h-full">
      {!props.slideIndex ? (
        <Card>
          <SlideOne
            initialInputId={props.initialInputId}
            focusedDate={props.focusedDate}
            flexible={props.flexible}
            setFlexible={props.setFlexible}
            setFocusedDate={props.setFocusedDate}
            tailoredFormModal={props.tailoredFormModal}
            startingLocation={props.startingLocation}
            setStartingLocation={props.setStartingLocation}
            children_cities={props.children_cities}
            showSearchStarting={props.showSearchStarting}
            setShowSearchStarting={props.setShowSearchStarting}
            destination={props.destination}
            showCities={props.showCities}
            setShowCities={props.setShowCities}
            cities={props.cities}
            setDestination={props.setDestination}
            selectedCities={props.selectedCities}
            eventDates={props.eventDates}
            selectedPreferences={props.selectedPreferences}
            setSelectedPreferences={props.setSelectedPreferences}
          ></SlideOne>
        </Card>
      ) : null}

      {props.slideIndex === 1 ? (
        <Card className="flex flex-col h-full">
          <SlideTwo
            routes={props?.route}
            className="flex-1"
          >

          </SlideTwo>
        </Card>
      ) : null}

      {props.slideIndex === 2 && (props.token || props.phone !== "null") ? (
        <Card>
          <SlideThree
            setSubmitSecondSlide={props.setSubmitSecondSlide}
          ></SlideThree>
        </Card>
      ) : null}

      {props.slideIndex === 3 ?
        <SlideFour
          setSlideFour={props.setSlideFour}
          slideFour={props.slideFour}
        /> : null}

      {props.slideIndex == 4 &&
        <div>
          <Login
            show={props?.slideIndex == 4}
            onSuccess={props?._submitDataHandler}
          />
        </div>
      }
    </div>
  );
};

export default FlickityComp;
