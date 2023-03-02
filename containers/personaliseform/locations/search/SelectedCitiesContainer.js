import React, { useState }  from 'react';
import styled from 'styled-components';

import SelectedCity from './SelectedCity';
const Container = styled.div`
margin: 0 auto;
display: flex;
flex-wrap: wrap;
width: max-content;
max-width: 100%;
flex-driection: column;
align-items: center;
justify-content: center;
gap: 0.5rem;
@media screen and (min-width: 768px){
    margin: 1rem auto 0 auto;

}

`;

const SelectedCitiesContainer = (props) => {
    let selectedcitiesarr = [];
    // let uniquecities = [];
    // for(const city in props.selectedCities){
    //     var present = false;
    //     for(var i=0 ; i<props.selectedCities.length; i++){
    //         if(city[city_id] === uniquecities[i][city_id]) //present
    //         present = true;
    //         else uniquecities.push(city)
    //     }
    //     if(!present)  selectedcitiesarr.push(
    //         <SelectedCity _removeCityHandler={props._removeCityHandler} key={city} name={props.selectedCities[city].name} parent={props.selectedCities[city].parent} city_id={props.selectedCities[city].city_id}></SelectedCity>

    //     )
    // }
    for (const city in props.selectedCities) {
        selectedcitiesarr.push(
            <SelectedCity questionIndex={props.questionIndex} _removeCityHandler={props._removeCityHandler} key={city} name={props.selectedCities[city].name} parent={props.selectedCities[city].parent} city_id={props.selectedCities[city].city_id}></SelectedCity>

        )
      }
     return(
        <Container className='border-thi'>
                    <div className=" center-div font-opensans" style={{opacity: '1', marginRight: '0rem', letterSpacing: '2px', fontWeight: '300'}}>YOUR TRAVEL PLAN FOR</div>
           {selectedcitiesarr.length ? selectedcitiesarr : 
                       <SelectedCity questionIndex={props.questionIndex} _removeCityHandler={props._removeCityHandler}  name={null} parent={null} city_id={null}></SelectedCity>
           }
        </Container>
    );
   
}

export default (SelectedCitiesContainer);