import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import ImageLoader from '../../../../ImageLoader';
import { getHumanDate } from '../../../../../services/getHumanDate';
const Container = styled.div`
padding: 0.75rem 0.5rem;
display: flex;
flex-direction: column;
max-width: 100%;
  `;
const RouteContainer = styled.div`
display: flex;
 
@media screen and (min-width: 768px){
   
    
}


`;
const Heading = styled.p`
font-size: 15px;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    line-height: 1;
`;
const Location = styled.p`
    font-size: 13px;
    font-weight: 400;
    margin: 0;

`;
 
const IconHeading  = styled.p`
font-size: 13px;
font-weight: 700;
margin:0;
line-height: 1;

`;
const Text = styled.p`
font-size: 13px;
font-weight: 300;
margin:0;
letter-spacing: 1px;
color: rgba(91, 89, 89, 1);

`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
    const getDate = (date) => {
      if(date){
      let year = date.substring(0,4)
      let month = date.substring(5,7);
      let day = date.substring(8,10);
      return(getHumanDate(day+"/"+month+"/"+year) );
      }
  
  }
   if(props.selectedBooking)
    return(
      <Container>
        <Heading>{props.selectedBooking.transfer_type ==='Intercity round-trip' ? 'Round-trip Taxi' : 'One-way Taxi' }</Heading>
      <RouteContainer className='font-opensans'>  
      {/* <div style={{margin: '0 2px 0 0'}}><ImageLoader url="media/icons/bookings/pin.png" leftalign dimensions={{width: 200, height: 250}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader></div> */}

          <Location className="font-opensans">{props.selectedBooking.city}</Location>
            <div style={{margin: '0 2px'}}>
              <ImageLoader url="media/icons/bookings/next.png" leftalign dimensions={{width: 200, height: 200}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader>
            </div>
            <Location className="font-opensans">{props.selectedBooking.destination_city}</Location>
           
      </RouteContainer>
      {/* <div style={{display: 'grid', gridTemplateColumns: 'max-content auto',  gridGap: '0.5rem', marginBottom: '0.25rem', marginTop: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        {props.selectedBooking.check_in ? <div>
                            <IconHeading className='font-opensans'>Trip Start</IconHeading>
                            <Text className='font-nunito'>{getDate(props.selectedBooking.check_in)}</Text>
 
                        </div> : null}
                        {props.selectedBooking.check_out && props.selectedBooking.transfer_type === "Intercity round-trip"? <div>
                            <IconHeading className='font-opensans'>Trip End</IconHeading>
                            <Text className='font-nunito'>{getDate(props.selectedBooking.check_out)}</Text>
 
                        </div> : null}
                    </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'max-content auto',  gridGap: '0.5rem',  marginBottom: '0.75rem', marginTop: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/distance.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        {props.selectedBooking.costings_breakdown  ? props.selectedBooking.costings_breakdown.distance ?  <div>
                            <IconHeading className='font-opensans'>{props.selectedBooking.costings_breakdown.distance.text}</IconHeading>
                            <Text className='font-nunito'>Included</Text>
 
                        </div> : null : null }
                        {props.selectedBooking.costings_breakdown ?  props.selectedBooking.costings_breakdown.duration ? <div>
                            <IconHeading className='font-opensans'>{props.selectedBooking.costings_breakdown.duration.text}</IconHeading>
                            <Text className='font-nunito'>Included</Text>
 
                        </div> : null : null}
                    </div>
    </div> */}
        <div style={{display: 'grid',  gridGap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem', marginTop: '0.75rem'}}>
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content auto' , gridGap: '0.5rem',}}><ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
               
                        {props.selectedBooking.check_in ? <div>
                            <Heading className='font-opensans'>Trip Start</Heading>
                            <Text className='font-nunito'>{getDate(props.selectedBooking.check_in)}</Text>
                            {/* <Text className='font-nunito'>10:00AM</Text> */}

                        </div> : <div></div>}
                
                     </div>
                    {props.selectedBooking.check_out && props.selectedBooking.transfer_type !== 'Intercity one-way' ? <div>
                            <IconHeading className='font-opensans'>Trip End</IconHeading>
                            <Text className='font-nunito'>{getDate(props.selectedBooking.check_out)}</Text>
                            {/* <Text className='font-nunito'>10:00AM</Text> */}

                        </div> : null}

                    {props.selectedBooking.transfer_type == 'Intercity one-way' ? <div style={{display: 'grid', gridGap: '0.5rem', gridTemplateColumns: 'max-content auto'}}>
                    <ImageLoader url="media/icons/bookings/time.svg" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                            <div>
                            <IconHeading className='font-opensans'>{props.selectedBooking.costings_breakdown ? props.selectedBooking.costings_breakdown.duration ? props.selectedBooking.costings_breakdown.duration.text :null  : null}</IconHeading>
                            <Text  className='font-nunito'>Included</Text>
                            </div>
                        </div> : null}
                </div>
                <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/distance.png" height="auto" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div className='centerdiv'>
                            <IconHeading className='font-opensans'>{props.selectedBooking.costings_breakdown ? props.selectedBooking.costings_breakdown.distance ? props.selectedBooking.costings_breakdown.distance.text :null  : null}</IconHeading>
                            <Text   className='font-nunito'>Included</Text>
                        </div>
                     
                    </div>
                </div>
            
      </Container>
  ); 
  else return null;
}

export default Section;
