import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import ImageLoader from '../../../ImageLoader';
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
  
   if(props.data)
    return(
      <Container className='font-opensans'>  
                <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div>
                            <Heading className='font-opensans'>Check In</Heading>
                            <Text className='font-opensans'>15th July</Text>
                        </div>
                        <div>
                            <Heading className='font-opensans'>Check Out</Heading>
                            <Text className='font-opensans'>17th July</Text>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/bed.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div className='center-div'>
                            {/* <Heading className='font-opensans'>Check In</Heading> */}
                            <Text className='font-opensans'>2 x Super Deluxe rooms</Text>
                        </div>
                      
                    </div>
                </div>
                <div style={{display: 'flex',  gap: '0.5rem'}}>
                    <ImageLoader url="media/icons/bookings/tourist.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div className='center-div'>
                            {/* <Heading className='font-opensans'>Check In</Heading> */}
                            <Text className='font-opensans'>2 Adults , 1 Child(s)</Text>
                        </div>
                      
                    </div>
                </div>
      </Container>
  ); 
  else return null;
}

export default Section;
