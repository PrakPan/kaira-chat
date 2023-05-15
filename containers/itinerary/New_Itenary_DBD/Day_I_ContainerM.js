import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ItineraryFlightElement from '../../newitinerary/itineraryelements/Flight';

import ItineraryPoiElement from '../../newitinerary/itineraryelements/Poi';

import TransferElementsM from './TransferElementsM';
import ItineraryElementM from '../../newitinerary/itineraryelements/ItineraryElementM';
import ItineraryFoodElementM from '../../newitinerary/itineraryelements/ItineraryFoodElementM';
import ItineraryPoiElementM from '../../newitinerary/itineraryelements/PoiM';
import { convertDateFormat } from '../../../pages/helper/ConvertDateFormat';
import RecomendationComponent from '../../newitinerary/itineraryelements/RecomendationComponent';
import ItineraryFoodElement from '../../newitinerary/itineraryelements/ItineraryFoodElement';
import { DayContainerStyle } from './Day_I_Container';

const Container = styled.div`
  background: #ffffff;
  border: 1.5px solid #eceaea;
  margin-top: 20px;
  padding: 20px;

  box-shadow: 0px 3px 0px #f0f0f0;
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
const Day_I_ContainerM = (props) => {
  const Arslab_elements = [
    { name: 'transfer', data: [] },
    { name: 'newcity', data: [] },
    { name: 'accommodation', data: [] },
    { name: 'meal', data: [] },
    { name: 'recommendation', data: [] },
    { name: 'activity', data: [] },
  ];
  function filter(JsonArray, Arslab_element_name, Arslab_element_data) {
    Arslab_element_data.push(
      JsonArray.filter(
        (JSElement) => JSElement.element_type == Arslab_element_name
      )
    );
  }
  function divides(JsonArray, Arslab_elements) {
    Arslab_elements.forEach((Arslab_element) =>
      filter(JsonArray, Arslab_element.name, Arslab_element.data)
    );
  }
  divides(props.Days.slab_elements, Arslab_elements);
  let dayIcontainer = [];
  function divide(JsonArray, Arslab_elements) {
    JsonArray.forEach(function (element) {
      switch (element.element_type) {
        case 'transfer':
          dayIcontainer.push(
            <TransferElementsM
              time="9:00AM"
              modes={element.modes}
              transfers={element.transfers}
              meta={element.meta}
              icon={element.icon}
              heading={element.heading}
              bookings={element.bookings}
              text={props.Days.slab_elements[0].text}
              booking={element?.bookings ? element?.bookings[0] : null}
              // newcity={
              //   Arslab_elements[1].data[0].length != 0
              //     ? Arslab_elements[1].data[0][0]
              //     : null
              // }
            ></TransferElementsM>
          );
          break;
        case 'newcity':
          // dayIcontainer.push(<NewCity newcity={element}></NewCity>);

          break;
        case 'accommodation':
          dayIcontainer.push(
            <ItineraryElementM
              icon={element.icon}
              time="9:00AM"
              booking={element?.bookings ? element?.bookings[0] : null}
              heading={element.heading}
              text={element.text}
            ></ItineraryElementM>
          );
          break;
        case 'meal':
          dayIcontainer.push(
            <ItineraryFoodElementM
              icon={element.icon}
              time="12:00PM"
              bookings={element?.bookings ? element?.bookings : null}
              heading={element.heading}
              text={element.text}
            ></ItineraryFoodElementM>
          );
          break;
        case 'recommendation':
          {
            JSON.parse(element.text).length >= 1 &&
              dayIcontainer.push(
                <RecomendationComponent
                  icon={element.icon}
                  recomendation={element.text}
                  heading={element.heading}
                ></RecomendationComponent>
              );
          }
          break;
        case 'activity':
          dayIcontainer.push(
            <ItineraryPoiElementM
              key={element.activity_data.id}
              time="11:00AM"
              image={element.icon !== undefined ? element.icon : null}
              booking
              heading={element.heading}
              text={element.text}
              poi={element.activity_data.poi}
            ></ItineraryPoiElementM>
          );
          break;
        default:
          console.log(`Sorry, we are out of ${element.element_type}.`);
      }
    });
  }
  divide(props.Days.slab_elements, Arslab_elements);

  return (
    <Container className="font-lexend">
      <div
        style={{ paddingTop: '4px', display: 'flex', alignItems: 'center' }}
        className="pb-4"
      >
        <div className="font-bold  text-black text-lg">
          Day {props.indexDay + 1}
        </div>
        {/* {Arslab_elements[0].data[0][0] !== undefined &&
        Arslab_elements[0].data[0][0].transfers !== undefined &&
        Arslab_elements[0].data[0][0].transfers.routes !== undefined ? (
          <div style={{ fontWeight: '600' }}>
            -{' '}
            {
              Arslab_elements[0].data[0][0].transfers.routes[0]?.legs[0].origin
                .shortName
            }{' '}
            to{' '}
            {
              Arslab_elements[0].data[0][0].transfers.routes[0]?.legs[0]
                .destination.shortName
            }
          </div>
        ) : null} */}
      </div>

      <div>
        {/* {Arslab_elements[0].data[0] === 'undefined' && <ItineraryFlightElement
          time="9:00AM"
          heading={Arslab_elements[0].data[0].heading}
          text={props.Days.slab_elements[0].text}
        ></ItineraryFlightElement>} */}
        <DayContainerStyle>{dayIcontainer}</DayContainerStyle>

        {/* {Arslab_elements[0].data[0].length != 0 ? (
          <TransferElementsM
            time="9:00AM"
            modes={Arslab_elements[0].data[0][0].modes}
            transfers={Arslab_elements[0].data[0][0].transfers}
            meta={Arslab_elements[0].data[0][0].meta}
            icon={Arslab_elements[0].data[0][0].icon}
            heading={Arslab_elements[0].data[0][0].heading}
            bookings={Arslab_elements[0].data[0][0].bookings}
            text={props.Days.slab_elements[0].text}
            newcity={
              Arslab_elements[1].data[0].length != 0
                ? Arslab_elements[1].data[0][0]
                : null
            }
          ></TransferElementsM>
        ) : null} */}

        {/* {Arslab_elements[2].data[0][0] ? (
          <ItineraryElementM
            icon={Arslab_elements[2].data[0][0].icon}
            time="9:00AM"
            bookings={Arslab_elements[2].data[0][0].bookings}
            heading={Arslab_elements[2].data[0][0].heading}
            text={Arslab_elements[2].data[0][0].text}
          ></ItineraryElementM>
        ) : null}
        {Arslab_elements[0].data[0][1] ? (
          <TransferElementsM
            time="9:00AM"
            modes={Arslab_elements[0].data[0][1].modes}
            transfers={Arslab_elements[0].data[0][1].transfers}
            meta={Arslab_elements[0].data[0][1].meta}
            icon={Arslab_elements[0].data[0][1].icon}
            heading={Arslab_elements[0].data[0][1].heading}
            text={props.Days.slab_elements[0].text}
            newcity={
              Arslab_elements[1].data[0][1]
                ? Arslab_elements[1].data[0][1]
                : null
            }
          ></TransferElementsM>
        ) : null}
        {Arslab_elements[0].data[0][2] ? (
          <TransferElementsM
            time="9:00AM"
            modes={Arslab_elements[0].data[0][2].modes}
            transfers={Arslab_elements[0].data[0][2].transfers}
            meta={Arslab_elements[0].data[0][2].meta}
            icon={Arslab_elements[0].data[0][2].icon}
            heading={Arslab_elements[0].data[0][2].heading}
            text={props.Days.slab_elements[0].text}
            newcity={
              Arslab_elements[1].data[0][1]
                ? Arslab_elements[1].data[0][0]
                : null
            }
          ></TransferElementsM>
        ) : null}
        {Arslab_elements[3].data[0][0] ? (
          <ItineraryFoodElementM
            icon={Arslab_elements[3].data[0][0].icon}
            time="12:00PM"
            bookings={Arslab_elements[3].data[0][0].bookings}
            heading={Arslab_elements[3].data[0][0].heading}
            text={Arslab_elements[3].data[0][0].text}
            recomendation={
              Arslab_elements[4].data[0][0]
                ? Arslab_elements[4].data[0][0].text
                : null
            }
          ></ItineraryFoodElementM>
        ) : null} */}
        {/* {Arslab_elements[4].data[0][0] && !Arslab_elements[3].data[0][0] ? (
          <RecomendationComponent
            recomendation={
              Arslab_elements[4].data[0][0]
                ? Arslab_elements[4].data[0][0].text
                : null
            }
          ></RecomendationComponent>
        ) : null}
        {}
        {Arslab_elements[5].data[0]
          ? Arslab_elements[5].data[0].map((element) => (
              <ItineraryPoiElementM
                key={element.activity_data.id}
                time="9:00AM - 12:00PM"
                image={
                  element.activity_data.poi !== undefined
                    ? element.activity_data.poi.image
                    : null
                }
                booking={
                  element.activity_data.poi !== undefined
                    ? element.activity_data.poi.image
                    : null
                }
                heading={element.heading}
                text={element.text}
                poi={element.activity_data.poi}
              ></ItineraryPoiElementM>
            ))
          : NULL}

        {Arslab_elements[3].data[0][1] ? (
          <ItineraryFoodElementM
            icon={Arslab_elements[3].data[0][1].icon}
            time="12:00PM"
            bookings={Arslab_elements[3].data[0][1].bookings}
            heading={Arslab_elements[3].data[0][1].heading}
            text={Arslab_elements[3].data[0][1].text}
            recomendation={
              Arslab_elements[4].data[0][1]
                ? Arslab_elements[4].data[0][1].text
                : null
            }
          ></ItineraryFoodElementM>
        ) : null} */}
      </div>
    </Container>
  );
};

export default Day_I_ContainerM;
