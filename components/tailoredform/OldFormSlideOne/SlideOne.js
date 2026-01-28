import NewDatePicker from "./NewDatePicker";
import styled from "styled-components";
import Destinations from "./destinations/Index";
import Question from "../Question";
import { BsCheck } from "react-icons/bs";

const Container = styled.div`
  color: black;
  width: 100%;
  @media screen and (min-width: 768px) {
  }
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SlideOne = (props) => {
  const getHeading = () => {
    if (props.tailoredFormModal && props.focusedDate) {
      if (props.focusedDate == "startDate") return "Please select start date.";
      if (props.focusedDate == "endDate") return "Please select end date.";
    } else return "What do you want to explore?";
  };

  const CITIES = null;

  return (
    <Container>
      <Section>
        <Question>{getHeading()}</Question>
        <Destinations
          startingLocation={props.startingLocation}
          tailoredFormModal={props.tailoredFormModal}
          initialInputId={props.initialInputId}
          setStartingLocation={props.setStartingLocation}
          showSearchStarting={props.showSearchStarting}
          children_cities={props.children_cities}
          setDestination={props.setDestination}
          setShowSearchStarting={props.setShowSearchStarting}
          showCities={props.showCities}
          setShowCities={props.setShowCities}
          destination={props.destination}
          CITIES={props.cities ? props.cities : CITIES}
          selectedCities={props.selectedCities}
          setSelectedCities={props.setSelectedCities}
          setValueStart={props.setValueStart}
          setValueEnd={props.setValueEnd}
          eventDates={props.eventDates}
        ></Destinations>
      </Section>

      <Section>
        <Question
          style={{ visibility: props.showCities ? "hidden" : "visible" }}
          margin="0 0 1rem 0"
        >
          When are you planning to travel?
        </Question>
        <NewDatePicker
          focusedDate={props.focusedDate}
          setFocusedDate={props.setFocusedDate}
          tailoredFormModal={props.tailoredFormModal}
          valueStart={props.valueStart}
          valueEnd={props.valueEnd}
          setValueStart={props.setValueStart}
          setValueEnd={props.setValueEnd}
          eventDates={props.eventDates}
        />
        <div
          className="hover-pointer"
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginTop: "1rem",
            marginLeft: "2px",
          }}
        >
          {props.eventDates && props.destination ? (
            <div className="font-lexend"
              style={{ fontSize: "0.8rem" }}
            >
              The dates for this event are fixed and cannot be changed!
            </div>
          ) : (
            <>
            </>
          )}

        </div>
      </Section >
      <Section style={{ marginBottom: "0.5rem" }}></Section>
    </Container >
  );
};

export default SlideOne;
