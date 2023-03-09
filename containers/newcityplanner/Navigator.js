import { useState } from "react"
import styled from "styled-components"
const Title = styled.p`
cursor : pointer;
color : #7A7A7A;
font-weight : 600;
font-size : 16px;
padding : 18px 28px;
border-top-left-radius : 15px;
border-top-right-radius : 15px;
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

`
const TitleContainer = styled.div`
display : flex;
justify-content : space-between;
overflow : scroll;
`
const Button = styled.button`
background : #F7E700;
border-radius : 8px;
border : 1px solid black;
font-weight : 600;
font-size : 14px;
height : 44px;
width : 210px;
margin-block : auto;
`


const Navigator = (props)=>{
const [selectedPoint,setSelectedPoint] = useState('Brief')

const changeData = (e)=>{
    setSelectedPoint(e)
}

const points = ['Brief','Itinerary','Things to do','How to reach','Food to eat','Survival Tips & Tricks','Folklore or Story']

    return (
    <Container>
        <TitleContainer>
        {points.map((e)=>(<Title style={selectedPoint==e ? selectedStyle : null}  onClick={()=>changeData(e)}>{e}</Title>))}
        </TitleContainer>
        <Button className="hidden-mobile">Get Customised Package</Button>
    </Container>
    )
}

export default Navigator