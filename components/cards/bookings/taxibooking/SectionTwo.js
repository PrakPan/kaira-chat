import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import ImageLoader from '../../../ImageLoader';
import { getHumanDate } from '../../../../services/getHumanDate';
const Container = styled.div`
flex-grow: 1;
margin: 0.75rem 0.5rem 0 0.5rem;
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
    console.log('data', props.data);
   if(props.data)
    return(
      <Container className='font-opensans'>  
                <div style={{display: 'grid',  gridGap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem'}}>
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content auto' , gridGap: '0.5rem',}}><ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
               
                        {props.data.check_in ? <div>
                            <Heading className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>Trip Start</Heading>
                            <Text className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>{getDate(props.data.check_in)}</Text>
                            {/* <Text className='font-nunito'>10:00AM</Text> */}

                        </div> : <div></div>}
                
                     </div>
                    {props.data.check_out && props.data.transfer_type !== 'Intercity one-way' ? <div>
                            <Heading className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>Trip End</Heading>
                            <Text className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>{getDate(props.data.check_out)}</Text>
                            {/* <Text className='font-nunito'>10:00AM</Text> */}

                        </div> : null}

                    {props.data.transfer_type == 'Intercity one-way' ? <div style={{display: 'grid', gridGap: '0.5rem', gridTemplateColumns: 'max-content auto'}}>
                    <ImageLoader url="media/icons/bookings/time.svg" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                            <div>
                            <Heading   className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>{props.data.costings_breakdown ? props.data.costings_breakdown.duration ? props.data.costings_breakdown.duration.text :null  : null}</Heading>
                            <Text className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>Included</Text>
                            </div>
                        </div> : null}
                </div>
                <div style={{display: 'grid',  gridGap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem'}}>

                <div style={{display: 'grid', gridTemplateColumns: 'max-content auto',  gridGap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/distance.png" height="auto" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div className='centerdiv'>
                            <Heading className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>{props.data.costings_breakdown ? props.data.costings_breakdown.distance ? props.data.costings_breakdown.distance.text :null  : null}</Heading>
                            <Text   className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>Included</Text>
                        </div>
                     
                    </div>
                </div>
                {true ? 
                   <div style={{display: 'grid', gridGap: '0.5rem', gridTemplateColumns: 'max-content auto'}}>
                  <ImageLoader url="media/icons/bookings/car-seat.svg" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                       <div>
                            <Heading className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>{props.data.costings_breakdown ? props.data.costings_breakdown.total_taxi ? props.data.costings_breakdown.taxi_occupancy + " People" : null : null}</Heading>
                            <Text className={props.data.user_selected ? 'font-opensans' : 'font-opensans blurry-text'}>{'Occupancy'}</Text>
                            {/* <Text className='font-nunito'>10:00AM</Text> */}

                        </div></div> : null}
                </div>
            
             
      </Container>
  ); 
  else return null;
}

export default Section;
