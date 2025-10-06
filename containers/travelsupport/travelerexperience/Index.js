import React from "react";
import styled from "styled-components";
import Button from "../../../components/ui/button/Index";
import ImageLoader from "../../../components/ImageLoader";
import media from "../../../components/media";
import { ImQuotesLeft } from "react-icons/im";
import { useRouter } from "next/router";
import SwiperCarousel from "../../../components/SwiperCarousel";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
    padding: 2rem;
  }
`;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
  @media screen and (min-width: 768px) {
    padding: 2.5rem 0rem 0rem 0rem;
  }
`;

const ReviewContainer = styled.div`
  margin: 2rem 0;
`;

const PlanDetails = styled.p`
  font-size: 0.8rem;
  font-weight: 100;
  @media screen and (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ImageHeading = styled.h1`
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Text = styled.p`
  font-size: 0.8rem;
  font-weight: 100;
  font-style: italic;
  @media screen and (min-width: 768px) {
    font-size: 1rem;
  }
`;

const QuoteContainer = styled.div`
  text-align: left;
  line-height: 1;
`;

const MobileCardContainer = styled.div`
  background-color: hsl(0, 0%, 97%);
  border-radius: 5px;
`;

const PartnerWith = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  let mobile_cards_generared = [];

  const _handleItineraryRedirect = (itinerary_id) => {
    router.push("/itinerary/" + itinerary_id);
  };

  for (var i = 0; i < props.content.length; i++) {
    mobile_cards_generared.push(
      <MobileCardContainer>
        <Card>
          <ImageLoader
            dimensions={{ width: props.width, height: props.height }}
            url={props.content[i].image}
          />
        </Card>

        <Card className="center-div" style={{ padding: "1rem" }}>
          <div>
            <ImageHeading className="">
              {props.content[i].name}
            </ImageHeading>
            <QuoteContainer>
              <ImQuotesLeft style={{ marginBottom: "0.5rem" }} />
            </QuoteContainer>
            <Text className="">{props.content[i].review}</Text>
            <PlanDetails className="font-nunito">
              {props.content[i].text}
            </PlanDetails>

            <Button
              boxShadow
              borderWidth="0"
              bgColor="#f7e700"
              color="black"
              hoverBgColor={"black"}
              hoverColor="white"
              onclick={_handleItineraryRedirect}
              onclickparam={props.content[i].itinerary_id}
              padding="0.25rem 1rem"
              display={"inline"}
              borderRadius={"2rem"}
            >
              View Itinerary
            </Button>
          </div>
        </Card>
      </MobileCardContainer>
    );
  }

  if (isPageWide)
    return (
      <Container>
        <Card>
          <ImageLoader
            dimensions={{ width: props.width, height: props.height }}
            url={props.content[1].image}
          />
        </Card>

        <Card className="center-div">
          <div>
            <ImageHeading className="">
              {props.content[1].name}
            </ImageHeading>

            <ReviewContainer>
              <QuoteContainer>
                <ImQuotesLeft style={{ marginBottom: "0.5rem" }} />
              </QuoteContainer>
              <Text className="">{props.content[1].review}</Text>
            </ReviewContainer>

            <PlanDetails className="font-nunito">
              {props.content[1].text}
            </PlanDetails>

            <Button
              boxShadow
              bgColor="#f7e700"
              color="black"
              borderWidth="0px"
              onclick={_handleItineraryRedirect}
              onclickparam={props.content[1].itinerary_id}
              padding="0.25rem 1rem"
              display={"inline"}
              borderRadius={"2rem"}
              hoverBgColor={"black"}
              hoverColor="white"
            >
              View Itinerary
            </Button>
          </div>
        </Card>

        <Card className="center-div">
          <div>
            <ImageHeading className="">
              {props.content[0].name}
            </ImageHeading>
            <ReviewContainer>
              <QuoteContainer>
                <ImQuotesLeft style={{ marginBottom: "0.5rem" }} />
              </QuoteContainer>
              <Text className="">{props.content[0].review}</Text>
            </ReviewContainer>
            <PlanDetails className="font-nunito">
              {props.content[0].text}
            </PlanDetails>

            <Button
              boxShadow
              bgColor="#f7e700"
              color="black"
              borderWidth="0px"
              hoverBgColor={"black"}
              hoverColor="white"
              onclick={_handleItineraryRedirect}
              onclickparam={props.content[0].itinerary_id}
              padding="0.25rem 1rem"
              display={"inline"}
              borderRadius={"2rem"}
            >
              View Itinerary
            </Button>
          </div>
        </Card>

        <Card>
          <ImageLoader
            dimensions={{ width: props.width, height: props.height }}
            url={props.content[0].image}
          />
        </Card>

        <Card>
          <ImageLoader
            dimensions={{ width: props.width, height: props.height }}
            url={props.content[2].image}
          />
        </Card>

        <Card className="center-div">
          <div>
            <ImageHeading className="">
              {props.content[2].name}
            </ImageHeading>
            <ReviewContainer>
              <QuoteContainer>
                <ImQuotesLeft style={{ marginBottom: "0.5rem" }} />
              </QuoteContainer>
              <Text className="">{props.content[2].review}</Text>
            </ReviewContainer>
            <PlanDetails className="font-nunito">
              {props.content[2].text}
            </PlanDetails>

            <Button
              boxShadow
              bgColor="#f7e700"
              color="black"
              borderWidth="0px"
              hoverBgColor={"black"}
              hoverColor="white"
              onclick={_handleItineraryRedirect}
              onclickparam={props.content[2].itinerary_id}
              padding="0.25rem 1rem"
              display={"inline"}
              borderRadius={"2rem"}
            >
              View Itinerary
            </Button>
          </div>
        </Card>

        <Card className="center-div">
          <div>
            <ImageHeading className="">
              {props.content[3].name}
            </ImageHeading>
            <ReviewContainer>
              <QuoteContainer>
                <ImQuotesLeft style={{ marginBottom: "0.5rem" }} />
              </QuoteContainer>
              <Text className="">{props.content[3].review}</Text>
            </ReviewContainer>
            <PlanDetails className="font-nunito">
              {props.content[3].text}
            </PlanDetails>

            <Button
              boxShadow
              bgColor="#f7e700"
              color="black"
              borderWidth="0px"
              hoverBgColor={"black"}
              hoverColor="white"
              onclick={_handleItineraryRedirect}
              onclickparam={props.content[3].itinerary_id}
              padding="0.25rem 1rem"
              display={"inline"}
              borderRadius={"2rem"}
            >
              View Itinerary
            </Button>
          </div>
        </Card>

        <Card>
          <ImageLoader
            dimensions={{ width: props.width, height: props.height }}
            url={props.content[3].image}
          />
        </Card>
      </Container>
    );
  else
    return (
      <SwiperCarousel
        slidesPerView={1.3}
        initialSlide={1}
        centeredSlides
        cards={mobile_cards_generared}
      ></SwiperCarousel>
    );
};

export default PartnerWith;
