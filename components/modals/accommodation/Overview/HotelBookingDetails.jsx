import React, { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../../ImageLoader";
import Image from "../../../ImageLoader";
import NextImage from "next/image";
import { getHumanTime } from "../../../../services/getHumanTime";
import Rooms from "../roomtypes/Index";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import useMediaQuery from "../../../media";
import Button from "../../../ui/button/Index";
import SkeletonCard from "../../../ui/SkeletonCard";
import { connect, useDispatch } from "react-redux";
import Tag from "../../../cards/bookings/activitybooking/imagecontainer/Tag";
import ImageCarousel from "../../Carousel/ImageCarousel";
import { PulseLoader } from "react-spinners";
import { setStays, updateStays } from "../../../../store/actions/StayBookings";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { axiosDeleteBooking } from "../../../../services/itinerary/bookings";
import { RiDeleteBin6Line } from "react-icons/ri";
import { dateFormat } from "../../../../helper/DateUtils";
import { useSelector } from "react-redux";
import SetCallPaymentInfo from "../../../../store/actions/callPaymentInfo";
import { openNotification } from "../../../../store/actions/notification";
import { getStars } from "../../../itinerary/itineraryCity/SlabElement";
import setItinerary from "../../../../store/actions/itinerary";
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
  font-family: poppins;
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
const getRoomImage = (images) => {
  if (images && images.length) {
    for (let image of images) {
      if (image?.image) {
        return image.image;
      }
    }
  }

  return null;
};

const HotelBookingDetails = (props) => {
  console.log("hotel details are:", props);
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const [loading, setLoading] = useState(false);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const itinerary = useSelector((state) => state.Itinerary);
  const stays = useSelector((state) => state.Stays);
  const router = useRouter();
  const dispatch = useDispatch();

  const { id } = router.query;

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
  const [open, setOpen] = useState(false);

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

  const handleDelete = async () => {
    try {
      if (!localStorage.getItem("access_token")) {
        props?.setShowLoginModal(true);
        return;
      }
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${id}/bookings/accommodation/${props?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        var newStays = JSON.parse(JSON.stringify(stays));

        newItinerary.cities = newItinerary.cities.map((item) => {
          console.log("updated booking 1 is:", item?.hotels);
          if (item?.hotels?.[0]?.id == props?.id) {
            console.log("updated booking  is:", item?.hotels);
            item.hotels = [];
          }
          return item;
        });

        newStays = newStays.map((item) => {
          if (item?.id === props?.id) {
            return {
              check_in: item?.check_in,
              check_out: item?.check_out,
              city_id: item?.city_id,
              city_name: item?.city_name,
              duration: item?.duration,
              trace_city_id: item?.trace_city_id,
            };
          }
          return item;
        });

        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        dispatch(updateStays(props?.id));
        dispatch(setStays(newStays));
        dispatch(setItinerary(newItinerary));
        setLoading(false);
        dispatch(
          openNotification({
            type: "success",
            text: `${props?.data?.hotel_details?.name} booking deleted successfully`,
            heading: "Success!",
          })
        );
      }
    } catch (err) {
      dispatch(
        openNotification({
          type: "error",
          text: `${err.message}`,
          heading: "Error!",
        })
      );
      setLoading(false);
    }
  };
  return (
    <Container>
      <FlexBox>
        <div>
          <Name>{props?.data?.hotel_details?.name}</Name>
          <Address>
            {props?.data?.hotel_details?.addr1
              ? props?.data?.hotel_details?.addr1 + ", "
              : ""}{" "}
            {props?.data?.hotel_details?.addr2
              ? props?.data?.hotel_details?.addr2 + ", "
              : ""}{" "}
            {props?.data?.hotel_details?.city_name
              ? props?.data?.hotel_details?.city_name
              : ""}
          </Address>
        </div>

        <Button
          padding="7px 25px"
          borderRadius="7px"
          onclick={() => props.BookingButtonFun()}
        >
          Change
        </Button>
      </FlexBox>

      {props?.data?.hotel_details?.rating && (
        <div className="gap-1 flex flex-row  items-center">
          <div className="flex flex-row text-[#FFD201]">
            {starRating(props?.data?.hotel_details?.rating)}
          </div>
          <div>
            {props?.data?.hotel_details?.rating}
            {" . "}
          </div>
          {props?.data?.hotel_details?.user_ratings_total && (
            <div className="text-sm text-[#7A7A7A] font-[400] underline">
              {props?.data?.hotel_details?.user_ratings_total} reviews
            </div>
          )}
        </div>
      )}

      {isDesktop ? (
        <ImageContainer>
          {images.length > 3 ? (
            <>
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
                          : images[0]?.image
                      }
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(0)}
                      onfail={() => OnImageError(0)}
                      noLazy
                    />

                    {images[0]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                          : images[1]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(1)}
                      onfail={() => OnImageError(1)}
                      noLazy
                    />

                    {images[1]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                          : images[2]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(2)}
                      onfail={() => OnImageError(2)}
                      noLazy
                    />

                    {images[2]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                          : images[3]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(3)}
                      onfail={() => OnImageError(3)}
                      noLazy
                    />

                    {images[3]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
            </>
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
                        : images[0]?.image
                    }
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(0)}
                    onfail={() => OnImageError(0)}
                  />

                  {images[0]?.caption ? (
                    <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                        : images[1]?.image
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(1)}
                    onfail={() => OnImageError(1)}
                  />

                  {images[1]?.caption ? (
                    <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                        : images[2]?.image
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(2)}
                    onfail={() => OnImageError(2)}
                  />

                  {images[2]?.caption ? (
                    <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                    <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                        : images[1]?.image
                    }
                    fit="cover"
                    width="100%"
                    height="100%"
                    onload={() => OnImageLoad(1)}
                    onfail={() => OnImageError(1)}
                  />

                  {images[1]?.caption ? (
                    <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                      : images[0]?.image
                  }
                  fit="cover"
                  width="100%"
                  height="100%"
                  onload={() => OnImageLoad(0)}
                  onfail={() => OnImageError(0)}
                  dimensions={{ height: 800, width: 1200 }}
                />

                {images[0]?.caption ? (
                  <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white py-1 px-2 rounded-lg">
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
                className="font-lexend bg-black"
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
                          : images[0]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(0)}
                      onfail={() => OnImageError(0)}
                    />

                    {images[0]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
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
                          : images[1]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(1)}
                      onfail={() => OnImageError(1)}
                    />

                    {images[1]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
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
                          : images[2]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(2)}
                      onfail={() => OnImageError(2)}
                    />

                    {images[2]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
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
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
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
                          : images[1]?.image
                      }
                      fit="cover"
                      width="100%"
                      height="100%"
                      onload={() => OnImageLoad(1)}
                      onfail={() => OnImageError(1)}
                    />

                    {images[1]?.caption ? (
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
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
                      <div className="absolute top-1 left-1  bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded-lg">
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
                className="font-lexend bg-black"
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
        {props?.data?.hotel_details?.check_in?.date &&
        props?.data?.hotel_details?.check_out?.date ? (
          <CheckInText>
            <div className="">
              Check in: {dateFormat(props?.data?.hotel_details?.check_in.date)}
              {props?.data?.hotel_details?.check_in.begin_time && (
                <>
                  |
                  {getHumanTime(
                    dateFormat(props?.data?.hotel_details?.check_in.begin_time)
                  )}
                </>
              )}
            </div>
            <div>
              Check out:{" "}
              {dateFormat(props?.data?.hotel_details?.check_out.date)}
              {props?.data?.hotel_details?.check_out.time && (
                <>
                  |
                  {getHumanTime(
                    dateFormat(props?.data?.hotel_details?.check_out.time)
                  )}
                </>
              )}{" "}
            </div>
          </CheckInText>
        ) : (
          <></>
        )}
      </DetailsContainer>

      {props?.data?.hotel_details?.rates?.map((room, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 bg-white p-2 rounded-lg"
        >
          <div className="flex flex-row gap-3">
            {getRoomImage(room?.images) && (
              <ImageContainer>
                <ImageLoader
                  noLazy
                  height={isPageWide ? "85px" : "75px"}
                  width={isPageWide ? "85px" : "75px"}
                  borderRadius="10px"
                  dimensions={{ height: 200, width: 200 }}
                  url={getRoomImage(room?.images)}
                />
              </ImageContainer>
            )}

            <div className="w-full">
              {room.name ? (
                <div className="w-full text-[14px] font-[400] md:text-lg md:font-semibold">
                  {room.name}{" "}
                  <span>
                    <RxCross2 className="inline" /> 1 room
                  </span>
                </div>
              ) : null}

              {room?.number_of_adults && room?.number_of_adults !== "0" ? (
                <div className="flex flex-row gap-1">
                  <div className="text-md font-semibold">Sleeps</div>
                  <div>
                    {room.number_of_adults > 1
                      ? `${room.number_of_adults} Adults`
                      : `${room.number_of_adults} Adult`}
                    {room?.number_of_children &&
                    room?.number_of_children !== "0"
                      ? `, ${room.number_of_children} Children`
                      : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}

      {props?.data?.hotel_details?.description ? (
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">About</div>
          <div
            className="text-[14px] "
            dangerouslySetInnerHTML={{
              __html: props?.data?.hotel_details?.description,
            }}
          ></div>
        </div>
      ) : null}

      {props?.data?.hotel_details?.rates?.[0]?.rooms?.length > 0 && (
        <>
          <Heading>Room Information</Heading>
          <div className="flex flex-col gap-3">
            {props?.data?.hotel_details?.rates?.[0]?.rooms.map(
              (room, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-1 justify-between"
                  >
                    <div>
                      {room?.name && (
                        <div className="text-[16px] font-bold">
                          {room?.name}
                        </div>
                      )}
                      {/* {room?.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: room.description,
                          }}
                          className=""
                        ></div>
                      ) : null} */}
                    </div>
                    {room?.images?.length > 0 && (
                      <div className="flex flex-col items-center justify-center gap-3 md:w-[40%] h-[250px]">
                        <ImageCarousel images={room?.images} />
                      </div>
                    )}
                  </div>

                  {room?.facilities ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-semibold">Amenities</div>
                      <div className="text-[14px]">
                        <div className="flex flex-wrap gap-2">
                          {room.facilities.map((item, index) => (
                            <div key={index}>
                              <div className="bg-[#FAFAFA] p-[8px] rounded-[10px]">
                                {item}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            )}
          </div>
        </>
      )}

      {props?.data?.hotel_details?.rates?.map((room, index) => (
        <div className="flex flex-col gap-3">
          {room?.polices && room?.polices?.length>0 ? (
            <>
              <div className="text-lg font-bold mt-4">Policies</div>
              {room.polices.map((item, index) => (
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-semibold">{item.type}</div>
                  <div
                    className="text-[14px]"
                    dangerouslySetInnerHTML={{
                      __html: item.text,
                    }}
                  ></div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      ))}

      {props?.data?.hotel_details?.category_ratings &&
        props?.data?.hotel_details?.category_ratings.length > 0 && (
          <div>
            <Heading>Ratings</Heading>
            <table>
              <tbody>
                {props?.data?.hotel_details?.category_ratings.map(
                  (item, index) => (
                    <tr>
                      {item?.category != "recommendation_percent" && (
                        <>
                          <td className="">
                            {item?.category?.slice(0, 1).toUpperCase() +
                              item?.category?.slice(1, item?.category?.length)}
                          </td>
                          <td className="flex items-center gap-1">
                            <div className="flex text-[#FFD201]">
                              {getStars(item?.rating)}
                            </div>
                            {item?.rating}
                          </td>
                        </>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      {props?.data?.hotel_details?.recommendations &&
      props?.data?.hotel_details?.recommendations?.length ? (
        <>
          <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>
            Room Recommendations
          </Heading>

          <Rooms
            data={props?.data?.hotel_details?.recommendations}
            checkInDate={props?.data?.hotel_details?.check_in?.date}
            city={props?.data?.hotel_details?.city}
            updateBooking={props.updateBooking}
          ></Rooms>
        </>
      ) : (
        <></>
      )}

      {props?.data?.hotel_details?.google_maps_link ? (
        <div>
          <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>Location</Heading>
          <Address style={{ fontSize: "14px" }}>
            {props?.data?.hotel_details?.addr1
              ? props?.data?.hotel_details?.addr1 + ", "
              : ""}{" "}
            {props?.data?.hotel_details?.addr2
              ? props?.data?.hotel_details?.addr2 + ", "
              : ""}{" "}
            {props?.data?.hotel_details?.city
              ? props?.data?.hotel_details?.city
              : ""}
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
              href={props?.data?.hotel_details?.google_maps_link}
              target="_blank"
              style={{ color: "black", fontSize: "14px" }}
            >
              View on Google Maps
            </a>
          </div>
        </div>
      ) : props?.data?.hotel_details?.coordinates?.latitude &&
        props?.data?.hotel_details?.coordinates?.longitude ? (
        <div>
          <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>Location</Heading>
          <div className="flex gap-2">
            <div>
              <svg
                width="23"
                height="24"
                viewBox="0 0 23 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_9135_4118)">
                  <rect
                    y="0.800781"
                    width="22.4"
                    height="22.4"
                    rx="4"
                    fill="#169873"
                    fill-opacity="0.09"
                  />
                  <path
                    d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z"
                    fill="#169873"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_9135_4118">
                    <rect
                      y="0.800781"
                      width="22.4"
                      height="22.4"
                      rx="4"
                      fill="white"
                    />
                  </clipPath>
                </defs>
                <g
                  xmlns="http://www.w3.org/2000/svg"
                  clip-path="url(#clip0_9135_4118)"
                >
                  <rect
                    y="0.800781"
                    width="22.4"
                    height="22.4"
                    rx="4"
                    fill="#169873"
                    fill-opacity="0.09"
                  />
                  <path
                    d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z"
                    fill="#169873"
                  />
                </g>
                <defs xmlns="http://www.w3.org/2000/svg">
                  <clipPath id="clip0_9135_4118">
                    <rect
                      y="0.800781"
                      width="22.4"
                      height="22.4"
                      rx="4"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <Address style={{ fontSize: "14px" }}>
              {props?.data?.hotel_details?.addr1
                ? props?.data?.hotel_details?.addr1 + ", "
                : ""}{" "}
              {props?.data?.hotel_details?.addr2
                ? props?.data?.hotel_details?.addr2 + ", "
                : ""}{" "}
              {props?.data?.hotel_details?.city
                ? props?.data?.hotel_details?.city
                : ""}
            </Address>
          </div>
          <div className="flex justify-between">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                justifyContent: "left",
                marginTop: "0.5rem",
              }}
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${
                  props?.data?.hotel_details?.coordinates?.latitude
                },${
                  props?.data?.hotel_details?.coordinates?.longitude
                }+(${props?.data?.hotel_details?.name?.split(" ").join("+")})`}
                target="_blank"
                style={{ color: "#0000EE", fontSize: "14px" }}
              >
                View on Google Maps
              </a>
            </div>

            <button
              className=" right-0 text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
              onClick={handleDelete}
            >
              <div style={{ position: "relative" }}>
                <div
                  className="flex gap-1 items-center p-1"
                  style={loading ? { visibility: "hidden" } : {}}
                >
                  <NextImage src="/delete.svg" width={"20"} height={"20"} />{" "}
                  Delete Booking
                </div>
                {loading && (
                  <PulseLoader
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "50%",
                      transform: "translate(-50% , -50%)",
                    }}
                    size={12}
                    speedMultiplier={0.6}
                    color="#ffffff"
                  />
                )}
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            className=" right-0 text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
            onClick={handleDelete}
          >
            <div style={{ position: "relative" }}>
              <div
                className="flex gap-1 items-center p-1"
                style={loading ? { visibility: "hidden" } : {}}
              >
                <NextImage src="/delete.svg" width={"20"} height={"20"} />{" "}
                Delete Booking
              </div>
              {loading && (
                <PulseLoader
                  style={{
                    position: "absolute",
                    top: "55%",
                    left: "50%",
                    transform: "translate(-50% , -50%)",
                  }}
                  size={12}
                  speedMultiplier={0.6}
                  color="#ffffff"
                />
              )}
            </div>
          </button>
        </div>
      )}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(HotelBookingDetails);
