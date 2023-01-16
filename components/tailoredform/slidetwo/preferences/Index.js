import React  from 'react';
import styled, {keyframes} from 'styled-components';
import { fadeIn } from 'react-animations'
 
const fadeInAnimation = keyframes`${fadeIn}`;
 const Container = styled.div`
    width: 100%;
    margin: 1rem auto;
    animation: 1s ${fadeInAnimation};

     @media screen and (min-width: 768px){
        padding-bottom: 0;
        margin: auto;
    }
`;


const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 1rem;
width: 100%;
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
 }
`;
 const OptionContainer = styled.div`
    padding: 0.5rem;
    text-align: center;
    border-radius: 10px;
    font-size: 0.8rem;
    background-color: ${(props) => (props.is_selected ? 'rgba(247,231,0,0.3)' : "transparent")};

    &:hover{
        background-color: ${(props) => (props.is_selected ? 'rgba(247,231,0,0.3)' : "rgba(247,231,0,0.1)")};
  color: black;
    }
 `;
 
const GroupType = (props) => {
    const _isPreferenceAdded =  (preference) => {
        // console.log('1', city);
        // var i;
        // console.log(props.selectedCities);
        for (var i = 0; i < props.selectedPreferences.length; i++) {
            if (props.selectedPreferences[i] === preference) {
                return true;
            }
        }
      
        return false;
      }
    const _handleClick = (preference) => {
        // console.log(preference)
        let is_preference_added = _isPreferenceAdded(preference);
        console.log(is_preference_added)
        if(!is_preference_added){
            let selected_preferences = props.selectedPreferences.slice();
            selected_preferences.push(preference)
            props.setSelectedPreferences(selected_preferences)
            }
        else{
            let selected_preferences =[];
            for(var i = 0 ; i < props.selectedPreferences.length; i++){
              if(props.selectedPreferences[i] !== preference)          selected_preferences.push(props.selectedPreferences[i]);
              
              else {
                // selected_cities.push(city);
              }
            }
            props.setSelectedPreferences(selected_preferences)
      
        }
    }
     
     return(
        <Container>
            <GridContainer>
                <OptionContainer  is_selected={_isPreferenceAdded('Adventure & Outdoor')} className='border-thin font-opensans hover-pointer center-div' onClick={() => _handleClick('Adventure & Outdoor')}>
                Nature & Retreat
                </OptionContainer>
                <OptionContainer  is_selected={_isPreferenceAdded('Nature & Retreat')} className='border-thin font-opensans hover-pointer center-div' onClick={() => _handleClick('Nature & Retreat')}>
                Nightlife & Shopping 
                </OptionContainer>
                <OptionContainer  is_selected={_isPreferenceAdded('Heritage & Culture')} className='border-thin font-opensans hover-pointer center-div'  onClick={() => _handleClick('Heritage & Culture')}>
                Adventure & Outdoors
                </OptionContainer>
                <OptionContainer  is_selected={_isPreferenceAdded('Adventure & Outdoo')} className='border-thin font-opensans hover-pointer center-div' onClick={() => _handleClick('Adventure & Outdoo')}>
                Heritage & Culture
                </OptionContainer>
                <OptionContainer  is_selected={_isPreferenceAdded('Nature & Retrea')} className='border-thin font-opensans hover-pointer center-div' onClick={() => _handleClick('Nature & Retrea')}>
                Romantic
                </OptionContainer>
                <OptionContainer  is_selected={_isPreferenceAdded('Heritage & Cultur')} className='border-thin font-opensans hover-pointer center-div' onClick={() => _handleClick('Heritage & Cultur')}>
                Science & Knowledge
                </OptionContainer>
            </GridContainer>
        </Container>
    );
   
}

export default GroupType;