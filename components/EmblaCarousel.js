import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import Flickity from 'react-flickity-component';
import useEmblaCarousel from "embla-carousel-react";
import styled from 'styled-components'

const GridContainer = styled.div`
display : grid;
grid-template-columns : ${props=>`repeat(${props.columns},1fr)`} ;
gap : 1%;
`
const EmblaContainer = styled.div`
overflow : hidden;
  .embla {
    width : 100%;
    overflow: hidden;
  }
  .embla__container {
    display: flex;
    // grid-template-columns: ${(props) => `repeat(${props.columns},1fr)`};
    // gap: 1%;
  }
  .embla__slide {
    flex: 0 0 16.666%;
    // min-width: 100%;
  }
`;


const FlickityCarousel = (props) => {
     const [emblaRef] = useEmblaCarousel({ loop: false, startIndex: 0 });
  const containerRef = useRef()
  const [containerWidth , setContainerWidth] = useState(props.numberOfCards ? `${100/+props.numberOfCards -1}%` : '80%')
  useEffect(() => {
    function findWidth() {
      if (props.numberOfCards && containerRef.current) {
        setContainerWidth(
          `${containerRef.current.offsetWidth / props.numberOfCards - 10}px`
        );
      }
    }

    window.addEventListener("resize", findWidth);
    setTimeout(() => {
      findWidth();
    }, [200]);
    return () => window.removeEventListener("resize", findWidth);
     
  }, []);

  if(props.cards.length<=props.numberOfCards) 
  return (<GridContainer columns={props.numberOfCards}>
  {props.cards}
  </GridContainer>
  );

    const flickityOptions = {
        initialIndex: props.initialIndex === 0  ? 0 : props.initialIndex  ?  props.initialIndex : 1,
        prevNextButtons: true,
        wrapAround: false,
        pageDots: false,
        contain : props.hideSides === true ? true : false,
      groupCells :  props.groupCells ? props.groupCells : false,

    };
    const flickityOptionsLocations = {
      initialIndex: 2,
      prevNextButtons: false,
      wrapAround: false,
      pageDots: false,
    }
    const flickityOptionsIpad = {
      initialIndex: 1,
      prevNextButtons: false,
      wrapAround: false,
      pageDots: false,
    } 
     let cards=[];
    if(props.twocards){
    props.cards.map( (card,index) => {
      cards.push(
        <div key={index}  style={{width: "50%", margin: "0px 0.1rem"}}><div>{card}</div></div>
      )
  });
  return (
    <Flickity
      ref={containerRef}
      className={"carousel"}
      elementType={"div"}
      options={{ ...flickityOptions, initialIndex: 1 }}
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
            <div key={index}  style={{width: "95%" , margin: props.experience ? "0px 1rem" : '0px 0.1rem'}} ><div>{card}</div></div>
          )
      });
      else if(props.locations)
      props.cards.map( (card,index)=> {
        cards.push(
          <div
            key={index}
          >
            <div>{card}</div>
          </div>
        );
    });
    else 
    props.cards.map( (card,index) => {
      cards.push(
        <div key={index}><div>{card}</div></div>
      )
    });
        return (
          <EmblaContainer className="embla" ref={emblaRef} columns={6}>
                <div className="embla__container">{cards.map((e)=><div className="embla__slide">{e}</div>)}</div>
          </EmblaContainer>
        );
      return (
        <div ref={containerRef} style={{position : 'relative'
        }}>
          <Flickity
            className={"carousel"}
            elementType={"div"}
            options={
              props.locations ? flickityOptionsLocations : flickityOptions
            }
            reloadOnUpdate
            static
          >
            {cards}
          </Flickity>
        </div>
      );
  } 
}

export default FlickityCarousel;