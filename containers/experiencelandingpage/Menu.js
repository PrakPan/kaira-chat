import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { makeStyles, Theme } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Details from './Details';
import Itinerary from './itinerary/Index';
import Booking from './booking/Index';
import media from '../../components/media';
import { getIndianPrice } from '../../services/getIndianPrice';
import Button from '../../components/ui/button/Index';
// import Pricebannermobile from './pricebannermobile';
import * as ga from '../../services/ga/Index';

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
  
      borderStyle: 'none !important',
      borderColor: '#e4e4e4 !important',
      borderWidth: '1px !important',
      top: '0 !important',
    
    },
    appbarmobile: {
      backgroundColor: 'black !important',
      color: 'white !important',
      height: '66px !important' ,
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
  }
}));


const HeaderExtraPadding = styled.div`
height: 3.5vh;
background-color: white;
z-index: 1000; 
position: sticky;
top: 10vh;
`;
const CostContainer  = styled.div`
display: none;
@media screen and (min-width: 768px){

  position: absolute;
  right: 0;
   
  display: flex;
  flex-direction: row;
  z-index: 1000;
  align-items: center;
}
 
`;
const StrikedCost = styled.div`
text-decoration: line-through;

  &:before{
    margin-right: 0.5rem;
  content: 'Starting From';
  display: inline-block;
  text-align: right;
  line-height:1;
  font-weight: 300;
  font-size: 0.75rem;
  text-decoration: none !important;

}
`;
const Cost = styled.div`
text-align: right;
line-height:1.5;
font-weight: 800;
font-size: 1.25rem;

`;
const DiscountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
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
      // let scrollhandler = () => {
      //   let currentScroll = window.pageYOffset;
      //   if ( currentScroll > window.innerHeight + window.innerHeight*0.2) {
      //     setShowEnquiryDesktop(true);
      //   } else {
      //     setShowEnquiryDesktop(false);
      //   }

      // };
      // window.addEventListener('scroll', scrollhandler);
      // return () => {
      //   window.removeEventListener('scroll', scrollhandler);
      // };
    });
    

  const handleChange = (event, newValue) => {
    const tabs = ["breif", "itinerary" , "bookings"]
    ga.event({
      action: "Experience-tabs-"+tabs[newValue],
      params : {
        'experience': props.data.name
      }
    });
 
      window.scrollTo(0,window.innerHeight)
    
    setValue(newValue);
  };

  const openBooking = () => {
    ga.event({
      action: "Experience-tabs-Book_Now",
      params : {
        'experience': props.data.name
      }
    });
 
     window.scrollTo(0,window.innerHeight);
    setValue(2);
  }
  const openItinerary = () => {
     
      window.scrollTo(0,window.innerHeight)
     setValue(1);
   }

   console.log(props.data)
  // if(props.experienceLoaded)
  return (
    <div className={classes.root}>
       {/* {window.innerWidth > 768 ? 
      <DesktopBanner title={props.title} image ={props.images.main_image} payment={props.payment} openBooking={openBooking}>
      </DesktopBanner> : null} */}
      <AppBar position="sticky" className='black-mui-navbar'>
        <Tabs id="experience-tabs" textColor="white" value={value} onChange={handleChange} aria-label="simple tabs example" centered  style={{zIndex: "2"}}  indicatorColor="">
            <Tab  label="Overview" className="font-opensans experience-tab" />
            <Tab   label="Itinerary" className="font-opensans experience-tab"  />
            <Tab label="Booking" className="font-opensans experience-tab"  /> 
        </Tabs>
          {value!==2 ? <CostContainer >
          {props.data.starting_price ? <DiscountContainer>
            <StrikedCost>{"₹ "+getIndianPrice(Math.round(Math.round(props.data.starting_price/100)*1.15))}</StrikedCost>
           <Cost className='font-opensans'>{"₹ "+getIndianPrice(Math.round(props.data.starting_price/100))+ " /-"}</Cost>
          </DiscountContainer> : null}
           <Button onclick={openBooking} hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" margin="0 2rem 0 0" padding="0.25rem 1rem">Buy Now</Button>
        </CostContainer> : null}
      </AppBar>
      {/* <Pricebannermobile openBooking={openBooking} starting_price={props.data.starting_price}></Pricebannermobile> */}
      {/* <HeaderExtraPadding>
      </HeaderExtraPadding> */}

      <TabPanel value={value} index={0}>
      {/* <div className='hidden-desktop'><HeaderExtraPadding></HeaderExtraPadding></div> */}
            <Details openItinerary={openItinerary} data={props.data} payment={props.payment} openBooking={openBooking}></Details>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className='hidden-desktop'><HeaderExtraPadding></HeaderExtraPadding></div>
        {props.itinerary && props.brief ? <Itinerary itinerary={props.itinerary} brief={props.brief}></Itinerary> : null}
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div className='hidden-desktop'><HeaderExtraPadding></HeaderExtraPadding></div>
            {true  ? <Booking starting_price={props.data.starting_price}  setGalleryOpen={() => props.setGalleryOpen(true)} setGalleryImages={(imagesArr) => props.setGalleryImages(imagesArr)} experience={props.title}  bookings={props.bookings} payment={props.payment} experienceId={props.data.id} itinerary_id={props.data.itinerary_id} ></Booking> : null}
      </TabPanel>
    </div> 
  );
  // else return <div></div>
}


export default React.memo((SimpleTabs));