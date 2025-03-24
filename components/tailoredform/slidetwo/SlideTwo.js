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
        {showPax ? (
          <Question>
            <p>
            <span className="text-gray-700 font-normal">Group type: </span> {props.groupType}{" "}
            </p>
            <span
              onClick={() => setShowPax(false)}
              className="text-sm ml-2 text-blue cursor-pointer"
            >
              Change
            </span>
          </Question>
        ) : (
          <Question>Your group type?</Question>
        )}
        {showPax ? (
          <Pax
            numberOfAdults={props.numberOfAdults}
            setNumberOfAdults={props.setNumberOfAdults}
            numberOfChildren={props.numberOfChildren}
            setNumberOfChildren={props.setNumberOfChildren}
            numberOfInfants={props.numberOfInfants}
            setNumberOfInfants={props.setNumberOfInfants}
            setRoomConfiguration={props.setRoomConfiguration}
          ></Pax>
        ) : (
          <GroupType
            setShowPax={setShowPax}
            _handleShowPax={_handleShowPax}
            groupType={props.groupType}
          ></GroupType>
        )}
      </Section>

      {/* <Section>
        <Question>
          Hotel Type
        </Question>
        <HotelType/>
      </Section> */}

      <Section>
        <BudgetSlider
          setShowPax={setShowPax}
          setBudget={props.setBudget}
          setPriceRange={props.setPriceRange}
        ></BudgetSlider>
      </Section>
    </Container>
  );
};

export default SlideTwo;
