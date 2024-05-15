import React, { useState } from "react";
import styled from "styled-components";
import Rooms from "../roomtypes/Index";
import { Tabs, Tab } from "@mui/material";
import media from "../../../media";
import Ammenities from "../Ammenities";
import Location from "../Location";

const Container = styled.div`
  @media screen and (min-width: 768px) {
  }
`;

const TargetContainer = styled.div`
  padding: 1rem 1rem;
  overflow-y: hidden;
  min-height: 80vw;
  @media screen and (min-width: 768px) {
    min-height: max-content;
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
      {...other}
    >
      {value === index && <TargetContainer>{children}</TargetContainer>}
    </div>
  );
}

const Tabscomponent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  const [selectedState, setSelectedState] = useState(0);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Tabs
        value={value}
        onChange={handleChange}
        variant={!isPageWide ? "scrollable" : "fullWidth"}
        scrollButtons={!isPageWide ? true : false}
        allowScrollButtonsMobile
        indicatorColor="#f7e700"
        id="poimodal-tabs"
      >
        <Tab
          label="Rooms"
          className="accommodationdetail-tab font-lexend"
        ></Tab>
        <Tab
          label="Amenities"
          className="accommodationdetail-tab font-lexend"
        ></Tab>
        {props.data.addr1 ? (
          <Tab
            label="Location"
            className="accommodationdetail-tab font-lexend"
          ></Tab>
        ) : null}

        {props.data.description ? (
          <Tab
            label="Description"
            className="accommodationdetail-tab font-lexend"
          ></Tab>
        ) : null}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Rooms data={props.data}></Rooms>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Ammenities data={props.data}></Ammenities>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Location data={props.data}></Location>
      </TabPanel>

      <TabPanel value={value} index={3}>
        {props.data.description ? (
          <div
            className="font-lexend"
            dangerouslySetInnerHTML={{ __html: props.data.description }}
          ></div>
        ) : null}
      </TabPanel>
    </Container>
  );
};

export default Tabscomponent;
