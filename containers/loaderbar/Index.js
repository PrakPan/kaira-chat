import styled from "styled-components";
import React, { useEffect, useState } from "react";
import content from "../../public/content/loaderbar";
import LottieAnimation from "./Lottie";
import ResponsiveProgressBar from "./linecirclecontainer";
import { useRouter } from "next/router";

const COLORS = {
  black: "#212529",
  gray: "#757D75",
  background: "#fff",
  white: "white",
};

const Container1 = styled.div`
  ${(props) =>
    !props.isEdit &&
    `
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      position: fixed;
      place-items: center;
      background-size: contain;
      background-color: ${COLORS.background};
  `}
`;

const Heading2 = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  font-weight: 400;

  display: block;
  @media screen and (min-width: 768px) {
    margin: 1.3rem 0 0 0;
    font-size: 1rem;

    top: 66vh;
  }
`;

const Index = (props) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  var IntervalTiming;
  let cards = [];
  if (router.query.t) IntervalTiming = (+router.query.t / 5) * 1000;

  useEffect(() => {
    for (var i = 0; i < content.length; i++) {
      if (content[i].heading) {
        cards.push(
          <Heading2 className="font-lexend">{content[i].heading}</Heading2>
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!IntervalTiming) setCurrentStep(5);
    else if (currentStep < 5) {
      setTimeout(() => {
        setCurrentStep((prevCount) => prevCount + 1);
      }, IntervalTiming);
    }
  }, [currentStep]);

  return (
    <Container1 className="center-div" isEdit={props?.isEdit}>
      <LottieAnimation></LottieAnimation>
      <ResponsiveProgressBar progress={currentStep}></ResponsiveProgressBar>

      <Heading2 className=" font-lexend font-medium text-lg">
        {" "}
        {content[currentStep - 1].heading}{" "}
      </Heading2>
    </Container1>
  );
};

export default Index;
