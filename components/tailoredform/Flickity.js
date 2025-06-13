import styled, { keyframes } from "styled-components";
import SlideOne from "./slideone/SlideOne";
import SlideTwo from "./slidetwo/SlideTwo";
import { fadeIn } from "react-animations";
import Login from "../userauth/LogInModal";
import SlideThree from "./slidethree/SlideThree";

const fadeInAnimation = keyframes`${fadeIn}`;

const Card = styled.div`
  width: 100%;
  margin: 0;
  animation: 1s ${fadeInAnimation};
`;

const FlickityComp = (props) => {
  return (
    <div style={{ width: "100%" }} className="">
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
            setSelectedCities={props.setSelectedCities}
            valueStart={props.valueStart}
            valueEnd={props.valueEnd}
            setValueStart={props.setValueStart}
            setValueEnd={props.setValueEnd}
            eventDates={props.eventDates}
            selectedPreferences={props.selectedPreferences}
            setSelectedPreferences={props.setSelectedPreferences}
          ></SlideOne>
        </Card>
      ) : null}

      {props.slideIndex === 1 && (props.token || props.phone !== "null") ? (
        <Card>
          <SlideTwo
            numberOfAdults={props.numberOfAdults}
            tailoredFormModal={props.tailoredFormModal}
            setNumberOfAdults={props.setNumberOfAdults}
            numberOfChildren={props.numberOfChildren}
            setNumberOfChildren={props.setNumberOfChildren}
            numberOfInfants={props.numberOfInfants}
            setNumberOfInfants={props.setNumberOfInfants}
            groupType={props.groupType}
            setGroupType={props.setGroupType}
            setBudget={props.setBudget}
            selectedPreferences={props.selectedPreferences}
            setSelectedPreferences={props.setSelectedPreferences}
            setSubmitSecondSlide={props.setSubmitSecondSlide}
            setRoomConfiguration={props.setRoomConfiguration}
            priceRange={props.priceRange}
            setPriceRange={props.setPriceRange}
            addHotels={props.addHotels}
            setAddHotels={props.setAddHotels}
            addFlights={props.addFlights}
            setAddFlights={props.setAddFlights}
            destination={props.destination}
            defaultPriceRange={props.defaultPriceRange}
          ></SlideTwo>
        </Card>
      ) : null}

      {props.slideIndex === 2 ? (
        props.addHotels ? (
          <SlideThree
            numberOfAdults={props.numberOfAdults}
            setNumberOfAdults={props.setNumberOfAdults}
            numberOfChildren={props.numberOfChildren}
            setNumberOfChildren={props.setNumberOfChildren}
            numberOfInfants={props.numberOfInfants}
            setNumberOfInfants={props.setNumberOfInfants}
            roomConfiguration={props.roomConfiguration}
            setRoomConfiguration={props.setRoomConfiguration}
            addHotels={props.addHotels}
            setAddHotels={props.setAddHotels}
            groupType={props.groupType}
            setBudget={props.setBudget}
            setPriceRange={props.setPriceRange}
            destination={props.destination}
            defaultPriceRange={props.defaultPriceRange}
            roomConfiguration={props.roomConfiguration}
          />
        ) : (
          <Login
            nospacing
            noheading
            noicons
            hideloginclose
            noclose
            onSuccess={() => {
              props.setSlideIndex((prev) => prev - 1);
              props.setLoginComplete(true);
            }}
          ></Login>
        )
      ) : null}

      {props.slideIndex === 3 && (!props.token || props.phone === "null") ? (
        <Login
          nospacing
          noheading
          noicons
          hideloginclose
          noclose
          onSuccess={() => {
            props.setSlideIndex((prev) => prev - 1);
            props.setLoginComplete(true);
          }}
        ></Login>
      ) : null}
    </div>
  );
};

export default FlickityComp;
