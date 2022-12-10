import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components'
import CityContainer from '../CityContainer';
import Timer from '../../../containers/itinerary/timer/Index';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconElement from '../element/Index';
import Locations from './Locations';
// import {ITINERARY_ELEMENT_TYPES} from '../../../services/constants';
import {connect} from 'react-redux';
import { getHumanDate } from '../../../services/getHumanDate';
import { isJson } from '../../../services/isJSON';

const Container = styled.div`
@media screen and (min-width: 768px){
    width: 80%;
        margin: auto;
        display: grid;
        grid-template-columns: 20% 80%;
        padding: 2rem;
}
    `;

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
            {value === index && (
              <div>
                {children}
              </div>
            )}
          </div>
        );
      }
const getCityFromDay = (day_slab_index, day_slabs, city_slabs) => {
  // if(city_slabs)
    for(var i =0 ; i<city_slabs.length-1 ; i++){
        if(city_slabs[i].day_slab_location.start_day_slab_index === day_slab_index) return i;
        else if(city_slabs[i].day_slab_location.start_day_slab_index < day_slab_index){
            if(city_slabs[i].day_slab_location.end_day_slab_index > day_slab_index) return i;
        }
    }
    return i;
}

const getCityIdFromDay = (day_slab_index, day_slabs, city_slabs) => {
  const city = getCityFromDay(day_slab_index, day_slabs, city_slabs);
 }

const Itinerary = (props) =>{
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
            {value === index && (
              <div>
                {children}
              </div>
            )}
          </div>
        );
      }

    const ref=useRef();

    const [value, setValue] = React.useState(0);
    const [locationValue, setLocationValue] = useState(0);

    
    const [dayTabsJSX, setDayTabsJSX]= useState([]);
    const [dayPanelsJSX, setDayPannelsJSX] = useState([]);

 
  
    const handleChange = (event, newValue) => {
          setLocationValue(getCityFromDay(newValue,  props.day_slabs, props.city_slabs))
        setValue(newValue);
      if(typeof window!=='undefined' && !props.experience) window.scrollTo(0,window.innerHeight*0.5);
      };
    const hadleLocationChange = (event, newValue) => {
        setLocationValue(newValue);
        setValue(props.city_slabs[newValue].day_slab_location.start_day_slab_index)
        if(typeof window!=='undefined' && !props.experience)  window.scrollTo(0,window.innerHeight*0.5);

    }
     const [hideTimer, setHideTimer] = useState(false);

    const _handleTimerClose = () => {
        props._hideTimerHandler();
        window.scrollTo(0,window.innerHeight/2)
        setHideTimer(true);

    }
    let day_tabs_jsx = [];
    let day_pannesl_jsx = [];
    const _generateDaySlabs = () => {
         let day_slabs_jsx = [];
          if(props.day_slabs)
        for(var i = 0; i<props.day_slabs.length; i++){
            day_tabs_jsx.push(
                <Tab  style={{textTransform: 'none'  , marginRight: '0.5rem', padding: '0.25rem 1rem', color: 'white !important'      }} label={getHumanDate(props.day_slabs[i].slab)}   className="itinerary-day-tab font-opensans" >
        </Tab>
            )
            //push an empty array since day is present
            day_slabs_jsx.push([]);
            for(var j =0 ; j<props.day_slabs[i].slab_elements.length; j++){
              // const city_id = getCityIdFromElement(props.day_slabs[i].slab_elements[j].element_index, props.day_slabs, props.city_slabs)
              let city_id=null;
              if(props.day_slabs[i].slab_elements[j].activity_data) if(props.day_slabs[i].slab_elements[j].activity_data.city)
              
              city_id=props.day_slabs[i].slab_elements[j].activity_data.city.id;
             
              // const city_id=props.day_slabs[i].slab_elements[j];  
              //Push element if not newcity
                if(props.day_slabs[i].slab_elements[j].element_type !== 'newcity')
                    day_slabs_jsx[i].push(
                    <div>
                    <IconElement is_registration_needed = {props.is_registration_needed}  element_index={props.day_slabs[i].slab_elements[j].element_index}  selectedPoi={props.selectedPoi} is_auth={props.email === props.user_email ? true: false} traveleritinerary={props.traveleritinerary} is_poi_rec={props.day_slabs[i].slab_elements[j].type === 'POI/Activity Recommendation' ? true : false} is_food={props.day_slabs[i].slab_elements[j].type === 'Food Recommendation' && isJson(props.day_slabs[i].slab_elements[j].text) ? true : false}  day_slab_index={i} slab_element_index={j} is_experience={props.is_experience} enablepoiedit={props.day_slabs[i].slab_elements[j].activity_data ? true : false} poi_name={props.day_slabs[i].slab_elements[j].activity_data ? props.day_slabs[i].slab_elements[j].activity_data.name : null} city_id={city_id} setShowPoiModal={props.setShowPoiModal} element_type={props.day_slabs[i].slab_elements[j].element_type} type="image" blur={props.blur} name={props.day_slabs[i].slab_elements[j].heading} meta={props.day_slabs[i].slab_elements[j].meta} text={props.day_slabs[i].slab_elements[j].text} image={props.day_slabs[i].slab_elements[j].icon}></IconElement>
                    </div>
                )
            }
            day_pannesl_jsx.push(<TabPanel ref={ref} value={value} index={i}>
                <div style={{marginBottom: '10vh'}}>{day_slabs_jsx[i]}</div>
            </TabPanel>)    
        }
        
         // setDayTabsJSX(day_tabs_jsx);
        
        // setDayPannelsJSX(day_pannesl_jsx);
        
    }
    useEffect(()=>{

    // _generateDaySlabs();
},[])
_generateDaySlabs();

   
    
    return(
    <Container id="kochi-anchor" style={{marginTop : props.showTimer && !props.hideTimer ? '-50vh' : '0' }}>
        {props.showTimer? <Timer hours={props.hours} minutes={props.minutes} seconds={props.seconds} startingTimer={props.startingTimer} timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={props.hideTimer} _handleTimerClose={_handleTimerClose} _hideTimerHandler={props._hideTimerHandler}></Timer> : null}
        <Tabs id="day-tab" value={value}  onChange={handleChange} indicatorColor="false" disableRippled  variant={'scrollable'}
        scrollButtons={  true  }
        allowScrollButtonsMobile>
                     {day_tabs_jsx}


            </Tabs >
            {day_pannesl_jsx}
        <Locations city_slabs={props.city_slabs} value={locationValue} handleChange={hadleLocationChange}></Locations>
     </Container>);
    
}

const mapStateToPros = (state) => {
  return{
    token: state.auth.token,
    email: state.auth.email
  }
}


export default connect(mapStateToPros)(Itinerary);