import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';

import ItineraryContainer from '../../../components/itinerary/Index/IndexDesktop';
import ItineraryContainerMobile from '../../../components/itinerary/newmobile/Index';




import media from '../../../components/media'


const ItineraryMainContainer = (props) => {
  let isPageWide = media('(min-width: 768px)')

  const Location = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  `;
  // min-width: ${(window.innerWidth / (props.brief.city_slabs.length-1))+"px"}


  const LocationsContainer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100vw;
`;
const [isGroup,  setIsGroup] = useState(false);

useEffect(() => {
  // if(props.match.params.id === "LX1513cBeVVjRPY09EhI") setIsGroup(true); // change after is_group field activated in itinerary APIs

}, []);

  const [value, setValue] = React.useState(0);
  const [show, setShow] = useState(true);
  const [location, setLocation] = useState(0);


  const _setLocationHandler = (event) => {
    if(!isPageWide) window.scrollTo(0, window.innerHeight)
    setLocation(event.target.id)
  }

  const handleClose = (event, value) => {
    handleChange(event,0);
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const handleChange = (event, newValue) => {

    if(newValue === 1) setShow(true)
    setValue(newValue);
  };
  const BuyNowBanner = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #F7e700;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  @media screen and (min-width: 768px){
    width: 60%;
    margin: auto;
    left: 20%;
    margin-bottom: 1rem;
    border-radius: 5px;
    display: none;
  }
`;
//Location tabs for mobile
  let locationsArr = [];

  for(var i = 0; i < props.brief.city_slabs.length ; i++){
    if(!props.brief.city_slabs[i].is_trip_terminated){
      locationsArr.push(
        <Location key={i}  id={i} className={"font-opensans border-top " + (location == i ? "bg-yellow font-bold" : 'bg-white')} onClick={(event) => _setLocationHandler(event)}>{props.brief.city_slabs[i].city_name}</Location>
      )
    }
  }

  return (
    <div >

        {isPageWide ?
        <ItineraryContainer is_experience city_slabs={props.brief.city_slabs}  itinerary={props.itinerary} newData={props.newData} demoitinerary={props.demoitinerary}></ItineraryContainer>
          :
        <div>
              <ItineraryContainerMobile is_experience experience day_slabs={props.itinerary.day_slabs} location_selected={location} city_slabs={props.brief.city_slabs}  itinerary={props.itinerary} newData={props.newData} demoitinerary={props.demoitinerary}></ItineraryContainerMobile> 
              
          </div>
        }
     
    </div> 
  );
}


export default (ItineraryMainContainer);