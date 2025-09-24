import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import media from "../../components/media";
import TailoredForm from "../../components/tailoredform/Index";
import ImageLoader from "../../components/ImageLoader";

const Container = styled.div`
  color: white;
  width: 100%;
  display: grid;
  text-align: center;
  position: relative;
  @media screen and (min-width: 768px) {
    padding: 0;
    width: 90%;
    text-align: left;
    margin: auto;
    grid-template-columns: auto 400px;
  }
`;

const Heading = styled.h1`
  color: white;

  width: 99%;
  font-weight: 800;
  margin-bottom: 1rem;
  font-size: 35px;
  @media screen and (min-width: 768px) {
    font-size: 55px;
    font-weight: 700;
  }
`;

const PaddingContianer = styled.div`
  padding: 5vh 0 0 0;
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
  font-weight: 600;
  margin-top: 7px;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const SubHeading = styled.div`
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  @media screen and (min-width: 768px) {
    font-size: 28px;
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
    width: 40%;
  }
`;

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container className=" center-di text-cente">
      <PaddingContianer>
        <Heading>{props.title}</Heading>
        {isPageWide ? (
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
        <div className="hidden-mobile"></div>
        <div className="hidden-desktop">
          <Button
            padding="0.75rem 1rem"
            fontSize="14px"
            fontWeight="500"
            bgColor="#f7e700"
            borderRadius="10px"
            color="black"
            borderWidth="1px"
            onclick={() => props.setShowMobilePlanner(true)}
            margin="1rem auto 1rem auto"
          >
            Start Planning
          </Button>
        </div>
      </PaddingContianer>
      <div className="hidden-mobile" style={{}}>
        <TailoredForm
          destionType={"state"}
          page_id={props.page_id}
          children_cities={props.children_cities}
          destination={props.destination}
          cities={props.cities}
        ></TailoredForm>
      </div>

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
            Fast, Flexible <br /> Bookings
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
            No hidden <br />
            commissions
          </IconText>
        </div>
      </IconsContainer>
    </Container>
  );
};

export default FullImgContent;
