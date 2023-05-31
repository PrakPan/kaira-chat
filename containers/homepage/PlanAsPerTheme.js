import { useRouter } from 'next/router'
import React, {  useState } from 'react'
import styled, { keyframes } from 'styled-components'
import media from '../../components/media'
   import * as ga from '../../services/ga/Index';
   import Button from '../../components/ui/button/Index'
import ImageLoader from '../../components/ImageLoader';
import SkeletonCard from '../../components/ui/SkeletonCard'
import openTailoredModal from '../../services/openTailoredModal';
import TripsCounter from './TripsCounter';
const Container = styled.div`
height : 430px;
  display : grid;
  gap : 0.2rem;
  grid-template-areas: 
  'a a a b b b b b'
  'a a a b b b b b'
  'd d e e e e e e'
  'c c c c c c c c'
  'c c c c c c c c';

  padding : 10px;

 @media screen and (min-width: 768px){
    height : 600px;
    gap : 0.5rem;
    grid-template-areas: 
    'a a a a b b b b b'
    'a a a a b b b b b'
    // 'a a a a b b b b b'
    'a a a a b b b b b'
    'a a a a e e e e e'
    'c c c d e e e e e'
    'c c c d e e e e e';
}

& >.d{
    border : null;
    background : rgba(247, 231, 0, 0.2);
  padding : 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size : 14px;
    padding-left : 5px;
    margin-bottom : 0px;
 @media screen and (min-width: 768px){
  padding : 25px;
    font-size : 20px;
    text-align : center;
    align-items : center;
    background : white;
    border : 1px solid black;

}
}

`

const TopSlideIn = keyframes`
from { 
  transform: translateY(0%);
}
to { 
  transform: translateY(30%);
} 
`;

const TopSlideOut = keyframes`
from { 
  transform: translateY(30%);
}
to { 
  transform: translateY(0%);
} 

`;

const TextContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 9px;
  right: ${(props) => (props.right ? "9px" : null)};
  left: ${(props) => (props.right ? null : "9px")};
  text-align: ${(props) => (props.right ? "right" : "left")};
  color: white;
  animation: 0.5s ${TopSlideOut};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  & > p {
    margin-top: -5px;
    font-weight: 500;
    font-size: 14px;
    @media screen and (min-width: 768px) {
      font-size: 20px;
    }
  }
  @media screen and (min-width: 768px) {
    top: 30px;
    left: 30px;
  }
`;

const Heading = styled.div`
font-size : 16px;
font-weight : 700;

@media screen and (min-width: 768px){
    font-size : 25px;
}
`

const GridItem = styled.div`
grid-area : ${props=>props.className};
border-radius : 8px;
position : relative;
overflow :hidden;
height : 100%;
width : 100%;
`
const ImageContainer = styled.div`
cursor : pointer;
height : 100%;
width : 100%;
.StartNow{
    display : none;
    top : 45px;
    animation: 0.5s ${TopSlideIn};
@media screen and (min-width: 768px){
  top : 65px;
  left : 30px;
}
}
transition: 0.5s all ease-in-out ;
&:hover{
    transform: scale(1.1); 
    .AnimateTop{
        animation: 0.5s ${TopSlideIn} forwards;
     }
    .StartNow{
        animation: 0.5s ${TopSlideIn} forwards;
        display : initial;
    }
}
`

const BlackContainer = styled.div`
background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%);
width: 100%;
height: 100%;
position: absolute; 
top: 0;
&:hover{
  background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 58%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#ffffff",GradientType=1);
}
`;

const PlanAsPerTheme = (props) => {
    let isPageWide = media('(min-width: 768px)')
    const router = useRouter();
    const [loading, setLoading] = useState(false);
  const [ImgLoading, setImgLoading] = useState(true)
    const _handleTripRedirect = (path)=>{
      if(path) window.location.href = '/asia/india/' + path
    }

    const order = ['e','b','c','a']
    const ThemeContainer = 
    props.ThemeData?.map((e,i)=>(
        <GridItem className={order[i]} key={i} onClick={()=>_handleTripRedirect(e.path)}>
            {ImgLoading && <SkeletonCard />}
            <ImageContainer style={ImgLoading ? {display : 'none'} : {display : 'initial'}} bg='road-trip.png'>
            <TextContainer className='AnimateTop'>
                <Heading>{e.banner_heading}</Heading>
            {isPageWide && <div className='StartNow'>Explore!</div> }
            </TextContainer>
            <ImageLoader onload={()=>setImgLoading(false)} fit='cover' width="100%" height='100%'  url={e.image}></ImageLoader> 
            <BlackContainer/>

            </ImageContainer>
          
        </GridItem >
      ))
    

  return (
    <>
      <Container>
        {ThemeContainer}
        <GridItem className="d">
          
           <TripsCounter />
          <p
            style={
              isPageWide ? {} : { marginTop: "-10px", marginBottom: "0px" }
            }
          >
            Trips Planned
          </p>
          <p
            style={
              isPageWide
                ? { marginTop: "-15px" }
                : { marginTop: "-5px", marginBottom: "0px" }
            }
          >
            so far.
          </p>
        </GridItem>
      </Container>

      {!props.nostart ? (
        <Button
          onclick={() =>
            openTailoredModal(router, props.page_id, props.destination)
          }
          fontWeight="500"
          boxShadow
          borderRadius="8px"
          bgColor="#F7E700"
          margin="1rem auto"
          width="20rem"
          borderWidth="1px"
        >
          {isPageWide
            ? "Create your free itinerary"
            : "Create your personalised Itinerary"}
          {/* {loading ? <Spinner size={16}></Spinner> : null} */}
        </Button>
      ) : null}
    </>
  );
}


export default PlanAsPerTheme