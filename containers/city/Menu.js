import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { makeStyles, Theme } from '@material-ui/styles';
import Box from '@material-ui/core/Box';

import Details from './Details';
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


const useStyles = makeStyles(() => ({
  root: {
    
  },
  appbar: {
      backgroundColor: 'black !important',
      color: 'white !important',
      height: '10vh !important',
      justifyContent: 'center !important',
      alignItems: 'space-between !important',
      borderStyle: 'none !important',
      borderColor: '#e4e4e4 !important',
      borderWidth: '1px !important',
      top: '0 !important',
    
    },
    appbarmobile: {
      backgroundColor: 'black !important',
      color: 'white !important',
      height: '10vh !important' ,
      justifyContent: 'center !important',
      borderStyle: 'solid none none none !important',
      borderColor: '#e4e4e4 !important',
      borderWidth: '1px !important',
      top: '0'
    },
    tabs: {
      width: '60vw',
    },
    tabheading: {
        fontSize: '1rem',
    },
  nopadding: {
      padding: '0 !important',
      overflow: 'hidden',
  }
}));


const HeaderExtraPadding = styled.div`
height: 3vh;
background-color: white;
z-index: 1000; 
position: sticky;
top: 7.5vh;
`;

const SimpleTabs = (props) => {

  let isPageWide = media('(min-width: 768px)')


  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [location, setLocation] = useState(0);
  const [showEnquiryDesktop, setShowEnquiryDesktop] = useState(false);

const EnquireButton = styled.div`
  position: sticky;
  top:  1.25vh;
  margin-left: 88vw;
  width: 10vw;
  background-color: #f7e700;
  z-index: 3000 !important;
  height: 7.5vh;
  font-size: 1.25vw;
  border-radius: 10px;
  visibility: ${showEnquiryDesktop ? 'visible' : 'hidden'};
  &:hover{
    cursor: pointer;
   
  }

`;
    useEffect(() => {
  
    });
    
 
  const openBooking = () => {
    if(typeof window!=='undefined')
   window.scrollTo(0, window.innerHeight*0.9);
    setValue(2);
  }
 
  return (
    <div className={classes.root}>
    
      {/* <AppBar position="sticky" className={ isPageWide? classes.appbar : classes.appbarmobile}>
        <Tabs textColor="white" value={value} onChange={handleChange} aria-label="simple tabs example" centered  style={{zIndex: "2"}}  indicatorColor="">
            <Tab  label="Overview" className="font-opensans experience-tab" />
            <Tab   label="Itinerary" className="font-opensans experience-tab"  />
            <Tab label="Booking" className="font-opensans experience-tab"  /> 
        </Tabs>
      </AppBar> */}
       <div className='hidden-mobile'><EnquireButton onClick={openBooking} className="center-div font-opensans">Enquire Now</EnquireButton></div> 
      {/* <HeaderExtraPadding>
      </HeaderExtraPadding> */}

      {/* <TabPanel value={value} index={0}> */}
            {/* <HeaderExtraPadding></HeaderExtraPadding> */}
            <Details slug={props.slug} _openPoiModal={(poi) => props._openPoiModal(poi)}  experienceLoaded={props.experienceLoaded} data={props.data} payment={props.payment} openBooking={openBooking}></Details>
      {/* </TabPanel> */}
      {/* <TabPanel value={value} index={1} className={classes.nopadding}>
        {props.itinerary && props.brief ? <Itinerary itinerary={props.itinerary} brief={props.brief}></Itinerary> : null}
      </TabPanel>
      <TabPanel value={value} index={2}>
            {true  ? <Booking bookings={props.bookings} setGalleryOpen={() => props.setGalleryOpen(true)} setGalleryImages={(imagesArr) => props.setGalleryImages(imagesArr)} experience={props.title}  bookings={props.bookings} payment={props.payment} experienceId={props.data.id}></Booking> : null}
      </TabPanel> */}
    </div> 
  );
 
}


export default React.memo((SimpleTabs));