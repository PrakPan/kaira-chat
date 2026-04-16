import styled, { keyframes } from "styled-components";
import ImageGallery from "./slider/ImageSlider";
import { useRouter } from "next/router";
import { logEvent } from "../../../services/ga/Index";
import Info from "./info/Index";
import { fadeIn } from "react-animations";
import Summary from "./Summary";
import Cost from "./info/Cost";
import Button from "../../ui/button/Index";
import { useState } from "react";

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

const ExperienceCard = (props) => {
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
    else router.push("/chat/" + props.id);
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
          owner={props.data.owner || props?.data?.curated_by}
          user_name={props.data.user_name || props?.data?.curated_by}
          locations={props.locations || props?.data?.cities}
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
          show_per_person={props.data?.payment_information?.per_person_discounted_cost}
          persons={
            (props.data?.number_of_adults +
            props.data?.number_of_children +
            props.data?.number_of_infants) || props?.data?.payment_information?.pax
          }
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

export default ExperienceCard;
