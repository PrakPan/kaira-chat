import React, { useEffect } from "react";
import styled from "styled-components";
import AsSeenIn from "./AsSeenIn";
import Reviews from "./Reviews";
import StoriesMap from "./StoriesMap";
import TravellerCounter from "./TravellerCounter";
import WhyTarzan from "./whyttw/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import usePageLoaded from "../../components/custom hooks/usePageLoaded";
const HeadingContainer = styled.div`
  border-style: solid none none none;
  border-color: #f7e700;
  border-width: 3px;
  width: 30%;
  margin: auto;
  @media screen and (min-width: 768px) {
    border-width: 2px;
  }
`;
const HeadingNew = styled.p`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: ${(props) => (props.margin ? props.margin : "0 0 1rem 0")};
  @media screen and (min-width: 768px) {
    font-size: 3rem;
    margin: ${(props) => (props.margin ? props.margin : "0")};
  }
`;
const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;
const Testimonial = (props) => {
  const isPageLoaded = usePageLoaded();

  useEffect(() => {
    if (isPageLoaded) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div>
      <StoriesMap></StoriesMap>
      <TravellerCounter></TravellerCounter>
      <Reviews />
      <WhyTarzan />
      <SetWidthContainer>
        <div style={{ margin: "3rem 0" }}>
          <HeadingNew className="font-lexend">What they say?</HeadingNew>
          <HeadingContainer></HeadingContainer>
        </div>
        <AsSeenIn />
        <ChatWithUs link="/contact" />
      </SetWidthContainer>
    </div>
  );
};

export default Testimonial;
