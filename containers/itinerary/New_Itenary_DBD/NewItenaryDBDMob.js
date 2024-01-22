import React, { useState } from 'react';
import styled from 'styled-components';
import Day_I_ContainerM from './Day_I_ContainerM';
import HorizontalBar from './Menubar';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { getHumanDate } from '../../../services/getHumanDate';
import { isJson } from '../../../services/isJSON';
import { Navbar, NavbarContainer } from './New_itenaryStyled';
import CustomMenu from '../CustomMenu';
import { useSticky } from '../../../hooks/useSticky';
import useMediaQuery, { useMedia } from '../../../hooks/useMedia';
import ScrollableTabs from '../../../components/ScrollableTabs';
import ScrollableMenuTabs from '../../../components/ScrollableMenuTabs';
import { convertDateFormat } from '../../../helper/ConvertDateFormat';
import DropdownWrapper from '../../../components/DropDownWrapper';

const NewItenaryDBDMob = (props) => {
  const Wrapper = styled.div`
    display: flex;
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

  const [activeItem, setActiveItem] = useState(0);

  const isDesktop = useMediaQuery('(min-width:1148px)');
  function extractCityName(arr) {
    const cityObject = arr.find((obj) => obj.element_type === 'newcity');

    if (cityObject && cityObject.city_name) {
      return cityObject.city_name;
    }

    return null;
  }

  let currentCity = props.itinerary.starting_city.city_name;

  const getCurrentCity = () => {
    props.itinerary.day_slabs.map((day_slab, index) => {
      day_slab.slab_elements.map((element, index) => {
        if(element.element_type === 'newcity') {
          currentCity = element.city_data.city_name;
        }
      })
      day_slab.current_cityName = currentCity;
    })
  }

  getCurrentCity();
  
  const items = [];
  const itemsDays = [];
  function extractId(location, arr) {
    if (arr.length <= location) return arr[arr.length - 1].slab_id;
    return arr[location].slab_id;
  }
  if (props.itinerary.day_slabs) {
    for (var i = 1; i < props.itinerary.day_slabs.length; i++) {
      const index = i;
      //Don't do anything if ending city
      if (props.city_slabs[i] && !props.city_slabs[i].is_trip_terminated) {
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

  const handleActiveSelect = (itemId) => {
    setActiveItem(itemsDays[itemId].date);
  };
  return (
    <Wrapper>
      {" "}
      <div className="font-lexend font-bold text-2xl mb-[2.4rem] mt-4">
        {" "}
        Day By Day Itinerary
      </div>
      <ScrollableMenuTabs
        icons={items.length < 3 ? false : true}
        offset={"50px"}
        items={items}
        BarName="CityName"
        Mstyle={"round"}
      />
      {/* <div className="sticky pl-2" style={{ zIndex: '100', top: 86 }}>
        <DropdownWrapper Dhead={activeItem}>
          {itemsDays.map((item, index) => (
            <CustomMenu
              key={index}
              item={item}
              BarName="CityName"
              year={'2023'}
              Mstyle={'round'}
              Iterable="date"
              onSelect={handleActiveSelect}
            />
          ))}
        </DropdownWrapper>
      </div> */}
      <ScrollableMenuTabs
        icons={false}
        offset={items.length ? "89px" : "50px"}
        items={itemsDays}
        BarName="CityName"
        year={"2024"}
        Mstyle={"round"}
        Iterable="date"
      />
      {/* <HorizontalBar
        width={'100%'}
        height={'40px'}
        content={dates}
      ></HorizontalBar> */}
      {/* <CitiesContainer>
        <City
          className="border-thin"
          style={{ backgroundColor: "black", color: "white" }}
        >
          Jaipur (2N)
        </City>
        <City className="border-thin">Jodhpur (2N)</City>
        <City className="border-thin">Jaisalmer (2N)</City>
      </CitiesContainer> */}
      <div className="itenaryContainer">
        {props?.itinerary?.day_slabs?.map((element, index) => (
          <div key={element.slab_id} id={element.slab_id}>
            <Day_I_ContainerM
              setShowLoginModal={props.setShowLoginModal}
              Days={element}
              indexDay={index}
              payment={props.payment}
              getPaymentHandler={props.getPaymentHandler}
              itinerary_id={props.itinerary.tailor_made_id}
              setItinerary={props.setItinerary}
              token={props.token}
              LastElement={props.itinerary.day_slabs.length - 1 == index}
              transferBookings={props.transferBookings}
              stayBookings={props.stayBookings}
              current_cityName={element.current_cityName}
              getAccommodationAndActivitiesHandler={props.getAccommodationAndActivitiesHandler}
            ></Day_I_ContainerM>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default React.memo(NewItenaryDBDMob);
