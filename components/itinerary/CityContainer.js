import React, { useState, useRef } from 'react';
import styled from 'styled-components';

import IconElement from './element/Index';
import { Link, animateScroll as scroll } from 'react-scroll';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

import { Tabs, Tab } from '@mui/material';

import media from '../media';
import { getHumanDate } from '../../services/getHumanDate';
import Button from '../Button';
import { isJson } from '../../services/isJSON';
const Container = styled.div`
  width: 100%;
  padding: 0 0 5rem 0;
  @media screen and (min-width: 768px) {
    padding: 1rem;
  }
`;

const StyledTabs = styled(Tabs)`
  @media screen and (min-width: 768px) {
    width: 100%;
    padding-top: 0.5rem;
    padding-left: 1rem;
  }
`;
const TabContainersContainer = styled.div`
  width: 100%;
  @media screen and (min-width: 768px) {
  }
`;
const StyledNextIcon = styled(FaChevronRight)`
  font-size: 0.75rem;
  margin-left: 0.25rem;
  display: inline;
`;
const StyledPrevIcon = styled(FaChevronLeft)`
  font-size: 0.75rem;
  margin-right: 0.25rem;
  display: inline;
`;
const StyledLink = styled(Link)`
  display: block;
  font-size: 0.75rem;
  width: max-content;
  border-radius: 2rem;
  line-height: 1;
  padding: 0.5rem;
  margin: 0 0 0 auto;
  color: black;
  background-color: white;
  text-decoration: none;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  &:hover {
    cursor: pointer;
    color: white;
    background-color: black;
    border-color: black;
    border-style: solid;
    border-width: 1px;
  }
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="tab-test"
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}
const CityContainer = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [value, setValue] = React.useState(0);
  const ref = useRef();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (!isPageWide) window.scrollTo(0, window.innerHeight * 0.4);
  };

  let DayElements = {
    'Day 0': [],
    'Day 1': [],
    'Day 2': [],
    'Day 3': [],
    'Day 4': [],
    'Day 5': [],
    'Day 6': [],
    'Day 7': [],
    'Day 8': [],
  };
  let TabsElements = [];
  let TabsContainers = [];
  const _addDayElements = (
    day_element,
    day_slab,
    slab_element_index,
    day_slab_index
  ) => {
    if (day_slab in DayElements) {
    } else DayElements[day_slab] = [];
    if (day_element.element_type !== 'newcity') {
      if (day_element.icon.slice(day_element.icon.length - 4) === '.svg')
        DayElements[day_slab].push(
          <div>
            <IconElement
              is_registration_needed={props.is_registration_needed}
              element_index={day_element.element_index}
              selectedPoi={props.selectedPoi}
              activity_data={day_element.activity_data}
              is_auth={props.is_auth}
              traveleritinerary={props.traveleritinerary}
              is_poi_rec={
                day_element.type === 'POI/Activity Recommendation'
                  ? true
                  : false
              }
              is_food={
                day_element.type === 'Food Recommendation' &&
                isJson(day_element.text)
                  ? true
                  : false
              }
              is_preview={props.is_preview}
              is_stock={props.is_stock}
              is_experience={props.is_experience}
              enablepoiedit={day_element.activity_data ? true : false}
              poi_name={
                day_element.activity_data
                  ? day_element.activity_data.name
                  : null
              }
              day_slab_index={day_slab_index}
              slab_element_index={slab_element_index}
              city_id={props.city_id}
              element_type={day_element.element_type}
              setShowPoiModal={props.setShowPoiModal}
              blur={props.blur}
              name={day_element.heading}
              meta={day_element.meta}
              text={day_element.text}
              image={day_element.icon}
            ></IconElement>
          </div>
        );
      else
        DayElements[day_slab].push(
          <div>
            <IconElement
              is_registration_needed={props.is_registration_needed}
              element_index={day_element.element_index}
              selectedPoi={props.selectedPoi}
              activity_data={day_element.activity_data}
              is_auth={props.is_auth}
              traveleritinerary={props.traveleritinerary}
              is_poi_rec={
                day_element.type === 'POI/Activity Recommendation'
                  ? true
                  : false
              }
              is_food={
                day_element.type === 'Food Recommendation' &&
                isJson(day_element.text)
                  ? true
                  : false
              }
              is_preview={props.is_preview}
              is_stock={props.is_stock}
              is_experience={props.is_experience}
              enablepoiedit={day_element.activity_data ? true : false}
              poi_name={
                day_element.activity_data
                  ? day_element.activity_data.name
                  : null
              }
              day_slab_index={day_slab_index}
              slab_element_index={slab_element_index}
              city_id={props.city_id}
              element_type={day_element.element_type}
              setShowPoiModal={props.setShowPoiModal}
              blur={props.blur}
              meta={day_element.meta}
              name={day_element.heading}
              text={day_element.text}
              image={day_element.icon}
              type="image"
            ></IconElement>
          </div>
        );
    }
  };
  var i = 0;
  for (var j = props.startingslab; j <= props.endingslab; j++) {
    if (j === props.startingslab)
      for (
        var k = props.startingindex;
        k < props.day_slabs[j].slab_elements.length;
        k++
      ) {
        _addDayElements(
          props.day_slabs[j].slab_elements[k],
          props.day_slabs[j].slab,
          k,
          j
        );
        if (props.endingslab === j) {
          if (props.endingindex === k) break;
        }
      }
    else
      for (var k = 0; k < props.day_slabs[j].slab_elements.length; k++) {
        _addDayElements(
          props.day_slabs[j].slab_elements[k],
          props.day_slabs[j].slab,
          k,
          j
        );
        if (props.endingslab === j) {
          if (props.endingindex === k) break;
        }
      }
    TabsElements.push(
      <Tab
        style={{
          textTransform: 'none',
          padding: '0.25rem 1rem',
          color: 'white !important',
        }}
        label={getHumanDate(props.day_slabs[j].slab)}
        className="itinerary-day-tab font-lexend"
      ></Tab>
    );
    TabsContainers.push(
      <TabPanel value={value} index={i} ref={ref}>
        <div>{DayElements[props.day_slabs[j].slab]}</div>
        <div style={{ display: 'flex' }}>
          {i ? (
            <StyledLink
              to={props.id}
              id={i}
              smooth={true}
              duration={500}
              style={{ margin: '0' }}
              onClick={(event) => _handlePrevClick(event)}
              className="font-lexend"
            >
              <StyledPrevIcon></StyledPrevIcon>
              Previous Day
            </StyledLink>
          ) : null}
          {j === props.endingslab ? null : (
            <StyledLink
              to={props.id}
              id={i}
              smooth={true}
              duration={500}
              style={{}}
              onClick={(event) => _handleNextClick(event)}
              className="font-lexend"
            >
              Next Day
              <StyledNextIcon></StyledNextIcon>
            </StyledLink>
          )}
        </div>
      </TabPanel>
    );
    i++;
  }

  const _handleNextClick = (event) => {
    setValue(parseInt(event.target.id, 10) + 1);
  };
  const _handlePrevClick = (event) => {
    setValue(parseInt(event.target.id, 10) - 1);
  };
  return (
    <Container className={isPageWide ? 'border' : ' '}>
      {!isPageWide ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            left: '0',
            top: '0vh',
            backgroundColor: 'white',
            zIndex: '1000',
            padding: props.hideTimer
              ? '12vh 0.5rem 0 0.5rem'
              : '0.75rem 0.5rem 0 0.5rem',
            minHeight: '10vh',
          }}
        >
          <Tabs
            id="day-tab"
            value={value}
            onChange={handleChange}
            indicatorColor="false"
            disableRippled
            variant={'scrollable'}
            scrollButtons={true}
            allowScrollButtonsMobile
          >
            {TabsElements}
            {/* <Tab   label="About" className="poi-tab font-lexend"></Tab>
               <Tab   label="About" className="poi-tab font-lexend"></Tab>
               <Tab   label="About" className="poi-tab font-lexend"></Tab>
               <Tab   label="About" className="poi-tab font-lexend"></Tab> */}
          </Tabs>
        </div>
      ) : (
        <StyledTabs
          position="sticky"
          id="day-tabs"
          value={value}
          onChange={handleChange}
          indicatorColor="false"
          disableRippled
        >
          {TabsElements}
        </StyledTabs>
      )}
      <TabContainersContainer style={{ width: '100%', margin: 'auto' }}>
        {TabsContainers}
      </TabContainersContainer>
    </Container>
  );
};

export default CityContainer;
