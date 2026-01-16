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

const FullImgContentLadakh = (props) => {
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
    //       source: 'ladakh' }
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
    <Container className=" h-full !flex justify-center items-center mt-4">
      <PaddingContianer className="flex items-center justify-center mt-[120px]">

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
              className="flex justify-center items-center"
            >
              Get My Custom Plan!
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
              Get My Custom Plan!
            </Button>
          </div>
        )}
      </PaddingContianer>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
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

export default FullImgContentLadakh;
