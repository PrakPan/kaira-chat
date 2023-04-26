import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock} from '@fortawesome/free-solid-svg-icons';
const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 1rem;

max-width: 100%;
@media screen and (min-width: 768px){

}
`;

const IconContainer = styled.div`
   display: flex;
   flex-direction: column;

`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
text-align: center;
margin: 0.5rem auto;
`;
const IconText= styled.p`
    text-align: center;
    font-size: 0.75rem;
    margin: 0;
`;
const Icons= (props) => {



  return(
      <Container>
       <IconContainer className="" style={{borderStyle: 'none solid none none', borderWidth: '1px', borderColor: '#E4e4e4'}}>
            <StyledFontAwesomeIcon icon={faClock}></StyledFontAwesomeIcon>
            <IconText style={{fontWeight: '600'}} className="font-lexend">Ideal Duration</IconText>
            <IconText style={{fontWeight: '300'}} className="font-nunito">3 Hours</IconText>

       </IconContainer>
       <IconContainer style={{borderStyle: 'none solid none none', borderWidth: '1px', borderColor: '#E4e4e4'}} >
            <StyledFontAwesomeIcon icon={faClock}></StyledFontAwesomeIcon>
            <IconText style={{fontWeight: '600'}} className="font-lexend">Opening Time</IconText>
            <IconText style={{fontWeight: '300'}} className="font-nunito">8:00PM - 5:00PM</IconText>
       </IconContainer>
       <IconContainer >
            <StyledFontAwesomeIcon icon={faClock}></StyledFontAwesomeIcon>
            <IconText style={{fontWeight: '600'}} className="font-lexend">Some Heading</IconText>
            <IconText style={{fontWeight: '300'}} className="font-nunito">Some Text</IconText>
       </IconContainer>
      </Container>
  );

}

export default Icons;