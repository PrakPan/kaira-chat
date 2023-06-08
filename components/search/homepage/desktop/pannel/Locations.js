import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../../../../ImageLoader';
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 0.5rem;
  margin: 1rem;
`;
const Heading = styled.p`
  font-weight: 600;
  margin: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;
const ImageContainer = styled.div`
  position: relative;
  text-align: center;
  color: white;
  margin: auto;
  border-radius: 50%;
  width: 100%;
  min-height: 16vw;
  background: white;

  &:hover {
    cursor: pointer;
    background: #f7e700;
  }
  @media screen and (min-width: 768px) {
    min-height: 6.5vw;
  }
`;
const ImageText = styled.div`
  font-weight: 400;
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
`;

const LocationContainer = styled.div`
  padding: 0.5rem;
  &:hover {
    cursor: pointer;
  }
  max-width: 100%;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 2fr 4fr;
  grid-gap: 0.5rem;
  &:hover {
    cursor: pointer;
  }
`;

const Locations = (props) => {
  const router = useRouter();
  let isPageWide = media('(min-width: 768px)');
  const _handleLocationClick = (data) => {
    if (data.cta) {
      // props.setPannelClose()
      // router.push('/travel-guide/city/'+slug)
      if (data.type === 'Location')
        window.location.href =
          'https://thetarzanway.com/travel-guide/city/' + data.cta;
      if (data.type === 'State')
        window.location.href =
          'https://thetarzanway.com/travel-planner/' + data.cta;
    }
  };

  let locations = [];
  if (props.hotlocations) {
    for (var i = 0; i < props.hotlocations.length; i++) {
      const data = props.hotlocations[i];

      locations.push(
        <LocationContainer
          className="border-thin"
          onClick={() => _handleLocationClick(data)}
        >
          <ImageLoader
            url={props.hotlocations[i].image}
            borderRadius="50%"
            height="100%"
            width="100%"
            heighttab="100%"
            dimensions={{ width: 600, height: 600 }}
            dimensionsMobile={{ width: 600, height: 600 }}
            fit="cover"
            // onclick={_handlePersonaliseRedirect}
            // onclickparams={{id, name, parent}}
            hoverpointer
          />
          <ImageText className="center-div text-center font-lexend">
            {props.hotlocations[i].name}
          </ImageText>
          {/* <ImageText className="font-opesans center-div">{props.hotlocations[i].name}</ImageText> */}
          {/* </ImageContainer> */}
        </LocationContainer>
      );
    }
  } else {
    for (var i = 0; i < 6; i++) {
      locations.push(
        <LocationContainer className="border-thin">
          <ImageLoader
            url={'media/website/grey.png'}
            borderRadius="50%"
            height="100%"
            width="100%"
            heighttab="100%"
            dimensions={{ width: 100, height: 100 }}
            dimensionsMobile={{ width: 100, height: 100 }}
            fit="cover"
            // onclick={_handlePersonaliseRedirect}
            // onclickparams={{id, name, parent}}
            hoverpointer
          />
          <ImageText className="center-div text-center font-lexend">
            {''}
          </ImageText>
        </LocationContainer>
      );
    }
  }
  return (
    <div>
      <Heading className="font-lexend">Top Locations</Heading>
      <Container>{locations}</Container>
    </div>
  );
};

export default Locations;
