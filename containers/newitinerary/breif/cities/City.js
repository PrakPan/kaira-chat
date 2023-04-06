import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ImageLoader from '../../../../components/ImageLoader';
import TruncatedText from '../../../../helper/TruncatedText';
import WeatherWidget from '../../../../components/WeatherWidget/WeatherWidget';

const Container = styled.div``;
const Heading = styled.p`
  font-size: 23px;
  font-weight: 600;
  font-style: Helvetica;
  @media (min-width: 768px) 
 {
  font-size: 26px;
 }
`;
const CityText = styled.p`
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 0 8px;
  line-height: 24px;
  color: rgba(1, 32, 43, 1);
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  grid-gap: 0.5rem;
  margin-bottom: 0.75rem;
`;
const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;

const TextLight = styled.p`
  line-height: 24px;
  margin: 0;
`;

const City = ({ cityData }) => {
  useEffect(() => {}, []);

  return (
    <Container className="font-poppins">
      <Heading className="font-poppins">
        {cityData.city_name + ' - ' + cityData.duration}
      </Heading>
      <GridContainer>
        <ImageLoader
          borderRadius="8px"
          url={cityData.image}
          height={190}
          heightMobile="auto"
          dimensionsMobile={{ width: 180, height: 180 }}
        ></ImageLoader>
        <CityText className="font-poppins">
          <TruncatedText
            text={cityData.short_description}
            maxLength={120}
            viewMoreText="more v"
            viewLessText="less ^"
          />
          <div>
            {/* <TextLight>Things to do</TextLight>
      <TextBold>Tours · Wildlife · Museums</TextBold> */}

            {/* <TextLight style={{ marginTop: '0.75rem' }}>
        Weather (03 Feb - 05 Feb 2023)
      </TextLight> */}
            <WeatherWidget
              date={'2023-03-23 06:00:00'}
              city={cityData.city_name}
            />

            {/* <TextLight style={{ marginTop: '0.75rem' }}>Food to eat</TextLight>
      <TextBold>Bajre di roti · Halwa · Lassi · Daal Baati </TextBold> */}
          </div>
        </CityText>
      </GridContainer>

      <div
        style={{
          border: '1px solid #F0F0F0',
          marginBottom: '1.5rem',
          marginTop: '0.75rem',
        }}
      ></div>
    </Container>
  );
};

export default City;
