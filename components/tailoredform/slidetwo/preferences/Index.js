import React from "react";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { BsCheck } from "react-icons/bs";
import { EXPERIENCE_FILTERS_BOX } from "../../../../services/constants";

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
  width: 100%;
  margin: 1rem auto;
  animation: 1s ${fadeInAnimation};

  @media screen and (min-width: 768px) {
    padding-bottom: 0;
    margin: auto;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.tailoredFormModal ? "1fr 1fr" : "1fr 1fr 1fr"};
  grid-column-gap: 1rem;
  grid-row-gap: 0.3rem;
  width: 100%;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const OptionContainer = styled.div`
  padding: 0.5rem;
  display: grid;
  grid-template-columns: max-content auto;
  grid-gap: 8px;
  font-size: 0.8rem;
`;

const YellowContainer = styled.div`
  background-color: ${(props) =>
    props.is_selected ? "rgba(247,231,0,0.3)" : "transparent"};
  height: 1rem;
  width: 1rem;
  border-radius: 2px;
  border: 1px solid black;
  &:hover {
    background-color: ${(props) =>
      props.is_selected ? "rgba(247,231,0,0.3)" : "rgba(247,231,0,0.1)"};
    color: black;
  }
`;

const GroupType = (props) => {
  const _isPreferenceAdded = (preference) => {
    for (var i = 0; i < props.selectedPreferences.length; i++) {
      if (props.selectedPreferences[i] === preference) {
        return true;
      }
    }

    return false;
  };

  const _handleClick = (preference) => {
    let is_preference_added = _isPreferenceAdded(preference);
    if (!is_preference_added) {
      let selected_preferences = props.selectedPreferences.slice();
      selected_preferences.push(preference);
      props.setSelectedPreferences(selected_preferences);
    } else {
      let selected_preferences = [];
      for (var i = 0; i < props.selectedPreferences.length; i++) {
        if (props.selectedPreferences[i] !== preference)
          selected_preferences.push(props.selectedPreferences[i]);
        else {
        }
      }
      props.setSelectedPreferences(selected_preferences);
    }
  };

  return (
    <Container>
      <GridContainer tailoredFormModal={props.tailoredFormModal}>
        {EXPERIENCE_FILTERS_BOX.map((filter, i) => {
          return (
            <OptionContainer
              key={i}
              is_selected={_isPreferenceAdded(filter.display)}
              className=" font-lexend hover-pointer"
              onClick={() => _handleClick(filter.display)}
            >
              <div
                className="center-div"
                style={{ fontSize: "0.75rem", lineHeight: "1" }}
              >
                <YellowContainer
                  className="center-div"
                  is_selected={_isPreferenceAdded(filter.display)}
                >
                  {_isPreferenceAdded(filter.display) ? (
                    <BsCheck></BsCheck>
                  ) : null}
                </YellowContainer>
              </div>
              <div
                style={{ lineHeight: "1.2", alignItems: "flex-start" }}
                className="center-div"
              >
                {filter.display}
              </div>
            </OptionContainer>
          );
        })}
      </GridContainer>
    </Container>
  );
};

export default GroupType;
