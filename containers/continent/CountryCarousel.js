import React, { useEffect, useState } from "react";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import media from "../../components/media";
import axioscountrydetailsinstance from "../../services/pages/country";
import styled from "styled-components";
import SkeletonCard from "../../components/ui/SkeletonCard";
import SwiperCarousel from "../../components/SwiperCarousel";

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 1.5rem 0.5rem;
  text-align: center;

  @media screen and (min-width: 768px) {
    text-align: left;
    margin: 3.5rem 0rem;
  }
`;

const SkeletonContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  height: 60vh;
  @media screen and (min-width: 768px) {
    margin: 0;
    max-width: 100%;
    height: 50vh;
  }
`;

const CountryCarousel = (props) => {
  const [data, setData] = useState([]);
  let isPageWide = media("(min-width: 768px)");

  const SkeletonCardEl = (
    <SkeletonContainer>
      <SkeletonCard lottieDimension={"100vw"} borderRadius={"0px"} />
    </SkeletonContainer>
  );

  const skeleton = [
    SkeletonCardEl,
    SkeletonCardEl,
    SkeletonCardEl,
    SkeletonCardEl,
    SkeletonCardEl,
    SkeletonCardEl,
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axioscountrydetailsinstance(
        "/all?continent=" + props.slug
      );
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <>
        <Heading>Trending destinations across {props.destination}</Heading>
        {data ? (
          <SwiperLocations
            locations={data}
            destination={props.destination}
            country
          ></SwiperLocations>
        ) : (
          <SwiperCarousel
            slidesPerView={isPageWide ? 5 : 1.3}
            initialSlide={isPageWide ? "0" : "1"}
            centeredSlides={!isPageWide}
            cards={skeleton}
          />
        )}
      </>
    </div>
  );
};

export default CountryCarousel;
