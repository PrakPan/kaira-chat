import React from 'react';
import Row from '../../components/experiencecity/info/Row';

import InformationTextContainer from '../../components/experiencecity/info/InformationTextContainer';
import RouteData from './Locations';

import InclusionsData from './Inclusions';

import styled from 'styled-components';
import Faqs from '../../components/experiencecity/info/faqs/Index';
import Banner from './Banner/Index';
import Howtoreach from '../../components/experiencecity/info/Howtoreach';
import media from '../../components/media';
import Footer from '../../components/footer/Index';
import DesktopPersonaliseBanner from '../../components/containers/Banner';

const DetailsContainer = styled.div`
  width: 100%;
  margin: 0 auto 10vh auto;
  padding: 0 1rem;
  background-color: white;
  @media screen and (min-width: 768px) {
    width: 80%;
    padding: 0;
    margin: 0 auto 10vh auto;
  }
`;

const Details = (props) => {
  let isPageWide = media('(min-width: 768px)');
  console.log(
    'Details................................................' +
      json.stringfy(props.data)
  );
  return (
    <div style={{ color: 'black' }}>
      <DetailsContainer>
        <div>
          <div id="overview">
            <Row class="experience-headings" heading="Overview">
              <InformationTextContainer
                type="text"
                text={props.data.overview}
              ></InformationTextContainer>
            </Row>
          </div>
        </div>
        <div>
          {props.data.locations ? (
            props.data.locations.length ? (
              <div id="route">
                <Row
                  class="experience-headings"
                  heading={
                    props.data.locations.length > 1 ? 'Route' : 'Location'
                  }
                >
                  <RouteData route={props.data.locations}></RouteData>
                </Row>
              </div>
            ) : null
          ) : null}
        </div>
        <div>
          <div id="howtoreach">
            <Row class="experience-headings" heading="How to reach">
              <Howtoreach
                text={props.data.how_to_reach.text}
                air={props.data.how_to_reach.by_air}
                train={props.data.how_to_reach.by_train}
                public={props.data.how_to_reach.by_public_transport}
                road={props.data.how_to_reach.by_road}
              ></Howtoreach>
            </Row>
          </div>
        </div>

        <div>
          <div id="inclusions">
            <Row class="experience-headings" heading="What's included">
              <InclusionsData icons={props.data.inclusions}></InclusionsData>
            </Row>
          </div>
        </div>
        <div>
          <div id="exclusions">
            <Row class="experience-headings" heading="What's excluded">
              <InclusionsData icons={props.data.exclusions}></InclusionsData>
            </Row>
          </div>
        </div>

        <div>
          <div id="terms">
            {isPageWide ? (
              <Row class="experience-headings" heading="FAQs">
                <Faqs faqs={props.data.faqs}></Faqs>
              </Row>
            ) : (
              <Row class="experience-headings" heading="FAQ/s">
                <Faqs faqs={props.data.faqs}></Faqs>
              </Row>
            )}
          </div>
        </div>
      </DetailsContainer>
      <div className="hidden-desktop">
        <Banner
          openItinerary={props.openItinerary}
          color="black"
          buttonbgcolor="#F7e700"
          onclick={props.openBooking}
        ></Banner>
      </div>
      <div className="hidden-mobile">
        <DesktopPersonaliseBanner
          onclick={props.openItinerary}
          text="Check out detailed itinerary"
          cta="Click Here"
        ></DesktopPersonaliseBanner>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default React.memo(Details);
