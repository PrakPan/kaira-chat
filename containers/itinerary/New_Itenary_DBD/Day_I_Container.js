import styled from "styled-components";
import { useState } from "react";
import ItineraryFoodElement from "../../newitinerary/itineraryelements/ItineraryFoodElement";
import TransferElements from "./TransferElements";
import ItineraryElement from "../../newitinerary/itineraryelements/ItineraryElement";
import ItineraryPoiElement from "../../newitinerary/itineraryelements/Poi";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import RecomendationComponent from "../../newitinerary/itineraryelements/RecomendationComponent";
import { isJson } from "../../../services/isJSON";
import ViewMoreButton from "../../../components/itinerary/daySummary/ViewMoreButton";
import TransferElement from "../../../components/itinerary/daySummary/TransferElement";
import AccommodationElement from "../../../components/itinerary/daySummary/AccommodationElement";
import ActivityElement from "../../../components/itinerary/daySummary/ActivityElement";
import PoiElement from "../../../components/itinerary/daySummary/PoiElement";
import { getYear } from "../../../helper/DateUtils";
import ActivityAddDrawer from "../../../components/drawers/poiDetails/activityAddDrawer";

export const DayContainerStyle = styled.div`
  display: flex;
  flex-direction: column;

  > *:not(:last-child)::after {
    content: "";
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

export const DaySummaryContainerStyle = styled.div`
  display: flex;
  flex-direction: column;

  > *:not(:last-child)::after {
    content: "";
    display: block;
    border-style: none none none none;
    border-color: #e4e4e4;
    border-width: 1px;
    width: 100%;
    @media screen and (min-width: 768px) {
      width: 83%;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    margin-bottom: 0px;
    margin-top: 25px; /* adjust this as needed */
    margin-left: auto;
  }
`;

const ReccoIcon = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  @media screen and (min-width: 768px) {
    width: 6.15rem;
    justify-content: start;
    padding-bottom: 0rem;
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

const Day_I_Container = (props) => {
  const [viewMore, setViewMore] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
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
    let pois = [];
    elements.map((element, index) => {
      switch (element.element_type) {
        case "transfer":
          if (element.bookings && element.bookings.length) {
            summaryIContainer.push(
              <TransferElement
                key={`summary_transfer_${props.indexDay}-${index}`}
                modes={getTransportationType(element.icon)}
                heading={element.heading}
                booking={props.transferBookings}
                meta={element.meta}
                data={element}
                transfers={element.transfers}
              />
            );
          }
          break;
        case "newcity":
          newCity = element.city_data;
          break;
        case "accommodation":
          if (element.bookings && element.bookings.length) {
            summaryIContainer.push(
              <AccommodationElement
                key={`summary_accommodation_${props.indexDay}-${index}`}
                heading={element.heading}
                meta={element.meta}
                data={element}
                city_id={element?.current_city_id}
                booking={props.stayBookings}
                payment={props.payment}
                plan={props.plan}
                setShowBookingModal={props.setShowBookingModal}
              />
            );
          }
          break;
        case "activity":
          if (
            element.activity_data.activity &&
            Object.keys(element?.activity_data?.activity).length !== 0 &&
            element?.bookings &&
            element?.bookings.length
          ) {
            summaryIContainer.push(
              <ActivityElement
                key={`${props.indexDay}-${index}-${element?.activity_data?.id}`}
                data={element}
                booking={props.activityBookings}
                city_id={element?.current_city_id}
              />
            );
          } else {
            pois.push({
              heading: element.heading,
              text: element.text,
              image: element.icon !== undefined ? element.icon : null,
              poi: element?.activity_data?.poi,
              activity: element?.activity_data?.activity,
              activity_data: element?.activity_data,
            });
          }
          break;
        default:
      }
    });

    if (pois.length) {
      summaryIContainer.push(
        <PoiElement key={`summary_poi`} pois={pois} setViewMore={setViewMore} />
      );
    }
  }
  setSymmaryElements(props.Days.slab_elements);

  let dayIcontainer = [];
  function divide(JsonArray, Arslab_elements, slab) {
    JsonArray.map((element, index) => {
      switch (element.element_type) {
        case "transfer":
          dayIcontainer.push(
            <TransferElements
              time="9:00AM"
              booking={props.transferBookings}
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
        case "newcity":
          // dayIcontainer.push(<NewCity newcity={element}></NewCity>);

          break;
        case "accommodation":
          dayIcontainer.push(
            <ItineraryElement
              data={element}
              booking={props.stayBookings}
              day={slab}
              icon={element.icon}
              time="9:00AM"
              heading={element.heading}
              text={element.text}
              city_id={element?.current_city_id}
            ></ItineraryElement>
          );
          break;
        case "meal":
          dayIcontainer.push(
            <ItineraryFoodElement
              icon={element.icon}
              time="12:00PM"
              heading={element.heading}
              text={element.text}
            ></ItineraryFoodElement>
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
        case "activity":
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
              key={`${props.indexDay}-${index}-${element?.activity_data?.id}`}
              time="11:00AM"
              image={element.icon !== undefined ? element.icon : null}
              booking
              heading={element.heading}
              text={element.text}
              poi_id={element?.activity_data?.id}
              poi={
                element?.activity_data?.poi
                  ? element?.activity_data?.poi
                  : element?.activity_data
              }
              activity={element?.activity_data?.activity}
              city_id={element?.activity_data?.city?.id}
              token={props.token}
              getAccommodationAndActivitiesHandler={
                props.getAccommodationAndActivitiesHandler
              }
              setShowLoginModal={props?.setShowLoginModal}
              _GetInTouch={props._GetInTouch}
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
        <InnerDayLocationRow style={{ paddingRight: "2px" }}>
          <div
            className={`${
              viewMore
                ? "text-black text-2xl font-[500] leading-[22px] "
                : "text-black text-[16px] font-[500] leading-[22px]"
            }`}
          >
            {convertDateFormat(props.Days?.slab)}
            {getYear(props?.Days?.slab) && `, ${getYear(props?.Days?.slab)}`}
            {" - "}
            <span className="font-semibold">
              {newCity
                ? `Arrival in ${newCity.city_name}`
                : `${props.current_city.city_name ?? ""} Exploration`}
            </span>{" "}
          </div>
        </InnerDayLocationRow>

        <ViewMoreButton
          text={viewMore ? "View less" : "View more"}
          handler={handleViewMoreButton}
        />
      </DivDayContainerRow>
      {viewMore ? (
        <DayContainerStyle>
          {dayIcontainer}
          <div className="flex w-full ml-3">
            {!props.LastElement && (
              <button
                onClick={() => setShowAddDrawer(true)}
                className="text-lg font-normal text-blue hover:underline"
              >
                +Add Activity{" "}
                {props?.Days?.date
                  ? `on ${convertDateFormat(props?.Days?.date)}`
                  : props?.Days?.slab
                  ? `on ${convertDateFormat(props?.Days?.slab)}`
                  : ""}
              </button>
            )}
          </div>
        </DayContainerStyle>
      ) : (
        <DaySummaryContainerStyle>
          {summaryIContainer}
          <div className="flex ml-[10.50%]">
            {!props.LastElement && (
              <button
                onClick={() => setShowAddDrawer(true)}
                className="text-[14px] font-[600] leading-[22px] text-blue hover:underline"
              >
                +Add Activity{" "}
                {props?.Days?.date
                  ? `on ${convertDateFormat(props?.Days?.date)}`
                  : props?.Days?.slab
                  ? `on ${convertDateFormat(props?.Days?.slab)}`
                  : ""}
              </button>
            )}
          </div>
        </DaySummaryContainerStyle>
      )}

      <ActivityAddDrawer
        showDrawer={showAddDrawer}
        setShowDrawer={setShowAddDrawer}
        cityName={newCity ? newCity?.city_name : props?.current_city?.city_name}
        cityID={newCity ? newCity?.city_id : props?.current_city?.city_id}
        date={props?.Days?.date}
        itinerary_id={props?.itinerary_id}
        day_slab_index={props?.indexDay}
        getPaymentHandler={props?.getPaymentHandler}
        getAccommodationAndActivitiesHandler={
          props?.getAccommodationAndActivitiesHandler
        }
        setShowLoginModal={props?.setShowLoginModal}
        setItinerary={props?.setItinerary}
        _GetInTouch={props._GetInTouch}
      ></ActivityAddDrawer>
    </Container>
  );
};

export default Day_I_Container;
