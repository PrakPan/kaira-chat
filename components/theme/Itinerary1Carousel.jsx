import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fadeIn } from "react-animations";
import SwiperCarousel from "../SwiperCarousel";
import styled, { keyframes } from "styled-components";
import ImageGallery from "../cards/newitinerarycard-main/slider/ImageSlider";
import { logEvent } from "../../services/ga/Index";
import Info from "../cards/newitinerarycard-main/info/Index";
import Summary from "../cards/newitinerarycard-main/Summary";
import Cost from "../cards/newitinerarycard-main/info/Cost";
import Button from "../ui/button/Index";
import media from "../../components/media";

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
  width: 100%;
  animation: 1s ${fadeInAnimation};
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 3px 0px 0px rgba(240, 240, 240, 1);
  border-radius: 10px;
  border: 1.5px solid rgba(236, 234, 234, 1);
  @media screen and (min-width: 768px) {
    &:hover {
      cursor: pointer;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  text-align: center;
  color: white;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 0.75rem 0.75rem;
  box-sizing: border-box;
  @media screen and (min-width: 768px) {
  }
`;

const Itinerary1Carousel = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (props.itineraries) {
      let _cards = [];
      for (let itinerary of props.itineraries) {
        let duration = itinerary.cities.reduce(
          (prev, city) => prev + city.duration,
          0
        );

        _cards.push(
          <ItineraryCard
            data={itinerary}
            key={itinerary.short_text}
            id={itinerary.id}
            number_of_adults={itinerary.payment_information.pax}
            duration={duration ? duration : null}
            starting_cost={
              itinerary.payment_information
                ? itinerary.payment_information.show_per_person_cost
                  ? itinerary.payment_information.per_person_discounted_cost
                  : itinerary.payment_information.discounted_cost
                : itinerary.starting_price
            }
            images={itinerary.images}
            locations={itinerary.cities.map(
              (location) => `${location.name} (${location.duration}N)`
            )}
          />
        );
      }

      setCards(_cards);
    }
  }, [props.itineraries]);

  return (
    <SwiperCarousel
      navigationButtons={true}
      slidesPerView={isPageWide ? 3 : 1}
      cards={cards}
      pageDots={!isPageWide}
    ></SwiperCarousel>
  );
};

export default Itinerary1Carousel;

const ItineraryCard = (props) => {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [name, setName] = useState(props.data ? props.data.name : props.name);

  const _handleRedirect = () => {
    logEvent({
      action: "View_Itinerary",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Details",
        event_action:
          props?.page &&
          (props.page === "Home Page" ||
            props.page === "Thank you Page" ||
            props.page === "Dashboard Page")
            ? "My Trips"
            : "Trips by our users",
      },
    });
    if (props.PW) router.push("/itinerary/physicswallah/" + props.id);
    else router.push("/itinerary/" + props.id);
  };

  const FONT_SIZES_DESKTOP = ["20px"];

  return (
    <Container
      className="netflix-ite relative"
      onClick={_handleRedirect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ImageContainer>
        <ImageGallery
          duration_number={props.duration_number ? props.duration_number : null}
          duration={props.duration}
          images={props.images}
        ></ImageGallery>
      </ImageContainer>

      <div
        className={`absolute transition w-fit flex place-self-center bottom-[55%] z-50 bg-gray-200 px-2 py-1 rounded-md drop-shadow-2xl text-sm ${
          hover ? "opacity-100" : "opacity-0"
        } `}
      >
        {name}
      </div>

      <ContentContainer className="">
        <Info
          PW={props.PW}
          owner={props.data.curated_by}
          user_name={props.data.curated_by}
          locations={props.locations}
          FONT_SIZES_DESKTOP={FONT_SIZES_DESKTOP}
          name={name}
          id={props.id}
          number_of_adults={props.number_of_adults}
          starting_cost={props.starting_cost}
        ></Info>
      </ContentContainer>

      {props.data ? (
        props.data.payment_information ? (
          props.data.payment_information.summary ? (
            <Summary summary={props.data.payment_information.summary}></Summary>
          ) : null
        ) : null
      ) : null}

      <ContentContainer
        style={{
          display: "flex",
          flexGrow: "1",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Cost
          PW={props.PW}
          coupon_applied={props.data?.payment_information?.coupon_usage}
          discounted_cost={props.data?.payment_information?.discounted_cost}
          show_per_person={
            props.data?.payment_information?.show_per_person_cost
          }
          persons={props.data?.payment_information.pax}
          starting_cost={props.starting_cost}
        ></Cost>

        <Button
          borderRadius="6px"
          onclick={_handleRedirect}
          fontSizeDesktop="12px"
          borderWidth="1.25px"
          width="100%"
          fontWeight="600"
          bgColor="#f7e700"
        >
          View Details
        </Button>
      </ContentContainer>
    </Container>
  );
};
