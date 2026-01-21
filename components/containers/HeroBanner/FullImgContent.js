import React from "react";
import styled from "styled-components";
import Button from "../../ui/button/Index";
import media from "../../media";
import TailoredForm from "../../tailoredform/Index";
import ImageLoader from "../../ImageLoader";
import openTailoredModal from "../../../services/openTailoredModal";
import { useRouter } from "next/router";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";
import { useState } from "react";
import { logEvent } from "../../../services/ga/Index";
import H1 from "../../heading/H1";
import H7 from "../../heading/H7";

const Container = styled.div`
  color: white;
  width: 100%;
  display: grid;
  text-align: center;
  @media screen and (min-width: 768px) {
    padding: 0;
    width: 85%;
    text-align: left;
    margin: auto;
    grid-template-columns: auto 400px;
    margin-top: 2vh;
  }
`;

const PaddingContianer = styled.div`
  padding: 5rem 0 2rem 0;
  flex-grow: 1;
  @media screen and (min-width: 768px) {
    padding: 1vh 0 0 0;
  }
`;

const IconText = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  text-align: center;
  color: black;
  font-weight: 400;
  margin-top: 7px;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  filter: invert(100%);
  justify-content: space-between;
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding-inline: 10px;
  @media screen and (min-width: 768px) {
    width: 40%;
  }
`;

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    // if (isPageWide) {
    //   setShowTailoredModal(true);
    // } else {
    //   openTailoredModal(router, props.page_id, props.destination,props.type);
    // }
    // router.push({
    //     pathname: "/new-trip",
    //     query: { 
    //       ...router.query,
    //       source: props?.destination || 'home' }
    // });
    setShowTailoredModal(true);
    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free!",
        event_action: "Banner",
      },
    });
  };

  return (
    <Container className="">
      <PaddingContianer className="">
        <div className="">
          <H1 style={{ color: "white" }}>{props.destination ?  props.destination + " Trip Planner" : props?.title}</H1>
          {props.subheading ? (
            <H7
              style={{
                lineHeight: isPageWide ? "35px" : "20px",
                fontSize: isPageWide ? "25px" : "20px",
              }}
            >
              {props.subheading}
            </H7>
          ) : isPageWide ? (
            <H7
              style={{
                lineHeight: isPageWide ? "35px" : "20px",
                fontSize: isPageWide ? "25px" : "20px",
              }}
            >
              Bid farewell to generic holiday packages.
              <br />
              Get Your AI-Personalised Itineraries
            </H7>
          ) : (
            <H7
              style={{
                lineHeight: isPageWide ? "35px" : "20px",
                fontSize: isPageWide ? "25px" : "20px",
              }}
            >
              Say goodbye to packages.
              <br />
              Get Your AI-Personalised Itineraries
            </H7>
          )}
        </div>

        {isPageWide ? (
          <div>
            <Button
              padding="0.75rem 1rem"
              fontSize="18px"
              fontWeight="500"
              bgColor="#f7e700"
              borderRadius="7px"
              color="black"
              borderWidth="1px"
              onclick={handlePlanButton}
              margin="3vh 0 1vh 0"
            >
              Plan Itinerary For Free!
            </Button>
          </div>
        ) : (
          <div>
            <Button
              padding="0.75rem 1rem"
              fontSize="14px"
              fontWeight="500"
              bgColor="#f7e700"
              borderRadius="10px"
              color="black"
              borderWidth="1px"
              onclick={handlePlanButton}
              margin="1rem auto 1rem auto"
            >
              Start Planning
            </Button>
          </div>
        )}
      </PaddingContianer>

      {isPageWide && (
        <div style={{ marginTop: "1.2rem" }}>
          <TailoredForm
            page_id={props?.slug == 'europe-continent' ? 15 : props.page_id}
            type={props?.type}
            children_cities={props.children_cities}
            destination={props.destination}
            cities={props.cities}
            HeroBanner
            eventDates={props.eventDates}
          ></TailoredForm>
        </div>
      )}

      <IconsContainer>
        <div>
          <ImageLoader
            height="2.5rem"
            width="2.5rem"
            widthmobile="2.5rem"
            url="media/icons/general/travel.png"
            noLazy
          />
          <IconText>
            Free Personalized <br /> Itineraries
          </IconText>
        </div>

        <div>
          <ImageLoader
            height="2.5rem"
            width="2.5rem"
            widthmobile="2.5rem"
            url="media/icons/general/booking.png"
            noLazy
          />
          <IconText>
            Curated <br />
            Experiences
          </IconText>
        </div>

        <div>
          <ImageLoader
            height="2.5rem"
            width="2.5rem"
            widthmobile="2.5rem"
            url="media/icons/general/money.png"
            noLazy
          />
          <IconText>
            Transparent <br /> Pricing
          </IconText>
        </div>
      </IconsContainer>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props?.slug == 'europe-continent' ? 15 : props.page_id}
        type={props?.type}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </Container>
  );
};

export default FullImgContent;