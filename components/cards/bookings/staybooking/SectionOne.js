import React from 'react';
import styled from 'styled-components';
import media from '../../../media';

import {IoStarSharp} from 'react-icons/io5';
import ImageLoader from '../../../ImageLoader';
const Container = styled.div`
border-style: none none solid none;
border-color: rgba(238, 238, 238, 1);
border-width: 2px;
padding: 0.5rem;
@media screen and (min-width: 768px){
   
    
}


`;
const Name = styled.p`
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
`;
const Subtext = styled.p`
    font-size: 0.85rem;
    letter-spacing: 1px;
    margin: 0;
    line-height: 1;
`;
const RatingContainer = styled.div`
   
    width: max-content;
    padding: 0.25rem;
    background-color: green;
    color: white;
    font-size: 0.75rem;
    border-radius: 2px;
    display: flex; 
    align-items: center;
`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
    const RANDOM_RATING = [8.8, 8.9, 9.0, 9.1,9.2,9.3,9.4,9.5,9.6,9.7,9.8];
    let color="rgba(18, 105, 4, 1)";
    console.log(props.data)
    try{
    if(props.data.user_rating){
        // console.log(props.rating)

    if(props.data.user_rating < 3.8 && props.data.user_rating > 3) color="orange";
    else if(props.data.user_rating < 3) color="red";
    }}catch{

    }

   if(props.data)
    return(
      <Container className='font-opensans'>  
            <Name className='font-opensans'>{props.data.name}</Name>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex'}}>
                    <ImageLoader url="media/icons/bookings/pin.png" leftalign dimensions={{width: 200, height: 250}} width="1.75rem" widthmobile="1.75rem" ></ImageLoader>
                    <div style={{display: 'flex' , alignItems: 'center'}}>
                        <Subtext className='font-opensans' style={{fontWeight: '600'}}>{props.data.duration > 1 ? props.data.duration+" Nights " : props.data.duration === 1 ? "1 Night " : null}</Subtext>
                        <Subtext className='font-opensans' style={{fontWeight: '600', marginLeft: '0.25rem'}}>{props.data.city  ? "in "+props.data.city : null}</Subtext>

                        {/* <Subtext className='font-opensans'>Vagator Beach</Subtext> */}
                    </div>
                </div>
                <div className='center-div'>
                {props.data ? props.data.user_rating &&  color!=='red'? <RatingContainer className="font-opensans " style={{backgroundColor: color, lineHeight: '1'}}>
                        <IoStarSharp style={{fontSize: '1rem', margin: '0 0.25rem 0 0', color: 'white', lineHeight: '1'}}/>
                         { props.data.user_rating  +" /5"} 
                    </RatingContainer> : null : null }
                </div>
            </div>
      </Container>
  ); 
  else return null;
}

export default Section;
