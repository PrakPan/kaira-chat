import React, { useState } from "react";
import styled from "styled-components";
import Pax from "./pax/Pax.jsx"
import GroupType from "./GroupType";
import Question from "../Question";
import Budget from "./Budget";
import BudgetSlider from "./preferences/BudgetSlider.jsx";
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
        {showPax ? (
          <Question>Group type: {props.groupType} <span onClick={() => setShowPax(false)} className="text-sm ml-2 text-blue cursor-pointer">Change</span></Question>
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

      <Section>
        <BudgetSlider
          setShowPax={setShowPax}
          setBudget={props.setBudget}
          setPriceRange={props.setPriceRange}
        ></BudgetSlider>
      </Section>

      <div
        style={{ display: "flex" }}
        onClick={() => setShowPreferences(!showPreferences)}
      >
        <Question hover_pointer>Activity Preferences?</Question>
        <div style={{ flexGrow: "1", textAlign: "right" }}>
          <AiFillCaretDown
            style={{ verticalAlign: "initial" }}
            className="hover-pointer"
          >
            {" "}
          </AiFillCaretDown>
        </div>
      </div>

      {showPreferences || props.tailoredFormModal ? (
        <Preferences
          tailoredFormModal={props.tailoredFormModal}
          selectedPreferences={props.selectedPreferences}
          setSelectedPreferences={props.setSelectedPreferences}
        ></Preferences>
      ) : null}
    </Container>
  );
};

export default SlideTwo;
