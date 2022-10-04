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
    padding: 0.5rem;
    background-color: green;
    color: white;
    font-size: 0.75rem;
    border-radius: 2px;
`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
    const RANDOM_RATING = [8.8, 8.9, 9.0, 9.1,9.2,9.3,9.4,9.5,9.6,9.7,9.8];
    let color="rgba(18, 105, 4, 1)";
    if(props.rating){
        console.log(props.rating)

    if(props.rating < 4 && props.rating > 3) color="orange";
    else if(props.rating < 3) color="red";
    }

   if(props.data)
    return(
      <Container className='font-opensans'>  
            <Name className='font-opensans'>{props.data.name}</Name>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex'}}>
                    <ImageLoader url="media/icons/bookings/pin.png" leftalign dimensions={{width: 200, height: 250}} width="1.75rem" widthmobile="1.75rem" ></ImageLoader>
                    <div style={{display: 'flex' , alignItems: 'center'}}>
                        <Subtext className='font-opensans' style={{fontWeight: '600'}}>2 Nights in Goa</Subtext>
                        {/* <Subtext className='font-opensans'>Vagator Beach</Subtext> */}
                    </div>
                </div>
                <div className='center-div'>
                {props.rating &&  color!=='red'? <RatingContainer className="font-opensans" style={{backgroundColor: color, lineHeight: '1'}}>
                        <IoStarSharp style={{fontSize: '1rem', margin: '0 0.25rem 0 0', color: 'white'}}/>
                        {props.rating ? props.rating + " / 5" : RANDOM_RATING[Math.floor(Math.random() * 10)]}
                    </RatingContainer> : null}
                </div>
            </div>
      </Container>
  ); 
  else return null;
}

export default Section;
