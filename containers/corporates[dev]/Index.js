import React, { useState } from "react";
import styled from "styled-components";
import FullImg from "../../components/FullImage";
import FullImgContent from "./FullImgContent";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
import media from "../../components/media";
import travelsupportcontent from "../../public/content/travelsupport";
import Logos from "./Logos";
import Enquiry, { ScheduleCallModal } from "./enquiry/Index";
import BannerMobile from "./banner/Mobile";
import WhatWeOffer from "./WhatWeOffer";
import WhyChooseUs from "./WhyChooseUs";
import OurCustomers from "./OurCustomers";
import Faqs from "./Faqs";
import Activities from "./Activities";
import Locations from "./Locations";
import DesktopBanner from "./banner/DesktopBanner";
import SecondaryHeading from "../../components/heading/Secondary";

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
              <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                Destinations in India for Corporate Getaways
              </div>
              <SecondaryHeading className="text-center">
                Corporate Getaways are essential for building relationships and
                closing deals. Nothing compares to the impact of face-to-face
                interaction and a handshake. It’s key to developing partnerships
                and achieving a range of business objectives.
              </SecondaryHeading>
            </div>

            <Locations
              locations={props.locations}
              page={"Corporates Page"}
              setEnquiryOpen={setEnquiryOpen}
              viewall
            ></Locations>
          </div>
        ) : null}

        {props.corporate_gateways_activities.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                  Corporate Getaways
                </div>
                <SecondaryHeading className="text-center">
                  Escape the office and rejuvenate with inspiring retreats
                  designed to recharge teams and fuel fresh ideas in scenic,
                  peaceful locations.
                </SecondaryHeading>
              </div>

              <Activities
                activities={props.corporate_gateways_activities}
                setEnquiryOpen={setEnquiryOpen}
              />
            </div>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all"
            >
              Schedule a Callback Now!
            </button>
          </div>
        ) : (
          <></>
        )}

        {props.in_office_activities.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                  In Office Activations
                </div>
                <SecondaryHeading className="text-center">
                  Bring the excitement to your workspace with dynamic activities
                  that foster creativity, engagement, and team bonding, right
                  within your office walls.
                </SecondaryHeading>
              </div>

              <Activities
                activities={props.in_office_activities}
                setEnquiryOpen={setEnquiryOpen}
              />
            </div>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all"
            >
              Schedule a Callback Now!
            </button>
          </div>
        ) : (
          <></>
        )}

        {props.team_outing_activities.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                  Team Outing Activities
                </div>
                <SecondaryHeading className="text-center">
                  Strengthen bonds and inspire camaraderie with outdoor
                  adventures and customized activities that make teamwork fun
                  and unforgettable.
                </SecondaryHeading>
              </div>

              <Activities
                setEnquiryOpen={setEnquiryOpen}
                activities={props.team_outing_activities}
              />
            </div>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all"
            >
              Schedule a Callback Now!
            </button>
          </div>
        ) : (
          <></>
        )}

        {props.conference_activities.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                  Conferences
                </div>
                <SecondaryHeading className="text-center">
                  Elevate your corporate events with seamless planning and
                  exceptional facilities for conferences that are as engaging as
                  they are productive.
                </SecondaryHeading>
              </div>

              <Activities
                setEnquiryOpen={setEnquiryOpen}
                activities={props.conference_activities}
              />
            </div>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all"
            >
              Schedule a Callback Now!
            </button>
          </div>
        ) : (
          <></>
        )}

        {props.weekend_excursions_activities.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                  Weekend Excursions
                </div>
                <SecondaryHeading className="text-center">
                  Step away from the daily routine with weekend escapes that
                  blend relaxation, adventure, and team connection in unique
                  destinations.
                </SecondaryHeading>
              </div>

              <Activities
                setEnquiryOpen={setEnquiryOpen}
                activities={props.weekend_excursions_activities}
              />
            </div>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all"
            >
              Schedule a Callback Now!
            </button>
          </div>
        ) : (
          <></>
        )}

        {props.add_on_activities.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <div className="flex flex-col pb-5 pl-3 pr-3 md:p-5 gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
                  Add On Activities
                </div>
                <SecondaryHeading className="text-center">
                  Enhance your event experience with curated add-ons, from
                  wellness sessions to team-building games, tailored to enrich
                  and energize your group.
                </SecondaryHeading>
              </div>

              <Activities
                setEnquiryOpen={setEnquiryOpen}
                activities={props.add_on_activities}
              />
            </div>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all"
            >
              Schedule a Callback Now!
            </button>
          </div>
        ) : (
          <></>
        )}

        <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px] text-center mt-[100px] mb-4">
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

      <ScheduleCallModal
        show={enquiryOpen}
        onhide={() => setEnquiryOpen(false)}
      ></ScheduleCallModal>

      {isPageWide ? (
        <DesktopBanner onclick={() => setEnquiryOpen(true)} />
      ) : (
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
