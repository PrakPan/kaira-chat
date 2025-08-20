import React from "react";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { BsCheck } from "react-icons/bs";
import { EXPERIENCE_FILTERS_BOX } from "../../../../services/constants";
import { StyledButton,StyledFlexWrap } from "../../../styled-components/TailoredForm";

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
      <StyledFlexWrap tailoredFormModal={props.tailoredFormModal}>
        {EXPERIENCE_FILTERS_BOX.map((filter, i) => {
          let clicked=false
          return (
            <div
              key={i}
              is_selected={_isPreferenceAdded(filter.display)}
              className="hover-pointer"
              onClick={() => _handleClick(filter.display)}
            >
              <StyledButton
                style={{ lineHeight: "1.2", alignItems: "flex-start" }}
                className="center-div"
                clicked={_isPreferenceAdded(filter.display)}
              >
                {filter.display}
              </StyledButton>
            </div>
          );
        })}
      </StyledFlexWrap>
      <div className="mt-[30px] border-[1px]"></div>
    </Container>
  );
};

export default GroupType;
