import {FaMapMarkerAlt}from 'react-icons/fa'
import styled from 'styled-components'

const Container = styled.div`
display : flex;
gap : 12px;
align-items : center;
margin-bottom : 10px;
border-radius : 50px;
&:hover{
    background : #F0F0F0;
}

`
const MarkerContainer= styled.div`
background : #dfdfdf;
border-radius : 100%;
padding : 10px;
padding-top : 5px;
`
const Text = styled.div`
font-weight : 600;
// margin-block : 5px;
`
const NewLocation  = (props)=>{
    return (
        <Container className='font-lexend' onClick={()=>{props.setDestination(props.text) 
         props.setShowCities(false)
         props.onclick(props.onclickparam)
        }}
         >
        <MarkerContainer>
        <FaMapMarkerAlt />
        </MarkerContainer>
        <Text>{props.text}</Text>
        </Container>
    )
}

export default NewLocation