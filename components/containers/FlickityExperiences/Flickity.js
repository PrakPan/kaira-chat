import React from 'react';
import Flickity from 'react-flickity-component';

const FlickityCarousel = (props) => {

  const flickityOptions = {
    wrapAround: true,
    freeScroll: true,
    groupCells: 3,

};
let cards=[];
    props.cards.map( card => {
          cards.push(
            <div  style={{width: "33%" , margin: '0.5rem 2rem 0.5rem 0'}} ><div>{card}</div></div>
          )
      });
    
    
      return(
        <Flickity
          className={'carousel'}
          elementType={'div'}
          options={flickityOptions}
          reloadOnUpdate
          static
          
        >
        {cards}
        </Flickity>
        );
  
}

export default FlickityCarousel;