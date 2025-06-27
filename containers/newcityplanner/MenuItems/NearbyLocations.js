import React, { useEffect, useState } from "react";
import Card from "../../../components/containers/newplannerlocations/Card";
import media from "../../../components/media";
import DesktopSkeleton, {
  MobileSkeleton,
} from "../../../components/containers/plannerlocations/LocationSkeleton";
import Button from "../../../components/ui/button/Index";
import styled from "styled-components";
import openTailoredModal from "../../../services/openTailoredModal";
import { useRouter } from "next/router";
import SwiperCarousel from "../../../components/SwiperCarousel";
import H3 from "../../../components/heading/H3";

const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  margin-block: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 32px;
    margin-block: 3.5rem;
  }
`;

const NearbyLocations = (props) => {
  if (!props.nearbyCities || props.nearbyCities?.length === 0) return <></>;

  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const allCards = props.nearbyCities.map((city, i) => {
      const mostPopular = city.most_popular_for;
      return (
        <Card
          key={city.id}
          location={city.name}
          heading={
            mostPopular?.length ? mostPopular[mostPopular.length - 1] : ""
          }
          img={city.image}
          path={city.path}
          link={city.slug}
          city={true}
          data={city}
          tags={city.tags || city.most_popular_for}
          page={props?.page}
          state={props?.state}
        />
      );
    });

    setCards(allCards);
    setMobileCardsToShowJSX(allCards);
  }, [props.nearbyCities]);

  return (
    <>
      <H3
        style={{
          marginBlock: isPageWide ? "3.5rem" : "1.5rem",
        }}
      >
        Nearby Locations to {props.data.name}
      </H3>

      {isPageWide ? (
        <>
          {cards.length ? (
            <SwiperCarousel
              navigationButtons={true}
              slidesPerView={6}
              cards={cards}
            />
          ) : (
            <DesktopSkeleton />
          )}
          <Button
            onclick={() =>
              openTailoredModal(router, props.data.id, props.data.name)
            }
            borderWidth="1px"
            fontSizeDesktop="16px"
            fontWeight="600"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Unlock your personalized adventure
          </Button>
        </>
      ) : (
        <div>
          {MobilecardsToShowJSX.length ? (
            <SwiperCarousel
              slidesPerView={1.1}
              centeredSlides
              cards={MobilecardsToShowJSX}
            />
          ) : (
            <MobileSkeleton />
          )}
        </div>
      )}
    </>
  );
};

export default NearbyLocations;