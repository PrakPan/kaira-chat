import React from "react";
import styled from "styled-components";
import LoadingLottie from "../components/ui/LoadingLottie";

const ExperienceIndexLoading = (props) => {
  const quotes = [
    "India is the wettest inhabited place on Earth?",
    "India has over 300,000 mosques and over 2 million Hindu temples",
    "Chenab Bridge in Jammu is the highest rail bridge in the world",
    "Rajasthan has a Temple of Rats",
    "You can drive on the world’s highest motorable road in Ladakh",
    "India is the home of a mysterious skeleton lake, the Roopkund Lake",
    "The popular game “Snakes and Ladders” originated in India",
    "India was the first country to mine diamonds",
    "The village of Shani Shingpur with no locks and doors may be the safest on Earth",
    "India has the highest population of vegetarians",
    "The world’s largest sundial is located in Jaipur, India",
    "During World War II, the Taj Mahal was disguised as a bamboo stockpile",
    "North Sentinel Island in India is one of the last “untouched” places on Earth",
    "The Kumbh Mela is visible from space",
    "The Amritsar Golden Temple serves free meals….for thousands",
    "India is Famous for its Iconic, Abandoned Step Wells",
    "The steel wires in the Bandra Worli Sealink could stretch around the world",
    "There’s a floating post office in Dal Lake in Srinagar",
  ];

  const Container = styled.div`
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1200;
    background-color: ${(props) => props.theme.colors.brandColor};
    color: white;
  `;

  const DidYouKnow = styled.p`
    font-weight: 700;
    font-size: 1.25rem;
    color: black;
    margin: 2rem 0 1rem 0;
  `;

  const Quote = styled.p`
    text-align: center;
  `;

  return (
    <Container className="center-div">
      <LoadingLottie height={"5rem"} width={"5rem"} margin="none" />
      <DidYouKnow className="">Did you know?</DidYouKnow>
      <Quote style={{ color: "black" }} className="font-nunito">
        <em>{quotes[Math.floor(Math.random() * 16)]}</em>
      </Quote>
    </Container>
  );
};

export default React.memo(ExperienceIndexLoading);
