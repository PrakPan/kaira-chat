import React, { useState } from 'react';
import styled from 'styled-components';
import Day_I_Container from './Day_I_Container';

import { getHumanDate } from '../../../services/getHumanDate';
import { Navbar } from './New_itenaryStyled';
import CustomMenu from '../CustomMenu';
import { useSticky } from '../../../hooks/useSticky';
import useMediaQuery, { useMedia } from '../../../hooks/useMedia';
import ScrollableTabs from '../../../components/ScrollableTabs';
import ScrollableMenuTabs from '../../../components/ScrollableMenuTabs';
import { convertDateFormat } from '../../../helper/ConvertDateFormat';

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
  // console.log('itenary...' + JSON.stringify(props.itinerary));

  const isDesktop = useMediaQuery('(min-width:1148px)');

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
    return arr[location].slab_id;
  }
  if (props.itinerary.day_slabs) {
    for (var i = 1; i < props.itinerary.day_slabs.length; i++) {
      const index = i;
      //Don't do anything if ending city
      if (props.city_slabs[i] ? props.city_slabs[i].is_trip_terminated : true)
        break;
      else {
        const itenaryId =
          i % props.city_slabs[i].duration
            ? props.itinerary.day_slabs[i - 1]
            : props.itinerary.day_slabs[i];
        // console.log(itenaryId !== undefined);
        // console.log('idssss' + props.city_slabs[i].city_name);
        // console.log('idssss' + props.itinerary.day_slabs[0].slab_id);
        // console.log('idssss'+ itenaryId.slab_id)
        // console.log('idssss'+ itenaryId !== undefined ? itenaryId[i].slab_id  : itenaryId[0].slab_id )

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
      // console.log(itenaryId !== undefined);
      // console.log('idssss' + props.city_slabs[i].city_name);
      // console.log('idssss' + props.itinerary.day_slabs[0].slab_id);
      // console.log('idssss'+ itenaryId.slab_id)
      // console.log('idssss'+ itenaryId !== undefined ? itenaryId[i].slab_id  : itenaryId[0].slab_id )

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
      var year1 = days[0]?.date?.split('/')[2];
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
  console.log('items');
  console.log(items);
  function extractCityName(arr) {
    const cityObject = arr.find((obj) => obj.element_type === 'newcity');

    if (cityObject && cityObject.city_name) {
      return cityObject.city_name;
    }

    return null;
  }
  return (
    <Wrapper>
      <div className="text-3xl font-bold mb-8 mt-4"> Day By Day Itinerary</div>
      {/* <ScrollableTabs
        Mstyle={'round'}
        items={items}
        activeItem={activeItem}
        onSelect={handleSelect}
      ></ScrollableTabs> */}
      {/* <Navbar ref={ref} sticky={isSticky & !isDesktop}>
        <CustomMenu
          Mstyle={'round'}
          items={items}
          activeItem={activeItem}
          onSelect={handleSelect}
        />
      </Navbar> */}

      <ScrollableMenuTabs
        classStyle="pb-2"
        icons={items.length < 5 ? false : true}
        offset={'45px'}
        items={items}
        BarName="CityName"
        Mstyle={'round'}
      ></ScrollableMenuTabs>
      {props.itinerary && (
        <ScrollableMenuTabs
          icons={false}
          offset={'80px'}
          items={itemsDays}
          BarName="CityName"
          year={yearCalc(props?.itinerary?.day_slabs[0]?.slab)}
          Mstyle={'round'}
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
                getPaymentHandler={props.getPaymentHandler}
                itinerary_id={props.itinerary.tailor_made_id}
                setItinerary={props.setItinerary}
                token={props.token}
                LastElement={props.itinerary.day_slabs.length == index + 1}
              ></Day_I_Container>
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(NewItenaryMain);
