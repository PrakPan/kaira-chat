import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import City from '../../../newitinerary/breif/cities/City';
import CityCard from './CityCard';

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const SingleCardContainer = styled.div`
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 90%;
  }
`;

const OverviewIndex = (props) => {
  // let Cards=[];
  let MoreCards = [];
  const getdayId = (id) => {
    return props.daysSlab[id]?.slab_id;
  };
  let cityids = []; //To make sure a city is not repeated
  if (props.breif)
    if (props.breif.city_slabs)
      //Loop through all available cities
      for (var k = 0; k < props.breif.city_slabs.length; k++) {
        //Only add if not terminating / transition city with defined duration
        if (
          props.breif.city_slabs[k].duration &&
          props.breif.city_slabs[k].duration !== '0' &&
          !props.breif.city_slabs[k].is_starting_city_departure_only &&
          !props.breif.city_slabs[k].is_departure_only
        ) {
          if (cityids.includes(props.breif.city_slabs[k].city_id)) {
          } //City already covered
          else if (
            props.breif.city_slabs[k].city_name &&
            props.breif.city_slabs[k].short_description
          ) {
            //city name and description present
            cityids.push(props.breif.city_slabs[k].city_id); //store city ids to check if city already covered
            MoreCards.push(
              <City
                id={k}
                dayId={getdayId(
                  props.breif.city_slabs[k].day_slab_location
                    .start_day_slab_index
                )}
                cityData={props.breif.city_slabs[k]}
                cityName={props.breif.city_slabs[k].city_name}
                text={props.breif.city_slabs[k].short_description}
                image={props.breif.city_slabs[k].image}
              ></City>
            );
          }
        }
      }
  //Center align incase of one card, grid layout otherwise
  if (MoreCards.length > 1) return <Container>{MoreCards}</Container>;
  else return <SingleCardContainer>{MoreCards}</SingleCardContainer>;
};

export default OverviewIndex;
