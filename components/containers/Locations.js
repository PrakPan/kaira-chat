import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../cards/Location";
import { useRouter } from "next/router";
import Button from "../ui/button/Index";
import urls from "../../services/urls";
import openTailoredModal from "../../services/openTailoredModal";
import SwiperCarousel from "../SwiperCarousel";

const Container = styled.div`
  display: grid;
  height: 60vh;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 1rem;
    height: 50vh;
  }
`;

const LocationsBlog = (props) => {
  const router = useRouter();
  const [cardsJSX, setCardsJSX] = useState([null, null, null, null, null]);

  useEffect(() => {
    let cardsarr = [];

    if (props.locations)
      props.locations.map((location) => {
        cardsarr.push(
          <Card
            key={location.tagline}
            location={location.name}
            heading={location.tagline}
            img={location.image}
            onclick={
              !props.planner
                ? () =>
                    _handlePlanning(
                      location.id,
                      location.name,
                      location.state.name
                    )
                : () => _handlePlannerPage(location.id, location.state.name)
            }
          ></Card>
        );
      });
    setCardsJSX(cardsarr);
  }, [props.locations]);

  const _handlePlanning = (id, name, parent) => {
    localStorage.setItem("search_city_selected_id", id);
    localStorage.setItem("search_city_selected_name", name);
    localStorage.setItem("search_city_selected_parent", parent);
    openTailoredModal(router, id, name);
  };

  const _handlePlannerPage = (id, name) => {
    openTailoredModal(router, id, name);
  };

  return (
    <>
      <div className="hidden-mobile">
        <Container>{cardsJSX}</Container>
        {props.viewall ? (
          <Button
            boxShadow
            link={urls.travel_guide.BASE}
            hoverBgColor="black"
            hoverColor="white"
            borderWidth="1px"
            borderRadius="2rem"
            margin="1.5rem auto"
            padding="0.5rem 2rem"
          >
            View All
          </Button>
        ) : null}
      </div>

      <div className="hidden-desktop">
        <div style={{ padding: "1rem 0" }}>
          <SwiperCarousel
            slidesPerView={1.3}
            initialSlide={1}
            centeredSlides
            cards={cardsJSX}
          ></SwiperCarousel>
        </div>
        {props.viewall ? (
          <Button
            onclick={() => _handlePlannerPage(location.id, location.state.name)}
            onclickparams={null}
            boxShadow
            borderWidth="1px"
            borderRadius="2rem"
            margin="auto"
            padding="0.5rem 2rem"
          >
            View All
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default LocationsBlog;
