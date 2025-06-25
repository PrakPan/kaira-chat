import { useRouter } from "next/router";
import React from "react";
import styled, { keyframes } from "styled-components";
import media from "../../components/media";
import Button from "../../components/ui/button/Index";
import ImageLoader from "../../components/ImageLoader";
import openTailoredModal from "../../services/openTailoredModal";
import TripsCounter from "./TripsCounter";
import Link from "next/link";
import { logEvent } from "../../services/ga/Index";
import H5 from "../../components/heading/H5";

const Container = styled.div`
  height: 430px;
  display: grid;
  gap: 0.2rem;
  grid-template-areas:
    "a a a b b b b b"
    "a a a b b b b b"
    "d d e e e e e e"
    "c c c c c c c c"
    "c c c c c c c c";

  padding: 10px;

  @media screen and (min-width: 768px) {
    height: 600px;
    gap: 0.5rem;
    grid-template-areas:
      "a a a a b b b b b"
      "a a a a b b b b b"
      "a a a a b b b b b"
      "a a a a e e e e e"
      "c c c d e e e e e"
      "c c c d e e e e e";
  }

  & > .d {
    border: null;
    background: rgba(247, 231, 0, 0.2);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    padding-left: 5px;
    margin-bottom: 0px;
    @media screen and (min-width: 768px) {
      padding: 25px;
      font-size: 20px;
      text-align: center;
      align-items: center;
      background: white;
      border: 1px solid black;
    }
  }
`;

const TopSlideIn = keyframes`
from {
  transform: translateY(0%);
}
to {
  transform: translateY(30%);
}
`;

const TopSlideOut = keyframes`
from {
  transform: translateY(30%);
}
to {
  transform: translateY(0%);
}

`;

const TextContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 9px;
  right: ${(props) => (props.right ? "9px" : null)};
  left: ${(props) => (props.right ? null : "9px")};
  text-align: ${(props) => (props.right ? "right" : "left")};
  color: white;
  animation: 0.5s ${TopSlideOut};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  & > p {
    margin-top: -5px;
    font-weight: 500;
    font-size: 14px;
    @media screen and (min-width: 768px) {
      font-size: 20px;
    }
  }
  @media screen and (min-width: 768px) {
    top: 30px;
    left: 30px;
  }
`;

const Heading = styled.div`
  font-size: 16px;
  font-weight: 700;
  @media screen and (min-width: 768px) {
    font-size: 25px;
  }
`;

const GridItem = styled.div`
  grid-area: ${(props) => props.className};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

const ImageContainer = styled(Link)`
  cursor: pointer;
  height: 100%;
  width: 100%;
  .StartNow {
    display: none;
    top: 45px;
    animation: 0.5s ${TopSlideIn};
    @media screen and (min-width: 768px) {
      top: 65px;
      left: 30px;
    }
  }
  transition: 0.5s all ease-in-out;
  &:hover {
    transform: scale(1.1);
    .AnimateTop {
      animation: 0.5s ${TopSlideIn} forwards;
    }
    .StartNow {
      animation: 0.5s ${TopSlideIn} forwards;
      display: initial;
    }
  }
`;

const PlanAsPerTheme = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();

  const _handleTripRedirect = (banner_heading) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Destination",
        event_value: banner_heading,
        event_action: `Plan trip as per mood`,
      },
    });
  };

  const handleItineraryButton = () => {
    openTailoredModal(router, props.page_id, props.destination);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Button Click",
        event_label: "Create your free Itinerary",
        event_action: "Plan trip as per mood",
      },
    });
  };

  const order = ["e", "b", "c", "a"];
  const ThemeContainer = props.ThemeData?.slice(0, 4).map((e, i) => (
    <GridItem
      className={order[i]}
      key={i}
      onClick={() => _handleTripRedirect(e.banner_heading)}
    >
      <ImageContainer bg="road-trip.png" href={"/theme/" + e.path}>
        <TextContainer className="AnimateTop">
          <H5>{e.banner_heading}</H5>
          {isPageWide && <div className="StartNow">Explore!</div>}
        </TextContainer>
        <ImageLoader
          noLazy
          fit="cover"
          width="100%"
          height="100%"
          style={{ filter: "brightness(0.9)" }}
          url={e.overview_image}
        ></ImageLoader>
      </ImageContainer>
    </GridItem>
  ));

  return (
    <>
      <Container>
        {ThemeContainer}
        <GridItem className="d">
          <TripsCounter Count={props.Count} />
          <p
            style={
              isPageWide ? {} : { marginTop: "-10px", marginBottom: "0px" }
            }
          >
            Trips Planned
          </p>
          <p
            style={
              isPageWide
                ? { marginTop: "-15px" }
                : { marginTop: "-5px", marginBottom: "0px" }
            }
          >
            so far.
          </p>
        </GridItem>
      </Container>

      {!props.nostart ? (
        <Button
          onclick={handleItineraryButton}
          fontWeight="500"
          boxShadow
          borderRadius="8px"
          bgColor="#F7E700"
          margin="1rem auto"
          width="20rem"
          borderWidth="1px"
        >
          {isPageWide
            ? "Create your free itinerary"
            : "Create your personalised Itinerary"}
        </Button>
      ) : null}
    </>
  );
};

export default React.memo(PlanAsPerTheme);
