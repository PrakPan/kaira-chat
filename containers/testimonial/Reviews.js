import React from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import media from "../../components/media";
import SwiperCarousel from "../../components/SwiperCarousel";
import travellerReviews from "../../data/travellerReviews";

const Heading = styled.p`
    font-size: 1.5rem
    padding: 1rem 0;
    text-align: center;
    font-weight: 600;
    @media screen and (min-width: 768px){
        padding: 1rem;
        font-weight: 600;
    }
`;


const ReviewContainer = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    padding: 0 1.5rem 1.5rem 1.5rem;
    display: grid;
    grid-gap: 1.5rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ReviewColumnContainer = styled.div`
  margin: 2rem 0rem 2rem 0rem;
  @media screen and (min-width: 768px) {
    padding: 0rem;
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    padding: 2rem 0rem 0rem 0rem;
  }
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  grid-gap: 1.5rem;
`;

const ReviewGridContainer = styled.div`
  width: 80%;
  margin: 1.5rem auto 0 auto;
  @media screen and (min-width: 768px) {
    margin: 0 auto 0 auto;
    width: 40%;
    padding-bottom: 3rem;
  }
`;

const ReviewLogo = styled.img`
  width: 80%;
  margin: auto;
  display: block;
  @media screen and (min-width: 768px) {
    width: 40%;
  }
`;

const TestimonialReviews = () => {
  let isPageWide = media("(min-width: 768px)");

  const reviews = travellerReviews;
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  let FlickityCards = [];
  for (var i = 0; i < reviews.length; i++) {
    FlickityCards.push(
      <ReviewCard
        text={reviews[i].summary}
        review={reviews[i].review}
        name={reviews[i].name}
        location={reviews[i].location}
        url={reviews[i]?.sourceImage ? `${reviews[i].sourceImage}` : reviews[i].image}
        imgUrlEndPoint={reviews[i]?.sourceImage ? true : ''}
      ></ReviewCard>
    );
  }

  if (isPageWide) {
    if (!isPageWide)
      return (
        <div style={{ background: "#F7e700", padding: "1rem 0" }}>
          <div className="center-div">
            <Heading className="" margin="0" padding="0">
              Stories from around the world
            </Heading>
          </div>
        </div>
      );
    else
      return (
        <div style={{ background: "#F7e700" }}>
          <ReviewContainer>
            {/* <ReviewColumnContainer style={{ padding: "0 0 2rem 0 !important" }}>
              <ReviewCard
                text={reviews[0].summary}
                review={reviews[0].review}
                name={reviews[0].name}
                location={reviews[0].location}
                url={reviews[0].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[1].summary}
                review={reviews[1].review}
                name={reviews[1].name}
                location={reviews[1].location}
                url={reviews[1].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[2].summary}
                review={reviews[2].review}
                name={reviews[2].name}
                location={reviews[2].location}
                url={reviews[2].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[3].summary}
                review={reviews[3].review}
                name={reviews[3].name}
                location={reviews[3].location}
                url={reviews[3].image}
              ></ReviewCard>
            </ReviewColumnContainer>
            <ReviewColumnContainer>
              <ReviewCard
                text={reviews[4].summary}
                review={reviews[4].review}
                name={reviews[4].name}
                location={reviews[4].location}
                url={reviews[4].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[5].summary}
                review={reviews[5].review}
                name={reviews[5].name}
                location={reviews[5].location}
                url={reviews[5].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[6].summary}
                review={reviews[6].review}
                name={reviews[6].name}
                location={reviews[6].location}
                url={reviews[6].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[7].summary}
                review={reviews[7].review}
                name={reviews[7].name}
                location={reviews[7].location}
                url={reviews[7].image}
              ></ReviewCard>
            </ReviewColumnContainer>
            <ReviewColumnContainer>
              <ReviewCard
                text={reviews[8].summary}
                review={reviews[8].review}
                name={reviews[8].name}
                url={reviews[8].image}
                location={reviews[8].location}
              ></ReviewCard>
              <ReviewCard
                text={reviews[9].summary}
                review={reviews[9].review}
                name={reviews[9].name}
                location={reviews[9].location}
                url={reviews[9].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[10].summary}
                review={reviews[10].review}
                name={reviews[10].name}
                location={reviews[10].location}
                url={reviews[10].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[0].summary}
                review={reviews[0].review}
                name={reviews[0].name}
                location={reviews[0].location}
                url={reviews[0].image}
              ></ReviewCard>
            </ReviewColumnContainer> */}
            {/* <div className="grid grid-cols-3 gap-6"> */}
            {[0, 1, 2].map((col) => (
              <ReviewColumnContainer key={col}>
                {reviews.filter((_, i) => i % 3 === col).map((item) => (<>
                  <ReviewCard
                    key={item.id}
                    text={item.summary}
                    review={item.review}
                    name={item.name}
                    location={item.location}
                    url={item?.sourceImage ? `${item.sourceImage}` : item.image}
                    imgUrlEndPoint={item?.sourceImage ? true : ''}
                  />
                </>
                ))}
              </ReviewColumnContainer>
            ))}
            {/* </div> */}


          </ReviewContainer>
          <ReviewGridContainer>
            <div
              className="center-div"
              style={{ flexDirection: "row", marginBottom: "0.5rem" }}
            >
              <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} /> &nbsp; &nbsp;
              <a target="blank" href="https://www.google.com/search?sca_esv=a28496639b382774&rlz=1C5CHFA_enIN1049IN1049&sxsrf=AE3TifNgnS5_NLsFc0vqOOkgMvMgve-KSg:1766565214525&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E6TeLrRiOOBypGL7MjsjPJ6isQgeCtaAv26Gfml7YliEn1nTckYdmPP6fPyfCXd0FidlZuXO9io52AkUNNIhBCxuFBop&q=The+Tarzan+Way+Reviews&sa=X&ved=2ahUKEwiki9ag6NWRAxVvUGwGHaZYLUUQ0bkNegQILxAE&biw=1710&bih=893&dpr=2"
                className="text-blue" style={{ margin: "0" }}>
                Read more
              </a>
              &nbsp; &nbsp;
              <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} />
            </div>
            <ReviewLogo
              src={
                "https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlereviews.png"
              }
            ></ReviewLogo>
          </ReviewGridContainer>
        </div>
      );
  } else
    return (
      <div style={{ background: "#F7e700", padding: "1rem 0 1.5rem 0" }}>
        <SwiperCarousel
          slidesPerView={1.3}
          initialSlide={1}
          centeredSlides
          cards={FlickityCards}
        ></SwiperCarousel>
        <ReviewGridContainer>
          <div
            className="center-div"
            style={{ flexDirection: "row", marginBottom: "0.5rem" }}
          >
            <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} />
            <Heading
              className=""
              style={{ margin: "0 0.5rem 0 0.5rem" }}
            >
              {" "}
              Read more{" "}
            </Heading>
            <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} />
          </div>
          <ReviewLogo
            src={
              "https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlereviews.png"
            }
          ></ReviewLogo>
        </ReviewGridContainer>
      </div>
    );
};

export default TestimonialReviews;
