import React, { useState } from "react";
import styled from "styled-components";
import media from "../../components/media";
import Button from "../ui/button/Index";
import { useRouter } from "next/router";
import ImageLoader from "../ImageLoader";
import openTailoredModal from "../../services/openTailoredModal";
import SwiperCarousel from "../SwiperCarousel";
import { logEvent } from "../../services/ga/Index";

const Container = styled.div`
  margin-top: -50px;
  @media screen and (min-width: 768px) {
    width: 100%;
    margin: auto;
    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.length} , 1fr)`};
    gap: 4rem;
  }
`;

const TextContainer = styled.div`
  font-size: 16px;
  text-align: center;
`;

const ImageContainer = styled.div`
  padding: auto 1rem;
  @media screen and (min-width: 768px) {
    padding: 0;
    height: max-content;
  }
`;

const GridContainer = styled.div`
  margin-block: 15px;
  @media screen and (min-width: 768px) {
    display: block;
  }
`;

const HowItWorksSlideshow = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  let isTablet = media("(min-width: 500px)");

  const handlePlanButtonClick = () => {
    openTailoredModal(router, props.page_id, props.destination);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "Home Page",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free",
        event_action: "How it works?",
      },
    });
  };

  const slidesdesktop = [
    <GridContainer key={0} style={{}}>
      <ImageContainer>
        <ImageLoader
          url={props.images[0]}
          width="80%"
          height="auto"
          dimensions={
            props.dimensions ? props.dimensions : { width: 500, height: 500 }
          }
          dimensionsMobile={props.dimensionsMobile || null}
          widthmobile={
            props.vertical ? "40%" : props.corporates ? "100%" : "60%"
          }
        />
      </ImageContainer>
      <TextContainer>
        {props.headings[0]}
        {props.content[0]}
      </TextContainer>
    </GridContainer>,
    <GridContainer key={1} style={{}}>
      <ImageContainer>
        <ImageLoader
          url={props.images[1]}
          resizeMode="contain"
          width="80%"
          height="auto"
          dimensions={
            props.dimensions ? props.dimensions : { width: 500, height: 500 }
          }
          dimensionsMobile={props.dimensionsMobile || null}
          widthmobile={
            props.vertical ? "40%" : props.corporates ? "100%" : "60%"
          }
        />
      </ImageContainer>
      <TextContainer>
        {props.headings[1]}
        {props.content[1]}
      </TextContainer>
    </GridContainer>,

    <GridContainer key={2} style={{}}>
      <ImageContainer>
        <ImageLoader
          url={props.images[2]}
          width="80%"
          resizeMode="contain"
          height="auto"
          dimensions={
            props.dimensions ? props.dimensions : { width: 500, height: 500 }
          }
          dimensionsMobile={props.dimensionsMobile || null}
          widthmobile={
            props.vertical ? "40%" : props.corporates ? "100%" : "60%"
          }
        />
      </ImageContainer>
      <TextContainer>
        {props.headings[2]}
        {props.content[2]}
      </TextContainer>
    </GridContainer>,
  ];

  if (props.images[3])
    slidesdesktop.push(
      <GridContainer key={3} style={{}}>
        <ImageContainer>
          <ImageLoader
            url={props.images[3]}
            width="80%"
            resizeMode="contain"
            height="auto"
            dimensions={
              props.dimensions ? props.dimensions : { width: 500, height: 500 }
            }
            dimensionsMobile={props.dimensionsMobile || null}
            widthmobile={
              props.vertical ? "40%" : props.corporates ? "100%" : "60%"
            }
            noLazy
          />
        </ImageContainer>
        <TextContainer>
          {props.headings[3]}
          {props.content[3]}
        </TextContainer>
      </GridContainer>
    );

  return (
    <div>
      {isPageWide ? (
        <>
          <Container length={slidesdesktop.length}>{slidesdesktop}</Container>
        </>
      ) : (
        <div style={{ padding: "0rem 1rem" }}>
          <SwiperCarousel
            navButtonBackground={"white"}
            navButtonColor={"black"}
            slidesPerView={isTablet ? 2 : 1}
            cards={slidesdesktop}
            // pageDots
            navigationButtons
          ></SwiperCarousel>
        </div>
      )}
      {!props.nostart ? (
        <Button
          onclick={handlePlanButtonClick}
          fontWeight="500"
          boxShadow
          borderRadius="8px"
          bgColor="#F7E700"
          margin="1rem auto"
          width="20rem"
          padding="0.5rem 2rem"
          borderWidth="1px"
        >
          {"Plan Itinerary For Free"}
        </Button>
      ) : null}
    </div>
  );
};

export default React.memo(HowItWorksSlideshow);
