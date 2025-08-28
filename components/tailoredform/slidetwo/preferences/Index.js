import React from "react";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { BsCheck } from "react-icons/bs";
import { EXPERIENCE_FILTERS_BOX } from "../../../../services/constants";
import { StyledButton, StyledFlexWrap } from "../../../styled-components/TailoredForm";
import { useDispatch, useSelector } from "react-redux";
import { togglePreference } from "../../../../store/actions/slideOneActions";

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
  const dispatch = useDispatch();
  const selectedPreferences = useSelector((state) => state.tailoredInfoReducer.slideOne.selectedPreferences)
  const _isPreferenceAdded = (preference) => selectedPreferences.includes(preference);
  const _handleClick = (preference) => {
    dispatch(togglePreference(preference));
  };

  return (
    <Container>
      <StyledFlexWrap tailoredFormModal={props.tailoredFormModal}>
        {EXPERIENCE_FILTERS_BOX.map((filter, i) => {
          let clicked = false
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
