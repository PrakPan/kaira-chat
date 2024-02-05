import React, { useState } from "react";
import styled from "styled-components";
import Day_I_Container from "./Day_I_Container";

import { getHumanDate } from "../../../services/getHumanDate";
import { Navbar } from "./New_itenaryStyled";
import CustomMenu from "../CustomMenu";
import { useSticky } from "../../../hooks/useSticky";
import useMediaQuery, { useMedia } from "../../../hooks/useMedia";
import ScrollableTabs from "../../../components/ScrollableTabs";
import ScrollableMenuTabs from "../../../components/ScrollableMenuTabs";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";

const NewItenaryMain = (props) => {
  const Wrapper = styled.div`
    display: flex;
    width: 60vw;
    margin: 0 -2rem 0 0;
    flex-direction: column;
  `;
  const CitiesContainer = styled.div`
    width: calc(100vw-32px);
    overflow: hidden;
    display: grid;
    grid-template-columns: max-content max-content max-content;
    grid-gap: 0.75rem;
    height: max-content;
    position: sticky;
    top: 31vw;
    z-index: 10;
    background-color: white;
  `;
  const City = styled.div`
    border-radius: 8px;
    padding: 0.5rem;
  `;

  const isDesktop = useMediaQuery("(min-width:1148px)");

  let currentCity = props.itinerary.starting_city.city_name;

  const getCurrentCity = () => {
    props.itinerary.day_slabs.map((day_slab, index) => {
      day_slab.slab_elements.map((element, index) => {
        if (element.element_type === "newcity") {
          currentCity = element.city_data;
        }
      });
      day_slab.current_city = currentCity;
    });
  };

  getCurrentCity();

  const items = [];
  const itemsDays = [];
  // function makeCounter(initialCount = 0, initialDate = 1) {
  //   let date = initialDate;
  //   let count = initialCount;

  //   return function() {
  //     if (count === initialCount) {
  //       initialDate++;
  //       count--;
  //       return 0;
  //     } else {
  //       initialDate++;
  //       count--;
  //       return count;
  //     }
  //   };
  // }
  // const counter1 = makeCounter(
  //   props.city_slabs[1].duration,
  //   props.itinerary.day_slabs[i].slab.split('/')[0]
  // );
  function extractId(location, arr) {
    if (arr.length <= location) return arr[arr.length - 1].slab_id;
    return arr[location].slab_id;
  }

  if (props.itinerary.day_slabs) {
    for (var i = 1; i < props.itinerary.day_slabs.length; i++) {
      const index = i;
      //Don't do anything if ending city
      if (props.city_slabs[i] ? props.city_slabs[i].is_trip_terminated : true)
        break;
      else if (props.city_slabs[i].duration <= 0) break;
      else {
        const itenaryId =
          i % props.city_slabs[i].duration
            ? props.itinerary.day_slabs[i - 1]
            : props.itinerary.day_slabs[i];

        items.push({
          id: i,
          label: `${props.city_slabs[i].city_name} ${
            props.city_slabs[i].duration
              ? `(${props.city_slabs[i].duration}N)`
              : ` `
          } `,
          link:
            itenaryId !== undefined
              ? extractId(
                  props.city_slabs[i]?.day_slab_location?.start_day_slab_index,
                  props.itinerary.day_slabs
                )
              : props.itinerary.day_slabs[1].slab_id,

          date:
            itenaryId !== undefined
              ? itenaryId.slab && convertDateFormat(itenaryId.slab)
              : convertDateFormat(props.itinerary.day_slabs[1].slab),
        });
      }
    }
  }

  if (props.itinerary.day_slabs) {
    for (var i = 0; i < props.itinerary.day_slabs.length; i++) {
      const index = i;
      //Don't do anything if ending city

      const itenaryId = props.itinerary.day_slabs[i];

      itemsDays.push({
        id: i,
        link:
          itenaryId !== undefined
            ? itenaryId.slab_id
            : props.itinerary.day_slabs[1].slab_id,
        date:
          itenaryId !== undefined
            ? itenaryId.slab && convertDateFormat(itenaryId.slab)
            : convertDateFormat(props.itinerary.day_slabs[1].slab),
      });
    }
  }

  function memoize(fn) {
    const cache = {};
    return function (...args) {
      const key = JSON.stringify(args);
      if (cache[key]) {
        return cache[key];
      }
      const result = fn.apply(this, args);
      cache[key] = result;
      return result;
    };
  }

  const yearCalc = (days) => {
    if (days[0]) {
      var year1 = days[0]?.date?.split("/")[2];
      return year1;
    }
  };
  const IdPauser = (duration = 1) => {
    let counter = duration - 1;

    return function () {
      if (counter === duration - 1) {
        counter--;
        return true;
      } else if (counter === 0) {
        counter = duration;
        return true;
      } else {
        counter--;
        return false;
      }
    };
  };
  function extractCityName(arr) {
    const cityObject = arr.find((obj) => obj.element_type === "newcity");

    if (cityObject && cityObject.city_name) {
      return cityObject.city_name;
    }

    return null;
  }
  return (
    <Wrapper>
      <div className="text-3xl font-bold mb-8 mt-4"> Day By Day Itinerary</div>

      <ScrollableMenuTabs
        classStyle="pb-2"
        icons={items.length < 5 ? false : true}
        offset={"45px"}
        items={items}
        BarName="CityName"
        Mstyle={"round"}
      ></ScrollableMenuTabs>
      {props.itinerary && (
        <ScrollableMenuTabs
          icons={false}
          offset={"80px"}
          items={itemsDays}
          BarName="CityName"
          year={yearCalc(props?.itinerary?.day_slabs[0]?.slab)}
          Mstyle={"round"}
          Iterable="date"
          vertical={true}
        ></ScrollableMenuTabs>
      )}

      {props.itinerary.day_slabs && (
        <div className="itenaryContainer">
          {props.itinerary.day_slabs.map((element, index) => (
            <div key={element.slab_id} id={element.slab_id}>
              <Day_I_Container
                Days={element}
                indexDay={index}
                setShowLoginModal={props.setShowLoginModal}
                payment={props.payment}
                plan={props.plan}
                getPaymentHandler={props.getPaymentHandler}
                itinerary_id={props.itinerary.tailor_made_id}
                setItinerary={props.setItinerary}
                token={props.token}
                LastElement={props.itinerary.day_slabs.length === index + 1}
                transferBookings={props.transferBookings}
                stayBookings={props.stayBookings}
                activityBookings={props.activityBookings}
                current_city={element.current_city}
                getAccommodationAndActivitiesHandler={
                  props.getAccommodationAndActivitiesHandler
                }
              ></Day_I_Container>
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(NewItenaryMain);
