import React from 'react';
import Flickity from 'react-flickity-component';

const FlickityCarousel = (props) => {


    const flickityOptions = {
        // initialIndex: props.initialIndex === 0  ? 0 : props.initialIndex  ?  props.initialIndex : 1,
        initialIndex: 0,
        prevNextButtons: false,
        wrapAround: false,

    };
     let cards=[];
    props.cards.map( (card,index) => {
      cards.push(
        <div key={index}  style={{width: '100%', padding: '1rem'}} ><div>{card}</div></div>
      )
  });
      return(
        <Flickity
          className={'carousel'}
          elementType={'div'}
          options={ flickityOptions }
          reloadOnUpdate
          static

        >
        {cards}
        </Flickity>
        );
  } 

export default FlickityCarousel;