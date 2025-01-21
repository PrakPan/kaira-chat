import React from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import SwiperCarousel from "../../components/SwiperCarousel.js";
import media from "../../components/media";

const Container = styled.div`
  width: 100%;
  height: 20rem;
  @media screen and (min-width: 768px) {
    height: 20rem;
  }
  position: relative;
`;

export default function Activity1Carousel(props) {
  let isPageWide = media("(min-width: 768px)");

  return (
    <SwiperCarousel
      cards={props.activities.map((activity, index) => (
        <ActivityCard key={index} {...activity} />
      ))}
      slidesPerView={isPageWide ? 4 : 1}
      spaceBetween={20}
      navigationButtons={true}
      buttonSize={40}
      navButtonBackground="#01202b"
      navButtonColor="#fff"
      navButtonsTop="30%"
      pageDots={!isPageWide}
    />
  );
}

const ActivityCard = ({ image, name, short_description }) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      <div className="flex flex-col h-full gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="relative h-[15rem] w-full overflow-hidden">
            <ImageLoader
              url={image}
              width={"100%"}
              height={"15rem"}
              borderRadius="10px"
            />
          </div>
        </div>
        <div className="">
          <h3 className="font-bold text-xs">{name}</h3>
          <p className="text-gray-600 text-xs mt-1">{short_description}</p>
        </div>
      </div>
    </Container>
  );
};
