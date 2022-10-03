import React, {useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
const Container = styled.div`
    
    padding: 1rem;
    @media screen and (min-width: 768px){
        background-color: hsl(0,0%,97%);
        padding: 1rem;
        border-radius: 5px;
    }
`;

const Name = styled.p`
    font-weight: 800;
    margin: 0.5rem 0 0.25rem 0;
    text-align: center;
    font-size: ${props => props.theme.fontsizes.mobile.headings.three};
    @media screen and (min-width: 768px){
        text-align: center;
        font-size: 1.5rem;
        margin: 1rem 0 1rem 0;
        font-weight: 800;
    }
`;
const Designation = styled.p`
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    text-align: center;
    @media screen and (min-width: 768px){
        text-align: center;
        margin: 0 0 0 0;
        font-weight: 600;
        font-size: 1rem;
    }
`;
const Description = styled.p`
    font-weight: 200; 
    letter-spacing: 1px;
    color: #323232;
    margin: 1rem 0;
  text-align: center;

    @media screen and (min-width: 768px){
        text-align: center;
        font-size: 1rem;
        color: black;
        font-weight: 200;
        margin: 1rem auto;
        width: 80%;
    }

`;
 
const Card = (props) => {  
if(window.innerWidth < 768 )
  return(<Container className="border-thin">
        <ImageLoader dimensionsMobile={{ width: 900, height: 900 }}  fit="cover" url={props.url} borderRadius="50%" widthmobile="40%"/>
        <Name className="font-opensans">{props.name}</Name>
        <Designation className="font-opensans">{props.tagline}</Designation>
        <Designation className="font-opensans">{props.designation}</Designation>
        <Description className="font-nunito">{props.text}</Description>
   </Container>
  );
  else return(
    <Container>
        <ImageLoader widthtab="50%" dimensions={{ width: 900, height: 900 }} fit="cover" width="40%" borderRadius="50%" url={props.url}/>
        <Name className="font-opensans">{props.name}</Name>
        {/* <Tagline className="font-opensans"> The "I have an idea" guy</Tagline> */}
        <Designation className="font-opensans">{props.tagline}</Designation>
        <Designation className="font-opensans">{props.designation}</Designation>
        <Description className="font-nunito">{props.text}.</Description>
    </Container>
  )
}

export default Card;
