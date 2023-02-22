import styled from 'styled-components';
import { useState, useEffect } from 'react';
import City from './City';
  const Container = styled.div`

`;

const Cities = (props) => {
   
    useEffect(() => {
      
    },[]);
    console.log(props.city_slabs)
    return(
        <Container>
          {
            props.city_slabs ? props.city_slabs.length ? props.city_slabs.map(city => {
              if(city.duration)
              return (
              <City data={city}></City>
              )
            })
            : null
            : null
          }
             {/* <City city="Jaipur" duration="2 Nights"></City>
             <City city="Jaisalnmer" duration="4 Nights"></City>
             <City city="Jodhpur" duration="3 Nights"></City> */}

        </Container>
        
    );
 }

export default Cities;