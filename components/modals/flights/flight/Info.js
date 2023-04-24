import React, {useState} from 'react';
import styled from 'styled-components';
import media from '../../../media';
// import Info from './Info';
// import Gallery from './gallery/Index';
// import ImageLoader from '../../../ImageLoader';
import { getHumanDate } from '../../../../services/getHumanDate';
// import right from '../../../../public/assets/right-arrow.png';
import right from '../../../../public/assets/right-arrow-flight.png';

import { getHumanTime } from '../../../../services/getHumanTime';
import Link from 'next/link';
import Button from '../../../Button';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import { BiRupee } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';

const Container = styled.div`
    margin: 0 0 0rem 0;

    @media screen and (min-width: 768px) {
        padding: 0rem;

    }
`;


const DetailsGridContainer = styled.div`
display: grid;
grid-template-columns: 3fr 2fr;
grid-template-rows: fit-content(100%) fit-content(100%);
`;
const Cost = styled.div`
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0 0 0 0;
    line-height: 1;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    width: 100%;


`;
const Accommodation = (props) => {
  let isPageWide = media('(min-width: 768px)')
 
  const getTime = (datetime) => {
    return(getHumanTime(datetime.substring(11,16)));
}
const getDate = (datetime) => {
    let date = datetime.substring(0,10);
    let year = date.substring(0,4)
    let month = date.substring(5,7);
    let day = date.substring(8,10);
     // let actualdate = (date.slice(5)+"-"+date.substring(0,4)).replaceAll('-','/') + " "+ date.substring(0,4)
    return(getHumanDate(day+"/"+month+"/"+year) + " " + year);
}
const  minuteToHours = (n) => {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return  rhours + " h " + rminutes + " m";
    }
   return(
      <Container className='border-thn'>
         <DetailsGridContainer>
                <div style={{display: 'grid', gridTemplateColumns: 'max-content auto max-content', gridColumnGap: isPageWide ? '2.5rem' : '0.5rem', gridTemplateRows: 'max-content max-content', gridRowGap: '0.5rem'}}>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                                {props.data ? props.data.Segments ? props.data.Segments[0].length ? <div style={{ margin: '0', fontWeight: '700' , fontSize: '1rem'}} className='font-lexend'>{getTime(props.data.Segments[0][0].Origin.DepTime)}</div>:<div style={{ margin: '0', fontWeight: '700' , fontSize: '0.85rem'}} className='font-lexend'>{'--:--PM'}</div> : null : null}
                                {props.data ? props.data.Segments ? <div style={{ margin: '0', fontWeight: '300', fontSize: '1rem'}} className='font-lexend'>{"("+props.data.Segments[0][0].Origin.Airport.CityCode+")"}</div> : null : null}
                            </div>
                            <div style={{margin: '0 0.5rem'}}>
                                <img  height='1rem' src={right} style={{height: '1.25rem', width: '100%', margin: 'auto', display: 'block'}}></img>
                            </div>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                                {props.data ? props.data.Segments ? props.data.Segments[0].length ?  <div style={{ margin: '0', fontWeight: '700' , fontSize: '1rem'}} className='font-lexend'>{getTime(props.data.Segments[0][props.data.Segments[0].length-1].Destination.ArrTime)}</div> :<div style={{ margin: '0', fontWeight: '700' , fontSize: '0.85rem'}} className='font-lexend'>{'--:--PM'}</div> :null : null}
                                {props.data  ? props.data.Segments ? <div style={{ margin: '0', fontWeight: '300', fontSize: '1rem'}} className='font-lexend'>{"("+props.data.Segments[0][props.data.Segments[0].length - 1].Destination.Airport.CityCode+")"}</div> : null : null}
                            </div>
                            
                             <div>
                                {props.data ? props.data.Segments ? props.data.Segments[0].length ?  <div className='font-lexend' style={{fontSize: '0.85rem', fontWeight: '300'}}>{getDate(props.data.Segments[0][0].Origin.DepTime)}</div> :<div className='font-lexend' style={{fontSize: '0.85rem', fontWeight: '300'}}>{''}</div> : null : null}
                                {props.data ? props.data.Segments ? props.data.Segments[0].length ? props.data.Segments[0][0].Origin.Airport.Terminal!=="" ?  <div className='font-lexend' style={{fontSize: '0.85rem', fontWeight: '300'}}>{"Terminal "+props.data.Segments[0][0].Origin.Airport.Terminal}</div> : null : null : null : null}
                            </div>
                            <div >
                            {props.data ? props.data.Segments.length ? props.data.Segments[0].length === 1 ? <div className='font-lexend text-center' style={{fontSize: '0.85rem', fontWeight: '300'}}>No Stops</div> : null : null : null}

                            {props.data ? props.data.Segments.length ? props.data.Segments[0].length > 1 ? <div className='font-lexend text-center' style={{fontSize: '0.85rem', fontWeight: '300'}}>{props.data.Segments[0].length-1+ " stop(s)"}</div> : null : null : null}
                            {props.data ? props.data.Segments.length ? props.data.Segments[0].length > 1 ? <div className='font-lexend text-center' style={{fontSize: '0.85rem', fontWeight: '300'}}>{'via '+props.data.Segments[0].slice(1).map(res => res.Origin.Airport.CityName+",")}</div> : null : null : null}
                            {props.data? props.data.Segments.length? props.data.Segments[0].length > 1 ? <div className='font-lexend text-center' style={{fontSize: '0.85rem', fontWeight: '300'}}>{minuteToHours(props.data.Segments[0][1].GroundTime)+ ' Layover'}</div> : null : null : null} 
                            {props.data ? props.data.Segments.length ? props.data.Segments[0].length === 1 ? <div className='font-lexend text-center' style={{fontSize: '0.85rem', fontWeight: '300'}}>{minuteToHours(props.data.Segments[0][0].Duration)}</div> : null : null : null}

                            </div>
                            <div>
                                {props.data ?  props.data.Segments ? props.data.Segments[0].length ? <div className='font-lexend' style={{fontSize: '0.85rem', fontWeight: '300'}}>{getDate(props.data.Segments[0][props.data.Segments[0].length-1].Destination.ArrTime)}</div> : <div className='font-lexend' style={{fontSize: '0.85rem', fontWeight: '300'}}>{''}</div> : null : null}
                                {props.data ? props.data.Segments ?  props.data.Segments[0].length ? props.data.Segments[0][props.data.Segments[0].length-1].Destination.Airport.Terminal!=="" ? <div className='font-lexend' style={{fontSize: '0.85rem', fontWeight: '300'}}>{"Terminal "+props.data.Segments[0][props.data.Segments[0].length-1].Destination.Airport.Terminal}</div> : null : null : null : null}
                            </div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '0', padding: '0'}}>
                            <div className="font-lexend center-div text-center">
                                <div style={{color: props.data ? props.data.IsRefundable ?  'green' : 'red' : 'black', marginBottom: '0.5rem' , fontSize: '0.75rem'}}>{props.data ? props.data.IsRefundable ? 'PARTIALLY REFUNDABLE' : 'NON REFUNDABLE' : ''}</div>
                                <div style={{marginBottom: '0rem', textAlign: 'center', color: '#44A5FF'}}><Link href='/' style={{textDecoration: 'none !important'}}><a href='/' style={{color: '#44A5FF !important', textDecoration: 'none !important'}}  className='font-lexend'>Fare Rules</a></Link></div>


                            </div>
                            <div className='center-div'>
                            <Cost className='font-lexend'>
                                     {props.selectedBooking && props.data? props.data.Fare ? props.data.Fare.OfferedFare - props.selectedBooking.cost > 0 ? <FaArrowUp style={{fontWeight: '600', color: 'red', fontSize: '1.25rem', marginRight: '0.25rem'}}></FaArrowUp> : <FaArrowDown style={{fontWeight: '600', color: 'green', fontSize: '1.25rem', marginRight: '0.25rem'}}></FaArrowDown>  :  <FaArrowDown style={{fontWeight: '600', color: 'grey', fontSize: '1.25rem', marginRight: '0.25rem'}}></FaArrowDown> : null }
                                    <BiRupee style={{fontWeight: '300'}}></BiRupee>
                                    {props.selectedBooking && props.data? props.data.Fare ? props.data.Fare.OfferedFare  - props.selectedBooking.cost > 0 ?  " "+getIndianPrice(Math.round(props.data.Fare.OfferedFare - props.selectedBooking.cost))+" /-" : " "+getIndianPrice((-1 * Math.round((props.data.Fare.OfferedFare - props.selectedBooking.cost))))+" /-"  : "0" : null } </Cost>
                                <Button
            boxShadow
             onclick={props._updateBookingHandler}
            onclickparam={
                {bookings: null,
                booking_id: props.selectedBooking.id,
                itinerary_id: props.itinerary_id,
                result_index: props.data ? props.data.ResultIndex : null
                }
            } borderRadius="2rem" margin="0.5rem 0 0 0" padding="0.2rem 2rem" borderWidth="0" bgColor="#f7e700" hoverColor="white" hoverBgColor="black">Select</Button>                            </div>
                            
            
                        </div>
                           
                          
                        </DetailsGridContainer>
      </Container>
  );


}
 
export default Accommodation;