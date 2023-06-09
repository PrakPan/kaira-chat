import React from 'react';
import styled from 'styled-components';
import Slideshow from '../../../components/containers/HowItWorksSlideshow';
import Heading from '../../../components/newheading/heading/Index';
import media from '../../../components/media';
import classes from './Values.module.css';
import ImageLoader from '../../../components/ImageLoader';

const HowItWorksText = styled.p`
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

const HowitWorksHeadingsArr = [
  <HowItWorksHeading className="font-lexend">Innovate</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">Improve</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">Interact</HowItWorksHeading>,

];
 
const HowitWorksContentsArr = [
  <HowItWorksText className="font-lexend">
    We aim to create a highly intelligent and user-friendly platform that helps
    every traveler to understand, plan, and book a travel experience and
    interact with fellow travelers and guides.
  </HowItWorksText>,

  <HowItWorksText className="font-lexend">
    We aim to improve a traveler’s journey by giving them a one-stop solution
    for each of their travel needs with complete transparency of prices.
  </HowItWorksText>,

  <HowItWorksText className="font-lexend">
    We aim to interact and connect with every traveler and to build diverse
    experiences for everyone irrespective of their age, gender, financial
    conditions, or disabilities.
  </HowItWorksText>,
];
const Values=()=>{
    let isPageWide = media('(min-width: 768px)')
    if(isPageWide)
    return (
      <>
        <Heading
          aligndesktop="center"
          className="font-lexend text-center"
          align="center"
          bold
          margin="3.5rem"
        >
          Our Values
        </Heading>
        <div className={classes.Container}>
          <div className="text-center">
            <div className={classes.ImageHeadingContainer}>
              <div className={classes.CardHeadingContainerLeft}>
                <p className={classes.CardHeading}>Innovate</p>
              </div>
              <ImageLoader
                dimensions={{ height: 500, width: 500 }}
                url={"media/icons/values/Innovate.svg"}
              />
            </div>
            <div>
              <p className={classes.Text}>
                We aim to create a highly intelligent and user-friendly platform
                that helps every traveler to understand, plan, and book a travel
                experience and interact with fellow travelers and guides.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className={classes.ImageHeadingContainer}>
              <div className={classes.CardHeadingContainerRight}>
                <p className={classes.CardHeading}>Improve</p>
              </div>
              <ImageLoader
                dimensions={{ height: 500, width: 500 }}
                url={"media/icons/values/improve.svg"}
              />
            </div>
            <div>
              <p className={classes.Text}>
                We aim to improve a traveler’s journey by giving them a one-stop
                solution for each of their travel needs with complete
                transparency of prices.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className={classes.ImageHeadingContainer}>
              <div className={classes.CardHeadingContainerRight}>
                <p className={classes.CardHeading}>Interact</p>
              </div>
              <ImageLoader
                dimensions={{ height: 500, width: 500 }}
                url={"media/icons/values/interact.svg"}
              />
            </div>
            <div>
              <p className={classes.Text}>
                We aim to interact and connect with every traveler and to build
                diverse experiences for everyone irrespective of their age,
                gender, financial conditions, or disabilities.
              </p>
            </div>
          </div>
        </div>
      </>
    );
    else return (
      <div>
        <Heading
          className="font-lexend text-center"
          bold
          align="center"
          margin="1.5rem"
        >
          Our Values
        </Heading>
        <div style={{ padding: "1.5rem 0 0 0" }}>
          <HowItWorksContainer>
            <Slideshow
            //   vertical
              images={[
                "media/icons/values/Innovate.svg",
                "media/icons/values/improve.svg",
                "media/icons/values/interact.svg",
              ]}
              headings={HowitWorksHeadingsArr}
              content={HowitWorksContentsArr}
            ></Slideshow>
          </HowItWorksContainer>
        </div>
      </div>
    );

}

export default Values;