import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { makeStyles, Theme } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Booking from './booking1/CheckLoginWrapper';
import Register from './register/Index';
import Breif from './breif/NewIndex';
import ItineraryContainer from '../../components/itinerary/Index/IndexDesktop';
import ItineraryContainerMobile from '../../components/itinerary/newmobile/Index';
import media from '../../components/media'; 
import PoiEditModal from '../../components/modals/editpoi/Index';
import { getIndianPrice } from '../../services/getIndianPrice';
import Button from '../../components/ui/button/Index';
import PriceBannerMobile from './PriceBannerMobile';
// import Accommodation from '../../components/modals/accommodation/Index';
import axiosbookingupdateinstance from '../../services/bookings/UpdateBookings';
import * as ga from '../../services/ga/Index';

const Location = styled.div`
padding: 1rem;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
`;
const LocationsContainer = styled.div`
display: flex;
position: fixed;
bottom: 0;
width: 100vw;
overflow-x: scroll;

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
  content: '15% Off*';
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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
      backgroundColor: 'black !important',
      color: 'white !important',
      height: '66px !important',
      justifyContent: 'center',
      top: '0 !important'
    },
  
}));

const SimpleTabs = (props) => {
  let isPageWide = media('(min-width: 768px)')
  

const [isGroup,  setIsGroup] = useState(false);

useEffect(() => {
  // change after is_group field activated in itinerary APIs
  // if(props.match.params.id === "LX1513cBeVVjRPY09EhI" || props.match.params.id === "AY2n7HcBeVVjRPY0MgwO"  || props.match.params.id==="9OjdZ3gBeVVjRPY01cew") setIsGroup(true); 
  if(props.showbooking){
    setValue(2);
    window.scrollTo(0,window.innerHeight);
  }
}, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [show, setShow] = useState(true);
  const [location, setLocation] = useState(0);
  const [hours, setHours] = useState('-');
  const [minutes, setMinutes] = useState('-');
  const [seconds, setSeconds] = useState('-');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [blurItinerary, setBlurItinerary] = useState(true);
  const [showItineraryTimer, setShowItineraryTimer] = useState(true);
  const [minimiseTimer, setMinimiseTimer] = useState(false);
  const [minimseBookingTimer,setMinimiseBookingTimer] = useState(false);
  const [blurBooking, setBlurBooking ] = useState(false);
  const [showBookingTimer, setShowBookingTimer] = useState(true);

 
const [timerValid, setTimerValid] = useState(false);

const [selectedPoi, setSelectedPoi] = useState({name: 'Kasol'});

  const _setLocationHandler = (event) => {
    window.scrollTo(0, window.innerHeight/2);
    setLocation(event.target.id)
  }

  
 
  const handleChange = (event, newValue) => {
    const tabs = ['brief', 'itinerary', 'booking']
    ga.event({
      action: "Itinerary-tabs-"+tabs[newValue],
      params : {
      }
    });
    if(isPageWide)
    window.scrollTo(0,window.innerHeight)
    else window.scrollTo(0,window.innerHeight/2)
  
    if(newValue === 1){
 
    }
    if(newValue === 2){
      // if(props.getAccommodationAndActivitiesHandler)
      props.getAccommodationAndActivitiesHandler();
      // getAccommodationAndActivitiesHandler
       if(timerValid){
        setShowBookingTimer(true);
        setBlurBooking(true);
      }
      if(isPageWide)
      window.scrollTo(0,window.innerHeight)
      else window.scrollTo(0,window.innerHeight/2)
    }
    setValue(newValue);
  };
  const openBookingDesktop = () => {
    ga.event({
      action: "Itinerary-tabs-Book_Now",
      params : {
        'Key': ''
      }
    });
    window.scrollTo(0,window.innerHeight);
 
    setValue(2);

  }
  const openBookingMobile = () => {
    ga.event({
      action: "Itinerary-tabs-Book_Now",
      params : {
        'key': ''
      }
    });
    window.scrollTo(0,window.innerHeight/2);
 
    setValue(2);

  }
 
//Location tabs for mobile
  let locationsArr = [];
  let totalcityslabs = 0;
  if(props.breif) if(props.breif.city_slabs)
   for(var j = 0; j < props.breif.city_slabs.length ; j++){
    if(!props.breif.city_slabs[j].is_trip_terminated){
      totalcityslabs+=1;
    }
  }
  const locationtabwidth =  100 / (totalcityslabs)+"vw";
  if(props.breif) if(props.breif.city_slabs)

  for(var i = 0; i < props.breif.city_slabs.length ; i++){
    if(!props.breif.city_slabs[i].is_trip_terminated){
      locationsArr.push(
        <Location id={i} style={{minWidth: locationtabwidth}} className={"font-opensans center-div border-top " + (location == i ? "bg-yellow font-bold" : 'bg-white')} onClick={(event) => _setLocationHandler(event)}>{props.breif.city_slabs[i].city_name}</Location>
      )
    }
  }
 
  useEffect(() => {
  
    if(props.itineraryReleased){
       setShowItineraryTimer(false);
      setShowBookingTimer(false);
      setBlurBooking(false);
      setBlurItinerary(false);
      setTimerValid(false);
      
    }
    else{

    }
    return () => {
     
  }
  }, [props.itineraryDate, props.itineraryReleased, props.timeRequired]);

const _previewItineraryHandler=()=> {
  setBlurItinerary(false);
  setValue(1);
}
const _minimiseTimerHandler= () => {
  setBlurItinerary(false);
  setMinimiseTimer(true);
}
const _minimiseBookingTimerHandler = () => {
  setMinimiseBookingTimer(true);
 }
 


const _handlePoiEditModalOpen = (poi) => {
   ga.event({
    action: "Itinerary-poiedit-open",
    params : {
      'poi': poi.name, 
      'city': poi.city_id
    }
  });
   setSelectedPoi({
    "name": poi.name,
    "city_id": poi.city_id,
    "day_slab_index": poi.day_slab_index,
    "slab_element_index": poi.slab_element_index,
    "element_index": poi.element_index,
  })
  props.setShowPoiModal(true);
}
const _handleFlighModalShow=()=> {
   props.setShowFlightModal(true);
}
const _handleFlightModalClose=()=> {
   props.setShowFlightModal(false);
}
  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appbar}>
        <Tabs id="itinerary-tabs" value={value} onChange={handleChange}  aria-label="simple tabs example" centered  style={{zIndex: "2"}}  indicatorColor="">
          <Tab label="Brief" className="font-opensans experience-tab" />
          <Tab label="Itinerary" className="font-opensans experience-tab" />
          {!isGroup ? <Tab label="Booking" className="font-opensans experience-tab"/> : <Tab label="Register" className="font-opensans experience-tab"/>}
        </Tabs>
        {value!==2 && props.payment ? <CostContainer >
          {true ? <DiscountContainer>
            {/* <StrikedCost>{"₹ "+getIndianPrice(Math.round(Math.round(props.payment.total_cost/100)/0.85))}</StrikedCost> */}
           <Cost className='font-opensans'>{"₹ "+getIndianPrice(Math.round(props.payment.total_cost/100))+ " /-"}</Cost>
          </DiscountContainer> : null}
           <Button onclick={openBookingDesktop} hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" margin="0 2rem 0 0" padding="0.25rem 1rem">Book Now</Button>
        </CostContainer> : null}
      </AppBar>
      {!isPageWide && value!==2 ? <PriceBannerMobile openBooking={openBookingMobile} payment={props.payment}></PriceBannerMobile> : null}
      <TabPanel value={value} index={0} >
        <Breif traveleritinerary={props.traveleritinerary} hours={hours} minutes={minutes} seconds={seconds}   breif={props.breif} hideTimer={minimiseTimer} timeRequired={props.timeRequired} itineraryReleased={props.itineraryReleased} itineraryDate={props.itineraryDate} showTimer={showItineraryTimer} _hideTimerHandler={_minimiseTimerHandler} blur={blurItinerary}></Breif>
      </TabPanel>
      <TabPanel value={value} index={1} style={{padding: '0'}}>
        {isPageWide ?
        <ItineraryContainer selectedPoi={selectedPoi} user_email={props.user_email} is_preview={props.preview} is_stock={props.is_stock} setShowPoiModal={_handlePoiEditModalOpen} traveleritinerary={props.traveleritinerary}   hideTimer={minimiseTimer} timeRequired={props.timeRequired} itineraryReleased={props.itineraryReleased} itineraryDate={props.itineraryDate} showTimer={false} _hideTimerHandler={_minimiseTimerHandler} blur={false} city_slabs={props.breif.city_slabs}  itinerary={props.itinerary} newData={props.newData} demoitinerary={props.demoitinerary}></ItineraryContainer>
          :
          <div>
              <ItineraryContainerMobile selectedPoi={selectedPoi} user_email={props.user_email} is_preview={props.preview} is_stock={props.is_stock} setShowPoiModal={_handlePoiEditModalOpen} traveleritinerary={props.traveleritinerary}  day_slabs={props.itinerary.day_slabs} hours={hours} minutes={minutes} seconds={seconds}  timeRequired={props.timeRequired}  hideTimer={minimiseTimer} itineraryDate={props.itineraryDate}  showTimer={false}   _hideTimerHandler={_minimiseTimerHandler} blur={false} location_selected={location} city_slabs={props.breif.city_slabs}  itinerary={props.itinerary} newData={props.newData} demoitinerary={props.demoitinerary}></ItineraryContainerMobile> 
                {/* <LocationsContainer >
                {locationsArr}
              </LocationsContainer> */}
          </div>
          // <NewMobileItinerary city_slabs={props.breif.city_slabs} day_slabs={props.itinerary.day_slabs} hours={hours} minutes={minutes} seconds={seconds}  timeRequired={props.timeRequired}  hideTimer={minimiseTimer} itineraryDate={props.itineraryDate}  showTimer={showItineraryTimer}   _hideTimerHandler={_minimiseTimerHandler} blur={blurItinerary} location_selected={location} city_slabs={props.breif.city_slabs}  itinerary={props.itinerary} newData={props.newData} demoitinerary={props.demoitinerary}/>
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        {isGroup ? <Register></Register> : <Booking _deselectActivityBookingHandler={props._deselectActivityBookingHandler} activityFlickityIndex={props.activityFlickityIndex} _deselectFlightBookingHandler={props._deselectFlightBookingHandler} flightFlickityIndex={props.flightFlickityIndex}  _deselectTransferBookingHandler={props._deselectTransferBookingHandler} transferFlickityIndex={props.transferFlickityIndex} stayFlickityIndex={props.stayFlickityIndex} setStayFlickityIndex={props.setStayFlickityIndex} selectingBooking={props.selectingBooking} _deselectStayBookingHandler={props._deselectStayBookingHandler} _reloadFlightBookings={props._reloadFlightBookings} getPaymentHandler={props.getPaymentHandler} flightLoading={props.flightLoading} flightBookings={props.flightBookings} transferLoading={props.transferLoading}  cardUpdateLoading={props.cardUpdateLoading} _updateFlightBookingHandler ={props._updateFlightBookingHandler} _updateStayBookingHandler={props._updateStayBookingHandler} activityBookings={props.activityBookings} flightBookings={props.flightBookings} transferBookings={props.transferBookings} stayBookings={props.stayBookings} _selectTaxiHandler={props._selectTaxiHandler} showFlightModal={props.showFlightModal} setShowFlightModal={_handleFlighModalShow} setHideFlightModal={_handleFlightModalClose} user_email={props.user_email} no_bookings={props.no_bookings} traveleritinerary={props.traveleritinerary} preview={props.preview} id={props.id} is_stock={props.is_stock} _updatePaymentHandler={props._updatePaymentHandler} _updateBookingHandler={props._updateBookingHandler}  setShowBookingModal={() => props.setShowBookingModal(true)} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal} hours={hours} minutes={minutes} seconds={seconds}    timeRequired={props.timeRequired} hideTimer={minimseBookingTimer} showTimer={false} itineraryDate={props.itineraryDate} blur={false} openItinerary={_previewItineraryHandler}  _handleTimerClose={_minimiseBookingTimerHandler} setImagesHandler={props.setImagesHandler} payment={props.payment} booking={props.booking} _reloadTransferBookings={props._reloadTransferBookings}></Booking>}
      </TabPanel>
      { !props.preview ? <PoiEditModal setItinerary={props.setItinerary} itinerary_id={props.id} selectedPoi={selectedPoi} tailored_id={props.booking ? props.booking[0]["tailored_itinerary"] : ''} _updatePaymentHandler={props._updatePaymentHandler} setShowPoiModal={() => _handlePoiEditModalOpen({name: 'kasol'})} showPoiModal={props.showPoiModal} setHidePoiModal={props.setHidePoiModal}></PoiEditModal> : null}
{/* <Accommodation show={true} ></Accommodation> */}
    </div> 
  );
}


export default (SimpleTabs);