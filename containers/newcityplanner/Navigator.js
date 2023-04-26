import { useState } from "react"
import styled from "styled-components"
import Button from '../../components/ui/button/Index'
const Title = styled.p`
cursor : pointer;
color : #7A7A7A;
font-weight : 600;
font-size : 16px;
padding : 18px 28px;
border-top-left-radius : 15px;
border-top-right-radius : 15px;
margin-bottom : 0rem;
`

const selectedStyle = {
    background : '#262626',
    color : '#F7E700',
    borderBottom : '3px solid #F7E700'
}
const Container = styled.div`
margin-top : 50px;
display : flex;
justify-content : space-between;

@media screen and (min-width: 768px){
    position : sticky;
    z-index : 2;
    top : 6rem;
    background : white;    
}
`
const TitleContainer = styled.div`
display : flex;
justify-content : space-between;
overflow: auto;
  white-space: nowrap;
  width : 85%;
`
const Navigator = (props)=>{
const [selectedPoint,setSelectedPoint] = useState('Brief')

const changeData = (e)=>{
    setSelectedPoint(e)
    props.handleClick(e)
}

const points = ['Brief','Itinerary','Things to do','How to reach','Food to eat','Survival Tips & Tricks','Folklore or Story']

    return (
    <Container>
        <TitleContainer>
        {points.map((e)=>(<Title style={selectedPoint==e ? selectedStyle : null}  onClick={()=>changeData(e)}>{e}</Title>))}
        </TitleContainer>
        <div className="hidden-mobile">
        <Button onclick={()=>console.log('clicked')}
        fontWeight="500" hoverBgColor="white" fontSize='14px' hoverColor="black" bgColor="#F7e700" borderRadius="8px" borderWidth='1px'  borderColor='black' width = '210px' height='44px' padding='10px 0px' margin='10px 0px'
        >Get Customised Package</Button>
        </div>
        
    </Container>
    )
}

export default Navigator
