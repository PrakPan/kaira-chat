import React from 'react';
import styled from 'styled-components';
import BackroundImageLoader from '../../UpdatedBackgroundImageLoader';
import media from '../../media';
import ImageLoader from '../../ImageLoader';
import { useRouter } from 'next/router';

const Container = styled.div`
width: 100%;
margin-bottom: 1rem;
height: 60vh;
@media screen and (min-width: 768px){
    margin: 0;
    max-width: 100%;
    height: 30vh;

    
}
&:hover{
    cursor: pointer;
}

`;


const Name = styled.p`
    
    padding: 0rem 0;
    color: black;
    font-weight: 700;
    margin: 0 0 0.25rem 0 ;
    line-height: 1;
    
    
    width: 100%;
    
    @media screen and (min-width: 768px){

    }
`;
// const ImageFade = styled.div`
// width: 100%;
// height: auto;
// border-radius: 10px;
// transition: 0.2s all ease-in-out;
// `;
//  const ImageContainer = styled.div`
//     position: relative;
//     overflow: hidden;
//     border-radius: 10px;

//     &:hover{
//         ${ImageFade}{
//           transition: 0.2s all ease-in-out;
//           transform: scale(1.1);
//          }
//     }
//     @media screen and (min-width: 768px){
    
//     }

//  `;

 const Subtext = styled.p`
    font-weight: 400;
     font-size: 12px;
     margin: 0;
 `;
 

const Experiences= (props) => {
    let isPageWide = media('(min-width: 768px)');
    let filters_to_show = "";
    const router = useRouter();
     try{
    for(var i = 0 ; i < props.filters.length; i++){
        if(i === props.filters.length-1)
        filters_to_show=filters_to_show+props.filters[i];

        else 
        filters_to_show=filters_to_show+props.filters[i] + ", ";

    }
    }catch{

    }
    /*Require props: imgWidth*/
  

//     return(
//       <Container onClick={props.onclick ? props.onclick : null} >  
//           <BackroundImageLoader filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"   padding="0.25rem" zoomonhover center dimensions={{width: 900, height: 900}} height={isPageWide ? "30vh" : '60vh'} filters="linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))"  url={props.img}>
//               <Name className="font-lexend">{props.heading}</Name>
//               <Name className="font-lexend" style={{fontSize: '36px', fontWeight: '700', letterSpacing: '0'}}>{props.location}</Name>
//           </BackroundImageLoader>
//       </Container>
//   ); 
return(
    <div className='hover-pointer' onClick={() => {props.slug ?props._handleCityRedirect(props.slug) : console.log('')}}>
  {/* <ImageLoader

url={'media'}
dimensions={{width: 800, height: 800}}
borderRadius="10px"
dimensionsMobile={{width: 200, height: 200}}

></ImageLoader> */}
            <ImageLoader
            hoverpointer
            url={props.img}
            dimensions={{width: 800, height: 800}}
            borderRadius="10px"
            dimensionsMobile={{width: 800, height: 800}}
          
            ></ImageLoader>
    <div style={{padding: '0.5rem 0'}} className='hover-pointer'>
              {/* <Name className="font-lexend">{props.heading}</Name> */}
               <Name className="font-lexend">{props.location}</Name>
               <Subtext className="font-lexend">{filters_to_show}</Subtext>
               </div>

        </div>
)
}

export default Experiences;
