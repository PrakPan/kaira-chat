import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../ui/button/Index";
import ChatWithKairaCta from "./../revamp/destination/ChatWithKairaCta";

const Container = styled.div`
  display: none;
  @media screen and (min-width: 768px) {
    display: initial;
    z-index: 998 !important;
    width: auto;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    ${(props) => props.newYear ? "bottom: 16px" : "bottom: 0"};
    margin-bottom: 1rem;
  }
`;

const GridContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  display: grid;
  width: max-content;
  margin: auto;
  grid-template-columns: auto max-content;
  border-radius: 2rem;
`;

const Serif = styled.span`
  font-family: "Instrument Serif", "Times New Roman", serif;
  font-style: italic;
`;

const Text = styled.p`
  font-family: "Inter", -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
    font-size: 1.25rem;
    display: inline;
    margin: 0 2.5vw;
  }
`;

const Banner = (props) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let scrollhandler = () => {
      let currentScroll = window.pageYOffset;
      if (currentScroll > window.innerHeight / 2) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };
    window.addEventListener("scroll", scrollhandler);
    return () => {
      window.removeEventListener("scroll", scrollhandler);
    };
  });

  const renderText = () => {
    const { text, destinationName } = props;
    if (!destinationName || typeof text !== "string") return text;
    const parts = text.split(destinationName);
    if (parts.length === 1) return text;
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {part}
        {i < parts.length - 1 && <Serif>{destinationName}</Serif>}
      </React.Fragment>
    ));
  };

  if (showBanner)
    return (
      <Container className="flex place-self-end" newYear={props.newYear}>
        <GridContainer>
          <div className="center-div">
            <Text className="">{renderText()}</Text>
          </div>
          {/* <Button
            display="inline-block"
            boxShadow
            onclick={props.onclick}
            // hoverColor=""
            // hoverBgColor="black"
            bgColor="#0f1a2e"
            borderStyle="none"
            padding="0.5rem 0.5rem"
            borderRadius="2rem"
            color="white"
            className="w-fit"
          >
            <div className="flex items-center gap-2 w-[4rem]">
              {props.cta ? props.cta : "Start Planning"}{" "}
              <svg
                viewBox="0 0 12 12"
                height="14"
                width="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 10L10 2M10 2H4M10 2V8"></path>
              </svg>
            </div>
          </Button> */}
           <div className="flex justify-center">
              <ChatWithKairaCta
                onClick={props.onclick}
                label="Plan with Kaira"
              />
            </div>
        </GridContainer>
      </Container>
    );
  else return null;
};

export default Banner;
