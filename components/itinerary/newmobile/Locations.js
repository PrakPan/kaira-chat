import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const Container = styled.div``;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={false}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="tab-test"
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

const Locations = (props) => {
  const ref = useRef();

  const [value, setValue] = React.useState(0);
  const [dayTabsJSX, setDayTabsJSX] = useState([]);
  const [dayPanelsJSX, setDayPannelsJSX] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // if(!isPageWide) window.scrollTo(0,window.innerHeight*0.4);
  };
  let city_tabs_jsx = [];
  const _generateDaySlabs = () => {
    if (props.city_slabs)
      for (var i = 0; i < props.city_slabs.length; i++) {
        city_tabs_jsx.push(
          <Tab
            style={{
              textTransform: "none",
              padding: "0.25rem 1rem",
              color: "white !important",
            }}
            label={props.city_slabs[i].city_name}
            className="itinerary-city-tab font-lexend"
          ></Tab>
        );
      }
  };

  _generateDaySlabs();

  return (
    <Container>
      <Tabs
        id="location-tab"
        value={props.value}
        onChange={props.handleChange}
        indicatorColor="false"
        disableRippled
        variant={"scrollable"}
        scrollButtons={true}
        allowScrollButtonsMobile
      >
        {city_tabs_jsx}
      </Tabs>
    </Container>
  );
};

export default React.memo(Locations);
