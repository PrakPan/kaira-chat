import React, { useState} from 'react';
import {Modal} from 'react-bootstrap';
import styled from 'styled-components';
import media from '../../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faStar, faHome} from '@fortawesome/free-solid-svg-icons';
// import Button from '../../../Button';
import Button from '../../../ui/button/Index';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import { BiRupee } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';

const Container = styled.div`
    position: relative;
    padding: 0 0.5rem 3rem 0.5rem;
`;
const Name = styled.div`
    font-size: 1rem;
    font-weight: 700;
    display: inline;
    line-height: 1;

`;
const FlexContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
`;
const RightBottomContainer = styled.div`
    position: absolute;
    right: 0;
    bottom: 0.5rem;
    display: flex;
    
`;
const Cost = styled.div`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0.5rem 0 0;
    line-height: 1;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;


`;
const Location = styled.div`
    font-size: 0.75rem;
`;
const CTA = styled.div`
    background-color: #f7e700;
    border-radius: 2rem;
    padding: 0.25rem 1rem;
    font-size: 0.75rem;
    &:hover{
        cursor: pointer;
    }
`;
const Star  = styled.img`
    display: inline;
    width: 1rem;
    height: 1rem;
`;
const TagsContainer = styled.div`
    display: flex;
    margin: 0 0 2rem 0;
`;
const Tag = styled.div`
    padding: 0.15rem 1rem;
    border-radius: 2rem !important;
    margin-right: 0.5rem;
    font-size: 0.75rem;
`;
const DescriptionContainer = styled.div`
    padding-bottom: 2.5rem;
    font-size: 0.70rem;
`;
const RatingContainer = styled.div`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: max-content;
    padding: 0.25rem;
    background-color: green;
    color: white;
    font-size: 0.75rem;
    border-radius: 2px;
`;
const Accommodation = (props) => {
    const [costJSX, setCostJSX] = useState()
  let isPageWide = media('(min-width: 768px)')
   return(
      <Container className=''>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
            <Name className='font-lexend'>
             {props.name}
             <BsInfoCircle style={{marginLeft: '0.25rem'}}></BsInfoCircle>
            </Name>
            
            {/* <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star> */}

        </div>
        <TagsContainer>
                {props.star ? <Tag className='border'>
                    <FontAwesomeIcon icon={faStar} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                    {props.star+" star"}
                </Tag> : null}
                {/* <Tag className='border'>
                    <FontAwesomeIcon icon={faHome} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                    {props.type}
                </Tag> */}
        </TagsContainer>
        <div style={{marginBottom: '0rem'}}>
            {/* <p style={{color: 'hsl(0,0%,60%)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: '500', margin: '0 0 0.25rem 0'}} className='font-lexend'>AMMENITEIS</p> */}
            <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0.25rem 0'}} className='font-lexend'>
                <span>{props.number_of_rooms ? props.number_of_rooms +" x " : "1 x "}</span>
                {props.room_type ? ''+ props.room_type : ' Standard Room'}</p>
            {props.pricing_type === 'CP' ?  <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0.5rem 0'}} className='font-lexend'>Breakfast Included</p> : null}
            {props.pricing_type === 'EP' ?  <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0.5rem 0'}} className='font-lexend'>Room Only</p> : null}
            {props.pricing_type === 'MAP' ?  <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0.5rem 0'}} className='font-lexend'>Breakfast and Lunch / Dinner Included</p> : null}
            {props.pricing_type === 'AP' ?  <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0.5rem 0'}} className='font-lexend'>Breakfast , Lunch and Dinner Included</p> : null}
            {props.pricing_type !== 'AP' && props.pricing_type !== 'MAP' && props.pricing_type !== 'EP' && props.pricing_type !== 'CP' ?  <p style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0.5rem 0'}} className='font-lexend'>Room Only</p> : null}

            <FontAwesomeIcon icon={faWifi} style={{width: '1rem', display: 'block'}}></FontAwesomeIcon>
        
        </div>
        <RightBottomContainer>
        <Cost className='font-lexend'>
            {props.cost - props.selectedBooking.cost > 0 ? <FaArrowUp style={{fontWeight: '600', color: 'red', fontSize: '1.25rem', marginRight: '0.25rem'}}></FaArrowUp> : <FaArrowDown style={{fontWeight: '600', color: 'green', fontSize: '1.25rem', marginRight: '0.25rem'}}></FaArrowDown> }
            <BiRupee style={{fontWeight: '300'}}></BiRupee>
            {props.cost - props.selectedBooking.cost > 0 ?  " "+getIndianPrice(props.cost - props.selectedBooking.cost)+" /-" : " "+getIndianPrice((-1 * (props.cost - props.selectedBooking.cost)))+" /-"  }</Cost>

            {/* <Button
            boxShadow
             onclick={props._updateBookingHandler}
            onclickparam={
                {old_booking_id: props.selectedBooking.id,
                itinerary_id: props.itinerary_id,
                tailored_id: props.tailored_id,
                accommodation: props.accommodation_id,
                city: props.selectedBooking.city,
                costing_breakdown:[ {
                    "number_of_adults": props.selectedBooking.pax["number_of_adults"],
                    "number_of_children": props.selectedBooking.pax["number_of_children"],
                    "number_of_infants": props.selectedBooking.pax["number_of_infants"],
                    "pricing_type": props.pricing_type,
                    "room_type": props.room_type,
                    "room_type_name": props.room_type,
                    "number_of_rooms": props.selectedBooking.number_of_rooms,
                    id: props.room_id

                }],
                    new_booking_id: props.new_booking_id,
                    old_accommodation_id: props.selectedBooking.accommodation
                }
            } borderRadius="2rem" padding="0.25rem 1rem" borderWidth="0" bgColor="#f7e700" hoverColor="white" hoverBgColor="black">Select</Button> */}
        <Button
            boxShadow
             onclick={props._updateBookingHandler}
            onclickparam={
                {alternates: props.alternates,
                new_booking: props.accommodation,
                itinerary_id: props.itinerary_id,
                tailored_id: props.tailored_id,
                }
            } borderRadius="2rem" padding="0.25rem 1rem" borderWidth="0" bgColor="#f7e700" hoverColor="white" hoverBgColor="black">Select</Button>
        </RightBottomContainer>
        {/* <RatingContainer>9/10</RatingContainer> */}
      </Container>
  );
  

}
 
export default Accommodation;