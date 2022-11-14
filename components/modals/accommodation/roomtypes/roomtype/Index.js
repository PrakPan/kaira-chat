import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../ImageLoader';
import Tags from './Tags';
import {GoPrimitiveDot} from 'react-icons/go'
import { getIndianPrice } from '../../../../../services/getIndianPrice';
import Button from '../../../../ui/button/Index';
import {  AiOutlinePlusSquare, AiOutlineMinusSquare} from 'react-icons/ai';
import media from '../../../../media';
import Dropdown from './Dropdown';
const Container = styled.div`
width: 100%;
display: grid;
grid-template-columns: 45vw auto;
border-radius: 5px;
@media screen and (min-width: 768px){
    grid-template-columns: max-content auto;

}
`;
const NoImageContainer = styled.div`
width: 100%;
display: grid;
 border-radius: 5px;
 padding: 2vw;
@media screen and (min-width: 768px){
    
}
`;
const ContentContainer = styled.div`
    padding: 0.5rem;
`;
const Name = styled.p`
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0 0;
    text-align: center;
`;
const AmenitiesContainer = styled.div`
    display: flex;
     flex-wrap: wrap;
`;
const Ammenity = styled.div`
    margin-right: 0.5rem;
    font-size: 0.75rem;
    
`;
const Cost = styled.p`
font-weight: 800;
font-size: 1rem;
line-height: 1;
margin: 0 0 2px 0;

@media screen and (min-width: 768px) {

    font-size: 1.25rem;
    }
`;
const CounterContainer = styled.div`
background-color: #f7e700;
border-radius: 5px;
padding: 0.25rem 1rem;
margin: 0.5rem 0  0 0;
&:hover{
    cursor: pointer;
}
`;
const RoomType = (props) => {
    const [ammenities, setAmmenities] = useState(null);
    const [showCounter, setShowCounter] = useState(false);
    const [counterValue, setCounterValue] = useState(1);
    let isPageWide = media('(min-width: 768px)')

    const _increaseCounter = () => {
        setCounterValue(counterValue+1);
    }

    const _decreaseCounter = () => {
        if(counterValue === 1) setShowCounter(false);
        else {
            setCounterValue(counterValue - 1);
        }
    }

    useEffect(() => {
        let ammenities_arr = [];
        if(props.data.room_facilities){
            for(var i=0; i<props.data.room_facilities.length; i++){
                // if(i === 5) break;
                ammenities_arr.push(
                    <Ammenity className='font-opensans'><GoPrimitiveDot style={{marginRight: '3px'}}></GoPrimitiveDot>{props.data.room_facilities[i]}</Ammenity>
                );
            }
            setAmmenities(ammenities_arr)
        }
       
      }, [props.data]);
      let image = 'media/icons/bookings/notfounds/noroom.png';
      if(props.images.length){
        for(var i = 0 ; i < props.images.length ; i++){
            if(props.images[i].ImageType === '2'){
                image=props.images[i].ImageUrl;
                break;
            }
        }
      }
      console.log(props.data)
      if(true)
   return(
      <Container className='border-thin'>
            <div style={{padding: !isPageWide ?  '2vw' : '1vw', width: isPageWide ? '25vh' : 'max-cotent'}}>
            <ImageLoader  fit="contain" url={props.images.length ? image: 'media/icons/bookings/notfounds/noroom.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="20vh" height={isPageWide ? '20vh' : "41vw" } widthmobile="41vw"  margin="auto"/> 
                           <Name className='font-opensans'>{props.data.room_type}</Name>

            </div>
            <ContentContainer style={{display: 'flex', flexDirection: 'column'}}>
                {/* <Name className='font-opensans'>{props.data.room_type}</Name> */}
                {/* <Tags data={props.data}></Tags> */}
                <div ><AmenitiesContainer>
                    {ammenities  ? ammenities.length ? ammenities.length > 5 ?  ammenities.splice(0,4) : ammenities : null : null}            
                </AmenitiesContainer>
                {ammenities  ? ammenities.length ? ammenities.length > 5 ?  <p style={{fontSize: '0.75rem', marginLeft: '3px', marginTop: '0.5rem', textDecoration: 'underline' , color:  'rgba(91, 89, 89, 1)'}} className="font-opensans">View All</p> : null : null : null}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1', alignItems : 'flex-end', justifyContent: 'flex-end'}}>
                    <Cost>
                    {"₹ " + (getIndianPrice(Math.round(props.data.prices.min_price*counterValue/100)) )+" /-"}
                    </Cost>
                    <div>
                        {/* {!showCounter ? <Button onclick={() => setShowCounter(true)} bgColor="#f7e700" borderWidth="0" fontSize="1rem" lineHeight="1" padding="0.25rem 1rem" borderRadius="5px" bold margin="0.5rem 0 0 0" width="100%">Select</Button>
                       :  <CounterContainer className='center-div font-opensans' >
            <div style={{width: 'max-content', display: 'grid', gridGap: '0.25rem', gridTemplateColumns: 'max-content max-content max-content'}}>
            <div className='center-div'><AiOutlineMinusSquare onClick={_decreaseCounter} style={{fontSize: '1rem'}}></AiOutlineMinusSquare></div>
            <div style={{lineHeight: '1'}}>{counterValue}</div>
            <div className='center-div'><AiOutlinePlusSquare onClick={_increaseCounter}></AiOutlinePlusSquare></div>

            </div>
          
          </CounterContainer>} */}
          <Dropdown></Dropdown>
                    </div>
                </div>
            </ContentContainer>
     </Container>
  );
  else return(
    <NoImageContainer className='border-thin'>
            
                 <Name style={{textAlign: 'left'}} className='font-opensans'>{props.data.room_type}</Name>
                 <AmenitiesContainer>
                    {ammenities}            
                </AmenitiesContainer>
      </NoImageContainer>
  )
// else return null;

}

export default RoomType;