import React from 'react';
import styled from 'styled-components'
  import SectionOne from './sectionone/Index';
import SectionTwo from './SectionTwo';
  import media from '../../../media';
 import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
import { getHumanDate } from '../../../../services/getHumanDate';
 const Container = styled.div`
    width: 100%;        
    background-color: white;
     border-radius: 10px;
    display: flex;
    flex-flow: column;
    height: 100%;
    @media screen and (min-width: 768px){
        border-radius: 10px;
        position: relative;

    }
    
`;

 
 
 
const Booking = (props) =>{
    let isPageWide = media('(min-width: 768px)')
    const getDate = (date) => {
        if(date){
        let year = date.substring(0,4)
        let month = date.substring(5,7);
        let day = date.substring(8,10);
        return(getHumanDate(day+"/"+month+"/"+year) );
        }
    
    }
    

  
    // const detailsarr=[]
    // for(var i=0; i<props.details.length; i++){
    //     if(props.details[i].length)
    //     detailsarr.push(
    //         <li className={props.blur ? 'blurry-text' : ''} style={{fontSize: "0.75rem",  margin: "0.5rem 0 0.5rem 0rem", fontWeight: "300"}} >{props.details[i]}</li>
    //     );
    // }
  
 
 

  
    //  if(isPageWide)
    return(
        <div style={{height: 'max-content'}}>
       <div style={{margin: '0 0 0.25rem 0', fontSize: '18px'}} className='font-lexend'><b>{props.data ? props.data.city ? props.data.city : '' : ''}</b>{' - Taxi Booking'}</div>
        <div style={{margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '300'}} className='font-lexend'>{props.data ? props.data.check_in ? getDate(props.data.check_in) : '' : ''}</div>

        <Container className='border' style={{ borderRadius: "10px"}}>
         <SectionOne data={props.data} rental={props.rental}></SectionOne>
         <SectionTwo rental={props.rental}   is_registration_needed={props.is_registration_needed} isDatePresent={props.isDatePresent} data={props.data}></SectionTwo>
         <SectionThree  is_registration_needed={props.is_registration_needed} are_prices_hidden={props.are_prices_hidden} setShowLoginModal={props.setShowLoginModal} token={props.token}  _deselectBookingHandler={props._deselectTransferBookingHandler} transferFlickityIndex={props.transferFlickityIndex} is_selecting={props.is_selecting} data={props.data}></SectionThree>
         {!props.is_registration_needed && !props.rental? <SectionFour setShowTaxiModal={props.setShowTaxiModal}></SectionFour> : null}
        </Container>
        </div>
    );
 
}

export default  (Booking);