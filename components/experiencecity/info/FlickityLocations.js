import React from 'react';
import Flickity from 'react-flickity-component';

const FlickityCarousel = (props) => {

  const flickityOptions = {

    wrapAround: true,
    freeScroll: true,
    groupCells: 4,


};
let cards=[];
    props.cards.map( (card,i) => {
          cards.push(
            <div key={i} style={{width: "25%" , marginRight: '1rem'}} ><div>{card}</div></div>
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