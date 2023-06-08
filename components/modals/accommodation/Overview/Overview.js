import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../ImageLoader';
import Filters from './Filters';
import Location from '../Location';
import { getHumanTime } from '../../../../services/getHumanTime';
import { getIndianPrice } from '../../../../services/getIndianPrice';

import Rooms from '../roomtypes/Index';
import Ammenities from '../Ammenities';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import useMediaQuery from '../../../media';

const starRating = (rating) => {
  var stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<FaStar />);
  }
  if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
  return stars;
};
const Container = styled.div`
  border-style: none none solid none;
  border-width: 1px;
  border-color: #e4e4e4;
  padding: 0 1rem 1rem 1rem;
  display: grid;
  grid-gap: 1rem;
  width: 100vw;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
    width: 50vw;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Name = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin: 1rem 0;
`;
const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (min-width: 768px) {
  }
`;

const Cost = styled.div`
  font-weight: 600;
  text-align: right;
  &:before {
    content: 'Starting From';
    display: block;
    text-align: right;
    line-height: 1;
    font-weight: 300;
    font-size: 0.75rem;
    text-decoration: none !important;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;

  min-height: 30vh;
  @media screen and (min-width: 768px) {
    margin: auto;
    width: 100%;

    min-height: 20vh;
  }
`;

const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 2rem;
  position: absolute;
  right: 0.25rem;
  top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 300;
`;

const EditButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 2rem;
  padding: 0.35rem 1.5rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 400;
`;

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
`;
const MGridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 7px;
  grid-row-gap: 7px;
`;
const Child = styled.div`
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  grid-area: ${(props) => props.area};
  ${(props) => props.className && `class="${props.className}"`};
`;
const Overview = (props) => {
  const isDesktop = useMediaQuery('(min-width:1148px)');
  let images = [];
  try {
    for (var i = 0; i < props.images.length; i++) {
      images.push(props.images[i].image);
    }
  } catch {}
  return (
    <Container>
      <div className="flex flex-col gap-1">
        <div className="font-bold text-xl">{props.data.name}</div>
        <div>{props.data.addr1}</div>
        {props?.currentBooking.user_rating && (
          <div className="flex flex-col gap-1">
            {/* <div className="text-sm font-medium">
              {props.currentBooking?.city}
            </div> */}
            {props?.currentBooking.user_rating && (
              <div className="gap-1 flex flex-row  items-center">
                <div className="flex flex-row text-[#ffa500]">
                  {starRating(props?.currentBooking.user_rating)}
                </div>
                <div>{props?.currentBooking.user_rating}</div>
                {props?.currentBooking.number_of_reviews && (
                  <div className="text-sm text-[#7A7A7A] font-medium underline">
                    {props?.currentBooking.number_of_reviews} Google reviews
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* <ImageContainer>
        {props.images.length ?<PhotosButton onClick={() => props._setImagesHandler(imagesarr)} className="font-lexend" style={{backgroundColor: "white", opacity: '0.7', borderRadius: "5px", position: "absolute", right: "0.5rem", top: "0.5rem", padding: "0.5rem", fontSize: "0.75rem" }}>
                     <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon>
                    All Photos
                    </PhotosButton> : null}
                    <ImageTag tag={"Stays"}></ImageTag>
        <ImageLoader url={props.images.length ? props.images[0].image: 'media/website/grey.png'} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} width="60%" margin="auto"/> 

        </ImageContainer> */}
      {isDesktop ? (
        <ImageContainer>
          {images.length > 3 ? (
            <GridImage>
              <Child area="1 / 1 / 5 / 4" className="div1 ">
                <ImageLoader
                  url={images[0]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>

              <Child area="1 / 8 / 5 / 11" className="div2 rounded-lg">
                <ImageLoader
                  url={images[1]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>
              <Child area="1 / 4 / 3 / 8" className="div3">
                <ImageLoader
                  url={images[2]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>
              <Child area="3 / 4 / 5 / 8" className="div4">
                <ImageLoader
                  url={images[3]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                  fit="cover"
                />
              </Child>
            </GridImage>
          ) : images.length == 3 ? (
            <GridImage>
              <Child area="1 / 1 / 5 / 4" className="div1 ">
                <ImageLoader
                  url={images[0]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>

              <Child area=" 1 / 4 / 5 / 7" className="div2 rounded-lg">
                <ImageLoader
                  url={images[1]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>
              <Child area="1 / 7 / 5 / 11" className="div3">
                <ImageLoader
                  url={images[2]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>
            </GridImage>
          ) : (
            <GridImage>
              <Child area="1 / 1 / 5 / 6" className="div1 ">
                <ImageLoader
                  url={images[0]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>

              <Child area="1 / 6 / 5 / 11" className="div2 rounded-lg">
                <ImageLoader
                  url={images[1]}
                  fit="cover"
                  width="100%"
                  height="100%"
                  // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                  // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                  //   maxheight="60vh"
                  //   maxwidth={isPageWide ? '70vw' : '80vw'}
                />
              </Child>
            </GridImage>
          )}

          {/* <ImageLoader
          url={
            props.images
              ? props.images.length
                ? props.images[0].image
                : 'media/website/grey.png'
              : 'media/website/grey.png'
          }
          height="30vh"
          width="100%"
        ></ImageLoader> */}
          {props.images ? (
            props.images.length ? (
              <PhotosButton
                onClick={() => props._setImagesHandler(images)}
                className="font-lexend"
              >
                {/* <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon> */}
                All Photos
              </PhotosButton>
            ) : null
          ) : null}
          <div
            style={{
              position: 'absolute',
              bottom: '0.25rem',
              right: '0.25rem',
              display: 'flex',
            }}
          >
            {props.data.accommodation_type ? (
              <EditButton
                className="font-lexend"
                style={{ marginRight: '0.5rem' }}
              >
                {props.data.accommodation_type}
              </EditButton>
            ) : null}
            {/* <EditButton className="font-lexend">5 star</EditButton> */}
          </div>
          {props.tag ? (
            <Tag star_category={props.star_category} tag={props.tag}></Tag>
          ) : null}
        </ImageContainer>
      ) : (
        <ImageContainer>
          <MGridImage>
            <Child area="1 / 1 / 4 / 7" className="div1 ">
              <ImageLoader
                url={images[0]}
                fit="cover"
                width="100%"
                height="100%"
                // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                //   maxheight="60vh"
                //   maxwidth={isPageWide ? '70vw' : '80vw'}
              />
            </Child>

            <Child area=" 4 / 1 / 7 / 4" className="div2 rounded-lg">
              <ImageLoader
                url={images[1]}
                fit="cover"
                width="100%"
                height="100%"
                // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                //   maxheight="60vh"
                //   maxwidth={isPageWide ? '70vw' : '80vw'}
              />
            </Child>
            <Child area="4 / 4 / 7 / 7" className="div3">
              <ImageLoader
                url={images[2]}
                fit="cover"
                width="100%"
                height="100%"
                // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                //   maxheight="60vh"
                //   maxwidth={isPageWide ? '70vw' : '80vw'}
              />
            </Child>
          </MGridImage>

          {/* <ImageLoader
          url={
            props.images
              ? props.images.length
                ? props.images[0].image
                : 'media/website/grey.png'
              : 'media/website/grey.png'
          }
          height="30vh"
          width="100%"
        ></ImageLoader> */}
          {props.images ? (
            props.images.length ? (
              <PhotosButton
                onClick={() => props._setImagesHandler(images)}
                className="font-lexend"
              >
                {/* <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon> */}
                All Photos
              </PhotosButton>
            ) : null
          ) : null}
          <div
            style={{
              position: 'absolute',
              bottom: '0.25rem',
              right: '0.25rem',
              display: 'flex',
            }}
          >
            {props.data.accommodation_type ? (
              <EditButton
                className="font-lexend"
                style={{ marginRight: '0.5rem' }}
              >
                {props.data.accommodation_type}
              </EditButton>
            ) : null}
            {/* <EditButton className="font-lexend">5 star</EditButton> */}
          </div>
          {props.tag ? (
            <Tag star_category={props.star_category} tag={props.tag}></Tag>
          ) : null}
        </ImageContainer>
      )}

      <DetailsContainer>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content max-content',
            gridGap: '1rem',
          }}
        >
          {props.data.check_in ? (
            <div className="font-lexend flex flex-row text-sm">
              <div className="font-lexend">{'Check in'}</div>
              <div className="font-lexend font-bold pl-1">
                {getHumanTime(props.data.check_in.slice(0, -3))}
              </div>
            </div>
          ) : null}
          {props.data.check_in ? (
            <div className="font-lexend flex flex-row text-sm">
              <div className="font-lexend">{'Check in'}</div>
              <div className="font-lexend font-bold pl-1">
                {getHumanTime(props.data.check_in.slice(0, -3))}
              </div>
            </div>
          ) : null}
        </div>
      </DetailsContainer>
      {props.data.rooms_available && <Rooms data={props.data}></Rooms>}
      {props.data.hotel_facilities && (
        <div>
          <div className="font-semibold lg:text-3xl text-xl text-black mb-2 lg:mb-4">
            Ammenities
          </div>
          <Ammenities data={props.data}></Ammenities>
        </div>
      )}
      {props.data.addr1 && (
        <div>
          <div className="font-semibold lg:text-3xl text-xl text-black mb-2 lg:mb-4">
            Address
          </div>
          <Location data={props.data}></Location>
        </div>
      )}
      <div className="mb-4"></div>
      {/* <Filters data={props.data}></Filters> */}
      {/* <Icons></Icons> */}
      {/* {props.data.check_in && props.data.check_out ? <div className='font-lexend'>{"Check in: "+getHumanTime(props.data.check_in.slice(0,-3))+" ; Check out:"+getHumanTime(props.data.check_out.slice(0,-3))}</div> : null} */}
    </Container>
  );
};

export default Overview;
