import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import ImageLoader from "../../ImageLoader";
import media from "../../media";
import { TbArrowBack } from "react-icons/tb";
import SkeletonCard from "../../ui/SkeletonCard";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ReviewsCarousel from "./ReviewsCarousel";
import FullScreenGalleryGoogle from "./FullScreenGalleryGoogle";
import useMediaQuery from "../../media";
import ImageLoaderGoogle from "./ImageLoaderGoogle";
import ReviewComponent from "../../Reviews/Reviews";
import { GOOGLE_MAPS_API_KEY, MERCURY_HOST } from "../../../services/constants";
import Image from "next/image";
export const Title = styled.p`
  font-weight: 800;
  font-size: 20px;
`;

export const Reviews = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  p,
  u {
    font-size: 12px;
    color: #7a7a7a;
  }
  u {
    margin-inline: 0.2rem;
  }
`;

export const Text = styled.p`
  font-size: 14px;
`;

export const Heading = styled.p`
  font-size: 18px;
  font-weight: 800;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: Lexend;
  padding: ${(props) => (props.itineraryDrawer ? "0 1rem 1rem 1rem" : "1rem")};
`;

const TimeStamp = styled.span`
  height: 31px;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  left: 0.5rem;
  top: 0.5rem;
  position: absolute;
`;
const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 6px;
  position: absolute;
  right: 0.5rem;
  bottom: -12.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 300;
`;
const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  height: 19rem;
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

// const Heading = styled.div`
//   font-weight: 600;
//   font-size: 20px;
//   margin-block: 1rem 1rem;
// `;
const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

