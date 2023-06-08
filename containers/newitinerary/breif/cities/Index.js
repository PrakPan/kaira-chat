<<<<<<< HEAD
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
=======
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import City from './City';
const Container = styled.div``;

const Cities = (props) => {
  useEffect(() => {}, []);
  const cityData = [
    {
      city: 'Jodhpur',
      duration: '3 Nights',
      image: 'we',
      short_description: 'Adasd',
    },
    {
      city: 'udaipur',
      duration: '3 Nights',
      image: 'we',
      short_description: 'Adasd',
    },
    {
      city: 'jaipur',
      duration: '3 Nights',
      image: 'we',
      short_description: 'Adasd',
    },
  ];
  return (
    <Container>
      <City cityData={cityData[0]}></City>
      <City cityData={cityData[0]}></City>
      <City cityData={cityData[0]}></City>
    </Container>
  );
};

export default Cities;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
