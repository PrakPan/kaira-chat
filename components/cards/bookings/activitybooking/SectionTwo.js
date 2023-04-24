import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import ImageLoader from '../../../ImageLoader';
// import { getHumanTime } from '../../../../services/getHumanTime';
import { getHumanDate } from '../../../../services/getHumanDate';
const Container = styled.div`
flex-grow: 1;
margin: 0.5rem 0.5rem 0 0.5rem;
@media screen and (min-width: 768px){
   
    
}


`;
 const Heading  = styled.p`
    font-size: 14px;
    font-weight: 700;
    margin:0;
    line-height: 1;
    
 `;
 const Text = styled.p`
 font-size: 13px;
 color:  rgba(91, 89, 89, 1);

    font-weight: 300;
    margin:0;
    letter-spacing: 1px;
 `;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  
    const getDate = (date) => {
        let year = date.substring(0,4)
        let month = date.substring(5,7);
        let day = date.substring(8,10);
        return(getHumanDate(day+"/"+month+"/"+year) );
    
    }
    let rooms = [];
    let number_of_rooms, number_of_adults, number_of_children, number_of_infants  = null;
    try{
        props.data.costings_breakdown.map(data => {
            rooms.push(data);
        })
    }catch{

    }
   if(props.data)
    return(
      <Container className='font-lexend'>  
                {/* <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}> */}
                    {/* <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader> */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}> 
                        {props.data.check_in &&  props.isDatePresent  &&  !props.is_registration_needed ? <div style={{display: 'flex', gap: '0.5rem'}}>
                            <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                            <div>
                            <Heading className='font-lexend'>Date</Heading>
                            <Text className='font-lexend'>{getDate(props.data.check_in)}</Text>
                            </div>
                        </div> : null}
                        {props.data.ideal_duration_hours_text ? <div style={{display: 'flex', gap: '0.5rem'}}>
                        <ImageLoader url="media/icons/bookings/time.svg" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                        <div>

                            <Heading className='font-lexend'>Duration</Heading>
                            <Text className='font-lexend'>{props.data.ideal_duration_hours_text}</Text>
                            </div>

                        </div> : null}
                        {props.data.costings_breakdown ?  props.data.costings_breakdown.no_of_tickets ? <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                        <ImageLoader url="media/icons/bookings/tourist.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                        <div>

                            {/* <Heading className='font-lexend'>Number o</Heading> */}
                            <Text className='font-lexend'>{props.data.costings_breakdown.no_of_tickets +" Person(s)"}</Text>
                            </div>

                        </div> : null : null}
                    </div>
                {/* </div> */}
{/*               
                <div style={{display: 'flex',  gap: '0.5rem'}}>
                    <ImageLoader url="media/icons/bookings/time.svg" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                     
                        { rooms.length ? 
                            <div className='' style={{display: 'flex'}}>
                                <Text className='font-lexend'>{rooms[0].number_of_adults > 1 ?  rooms[0].number_of_adults + " Adults " : "1 Adult"}</Text>
                                <Text className='font-lexend' style={{marginLeft: '0.25rem'}}>{rooms[0].number_of_children ? rooms[0].number_of_children > 1 ? rooms[0].number_of_adults + " Children" : "1 Child" : null}</Text>
                                <Text className='font-lexend' style={{marginLeft: '0.25rem'}}>{rooms[0].number_of_infants ? rooms[0].number_of_infants > 1 ? rooms[0].number_of_infants + " Children" : "1 Child" : null}</Text>

                            </div>
                      : null }
                    </div>
                </div> */}
      </Container>
  ); 
  else return null;
}

export default Section;
