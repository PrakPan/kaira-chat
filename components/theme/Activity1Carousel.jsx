import React from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import SwiperCarousel from "../../components/SwiperCarousel.js";
import media from "../../components/media";

const Container = styled.div`
  width: 100%;
  // height: 24rem;
  @media screen and (min-width: 768px) {
    // height: 24rem;
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
    <Container className="">
      <div className="flex flex-col h-full gap-3 rounded-lg">
        <div className="relative  overflow-hidden rounded-lg">
          <ImageLoader
            url={image}
            width={isPageWide ? "282px" : "350px"}
            height={isPageWide ? "282px" : "350px"}
            borderRadius="10px"
          />
        </div>

        <div className="">
          <h3 className="text-[16px] leading-[28px] font-[700]">
            {name}
          </h3>
          <p className="text-[15px] leading-[22px] font-[400] line-clamp-3">
            {short_description}
          </p>
        </div>
      </div>
    </Container>
  );
};
