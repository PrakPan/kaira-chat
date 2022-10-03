import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import ImageLoader from '../../../ImageLoader';
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
  
   if(props.data)
    return(
      <Container className='font-opensans'>  
                <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div>
                            <Heading className='font-opensans'>Trip Start</Heading>
                            <Text className='font-nunito'>15th July</Text>
                            <Text className='font-nunito'>10:00AM</Text>

                        </div>
                        <div>
                            <Heading className='font-opensans'>Trip End</Heading>
                            <Text className='font-nunito'>17th July</Text>
                            <Text className='font-nunito'>10:00AM</Text>

                        </div>
                    </div>
                    <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Heading className='font-opensans'>Included</Heading>
                            <Text className='font-nunito'>5 days</Text>
                        </div>
                </div>
                <div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/distance.png" height="auto" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div className='centerdiv'>
                            <Heading className='font-opensans'>Included</Heading>
                            <Text className='font-nunito'>512km</Text>
                        </div>
                     
                    </div>
                </div>
            
             
      </Container>
  ); 
  else return null;
}

export default Section;
