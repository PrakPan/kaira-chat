import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/ui/button/Index";
import TailoredForm from "../../../components/tailoredform/Index";
import Rolodex from "../../travelplanner/Rolodex";
import TailoredFormMobileModal from "../../../components/modals/TailoredFomrMobile";

const Container = styled.div`
  color: white;
  width: 100%;
  display: grid;
  text-align: center;
  @media screen and (min-width: 768px) {
    width: 90%;
    text-align: left;
    margin: auto;

    grid-template-columns: auto 400px;
  }
`;

const Heading = styled.h1`
  color: white;

  width: 99%;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 2rem;

  @media screen and (min-width: 768px) {
    font-size: 3rem;
    font-weight: 700;
  }
`;

const PaddingContianer = styled.div`
  padding: 5vh 0 0 0;
  flex-grow: 1;
  @media screen and (min-width: 768px) {
    padding: 0 0 0 0;
  }
`;

const FullImgContent = (props) => {
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  return (
    <Container className=" center-di text-cente">
      <PaddingContianer>
        <Heading>{props.tagline}</Heading>

        <Rolodex></Rolodex>

        <div className="hidden-desktop">
          <Button
            bgColor="#f7e700"
            borderRadius="10px"
            color="black"
            borderWidth="0"
            onclick={() => setShowMobilePlanner(true)}
            margin="1rem auto"
          >
            Build Now
          </Button>
        </div>
      </PaddingContianer>
      <div className="hidden-mobile" style={{}}>
        <TailoredForm
          children_cities={props.children_cities}
          destination={props.destination}
          cities={props.cities}
        ></TailoredForm>
      </div>

      <TailoredFormMobileModal
        children_cities={props.children_cities}
        destination={props.destination}
        onHide={() => setShowMobilePlanner(false)}
        cities={props.cities}
        show={showMoiblePlanner}
      ></TailoredFormMobileModal>
    </Container>
  );
};

export default FullImgContent;
