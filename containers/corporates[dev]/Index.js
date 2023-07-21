import React, {useState} from 'react';
import styled from 'styled-components';
 
import FullImg from '../../components/FullImage';
import Heading from '../../components/newheading/heading/Index';
import FullImgContent from './FullImgContent';
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
 
import media from '../../components/media';
  import travelsupportcontent from '../../public/content/travelsupport';
import Logos from './Logos';
import Benefits from './Benefits';
 import CaseStudies from './CaseStudies/Index';
import Enquiry from './enquiry/Index';
import NewCaseStudies from './NewCaseStudies/Index';
import BannerMobile from './banner/Mobile';
import Experiences from '../../components/containers/Experiences';

 
const SetWidthContainer = styled.div`
    width: 100%;
    margin: auto;
    @media screen and (min-width: 768px){
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

  text-align : left;
  }
  `;
const HowitWorksHeadingsArr = [
  <HowItWorksHeading className="font-lexend">
    Leisure Travel
    {/* : Team building company retreats */}
  </HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">
    Booking Needs
    {/* : Employee business travel needs */}
  </HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">
    Support & Conferences
    {/* : Company travel excursions and conferences */}
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
const AffiliatePage = (props)=> {
  console.log('props: ', props);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  let isPageWide = media('(min-width: 768px)');

 
  return (
    <>
      <FullImg
        // style={isPageWide ? {} : { height: "30rem" }}
        heightmobile={"30rem"}
        height={"37rem"}
        filter={"brightness(0.7)"}
        zIndex={-1}
        center={isPageWide ? false : true}
        // url="media/website/duy-pham-Cecb0_8Hx-o-unsplash-min.jpeg"
        url={
          isPageWide
            ? "media/page/helena-lopes-UZe35tk5UoA-unsplash.jpg"
            : "media/page/corporates-mobile.jpg"
        }
      >
        <FullImgContent
          setEnquiryOpen={() => setEnquiryOpen(true)}
          subheading={travelsupportcontent["subheading"]}
        ></FullImgContent>
      </FullImg>
      <SetWidthContainer>
        <Logos></Logos>
        <Heading
          noline
          textAlign="left"
          fontSize={isPageWide ? "32px" : "24px"}
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}
          bold
        >
          Catered to every organisation's need
        </Heading>
        {/* <Benefits></Benefits> */}
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

        {props.workcation_experience.length ? (
          <>
            <Heading
              noline
              textAlign="left"
              fontSize={isPageWide ? "32px" : "24px"}
              align="center"
              aligndesktop="left"
              margin={
                !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
              }
              bold
            >
              Workcation Itineraries for Corporates
            </Heading>
            <Experiences
              // mobileGrid
              experiences={props.workcation_experience}
            ></Experiences>
          </>
        ) : (
          <></>
        )}

        {props.offbeat_experiences.length ? (
          <>
            <Heading
              noline
              textAlign="left"
              fontSize={isPageWide ? "32px" : "24px"}
              align="center"
              aligndesktop="left"
              margin={
                !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
              }
              bold
            >
              Offbeat getaways
            </Heading>
            <Experiences
              // mobileGrid
              experiences={props.offbeat_experiences}
            ></Experiences>
          </>
        ) : (
          <></>
        )}

        <Heading
          noline
          textAlign="left"
          fontSize={isPageWide ? "32px" : "24px"}
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}
          bold
        >
          Happy Community of The Tarzan Way
        </Heading>
        {/* <CaseStudies></CaseStudies> */}
        <NewCaseStudies setEnquiryOpen={() => setEnquiryOpen(true)} />
        {/* <WhyUs></WhyUs> */}
        {/* <HowItWorks images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks> */}
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
}

export default AffiliatePage;
