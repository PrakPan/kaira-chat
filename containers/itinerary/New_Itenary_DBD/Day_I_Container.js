import styled from "styled-components";
import { useState, useEffect } from "react";
import ItineraryFlightElement from "../../newitinerary/itineraryelements/Flight";

import ItineraryFoodElement from "../../newitinerary/itineraryelements/ItineraryFoodElement";


import TransferElements from "./TransferElements";
import ItineraryElement from "../../newitinerary/itineraryelements/ItineraryElement";
import ItineraryPoiElement from "../../newitinerary/itineraryelements/Poi";


const Container = styled.div`
background: #FFFFFF;
border: 1.5px solid #ECEAEA;
margin-top: 20px;
padding: 20px;
box-shadow: 0px 3px 0px #F0F0F0;
border-radius: 16px;
  @media screen and (min-width: 768px) {
    
  }
`;

const Date = styled.div`
  width: max-content;
  border-radius: 2rem;
  margin: 1rem auto;
  padding: 0.25rem 1rem;
  background-color: #f4f4f4;
  font-weight: 300;
`;

// function ElementsSpreader(slab_elements){
//         for
// }
const Day_I_Container = (props) => {
  const Arslab_elements = [
    { name: "transfer", data: [] },
    { name: "newcity", data: [] },
    { name: "accommodation", data: [] },
    { name: "meal", data: [] },
    { name: "recommendation", data: [] },
    { name: "activity", data: [] },
  ];
  function filter(JsonArray, Arslab_element_name, Arslab_element_data) {
    Arslab_element_data.push(
      JsonArray.filter(
        (JSElement) => JSElement.element_type == Arslab_element_name
      )
    );
  }
  function divide(JsonArray, Arslab_elements) {
    Arslab_elements.forEach((Arslab_element) =>
      filter(JsonArray, Arslab_element.name, Arslab_element.data)
    );
  }
  divide(props.Days.slab_elements, Arslab_elements);
  console.log(Arslab_elements);
  return (
    <Container className="font-poppins">
      {/* <Date>Feb 3, 2023</Date> */}

      <div>
        {/* {Arslab_elements[0].data[0] === 'undefined' && <ItineraryFlightElement
          time="9:00AM"
          heading={Arslab_elements[0].data[0].heading}
          text={props.Days.slab_elements[0].text}
        ></ItineraryFlightElement>} */}
        {Arslab_elements[0].data[0].length != 0 ? (
          <TransferElements
            time="9:00AM"
            modes={Arslab_elements[0].data[0][0].modes}
            transfers={Arslab_elements[0].data[0][0].transfers}
            meta={Arslab_elements[0].data[0][0].meta}
            
            icon={Arslab_elements[0].data[0][0].icon}
            heading={Arslab_elements[0].data[0][0].heading}
            text={props.Days.slab_elements[0].text}
            newcity={Arslab_elements[1].data[0].length != 0 ? Arslab_elements[1].data[0][0] : null }
          ></TransferElements>
        ) : null}
        
        
        {Arslab_elements[2].data[0][0] ? (
          <ItineraryElement
            icon={Arslab_elements[2].data[0][0].icon}
            time="9:00AM"
            heading={Arslab_elements[2].data[0][0].heading}
            text={Arslab_elements[2].data[0][0].text}
          ></ItineraryElement>
        ) : null}
        {Arslab_elements[3].data[0][0] ? (
          <ItineraryFoodElement
            icon={Arslab_elements[3].data[0][0].icon}
            time="12:00PM"
            heading={Arslab_elements[3].data[0][0].heading}
            text={Arslab_elements[3].data[0][0].text}
            recomendation={Arslab_elements[4].data[0][0] ? Arslab_elements[4].data[0][0].text : null }
          ></ItineraryFoodElement>
        ) : null}
        
        {
          Arslab_elements[5].data[0] ?
          Arslab_elements[5].data[0].map((element)=>(
            <ItineraryPoiElement
              key={element.activity_data.id}
            time="9:00AM - 12:00PM"
            image={element.activity_data.poi !== undefined ? element.activity_data.poi.image : null }
            booking
            heading={element.heading}
            text={element.text}
            poi={element.activity_data.poi}
          ></ItineraryPoiElement>
          ))
        
          : NULL
        }
       

{Arslab_elements[3].data[0][1] ? (
          <ItineraryFoodElement
            icon={Arslab_elements[3].data[0][1].icon}
            time="12:00PM"
            heading={Arslab_elements[3].data[0][1].heading}
            text={Arslab_elements[3].data[0][1].text}
            recomendation={Arslab_elements[4].data[0][1] ? Arslab_elements[4].data[0][1].text : null }
          ></ItineraryFoodElement>
        ) : null}
      </div>
    </Container>
  );
};

export default Day_I_Container;
