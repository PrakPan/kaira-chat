import React from 'react';
import styled from 'styled-components';
import media from '../../../media';

import {IoStarSharp} from 'react-icons/io5';
const Container = styled.div`
display: grid;
grid-template-columns: auto max-content;
border-style: none none solid none;
border-color: rgba(238, 238, 238, 1);
border-width: 2px;
padding: 0.5rem;
@media screen and (min-width: 768px){
   
    
}


`;
const Name = styled.div`
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
      overflow: hidden;
      line-height: 1.5;
 text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 1;
-webkit-box-orient: vertical;
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
     try{
    if(props.data.user_rating){

    if(props.data.user_rating < 3.8 && props.data.user_rating > 3) color="orange";
    else if(props.data.user_rating < 3) color="red";
    }}catch{

    }

   if(props.data)
    return(
      <Container className='font-lexend'>  
            <Name className='font-lexend  hover-pointer' onClick={!props.is_registration_needed ? props.setShowBookingModal : () => console.log('')}>{props.data.name}</Name>
             
                <div className='center-div'>
                {props.data ? props.data.user_rating &&  color!=='red'? <RatingContainer className="font-lexend " style={{backgroundColor: color, lineHeight: '1'}}>
                        <IoStarSharp style={{fontSize: '1rem', margin: '0 0.25rem 0 0', color: 'white', lineHeight: '1'}}/>
                         { props.data.user_rating  +" / 5"} 
                    </RatingContainer> : null : null }
                </div>
       </Container>
  ); 
  else return null;
}

export default Section;
