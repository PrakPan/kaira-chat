import React from "react";
import styled from "styled-components";
import media from "../../../components/media";
import Card from "./Card";
import TRAVELERS from "./ReviewsData";
import Button from "../../../components/ui/button/Index";
import SwiperCarousel from "../../../components/SwiperCarousel";
import { useState } from "react";

const Container = styled.div`
  padding: 0 0.5rem;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3rem;
    grid-row-gap: 1rem;
    padding: 0;
  }
`;

const NewCaseStudies = (props) => {
  const [more, setMore] = useState(false);
  let isPageWide = media("(min-width: 768px)");

  const cards = TRAVELERS.map((e) => (
    <Card
      review
      id={e.id}
      duration={e.duration}
      destination={e.destination}
      heading={e.name}
      text={e.review}
      image={e.image}
      logo={e.logo}
    />
  ));

  return (
    <div>
      {isPageWide && (
        <>
          <Container>
            {more
              ? cards.map((e, i) => <div key={i}>{e}</div>)
              : cards.slice(0, 4).map((e, i) => <div key={i}>{e}</div>)}
          </Container>

          {!more ? (
            <Button
              onclick={() => setMore(true)}
              borderWidth="1px"
              fontSizeDesktop="12px"
              fontWeight="500"
              borderRadius="6px"
              margin="auto"
              padding="0.5rem 2rem"
            >
              View more
            </Button>
          ) : (
            <Button
              onclick={() => props.setEnquiryOpen()}
              onclickparams={null}
              borderWidth="1px"
              fontSizeDesktop="12px"
              fontWeight="500"
              borderRadius="6px"
              margin="auto"
              padding="0.5rem 2rem"
            >
              Schedule Callback
            </Button>
          )}
        </>
      )}

      {!isPageWide && (
        <SwiperCarousel
          slidesPerView={1}
          pageDots
          cards={cards}
        ></SwiperCarousel>
      )}
    </div>
  );
};

export default NewCaseStudies;
