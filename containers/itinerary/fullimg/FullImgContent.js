import React, {useEffect} from 'react';
import styled from 'styled-components';

const Container = styled.div`
width: 100%;
text-align: center; 
position: absolute;
bottom: 0;
color: white;
@media screen and (min-width: 768px){
}
`;
const CityHeading = styled.h1`
    font-size: ${props => props.theme.fontsizes.mobile.headings.one};
    font-weight: 700;
    @media screen and (min-width: 768px){
        font-size: ${props => props.theme.fontsizes.desktop.headings.two};
    }
`;
const Duration = styled.p`
    font-size: ${props => props.theme.fontsizes.mobile.headings.three};
    font-weight: 700;
    @media screen and (min-width: 768px){
        font-size: ${props => props.theme.fontsizes.desktop.headings.five};
    }
`;
const FullImg = (props) => {
    
  return(
    <Container>
        <CityHeading className="font-lexend">{props.heading}</CityHeading>
        {props.plan ? <Duration className="font-nunito">{props.plan.duration_number+" "+props.plan.duration_unit}</Duration> : null}
    </Container>

  );
}

export default FullImg;
