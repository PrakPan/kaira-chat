import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { TbArrowBack } from "react-icons/tb";
import SkeletonCard from "../../ui/SkeletonCard";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MERCURY_HOST } from "../../../services/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import setItinerary from "../../../store/actions/itinerary";
import { ToastContainer } from "react-toastify";
import ReviewPoi from "../../POIDetails/Reviews";
import useMediaQuery from "../../media";
import { openNotification } from "../../../store/actions/notification";
import BackArrow from "../../ui/BackArrow";
import ImageLoader from "../../ImageLoader";
import Button from "../../ui/button/Index";
import Drawer from "../../ui/Drawer";
import AddPoi from "../AddPoi";

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
  gap: 32px;
  font-family: Lexend;
  padding: ${(props) => (props.itineraryDrawer ? "0 1rem 1rem 1rem" : "1rem")};
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
const ScrollContainer = styled.div`
  display: flex;
  gap: 21px;
  height: auto;
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  // const Heading = styled.div
`;
// const Heading = styled.div`
//   font-weight: 600;
//   font-size: 20px;
//   margin-block: 1rem 1rem;
// `;
const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

const POIDetails = (props) => {
  const isSmallScreen = useMediaQuery("(max-width:586px)");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aboutText, setAboutText] = useState(
    props?.data?.overview ?? props?.data?.short_description
  );
  const itinerary = useSelector((state) => state.Itinerary);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [showDrawer, setShowDrawer] = useState(false);
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

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

  const handleDelete = async (e) => {
    if (!token) {
      props?.setShowLoginModal(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.delete(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/poi/delete/`,
        {
          data: {
            itinerary_city_id: props?.itinerary_city_id,
            day_by_day_index: props?.dayIndex,
            poi_index: props?.slabIndex,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res?.status == 200) {
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        var itineraryCities = newItinerary;
        itineraryCities = newItinerary.cities.map((city) => {
          const cityTemp = city;
          if (city.id === props?.itinerary_city_id) {
            console.log(
              "here:",
              cityTemp.day_by_day[props?.dayIndex]?.slab_elements
            );
            cityTemp.day_by_day[props?.dayIndex]?.slab_elements.splice(
              props?.slabIndex,
              1
            );
          }
          return cityTemp;
        });
        newItinerary.cities = itineraryCities;
        props?.handleCloseDrawer(e);
        // props?.getPaymentHandler();

        dispatch(setItinerary(newItinerary));
        dispatch(
          openNotification({
            type: "success",
            text: `${props?.data?.name} has been removed from your itinerary`,
            heading: "Success!",
          })
        );
      }
    } catch (error) {
      console.log("error is:", error);
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        error.message ||
        "Something went wrong! Please try after some time.";
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
    }
    setLoading(false);
  };

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
    <>
      {props?.data ? (
        <Container itineraryDrawer={props.itineraryDrawer}>
          {!props.itineraryDrawer ? (
            <div>
              <BackContainer className="flex justify-between font-lexend">
                <BackArrow handleClick={(e) => props.handleCloseDrawer(e)} />
              </BackContainer>
            </div>
          ) : (
            <BackContainer className="flex justify-between font-lexend">
              <BackArrow handleClick={(e) => props.handleCloseDrawer(e)} />
            </BackContainer>
          )}
          <div className="flex justify-between">
            <Title>{props.data.name}</Title>
            {!(props?.removeChange === true) && (
              <Button
                padding="7px 25px"
                borderRadius="7px"
                onclick={() => {
                  if (!token) {
                    props?.setShowLoginModal(true);
                    return;
                  }
                  setShowDrawer(true);
                }}
              >
                Change
              </Button>
            )}
          </div>

          <>
            {props?.data?.extra_images?.length > 3 ? (
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
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(0);
                    }}
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
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(1);
                    }}
                    priority
                  />{" "}
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
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(2);
                    }}
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
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(3);
                    }}
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
            ) : props?.data?.extra_images?.length == 3 ? (
              <>
                <GridImage>
                  <Child area="1 / 1 / 5 / 4" className="div1 ">
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
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(0);
                      }}
                      priority
                    />
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
                      <Image
                        src={
                          props?.data?.extra_images?.[1]
                            ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[1]?.photo_reference}`
                            : "/media/icons/bookings/notfounds/noroom.png"
                        }
                        alt="Image 0"
                        fill
                        className="object-cover"
                        onLoad={() => OnImageLoad(1)}
                        onError={(e) => {
                          e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                          OnImageError(1);
                        }}
                        priority
                      />
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
                      <Image
                        src={
                          props?.data?.extra_images?.[2]
                            ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[2]?.photo_reference}`
                            : "/media/icons/bookings/notfounds/noroom.png"
                        }
                        alt="Image 0"
                        fill
                        className="object-cover"
                        onLoad={() => OnImageLoad(2)}
                        onError={(e) => {
                          e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                          OnImageError(2);
                        }}
                        priority
                      />
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
              </>
            ) : props?.data?.extra_images?.length == 2 ? (
              <GridImage>
                <Child area="1 / 1 / 5 / 6" className="div1 ">
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
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(0);
                      }}
                      priority
                    />
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
                    <Image
                      src={
                        props?.data?.extra_images?.[1]
                          ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[1]?.photo_reference}`
                          : "/media/icons/bookings/notfounds/noroom.png"
                      }
                      alt="Image 0"
                      fill
                      className="object-cover"
                      onLoad={() => OnImageLoad(1)}
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(1);
                      }}
                      priority
                    />
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
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(0);
                      }}
                      priority
                    />
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
            )}
          </>
          <div className="">
            {props.data?.experience_filters && (
              <Text>{experience_filters}</Text>
            )}
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
                  <div>
                    {props.data.timings?.map((e, i) => {
                      const index = e.indexOf(":");
                      const day = e.slice(0, index).trim();
                      const time = e.slice(index + 1).trim();

                      return (
                        <div key={i} className="flex gap-[22px] mb-2">
                          <div className="text-[14px] font-semibold">{day}</div>
                          <div
                            className={`text-[14px] font-normal bg-[#FAFAFA] px-[8px] py-[2px] rounded-[10px] ${
                              time == "Closed"
                                ? " bg-[rgba(220,69,65,0.1)] text-[#DC4541]"
                                : ""
                            }`}
                          >
                            {time}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                }
              </Text>
            </div>
          )}
          {props?.data?.reviews && (
            <div className="flex flex-col gap-[12px]">
              <div
                id="reviews-poi"
                className="flex !items-center justify-between"
              >
                <div className="text-[18px] font-extrabold">Reviews</div>

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
                      <p className="m-0">{props.data.rating}</p>
                    ) : null}

                    {/* {props.data?.user_ratings_total ? (
                      <u> {props.data.user_ratings_total} user reviews</u>
                    ) : null} */}
                  </div>
                </Reviews>
              </div>
              {isSmallScreen ? (
                <>
                  {props?.data?.reviews?.map((item) => (
                    <div className="w-full">
                      <ReviewPoi review={item} />
                    </div>
                  ))}
                </>
              ) : (
                <ScrollContainer>
                  {props?.data?.reviews?.map((item) => (
                    <div className="w-[289px]">
                      <ReviewPoi review={item} />
                    </div>
                  ))}
                </ScrollContainer>
              )}
            </div>
          )}
          {props.data?.tips && props.data?.tips.length > 0 ? (
            <div>
              <Heading>Tips</Heading>
              {props?.data?.tips.map((item) => (
                <Text>{item}</Text>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-[12px]">
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
              <div>{props?.data?.address}</div>
            </div>
            <div className="flex justify-between">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  justifyContent: "left",
                }}
              >
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${props?.data?.gmaps_place_id}`}
                  target="_blank"
                  style={{ color: "#0000EE", fontSize: "14px" }}
                >
                  View on Google Maps
                </a>
              </div>

              {!(props?.removeDelete == true) && props?.version != "v1" && (
                <button
                  className=" right-0  text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
                  onClick={handleDelete}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      className="flex gap-1 items-center p-1"
                      style={loading ? { visibility: "hidden" } : {}}
                    >
                      <Image src="/delete.svg" width={"20"} height={"20"} />{" "}
                      Remove from Itinerary
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
              )}
            </div>
          </div>

          <Drawer
            show={showDrawer}
            anchor={"right"}
            backdrop
            width={"50%"}
            mobileWidth={"100%"}
            className="font-lexend"
            style={{ zIndex: 1505 }}
            onHide={() => setShowDrawer(false)}
          >
            <AddPoi
              cityID={props?.cityID}
              date={props?.date}
              setShowDrawer={setShowDrawer}
              handleCloseDrawer={props?.handleCloseDrawer}
              itinerary_city_id={props?.itinerary_city_id}
              dayIndex={props?.dayIndex}
              slabIndex={props?.slabIndex}
              setShowLoginModal={props?.setShowLoginModal}
              name={props.name}
              cityName={props?.cityName}
            />
          </Drawer>
          <ToastContainer />
        </Container>
      ) : null}
    </>
  );
};

export default POIDetails;
