import React, {useState} from 'react';
import styled from 'styled-components';
import Rooms from '../roomtypes/Index';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Timings from '../Timings';
import media from '../../../media';
import Ammenities from '../Ammenities';
import Location from '../Location';
import Policies from '../Policies';
const Container = styled.div`

@media screen and (min-width: 768px){
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
     overflow-y: hidden;
     min-height: 80vw;
    @media screen and (min-width: 768px){
        min-height: max-content;

    }
`;
const Icon = styled.img`
    width: 1.5rem;
    height: 1.5rem;

`;
const Heading = styled.p`
    font-size: 0.75rem;
    margin: 0.5rem 0 0  0;
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
        {value === index && (
            <TargetContainer>{children}</TargetContainer>
         
        )}
      </div>
    );
  }
const Tabscomponent= (props) => {
    let isPageWide = media('(min-width: 768px)');

    const [selectedState, setSelectedState] = useState(0);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  return(
      <Container>
       {/* <GridContainer>
            <Tab onClick={() => setSelectedState(0)} className="font-opensans center-div" style={{fontWeight: selectedState === 0 ? '700' : '400', backgroundColor: selectedState === 0 ? '#f7e700' : 'white'}}>
                <Icon src={aboutimg}/>
                <Heading>About</Heading>
            </Tab>
            <Tab onClick={() => setSelectedState(1)} className="font-opensans center-div" style={{fontWeight: selectedState === 1 ? '700' : '400', backgroundColor: selectedState === 1 ? '#f7e700' : 'white', borderStyle: 'none solid none solid', borderWidth: '1px', borderColor: "#e4e4e4"}}>
                <Icon src={gettingimg}/>
                <Heading>Getting Around</Heading>

            </Tab>
            <Tab onClick={() => setSelectedState(2)} className="font-opensans center-div" style={{fontWeight: selectedState === 2 ? '700' : '400', backgroundColor: selectedState === 2 ? '#f7e700' : 'white'}}>
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
        variant={!isPageWide ? 'scrollable': "fullWidth"}
        scrollButtons={!isPageWide ? true : false}
        allowScrollButtonsMobile
        indicatorColor="#f7e700"
        id="poimodal-tabs"
      >
       <Tab  label="Rooms" className="accommodationdetail-tab font-opensans"></Tab>
       <Tab label="Amenities"  className="accommodationdetail-tab font-opensans"></Tab>
       <Tab label="Location"  className="accommodationdetail-tab font-opensans"></Tab>

       {/* <Tab  label="Policies"  className="accommodationdetail-tab font-opensans"></Tab> */}
       <Tab label="Description"  className="accommodationdetail-tab font-opensans"></Tab>
       {/* <Tab label="About"></Tab> */}
      </Tabs>
      <TabPanel value={value} index={0} >
            <Rooms data={props.data}></Rooms>
       </TabPanel>
       <TabPanel value={value} index={1} >
        <Ammenities data={props.data}></Ammenities>
            {/* <GettingAround getting_around={props.getting_around}/> */}
       </TabPanel>
       <TabPanel value={value} index={2} >
        <Location data={props.data}></Location>
            {/* <EntryFees entry_fees={props.entry_fees}></EntryFees> */}
       </TabPanel>
       {/* <TabPanel value={value} index={3} >
       <Policies data={props.data}></Policies>
       </TabPanel> */}
       
       <TabPanel value={value} index={3} >
            {/* <Timings weekdays={props.weekdays}></Timings> */}
            {/* <p>HeadLine : In Chennai (Chromepet)</p><p>Location : With a stay at Accord Chrome, you ll be centrally located in Chennai, steps from Dr. Rela Institute & Medical Centre - Chennai and within a 5-minute walk of Sree Balaji Medical College And Hospital.  This 4-star hotel is 0.4 mi (0.7 km) from Super Saravana Stores - Chrompet and 5.1 mi (8.2 km) from Kishkinta.</p><p>Rooms : Make yourself at home in one of the 96 guestrooms featuring minibars and LED televisions. Complimentary wireless Internet access keeps you connected, and digital programming is available for your entertainment. Bathrooms have showers and complimentary toiletries. Conveniences include desks, and housekeeping is provided daily.</p><p>Dining : Satisfy your appetite at the hotel s coffee shop/café, or stay in and take advantage of the 24-hour room service.</p><p>CheckIn Instructions : <ul>  <li>Extra-person charges may apply and vary depending on property policy</li><li>Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges</li><li>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</li><li>This property accepts credit cards, debit cards, and cash</li>  </ul></p><p>Special Instructions : Front desk staff will greet guests on arrival.</p> */}
            {props.data.description ? <div className='font-opensans' dangerouslySetInnerHTML={{__html: props.data.description}}></div> : null}
       </TabPanel>
      
      
       

      </Container>
  );

}

export default Tabscomponent;