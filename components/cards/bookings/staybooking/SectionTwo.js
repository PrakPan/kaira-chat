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
    overflow: hidden;
      line-height: 1.5;
 text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 1;
-webkit-box-orient: vertical;
 `;
 const RoomText = styled.p`
 font-size: 13px;
 color:  rgba(91, 89, 89, 1);
min-height: 2.5rem;
    font-weight: 300;
    margin:0;
    letter-spacing: 1px;
    overflow: hidden;
      line-height: 1.5;
 text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
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
      <Container className='font-opensans'>  
                <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        {props.data.check_in &&  props.isDatePresent ? <div>
                            <Heading className='font-opensans'>Check In</Heading>
                            <Text className='font-opensans'>{getDate(props.data.check_in)}</Text>
                        </div> : null}
                        {props.data.check_out &&  props.isDatePresent? <div>
                            <Heading className='font-opensans'>Check Out</Heading>
                            <Text className='font-opensans'>{getDate(props.data.check_out)}</Text>
                        </div> : null}
                    </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'max-content auto',  gridColumnGap: '0.5rem', marginBottom: '0.25rem'}}>
                    <ImageLoader url="media/icons/bookings/bed.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        {/* <div className='center-div'>
                            <Text className='font-opensans'>2 x Super Deluxe rooms</Text>
                        </div> */}
                      { rooms.length ? 
                        rooms.map(room => 
                            <div className='' style={{display: 'grid', gridTemplateColumns: 'max-content auto'}}>
                                <Text className='font-opensans' style={{}}>{room.number_of_rooms + " x "}</Text>
                                <RoomText className='font-opensans' style={{marginLeft: '0.25rem'}}>{room.room_type_name}</RoomText>
                            </div>
                        )
                      : null }
                    </div>
                </div>
                <div style={{display: 'flex',  gap: '0.5rem'}}>
                    <ImageLoader url="media/icons/bookings/tourist.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        {/* <div className='center-div'>
                            <Text className='font-opensans'>2 Adults , 1 Child(s)</Text>
                        </div> */}
                        { rooms.length ? 
                            <div className='' style={{display: 'flex'}}>
                                <Text className='font-opensans'>{rooms[0].number_of_adults > 1 ?  rooms[0].number_of_adults + " Adults " : "1 Adult"}</Text>
                                <Text className='font-opensans' style={{marginLeft: '0.25rem'}}>{rooms[0].number_of_children ? rooms[0].number_of_children === 1 ?  "1 Child" : rooms[0].number_of_children==='0' ? null : rooms[0].number_of_children + " Children"  : null}</Text>
                                <Text className='font-opensans' style={{marginLeft: '0.25rem'}}>{rooms[0].number_of_infants ? rooms[0].number_of_infants  === 1 ?  "1 Infant" : rooms[0].number_of_infants==='0' ? null : rooms[0].number_of_infants + " Infants" : null}</Text>

                            </div>
                      : null }
                    </div>
                </div>
      </Container>
  ); 
  else return null;
}

export default Section;
