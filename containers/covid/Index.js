import styled from "styled-components";
import Heading from "../../components/newheading/heading/Index";
import ImageLoader from "../../components/ImageLoader";

const Container = styled.div`
  height: max-content;
  width: 100vw;
  background-color: #f7e700;
  padding-top: 10vh;
  min-height: 100vh;
`;

const WhiteContainer = styled.div`
  background-color: white;
  width: 90%;
  margin: auto;
  padding: 1rem;
  @media screen and (min-width: 768px) {
    width: 70%;
    padding: 7.5vh;
  }
`;

const ParagraphWidthContainer = styled.div`
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
`;

const IconListWidthContainer = styled.div`
  margin: 0 auto 3rem auto;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-row-gap: 7.5vh;
    grid-template-columns: 1fr 4fr;
    width: 100%;
    margin: 7.5vh auto;
  }
`;

const Text = styled.p`
  font-weight: 300;
  font-size: 18px;
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const Icon = styled.div`
  width: 40%;
  margin: 3rem auto 1rem auto;
  display: block;
  @media screen and (min-width: 768px) {
    width: 60%;
    margin: auto;
  }
`;

const Covid = () => {
  return (
    <Container>
      <WhiteContainer>
        <Heading bold align="center" margin="0 auto 7.5vh auto">
          TTW's COVID-19 Safety Measures
        </Heading>

        <ParagraphWidthContainer>
          <Text className="font-nunito">
            We are closely monitoring the Centers for Disease Control and
            Prevention and the World Health Organization’s statements regarding
            the novel coronavirus (COVID-19) cases and following guidelines from
            these agencies and the local health departments to make travel
            experiences possible on a world where this virus is a norm
          </Text>
          <Text className="font-nunito">
            <b style={{ fontWeight: "700" }}>
              To provide seamless travel experiences and feed your wanderlust,
              here are a few strategies we plan to implement for each experience
              that can be run in a world where social distancing becomes a
              regularly practiced norm:
            </b>
          </Text>
        </ParagraphWidthContainer>

        <IconListWidthContainer>
          <Icon>
            <ImageLoader
              dimensions={{ height: 300, width: 300 }}
              url={"media/icons/covid/protection.png"}
            />
          </Icon>
          <div>
            <Text className="font-nunito">
              <b style={{ fontWeight: "700" }}>Essentials are here to stay</b>
            </Text>
            <Text className="font-nunito">
              Masks and sanitizers will be with each attending person at all
              times to make sure the virus does not spread. It is also mandatory
              for each traveler to wear a mask when outside.
            </Text>
          </div>
          <Icon>
            <ImageLoader
              dimensions={{ height: 300, width: 300 }}
              url={"media/icons/covid/avoid.png"}
            />
          </Icon>
          <div>
            <Text className="font-nunito">
              <b style={{ fontWeight: "700" }}>
                Touchless or Digital Experience
              </b>
            </Text>
            <Text className="font-nunito">
              The first step towards social distancing is no-contact experience.
              We are implementing a software for our partners to initiate online
              check-in at accommodations, ordering food, or ordering room
              service, for other basic necessities.
            </Text>
          </div>
          <Icon>
            <ImageLoader
              dimensions={{ height: 300, width: 300 }}
              url={"media/icons/covid/calendar.png"}
            />
          </Icon>
          <div>
            <Text className="font-nunito">
              <b style={{ fontWeight: "700" }}>Slot Bookings for experiences</b>
            </Text>
            <Text className="font-nunito">
              To avoid crowds and crowded places, we have made sure to implement
              the concept of slot bookings where each traveler is given a slot
              by our partners for specific activities and places of interest to
              make sure the safe distance of 6 feet from each other.
            </Text>
          </div>
          <Icon>
            <ImageLoader
              dimensions={{ height: 300, width: 300 }}
              url={"media/icons/covid/laboratory.png"}
            />
          </Icon>
          <div>
            <Text className="font-nunito">
              <b style={{ fontWeight: "700" }}>RT-PCR Coronavirus Test</b>
            </Text>
            <Text className="font-nunito">
              International travelers will have to take a mandatory RT-PCR
              COVID-19 test before the commencement of their experience. We are
              in talks with different path labs to help travelers have
              themselves tested for safe travel experiences.
            </Text>
          </div>
          <Icon>
            <ImageLoader
              dimensions={{ height: 300, width: 300 }}
              url={"media/icons/covid/map.png"}
            />
          </Icon>
          <div>
            <Text className="font-nunito">
              <b style={{ fontWeight: "700" }}>Unique Travel Destinations</b>
            </Text>
            <Text className="font-nunito">
              There are many unexplored destinations all over India that have
              been untouched by this novel virus. We have already tied up with
              local communities at such unique locations that are green zones
              and have not seen even one case.
            </Text>
          </div>
          <Icon>
            <ImageLoader
              dimensions={{ height: 300, width: 300 }}
              url={"media/icons/covid/camping.png"}
            />
          </Icon>
          <div>
            <Text className="font-nunito">
              <b style={{ fontWeight: "700" }}>
                Travel in Caravans or Motorhomes
              </b>
            </Text>
            <Text className="font-nunito">
              A Caravan is a luxurious vehicle with a kitchen, chairs that
              double up as beds, bathrooms, and the ability to go anywhere and
              all at an affordable price. Imagine having no contact with the
              outside world and yet traveling, Caravan has made this possible.
            </Text>
          </div>
        </IconListWidthContainer>

        <ParagraphWidthContainer>
          <Text className="font-nunito">
            The well being of our travelers is of utmost importance to us and
            are making sure that we are taking every precaution to offer a
            seamless yet secure travel excursion.
          </Text>
          <Text className="font-nunito">
            In a world where social distancing is a norm and the Coronavirus is
            just another disease that we have to live with, the way we see
            travel is going to change. It will not be about the destination
            anymore but the journey to get there and spend time at a new place.{" "}
          </Text>
          <Text className="font-nunito">
            ​ Our team is making constant efforts for a safe experience and
            monitoring the rules and regulations by the{" "}
            <a
              style={{ textDecoration: "underline" }}
              href="https://www.mohfw.gov.in/"
            >
              Ministry of Health and Family Welfare, Government of India
            </a>
            , and the{" "}
            <a
              style={{ textDecoration: "underline" }}
              href="https://www.cdc.gov/coronavirus/2019-ncov/travelers/index.html"
            >
              Centers for Disease Control
            </a>{" "}
            and Prevention (CDC) to make travel possible.{" "}
          </Text>
        </ParagraphWidthContainer>
      </WhiteContainer>
    </Container>
  );
};

export default Covid;
