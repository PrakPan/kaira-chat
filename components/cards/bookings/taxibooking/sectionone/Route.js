import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import ImageLoader from '../../../../ImageLoader';

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
`;
const Location = styled.p`
    font-size: 13px;
    font-weight: 400;
    margin: 0;

`;
 
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
 
   if(props.data)
    return(
      <Container>
        <Heading>{"Inter-City Taxi"}</Heading>
      <RouteContainer className='font-opensans'>  
      {/* <div style={{margin: '0 2px 0 0'}}><ImageLoader url="media/icons/bookings/pin.png" leftalign dimensions={{width: 200, height: 250}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader></div> */}

          <Location className="font-opensans">{props.data.city}</Location>
            <div style={{margin: '0 2px'}}>
              <ImageLoader url="media/icons/bookings/next.png" leftalign dimensions={{width: 200, height: 200}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader>
            </div>
            <Location className="font-opensans">{props.data.destination_city}</Location>
           
      </RouteContainer>
      </Container>
  ); 
  else return null;
}

export default Section;
