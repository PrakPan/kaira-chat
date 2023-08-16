import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ItineraryFlightElement from '../../newitinerary/itineraryelements/Flight';

import ItineraryFoodElement from '../../newitinerary/itineraryelements/ItineraryFoodElement';
import { GrMapLocation } from 'react-icons/gr';
import { BiChevronRight } from 'react-icons/bi';
import TransferElements from './TransferElements';
import ItineraryElement from '../../newitinerary/itineraryelements/ItineraryElement';
import ItineraryPoiElement from '../../newitinerary/itineraryelements/Poi';
import { convertDateFormat } from '../../../helper/ConvertDateFormat';
import RecomendationComponent from '../../newitinerary/itineraryelements/RecomendationComponent';
import NewCity from './NewCity';
import { isJson } from '../../../services/isJSON';
export const DayContainerStyle = styled.div`
  display: flex;
  flex-direction: column;

  > *:not(:last-child)::after {
    content: '';
    display: block;
    border-style: none none solid none;
    border-color: #e4e4e4;
    border-width: 1px;
    width: 100%;
    @media screen and (min-width: 768px) {
      width: 83%;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    margin-bottom: 25px;
    margin-top: 25px; /* adjust this as needed */
    margin-left: auto;
  }
`;
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
const DivDayContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 0px 0px 10px 0px;
`;
const InnerDayLocationRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > div {
    padding-right: 1px;
    padding-left: 8px;
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
  function getTransportationType(url) {
    const fileName = url.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.')
    );
    const firstLetter = fileName.charAt(0).toUpperCase();
    const restOfWord = fileName.slice(1);
    const transportationType = firstLetter + restOfWord;
    return transportationType;
  }
  let dayIcontainer = [];
  function divide(JsonArray, Arslab_elements, slab) {
    JsonArray.map((element, index) => {
      switch (element.element_type) {
        case 'transfer':
          dayIcontainer.push(
            <TransferElements
              time="9:00AM"
              modes={getTransportationType(element.icon)}
              // modes={element?.modes[1] ? element?.modes[1] : element?.modes[0]}
              data={element}
              //To-do Read From Booking
              transfers={element.transfers}
              meta={element.meta}
              icon={element.icon}
              heading={element.heading}
              text={element.text}
              LastTransfer={props.LastElement}
              // newcity={
              //   Arslab_elements[1].data[0].length != 0
              //     ? Arslab_elements[1].data[0][0]
              //     : null
              // }
            ></TransferElements>
          );
          break;
        case 'newcity':
          // dayIcontainer.push(<NewCity newcity={element}></NewCity>);

          break;
        case 'accommodation':
          dayIcontainer.push(
            <ItineraryElement
              data={element}
              day={slab}
              icon={element.icon}
              time="9:00AM"
              heading={element.heading}
              text={element.text}
              city_id={element?.current_city_id}
            ></ItineraryElement>
          );
          break;
        case 'meal':
          dayIcontainer.push(
            <ItineraryFoodElement
              icon={element.icon}
              time="12:00PM"
              heading={element.heading}
              text={element.text}
            ></ItineraryFoodElement>
          );
          break;
        case 'recommendation':
          {
            !isJson(element.text)
              ? dayIcontainer.push(
                  <RecomendationComponent
                    icon={element.icon}
                    recomendation={element.text}
                    heading={element.heading}
                  ></RecomendationComponent>
                )
              : JSON.parse(element.text)?.length >= 1 &&
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
            <ItineraryPoiElement
              payment={props.payment}
              activity_data={element?.activity_data}
              getPaymentHandler={props.getPaymentHandler}
              day_slab_index={props.indexDay}
              setItinerary={props.setItinerary}
              slab_elements_index={index}
              itinerary_id={props.itinerary_id}
              data={element}
              key={element.activity_data.id}
              time="11:00AM"
              image={element.icon !== undefined ? element.icon : null}
              booking
              heading={element.heading}
              text={element.text}
              poi_id={element.activity_data.id}
              poi={
                element?.activity_data?.poi
                  ? element?.activity_data?.poi
                  : element?.activity_data
              }
              activity={element?.activity_data?.activity}
              city_id={element?.activity_data?.city?.id}
              token={props.token}
            ></ItineraryPoiElement>
          );
          break;
        default:
      }
    });
  }
  divide(props.Days.slab_elements, Arslab_elements, props.Days?.slab);

  return (
    <Container className="font-lexend">
      <DivDayContainerRow>
        <InnerDayLocationRow style={{ paddingRight: '2px' }}>
          <div className="font-bold text-black text-2xl">
            {convertDateFormat(props.Days?.slab)}
          </div>
          {/* {props.Days.slab_elements[0] !== undefined &&
          props.Days.slab_elements[0].transfers !== undefined &&
          props.Days.slab_elements[0].transfers.routes !== undefined ? (
            <div style={{ fontWeight: '600' }}>
              -{' '}
              {
                props.Days.slab_elements[0].transfers.routes[0]?.legs[0].origin
                  .shortName
              }{' '}
              to{' '}
              {
                props.Days.slab_elements[0].transfers.routes[0]?.legs[0]
                  .destination.shortName
              }
            </div>
          ) : null} */}
        </InnerDayLocationRow>
        {/* <InnerDayLocationRow>
          <GrMapLocation />
          <div>
            <a>View on Google Map</a>
          </div>
          <BiChevronRight />
        </InnerDayLocationRow> */}
      </DivDayContainerRow>
      <DayContainerStyle>
        {/* {Arslab_elements[0].data[0] === 'undefined' && <ItineraryFlightElement
          time="9:00AM"
          heading={Arslab_elements[0].data[0].heading}
          text={props.Days.slab_elements[0].text}
        ></ItineraryFlightElement>} */}
        {/* {Arslab_elements[0].data[0].length != 0 ? (
          <TransferElements
            time="9:00AM"
            modes={Arslab_elements[0].data[0][0].modes}
            transfers={Arslab_elements[0].data[0][0].transfers}
            meta={Arslab_elements[0].data[0][0].meta}
            icon={Arslab_elements[0].data[0][0].icon}
            heading={Arslab_elements[0].data[0][0].heading}
            text={props.Days.slab_elements[0].text}
            newcity={
              Arslab_elements[1].data[0].length != 0
                ? Arslab_elements[1].data[0][0]
                : null
            }
          ></TransferElements>
        ) : null}
        {Arslab_elements[0].data[0][1] ? (
          <TransferElements
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
        {Arslab_elements[0].data[0][2] ? (
          <TransferElements
            time="9:00AM"
            modes={Arslab_elements[0].data[0][2].modes}
            transfers={Arslab_elements[0].data[0][2].transfers}
            meta={Arslab_elements[0].data[0][2].meta}
            icon={Arslab_elements[0].data[0][2].icon}
            heading={Arslab_elements[0].data[0][2].heading}
            text={props.Days.slab_elements[0].text}
            newcity={null}
          ></TransferElements>
        ) : null}
        {Arslab_elements[3].data[0][0] ? (
          <ItineraryFoodElement
            icon={Arslab_elements[3].data[0][0].icon}
            time="12:00PM"
            heading={Arslab_elements[3].data[0][0].heading}
            text={Arslab_elements[3].data[0][0].text}
            recomendation={
              Arslab_elements[4].data[0][0]
                ? Arslab_elements[4].data[0][0].text
                : null
            }
          ></ItineraryFoodElement>
        ) : null}
        {Arslab_elements[4].data[0][0] && !Arslab_elements[3].data[0][0] ? (
          <RecomendationComponent
            recomendation={
              Arslab_elements[4].data[0][0]
                ? Arslab_elements[4].data[0][0].text
                : null
            }
          ></RecomendationComponent>
        ) : null}

        {Arslab_elements[5].data[0]
          ? Arslab_elements[5].data[0].map((element) => (
              <ItineraryPoiElement
                key={element.activity_data.id}
                time="11:00AM"
                image={element.icon !== undefined ? element.icon : null}
                booking
                heading={element.heading}
                text={element.text}
                poi={element.activity_data.poi}
              ></ItineraryPoiElement>
            ))
          : NULL}

        {Arslab_elements[3].data[0][1] ? (
          <ItineraryFoodElement
            icon={Arslab_elements[3].data[0][1].icon}
            time="12:00PM"
            heading={Arslab_elements[3].data[0][1].heading}
            text={Arslab_elements[3].data[0][1].text}
            recomendation={
              Arslab_elements[4].data[0][1]
                ? Arslab_elements[4].data[0][1].text
                : null
            }
          ></ItineraryFoodElement>
        ) : null} */}
        {dayIcontainer}
      </DayContainerStyle>
    </Container>
  );
};

export default Day_I_Container;
