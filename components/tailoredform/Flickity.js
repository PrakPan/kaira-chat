import styled, { keyframes } from "styled-components";
import SlideOne from "./slideone/SlideOne";
import SlideThree from "./slidetwo/SlideThree";
import { fadeIn } from "react-animations";
import Login from "../userauth/LogInModal";
import SlideFour from "./slidefour/SlideFour";
import SlideTwo from "./slideTwo/SlideTwo";
import RoutesMap from "../../containers/itinerary/breif/RoutesMap";
import Header from "../../components/navbar/Index";
import SlideFive from "./slideFive/SlideFive";
import LogInModal from "../userauth/LogInModal";

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
      city_name: "Delhi, India",
      city_id: "delhi_001",
      place_id: "ChIJL_P_CXMEDTkRw0ZdG-0GVvw",
      latitude: 28.6139,
      longitude: 77.2090,
      duration: 1,
      nights: 1,
      checkin_date: "2025-10-15",
      checkout_date: "2025-10-16"
    },
    {
      id: 2,
      city_name: "Paris, France",
      city_id: "paris_001",
      place_id: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
      latitude: 48.8566,
      longitude: 2.3522,
      duration: 2,
      nights: 2,
      checkin_date: "2025-10-16",
      checkout_date: "2025-10-18"
    },
    {
      id: 3,
      city_name: "Zurich, Switzerland",
      city_id: "zurich_001",
      place_id: "ChIJGaK-SZcLkEcRA9wf5_GNbuY",
      latitude: 47.3769,
      longitude: 8.5417,
      duration: 1,
      nights: 1,
      checkin_date: "2025-10-18",
      checkout_date: "2025-10-19"
    },
    {
      id: 4,
      city_name: "Milan, Italy",
      city_id: "milan_001",
      place_id: "ChIJ53USP0nBhkcRjQ50xhPN_zw",
      latitude: 45.4642,
      longitude: 9.19,
      duration: 2,
      nights: 2,
      checkin_date: "2025-10-19",
      checkout_date: "2025-10-21"
    },
    {
      id: 5,
      city_name: "Delhi, India",
      city_id: "delhi_001",
      place_id: "ChIJL_P_CXMEDTkRw0ZdG-0GVvw",
      latitude: 28.6139,
      longitude: 77.2090,
      duration: 1,
      nights: 1,
      checkin_date: "2025-10-21",
      checkout_date: "2025-10-22"
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

      {props.slideIndex === 1 ? (
        <Card className="flex flex-col h-full">
          <SlideTwo
            setSlideIndex={props?.setSlideIndex}
            routes={props?.route}
            className="flex-1"
          >

          </SlideTwo>
        </Card>
      ) : null}

      {props.slideIndex === 2 && (props.token || props.phone !== "null") ? (
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
            setAddInclusions={props.setAddInclusions}
            addInclusions={props.addInclusions}
            destination={props.destination}
            defaultPriceRange={props.defaultPriceRange}
          ></SlideThree>
        </Card>
      ) : null}

      {props.slideIndex === 3 ?
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
          slideFour={props.slideFour}
          setSlideFour={props.setSlideFour}
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
