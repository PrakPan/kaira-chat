import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import media from '../../media';
import { useRouter } from 'next/router';
import Button from '../../ui/button/Index';
import DesktopSkeleton, { MobileSkeleton } from './LocationSkeleton';
import * as ga from '../../../services/ga/Index';
import openTailoredModal from '../../../services/openTailoredModal';
import SwiperCarousel from '../../SwiperCarousel';
/* Used to display grid (desktop) / carousel of location images 
  inputs:locations (array of objects), viewall (guide page)
*/

const MobileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const LocationsBlog = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const router = useRouter();
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (props.locations) {
      let cardsArr = [];
      let MobileCardsArr = [];
      let count = 0;
      for (let i = 0; i < props.locations.length; i++) {
        if (i % 4 == 0 && i != 0) {
          let n = cardsArr.length;
          const el = cardsArr.slice(n - 4, n);
          MobileCardsArr.push(
            <MobileCardsContainer>
              {el.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </MobileCardsContainer>
          );
          count++;
        }
        cardsArr.push(
          <Card
            key={props.locations[i].id}
            path={props.locations[i].path}
            location={props.locations[i].destination || props.locations[i].name}
            heading={props.locations[i].tagline}
            img={props.locations[i].image}
            slug={props.locations[i].link}
            link={props.locations[i].link}
            country={props.country}
          ></Card>
        );
      }
      if (count % 4 != 0 || count == 0) {
        const el = cardsArr.slice(count * 4, cardsArr.length);
        MobileCardsArr.push(
          <MobileCardsContainer>
            {el.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </MobileCardsContainer>
        );
      }
      setCards(cardsArr);
      setMobileCardsToShowJSX(MobileCardsArr);
    }
  }, []);

  if (isPageWide)
    return (
      <div>
        {cards.length ? (
          <SwiperCarousel
            navigationButtons={true}
            slidesPerView={6}
            cards={cards}
          ></SwiperCarousel>
        ) : null}
      </div>
    );
  else
    return (
      <div>
        <div style={{ padding: '1rem 0' }}>
          {MobilecardsToShowJSX.length ? (
            <SwiperCarousel
              slidesPerView={1}
              cards={MobilecardsToShowJSX}
              pageDots
            ></SwiperCarousel>
          ) : (
            <MobileSkeleton />
          )}
        </div>
      </div>
    );
};

export default LocationsBlog;
