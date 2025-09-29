import React, { useEffect, useState } from "react";
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
import { PulseLoader } from "react-spinners";
import { setStays } from "../../../../store/actions/StayBookings";
import { useRouter } from "next/router";
import { axiosDeleteBooking } from "../../../../services/itinerary/bookings";
import { dateFormat } from "../../../../helper/DateUtils";
import { useSelector } from "react-redux";
import SetCallPaymentInfo from "../../../../store/actions/callPaymentInfo";
import { openNotification } from "../../../../store/actions/notification";
import { getStars } from "../../../itinerary/itineraryCity/SlabElement";
import setItinerary from "../../../../store/actions/itinerary";
import FullScreenGallery from "../../../fullscreengallery/Index";
import { bookingDetails } from "../../../../services/bookings/FetchAccommodation";
import POIDetailsSkeleton from "../../ViewHotelDetails/Skeleton";
import BackArrow from "../../../ui/BackArrow";
import Drawer from "../../../ui/Drawer";
import { useAnalytics } from "../../../../hooks/useAnalytics";
const starRating = (rating) => {
  var stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<FaStar />);
  }
  if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
  return stars;
};

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

const Container = styled.div`
  font-size: 14px;
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
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

const HotelBookingDetails = (props) => {
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const [loading, setLoading] = useState(false);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const itinerary = useSelector((state) => state.Itinerary);
  const stays = useSelector((state) => state.Stays);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [data, setData] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { drawer, booking_id, idx, city_id } = router.query;

    const { trackHotelCardClicked, trackHotelListClicked,trackHotelBookingAdd,trackHotelBookingDelete,trackHotelCardDetails } = useAnalytics();

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

  const [imagesGallery, setImagesGallery] = useState(null);
  const _setImagesHandler = (images) => {
    setImagesGallery(images);
  };

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
  let hotelImages = data?.hotel_details?.images
    ? data?.hotel_details?.images
    : [];
  try {
    for (var i = 0; i < hotelImages.length; i++) {
      if (hotelImages[i]) images.push(hotelImages[i]);
    }
  } catch {}

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      await bookingDetails
        .get(`/${router?.query?.id}/bookings/accommodation/${props?.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          dispatch(
            openNotification({
              type: "error",
              text: "unable to get detail",
              heading: "Error!",
            })
          );
        });
      setLoadingDetails(false);
    };
    if (props?.id == booking_id && booking_id) {
      fetchDetails();
    }
  }, []);

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
        trackHotelBookingDelete(router.query.id, props?.id)
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        var newStays = JSON.parse(JSON.stringify(stays));
        newItinerary.cities = newItinerary.cities.map((item) => {
  const hasMatchingHotel = item?.hotels?.some(hotel => hotel?.id === props?.id);

  if (hasMatchingHotel) {
    item.hotels = [];
   item.itinerary_city_id=item?.itinerary_city_id
  }

  return item;
});

        newStays = newStays.map((item) => {
          if (item?.id === props?.id) {
            return {
              itinerary_city_id: item?.itinerary_city_id,
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
        dispatch(setStays(newStays));
        dispatch(setItinerary(newItinerary));
        setLoading(false);
        handleCloseDrawer();
        dispatch(
          openNotification({
            type: "success",
            text: `${data?.hotel_details?.name} booking deleted successfully`,
            heading: "Success!",
          })
        );
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errors?.[0]?.message?.[0] || err.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
      setLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    const { id, drawer } = router.query;
    if (!drawer || !props?.showDetails) return;
    router.push(
      {
        pathname: `/itinerary/${id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
  };

  return (
    <Drawer
      show={props?.showDetails}
      anchor={"right"}
      backdrop
      className="font-lexend"
      onHide={handleCloseDrawer}
      width={"50%"}
      mobileWidth={"100%"}
    >
      <Container>
        <BackContainer className=" font-lexend">
          <BackArrow handleClick={handleCloseDrawer} />
        </BackContainer>
        {loadingDetails ? (
          <POIDetailsSkeleton />
        ) : (
          <Container>
            <FlexBox>
              <div>
                <Name>{data?.hotel_details?.name}</Name>
              </div>

              <Button
                padding="7px 25px"
                borderRadius="7px"
                onclick={() => {
                  if (!localStorage.getItem("access_token")) {
                    props?.setShowLoginModal(true);
                    return;
                  }
                  props.BookingButtonFun();
                }}
              >
                Change
              </Button>
            </FlexBox>

            {data?.hotel_details?.rating && (
              <div className="gap-1 flex flex-row  items-center">
                <div className="flex flex-row text-[#FFD201]">
                  {starRating(data?.hotel_details?.rating)}
                </div>
                <div>
                  {data?.hotel_details?.rating}
                  {" . "}
                </div>
                {data?.hotel_details?.user_ratings_total && (
                  <div className="text-sm text-[#7A7A7A] font-[400] underline">
                    {data?.hotel_details?.user_ratings_total} reviews
                  </div>
                )}
              </div>
            )}
            {data?.hotel_details?.rating && (
              <div className="gap-1 flex flex-row  items-center">
                <div className="flex flex-row text-[#FFD201]">
                  {starRating(data?.hotel_details?.rating)}
                </div>
                <div>
                  {data?.hotel_details?.rating}
                  {" . "}
                </div>
                {data?.hotel_details?.user_ratings_total && (
                  <div className="text-sm text-[#7A7A7A] font-[400] underline">
                    {data?.hotel_details?.user_ratings_total} reviews
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
                          style={{
                            display: ImagesLoaded[0] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[1] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[2] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[3] ? "initial" : "none",
                          }}
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
                        style={{
                          display: ImagesLoaded[0] ? "initial" : "none",
                        }}
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
                        style={{
                          display: ImagesLoaded[1] ? "initial" : "none",
                        }}
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
                        style={{
                          display: ImagesLoaded[2] ? "initial" : "none",
                        }}
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
                        style={{
                          display: ImagesLoaded[0] ? "initial" : "none",
                        }}
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
                        style={{
                          display: ImagesLoaded[1] ? "initial" : "none",
                        }}
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

                {hotelImages ? (
                  hotelImages.length ? (
                    <PhotosButton
                      onClick={() => _setImagesHandler(images)}
                      className="font-lexend bg-black"
                    >
                      Photos Gallery
                    </PhotosButton>
                  ) : null
                ) : null}

                {props.tag ? (
                  <Tag
                    star_category={props.star_category}
                    tag={props.tag}
                  ></Tag>
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
                          style={{
                            display: ImagesLoaded[0] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[1] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[2] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[0] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[1] ? "initial" : "none",
                          }}
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
                          style={{
                            display: ImagesLoaded[0] ? "initial" : "none",
                          }}
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

                {hotelImages ? (
                  hotelImages.length ? (
                    <PhotosButton
                      onClick={() => _setImagesHandler(images)}
                      className="font-lexend bg-black"
                    >
                      Photos Gallery
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
                  <Tag
                    star_category={props.star_category}
                    tag={props.tag}
                  ></Tag>
                ) : null}
              </ImageContainer>
            )}

            <DetailsContainer>
              {data?.hotel_details?.check_in?.date &&
              data?.hotel_details?.check_out?.date ? (
                <CheckInText>
                  <div className="">
                    Check in: {dateFormat(data?.hotel_details?.check_in.date)}
                    {data?.hotel_details?.check_in.begin_time && (
                      <>
                        |
                        {getHumanTime(
                          dateFormat(data?.hotel_details?.check_in.begin_time)
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    Check out: {dateFormat(data?.hotel_details?.check_out.date)}
                    {data?.hotel_details?.check_out.time && (
                      <>
                        |
                        {getHumanTime(
                          dateFormat(data?.hotel_details?.check_out.time)
                        )}
                      </>
                    )}{" "}
                  </div>
                </CheckInText>
              ) : (
                <></>
              )}
            </DetailsContainer>

            {data?.hotel_details?.description ? (
              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold">About</div>
                <div
                  className="text-[14px] "
                  dangerouslySetInnerHTML={{
                    __html: data?.hotel_details?.description,
                  }}
                ></div>
              </div>
            ) : null}

            {data?.hotel_details?.rates && (
              <>
                <Heading>Room Information</Heading>

                <Rooms
                  data={data?.hotel_details?.rates}
                  checkInDate={data?.check_in?.split(" ")[0]}
                  city={data?.hotel_details?.city}
                  updateBooking={props?.updateBooking}
                  duration={data?.duration}
                  cancellationPolicy={data?.cancellation_policies}
                ></Rooms>
              </>
            )}

            {data?.hotel_details?.category_ratings &&
              data?.hotel_details?.category_ratings.length > 0 && (
                <div>
                  <Heading>Ratings</Heading>
                  <table>
                    <tbody>
                      {data?.hotel_details?.category_ratings.map(
                        (item, index) => (
                          <tr>
                            {item?.category != "recommendation_percent" && (
                              <>
                                <td className="">
                                  {item?.category?.slice(0, 1).toUpperCase() +
                                    item?.category?.slice(
                                      1,
                                      item?.category?.length
                                    )}
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

            {data?.hotel_details?.google_maps_link ? (
              <div>
                <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>
                  Location
                </Heading>
                <Address style={{ fontSize: "14px" }}>
                  {[
                    data?.hotel_details?.addr1,
                    data?.hotel_details?.addr2,
                    data?.hotel_details?.city,
                  ]
                    .filter(Boolean)
                    .join(", ")}
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
                    href={data?.hotel_details?.google_maps_link}
                    target="_blank"
                    style={{ color: "black", fontSize: "14px" }}
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            ) : data?.hotel_details?.coordinates?.latitude &&
              data?.hotel_details?.coordinates?.longitude ? (
              <div>
                <Heading style={{ marginBlock: "1.5rem 1.25rem" }}>
                  Location
                </Heading>
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
                    {[
                      data?.hotel_details?.addr1,
                      data?.hotel_details?.addr2,
                      data?.hotel_details?.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
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
                        data?.hotel_details?.coordinates?.latitude
                      },${
                        data?.hotel_details?.coordinates?.longitude
                      }+(${data?.hotel_details?.name?.split(" ").join("+")})`}
                      target="_blank"
                      style={{ color: "#0000EE", fontSize: "14px" }}
                    >
                      View on Google Maps
                    </a>
                  </div>

                  <button
                    className="hidden sm:!block right-0 text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
                    onClick={handleDelete}
                  >
                    <div style={{ position: "relative" }}>
                      <div
                        className="flex gap-1 items-center p-1"
                        style={loading ? { visibility: "hidden" } : {}}
                      >
                        <NextImage
                          src="/delete.svg"
                          width={"20"}
                          height={"20"}
                        />{" "}
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

                <button
                  className="sm:hidden mt-4 w-full right-0 text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
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
            {imagesGallery ? (
              <FullScreenGallery
                mercury
                closeGalleryHandler={() => setImagesGallery(null)}
                images={imagesGallery}
              ></FullScreenGallery>
            ) : null}
          </Container>
        )}
      </Container>
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(HotelBookingDetails);
