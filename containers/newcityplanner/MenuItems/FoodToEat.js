import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
import SwiperCarousel from '../../../components/SwiperCarousel';

const IconContainer = styled.div`
  width: 100%;
`;
const IconTagLine = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin-block: 5px;
`;
const MobileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const FoodToEat = (props) => {
  const cards = props.foods?.map((icon, index) => (
    <IconContainer key={index}>
      <ImageLoader
        borderRadius="12px"
        url={icon.image ? icon.image : 'media/food/dinner.png'}
        dimensions={{ width: 900, height: 900 }}
        dimensionsMobile={{ width: 900, height: 900 }}
      ></ImageLoader>
      <IconTagLine className="font-lexend">{icon.name}</IconTagLine>
    </IconContainer>
  ));
  const MobileCardsArr = [];
  let count = 0;
  for (let i = 4; i < cards.length; i = i + 4) {
    const el = cards.slice(i - 4, i);
    MobileCardsArr.push(
      <MobileCardsContainer>
        {el.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </MobileCardsContainer>
    );
    count++;
  }
  const el = cards.slice(count * 4, cards.length);
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
        <SwiperCarousel
          navigationButtons={true}
          slidesPerView={4}
          cards={cards}
        />
      </div>
      <div className="hidden-desktop">
        <SwiperCarousel
          slidesPerView={1}
          pageDots
          noPadding
          cards={MobileCardsArr}
        />
      </div>
    </>
  );
};

export default FoodToEat;
