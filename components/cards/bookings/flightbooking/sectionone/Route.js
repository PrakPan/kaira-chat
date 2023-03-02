import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import ImageLoader from '../../../../ImageLoader';

const Container = styled.div`
display: flex;
align-items: center;

@media screen and (min-width: 768px){
   
    
}


`;
const Location = styled.p`
    font-size: 15px;
    font-weight: 700;
    margin: 0;
`;
 
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
    if(props.data)
    return(
      <Container className='font-opensans'>  
          <Location className={props.data.user_selected ? '' : 'blurry-text'} >{props.data.city}</Location>
            <div style={{margin: '0 0.25rem'}}>
            <ImageLoader blur={!props.data.user_selected}  url="media/icons/bookings/next.png" leftalign dimensions={{width: 200, height: 200}} width="1.5rem" widthmobile="1.5rem" ></ImageLoader>

            </div>
            <Location className={props.data.user_selected ? '' : 'blurry-text'}>{props.data.destination_city}</Location>
           
      </Container>
  ); 
  else return null;
}

export default Section;
