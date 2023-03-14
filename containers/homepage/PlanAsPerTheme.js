import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import media from '../../components/media'
   import * as ga from '../../services/ga/Index';
   import Button from '../../components/ui/button/Index'
import ImageLoader from '../../components/ImageLoader';
   
const Container = styled.div`
height : 430px;
  display : grid;
  gap : 0.2rem;
  grid-template-areas: 
  'a a a b b b b b'
  'a a a b b b b b'
  'a a a b b b b b'
  'a a a b b b b b'
  'a a a b b b b b'
  'a a a b b b b b'
  'd d e e e e e e'
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
    'a a a a b b b b b'
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
    transform: translateX(0px);
  } 
  to { 
    transform: translateX(50px);
  } 
`;

const TopSlideOut = keyframes`
  from { 
    transform: translateX(50px);
  }
  to { 
    transform: translateX(0px);
  } 
`;

const TextContainer = styled.div`
position : absolute;
z-index : 2;
top : 9px;
right : ${props=>props.right? '9px' : null};
left : ${props=>props.right? null : '9px'};
text-align : ${props=>props.right? 'right' : 'left'};
color : white;
animation: 0.5s ${TopSlideOut};

& >p{
    margin-top : -5px;
    font-weight : 500;
    font-size : 14px;
 @media screen and (min-width: 768px){
    font-size : 20px;
}
}
@media screen and (min-width: 768px){
    top : 30px;
    left : 30px;
}

`

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
  top : 90px;
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

const PlanAsPerTheme = (props) => {
    let isPageWide = media('(min-width: 768px)')
    const router = useRouter();


    const [loading, setLoading] = useState(false);

    const _handleTailoredRedirect = () => {
        router.push('/tailored-travel')
      }
      const _handleTailoredClick = () => {
        setLoading(true);
        setTimeout(_handleTailoredRedirect, 1000);
      
        ga.callback_event({
          action: 'TT-Howitworks',
          
          callback: _handleTailoredRedirect,
        })
    }
    
    const _handleTripRedirect = (link)=>{
      router.push(`/travel-planner/${link}-in-india`)
    }

  return (
    <>
     <Container>
        <GridItem className='a' onClick={()=>_handleTripRedirect('road-trips')}>
            <ImageContainer bg='road-trip.png'>
            <TextContainer className='AnimateTop'>
                <Heading>Road Trip</Heading>
                <p>Planner</p>
            </TextContainer>
            {isPageWide && <TextContainer className='StartNow'>Start now!</TextContainer> }
            <ImageLoader fit='cover' height='100%'  url='media/website/road-trip.png'></ImageLoader> 

            </ImageContainer>

        </GridItem >
        
        <GridItem className='b' onClick={()=>_handleTripRedirect('volunteer')}>
        <ImageContainer  bg='volunteer-travel.png'>
        <TextContainer right={isPageWide?false:true} className='AnimateTop'>
                <Heading>Volunteer Travel</Heading>
                <p>Planner</p>
            </TextContainer>
            {isPageWide &&<TextContainer className='StartNow'>Start now!</TextContainer> }
            <ImageLoader fit='cover' height='100%' url='media/website/volunteer-travel.png'></ImageLoader> 

        </ImageContainer>
        </GridItem >

        <GridItem className='c' onClick={()=>_handleTripRedirect('workcation')}>
        <ImageContainer bg='worcation.png' >
        <TextContainer className='AnimateTop'>
                <Heading>Workcation</Heading>
                <p>Planner</p>
            </TextContainer>
           {isPageWide&& <TextContainer className='StartNow'>Start now!</TextContainer> }
            <ImageLoader fit='cover' height='100%'  url='media/website/worcation.png'></ImageLoader> 

        </ImageContainer>
        </GridItem >
        <GridItem className='d' >
        <h2 style={isPageWide?{fontSize : '50px', fontWeight : 700}:{fontSize : '18px', fontWeight : 700}}>3490</h2>
        <p style={isPageWide?{}:{marginTop : '-10px' , marginBottom:'0px'}}>Trips Planned</p>
        <p style={isPageWide?{marginTop : "-15px"}:{marginTop : '-5px' , marginBottom:'0px'}}>so far.</p>
        </GridItem >
        <GridItem className='e' onClick={()=>_handleTripRedirect('offbeat-trips')}>
        <ImageContainer bg='offbeat-travel.png' >
        <TextContainer right={isPageWide?false:true} className='AnimateTop' >
                <Heading>Offbeat</Heading>
                <p>Planner</p>
            </TextContainer>
            {isPageWide&& <TextContainer className='StartNow'>Start now!</TextContainer> }
            <ImageLoader fit='cover' height='100%'  url='media/website/offbeat-travel.png'></ImageLoader> 

        </ImageContainer>
        </GridItem >
    </Container>

    {!props.nostart ? <Button onclick={props.onclick ? props.onclick : _handleTailoredClick}  fontWeight='600' boxShadow borderRadius="8px" bgColor='#F7E700' margin="1rem auto" width='20rem'  borderWidth="1px">
            {isPageWide? 'Create your free itinerary' :'Create your personalised Itinerary'}
            {/* {loading ? <Spinner size={16}></Spinner> : null} */}
        </Button> : null}
    </>
   
  )
}

export default PlanAsPerTheme