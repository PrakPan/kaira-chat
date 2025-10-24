import React, { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../../ImageLoader";
import Image from "../../../ImageLoader";
import { getHumanTime } from "../../../../services/getHumanTime";
import Rooms from "../roomtypes/Index";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import useMediaQuery from "../../../media";
import MoreText from "../../../ui/MoreText";
import { FiChevronRight } from "react-icons/fi";
import Button from "../../../ui/button/Index";
import SkeletonCard from "../../../ui/SkeletonCard";
import { connect } from "react-redux";

const starRating = (rating) => {
  var stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<FaStar />);
  }
  if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
  return stars;
};

const Container = styled.div`
  font-size: 14px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (min-width: 768px) {
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 1.2rem;
  min-height: 30vh;
  @media screen and (min-width: 768px) {
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
  border-radius: 6px;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 300;
`;

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  height: 19rem;
`;

const MGridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 7px;
  grid-row-gap: 7px;
  height: 15rem;
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

const Heading = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-block: 1rem 1rem;
`;

const Address = styled.div`
  font-weight: 400;
  font-size: 14px;
`;

const CheckInText = styled.div`
  font-weight: 500;
  font-size: 14px;
  display: flex;
  gap: 5rem;
  margin-block: 1rem;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const DescriptionText = styled.div`
  p {
    margin-bottom: 12px;
  }
