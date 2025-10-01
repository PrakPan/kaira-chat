import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { TbArrowBack } from "react-icons/tb";
import { MERCURY_HOST } from "../../../services/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import setItinerary from "../../../store/actions/itinerary";
import ReviewPoi from "../../POIDetails/Reviews";
import useMediaQuery from "../../media";
import { openNotification } from "../../../store/actions/notification";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { FaStar, FaStarHalfAlt, FaClock } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import { IoFastFood, IoTicket } from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";
import ImageLoader from "../../ImageLoader";
import SkeletonCard from "../../ui/SkeletonCard";
import BackArrow from "../../ui/BackArrow";
import { useAnalytics } from "../../../hooks/useAnalytics";
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

const ActivityDetails = (props) => {
  let isPageWide = useMediaQuery("(min-width: 768px)");

  const isSmallScreen = useMediaQuery("(max-width:586px)");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aboutText, setAboutText] = useState(
    props?.data?.overview ?? props?.data?.short_description
  );
  const itinerary = useSelector((state) => state.Itinerary);
  const token = useSelector((state) => state.auth.token);
  const [imageLoaded, setImageLoaded] = useState(false);

  const dispatch = useDispatch();

  const {trackActivityBookingDelete} = useAnalytics();

  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);

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

  const [boolDetails, setBoolDetail] = useState({
    generalGuidelines: false,
    thingsToBring: false,
    notSuitableFor: false,
    tipsTricks: false,
    Amenities: false,
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
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/activity/${props?.data?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));


      if (res?.status == 204) {
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        trackActivityBookingDelete(router.query.id,props?.data?.id,"ActivityDetailsDrawer");

        const itineraryCities = newItinerary.cities.map((city) => {
          if (city.id === props?.itinerary_city_id) {
            city.day_by_day.forEach((day, index) => {
              if (day?.slab_elements) {
                day.slab_elements = day.slab_elements.filter(
                  (item) => item?.booking?.id !== props?.data?.id
                );
              }
            });

            city.activities = city.activities?.filter(
              (item) => item?.id !== props?.data?.id
            );
          }

          return city;
        });

        newItinerary.cities = itineraryCities;

        props?.handleCloseDrawer(e);
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

  var tags = (
    <div className="flex flex-wrap gap-2">
      {props.data?.tags?.map((e, i) => (
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
      {props.data.tips?.map((e, i) => (
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
              <BackArrow handleClick={(e) => props.handleCloseDrawer(e)} />
            </BackContainer>
          )}

          <>
            {props?.data?.image && (
              <div>
                {" "}
                <div className="h-[180px] md:h-[300px] relative">
                  <div style={{ display: imageLoaded ? "initial" : "none" }}>
                    <ImageLoader
                      borderRadius="8px"
                      marginTop="23px"
                      widthMobile="100%"
                      width="100%"
                      height="100%"
                      url={
                        props.data.image
                          ? props.data.image
                          : "media/icons/bookings/notfounds/noroom.png"
                      }
                      dimensionsMobile={{ width: 500, height: 295 }}
                      dimensions={{ width: 468, height: 295 }}
                      onload={() => {
                        setTimeout(() => {
                          setImageLoaded(true);
                        }, 1000);
                      }}
                      onfail={() => {
                        setImageLoaded(true);
                      }}
                      noLazy
                    ></ImageLoader>
                  </div>

                  <div
                    style={{
                      display: !imageLoaded ? "initial" : "none",
                    }}
                  >
                    <SkeletonCard
                      width={"100%"}
                      height={isPageWide ? "300px" : "180px"}
                    />
                  </div>
                </div>
                {/* <div
                  style={{
                    height: "220px",
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "16px",
                    display: imageLoaded ? "block" : "none",
                  }}
                  className="relative"
                >
                  <ImageLoader
                    fit="cover"
                    url={
                      props?.data?.image
                        ? props.data?.image
                        : "media/website/grey.png"
                    }
                    borderRadius="8px"
                    marginTop="23px"
                    widthMobile="100%"
                    width="100%"
                    height="100%"
                    display="absolute"
                    noLazy={true}
                    onload={() => {
                      setImageLoaded(true);
                    }}
                    onfail={() => {
                      setImageLoaded(true);
                    }}
                  ></ImageLoader>
                </div>
                <div
                  style={{
                    height: "220px",
                    width: "251px",
                    overflow: "hidden",
                    borderRadius: "16px",
                    display: !imageLoaded ? "block" : "none",
                  }}
                >
                  <SkeletonCard height={"100%"} />
                </div> */}
              </div>
            )}
          </>
          <div className="">
            <Title>{props?.data?.display_name || props.data.name}</Title>
            {props.data?.tags && (
              <Text>{tags}</Text>
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

             {props.activityData?.inclusions && props.activityData?.inclusions?.length > 0 && (
            <div className="flex flex-col gap-2 mb-[30px]">
              <div className="text-[20px] font-semibold text-green">Inclusions</div>
              <div className="border-b-[1px]"></div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.activityData.inclusions.map((inclusion, i) => (
                    <li key={i} className="mb-1">- {inclusion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Exclusions Section */}
          {props.activityData?.exclusions && props.activityData?.exclusions?.length > 0 && (
            <div className="flex flex-col gap-2 mb-[30px]">
              <div className="text-[20px] font-semibold text-red">Exclusions</div>
              <div className="border-b-[1px]"></div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.activityData.exclusions.map((exclusion, i) => (
                    <li key={i} className="mb-1">- {exclusion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
            {props.data?.address && (
              <div>
                <span className="font-bold pr-1">Address:</span>{" "}
                {props.data.address}
              </div>
            )}
          </div>

          {props.data?.hotel_pickup_included ? (
            <div className="flex items-center gap-1 text-[14px] bg-[#e6f9ec] text-[#3BAF75] font-semibold rounded-sm w-max px-1">
              <Image
                src="/hotelPickupIncluded.svg"
                alt="hotel-pickup-included"
                width={20}
                height={20}
              />
              <span className=" px-2 py-1 mb-0 rounded-md text-xs font-medium">
                Hotel Pickup Included
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[14px] bg-[#FCE3DB] text-[#EE724B] font-semibold w-max rounded-sm px-1">
              <Image
                src="/notHotelPickupIncluded.svg"
                alt="not-hotel-pickup-included"
                width={20}
                height={20}
              />
              <span className=" px-2 py-1 mb-0 rounded-md text-xs font-medium">
                Hotel pickup not included
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap text-[14px] text-gray-800">
            {/* Tour Type */}
            {props?.data?.tour_type === "Private Tour" && (
              <div className="flex items-center gap-1">
                <Image
                  src="/privateTour.svg"
                  alt="private-tour"
                  width={20}
                  height={20}
                />
                <span>Private Tour</span>
              </div>
            )}
            {props?.data?.tour_type === "Shared Tour" && (
              <div className="flex items-center gap-1">
                <Image
                  src="/sharedTour.svg"
                  alt="shared-tour"
                  width={20}
                  height={20}
                />
                <span>Shared Tour</span>
              </div>
            )}

            {/* Guide Type */}
            {props?.data?.guide === "Guided" && (
              <div className="flex items-center gap-1">
                <Image src="/guided.svg" alt="guided" width={20} height={20} />
                <span>Guided</span>
              </div>
            )}
            {props?.data?.guide === "Self Guided" && (
              <div className="flex items-center gap-1">
                <Image
                  src="/selfGuided.svg"
                  alt="self-guided"
                  width={20}
                  height={20}
                />
                <span>Self Guided</span>
              </div>
            )}
            {props?.data?.guide === "Semi Guided" && (
              <div className="flex items-center gap-1">
                <Image
                  src="/semiGuided.svg"
                  alt="semi-guided"
                  width={20}
                  height={20}
                />
                <span>Semi Guided</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {props.data?.general_guidelines?.length ? (
              <div className="flex flex-col">
                <div
                  className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px] cursor-pointer"
                  onClick={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      generalGuidelines: !prev.generalGuidelines,
                    }))
                  }
                >
                  <div>General guidelines</div>
                  {boolDetails?.generalGuidelines ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
                {boolDetails?.generalGuidelines && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.general_guidelines.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {props.data?.things_to_bring?.length ? (
              <div className="flex flex-col">
                <div
                  className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px] cursor-pointer"
                  onClick={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      thingsToBring: !prev.thingsToBring,
                    }))
                  }
                >
                  <div>Things to bring</div>
                  {boolDetails?.thingsToBring ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
                {boolDetails?.thingsToBring && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.things_to_bring.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {props.data?.not_suitable_for?.length ? (
              <div className="flex flex-col">
                <div
                  className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px] cursor-pointer"
                  onClick={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      notSuitableFor: !prev.notSuitableFor,
                    }))
                  }
                >
                  <div>Not suitable for</div>
                  {boolDetails?.notSuitableFor ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
                {boolDetails?.notSuitableFor && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.not_suitable_for.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {props.data?.tips_tricks?.length ? (
              <div className="flex flex-col">
                <div
                  className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px] cursor-pointer"
                  onClick={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      tipsTricks: !prev.tipsTricks,
                    }))
                  }
                >
                  <div>Tips, Tricks and Cautions</div>
                  {boolDetails?.tipsTricks ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
                {boolDetails?.tipsTricks && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.tips_tricks.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {props?.activityData?.selected_amenities &&
            props?.activityData?.selected_amenities?.length > 0 && (
              <div className="flex flex-col gap-2 relative">
                <div className="text-[20px] font-semibold">Add - Ons</div>
                <div className="border-b-[1px]"></div>
                <div className="flex flex-col gap-2">
                  {props?.activityData?.selected_amenities.map(
                    (amenity, index) => (
                      <Amenity key={index} index={index} amenity={amenity} />
                    )
                  )}
                </div>
              </div>
            )}

            {props.activityData?.prices && props.activityData?.prices.length && (props.activityData?.prices[0]?.title || props.activityData?.prices[0]?.description) && <div className="flex flex-col">
                <div className="text-[20px] font-semibold mb-2">
                Package Details
                </div>
                <div className="font-medium text-gray-900">
                  {props.activityData?.prices[0]?.title ? props.activityData?.prices[0]?.title : null}
                </div>
                <div className="font-normal text-gray-900">
                  {props.activityData?.prices[0]?.description ? props.activityData?.prices[0]?.description : null}
                </div>
                <div className="text-sm text-gray-600">
                  For {props.activityData?.prices[0]?.pax_details.adults + props.activityData?.prices[0]?.pax_details.children} people
                </div>
              </div>}


          {props?.data?.cancellation_policies && (
            <>
              <div className="text-[20px] font-semibold">
                Cancellation Policies
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: props?.data?.cancellation_policies,
                }}
                className="flex flex-col gap-1 text-sm ml-4"
              ></div>
            </>
          )}

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
            <div className="flex flex-col gap-[12px]">
              <div
                id="reviews-poi"
                className="flex justify-between items-center"
              >
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
          {props.data?.tips && props.data?.tips.length ? (
            <div>
              <Heading>Tips</Heading>
              <Text>{tips}</Text>
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-[12px]">
            <div className="flex justify-end">
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  justifyContent: "left",
                }}
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${
                    props?.data?.latitude
                  },${props?.data?.longitude}+(${props?.data?.name
                    ?.split(" ")
                    .join("+")})`}
                  target="_blank"
                  style={{ color: "#0000EE", fontSize: "14px" }}
                >
                  View on Google Maps
                </a>
              </div> */}

              {
                // props?.version != "v1" ? (
                //   <></>
                // )
                <>
                  {" "}
                  {props?.removeDelete == false && (
                    <button
                      className=" right-0  text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
                      onClick={handleDelete}
                    >
                      <div style={{ position: "relative" }}>
                        <div
                          className="flex gap-1 items-center p-1"
                          style={loading ? { visibility: "hidden" } : {}}
                        >
                          <Image src="/delete.svg" width={"20"} height={"20"} alt="delete"/>{" "}
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
                </>
              }
            </div>
          </div>
        </Container>
      ) : null}
    </>
  );
};

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
      </div>
    </div>
  );
};

export default ActivityDetails;
