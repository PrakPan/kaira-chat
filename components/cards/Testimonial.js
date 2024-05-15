import React, { useState } from "react";
import styled from "styled-components";
import Button from "../ui/button/Index";
import ImageLoader from "../ImageLoader";
import { ImQuotesLeft } from "react-icons/im";
import { useRouter } from "next/router";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";

const Card = styled.div`
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 768px) {
    min-height: 40vh;
  }
`;

const CardHeading = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin: 0.5rem 0.6rem 0rem 0.6rem;
`;

const CardSubHeading = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin: 0 0 0.5rem 0;
`;

const CardListItem = styled.p`
  font-size: 0.9rem;
  font-weight: 100;

  margin: 0 0.6rem 1rem 0.6rem;
  line-height: 1.5;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  height: max-content;
  width: 100%;
`;

const ButtonContainer = styled.div`
  &:hover {
    background-color: black;
  }
`;

const Testimonial = (props) => {
  const router = useRouter();
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);

  return (
    <Card className="border center-v text-cener">
      <ImageLoader
        borderRadius="50%"
        width="60%"
        widthMobile="40%"
        url={props.image}
        dimensionsMobile={{ width: 600, height: 600 }}
        dimensions={{ width: 900, height: 900 }}
      ></ImageLoader>

      <CardHeading className="font-lexend text-center">
        {props.heading}
      </CardHeading>

      <CardSubHeading className="font-lexend text-center">
        {props.duration + " | " + props.destination}
      </CardSubHeading>

      {props.review ? (
        <ImQuotesLeft
          style={{ fontSize: "1.25rem", marginLeft: "-0rem" }}
        ></ImQuotesLeft>
      ) : null}

      <CardListItem className="text-center">
        <em>{props.text}</em>
      </CardListItem>

      <div style={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
        <GridContainer>
          <ButtonContainer
            className="border center-div"
            style={{ borderRadius: "10px" }}
          >
            <Button
              display="flex"
              height="100%"
              center
              fontWeight="500"
              fontSize="0.85rem"
              width="100%"
              onclick={() => router.push("/itinerary/" + props.id)}
              borderWidth="0"
              borderRadius="2rem"
            >
              View Plan
            </Button>
          </ButtonContainer>

          <ButtonContainer
            className="border center-div"
            style={{ borderRadius: "10px" }}
          >
            <Button
              fontWeight="500"
              fontSize="0.85rem"
              borderWidth="0"
              width="100%"
              borderRadius="10px"
              bgColor="#f7e700"
              onclick={() => setShowMobilePlanner(true)}
            >
              Start Planning
            </Button>
          </ButtonContainer>
        </GridContainer>
      </div>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => setShowMobilePlanner(false)}
        show={showMoiblePlanner}
      ></TailoredFormMobileModal>
    </Card>
  );
};

export default Testimonial;
