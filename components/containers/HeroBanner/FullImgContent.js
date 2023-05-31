import React from "react";
import styled from "styled-components";
import Button from "../../ui/button/Index";
import media from "../../media";
import TailoredForm from "../../tailoredform/Index";
import ImageLoader from "../../ImageLoader";
import openTailoredModal from "../../../services/openTailoredModal";
import { useRouter } from "next/router";
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
const Heading = styled.h1`
  color: white;

  width: 99%;
  font-weight: 800;
  margin-bottom: 1rem;
  font-size: 28px;
  @media screen and (min-width: 768px) {
    font-size: 48px;
    font-weight: 700;
  }
`;
const SubText = styled.h3`
  color: white;
  font-weight: 100;
  width: 99%;
  font-size: 1.2rem;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
  }
`;

const PaddingContianer = styled.div`
  padding: 5rem 0 0 0;
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

const SubHeading = styled.div`
  font-size: 16px;
  line-height: 20px;
  font-weight: 200;
  @media screen and (min-width: 768px) {
    font-size: 25px;
    line-height: 35px;
  }
`;
const IconsContainer = styled.div`
  display: flex;
  filter: invert(100%);
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding-inline: 10px;
  @media screen and (min-width: 768px) {
    bottom: 30px;
    width: 40%;
    // bottom : -20%;
  }
`;
const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  return (
    <Container className="font-lexend center-di text-cente">
      <PaddingContianer>
        <Heading>{props.title}</Heading>
        {props.subheading ? (
          <SubHeading>{props.subheading}</SubHeading>
        ) : isPageWide ? (
          <SubHeading>
            Bid farewell to generic holiday packages.
            <br />
            Get Your AI-Personalised Itineraries
          </SubHeading>
        ) : (
          <SubHeading>
            Say goodbye to packages.
            <br />
            Get Your AI-Personalised Itineraries
          </SubHeading>
        )}

        {!isPageWide && (
          <div>
            <Button
              padding="0.75rem 1rem"
              fontSize="14px"
              fontWeight="500"
              bgColor="#f7e700"
              borderRadius="10px"
              color="black"
              borderWidth="1px"
              onclick={() =>
                openTailoredModal(router, props.page_id, props.destination)
              }
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
            page_id={props.page_id}
            children_cities={props.children_cities}
            destination={props.destination}
            cities={props.cities}
            HeroBanner
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
          />
          <IconText>
            Affordable & <br />
            Flexible Bookings
          </IconText>
        </div>
        <div>
          <ImageLoader
            height="2.5rem"
            width="2.5rem"
            widthmobile="2.5rem"
            url="media/icons/general/money.png"
          />
          <IconText>
          Zero Hidden <br /> Charges
          </IconText>
        </div>
      </IconsContainer>
    </Container>
  );
};

export default FullImgContent;
