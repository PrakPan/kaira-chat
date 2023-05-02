import React, { useState } from 'react';
import styled from 'styled-components';
import About from '../aboutus/About';
import EntryFees from '../EntryFees';
import GettingAround from '../GettingAround';
import Recommendations from '../Recommendations';
import aboutimg from '../../../../public/assets/poi/about.png';
import gettingimg from '../../../../public/assets/poi/getting around.png';
import tipsimg from '../../../../public/assets/poi/tips.png';
import entryimg from '../../../../public/assets/poi/Entry fees.png';
import timingimg from '../../../../public/assets/poi/timing.png';
import { Tabs, Tab } from '@mui/material';

import Timings from '../Timings';
import media from '../../../media';

const Container = styled.div`
  @media screen and (min-width: 768px) {
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-style: none none solid none;
  border-width: 1px;
  border-color: #e4e4e4;
`;
// const Tab = styled.div`
//     padding: 1rem;
//     text-align: center;
//     font-size: 1rem;
//     &:hover{
//         cursor: pointer;
//     }

// `;
const TargetContainer = styled.div`
  padding: 1rem 1rem;
  height: 40vh;
  overflow-y: scroll;
  @media screen and (min-width: 768px) {
    height: 45vh;
  }
`;
const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
const Heading = styled.p`
  font-size: 0.75rem;
  margin: 0.5rem 0 0 0;
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
  let isPageWide = media('(min-width: 768px)');

  const [selectedState, setSelectedState] = useState(0);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      {/* <GridContainer>
            <Tab onClick={() => setSelectedState(0)} className="font-lexend center-div" style={{fontWeight: selectedState === 0 ? '700' : '400', backgroundColor: selectedState === 0 ? '#f7e700' : 'white'}}>
                <Icon src={aboutimg}/>
                <Heading>About</Heading>
            </Tab>
            <Tab onClick={() => setSelectedState(1)} className="font-lexend center-div" style={{fontWeight: selectedState === 1 ? '700' : '400', backgroundColor: selectedState === 1 ? '#f7e700' : 'white', borderStyle: 'none solid none solid', borderWidth: '1px', borderColor: "#e4e4e4"}}>
                <Icon src={gettingimg}/>
                <Heading>Getting Around</Heading>

            </Tab>
            <Tab onClick={() => setSelectedState(2)} className="font-lexend center-div" style={{fontWeight: selectedState === 2 ? '700' : '400', backgroundColor: selectedState === 2 ? '#f7e700' : 'white'}}>
                <Icon src={tipsimg}/>
                <Heading>Tips</Heading>

            </Tab>
       </GridContainer>
       <TargetContainer>
            {selectedState === 0 ? <About short_description={props.short_description}/> : null}
            {selectedState === 1 ? <GettingAround getting_around={props.getting_around}/> : null}
            {selectedState === 2 ? <Recommendations recommendations={props.recommendations} tips={props.tips}/> : null}

       </TargetContainer> */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant={!isPageWide ? 'scrollable' : 'fullWidth'}
        scrollButtons={!isPageWide ? true : false}
        allowScrollButtonsMobile
        indicatorColor="#f7e700"
        id="poimodal-tabs"
      >
        <Tab
          icon={<Icon src={aboutimg}></Icon>}
          label="About"
          className="poi-tab font-lexend"
        ></Tab>
        <Tab
          icon={<Icon src={gettingimg}></Icon>}
          label="Getting Around"
          className="poi-tab font-lexend"
        ></Tab>
        <Tab
          icon={<Icon src={entryimg} />}
          label="Entry Fees"
          className="poi-tab font-lexend"
        ></Tab>

        <Tab
          icon={<Icon src={tipsimg}></Icon>}
          label="Tips"
          className="poi-tab font-lexend"
        ></Tab>
        <Tab
          icon={<Icon src={timingimg}></Icon>}
          label="Timings"
          className="poi-tab font-lexend"
        ></Tab>
        {/* <Tab label="About"></Tab> */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <About short_description={props.short_description}></About>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GettingAround getting_around={props.getting_around} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EntryFees entry_fees={props.entry_fees}></EntryFees>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Recommendations
          recommendations={props.recommendations}
          tips={props.tips}
        />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Timings weekdays={props.weekdays}></Timings>
      </TabPanel>
    </Container>
  );
};

export default Tabscomponent;
