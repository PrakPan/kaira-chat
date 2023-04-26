import React from 'react';
import styled from 'styled-components';
import BackroundImageLoader from '../UpdatedBackgroundImageLoader';
import media from '../media';
import ImageLoader from '../ImageLoader';

const Container = styled.div`
width: 100%;
margin-bottom: 1rem;
height: 60vh;
@media screen and (min-width: 768px){
    margin: 0;
    max-width: 100%;
    height: 50vh;

    
}
&:hover{
    cursor: pointer;
}

`;


const Name = styled.p`
    text-align: center;
    padding: 0rem 0;
    color: white;
    font-weight: 500;
    margin: 0;
    line-height: 1;
    font-weight: 300;
    font-size: 22px;
    width: 100%;
    letter-spacing: 1px;
    @media screen and (min-width: 768px){

    }
`;
const Experiences= (props) => {
    let isPageWide = media('(min-width: 768px)')
    /*Require props: imgWidth*/
  

    return(
      <Container onClick={props.onclick ? props.onclick : null} >  
          <BackroundImageLoader filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"   padding="0" zoomonhover center dimensions={{width: 900, height: 1800}} height={isPageWide ? "50vh" : '60vh'} filters="linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))"  url={props.img}>
              <Name className="font-lexend">{props.heading}</Name>
              <Name className="font-lexend" style={{fontSize: '36px', fontWeight: '700', letterSpacing: '0'}}>{props.location}</Name>
          </BackroundImageLoader>
          {/* <ImageLoader borderRadius="10px" url={props.img} dimensions={{width: 200, height: 200}} dimensionsMobile={{width: 200, height: 200}}></ImageLoader> */}
      </Container>
  ); 
}

export default Experiences;
