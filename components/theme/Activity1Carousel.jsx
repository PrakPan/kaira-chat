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
      navButtonsTop="40%"
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
          <div className="relative h-[15rem] w-full overflow-hidden rounded-[10px]">
            <ImageLoader
              url={image}
              width={"100%"}
              height={"18rem"}
              borderRadius="10px"
            />
          </div>
        </div>
        <div className="">
          <h3 className="font-bold text-[16px]">{name}</h3>
          <p className="font-[350] mt-1 text-[16px]">{short_description}</p>
        </div>
      </div>
    </Container>
  );
};
