import React, {useState} from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Button from '../../../ui/button/Index';
import {AiFillPlusSquare, AiOutlinePlusSquare, AiOutlineMinusSquare} from 'react-icons/ai';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import DropDown from './Dropdown';
 const Container = styled.div`
 margin: 0;
@media screen and (min-width: 768px){
   
    
}


`;
 const GridContainer=styled.div`
 display: flex;
 flex-direction: row;
 justify-content: flex-end;
 align-items: center;
 
 `;
 const Cost = styled.p`
font-weight: 800;
font-size: 1rem;
line-height: 1;
margin:   0;

@media screen and (min-width: 768px) {

    font-size: 1.25rem;
    }
`;
 const CounterContainer = styled.div`
 background-color: #f7e700;
 border-radius: 10px;
 padding: 0.25rem 1rem;
 margin: 0.25rem 0  0 0;
 &:hover{
     cursor: pointer;
 }
 `;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
    const [showCounter, setShowCounter] = useState(false);
    const [counterValue, setCounterValue] = useState(1);

    const _increaseCounter = () => {
        setCounterValue(counterValue+1);
    }

    const _decreaseCounter = () => {
        if(counterValue === 1) setShowCounter(false);
        else {
            setCounterValue(counterValue - 1);
        }
    }
 //    if(props.data)
    return(
      <Container className='font-lexend'>  
      <GridContainer>
        <div className='center-div' style={{marginRight: '0.5rem'}}><Cost>
      {"₹ " + (getIndianPrice(Math.round(props.data.price * counterValue/100)) )+" /-"}
      </Cost></div>
            {/* <Button width="100%" borderRadius="0 0 0 10px" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" onclickparam={null} onclick={() => console.log('test')}>View Details</Button> */}
            {/* {!showCounter ? 
            <Button width="max-content" margin="0.25rem 0 0 0"  padding="0.25rem 1rem" borderRadius="10px" borderStyle="solid none none none"  borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" bgColor="#f7e700" color="black" onclickparam={null} onclick={() =>  setShowCounter(true)}>Select</Button>
         : <CounterContainer className='center-div font-lexend' >
         <div style={{width: 'max-content', display: 'grid', gridGap: '0.25rem', gridTemplateColumns: 'max-content max-content max-content'}}>
         <div className='center-div'><AiOutlineMinusSquare onClick={_decreaseCounter} style={{fontSize: '1rem'}}></AiOutlineMinusSquare></div>
         <div style={{lineHeight: 'normal'}}>{counterValue}</div>
         <div className='center-div'><AiOutlinePlusSquare onClick={_increaseCounter}></AiOutlinePlusSquare></div>

         </div>
       
       </CounterContainer>} */}
       <DropDown itinerary_id={props.selectedBooking.itinerary_id} transfer_type={props.selectedBooking.transfer_type} taxi_type={props.data.taxi_type} duration={props.selectedBooking.costings_breakdown ? props.selectedBooking.costings_breakdown.duration ? props.selectedBooking.costings_breakdown.duration.value : null : null}  onclick={props._updateSearchedTaxi}  ></DropDown>
         </GridContainer>
      </Container>
  ); 
//   else return null;
}

export default Section;
