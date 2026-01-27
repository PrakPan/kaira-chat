import React from "react";
import styled, { keyframes } from "styled-components";
import { fadeIn } from "react-animations";
import { BsCheck } from "react-icons/bs";
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
    display: "Culture",
    actual: ["Hidden Gem"],
    icon:"Culture.svg"
  },
  {
    display: "Historical Monuments",
    actual: ["Heritage", "Art and Culture"],
    icon:"Historical.svg"
  },
  {
    display: "Food & Craft",
    actual: ["Romantic"],
    icon:"Food.svg"
  },
  {
    display: "Stargazing",
    actual: ["Romantic"],
    icon:"Stargazing.svg"
  },
  {
    display: "Hidden Gems",
    actual: ["Romantic"],
    icon:"Hidden.svg"
  },
  {
    display: "Nightlife & Clubbing",
    actual: ["Romantic"],
    icon:"Nightlife.svg"
  },
  {
    display: "Village Life",
    actual: ["Nightlife and Events", "Shopping"],
    icon:"Village.svg"
  },
];

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
  width: 100%;
  height: 86px;

  margin: 1rem auto;
  animation: 1s ${fadeInAnimation};

  @media screen and (min-width: 768px) {
  width: 100%;
  min-width: 600px;
  height: 86px;
    padding-bottom: 0;
    margin: auto;
  }
`;

const ExperienceGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

const ExperienceCard = styled.div`
  position: relative;
  width: 100%;
  height: 86px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${props => props.isSelected ? '2px solid #f7e700' : ''};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media screen and (min-width: 768px) {
    height: 86px;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 86px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  }

  img {
    width: 100%;
    height: 86px;
    object-fit: cover;
  }
`;

const ExperienceLabel = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px; /* Add space for checkbox */
  color: white;
  opacity: 0.8;
  z-index: 2;
  height:22px;
  background-color: black; /* Add black background */
  padding: 4px 7px; /* Add padding */
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-family: Inter;
font-size: 12px;
font-weight: 600;
line-height: 16px;

  @media screen and (min-width: 768px) {
    bottom: 0px;
    left: 0px;
    right: 0px;
    font-size: 12px;
    height:22px;
    // padding: 8px 12px;
  }
`;

const CheckmarkCircle = styled.div`
  height: 10px;
  width:10px;
  border-radius: 50%;
  border: 1px solid white;
  border-width: 2px;
  background-color: ${props => props.isSelected ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s ease;
  
  svg {
    color: black;
    font-size: 14px;
    font-weight: bold;
    opacity: ${props => props.isSelected ? '1' : '0'};
    transition: opacity 0.3s ease;
  }

  @media screen and (min-width: 768px) {
    width: 14px;
    height: 14px;
    
    svg {
      font-size: 16px;
    }
  }
`;

const GroupType = (props) => {
  const dispatch = useDispatch();
  
  const selectedPreferences = useSelector(
    (state) => state.tailoredInfoReducer.slideOne.selectedPreferences
  ) || [];
  
  const _isPreferenceAdded = (preference) => {
    return selectedPreferences.includes(preference);
  };
  
  const _handleClick = (preference) => {
    dispatch(togglePreference(preference));
  };

  return (
    <Container>
      <ExperienceGrid>
        {EXPERIENCE_FILTERS_BOX.map((filter, i) => {
          const isSelected = _isPreferenceAdded(filter.display);
          
          return (
            <ExperienceCard
              key={`${filter.display}-${i}`}
              isSelected={isSelected}
              onClick={() => _handleClick(filter.display)}
            >
              
              
              <ImageWrapper>
                <Image 
                  src={`/${filter.icon}`} 
                  alt={filter.display} 
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </ImageWrapper>
              
              <ExperienceLabel>
                {filter.display} {isSelected ?
               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
  <path d="M4.275 7.25L7.75 3.8L6.7 2.75L4.275 5.125L3.3 4.15L2.25 5.225L4.275 7.25ZM5 0C6.38333 0 7.5625 0.4875 8.5375 1.4625C9.5125 2.4375 10 3.61667 10 5C10 6.38333 9.5125 7.5625 8.5375 8.5375C7.5625 9.5125 6.38333 10 5 10C3.61667 10 2.4375 9.5125 1.4625 8.5375C0.4875 7.5625 0 6.38333 0 5C0 3.61667 0.4875 2.4375 1.4625 1.4625C2.4375 0.4875 3.61667 0 5 0Z" fill="white"/>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
  <circle cx="5" cy="5" r="4.5" stroke="white"/>
</svg>}
             
              </ExperienceLabel>
            </ExperienceCard>
          );
        })}
      </ExperienceGrid>
    </Container>
  );
};

export default GroupType;