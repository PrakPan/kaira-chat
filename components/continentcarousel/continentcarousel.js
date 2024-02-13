import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import SwiperCarousel from "../SwiperCarousel";
import media from "../media";
import SkeletonCard from "../ui/SkeletonCard";
import aixiospagelistinsance from "../../services/pages/list";
import aixioscountryinsance from "../../services/pages/country";
const GridContainer = styled.div`
  display: grid;
  gap: 0.5rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 1fr;
    gap: 1rem;
  }
`;
const CardsContainer = styled.div`
  display: grid;

  grid-template-areas: ${(props) =>
    props.length == 1
      ? "a"
      : props.length == 2
      ? "'a' 'b'"
      : props.length == 3
      ? "'a b' 'c c'"
      : props.length == 4
      ? "'a b' 'c d'"
      : props.length == 5
      ? "'a a b b c c' 'd d d e e e'"
      : "'a b c' 'd e f'"};
  gap: 1vh;
  grid-template-columns: ${(props) =>
    props.length < 3 ? "1fr" : props.length < 5 ? "1fr 1fr" : props.length === 5 ? "" : '1fr 1fr 1fr'};
`;
const SkeletonCardContainer = styled.div`
  overflow: hidden;
  border-radius: 8px;
  height: 15vh;
  @media screen and (min-width: 768px) {
    height: 35vh;
  }
`;
const Skeleton = (
  <SkeletonCardContainer>
    <SkeletonCard lottieDimension={"35vh"} />
  </SkeletonCardContainer>
);
const cardsClasses = ['a','b','c','d','e','f']
const Continentcarousel = (props) => {
  const [continents, setContinents] = useState([]);
  let isPageWide = media("(min-width: 768px)");

  // const cardsArr = [];
  // async function fetchData() {
  //   const res = await aixiospagelistinsance('?page_type=Continent');
  //   const data = [];
  //   for (let i = 0; i < res.data.length; i++) {
  //     const hot_destinations = await aixioscountryinsance(`/all?continent=${res.data[i].destination}&hot_destinations=true`);
  //     const hot_data = hot_destinations.data.filter((e,i)=>{if(i<6) return e} )
  //     data.push({ ...res.data[i], hot_destinations: hot_data });
  //     cardsArr.push(
  //       <GridContainer>
  //         <Card
  //           location={res.data[i].destination}
  //           heading={res.data[i].tagline}
  //           img={res.data[i].image}
  //           continent
  //           path={res.data[i].path}
  //         />

  //         <CardsContainer length={hot_data.length}>
  //           {hot_data.map((e, i) => (
  //             <div className={cardsClasses[i]} style={{gridArea : cardsClasses[i]}}>
  //               <Card
  //                 key={e.id}
  //                 location={e.name}
  //                 heading={e.tagline}
  //                 img={e.image}
  //                 path={e.path}
  //                 hd={hot_data.length<4}
  //               />
  //             </div>
  //           ))}
  //         </CardsContainer>
  //       </GridContainer>
  //     );
  //   }
  //   setContinents(cardsArr);
  // }
       

  useEffect(() => {
      const cardsArr = [];
    for (let i = 0; i < props.data.length; i++) {
           
    let hd = props.data[i].hot_destinations.length
      cardsArr.push(
        <GridContainer>
          <Card
            location={props.data[i].destination}
            heading={props.data[i].tagline}
            img={props.data[i].image}
            continent
            path={props.data[i].path}
          />

          <CardsContainer length={props.data[i].hot_destinations.length}>
            {props.data[i].hot_destinations.map((e, i) => (
              <div
                className={cardsClasses[i]}
                style={{ gridArea: cardsClasses[i] }}
                key={e.id}
              >
                <Card
                  key={e.id}
                  location={e.name}
                  heading={e.tagline}
                  img={e.image}
                  path={e.path}
                  hd={hd < 4}
                />
              </div>
            ))}
          </CardsContainer>
        </GridContainer>
      );
    }
    setContinents(cardsArr);
  }, []);

  return (
    <>
      {continents.length ? (
        <SwiperCarousel
          slidesPerView={1}
          initialIndex={0}
          pageDots={!isPageWide}
          navigationButtons={isPageWide}
          cards={continents}
        ></SwiperCarousel>
      ) : (
        <>
          <GridContainer style={{ marginInline: "0.5rem" }}>
            <div style={{ height : isPageWide ? '71vh' : '25vh' ,borderRadius : '7px', overflow : 'hidden' }}>
              <SkeletonCard
                lottieDimension={'75vw'}
              />
            </div>
            <CardsContainer>
              {[Skeleton, Skeleton, Skeleton, Skeleton, Skeleton, Skeleton]}
            </CardsContainer>
          </GridContainer>
        </>
      )}
    </>
  );
};

export default Continentcarousel;
