 
import React, {useState, useEffect } from 'react';
  import NewDatePicker from './NewDatePicker'
import media from '../../media';
 
import styled from 'styled-components';
 import Destinations from './destinations/Index';
 import Question from '../Question';
import Dates from './Dates';
import StartingLocation from './startinglocation/Index';
import {BsCheck} from 'react-icons/bs'
const Container = styled.div`
color: black;
width: 100%;
  @media screen and (min-width: 768px){
 
}

`;

const Section = styled.div`
margin-bottom: 1rem;
`;
const SlideOne = (props) =>{
  const getHeading = () => {
    if (props.tailoredFormModal && props.focusedDate) {
      if (props.focusedDate == "startDate") return "Please select start date.";
      if (props.focusedDate == "endDate") return "Please select end date.";
    }
    else return "What do you want to explore?";
  };
  let isPageWide = media('(min-width: 768px)');
  const CITIES = null;
  // const [selectedCities, setSelectedCities] = useState([]);

   return (
     <Container>
       <Section>
         <Question>{getHeading()}</Question>

         <Destinations
           startingLocation={props.startingLocation}
           tailoredFormModal={props.tailoredFormModal}
           initialInputId={props.initialInputId}
           setStartingLocation={props.setStartingLocation}
           showSearchStarting={props.showSearchStarting}
           children_cities={props.children_cities}
           setDestination={props.setDestination}
           setShowSearchStarting={props.setShowSearchStarting}
           showCities={props.showCities}
           setShowCities={props.setShowCities}
           destination={props.destination}
           CITIES={props.cities ? props.cities : CITIES}
           selectedCities={props.selectedCities}
           setSelectedCities={props.setSelectedCities}
         ></Destinations>
       </Section>
       <Section>
         <Question
           style={{ visibility: props.showCities ? "hidden" : "visible" }}
           margin="0 0 1rem 0"
         >
           When are you planning to travel?
         </Question>
         {/* <Dates 
showCities={props.showCities}
 valueStart={props.valueStart}
 valueEnd={props.valueEnd}
 setValueStart={props.setValueStart}
 setValueEnd={props.setValueEnd}
></Dates> */}
         <NewDatePicker
           focusedDate={props.focusedDate}
           setFocusedDate={props.setFocusedDate}
           tailoredFormModal={props.tailoredFormModal}
           valueStart={props.valueStart}
           valueEnd={props.valueEnd}
           setValueStart={props.setValueStart}
           setValueEnd={props.setValueEnd}
         />
         <div
           className="hover-pointer"
           style={{
             display: "flex",
             gap: "0.5rem",
             alignItems: "center",
             marginTop: "1rem",
             marginLeft: "2px",
           }}
         >
           <div onClick={() => props.setFlexible(!props.flexible)}>
             <div
               className="center-div"
               style={{
                 border: "2px solid #01202B",
                 color: "black",
                 lineHeight: "1",
                 fontSize: "0.75rem",
                 borderRadius: "3px",
                 opacity: "1",
                 height: "20px",
                 width: "20px",
                 backgroundColor: props.flexible
                   ? "rgba(247,231,0,1)"
                   : "transparent",
               }}
             >
               {props.flexible ? <BsCheck></BsCheck> : null}
             </div>
           </div>
           <div
             onClick={() => props.setFlexible(!props.flexible)}
             className="font-lexend"
             style={{ fontSize: "0.8rem" }}
           >
             Not sure? Let us decide best time for your trip.
           </div>
         </div>
       </Section>
       <Section style={{ marginBottom: "0.5rem" }}>
         {/* <StartingLocation></StartingLocation> */}
       </Section>
     </Container>
   );
}


export default SlideOne;

 