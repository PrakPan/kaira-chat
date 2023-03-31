import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Day_I_Container from './Day_I_Container';

import Tab from '@material-ui/core/Tab';
import { getHumanDate } from '../../../services/getHumanDate';
import { Navbar } from './New_itenaryStyled';
import CustomMenu from '../CustomMenu';
import { useSticky } from '../../../hooks/useSticky';
import useMediaQuery, { useMedia } from '../../../hooks/useMedia';
import ScrollableTabs from '../../../components/ScrollableTabs';
import ScrollableMenuTabs from '../../../components/ScrollableMenuTabs';

const NewItenaryMain = (props) => {
  const Wrapper = styled.div`
    display: flex;
    width: 60vw;
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
  console.log('itenary...' + JSON.stringify(props.itinerary));
  const dates = props.itinerary.day_slabs.map((element, index) => (
    <div>{element.slab}</div>
  ));
  const getCityFromDay = (day_slab_index, day_slabs, city_slabs) => {
    // if(city_slabs)
    for (var i = 0; i < city_slabs.length - 1; i++) {
      if (
        city_slabs[i].day_slab_location.start_day_slab_index === day_slab_index
      )
        return i;
      else if (
        city_slabs[i].day_slab_location.start_day_slab_index < day_slab_index
      ) {
        if (city_slabs[i].day_slab_location.end_day_slab_index > day_slab_index)
          return i;
      }
    }
    return i;
  };

  const { ref, isSticky } = useSticky(90);
  const isDesktop = useMediaQuery('(min-width:1148px)');
  const [value, setValue] = React.useState(0);
  const [locationValue, setLocationValue] = useState(0);

  const [dayTabsJSX, setDayTabsJSX] = useState([]);
  const [dayPanelsJSX, setDayPannelsJSX] = useState([]);

  const handleChange = (event, newValue) => {
    setLocationValue(
      getCityFromDay(newValue, props.day_slabs, props.city_slabs)
    );
    setValue(newValue);
    if (typeof window !== 'undefined' && !props.experience)
      window.scrollTo(0, window.innerHeight * 0.5);
  };
  const hadleLocationChange = (event, newValue) => {
    setLocationValue(newValue);
    setValue(props.city_slabs[newValue].day_slab_location.start_day_slab_index);
    if (typeof window !== 'undefined' && !props.experience)
      window.scrollTo(0, window.innerHeight * 0.5);
  };
  const [hideTimer, setHideTimer] = useState(false);

  const _handleTimerClose = () => {
    props._hideTimerHandler();
    window.scrollTo(0, window.innerHeight / 2);
    setHideTimer(true);
  };
  let day_tabs_jsx = [];
  let day_pannesl_jsx = [];
  const _generateDaySlabs = () => {
    let day_slabs_jsx = [];
    if (props.day_slabs)
      for (var i = 0; i < props.day_slabs.length; i++) {
        day_tabs_jsx.push(
          <Tab
            style={{
              textTransform: 'none',
              marginRight: '0.5rem',
              padding: '0.25rem 1rem',
              color: 'white !important',
            }}
            label={getHumanDate(props.day_slabs[i].slab)}
            className="itinerary-day-tab font-opensans"
          ></Tab>
        );
        //push an empty array since day is present
        day_slabs_jsx.push([]);
        for (var j = 0; j < props.day_slabs[i].slab_elements.length; j++) {
          // const city_id = getCityIdFromElement(props.day_slabs[i].slab_elements[j].element_index, props.day_slabs, props.city_slabs)
          let city_id = null;
          if (props.day_slabs[i].slab_elements[j].activity_data)
            if (props.day_slabs[i].slab_elements[j].activity_data.city)
              city_id =
                props.day_slabs[i].slab_elements[j].activity_data.city.id;

          // const city_id=props.day_slabs[i].slab_elements[j];
          //Push element if not newcity
          if (props.day_slabs[i].slab_elements[j].element_type !== 'newcity')
            day_slabs_jsx[i].push(
              <div>
                {/* <IconElement
                  is_registration_needed={props.is_registration_needed}
                  element_index={
                    props.day_slabs[i].slab_elements[j].element_index
                  }
                  selectedPoi={props.selectedPoi}
                  is_auth={props.email === props.user_email ? true : false}
                  traveleritinerary={props.traveleritinerary}
                  is_poi_rec={
                    props.day_slabs[i].slab_elements[j].type ===
                    "POI/Activity Recommendation"
                      ? true
                      : false
                  }
                  is_food={
                    props.day_slabs[i].slab_elements[j].type ===
                      "Food Recommendation" &&
                    isJson(props.day_slabs[i].slab_elements[j].text)
                      ? true
                      : false
                  }
                  day_slab_index={i}
                  slab_element_index={j}
                  is_experience={props.is_experience}
                  enablepoiedit={
                    props.day_slabs[i].slab_elements[j].activity_data
                      ? true
                      : false
                  }
                  poi_name={
                    props.day_slabs[i].slab_elements[j].activity_data
                      ? props.day_slabs[i].slab_elements[j].activity_data.name
                      : null
                  }
                  city_id={city_id}
                  setShowPoiModal={props.setShowPoiModal}
                  element_type={
                    props.day_slabs[i].slab_elements[j].element_type
                  }
                  type="image"
                  blur={props.blur}
                  name={props.day_slabs[i].slab_elements[j].heading}
                  meta={props.day_slabs[i].slab_elements[j].meta}
                  text={props.day_slabs[i].slab_elements[j].text}
                  image={props.day_slabs[i].slab_elements[j].icon}
                ></IconElement> */}
              </div>
            );
        }
        day_pannesl_jsx
          .push
          // <TabPanel ref={ref} value={value} index={i}>
          //   <div style={{ marginBottom: "10vh" }}>{day_slabs_jsx[i]}</div>
          // </TabPanel>
          ();
      }

    // setDayTabsJSX(day_tabs_jsx);

    // setDayPannelsJSX(day_pannesl_jsx);
  };

  const handleSelect = (itemId) => {
    setActiveItem(itemId);
  };
  useEffect(() => {
    // _generateDaySlabs();
  }, []);
  _generateDaySlabs();
  const [activeItem, setActiveItem] = useState(1);
  const items = [];
  if (props.city_slabs) {
    for (var i = 0; i < props.city_slabs.length; i++) {
      const index = i;
      //Don't do anything if ending city
      if (props.city_slabs[i].is_trip_terminated) break;
      else {
        const itenaryId = props.itinerary.day_slabs[i];
        // console.log(itenaryId !== undefined);
        // console.log('idssss' + props.city_slabs[i].city_name);
        // console.log('idssss' + props.itinerary.day_slabs[0].slab_id);
        // console.log('idssss'+ itenaryId.slab_id)
        // console.log('idssss'+ itenaryId !== undefined ? itenaryId[i].slab_id  : itenaryId[0].slab_id )

        items.push({
          id: i,
          label: `${props.city_slabs[i].city_name} (${props.city_slabs[i].duration} N)`,
          link:
            itenaryId !== undefined
              ? itenaryId.slab_id
              : props.itinerary.day_slabs[0].slab_id,
        });
      }
    }
  }
  console.log('ITEMsssssss', items);
  return (
    <Wrapper>
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
        offset={'120px'}
        items={items}
        BarName="CityName"
        Mstyle={'round'}
      ></ScrollableMenuTabs>
      {day_pannesl_jsx}
      <div className="itenaryContainer">
        {props.itinerary.day_slabs.map((element, index) => (
          <div key={element.slab_id} id={element.slab_id}>
            <Day_I_Container Days={element}></Day_I_Container>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default NewItenaryMain;
