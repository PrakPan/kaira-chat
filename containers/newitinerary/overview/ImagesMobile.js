import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
const Container = styled.div`
  display: grid;

  @media screen and (min-width: 768px) {
    grid-template-columns: ${(props) =>
      props.ConImg ? '3.3fr 1fr' : '3.3fr 0fr'};

    grid-column-gap: 2rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 0.75rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 0;
    grid-row-gap: 2rem;
  }

  grid-gap: 1rem;
`;
const MoreContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  z-index: 2;
  background-color: rgba(84, 84, 84, 0.7);
`;
const MoreText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: black;
  position: absolute;
  margin: 0;
`;
const ImagesMobile = (props) => {
  // var DefaultImg = ''
  const [DefaultImg , setDefaultImage] = useState('')
  useEffect(() => {
    for (let i = 0; i < props.images.length; i++){
      if (props.images[i]) {
        setDefaultImage(props.images[i]);
        break;
      }
    }
   }, [])
  return props.images.length >= 3 ? (
    <Container ConImg={props.images[1]}>
      {DefaultImg ? (
        <ImageLoader
          borderRadius="12px"
          dimensions={{ width: 922, height: 331 }}
          url={DefaultImg}
          height="auto"
          heightMobile="auto"
          dimensionsMobile={{ width: 328, height: 141 }}
          ></ImageLoader>
      ) : <></>}

      {props.images[1] ? (
        <GridContainer>
          <ImageLoader
            borderRadius="12px"
            url={props.images[1]}
            dimensions={{ width: 436, height: 150 }}
            height="100%"
            heightMobile="auto"
            dimensionsMobile={{ width: 160, height: 90 }}
          ></ImageLoader>
          <MoreContainer className="center-div">
            <ImageLoader
              borderRadius="12px"
              url={
                props?.images[2] != null ? props?.images[2] : props?.images[3]
              }
              dimensions={{ width: 436, height: 150 }}
              height="100%"
              heightMobile="auto"
              dimensionsMobile={{ width: 160, height: 90 }}
            ></ImageLoader>
            {/* <div
            className="center-div"
            style={{ position: 'absolute', height: '100%', color: 'white' }}
          >
            View 10+ photos
          </div> */}
            {/* <MoreText className='font-lexend'>View 10+ photos</MoreText> */}
          </MoreContainer>
        </GridContainer>
      ) : null}
    </Container>
  ) : (
    <Container ConImg={props.images[1]}>
      <ImageLoader
        borderRadius="12px"
        dimensions={{ width: 922, height: 331 }}
        url={props.images[0]}
        height="auto"
        heightMobile="auto"
        dimensionsMobile={{ width: 328, height: 141 }}
      ></ImageLoader>
      {props.images[1] ? (
        <GridContainer>
          <ImageLoader
            borderRadius="12px"
            url={props.images[1]}
            dimensions={{ width: 436, height: 150 }}
            height="100%"
            heightMobile="auto"
            dimensionsMobile={{ width: 160, height: 90 }}
          ></ImageLoader>
        </GridContainer>
      ) : null}
    </Container>
  );
};

export default ImagesMobile;
