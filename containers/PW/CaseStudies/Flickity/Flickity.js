import React from 'react';
import Flickity from 'react-flickity-component';

const FlickityCarousel = (props) => {

  const flickityOptions = {
    wrapAround: true,
    freeScroll: true,
    groupCells: 2,
    initialIndex: 0,
    prevNextButtons: false

};
let cards=[];
    props.cards.map( ( card,index) => {
          cards.push(
            <div key={index} style={{width: "40%" , marginRight: '1rem'}} ><div>{card}</div></div>
          )
      });
    
    
      return(
        <Flickity
          // className={'carousel'}
          elementType={'div'}
          options={flickityOptions}
          reloadOnUpdate
          static
          prevNextButtons={false}

        >
        {cards}
        </Flickity>
        );
  
}

export default FlickityCarousel;