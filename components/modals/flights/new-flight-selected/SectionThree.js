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
`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  console.log('d', props.data)
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
                {props.data.cost ?   "₹ "+ getIndianPrice(Math.round(props.data.cost))+" /-"  : null}
                </Cost>
                </div>
      </Container>
  ); 
  else return null;
}

export default Section;
