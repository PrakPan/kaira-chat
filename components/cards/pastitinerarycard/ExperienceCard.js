import React, { useState } from "react";
import styled from "styled-components";
import ImageGallery from "./slider/ImageSlider";
import Button from "../../ui/button/Index";
import { useRouter } from "next/router";
import urls from "../../../services/urls";
import * as ga from "../../../services/ga/Index";
import openTailoredModal from "../../../services/openTailoredModal";

const Container = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  @media screen and (min-width: 768px) {
    &:hover {
      cursor: pointer;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  text-align: center;
  color: white;
`;

const HeadingContainer = styled.div`
  min-height: 4rem;
  @media screen and (min-width: 768px) {
    min-height: 4rem;
  }
`;

const ContentContainer = styled.div`
  width: 100%;

  padding: 1rem 0.5rem;
  box-sizing: border-box;
  @media screen and (min-width: 768px) {
  }
`;

const TextContainer = styled.div`
  height: 4.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0rem 0 1rem 0;
`;

const Text = styled.p`
  font-weight: 300;
  line-height: 1.5rem;
`;

const Heading = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem 0 0 0;
  line-height: 1.25;

  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
    margin: 0.75rem 0;
    font-weight: 600;
    color: #212529;
  }
`;

const ButtonsContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  box-sizing: border-box;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ExperienceCard = (props) => {
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [loadingPlanning, setLoadingPlanning] = useState(false);
  const router = useRouter();

  let textstr = "";
  if (!isPageWide) {
    // change to less than 400
    textstr = props.text.substring(0, 80) + "...";
  } else if (!isPageWide) {
    // change to 400 to 480
    textstr = props.text.substring(0, 90) + "...";
  } else textstr = props.text.substring(0, 100) + "...";

  const redirectItinerary = () => {
    setLoadingItinerary(true);
    router.push(urls.itinerary.BASE + props.id);
  };

  const _handleItineraryClick = () => {
    setLoadingItinerary(true);

    setTimeout(redirectItinerary, 1000);

    ga.callback_event({
      action: "CC-I-" + props.experience,
      callback: redirectItinerary,
    });
  };

  return (
    <Container className="netflix-ite">
      <ImageContainer>
        <ImageGallery
          filter={props.filter}
          location={props.location}
          cost={props.cost}
          duration={props.duration}
          images={props.images}
          name={props.experience}
        ></ImageGallery>
      </ImageContainer>

      <ContentContainer className="text-center">
        <HeadingContainer>
          <Heading className="font-lexend">{props.experience}</Heading>
        </HeadingContainer>

        <TextContainer className="font-nunito">
          <Text>{textstr}</Text>
        </TextContainer>

        <ButtonsContainer>
          <Button
            loading={loadingItinerary}
            display="inline-block"
            width="100%"
            onclickparams={null}
            onclick={_handleItineraryClick}
            boxShadow
            hoverBgColor="black"
            bgColor="white"
            borderRadius="2rem"
            padding="0.25rem 1rem"
            borderStyle="none"
            hoverColor="white"
          >
            View Itinerary
          </Button>

          <Button
            display="inline-block"
            width="100%"
            onclickparams={null}
            onclick={() => openTailoredModal(router)}
            boxShadow
            hoverBgColor="black"
            bgColor="#f7e700"
            borderRadius="2rem"
            padding="0.25rem 1rem"
            borderStyle="none"
            hoverColor="white"
            loading={loadingPlanning}
          >
            Start Planning
          </Button>
        </ButtonsContainer>
      </ContentContainer>
    </Container>
  );
};

export default ExperienceCard;
