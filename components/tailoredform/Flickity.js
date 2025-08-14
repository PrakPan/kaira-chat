import styled, { keyframes } from "styled-components";
import SlideOne from "./slideone/SlideOne";
import SlideThree from "./slidetwo/SlideThree";
import { fadeIn } from "react-animations";
import Login from "../userauth/LogInModal";
import SlideFour from "./slidefour/SlideFour";
import SlideTwo from "./slidetwo/SlideTwo";

const fadeInAnimation = keyframes`${fadeIn}`;

const Card = styled.div`
  width: 100%;
  margin: 0;
  animation: 1s ${fadeInAnimation};
`;

const dummyProps = {
  itinerary: {
    ItineraryId: "67890",
    name: "Weekend Getaway",
    start_date: "2025-10-15",
    end_date: "2025-10-18",
    duration: 3,
    group_type: "Couple",
    budget: "$1,500 - $2,000",
    number_of_adults: 2,
    number_of_children: 0,
    number_of_infants: 0
  },
  routes: [
    {
      id: 1,
      city_name: "Mumbai",
      city_id: "mumbai_001",
      place_id: "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
      latitude: 19.0760,
      longitude: 72.8777,
      duration: 0,
      checkin_date: "2025-10-15",
      checkout_date: "2025-10-15"
    },
    {
      id: 2,
      city_name: "Goa",
      city_id: "goa_001",
      place_id: "ChIJ4R4UHG4XuzkRUOFqI5hwGBk",
      latitude: 15.2993,
      longitude: 74.1240,
      duration: 3,
      nights: 3,
      checkin_date: "2025-10-15",
      checkout_date: "2025-10-18"
    },
    {
      id: 3,
      city_name: "Mumbai",
      city_id: "mumbai_001",
      place_id: "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
      latitude: 19.0760,
      longitude: 72.8777,
      duration: 0,
      checkin_date: "2025-10-18",
      checkout_date: "2025-10-18"
    }
  ],
  editRoute: "editDestinations",
  mercuryItinerary: false,
  token: "dummy_auth_token_67890",
  ItineraryId: "67890",
  group_type: "Couple",
  duration_time: 3,
  travellerType: "Couple",
  setEdit: (value) => console.log("setEdit called"),
  fetchData: (refresh) => console.log("fetchData called"),
  resetRef: () => console.log("resetRef called"),
  setShowLoginModal: (show) => console.log("setShowLoginModal called"),
  setLocationsLatLong: (locations) => console.log("setLocationsLatLong called"),
  openNotification: (notification) => console.log("openNotification called"),
  children: <div className="w-full h-full bg-blue-50 rounded-lg flex items-center justify-center"><p>Map View</p></div>
};

const FlickityComp = (props) => {
  return (
    <div style={{ width: "100%" }} className="font-inter">
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

      {props.slideIndex === 2 && props.token && props.phone !== "null" ? (
        <Card>
          <SlideTwo
            {...dummyProps}
            />
          </Card>
      ) : null}

      {props.slideIndex === 1 && (props.token || props.phone !== "null") ? (
        <Card>
          <SlideThree
            roomConfiguration={props.roomConfiguration}
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
          ></SlideThree>
        </Card>
      ) : null}

      {props.slideIndex === 2 ? (
        props.addHotels ? (
          <SlideFour
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
