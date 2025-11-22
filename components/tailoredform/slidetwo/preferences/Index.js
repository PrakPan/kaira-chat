import React from "react";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { BsCheck } from "react-icons/bs";
import { StyledButton, StyledFlexWrap } from "../../../styled-components/TailoredForm";
import { useDispatch, useSelector } from "react-redux";
import { togglePreference } from "../../../../store/actions/slideOneActions";
import Image from "next/image";

export const EXPERIENCE_FILTERS_BOX = [
  {
    display: "Adventure",
    actual: ["Adventure and Outdoors"],
    icon:"Adventure.svg"
  },
  {
    display: "Historical Landmarks",
    actual: ["Heritage", "Art and Culture"],
    icon:"Historical.svg"
  },
  {
    display: "Village Life",
    actual: ["Nightlife and Events", "Shopping"],
    icon:"Village.svg"
  },
  {
    display: "Culture",
    actual: ["Hidden Gem"],
    icon:"Culture.svg"
  },
  {
    display: "NightLife & Clubs",
    actual: ["Romantic"],
    icon:"Nightlife.svg"
  },
  {
    display: "Hidden Gems",
    actual: ["Romantic"],
    icon:"HiddenGems.svg"
  },
  {
    display: "Stargazing",
    actual: ["Romantic"],
    icon:"Stargazing.svg"
  },
  {
    display: "Food & Craft",
    actual: ["Romantic"],
    icon:"Food.svg"
  },
];

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
  
  // Read directly from Redux state instead of props
  const selectedPreferences = useSelector(
    (state) => state.tailoredInfoReducer.slideOne.selectedPreferences
  ) || [];
  
  
  const _isPreferenceAdded = (preference) => {
    return selectedPreferences.includes(preference);
  };
  
  const _handleClick = (preference) => {
    
    if(props?.setSelectedPreferences){
      props?.setSelectedPreferences(preference)
      dispatch(togglePreference(preference));
    } else dispatch(togglePreference(preference));
  };

  return (
    <Container>
      <StyledFlexWrap tailoredFormModal={props.tailoredFormModal}>
        {EXPERIENCE_FILTERS_BOX.map((filter, i) => {
          const isSelected = _isPreferenceAdded(filter.display);
          
          return (
            <div
              key={i}
              is_selected={isSelected.toString()}
              className="hover-pointer"
              onClick={() => _handleClick(filter.display)}
            >
              <StyledButton
                style={{ lineHeight: "1.2", alignItems: "flex-start" }}
                className="flex gap-2 flex-row center-div bg-text-white"
                clicked={isSelected}
              >
                <Image 
                  src={`/${filter.icon}`} 
                  alt={filter.display} 
                  width={15} 
                  height={15} 
                />
                {filter.display}
              </StyledButton>
            </div>
          );
        })}
      </StyledFlexWrap>
    </Container>
  );
};

export default GroupType;