import styled from "styled-components";
import { useState, useEffect } from "react";
import ItineraryFlightElement from "../../newitinerary/itineraryelements/Flight";
import ItineraryElement from "../../newitinerary/itineraryelements/Index";
import ItineraryFoodElement from "../../newitinerary/itineraryelements/Food";
import ItineraryPoiElement from "../../newitinerary/itineraryelements/Poi";
import TransferElements from "./TransferElements";

const Container = styled.div`
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
      )[0]
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
      <Date>Feb 3, 2023</Date>

      <div className="border-thin" style={{ borderRadius: "10px" }}>
        {/* {Arslab_elements[0].data[0] === 'undefined' && <ItineraryFlightElement
          time="9:00AM"
          heading={Arslab_elements[0].data[0].heading}
          text={props.Days.slab_elements[0].text}
        ></ItineraryFlightElement>} */}
        {(Arslab_elements[0].data[0] == "undefined") ? (
          <TransferElements
            time="9:00AM"
            transfers={Arslab_elements[0].data[0].transfers}
            icon={Arslab_elements[0].data[0].icon}
            heading={Arslab_elements[0].data[0].heading}
            text={props.Days.slab_elements[0].text}
          ></TransferElements>
        ) : null}
        {Arslab_elements[2].data[0] ? (
          <ItineraryElement
            icon={Arslab_elements[2].data[0].icon}
            time="9:00AM"
            heading={Arslab_elements[2].data[0].heading}
            text={Arslab_elements[2].data[0].text}
          ></ItineraryElement>
        ) : null}
        {Arslab_elements[3].data[0] ? (
          <ItineraryFoodElement
            icon={Arslab_elements[3].data[0].icon}
            time="12:00PM"
            heading={Arslab_elements[3].data[0].heading}
            text={Arslab_elements[3].data[0].text}
            recomendation={Arslab_elements[4].data[0] == "undefined" && Arslab_elements[4].data[0].tesxt }
          ></ItineraryFoodElement>
        ) : null}
        {

        }
        <ItineraryPoiElement
          time="9:00AM - 12:00PM"
          image={"media/website/grey.png"}
          booking
          heading="Baapu Bazaar"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius aliquet viverra. Vivamus vitae felis ut nisl viverra molestie. Quisque."
        ></ItineraryPoiElement>
      </div>
    </Container>
  );
};

export default Day_I_Container;