`;

const Overview = (props) => {

  const isDesktop = useMediaQuery("(min-width:1148px)");

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

  let images = [];
  try {
    for (var i = 0; i < props.images.length; i++) {
      if (props.images[i]) images.push(props.images[i]);
    }
  } catch {}


  return (
    <Container>
      <FlexBox>
        <div>
          <Name>{props.data.name}</Name>
          <Address>
            {props.data?.addr1 ? props.data.addr1 + ", " : ""}{" "}
            {props.data?.addr2 ? props.data.addr2 + ", " : ""}{" "}
            {props.data?.city ? props.data.city : ""}
          </Address>
        </div>
        {props.payment && props.token ? (
          props.payment?.is_registration_needed ? null : props.payment
              ?.paid_user || !props.payment?.user_allowed_to_pay ? null : (
            <Button
              padding="7px 25px"
              borderRadius="7px"
              onclick={() => props.BookingButtonFun()}
            >
              Change
            </Button>
          )
        ) : (
          <></>
        )}
      </FlexBox>

      {props.data?.rating ? (
        <div className="gap-1 flex flex-row  items-center">
          <div className="flex flex-row text-[#FFD201]">
            {starRating(props.data?.rating)}
          </div>
          <div>
            {props.data?.rating}
            {" . "}
          </div>
          {props.data?.num_reviews && (
            <div className="text-sm text-[#7A7A7A] font-[400] underline">
              {props.data?.num_reviews}{" "}
              {props.data?.agoda_accommodation
                ? "user reviews"
                : "Google reviews"}
            </div>
          )}
        </div>
      ) : null}

      {props?.currentBooking?.user_rating && (
        <div className="flex flex-col gap-1">
          {props?.currentBooking.user_rating && (
            <div className="gap-1 flex flex-row  items-center">
              <div className="flex flex-row text-[#ffa500]">
                {starRating(props?.currentBooking.user_rating)}
              </div>
              <div>
                {props?.currentBooking?.user_rating}
                {" . "}
              </div>
              {props?.currentBooking?.number_of_reviews && (
                <div className="text-sm text-[#7A7A7A] font-medium underline">
                  {props?.currentBooking?.number_of_reviews}{" "}
                  {props?.currentBooking?.source === "Agoda"
                    ? "user reviews"
                    : "Google reviews"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isDesktop ? (
        <ImageContainer>
          {images.length > 3 ? (
            <GridImage>
              <Child area="1 / 1 / 5 / 4" className="div1 ">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                >
                  <ImageLoader
                    url={
                      ImagesError[0]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[0]
                    }
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(0)}
                    onfail={() => OnImageError(0)}
                    noLazy
                  />

                  {images[0]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[0]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[0] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>

              <Child area="1 / 8 / 5 / 11" className="div2 rounded-lg">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[1] ? "initial" : "none" }}
                >
                  <ImageLoader
                    url={
                      ImagesError[1]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[1]
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(1)}
                    onfail={() => OnImageError(1)}
                    noLazy
                  />

                  {images[1]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[1]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[1] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>

              <Child area="1 / 4 / 3 / 8" className="div3">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[2] ? "initial" : "none" }}
                >
                  <ImageLoader
                    url={
                      ImagesError[2]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[2]
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(2)}
                    onfail={() => OnImageError(2)}
                    noLazy
                  />

                  {images[2]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[2]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[2] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>

              <Child area="3 / 4 / 5 / 8" className="div4">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[3] ? "initial" : "none" }}
                >
                  <ImageLoader
                    url={
                      ImagesError[3]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[3]
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(3)}
                    onfail={() => OnImageError(3)}
                    noLazy
                  />

                  {images[3]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[3]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[3] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>
            </GridImage>
          ) : images.length == 3 ? (
            <GridImage>
              <Child area="1 / 1 / 5 / 4" className="div1 ">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                >
                  <ImageLoader
                    noLazy
                    url={
                      ImagesError[0]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[0]
                    }
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(0)}
                    onfail={() => OnImageError(0)}
                  />

                  {images[0]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[0]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[0] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>

              <Child area=" 1 / 4 / 5 / 7" className="div2 rounded-lg">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[1] ? "initial" : "none" }}
                >
                  <ImageLoader
                    noLazy
                    url={
                      ImagesError[1]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[1]
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(1)}
                    onfail={() => OnImageError(1)}
                  />

                  {images[1]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[1]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[1] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>

              <Child area="1 / 7 / 5 / 11" className="div3">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[2] ? "initial" : "none" }}
                >
                  <ImageLoader
                    noLazy
                    url={
                      ImagesError[2]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[2]
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(2)}
                    onfail={() => OnImageError(2)}
                  />

                  {images[2]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[2]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[2] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>
            </GridImage>
          ) : images.length == 2 ? (
            <GridImage>
              <Child area="1 / 1 / 5 / 6" className="div1 ">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                >
                  <ImageLoader
                    noLazy
                    url={
                      ImagesError[0]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[0]?.image
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(0)}
                    onfail={() => OnImageError(0)}
                  />

                  {images[0]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[0]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[0] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>

              <Child area="1 / 6 / 5 / 11" className="div2 rounded-lg">
                <div
                  className="relative"
                  style={{ display: ImagesLoaded[1] ? "initial" : "none" }}
                >
                  <ImageLoader
                    noLazy
                    url={
                      ImagesError[1]
                        ? "media/icons/bookings/notfounds/noroom.png"
                        : images[1].image
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(1)}
                    onfail={() => OnImageError(1)}
                  />

                  {images[1]?.caption ? (
                    <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                      {images[1]?.caption}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: !ImagesLoaded[1] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>
            </GridImage>
          ) : (
            <Child style={{ height: "19rem" }}>
              <div
                className="relative"
                style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
              >
                <ImageLoader
                  noLazy
                  url={
                    ImagesError[0]
                      ? "media/icons/bookings/notfounds/noroom.png"
                      : images[0]
                  }
                  fit="cover"
                  width="100%"
                  height="100%"
                  onload={() => OnImageLoad(0)}
                  onfail={() => OnImageError(0)}
                  dimensions={{ height: 800, width: 1200 }}
                />

                {images[0]?.caption ? (
                  <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
                    {images[0]?.caption}
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  display: !ImagesLoaded[0] ? "initial" : "none",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                <SkeletonCard lottieDimension={"100%"} />
              </div>
            </Child>
          )}

          {props.images ? (
            props.images.length ? (
              <PhotosButton
                onClick={() => props._setImagesHandler(images)}
                className=" bg-black"
              >
                View Gallery
              </PhotosButton>
            ) : null
          ) : null}

          {props.tag ? (
            <Tag star_category={props.star_category} tag={props.tag}></Tag>
          ) : null}
        </ImageContainer>
      ) : (
        <ImageContainer>
          <MGridImage>
            {images.length >= 3 ? (
              <>
                <Child area="1 / 1 / 4 / 7" className="div1 ">
                  <div
                    className="relative"
                    style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                  >
                    <ImageLoader
                      noLazy
                      url={
                        ImagesError[0]
                          ? "media/icons/bookings/notfounds/noroom.png"
                          : images[0]
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(0)}
                      onfail={() => OnImageError(0)}
                    />

                    {images[0]?.caption ? (
                      <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
                        {images[0]?.caption}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: !ImagesLoaded[0] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>

                <Child area=" 4 / 1 / 7 / 4" className="div2 rounded-lg">
                  <div
                    className="relative"
                    style={{ display: ImagesLoaded[1] ? "initial" : "none" }}
                  >
                    <ImageLoader
                      noLazy
                      url={
                        ImagesError[1]
                          ? "media/icons/bookings/notfounds/noroom.png"
                          : images[1]
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(1)}
                      onfail={() => OnImageError(1)}
                    />

                    {images[1]?.caption ? (
                      <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
                        {images[1]?.caption}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: !ImagesLoaded[1] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>

                <Child area="4 / 4 / 7 / 7" className="div3">
                  <div
                    className="relative"
                    style={{ display: ImagesLoaded[2] ? "initial" : "none" }}
                  >
                    <ImageLoader
                      noLazy
                      url={
                        ImagesError[2]
                          ? "media/icons/bookings/notfounds/noroom.png"
                          : images[2].image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(2)}
                      onfail={() => OnImageError(2)}
                    />

                    {images[2]?.caption ? (
                      <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
                        {images[2]?.caption}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: !ImagesLoaded[2] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>
              </>
            ) : images.length === 2 ? (
              <>
                <Child area="1 / 1 / 4 / 7" className="div1 ">
                  <div
                    className="relative"
                    style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                  >
                    <ImageLoader
                      noLazy
                      url={
                        ImagesError[0]
                          ? "media/icons/bookings/notfounds/noroom.png"
                          : images[0]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(0)}
                      onfail={() => OnImageError(0)}
                    />

                    {images[0]?.caption ? (
                      <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
                        {images[0]?.caption}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: !ImagesLoaded[0] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>

                <Child area=" 4 / 1 / 7 / 7" className="div2 rounded-lg">
                  <div
                    className="relative"
                    style={{ display: ImagesLoaded[1] ? "initial" : "none" }}
                  >
                    <ImageLoader
                      noLazy
                      url={
                        ImagesError[1]
                          ? "media/icons/bookings/notfounds/noroom.png"
                          : images[1].image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(1)}
                      onfail={() => OnImageError(1)}
                    />

                    {images[1]?.caption ? (
                      <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
                        {images[1]?.caption}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: !ImagesLoaded[1] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>
              </>
            ) : (
              <>
                <Child area="1 / 1 / 7 / 7" className="div1 ">
                  <div
                    className="relative"
                    style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                  >
                    <ImageLoader
                      noLazy
                      url={
                        ImagesError[0]
                          ? "media/icons/bookings/notfounds/noroom.png"
                          : images[0]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(0)}
                      onfail={() => OnImageError(0)}
                    />

                    {images[0]?.caption ? (
                      <div className="absolute top-1 left-1 z-50 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
                        {images[0]?.caption}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: !ImagesLoaded[0] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>
              </>
            )}
          </MGridImage>

          {props.images ? (
            props.images.length ? (
              <PhotosButton
                onClick={() => props._setImagesHandler(images)}
                className=" bg-black"
              >
                All Photos
              </PhotosButton>
            ) : null
          ) : null}
          <div
            style={{
              position: "absolute",
              bottom: "0.25rem",
              right: "0.25rem",
              display: "flex",
            }}
          ></div>
          {props.tag ? (
            <Tag star_category={props.star_category} tag={props.tag}></Tag>
          ) : null}
        </ImageContainer>
      )}

      <DetailsContainer>
        {props.data?.check_in?.begin_time && props.data?.check_out?.time ? (
          <CheckInText>
            <div className="">
              Check in:{" "}
              {getHumanTime(props.data.check_in.begin_time.substring(0, 5))}
            </div>
            <div>
              Check out:{" "}
              {getHumanTime(props.data.check_out.time.substring(0, 5))}
            </div>
          </CheckInText>
        ) : (
          <></>
        )}
      </DetailsContainer>

      {props.data?.check_in?.instructions?.length ? (
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">About</div>
          <div
            className="text-[14px] ml-[-30px]"
            dangerouslySetInnerHTML={{
              __html: props.data?.check_in?.instructions[0],
            }}
          ></div>
        </div>
      ) : null}

      {props.data?.description && (
        <>
          <Heading>About</Heading>
          <MoreText>
            <DescriptionText
              dangerouslySetInnerHTML={{ __html: props.data.description }}
            ></DescriptionText>
          </MoreText>
        </>
      )}

      {props.data?.recommendations && props.data?.recommendations?.length ? (
        <>
          <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>
            Room Recommendations
          </Heading>

          <Rooms
            data={props.data?.recommendations}
            checkInDate={props.data?.check_in}
            city={props.data?.city}
            updateBooking={props.updateBooking}
            bookingId={props?.bookingId}
          ></Rooms>
        </>
      ) : (
        <></>
      )}

      {props.data?.google_maps_link ? (
        <div>
          <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>Location</Heading>
          <Address style={{ fontSize: "14px" }}>
            {props.data?.addr1 ? props.data.addr1 + ", " : ""}{" "}
            {props.data?.addr2 ? props.data.addr2 + ", " : ""}{" "}
            {props.data?.city ? props.data.city : ""}
          </Address>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              justifyContent: "left",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ height: "30px", width: "30px" }}>
              <Image
                noLazy
                url={
                  ImagesError[i]
                    ? "media/icons/bookings/notfounds/noroom.png"
                    : "media/icons/google-maps.png"
                }
                height="30px"
                width="30px"
              />
            </div>
            <a
              href={props.data?.google_maps_link}
              target="_blank"
              style={{ color: "black", fontSize: "14px" }}
            >
              View on Google Map
            </a>
          </div>
        </div>
      ) : props.data?.latitude &&
        props.data?.longitude ? (
        <div>
          <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>Location</Heading>
          <Address style={{ fontSize: "14px" }}>
            {props.data?.addr1 ? props.data.addr1 + ", " : ""}{" "}
            {props.data?.addr2 ? props.data.addr2 + ", " : ""}{" "}
            {props.data?.city ? props.data.city : ""}
          </Address>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              justifyContent: "left",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ height: "30px", width: "30px" }}>
              <Image
                noLazy
                url={
                  ImagesError[i]
                    ? "media/icons/bookings/notfounds/noroom.png"
                    : "media/icons/google-maps.png"
                }
                height="30px"
                width="30px"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${
                props.data?.coordinates?.latitude
              },${props.data.coordinates?.longitude}+(${props.data?.name
                ?.split(" ")
                .join("+")})`}
              target="_blank"
              style={{ color: "black", fontSize: "14px" }}
            >
              View on Google Map
            </a>
            <FiChevronRight
              style={{
                fontSize: "1rem",
                margin: "4px 0px 0px -12px",
                display: "inline",
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(Overview);
