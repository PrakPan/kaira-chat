import React, { useState } from "react";
import styled from "styled-components";
import Pax from "./pax/Pax.jsx";
import GroupType from "./GroupType";
import Question from "../Question";
import BudgetSlider from "./preferences/BudgetSlider.jsx";
import HotelType from "./HotelType.js";

const Container = styled.div`
  color: black;
  width: 100%;
  @media screen and (min-width: 768px) {
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SlideTwo = (props) => {
  const [showPax, setShowPax] = useState(false);

  const _handleShowPax = (grouptype) => {
    props.setGroupType(grouptype);
    props.setSubmitSecondSlide(true);
    if (grouptype === "Friends" || grouptype === "Family") {
      setShowPax(true);
    }
  };

  return (
    <Container>
      <Section style={{ marginBottom: "1.5rem" }}>
        <Question>Your group type?</Question>

        <GroupType
          setShowPax={setShowPax}
          _handleShowPax={_handleShowPax}
          groupType={props.groupType}
        ></GroupType>
      </Section>

      <Section className="space-y-5">
        <div className="bg-[#FFEFE5] flex items-center gap-2 p-2 rounded-md w-fit">
          <input
            type="checkbox"
            value={props.addHotels}
            onChange={(e) => props.setAddHotels(e.target.checked)}
            className="focus:outline-none cursor-pointer"
          ></input>
          <div className="text-sm">Add hotels to my itinerary?</div>
        </div>

        {props.addHotels ? (
          <div className="space-y-5">
            <Pax
              numberOfAdults={props.numberOfAdults}
              setNumberOfAdults={props.setNumberOfAdults}
              numberOfChildren={props.numberOfChildren}
              setNumberOfChildren={props.setNumberOfChildren}
              numberOfInfants={props.numberOfInfants}
              setNumberOfInfants={props.setNumberOfInfants}
              setRoomConfiguration={props.setRoomConfiguration}
            ></Pax>

            <div className="space-y-1">
              <BudgetSlider
                tailoredForm
                destination={props.destination}
                defaultValue={props.defaultPriceRange}
                setShowPax={setShowPax}
                setBudget={props.setBudget}
                setPriceRange={props.setPriceRange}
              ></BudgetSlider>
            </div>
          </div>
        ) : null}
      </Section>

      <Section>
        <div className="bg-[#FFEFE5] flex items-center gap-2 p-2 rounded-md w-fit">
          <input
            type="checkbox"
            value={props.addFlights}
            onChange={(e) => props.setAddFlights(e.target.checked)}
            className="focus:outline-none cursor-pointer"
          ></input>
          <div className="text-sm">Add flights to my itinerary?</div>
        </div>
      </Section>

      {/* <Section>
        <Question>
          Hotel Type
        </Question>
        <HotelType/>
      </Section> */}
    </Container>
  );
};

export default SlideTwo;
