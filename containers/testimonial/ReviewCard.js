import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";
import ImageLoader from "../../components/ImageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import media from "../../components/media";
import usePageLoaded from "../../components/custom hooks/usePageLoaded";

const Card = styled.div`
  padding: 1rem;

  cursor: pointer;
  height: 75vh;

  background: white;
  font-size: 0.8rem;
  @media screen and (min-width: 768px) {
    font-size: 1rem;
    padding: 1rem;
    height: auto;
  }
`;

const Card2 = styled.div`
  font-weight: 300;
  height: 75vh;

  line-height: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 0.8rem;
  @media screen and (min-width: 768px) {
    font-size: 1rem;
    height: auto;
  }
`;

const Name = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 1.5rem 0 1rem 0;
`;

const ReadMore = styled.p`
  font-weight: 200;
  letter-spacing: 1px;
  line-height: 1.5;
  font-size: 1rem;

  overflow: hidden;
  @media screen and (min-width: 768px) {
    height: auto;
  }
`;

const ReviewBack = styled.p`
  font-weight: 200;
  letter-spacing: 1px;
  line-height: 1.5;
  font-size: 1rem;
  overflow: hidden;
  @media screen and (min-width: 768px) {
    height: auto;
  }
`;

const ReviewContainer = styled.div`
  @media screen and (min-width: 768px) {
    width: 85%;
    margin: auto;
  }
`;

const ReviewFront = styled.p`
  font-weight: 200;
  letter-spacing: 1px;
  line-height: 1.5;
  font-size: 1rem;
  height: 9rem;
  overflow: hidden;
  @media screen and (min-width: 768px) {
    height: auto;
  }
  &:before {
    content: open-quote;
    font-family: "Font Awesome 5 Free";
    font-size: 2.5rem;
    /* font-size: ${(props) =>
      props.theme.fontsizes.mobile.headings.one
        ? props.theme.fontsizes.mobile.headings.one
        : props.theme.fontsizes.mobile.headings.one}; */
    padding: 0;
    display: inline-block;

    line-height: 1;
  }
  &:after {
    content: close-quote;
    font-family: "Font Awesome 5 Free";
    font-size: 2.5rem;
    /* font-size: ${(props) =>
      props.theme.fontsizes.mobile.headings.one
        ? props.theme.fontsizes.mobile.headings.one
        : props.theme.fontsizes.mobile.headings.one}; */
    padding: 0;
    visibility: hidden;
    line-height: 1;
    display: block;
  }
`;

const TestimonialCard = (props) => {
  const isPageLoaded = usePageLoaded();
  let isPageWide = media("(min-width: 768px)");
  const [isFlipped, setIsFlipped] = useState(false);
  const [Card1Height, setCard1Height] = useState(0);
  const [Card2Height, setCard2Height] = useState(0);
  const [stringlength, setStringlength] = useState();
  const Card1Ref = useRef();
  const Card2Ref = useRef();

  useEffect(() => {
    if (Card2Ref.current.offsetHeight < Card1Ref.current.offsetHeight) {
      setCard2Height(Card1Ref.current.offsetHeight);
    } else {
      setCard1Height(Card2Ref.current.offsetHeight);
    }
  });

  const _flipHandler = (e, val) => {
    e.preventDefault();
    setIsFlipped(val);
  };

  if (isPageLoaded && !stringlength) {
    if (window.innerWidth <= 380 && window.innerHeight < 700)
      setStringlength(380); // Moto g4
    else if (window.innerWidth <= 380 && window.innerHeight > 700)
      setStringlength(450); //iphone x
    else if (window.innerWidth > 380 && window.innerWidth < 768)
      setStringlength(600); //pixel 2 etc
    else if (window.innerWidth > 768) setStringlength(800);
  }

  const countryicons = {
    germany: "media/icons/countries/germany.png",
    mexico: "media/icons/countries/mexico.svg",
    india: "media/icons/countries/india.svg",
    turkey: "media/icons/countries/turkey.svg",
    us: "media/icons/countries/us.svg",
    france: "media/icons/countries/france.svg",
    indonesia: "media/icons/countries/indonesia.svg",
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <Card
        style={{ minHeight: Card1Height + "px" }}
        ref={Card1Ref}
        onClick={(event) => _flipHandler(event, true)}
        onMouseEnter={(event) => _flipHandler(event, true)}
        className="font-nunito text-center center-div"
      >
        <ImageLoader
          widthmobile="60%"
          widthtab="40%"
          fit="cover"
          url={props.url}
          dimensions={{ width: 400, height: 400 }}
          dimensionsMobile={{ width: 400, height: 400 }}
          borderRadius="50%"
          width="50%"
        />

        <Name className="">{props.name}</Name>

        <ImageLoader
          dimensions={{ height: 100, width: 180 }}
          height="1.5rem"
          width="2rem"
          widthmobile="2rem"
          url={countryicons[props.location]}
        ></ImageLoader>

        <ReviewContainer style={{ position: "relative" }}>
          <ReviewFront className="">
            <em>{props.text}</em>{" "}
          </ReviewFront>

          {!isPageWide ? (
            <ReadMore
              style={{
                borderStyle: "none none solid none",
                borderWidth: "1px",
                width: "max-content",
                margin: "2rem auto 0 auto",
                display: "block",
              }}
              className=""
            >
              Read More
            </ReadMore>
          ) : null}
        </ReviewContainer>
      </Card>

      <Card2
        style={{ minHeight: Card2Height + "px" }}
        ref={Card2Ref}
        onClick={(event) => _flipHandler(event, false)}
        onMouseLeave={(event) => _flipHandler(event, false)}
      >
        <Name className="">{props.name + "'s story"}</Name>
        <ReviewContainer
          style={{ position: "relative", maxHeight: Card1Height - 50 + "px" }}
        >
          <ReviewBack className="">
            {props.review.length < stringlength
              ? props.review
              : props.review.substring(0, stringlength) + "..."}
          </ReviewBack>
          <FontAwesomeIcon
            icon={faQuoteRight}
            style={{ position: "absolute", right: "-5px", top: "-1rem" }}
          ></FontAwesomeIcon>
        </ReviewContainer>
      </Card2>
    </ReactCardFlip>
  );
};

export default TestimonialCard;
