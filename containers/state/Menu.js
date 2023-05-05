import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { AppBar } from '@mui/material';
import { Tabs, Tab } from '@mui/material';

import { Box } from '@mui/material';

import Details from './Details';
import Itinerary from './itinerary/Index';
import Booking from './booking/Index';
import media from '../../components/media';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const HeaderExtraPadding = styled.div`
  height: 3vh;
  background-color: white;
  z-index: 1000;
  position: sticky;
  top: 7.5vh;
`;

const SimpleTabs = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [value, setValue] = React.useState(0);

  const [location, setLocation] = useState(0);
  const [showEnquiryDesktop, setShowEnquiryDesktop] = useState(false);

  const EnquireButton = styled.div`
    position: sticky;
    top: 1.25vh;
    margin-left: 88vw;
    width: 10vw;
    background-color: #f7e700;
    z-index: 3000 !important;
    height: 7.5vh;
    font-size: 1.25vw;
    border-radius: 10px;
    visibility: ${showEnquiryDesktop ? 'visible' : 'hidden'};
    &:hover {
      cursor: pointer;
    }
  `;
  useEffect(() => {});

  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      if (isPageWide) window.scrollTo(0, window.innerHeight * 0.9);
      else window.scrollTo(0, window.innerHeight);
    } else if (newValue === 1) {
      if (isPageWide) window.scrollTo(0, window.innerHeight * 1.15);
      else window.scrollTo(0, window.innerHeight);
    } else if (newValue === 2) {
      if (isPageWide) window.scrollTo(0, window.innerHeight * 0.9);
      else window.scrollTo(0, window.innerHeight);
    }
    setValue(newValue);
  };

  const openBooking = () => {
    window.scrollTo(0, window.innerHeight * 0.9);
    setValue(2);
  };
  if (props.experienceLoaded)
    return (
      <div>
        {/* <AppBar position="sticky" className={ isPageWide? classes.appbar : classes.appbarmobile}>
        <Tabs textColor="white" value={value} onChange={handleChange} aria-label="simple tabs example" centered  style={{zIndex: "2"}}  indicatorColor="">
            <Tab  label="Overview" className="font-lexend experience-tab" />
            <Tab   label="Itinerary" className="font-lexend experience-tab"  />
            <Tab label="Booking" className="font-lexend experience-tab"  /> 
        </Tabs>
      </AppBar> */}
        {isPageWide ? (
          <EnquireButton
            onClick={openBooking}
            className="center-div font-lexend"
          >
            Enquire Now
          </EnquireButton>
        ) : null}
        {/* <HeaderExtraPadding>
      </HeaderExtraPadding> */}

        {/* <TabPanel value={value} index={0}> */}
        {/* <HeaderExtraPadding></HeaderExtraPadding> */}
        <Details
          experienceLoaded={props.experienceLoaded}
          data={props.data}
          payment={props.payment}
          openBooking={openBooking}
        ></Details>
        {/* </TabPanel> */}
        {/* <TabPanel value={value} index={1} className={classes.nopadding}>
        {props.itinerary && props.brief ? <Itinerary itinerary={props.itinerary} brief={props.brief}></Itinerary> : null}
      </TabPanel>
      <TabPanel value={value} index={2}>
            {true  ? <Booking bookings={props.bookings} setGalleryOpen={() => props.setGalleryOpen(true)} setGalleryImages={(imagesArr) => props.setGalleryImages(imagesArr)} experience={props.title}  bookings={props.bookings} payment={props.payment} experienceId={props.data.id}></Booking> : null}
      </TabPanel> */}
      </div>
    );
  else return <div></div>;
};

export default React.memo(SimpleTabs);
