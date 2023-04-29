import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
const Container = styled.div`
  padding: 10px 0px 20px 0px;
  @media screen and (min-width: 768px) {
  }
`;

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: ${(props) => (props.image ? '1fr 2fr' : '1fr')};
  grid-column-gap: 0.5rem;
`;
const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
`;
const Heading = styled.p`
  margin-bottom: 0.35rem;
  font-weight: 600;
  line-height: 1;
`;
const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;
const ItineraryElementM = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="font-lexend">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <SectionOneText>{props.time}</SectionOneText> */}
        {/* <AiFillCar
          style={{ margin: '-2px 0  0 0.5rem' }}
          className="text-2xl"
        ></AiFillCar> */}
        {props.bookings ? (
          <div
            style={{
              flexGrow: '1',
              justifyContent: 'flex-start',
              display: 'flex',
            }}
          >
            <Button
              borderRadius="8px"
              fontWeight="730"
              fontSize="15px"
              borderWidth="2px"
              padding="0.2rem 0.5rem"
              onclick={() => console.log('')}
            >
              View Booking
            </Button>
          </div>
        ) : null}
      </div>
      <div>
        <div className="flex flex-row">
          {props.icon ? (
            <div className="mr-4">
              <ImageLoader
                dimensions={{ width: 90, height: 90 }}
                dimensionsMobile={{ width: 90, height: 90 }}
                borderRadius="8px"
                hoverpointer
                onclick={() => console.log('')}
                width="22px"
                leftalign
                widthmobile="40px"
                url={props.icon}
              ></ImageLoader>
            </div>
          ) : null}
          <Heading>{props.heading}</Heading>
        </div>

        <div>
          <Text>{props.text ? props.text : null}</Text>
        </div>
      </div>

      <Line></Line>
    </Container>
  );
};

export default ItineraryElementM;
