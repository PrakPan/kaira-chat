import React, {useRef, useEffect, useState} from 'react';
 import styled from 'styled-components';
import media from '../../../media';
 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faStar, faHome} from '@fortawesome/free-solid-svg-icons';
 import Button from '../../../ui/button/Index';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import { BiRupee } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import ImageLoader from '../../../ImageLoader';
import {IoStarSharp} from 'react-icons/io5';
import {BsArrowDown} from 'react-icons/bs';
const Container = styled.div`
    position: relative;
    padding: 0 0.5rem;
    margin: 0.5rem 0;
`;
const Name = styled.div`
    font-size: 1rem;
    font-weight: 700;
    display: inline;
    line-height: 1;
    margin-bottom: 0.75rem

`;
 
 
 
 
 
const TagsContainer = styled.div`
    display: flex;
    margin: 0 0 0.75rem 0;
`;
const Tag = styled.div`
    padding: 0.08rem 0.7rem;
    border-radius: 5px !important;
    margin-right: 0.5rem;
    font-size: 0.75rem;
`;
 
const RatingContainer = styled.div`
   
    width: max-content;
    padding: 0.25rem;
    margin-top: 0.25rem;
    background-color: green;
    color: white;
    font-size: 0.75rem;
    border-radius: 2px;
`;
 const Cost = styled.p`
    font-weight: 600;
    font-size: 0.9rem;
    line-height: 1;
    margin: 0;
 `;

const Accommodation = (props) => {
   let isPageWide = media('(min-width: 768px)')
    const MEAL_TEXT = {
        "CP" : "Breakfast Included",
        "EP": "Room Only",
        "MAP": "Breakfast and Lunch / Dinner Included",
        "AP": "Breakfast, Lunch and Dinner Included"
    };
    const RANDOM_RATING = [8.8, 8.9, 9.0, 9.1,9.2,9.3,9.4,9.5,9.6,9.7,9.8];
    let color="rgba(18, 105, 4, 1)";
    if(props.rating){
        console.log(props.rating)

    if(props.rating < 4 && props.rating > 3) color="orange";
    else if(props.rating < 3) color="red";
    }

  return(
      <Container className=''>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Name className='font-opensans'>
             {props.name}
            </Name>
            
            {/* <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star> */}

        </div>
        <TagsContainer>
                {props.star ? <Tag className='border'>
                    {/* <FontAwesomeIcon icon={faStar} style={{marginRight: '0.25rem'}}></FontAwesomeIcon> */}
                    {props.star+" star"}
                </Tag> : null}
                {/* <Tag className='border'>
                    <FontAwesomeIcon icon={faHome} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                    {props.type}
                </Tag> */}
        </TagsContainer>
        <div style={{marginBottom: '0rem'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'max-content auto', gridGap: '0.5rem'}}>
                <ImageLoader leftalign url="media/icons/bookings/bed.png" width="2rem" widthmobile="2rem"></ImageLoader>
                <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-opensans'>
                <span>{props.number_of_rooms ? props.number_of_rooms +" x " : "1 x "}</span>
                {props.accommodation.rooms_available.length ? ''+ props.accommodation.rooms_available[0].room_type : ' Standard Room'}</p>
      
                </div>
               
            </div>
            {/* <p style={{color: 'hsl(0,0%,60%)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: '500', margin: '0 0 0.25rem 0'}} className='font-opensans'>AMMENITEIS</p> */}
           
        </div>
        {props.rating &&  color!=='red'? <RatingContainer className="font-opensans" style={{backgroundColor: color, lineHeight: '1'}}>
                        <IoStarSharp style={{fontSize: '1rem', margin: '0 0.25rem 0 0', color: 'white'}}/>
                        {props.rating ? props.rating + " / 5" : RANDOM_RATING[Math.floor(Math.random() * 10)]}
                    </RatingContainer> : null}
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', margin: '0.5rem 0 0 0'}}>
                <BsArrowDown style={{color: 'green', fontSize: '1.5rem'}}></BsArrowDown>
                <Cost  className='font-opensans'>INR 5,000</Cost>
        </div>
        {/* <RightBottomContainer>
        <Cost className='font-opensans'>
            <BiRupee style={{fontWeight: '300'}}></BiRupee>
            { " "+getIndianPrice(props.accommodation.price_lower_range_ext/100)+" /-"   }</Cost>

         <Button
            boxShadow
             onclick={props._updateSearchedAccommodation}
            onclickparam={
                {bookings: props.bookings,
                new_booking: props.accommodation,
                itinerary_id: props.itinerary_id,
                tailored_id: props.tailored_id,
                }
            } borderRadius="2rem" padding="0.25rem 1rem" borderWidth="0" bgColor="#f7e700" hoverColor="white" hoverBgColor="black">Select</Button>
        </RightBottomContainer> */}
      </Container>
  );
  

}
 
export default Accommodation;