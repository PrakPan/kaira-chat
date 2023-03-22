import React from 'react';
import styled from 'styled-components';
import Day_I_Container from './Day_I_Container';
import HorizontalBar from './Menubar';
const NewItenaryDBD = (props) => {
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
  `;
  const CitiesContainer = styled.div`
    width: calc(100vw-32px);
    overflow: hidden;
    display: grid;
    grid-template-columns: max-content max-content max-content;
    grid-gap: 0.75rem;
    height: max-content;
    position: sticky;
    top: 31vw;
    z-index: 10;
    background-color: white;
  `;
  const City = styled.div`
    border-radius: 8px;
    padding: 0.5rem;
  `;
  console.log('itenary...' + JSON.stringify(props.itinerary));
  const dates = props.itinerary.day_slabs.map((element, index) => (
    <div>{element.slab}</div>
  ));
  return (
    <Wrapper>
      <HorizontalBar
        width={'100%'}
        height={'40px'}
        content={dates}
      ></HorizontalBar>
      <CitiesContainer>
        <City
          className="border-thin"
          style={{ backgroundColor: 'black', color: 'white' }}
        >
          Jaipur (2N)
        </City>
        <City className="border-thin">Jodhpur (2N)</City>
        <City className="border-thin">Jaisalmer (2N)</City>
      </CitiesContainer>
      <div className="itenaryContainer">
        {props.itinerary.day_slabs.map((element, index) => (
          <Day_I_Container
            Days={element}
            key={element.slab_id}
          ></Day_I_Container>
        ))}
      </div>
    </Wrapper>
  );
};

export default NewItenaryDBD;
