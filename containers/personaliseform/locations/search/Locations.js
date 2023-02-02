import React, { useState, useEffect , useRef}  from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../components/ImageLoader';
import FlickityCarousel from '../../../../components/FlickityCarousel';
import media from '../../../../components/media';
import Location from './Location';
const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-gap: 1rem;
margin: 1rem 0;
padding-bottom: 10vh;
@media screen and (min-width: 768px){
    padding-bottom: 0;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
`;

const ImageContainer = styled.div`
position: relative;
text-align: center;
color: white;
margin: auto;
border-radius: 50%;
width: 90%;
min-height: 16vw;

&:hover{
    cursor: pointer;
    background: #f7e700;
}
@media screen and (min-width: 768px){
    min-height: 11vw;

}
`;

const ImageText = styled.div`
position: absolute;
top: 50%;
left: 50%;
color: white;
font-weight: 400;
font-size: 0.75rem;
background: rgba(0,0,0,0.4);
width: 100%;
height: 100%;
border-radius: 50%;
transform: translate(-50%, -50%);
@media screen and (min-width: 768px){
    font-size: 1rem;
    
}
&:hover{
    cursor: pointer;
    background: rgba(97,91,0,0.4);
}
`;
const SearchResult = (props) => {
    const ref = useRef(null)


    const [width, setWidth] = useState(0)

 
    let locations = [];
 
    if(props.hotlocations)
    for(var i=0; i<props.hotlocations.length; i++){
        let id = props.hotlocations[i].id;
        let name=props.hotlocations[i].name;
        let parent = props.hotlocations[i].state.name;
        locations.push(
   
            <Location selectedCities={props.selectedCities}  _removeCityHandler={props._removeCityHandler} id={id} name={name} parent={parent} location={props.hotlocations[i]} _addCityHandler={props._addCityHandler}></Location>
        )
    }
    else
    for(var i=0; i<8; i++){
      
        locations.push(
   
            <Location selectedCities={props.selectedCities}  _removeCityHandler={props._removeCityHandler}  location={null}  _addCityHandler={props._addCityHandler}></Location>
        )
    }
     return(
        <Container>
           
       {locations}

        </Container>
    );
   
   
}

export default (SearchResult);