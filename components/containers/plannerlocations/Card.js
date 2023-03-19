import React from 'react';
import styled from 'styled-components';
import BackroundImageLoader from '../../UpdatedBackgroundImageLoader';
import media from '../../media';
import ImageLoader from '../../ImageLoader';
import { useRouter } from 'next/router';

 

 
const ImageFade = styled.div`
width: 100%;
height: auto;
transition: 0.2s all ease-in-out;
`;
 const ImageContainer = styled.div`
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    &:hover{
        ${ImageFade}{
          transition: 0.2s all ease-in-out;
          transform: scale(1.1);
         }
    }
    @media screen and (min-width: 768px){
    height: 35vh;
    }

 `;


 const BlackContainer = styled.div`
 background-color: rgba(0,0,0,0.4);
 width: 100%;
 height: 100%;
 position: absolute; 
 color: white;
display: flex;
align-items: center;
justify-content: flex-end;
padding: 0.5rem;
 top: 0;
 flex-direction: column;
 
 `;
 const Heading = styled.p`
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    margin-bottom: 0.5rem;
 `;
 const Subheading = styled.p`
 font-size: 1rem;
 line-height: 1;
 text-align: center;

    font-weight: 300;
 `;

const Experiences= (props) => {
    let isPageWide = media('(min-width: 768px)');
    const router = useRouter();
    /*Require props: imgWidth*/
  

//     return(
//       <Container onClick={props.onclick ? props.onclick : null} >  
//           <BackroundImageLoader filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"   padding="0.25rem" zoomonhover center dimensions={{width: 900, height: 900}} height={isPageWide ? "40vh" : '60vh'} filters="linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))"  url={props.img}>
//               <Name className="font-opensans">{props.heading}</Name>
//               <Name className="font-opensans" style={{fontSize: '36px', fontWeight: '700', letterSpacing: '0'}}>{props.location}</Name>
//           </BackroundImageLoader>
//       </Container>
//   ); 
return(
    <ImageContainer className='hover-pointer' onClick={(e) => window.location.href="https://dev.thetarzanway.com/travel-planner/"+props.link}>
        <ImageFade><ImageLoader

            url={props.img}
            dimensions={{width: 800, height: 800}}
            dimensionsMobile={{width: 800, height: 800}}
            height="35vh"
            ></ImageLoader></ImageFade>
            <BlackContainer className='font-opensans'>
                <Heading>{props.location}</Heading>
                <Subheading>{props.heading}</Subheading>

            </BlackContainer>
        </ImageContainer>
)
}

export default Experiences;
