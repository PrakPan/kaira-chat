import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../../../components/ui/button/Index';
import Details from './Details';
import ImagesMobile from './ImagesMobile';
const Container = styled.div``;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  @media screen and (min-width: 768px) {
    margin-top: 0rem;
  }
`;
const Heading = styled.h1`
  font-size: 34px;
  font-weight: 600;
  line-height: 34px;
`;
const Line = styled.div`
  border: 1px solid #f0f0f0;
  width: 100vw;
  margin-left: -1rem;
  margin-bottom: 1rem;
  @media screen and (min-width: 768px) {
    visibility: hidden;
  }
`;
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
const Overview = (props) => {
  useEffect(() => {}, []);

  return (
    <Container>
      <GridContainer>
        <Heading className="font-lexend">{toTitleCase(props.title)}</Heading>
        {/* <div className="center-div">
          <div className="hidden-desktop">
            <Button
              borderRadius="6px"
              borderWidth="1.5px"
              onclick={() => console.log('')}
            >
              Trip Settings
            </Button>
          </div>
        </div> */}
      </GridContainer>
      <div>
        <Details
          group_type={props.group_type}
          duration_time={props.duration_time}
          travellerType={props.travellerType}
          start_date={props.start_date}
          end_date={props.end_date}
          duration={props.duration}
        ></Details>
        {/* <div
          className="border-b-[0.8px] border-slate-300 mt-2 -mx-5 block lg:hidden
        "
        ></div> */}
      </div>

      {/* <Line></Line> */}
      <div className="pt-3 pb-1">
        <ImagesMobile images={props.images}></ImagesMobile>
      </div>
    </Container>
  );
};

export default Overview;
