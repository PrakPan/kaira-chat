import React from "react";
import styled from "styled-components";
import TravelerExperience from "./travelerexperience/Index";
import KeyBenefits from "../../components/containers/WhyUs";
import FullImg from "../../components/FullImage";
import Heading from "../../components/newheading/heading/Index";
import FullImgContent from "./FullImgContent";
import HowItWorks from "./Howitworks";
import media from "../../components/media";
import AsSeenIn from "../testimonial/AsSeenIn";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Locations from "../../components/containers/Locations";
import travelsupportcontent from "../../public/content/travelsupport";
import DesktopBanner from "../../components/containers/Banner";
import Banner from "../homepage/banner/Mobile";
import { useRouter } from "next/router";
import usePageLoaded from "../../components/custom hooks/usePageLoaded";
import PartnersSection from "../../components/theme/PartnersSection";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
`;

const AffiliatePage = () => {
  const router = useRouter();
  const isPageLoaded = usePageLoaded();
  let isPageWide = media("(min-width: 768px)");

  const HowitWorksHeadingsArr = [
    "You select",
    "We prepare",
    "You make memories",
  ];

  const HowitWorksContentsArr = [
    "A short trek, a long honeymoon, a workcation, or personalize your own",
    "A completely personalized plan by our travel experts and software",
    "Enough planning, time to travel and make unforgettable memories",
  ];

  const howitworksimgs = [
    "media/website/travelsupport-1.png",
    "media/website/travelsupport-2.png",
    "media/website/travelsupport-3.png",
  ];

  return (
    <div>
      <FullImg
        url="media/website/johannes-plenio-qkfxBc2NQ18-unsplash.jpeg"
        center={isPageWide ? false : true}
      >
        {isPageLoaded ? (
          <FullImgContent
            heading={travelsupportcontent["heading"]}
            subheading={travelsupportcontent["subheading"]}
          ></FullImgContent>
        ) : null}
      </FullImg>

      <SetWidthContainer>
        <Heading
          align="center"
          aligndesktop="center"
          margin={!isPageWide ? "2.5rem 0.5rem" : "4rem"}
          thincaps
        >
          HOW IT WORKS?
        </Heading>

        <HowItWorks
          images={howitworksimgs}
          content={HowitWorksContentsArr}
          headings={HowitWorksHeadingsArr}
        ></HowItWorks>

        <Heading bold margin="2.5rem auto" align="center">
          How our community travels
        </Heading>

        <TravelerExperience
          width={1200}
          height={900}
          content={travelsupportcontent.travellerexperience}
        />

        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem auto"}
          bold
        >
          Locations for you
        </Heading>

        <Locations
          locations={travelsupportcontent["Top Locations"]}
          viewall
        ></Locations>

        <Heading margin="5rem auto" align="center" bold>
          Key Benefits
        </Heading>

        <KeyBenefits width={1200} height={900} />

        {/* <Heading margin="3.5rem auto" align="center" bold>
          What they say?
        </Heading> */}

        {/* <AsSeenIn></AsSeenIn> */}
        <PartnersSection />
        <ChatWithUs link="/contact"></ChatWithUs>
      </SetWidthContainer>

      <div className="hidden-desktop">
        <Banner
          link="tailored-travel"
          text="Want to craft your own travel experience?"
          buttontext="Start Now"
          color="black"
          buttonbgcolor="#f7e700"
        ></Banner>
      </div>

      <DesktopBanner
        onclick={() => openTailoredModal(router)}
        text="Want to personalize your own experience?"
      ></DesktopBanner>
    </div>
  );
};

export default AffiliatePage;
