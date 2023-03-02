import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import {IoCheckboxOutline} from 'react-icons/io5';
import { getIndianPrice } from '../../../../services/getIndianPrice';
const Container = styled.div`
margin: 0.5rem 0.5rem 0 0.5rem;
padding: 0.5rem 0;
display: flex;
justify-content: space-between;
@media screen and (min-width: 768px){
   
    
}


`;
const Cost = styled.p`
    font-size: 23px;
    font-weight: 700;
    margin: 0;
    text-align: right;

  
`;
const Pax = styled.p`
font-size: 14px;
font-weight: 300;
margin: 0;
text-align: right;
`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  
   if(props.data)
    return(
      <Container className='font-opensans'>  
                {/* <div onClick={() => props._deselectBookingHandler(props.data)} style={{height: 'max-content',display: 'flex', fontSize: '13px', alignItems: 'center', fontWeight: '700', padding: '0.25rem', backgroundColor: '#f7e700', borderRadius: '5px'}} >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-opensans">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : <IoCheckboxOutline style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline>}
                    </div>
                    <div style={{marginLeft: '4px'}}>Selected</div>
            
                </div > */}
                <div></div>
                {/* <div></div> */}
                <div >
                <Cost className='font-opensans'>
                {props.data.Fare ? props.data.Fare.OfferedFare ?  "₹ "+ getIndianPrice(Math.round(props.data.Fare.OfferedFare))+" /-" : null : null}
                </Cost>
                <Pax>{"For "+props.selectedBooking.pax.number_of_adults + " Adult(s)" + (props.selectedBooking.pax.number_of_children ? ", " + props.selectedBooking.pax.number_of_children + " Child(s)" : "")}</Pax>
                </div>
      </Container>
  ); 
  else return null;
}

export default Section;
