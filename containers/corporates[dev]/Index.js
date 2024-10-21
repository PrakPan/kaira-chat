import React, { useState } from "react";
import styled from "styled-components";
import FullImg from "../../components/FullImage";
import FullImgContent from "./FullImgContent";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
import media from "../../components/media";
import travelsupportcontent from "../../public/content/travelsupport";
import Logos from "./Logos";
import Enquiry from "./enquiry/Index";
import BannerMobile from "./banner/Mobile";
import Experiences from "../../components/containers/Experiences";
import WhatWeOffer from "./WhatWeOffer";
import Locations from "../../components/containers/plannerlocations/Index";
import WhyChooseUs from "./WhyChooseUs";
import OurCustomers from "./OurCustomers";
import Faqs from "./Faqs";


const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
`;

const HowItWorksText = styled.div`
  font-size: 1rem;
  width: 100%;
  margin: 0 0;
  font-weight: 300;

  @media screen and (min-width: 768px) {
    font-size: 1rem;
    margin: 0 0;
    font-weight: 300;
  }
`;

const HowItWorksHeading = styled.p`
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
    margin: 1rem 0 0.5rem 0;
  }
`;

const HowItWorksContainer = styled.div`
  @media screen and (min-width: 768px) {
    margin: auto;
  }
`;

const CardListItem = styled.li`
  font-size: 0.9rem;
  font-weight: 300;
  margin-bottom: 0.9rem;
  line-height: 1.3;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const HowitWorksHeadingsArr = [
  <HowItWorksHeading className="font-lexend">Leisure Travel</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">Booking Needs</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">
    Support & Conferences
  </HowItWorksHeading>,
];

const HowitWorksContentsArr = [
  <HowItWorksText>
    <CardListItem>
      Workcation to travel, work, and collaborate with all your employees
    </CardListItem>
    <CardListItem>
      Weekend getaways for team building and exploring together
    </CardListItem>
    <CardListItem>
      Unique experiences to instill team bonding with activites
    </CardListItem>
  </HowItWorksText>,

  <HowItWorksText>
    <CardListItem>
      Book flights & hotels at cheap prices for employees
    </CardListItem>
    <CardListItem>
      Track your bookings & get a dedicated travel expert
    </CardListItem>
    <CardListItem>24/7 travel support and booking support</CardListItem>
  </HowItWorksText>,

  <HowItWorksText>
    <CardListItem>
      Townhall meetings with activities during the day
    </CardListItem>
    <CardListItem>
      Travel to an offsite location and meet with the team
    </CardListItem>
    <CardListItem>
      Work offsite for a weekend or week while exploring
    </CardListItem>
  </HowItWorksText>,
];

const AffiliatePage = (props) => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  let isPageWide = media("(min-width: 768px)");

  return (
    <>
      <FullImg
        heightmobile={"30rem"}
        height={"50rem"}
        filter={"brightness(0.7)"}
        zIndex={-1}
        center={isPageWide ? false : true}
        url={
          isPageWide
            ? "media/corporates/corporates-banner.jpeg"
            : "media/page/corporates-mobile.jpg"
        }
      >
        <FullImgContent
          setEnquiryOpen={() => setEnquiryOpen(true)}
          subheading={travelsupportcontent["subheading"]}
        ></FullImgContent>
      </FullImg>

      <Logos></Logos>

      <SetWidthContainer className="space-y-[100px]">
        <WhatWeOffer setEnquiryOpen={() => setEnquiryOpen(true)} />

        {props.locations && props.locations.length ? (
          <div className="mt-5">
            <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
              <div
                className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]"
              >
                Destinations in India for Corporate Getaways
              </div>
              <div className="text-[16px] font-[400] leading-[24px] text-center">Corporate Getaways are essential for building relationships and closing deals. Nothing compares to the impact of face-to-face interaction and a handshake. It’s key to developing partnerships and achieving a range of business objectives.</div>
            </div>

            <Locations
              locations={props.locations}
              page={"Corporates Page"}
              viewall
            ></Locations>
          </div>
        ) : null}

        {props.getaways_delhi_experiences.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div
                  className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]"
                >
                  Corporate Getaways from Delhi
                </div>
                <div className="text-[16px] font-[400] leading-[24px] text-center">Far from the busiest roads of the city, breathe in fresh air and relax in the lap of nature while staying productive. Discover a change that leaves you and your team feeling inspired and ready to achieve the next big goals.</div>
              </div>

              <Experiences
                experiences={props.getaways_delhi_experiences}
              ></Experiences>
            </div>

            <button onClick={() => setEnquiryOpen(true)} className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all">Schedule a Callback Now!</button>
          </div>
        ) : (
          <></>
        )}

        {props.workcation_experience.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div
                  className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]"
                >
                  Workcation Itineraries for Corporates
                </div>
                <div className="text-[16px] font-[400] leading-[24px] text-center">There’s more to Business travel than just meetings! Step out of the routine, build connections, meet clients on their turf, and experience the energy that only in-person interactions can bring.</div>
              </div>

              <Experiences
                experiences={props.workcation_experience}
              ></Experiences>
            </div>

            <button onClick={() => setEnquiryOpen(true)} className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all">Plan your Workcation Now!</button>
          </div>
        ) : (
          <></>
        )}

        {props.getaway_experiences.length ? (
          <div className="mt-5">
            <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
              <div
                className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]"
              >
                Corporate getaways
              </div>
              <div className="text-[16px] font-[400] leading-[24px] text-center">Business travel is essential for building relationships and closing deals. Nothing compares to the impact of face-to-face interaction and a handshake. It’s key to developing partnerships and achieving a range of business objectives.</div>
            </div>

            <Experiences experiences={props.getaway_experiences}></Experiences>
          </div>
        ) : (
          <></>
        )}

        {props.offbeat_experiences.length ? (
          <div className="mt-5">
            <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
              <div
                className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]"
              >
                Offbeat getaways
              </div>
              <div className="text-[16px] font-[400] leading-[24px] text-center">Business travel is essential for building relationships and closing deals. Nothing compares to the impact of face-to-face interaction and a handshake. It’s key to developing partnerships and achieving a range of business objectives.</div>
            </div>

            <Experiences experiences={props.offbeat_experiences}></Experiences>
          </div>
        ) : (
          <></>
        )}

        <div
          className="text-[27px] md:text-[40px] font-[700] md:leading-[60px] text-center mt-[100px] mb-4"
        >
          Catered to every organisation's need
        </div>
        <HowItWorksContainer>
          <HowItWorks
            nostart
            corporates
            images={[
              "media/icons/corporates/travel_vectorjuice.jpg",
              "media/icons/corporates/booking_vectorjuice.jpg",
              "media/icons/corporates/support_vectorjuice.jpg",
            ]}
            headings={HowitWorksHeadingsArr}
            content={HowitWorksContentsArr}
            dimensions={{ width: 700, height: 500 }}
            dimensionsMobile={{ width: 1200, height: 700 }}
          ></HowItWorks>
        </HowItWorksContainer>

        <WhyChooseUs />

        <OurCustomers />

        <Faqs />
      </SetWidthContainer>

      <br></br>

      <Enquiry
        show={enquiryOpen}
        onhide={() => setEnquiryOpen(false)}
      ></Enquiry>

      {!isPageWide && (
        <div>
          <BannerMobile
            onclick={() => setEnquiryOpen(true)}
            text="Want to craft your own travel experience?"
            buttontext="Start Now"
            color="black"
            buttonbgcolor="#f7e700"
          ></BannerMobile>
        </div>
      )}
    </>
  );
};

export default AffiliatePage;
