import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const HowItWorksHeading = styled.p`
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  @media screen and (min-width: 768px) {
    font-size: 18px;
    margin: 2rem 0 0.5rem 0;
  }
`;

const HowItWorksText = styled.p`
font-size: 15px;
 width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 15px
  font-weight: 300;
  margin: 0 0;

}
`;

const Banner = (props) => {
  const HowitWorksHeadingsArr = [
    <HowItWorksHeading className="">
      Handpick Your Selection
    </HowItWorksHeading>,
    <HowItWorksHeading className="">
      Unleash AI's Itinerary Wizardry!
    </HowItWorksHeading>,
    <HowItWorksHeading className="">
      Easy Bookings with 24x7 Concierge
    </HowItWorksHeading>,
    <HowItWorksHeading className="">
      No Commissions - Pay for what you get
    </HowItWorksHeading>,
  ];

  const HowitWorksContentsArr = [
    <HowItWorksText className="">
      From solo travel to workcation, honeymoon to family travel, tell us about
      your mood, budget & timeline.
    </HowItWorksText>,
    <HowItWorksText className="">
      Get a unique itinerary completely personalized for you, with all bookings
      in one place.
    </HowItWorksText>,
    <HowItWorksText className="">
      From your stays to activities, book-it-all in one click, and enjoy 24x7
      assistance while you explore.
    </HowItWorksText>,
    <HowItWorksText className="">
      No hidden charges during & after bookings. Pay For What You Get.
    </HowItWorksText>,
  ];

  const howitworksimgs = [
    "media/website/whyus-1.webp",
    "media/website/whyus-2.webp",
    "media/website/whyus-3.webp",
    "media/website/how4.png",
  ];

  return (
    <Container>
      <div className="">
        <HowItWorks
          nostart
          images={howitworksimgs}
          content={HowitWorksContentsArr}
          headings={HowitWorksHeadingsArr}
        ></HowItWorks>
      </div>
    </Container>
  );
};

export default Banner;
