import React, { useEffect } from "react";
import { useState } from "react";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import SkeletonCard from "../../ui/SkeletonCard";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { dateFormat } from "../../../helper/DateUtils";
import { FaStar, FaStarHalfAlt, FaClock } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import { IoFastFood, IoTicket } from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";
import Image from "next/image";
import { useSelector } from "react-redux";
import BackArrow from "../../ui/BackArrow";
import styled from "styled-components";
import ReviewPoi from "../../../components/POIDetails/Reviews";
import { MERCURY_HOST } from "../../../services/constants";
import Button from "../../../components/ui/button/Index";
import { PulseLoader } from "react-spinners";

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

const colors = ["#d5f5d3", "#fadadd", "#F5F0FF", "#DDF4C5"];

export default function ChangePoiDetails(props) {
  const isSmallScreen = media("(max-width:586px)");

  let isPageWide = media("(min-width: 768px)");
  const [stars, setStars] = useState([]);
  const [inclusiveCost, setInclusiveCost] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [boolDetails, setBoolDetail] = useState({
    generalGuidelines: true,
    thingsToBring: true,
    notSuitableFor: true,
    tipsTricks: true,
  });

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (props.data?.amenities?.length) {
      for (let amenity of props.data.amenities) {
        if (amenity?.included) {
          setInclusiveCost((prev) => [...prev, amenity.name]);
        }
      }
    }

    return () => {
      setInclusiveCost([]);
    };
  }, [props.data]);

  useEffect(() => {
    var stars = [];
    for (let i = 0; i < Math.floor(props.data.rating); i++) {
      stars.push(<FaStar />);
    }

    if (Math.floor(props.data.rating) < props.data.rating)
      stars.push(<FaStarHalfAlt />);

    setStars(stars);
  }, []);

  const handleUpdate = (e) => {
    setLoading(true);
    if (!token) {
      props.setShowLoginModal(true);
      setLoading(false);
      return;
    }
    props.updatedActivityBooking().then((res) => {
      setLoading(false);
      if (res != 0) {
        props?.setShowDrawer(false);
        props?.handleCloseDrawer(e);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-[100px] h-[100vh] overflow-y-auto">
      <div className="flex flex-col gap-4 px-[20px] pb-4">
        <div className="sticky top-0 z-1 flex flex-row items-center gap-2 pt-4 bg-white">
          <BackArrow
            handleClick={() => props.setShowDetails({ show: false, data: {} })}
          />
        </div>

        <div className={`flex flex-col gap-4 `}>
          {props?.data?.extra_images?.length > 0 && (
            <GridImage>
              <Child area="1 / 1 / 5 / 4" className="div1">
                <Image
                  src={
                    props?.data?.extra_images?.[0]
                      ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[0]?.photo_reference}`
                      : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
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
                      : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                  }
                  alt="Image 1"
                  fill
                  className="object-cover"
                  onLoad={() => OnImageLoad(1)}
                  onError={() => OnImageError(1)}
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
                      : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
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
                      : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
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

          <div className="flex flex-col gap-3">
            <div className="text-[20px] font-[800]">{props.data.name}</div>

            {props?.data?.rating && (
              <div className="flex items-center gap-1">
                {props.data?.rating && (
                  <div
                    style={{ color: "#FFD201", marginBottom: "0.3rem" }}
                    className="flex flex-row gap-1"
                  >
                    {stars}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center" }}>
                  {props.data?.rating && (
                    <p
                      className="text-[12px] text-[#7a7a7a]"
                      style={{ marginBlock: "auto" }}
                    >
                      {props.data.rating} ·
                    </p>
                  )}

                  {props.data?.user_ratings_total > 0 && (
                    <u className="text-[12px] text-[#7a7a7a]">
                      {props.data.user_ratings_total}
                      {" user reviews"}
                    </u>
                  )}
                </div>
              </div>
            )}
            {props.data?.experience_filters && (
              <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap">
                {props.data.experience_filters?.map((e, i) => (
                  <span
                    key={i}
                    className={`border-2 rounded-full px-2 py-1`}
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            )}
            {props.data?.short_description && (
              <div className="flex flex-col gap-2">
                <div className="text-[14px] text-[#01202B]">
                  {props.data.short_description}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
            {props.data?.prices?.total_price ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-center text-sm">
                  <span className="font-bold text-lg md:text-2xl">
                    ₹{getIndianPrice(Math.round(props.data.prices.total_price))}
                  </span>
                  {`for ${props.data.prices?.total_pax} people`}
                </div>

                {inclusiveCost.length ? (
                  <div className="text-sm flex flex-row items-center gap-1 flex-wrap">
                    Inclusive of{" "}
                    {inclusiveCost.map((item, index) => (
                      <span
                        key={index}
                        className="border-2 rounded-full px-2 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div>
            {props.data?.general_guidelines &&
            props.data?.general_guidelines?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>General guidelines</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
                  {/* {!boolDetails?.generalGuidelines ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          generalGuidelines: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          generalGuidelines: false,
                        }))
                      }
                    />
                  )} */}
                </div>
                {boolDetails?.generalGuidelines && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.general_guidelines?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {props.data?.things_to_bring &&
            props.data?.things_to_bring?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>Things to bring</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
                  {/* {!boolDetails?.thingsToBring ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          thingsToBring: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          thingsToBring: flase,
                        }))
                      }
                    />
                  )} */}
                </div>
                {!boolDetails?.thingsToBring && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.things_to_bring?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {props.data?.not_suitable_for &&
            props.data?.not_suitable_for?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>Not suitable for</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
                  {/* {!boolDetails?.notSuitableFor ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          notSuitableFor: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          notSuitableFor: false,
                        }))
                      }
                    />
                  )} */}
                </div>
                {boolDetails?.notSuitableFor && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.not_suitable_for?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {props.data?.tips_tricks && props.data?.tips_tricks?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>Tips, Tricks and Cautions</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
                  {/* {!boolDetails?.tipsTricks ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          tipsTricks: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          tipsTricks: false,
                        }))
                      }
                    />
                  )} */}
                </div>
                {boolDetails?.tipsTricks && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.tips_tricks?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
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
                              ? " bg-[rgba(220,69,65,0.1)]  text-[#DC4541]"
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
            <div id="reviews-poi" className="flex justify-between">
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
                  <div className="w-[289px]">
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
        </div>

        <div className="border-t-2 fixed bottom-0 right-0 left-0 flex justify-end gap-1 py-[12px] px-[20px] bg-white shadow-md z-50">
          <div className="flex flex-col gap-1">
            <Button
              onclick={handleUpdate}
              bgColor={"#F7E700"}
              borderRadius="8px"
              fontWeight="400"
              hoverColor="white"
              height={"full"}
              padding={"8px 16px"}
              loading={loading}
            >
              <>{props.data?.city && "Add to Itinerary"}</>
            </Button>

            {dateFormat(props?.date)}
          </div>
        </div>
      </div>
    </div>
  );
}

const Amenity = ({ index, amenity, handleAmenityChange, travelers }) => {
  const [included, setIncluded] = useState(amenity?.included);

  useEffect(() => {
    setIncluded(amenity?.included);
  }, [amenity]);

  const getAmenityIcon = (type) => {
    switch (type) {
      case "Guide":
        return <FaPerson />;
      case "Transportation":
        return <MdTransferWithinAStation />;
      case "Meal":
        return <IoFastFood />;
      case "Entry Ticket":
        return <IoTicket />;
      default:
        return <BiSolidCustomize />;
    }
  };

  const handleSelect = () => {
    handleAmenityChange(index, !included);
    setIncluded((prev) => !prev);
  };

  return (
    <div key={index} className=" gap-3  bg-[#FAFAFA] p-[10px] rounded-[4px]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2 text-[16px] font-medium">
          {/* {getAmenityIcon(amenity?.type)} */}
          {amenity.name}
        </div>
        <div className="text-[14px]">{amenity.description}</div>
        <div className="flex text-[12px] font-medium">
          <Image src="/ticket.svg" alt="ticket" width={13.33} height={10.67} />
          {travelers} tickets
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="font-semibold text-[24px]">
          ₹{getIndianPrice(amenity.price)}{" "}
          <span className="text-[14px] font-normal">per person*</span>
        </div>

        <button
          disabled={amenity.mandatory}
          onClick={handleSelect}
          className="flex flex-row items-center gap-1 cursor-pointer"
        >
          <CheckboxFormComponent checked={included} />
        </button>
      </div>
    </div>
  );
};
