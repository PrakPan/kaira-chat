import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import { useRouter } from 'next/router';

import ImageLoader from '../../../../ImageLoader';
import { FaMapMarkerAlt } from 'react-icons/fa';
import SkeletonCard from '../../../../ui/SkeletonCard';
const Container = styled.div`
  margin: 1rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
  }
`;
const Heading = styled.p`
  font-weight: 500;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  margin: 1rem;
  color: #7a7a7a;
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
  padding: 0.3rem;
  max-width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  border-radius: 50px;
  &:hover {
    background: #f0f0f0;
    cursor: pointer;
  }
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 10px 13px 10px 13px;
`;
const Text = styled.div`
  font-weight: 500;
  // margin-block : 5px;
  p {
    font-weight: 400;
    margin-bottom: 0rem;
    margin-top: -2px;
    font-size: 12px;
    color: #7e7e7e;
  }
`;

const Locations = (props) => {
  const router = useRouter();
  let isPageWide = media('(min-width: 768px)');
  const _handleLocationClick = (slug) => {
    router.push('/travel-guide/city/' + slug);
  };
  const _handlePersonaliseRedirect = (id, name, parent) => {
    // localStorage.setItem('search_city_selected_id', id)
    // localStorage.setItem('search_city_selected_name', name)
    // localStorage.setItem('search_city_selected_parent', parent)

    router.push('/tailored-travel?search_text=' + name);
  };
  let locations = [];
  console.log(props.hotlocations, 'locations');
  if (props.hotlocations) {
    for (var i = 0; i < props.hotlocations.length; i++) {
      let id = props.hotlocations[i].id;
      let name = props.hotlocations[i].name;
      let parent = props.hotlocations[i].state.name;
      let slug = props.hotlocations[i].slug;
      locations.push(
        <LocationContainer onClick={() => _handleLocationClick(slug)}>
          {/* <ImageContainer onClick={() => _handlePersonaliseRedirect(id, name, parent)}              > */}
          <MarkerContainer>
            <FaMapMarkerAlt />
          </MarkerContainer>
          {/* <ImageLoader
                        url={props.hotlocations[i].image}
                        borderRadius='50%'
                        height='100%'
                        width="100%"
                        heighttab="100%"
                        dimensions={{width: 600, height: 600}}
                        dimensionsMobile={{width: 600, height: 600}}
                        fit="cover"
                        // onclick={_handlePersonaliseRedirect}
                        // onclickparams={{id, name, parent}}
                        hoverpointer/> */}
          {/* <ImageText className='center-div text-center font-poppins'>{props.hotlocations[i].name}</ImageText> */}

          <Text>
            <div>{props.hotlocations[i].name}</div>
            <p>{props.hotlocations[i].state?.name}</p>
          </Text>
          {/* <ImageText className="font-opesans center-div">{props.hotlocations[i].name}</ImageText> */}
          {/* </ImageContainer> */}
        </LocationContainer>
      );
    }
  } else {
    for (var i = 0; i < 8; i++) {
      locations.push(
        <LocationContainer>
          <div style={{ display: 'flex' }}>
            <SkeletonCard
              borderRadius="100%"
              width="95px"
              ml="1px"
            ></SkeletonCard>
            <div style={{ marginBlock: 'auto' }}>
              <SkeletonCard
                height="14px"
                ml="8px"
                width={'70%'}
                borderRadius={'2px'}
              ></SkeletonCard>
              <SkeletonCard
                height="12px"
                ml="8px"
                mt="4px"
                width={'55%'}
                borderRadius={'2px'}
              ></SkeletonCard>
            </div>
          </div>
        </LocationContainer>
      );
    }
  }
  return (
    <div>
      <Heading className="font-poppins">POPULAR DESTINATIONS</Heading>
      <Container>{locations}</Container>
    </div>
  );
};

export default Locations;
