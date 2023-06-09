import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import Search from './search/Index';
 import media from '../../../components/media';
const Container = styled.div`
    width: 90%;
    margin: auto;

    @media screen and (min-width: 768px){
        width:70%;
        margin: 0  auto 15vh auto;
    }
`;
const Subheading = styled.p`
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
`;
const Locations = (props) => {
    let isPageWide = media('(min-width: 768px)')

        const _setOptionsHandler = (res) => {
        
        let optionsarr = [];
        for(var i=0; i<res.data.length; i++){
            optionsarr.push({
                text: res.data[i]["_source"].name,
                image: res.data[i]["_source"].image,
                state: res.data[i]["_source"].parent,
                city_id: res.data[i]["_source"].resource_id
            })
            setOptions(optionsarr);
        }
    
      
    }
    return(
        <Container>
        <Search selectedCities={props.selectedCities} questionIndex={props.questionIndex} _removeCityHandler={props._removeCityHandler} goToStart={props.goToStart} _addCityHandler={props._addCityHandler}_setOptionsHandler={(res) => _setOptionsHandler(res)}  setSelectedCities={props.setSelectedCities}></Search>
        </Container>
    )
}

export default (Locations);