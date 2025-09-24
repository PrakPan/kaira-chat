import React from "react";
import styled from "styled-components";
import EntryFees from "../EntryFees";
import GettingAround from "../GettingAround";
import Recommendations from "../Recommendations";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Timings from "../Timings";
import media from "../../../media";
import ImageLoader from "../../../ImageLoader";

const TargetContainer = styled.div`
  padding: 1rem 1rem;
  height: 40vh;
  overflow-y: scroll;
  @media screen and (min-width: 768px) {
    height: 45vh;
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
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
          icon={
            <ImageLoader
              dimensions={{ height: 100, width: 100 }}
              height="1.5rem"
              width="1.5rem"
              url="media/icons/pois/getting around.png"
            />
          }
          label="Getting Around"
          className="poi-tab "
        ></Tab>
        <Tab
          icon={
            <ImageLoader
              dimensions={{ height: 100, width: 100 }}
              height="1.5rem"
              width="1.5rem"
              url="media/icons/pois/Entry fees.png"
            />
          }
          label="Entry Fees"
          className="poi-tab "
        ></Tab>

        <Tab
          icon={
            <ImageLoader
              dimensions={{ height: 100, width: 100 }}
              height="1.5rem"
              width="1.5rem"
              url="media/icons/pois/tips.png"
            />
          }
          label="Tips"
          className="poi-tab "
        ></Tab>
        <Tab
          icon={
            <ImageLoader
              dimensions={{ height: 100, width: 100 }}
              height="1.5rem"
              width="1.5rem"
              url="media/icons/pois/timing.png"
            />
          }
          label="Timings"
          className="poi-tab "
        ></Tab>
      </Tabs>

      <TabPanel value={value} index={0}>
        <GettingAround getting_around={props.getting_around} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EntryFees entry_fees={props.entry_fees}></EntryFees>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Recommendations
          recommendations={props.recommendations}
          tips={props.tips}
        />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Timings weekdays={props.weekdays}></Timings>
      </TabPanel>
    </div>
  );
};

export default Tabscomponent;
