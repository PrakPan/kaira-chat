import React from 'react';
import styled from 'styled-components';
import {IoLocationSharp} from 'react-icons/io5'
const Container = styled.div`
display: grid;
grid-template-columns: max-content auto;
@media screen and (min-width: 768px){
    
}
`;

const StyledIcon = styled(IoLocationSharp)`
  color: #f7e700;
  font-size: 2.5rem;
`;
const TextContainer = styled.div``;
const Location = (props) => {
  

  return(
      <Container>
        <StyledIcon></StyledIcon>
        <TextContainer className='center-div'>
          <div className='font-lexend' style={{fontSize: '0.9rem'}}>{props.data.location}</div>
          {/* <div className='font-lexend' style={{fontSize: '0.75rem'}}><em>{props.data.city}</em></div> */}
        </TextContainer>
     </Container>
  );

}

export default Location;