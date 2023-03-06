import React from 'react';
import Flickity from 'react-flickity-component';

const FlickityCarousel = (props) => {


    const flickityOptions = {
        initialIndex: props.initialIndex === 0  ? 0 : props.initialIndex  ?  props.initialIndex : 1,
        prevNextButtons: false,
        wrapAround: false,
        pageDots: true,

    };
    const flickityOptionsLocations = {
      initialIndex: 2,
      prevNextButtons: false,
      wrapAround: false,
      pageDots: true,

    }
     let cards=[];
    if(props.twocards){
    props.cards.map( (card,index) => {
      cards.push(
        <div key={index}  style={{width: "50%", margin: "2px 0.5rem"}}><div>{card}</div></div>
      )
  });
  return(
    <Flickity
      className={'carousel'}
      elementType={'div'}
      options={{...flickityOptions, initialIndex: 1}}
      reloadOnUpdate
      static

    >
    {cards}
    </Flickity>
    );
  }
  else{
    if(props.experience)
    props.cards.map( (card,index) => {
          cards.push(
            <div key={index}  style={{width: "75%" , margin: props.experience ? "2px 1rem" : '2px 0.5rem'}} ><div>{card}</div></div>
          )
      });
      else if(props.locations)
      props.cards.map( (card,index)=> {
        cards.push(
          <div key={index}  style={{width:  '28%', margin: props.experience ? "2px 1rem" : '2px 2px'}} ><div>{card}</div></div>
        )
    });
    else 
    props.cards.map( (card,index) => {
      cards.push(
        <div key={index}  style={{width: '100%', padding: '1rem'}} ><div>{card}</div></div>
      )
  });
      return(
        <Flickity
          className={'carousel'}
          elementType={'div'}
          options={props.locations ? flickityOptionsLocations : flickityOptions }
          reloadOnUpdate
          static

        >
        {cards}
        </Flickity>
        );
  } 
}

export default FlickityCarousel;