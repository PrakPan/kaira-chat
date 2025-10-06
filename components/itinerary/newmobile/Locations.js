import React from "react";
import styled from "styled-components";
import { Tabs, Tab } from "@mui/material";

const Container = styled.div``;

const Locations = (props) => {
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
            className="itinerary-city-tab "
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
