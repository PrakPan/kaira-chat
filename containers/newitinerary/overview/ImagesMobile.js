import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
import { useLayoutEffect } from 'react';
import SkeletonCard from '../../../components/ui/SkeletonCard';
const Container = styled.div`
  display: grid;
  @media screen and (min-width: 768px) {
    grid-template-columns: ${(props) =>
      props.ConImg ? '3.3fr 1fr' : '3.3fr 0fr'};
    height : 400px;
    grid-column-gap: 1rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 0.75rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 0;
    grid-row-gap: 1rem;
    height : 400px;
  }

  grid-gap: 0.5rem;
`;
const MoreContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  z-index: 2;
  // background-color: rgba(84, 84, 84, 0.7);
`;
const MoreText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: black;
  position: absolute;
  margin: 0;
`;
const ImagesMobile = (props) => {
  const [ImagesLoaded , setImagesLoaded] = useState({0 : false , 1 : false , 2 : false})
  function OnImageLoad(i) {

    if (!ImagesLoaded[i]) {
      setTimeout(
        () =>
          setImagesLoaded((prev) => {
            return { ...prev, [i]: true };
          }),
        1000
      );
      
    }
  }

  return props.images.length >= 3 ? (
    <Container ConImg={props.images[1]}>
      <>
        <div style={{ display: ImagesLoaded[0] ? "initial" : "none" }}>
          <ImageLoader
            borderRadius="12px"
            dimensions={{ width: 1500, height: 600 }}
            url={props.images[0]}
            height="400px"
            heightMobile="auto"
            dimensionsMobile={{ width: 328, height: 141 }}
            onload={() => OnImageLoad(0)}
            noLazy
          ></ImageLoader>
        </div>
        <div
          style={{
            overflow: "hidden",
            borderRadius: "12px",
            display: !ImagesLoaded[0] ? "initial" : "none",
          }}
        >
          <SkeletonCard />
        </div>
      </>
      {props.images[1] ? (
        <GridContainer>
          <div style={{ display: ImagesLoaded[1] ? "initial" : "none" }}>
            <ImageLoader
              borderRadius="12px"
              url={props.images[1]}
              dimensions={{ width: 436, height: 150 }}
              height="100%"
              heightMobile="auto"
              dimensionsMobile={{ width: 160, height: 90 }}
              onload={() => OnImageLoad(1)}
              noLazy
            ></ImageLoader>
          </div>
          <div
            style={{
              overflow: "hidden",
              borderRadius: "12px",
              display: !ImagesLoaded[1] ? "initial" : "none",
            }}
          >
            <SkeletonCard />
          </div>
          {/* <MoreContainer> */}
          <div style={{ display: ImagesLoaded[2] ? "initial" : "none" }}>
            <ImageLoader
              borderRadius="12px"
              url={props.images[2]}
              dimensions={{ width: 436, height: 150 }}
              height="100%"
              heightMobile="auto"
              dimensionsMobile={{ width: 160, height: 90 }}
              onload={() => OnImageLoad(2)}
              noLazy
            ></ImageLoader>
          </div>
          <div
            style={{
              display: !ImagesLoaded[2] ? "initial" : "none",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <SkeletonCard />
          </div>
          {/* <div
            className="center-div"
            style={{ position: 'absolute', height: '100%', color: 'white' }}
          >
            View 10+ photos
          </div> */}
          {/* <MoreText className='font-lexend'>View 10+ photos</MoreText> */}
          {/* </MoreContainer> */}
        </GridContainer>
      ) : null}
    </Container>
  ) : (
    <Container>
      <div style={{ display: ImagesLoaded[0] ? "initial" : "none" }}>
        <ImageLoader
          borderRadius="12px"
          dimensions={{ width: 1071, height: 400 }}
          url={props.images[0]}
          height="400px"
          heightMobile="auto"
          dimensionsMobile={{ width: 328, height: 141 }}
          onload={() => OnImageLoad(0)}
          noLazy
        ></ImageLoader>
      </div>
      <div
        style={{
          display: !ImagesLoaded[0] ? "initial" : "none",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <SkeletonCard />
      </div>
      {/* {props.images[1] ? (
        <GridContainer>
          <div style={{ display: ImagesLoaded[1] ? "initial" : "none" }}>
            <ImageLoader
              borderRadius="12px"
              url={props.images[1]}
              dimensions={{ width: 436, height: 150 }}
              height="400px"
              heightMobile="auto"
              dimensionsMobile={{ width: 160, height: 90 }}
              onload={() => OnImageLoad(1)}
              noLazy
            ></ImageLoader>
          </div>
          <div
            style={{
              display: !ImagesLoaded[1] ? "initial" : "none",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <SkeletonCard />
          </div>
        </GridContainer>
      ) : null} */}
    </Container>
  );
};

export default ImagesMobile;
