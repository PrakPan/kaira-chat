import React, { useState } from "react";
import styled from "styled-components";
import Pax from "./pax/Index";
import GroupType from "./GroupType";
import Question from "../Question";
import Budget from "./Budget";
import { AiFillCaretDown } from "react-icons/ai";
import Preferences from "./preferences/Index";

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
  const [showPreferences, setShowPreferences] = useState(false);

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
        {showPax ? (
          <Pax
            numberOfAdults={props.numberOfAdults}
            setNumberOfAdults={props.setNumberOfAdults}
            numberOfChildren={props.numberOfChildren}
            setNumberOfChildren={props.setNumberOfChildren}
            numberOfInfants={props.numberOfInfants}
            setNumberOfInfants={props.setNumberOfInfants}
          ></Pax>
        ) : (
          <GroupType
            setShowPax={setShowPax}
            _handleShowPax={_handleShowPax}
            groupType={props.groupType}
          ></GroupType>
        )}
      </Section>

      <Section>
        <Question className="font-lexend">Budget per person?</Question>
        <Budget setShowPax={setShowPax} setBudget={props.setBudget}></Budget>
      </Section>

      
    </Container>
  );
};

export default SlideTwo;
