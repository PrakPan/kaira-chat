import React from 'react'
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
import Carousel from '../../../components/FlickityCarousel'
import PageDotsFlickity from '../../../components/PageDotsFlickity'
import { useEffect } from 'react';
const Container = styled.div`
    max-width: 100%;
    display: grid;
    padding: 0;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    @media screen and (min-width: 768px){
        grid-template-columns: ${props=>'repeat('+props.total+',1fr)'};
        grid-template-rows: auto;

    }
    @media (min-width: 768px) and (max-width: 1024px) {
        grid-template-columns: 33% 33% 33%;
    }
    `;
    const IconContainer = styled.div`
    width: 100%;
    `;
    const IconTagLine = styled.p`
        font-weight: 600;
        font-size: 16px;
        margin-block : 5px;
        `;
const MobileCardsContainer = styled.div`
display : grid;
grid-template-columns: 1fr 1fr ;
gap: 0.5rem;
`

const FoodToEat = (props) => {
  const cards = props.foods?.map((icon,index) => 
  <IconContainer key={index}>
     <ImageLoader borderRadius='12px' url={icon.image ? icon.image : 'media/food/dinner.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 900, height: 900}} ></ImageLoader>
     <IconTagLine className="font-lexend">{icon.name}</IconTagLine>
  </IconContainer>)
  const MobileCardsArr = []
  let count = 0
  for(let i = 4;i<cards.length;i=i+4){
        // let n = cards.length;
        const el = cards.slice(i-4,i)
    MobileCardsArr.push(<MobileCardsContainer>{el.map((e, i) => <div key={i}>{e}</div>)}</MobileCardsContainer>)
        count++
      }
      const el = cards.slice(count*4,cards.length)
      MobileCardsArr.push(
        <MobileCardsContainer>
          {el.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </MobileCardsContainer>
      );
  


  return (
    <>
      <div className="hidden-mobile">
        <Carousel
          initialIndex={0}
          hideSides
          numberOfCards={4}
          groupCells={4}
          cards={cards}
        />
      </div>
      <div className="hidden-desktop">
        <PageDotsFlickity padding={"1rem 0.2rem"} cards={MobileCardsArr} />
      </div>
    </>
  );
}

export default FoodToEat