const POIDetails = (props) => {
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [aboutText, setAboutText] = useState(
    props?.data?.overview ?? props?.data?.short_description
  );

  const [ImagesLoaded, setImagesLoaded] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const [ImagesError, setImagesError] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

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

  function OnImageError(i) {
    if (!ImagesError[i]) {
      setImagesError((prev) => {
        return { ...prev, [i]: true };
      });
    }
  }

  var experience_filters = (
    <div className="flex flex-wrap gap-2">
      {props.data.experience_filters?.map((e, i) => (
        <div
          key={i}
          className={`border-2 rounded-full px-2 py-1`}
          style={{ backgroundColor: colors[i % colors.length] }}
        >
          {e}
        </div>
      ))}
    </div>
  );

  var tips = (
    <ul style={{ paddingLeft: "0.5rem" }}>
      {props.data.tips_tricks?.map((e, i) => (
        <li key={i}>- {e}</li>
      ))}
    </ul>
  );

  var stars = [];
  for (let i = 0; i < Math.floor(props.data.rating); i++) {
    stars.push(<FaStar />);
  }

  if (Math.floor(props.data.rating) < props.data.rating)
    stars.push(<FaStarHalfAlt />);

  return (
    <Container itineraryDrawer={props.itineraryDrawer}>
      {!props.itineraryDrawer ? (
        <div>
          <TbArrowBack
            style={{ height: "32px", width: "32px" }}
            cursor={"pointer"}
            onClick={(e) => {
              props.handleCloseDrawer(e);
            }}
          />
        </div>
      ) : (
        <BackContainer className=" font-lexend">
          <IoMdClose
            className="hover-pointer"
            onClick={(e) => {
              props.handleCloseDrawer(e);
            }}
            style={{ fontSize: "2rem" }}
          ></IoMdClose>
          <BackText>Back to Itinerary</BackText>
        </BackContainer>
      )}

      <>
        {props?.data?.extra_images?.length > 0 && (
          <GridImage>
            <Child area="1 / 1 / 5 / 4" className="div1">
              <Image
                src={
                  props?.data?.extra_images?.[0]
                    ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[0]?.photo_reference}`
                    : "/media/icons/bookings/notfounds/noroom.png"
                }
                alt="Image 0"
                fill
                className="object-cover"
                onLoad={() => OnImageLoad(0)}
                onError={() => OnImageError(0)}
                priority
              />
              <div
                style={{
                  display: !ImagesLoaded[0] ? "initial" : "none",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>

            <Child area="1 / 8 / 5 / 11" className="div2 rounded-lg">
              <Image
                src={
                  props?.data?.extra_images?.[1]
                    ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[1]?.photo_reference}`
                    : "/media/icons/bookings/notfounds/noroom.png"
                }
                alt="Image 1"
                fill
                className="object-cover"
                onLoad={() => OnImageLoad(1)}
                onError={() => OnImageError(1)}
                priority
              />
              ={" "}
              <div
                style={{
                  display: !ImagesLoaded[1] ? "initial" : "none",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>

            <Child area="1 / 4 / 3 / 8" className="div3">
              <Image
                src={
                  props?.data?.extra_images?.[2]
                    ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[2]?.photo_reference}`
                    : "/media/icons/bookings/notfounds/noroom.png"
                }
                alt="Image 2"
                fill
                className="object-cover"
                onLoad={() => OnImageLoad(2)}
                onError={() => OnImageError(2)}
                priority
              />
              <div
                style={{
                  display: !ImagesLoaded[2] ? "initial" : "none",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>

            <Child area="3 / 4 / 5 / 8" className="div4">
              <Image
                src={
                  props?.data?.extra_images?.[3]
                    ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[3]?.photo_reference}`
                    : "/media/icons/bookings/notfounds/noroom.png"
                }
                alt="Image 3"
                fill
                className="object-cover"
                onLoad={() => OnImageLoad(3)}
                onError={() => OnImageError(3)}
                priority
              />
              <div
                style={{
                  display: !ImagesLoaded[3] ? "initial" : "none",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>
          </GridImage>
        )}
      </>

      <div className="">
        <Title>{props.data.name}</Title>
        {aboutText != null && aboutText != undefined && (
          <div>
            <Text
              onClick={() =>
                setAboutText(
                  props?.data?.overview || props.data.short_description
                )
              }
            >
              {aboutText}
            </Text>
          </div>
        )}
        {props.data?.address && (
          <div>
            <span className="font-bold pr-1">Address:</span>{" "}
            {props.data.address}
          </div>
        )}

        {props.data?.experience_filters && <Text>{experience_filters}</Text>}
      </div>

      {props.data?.cost ? (
        <div className="flex flex-row">
          Cost: <span className="font-semibold px-1">₹</span>
          {props.data.cost}
          {" /- "}
          {"Per person"}
        </div>
      ) : props.data?.pricing?.total_price ? (
        <div className="flex flex-row">
          Cost: <span className="font-semibold px-1">₹</span>
          {props.data.pricing.total_price}
          {" /- "}
          {"Per person"}
        </div>
      ) : null}

      {props.data?.getting_around && (
        <div>
          <Heading>Getting Around</Heading>
          <Text>{props.data.getting_around}</Text>
        </div>
      )}

      {props.data?.timings && (
        <div>
          <Heading>Timings</Heading>
          <Text>
            {
              <ul>
                {props.data.timings?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            }
          </Text>
        </div>
      )}
      {props?.data?.reviews && (
        <>
          <div className="flex justify-between">
            <Heading>Reviews</Heading>
            <Reviews>
              {props.data.rating ? (
                <div
                  style={{ color: "#FFD201" }}
                  className="flex flex-row gap-1"
                >
                  {stars}
                </div>
              ) : null}

              <div className="flex items-center">
                {props.data?.rating ? (
                  <p className="m-0">{props.data.rating} · </p>
                ) : null}

                {props.data?.user_ratings_total ? (
                  <u> {props.data.user_ratings_total} user reviews</u>
                ) : null}
              </div>
            </Reviews>
          </div>
          <ReviewComponent review={props?.data?.reviews?.[0]} />
          {/* <ReviewsCarousel reviews={props?.data?.reviews} /> */}
        </>
      )}

      {props.data?.tips && props.data?.tips.length ? (
        <div>
          <Heading>Tips</Heading>
          <Text>{tips}</Text>
        </div>
      ) : (
        <></>
      )}

      {/* {images?.length > 0 && (
        <FullScreenGalleryGoogle
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGalleryGoogle>
      )}  */}
    </Container>
  );
};

export default POIDetails;
