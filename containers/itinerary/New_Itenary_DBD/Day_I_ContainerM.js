import styled from "styled-components";
import { useState, useEffect } from "react";
import ItineraryFlightElement from "../../newitinerary/itineraryelements/Flight";

import ItineraryPoiElement from "../../newitinerary/itineraryelements/Poi";

import TransferElementsM from "./TransferElementsM";
import ItineraryElementM from "../../newitinerary/itineraryelements/ItineraryElementM";
import ItineraryFoodElementM from "../../newitinerary/itineraryelements/ItineraryFoodElementM";
import ItineraryPoiElementM from "../../newitinerary/itineraryelements/PoiM";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import RecomendationComponent from "../../newitinerary/itineraryelements/RecomendationComponent";
import ItineraryFoodElement from "../../newitinerary/itineraryelements/ItineraryFoodElement";
import { DayContainerStyle } from "./Day_I_Container";
import { isJson } from "../../../services/isJSON";
import TransferElement from "../../../components/itinerary/daySummary/TransferElement";
import AccommodationElement from "../../../components/itinerary/daySummary/AccommodationElement";
import ActivityElement from "../../../components/itinerary/daySummary/ActivityElement";
import { getDate } from "../../../helper/DateUtils";
import ViewMoreButton from "../../../components/itinerary/daySummary/ViewMoreButton";
import { DaySummaryContainerStyle } from "./Day_I_Container";

const Container = styled.div`
  background: #ffffff;
  border: 1.5px solid #eceaea;
  margin-top: 20px;
  padding: 20px;

  box-shadow: 0px 3px 0px #f0f0f0;
  margin: 4rem -0.8rem 0 -0.8rem;
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

const Day_I_ContainerM = (props) => {
  const [viewMore, setViewMore] = useState(true);
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
  function divides(JsonArray, Arslab_elements) {
    Arslab_elements.forEach((Arslab_element) =>
      filter(JsonArray, Arslab_element.name, Arslab_element.data)
    );
  }
  function getTransportationType(url) {
    const fileName = url.substring(
      url.lastIndexOf("/") + 1,
      url.lastIndexOf(".")
    );
    const firstLetter = fileName.charAt(0).toUpperCase();
    const restOfWord = fileName.slice(1);
    const transportationType = firstLetter + restOfWord;
    return transportationType;
  }

  const handleViewMoreButton = () => {
    setViewMore((prev) => !prev);
  };

  let summaryIContainer = [];
  let newCity;
  function setSymmaryElements(elements) {
    let activities = [];
    elements.map((element, index) => {
      switch (element.element_type) {
        case "transfer":
          summaryIContainer.push(
            <TransferElement
              key={`summary_transfer_${index}`}
              modes={getTransportationType(element.icon)}
              heading={element.heading}
              booking={props.transferBookings}
              meta={element.meta}
              data={element}
              transfers={element.transfers}
            />
          );
          break;
        case "newcity":
          newCity = element.city_data.city_name;
          break;
        case "accommodation":
          if (element.bookings && element.bookings.length) {
            summaryIContainer.push(
              <AccommodationElement
                key={`summary_accommodation_${index}`}
                heading={element.heading}
                meta={element.meta}
                data={element}
                city_id={element?.current_city_id}
                booking={props.stayBookings}
              />
            );
          }
          break;
        case "activity":
          activities.push({
            heading: element.heading,
            text: element.text,
            image: element.icon !== undefined ? element.icon : null,
            poi: element?.activity_data?.poi
              ? element?.activity_data?.poi
              : element?.activity_data,
            activity: element?.activity_data?.activity,
            activity_data: element?.activity_data,
          });
          break;
        default:
      }
    });

    if (activities.length) {
      summaryIContainer.push(
        <ActivityElement
          key={`summary_activity`}
          activities={activities}
          date={props.Days?.date}
          day_slab_index={props?.indexDay}
          itinerary_id={props.itinerary_id}
          getPaymentHandler={props.getPaymentHandler}
          getAccommodationAndActivitiesHandler={
            props.getAccommodationAndActivitiesHandler
          }
          setShowLoginModal={props.setShowLoginModal}
          setItinerary={props.setItinerary}
        />
      );
    }
  }
  setSymmaryElements(props.Days.slab_elements);

  divides(props.Days.slab_elements, Arslab_elements);
  let dayIcontainer = [];
  function divide(JsonArray, Arslab_elements) {
    JsonArray.map((element, index) => {
      switch (element.element_type) {
        case "transfer":
          dayIcontainer.push(
            <TransferElementsM
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
              booking={props.transferBookings}
              // newcity={
              //   Arslab_elements[1].data[0].length != 0
              //     ? Arslab_elements[1].data[0][0]
              //     : null
              // }
            ></TransferElementsM>
          );
          break;
        case "newcity":
          // dayIcontainer.push(<NewCity newcity={element}></NewCity>);

          break;
        case "accommodation":
          dayIcontainer.push(
            <ItineraryElementM
              data={element}
              icon={element.icon}
              time="9:00AM"
              booking={props.stayBookings}
              heading={element.heading}
              text={element.text}
            ></ItineraryElementM>
          );
          break;
        case "meal":
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
        case "recommendation":
          {
            !isJson(element.text)
              ? dayIcontainer.push(
                  <RecomendationComponent
                    icon={element.icon}
                    recomendation={element.text}
                    heading={element.heading}
                  ></RecomendationComponent>
                )
              : element.text &&
                JSON.parse(element.text)?.length >= 1 &&
                dayIcontainer.push(
                  <RecomendationComponent
                    icon={element.icon}
                    recomendation={element.text}
                    heading={element.heading}
                  ></RecomendationComponent>
                );
          }
          break;
        case "activity":
          dayIcontainer.push(
            <ItineraryPoiElementM
              payment={props.payment}
              activity_data={element?.activity_data}
              getPaymentHandler={props?.getPaymentHandler}
              day_slab_index={props?.indexDay}
              setItinerary={props?.setItinerary}
              slab_elements_index={index}
              itinerary_id={props?.itinerary_id}
              data={element}
              key={element?.activity_data?.id}
              time="11:00AM"
              image={element?.icon !== undefined ? element?.icon : null}
              booking
              heading={element?.heading}
              text={element?.text}
              poi_id={element?.activity_data?.id}
              poi={
                element?.activity_data?.poi
                  ? element?.activity_data?.poi
                  : element?.activity_data
              }
              activity={element?.activity_data?.activity}
              city_id={element?.activity_data?.city?.id}
              setShowLoginModal={props.setShowLoginModal}
              getAccommodationAndActivitiesHandler={
                props.getAccommodationAndActivitiesHandler
              }
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
        style={{ paddingTop: "4px", display: "flex", alignItems: "center" }}
        className="pb-4 justify-between"
      >
        <div
          className={`${
            viewMore
              ? "font-bold text-black text-2xl"
              : "text-black text-base font-bold"
          }`}
        >
          {convertDateFormat(props.Days?.slab)}, {getDate(props?.Days?.slab)} -{" "}
          {newCity
            ? `Arrival in ${newCity}`
            : `${props.current_cityName} Exploration`}
        </div>

        <ViewMoreButton
          text={viewMore ? "View Less" : "View More"}
          handler={handleViewMoreButton}
          isMob={true}
        />

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

        {viewMore ? (
          <DayContainerStyle>{dayIcontainer}</DayContainerStyle>
        ) : (
          <DaySummaryContainerStyle>
            {summaryIContainer}
          </DaySummaryContainerStyle>
        )}

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
