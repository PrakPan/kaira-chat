import { useState } from "react";
import styled from "styled-components";
import { BsCheck } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";
import NewDatePicker from "./NewDatePicker";
import Destinations from "./destinations/Index";
import Question from "../Question";
import Preferences from "../slidetwo/preferences/Index";
import AirbnbCalendar from "../../calendar";
import { DummyContainer, StyledFigmaBox } from "../utils/ui";
import Modal from "../../ui/Modal";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";
import { Body1M_16, Body2M_14, Body2R_14 } from "../../new-ui/Body";
import moment from "moment";

const Container = styled.div`
  color: black;
  width: 100%;
  @media screen and (min-width: 768px) {
  }
    display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
`;

const formatShortDate = (date) => {
  if (!date) return '';
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // "sep"
  return `${day} ${month}`;
};


const SlideOne = (props) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const handleOnCalenderApplyDates = (values) => {
    props.setValueStart(values.start)
    props.setValueEnd(values.end)
  }
  const CITIES = null;

  return (
    <Container>
      <Section>
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
        {/* <AirbnbCalendar /> */}
        <div>
          <Body2R_14>When</Body2R_14>
          <StyledFigmaBox value={`${formatShortDate(props.valueStart)}-${formatShortDate(props.valueEnd)}`} className="cursor-pointer" placeholder="Select dates" onClick={() => setShowCalendar(true)} />
        </div>
        <div
          className="hover-pointer"
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginLeft: "2px",
          }}
        >
          {props.eventDates && props.destination ? (
            <div className="font-lexend" style={{ fontSize: "0.8rem" }}>
              The dates for this event are fixed and cannot be changed!
            </div>
          ) : (
            <>

            </>
          )}
        </div>
      </Section>

      <Section>
        <Body1M_16>Choose your experience</Body1M_16>
        <div className="mt-[12px]">
          <Preferences
            tailoredFormModal={props.tailoredFormModal}
            selectedPreferences={props.selectedPreferences}
            setSelectedPreferences={props.setSelectedPreferences}
          ></Preferences>
        </div>
      </Section>
      <ModalWithBackdrop
        centered
        show={showCalendar}
        mobileWidth="100%"
        backdrop
        closeIcon={true}
        onHide={() => setShowCalendar(false)}
        borderRadius={"12px"}
        animation={false}
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(1px)" }} // <- add this
      >
        <AirbnbCalendar
          valueStart={props.valueStart}
          valueEnd={props.valueEnd}
          setValueStart={props.setValueStart}
          setValueEnd={props.setValueEnd}
          onChangeDate={handleOnCalenderApplyDates}
          setShowCalendar={setShowCalendar}
        />
      </ModalWithBackdrop>
    </Container>
  );
};

export default SlideOne;
