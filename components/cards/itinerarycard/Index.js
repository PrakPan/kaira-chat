import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageGallery from "./slider/ImageSlider";
import { useRouter } from "next/router";

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

const ContentContainer = styled.div`
  width: 100%;

  padding: 1rem 0;
  box-sizing: border-box;
  @media screen and (min-width: 768px) {
  }
`;

const HeadingContainer = styled.div`
  height: 3rem;
  @media screen and (min-width: 768px) {
    height: 3rem;
  }
`;

const TextContainer = styled.div`
  text-overflow: ellipsis;
  margin: 1rem 0 1rem 0;
`;

const Text = styled.p`
  font-weight: 300;
  font-size: 0.75rem;
  height: 4rem;
  margin: 0 0.5rem;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0.5rem 0 0.5rem;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
    margin: 0.75rem 0.5rem;
    font-weight: 600;
    color: #212529;
  }
`;

const ExperienceCard = (props) => {
  const router = useRouter();
  const [itineraryText, setItineraryText] = useState("");

  const _handleRedirect = () => {
    router.push("/itinerary/" + props.id);
  };

  let textstr = "";
  let cta = "Check Out";

  useEffect(() => {
    if (props.status === "ITINERARY_UNDER_PREPARATION") {
      (textstr =
        "We're as excited as you are to plan your travel but we need a little more time to complete your itinerary."),
        (cta = "Preview");
      setItineraryText(
        "We're as excited as you are to plan your travel but we need a little more time to complete your itinerary."
      );
    } else if (props.status === "ITINERARY_PREPARED") {
      textstr =
        "Good things take time, not always. Here is your plan that has been completely personalized by our travel experts.";
      cta = "Check Out";
      setItineraryText(
        "Good things take time, not always. Here is your plan that has been completely personalized by our travel experts."
      );
    } else if (props.status === "ITINERARY_USER_ACTION_REQUIRED") {
      textstr =
        "Oops! Looks like there was a problem preparing your itinerary, please get in touch with your experience captain.";
      cta = "Enquire Now";
      setItineraryText(
        "Oops! Looks like there was a problem preparing your itinerary, please get in touch with your experience captain."
      );
    } else if (props.status === "ITINERARY_PAYMENT_COMPLETED") {
      textstr =
        "Pack your bags, it's time to travel and create everlasting memories.";
      cta = "View Now";
      setItineraryText(
        "Pack your bags, it's time to travel and create everlasting memories."
      );
    }
  }, [props.status]);

  return (
    <Container className="netflix-ite" onClick={_handleRedirect}>
      <ImageContainer>
        <ImageGallery
          budget={props.budget}
          filter={props.filter}
          locations={props.locations}
          duration={props.duration}
          image={props.image}
          name={props.name}
        ></ImageGallery>
      </ImageContainer>
      <ContentContainer className="text-center">
        <HeadingContainer>
          <Heading className="font-lexend">{props.name}</Heading>
        </HeadingContainer>

        <TextContainer className="font-nunito">
          <Text>{itineraryText}</Text>
        </TextContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 0.5rem",
          }}
        ></div>
      </ContentContainer>
    </Container>
  );
};

export default React.memo(ExperienceCard);
