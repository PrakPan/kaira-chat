import React, { useState } from 'react'
import styled from 'styled-components'
import media from '../../components/media'
import Button from '../../components/ui/button/Index'
const Container = styled.div`
height : 300px;
  display : grid;
  gap : 0.5rem;
  grid-template-areas: 
  'a a a b b b b b'
  'a a a b b b b b'
  'a a a b b b b b'
  'd d e e e e e e'
  'c c c c c c c c'
  'c c c c c c c c'
  'c c c c c c c c'
  'c c c c c c c c';

  padding : 10px;

 @media screen and (min-width: 768px){
    height : 550px;
    gap : 0.5rem;
    grid-template-areas: 
    'a a a a b b b b'
    'a a a a b b b b'
    'a a a a b b b b'
    'a a a a b b b b'
    'a a a a e e e e'
    'c c c d e e e e'
    'c c c d e e e e';
}

& >.d{
    border : 1px solid black;
    background : white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size : 14px;
    padding-left : 5px;
    margin-bottom : 0px;
 @media screen and (min-width: 768px){
    font-size : 20px;
    text-align : center;
    align-items : center
}
}

`

const TextContainer = styled.div`
position : absolute;
top : 9px;
left : 9px;
color : white;
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
background :  url('https://d31aoa0ehgvjdi.cloudfront.net/media/website/${props=>props.bg}');
position : relative;
background-repeat : round;


`

const PlanAsPerTheme = (props) => {
    let isPageWide = media('(min-width: 768px)')


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

  return (
    <>
     <Container>
        <GridItem className='a' bg='road-trip.png' >
            <TextContainer>
                <Heading>Road Trip</Heading>
                <p>Planner</p>
            </TextContainer>
        </GridItem >
        <GridItem className='b' bg='volunteer-travel.png'>
        <TextContainer>
                <Heading>Volunteer Travel</Heading>
                <p>Planner</p>
            </TextContainer>
        </GridItem >
        <GridItem className='c' bg='worcation.png'>
        <TextContainer>
                <Heading>Workcation</Heading>
                <p>Planner</p>
            </TextContainer>
        </GridItem >
        <GridItem className='d' >
        <h2 style={isPageWide?{fontSize : '50px', fontWeight : 700}:{fontSize : '18px', fontWeight : 700}}>3490</h2>
        <p style={isPageWide?{width : '40%'}:{marginTop : '-10px'}}>Trips Planned so far.</p>
        </GridItem >
        <GridItem className='e' bg='offbeat-travel.png'>

        <TextContainer>
                <Heading>Offbeat</Heading>
                <p>Planner</p>
            </TextContainer>
        
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