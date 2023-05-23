import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import SwiperCarousel from "../SwiperCarousel";
import media from "../media";
import SkeletonCard from "../ui/SkeletonCard";
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1vh;
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
    <SkeletonCard lottieDimension={"20rem"} />
  </SkeletonCardContainer>
);
const Continentcarousel = () => {
  const [continents, setContinents] = useState([]);
  let isPageWide = media("(min-width: 768px)");

  const cardsArr = [];
  async function fetchData() {
    const res = await axios.get(
      "https://apis.tarzanway.com/page/list?page_type=Continents"
    );
    const data = [];
    for (let i = 0; i < res.data.length; i++) {
      const hot_destinations = await axios.get(
        `https://apis.tarzanway.com/poi/country/all?continent=${res.data[i].link}&hot_destinations=true`
      );
      data.push({ ...res.data[i], hot_destinations: hot_destinations.data });
      cardsArr.push(
        <GridContainer>
          <Card
            location={res.data[i].destination}
            heading={res.data[i].tagline}
            img={res.data[i].image}
            continent
          
            path={res.data[i].path}
          />
         
          <CardsContainer>
            {hot_destinations.data.map((e) => (
              <Card
                key={e.id}
                location={e.name}
                heading={e.tagline}
                img={e.image}
                path={e.path}
              />
            ))}
          </CardsContainer>
        </GridContainer>
      );
    }
    setContinents(cardsArr);
  }
  useEffect(() => {
    fetchData();
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
            <div>
              <SkeletonCard height={isPageWide ? "71vh" : "25vh"} />
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
