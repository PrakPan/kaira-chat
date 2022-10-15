import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import {IoCheckboxOutline} from 'react-icons/io5';
import { getIndianPrice } from '../../../../services/getIndianPrice';
const Container = styled.div`
margin: 1.5rem 0.5rem 0 0.5rem;
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
`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  
   if(props.data)
    return(
      <Container className='font-opensans'>  
                {/* <div style={{display: 'flex', alignItems: 'center', }} >
                    <div style={{lineHeight: '1', fontSize: '13px', fontWeight: '700', padding: '0.25rem', backgroundColor: '#f7e700', borderRadius: '5px'}} className="font-opensans">
                       <IoCheckboxOutline style={{lineHeight: '1', fontSize: '15px', marginRight: '0.25rem', fontWeight: '700', marginTop: '-2px'}}></IoCheckboxOutline>
                        Selected
                    </div>
            
                </div > */}
                <div></div>
                <div >
                <Cost className='font-opensans'>
                {"₹"+ getIndianPrice(Math.round(props.data.booking_cost/100))+" /-"}
                </Cost>
                </div>
      </Container>
  ); 
  else return null;
}

export default Section;
