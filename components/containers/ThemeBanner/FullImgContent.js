import React from "react";
import styled from "styled-components";
import Button from "../../ui/button/Index";
import media from "../../media";
import TailoredForm from "../../tailoredform/Index";
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
    display: flex;
    padding: 1vh 0 0 0;
    flex-direction: column;
    justify-content: center;
  }
`;

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    if (isPageWide) {
      setShowTailoredModal(true);
    } else {
      openTailoredModal(router, props.page_id, props.destination);
    }

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
    <Container className="font-lexend">
      <PaddingContianer className="flex flex-col items-center md:items-start">
        <div className="">
          <H1 style={{ color: "#F7E700" }}>{props.title}</H1>
          {props.subheading ? (
            <H7
              style={{
                lineHeight: isPageWide ? "35px" : "25px",
                fontSize: isPageWide ? "25px" : "20px",
              }}
              className="md:w-[60%] text-start ml-3"
            >
              {props.subheading}
            </H7>
          ) : isPageWide ? (
            props.slug == "honeymoon-2025" ? null : (
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
            )
          ) : props.slug == "honeymoon-2025" ? null : (
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

        <Button
          padding="0.5rem 1rem"
          fontSize="15px"
          fontWeight="400"
          bgColor="#f7e700"
          borderRadius="7px"
          color="black"
          borderWidth="1px"
          onclick={handlePlanButton}
          margin="3vh 0 1vh 1rem"
        >
          {props.slug === "honeymoon-2025"
            ? "Plan Your Honeymoon!"
            : "Plan Your Trip Now!"}
        </Button>
      </PaddingContianer>

      {isPageWide && (
        <div style={{ marginTop: "1.2rem" }}>
          <TailoredForm
            page_id={props.page_id}
            children_cities={props.children_cities}
            destination={props.destination}
            cities={props.cities}
            HeroBanner
          ></TailoredForm>
        </div>
      )}

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />
    </Container>
  );
};

export default FullImgContent;
