import { useEffect, useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getIndianPrice } from "../../../services/getIndianPrice";
import ActivityDetailsDrawer from "../../../components/drawers/activityDetails/ActivityDetailsDrawer";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdDoneAll } from "react-icons/md";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import Button from "../../../components/ui/button/Index";
import Image from "next/image";
import useMediaQuery from "../../../components/media";

const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

export default function NewActivityBooking(props) {
  const [stars, setStars] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState({
    show: false,
    data: {},
  });
  const isDesktop = useMediaQuery("(min-width: 583px)");

  useEffect(() => {
    if (props?.data && props.data?.rating) {
      const stars = [];
      for (let i = 0; i < Math.floor(props.data.rating); i++) {
        stars.push(<FaStar />);
      }
      if (Math.floor(props.data.rating) < props.data.rating) {
        stars.push(<FaStarHalfAlt />);
      }
      setStars(stars);
    }
  }, [props?.data]);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDetails({ show: false, data: {} });
  };

  const handleClick = async (id) => {
    //   const res = await axios.get(
    //     `${MERCURY_HOST}/api/v1/ancillaries/activity/${id}`
    //   );
    setShowDetails({
      show: true,
      data: "", //res?.data?.data?.activity,
    });
  };

  return (
    <div className="rounded-3xl border-sm border-solid border-text-disabled p-md cursor-pointer hover:bg-text-smoothwhite relative mt-md">
      {isDesktop ? <div id="Activity" className={`flex gap-1  flex-col justify-start `}>
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "auto 2fr",
          }}
          id="Activity"
        >
          <div>
            {" "}
            <div
              style={{
                height: "220px",
                width: "251px",
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
                width="100%"
                height="220px"
                display="absolute"
                noLazy={true}
                onload={() => {
                  setImageLoaded(true);
                }}
                onfail={() => {
                  setImageLoaded(true);
                }}
              ></ImageLoader>

              {/* Tour Type and Guide badges positioned on image */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {props?.data?.guide === "Self Guided" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px]">
                    <Image
                      src="/selfGuided.svg"
                      alt="self-guided"
                      width={16}
                      height={16}
                    />
                    <span>Self Guided</span>
                  </div>
                )}
                {props?.data?.guide === "Guided" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px]">
                    <Image
                      src="/guided.svg"
                      alt="guided"
                      width={16}
                      height={16}
                    />
                    <span>Guided</span>
                  </div>
                )}
                {props?.data?.guide === "Semi Guided" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px] ">
                    <Image
                      src="/semiGuided.svg"
                      alt="semi-guided"
                      width={16}
                      height={16}
                    />
                    <span>Semi Guided</span>
                  </div>
                )}

                {props?.data?.tour_type === "Private Tour" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px] ">
                    <Image
                      src="/privateTour.svg"
                      alt="private-tour"
                      width={16}
                      height={16}
                    />
                    <span>Private Tour</span>
                  </div>
                )}
                {props?.data?.tour_type === "Shared Tour" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px] ">
                    <Image
                      src="/sharedTour.svg"
                      alt="shared-tour"
                      width={16}
                      height={16}
                    />
                    <span>Shared Tour</span>
                  </div>
                )}
              </div>
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
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-3 text-[#01202B]  w-full h-fit justify-start">
              <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between">
                  <div className="text-md-lg leading-xl-sm font-600 mb-0 max-ph:mt-sm">
                    {(props?.data?.display_name || props.data?.name) ? (props?.data?.display_name || props.data.name) : null}
                  </div>
                </div>
                {stars && (
                  <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
                    <span className="flex flex-row text-[#FFD201] text-[12px]">
                      {stars}
                    </span>
                    <span className="text-[12px]">{props.data?.rating} . </span>
                    <span className="underline text-[12px]">
                      {props.data?.user_ratings_total} user reviews
                    </span>
                  </span>
                )}
              </div>

              {props.data?.tags?.length > 0 && (
                <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap">
                  {/* {props?.data?.category && (
                    <div className="w-max items-center bg-gray-100 text-[14px] text-gray-800  font-medium px-2 py-1 rounded-full border border-gray-300 shadow-sm">
                      {props.data.category}
                    </div>
                  )} */}
                  {
                    // props.data.experience_filters
                    props?.data?.tags
                      ?.slice(0, props?.data?.tags?.length == 1 ? 1 : 2)
                      ?.map((e, i) => (
                        <span
                          key={i}
                          className={`rounded-full px-2 py-1`}
                          style={{ backgroundColor: colors[i % colors.length] }}
                        >
                          {e}
                        </span>
                      ))}
                  {props?.data?.tags?.length > 2 && (
                    <span className={`border-1 rounded-full px-2 py-1`}>
                      +
                      {props?.data?.tags?.length -
                        2
                      }{" "}
                      more
                    </span>
                  )}

                  {/* One-Liner Description */}
                  {
                    props?.data?.one_liner_description &&
                    <div className=" text-sm text-[#6E757A] line-clamp-3 text-[14px]">
                      {props.data.one_liner_description}
                    </div>
                  }
                </div>
              )}


            </div>
            <div className="flex flex-row items-center justify-between">
              {props.data?.pricing?.total_price ? (
                <div className="flex flex-col md:flex-row gap-2 items-baseline">
                  <div className="text-text-charcolblack text-lg font-700 leading-2xl-md max-ph:mb-sm">
                    <span
                      className="!font-[lexend]"
                      style={{ fontFamily: "Lexend" }}
                    >
                      ₹
                    </span>
                    {getIndianPrice(Math.round(props.data.pricing.total_price))}
                  </div>
                  <div className="text-text-spacegrey text-sm-md font-400 leading-lg mt-xxs">
                    for {props.data.pricing.total_pax} people*
                  </div>
                </div>
              ) : null}

              {props?.data?.added_in_itinerary?.selected ? (
                <div className="whitespace-nowrap font-semibold">
                  <TransparentButton>
                    <MdDoneAll
                      style={{
                        display: "inline",
                        marginRight: "0.35rem",
                      }}
                    />
                    Added
                    {props?.data?.added_in_itinerary?.added_on
                      ? ` on ${convertDateFormat(
                        props?.data?.added_in_itinerary?.added_on
                      )}`
                      : null}
                  </TransparentButton>
                </div>
              ) : (
                <button onClick={() => handleClick(props.data?.id)} className="ttw-btn-secondary max-ph:w-full">
                  Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div> :

        <div id="Activity">
          <div>
            <div
              style={{
                height: "220px",
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
                width="100%"
                height="220px"
                display="absolute"
                noLazy={true}
                onload={() => {
                  setImageLoaded(true);
                }}
                onfail={() => {
                  setImageLoaded(true);
                }}
              ></ImageLoader>

              <div className="absolute bottom-3 left-3 flex gap-2">
                {props?.data?.guide === "Self Guided" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px]">
                    <Image
                      src="/selfGuided.svg"
                      alt="self-guided"
                      width={16}
                      height={16}
                    />
                    <span>Self Guided</span>
                  </div>
                )}
                {props?.data?.guide === "Guided" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px]">
                    <Image
                      src="/guided.svg"
                      alt="guided"
                      width={16}
                      height={16}
                    />
                    <span>Guided</span>
                  </div>
                )}
                {props?.data?.guide === "Semi Guided" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px] ">
                    <Image
                      src="/semiGuided.svg"
                      alt="semi-guided"
                      width={16}
                      height={16}
                    />
                    <span>Semi Guided</span>
                  </div>
                )}

                {props?.data?.tour_type === "Private Tour" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px] ">
                    <Image
                      src="/privateTour.svg"
                      alt="private-tour"
                      width={16}
                      height={16}
                    />
                    <span>Private Tour</span>
                  </div>
                )}
                {props?.data?.tour_type === "Shared Tour" && (
                  <div className="flex items-center gap-1 bg-[#f7e700] text-black px-[0.7rem] py-2 rounded-2xl text-[12px] ">
                    <Image
                      src="/sharedTour.svg"
                      alt="shared-tour"
                      width={16}
                      height={16}
                    />
                    <span>Shared Tour</span>
                  </div>
                )}
              </div>


            </div>
            <div
              style={{
                height: "220px",
                overflow: "hidden",
                borderRadius: "16px",
                display: !imageLoaded ? "block" : "none",
              }}
            >
              <SkeletonCard height={"100%"} />
            </div>
          </div>

          <div className="text-md-lg leading-xl-sm font-600 mb-0 max-ph:mt-sm">
            {props.data?.name || props?.display_name ? props.data.name : null}
          </div>

          {stars && (
            <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a] mt-1">
              <span className="flex flex-row text-[#FFD201] text-[12px]">
                {stars}
              </span>
            </span>
          )}

          {props.data?.tags?.length > 0 && (
            <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap py-2">
              {/* {props?.data?.category && (
              <div className="w-max items-center bg-gray-100 text-[14px] text-gray-800  font-medium px-2 py-1 rounded-full border border-gray-300 shadow-sm">
                {props.data.category}
              </div>
            )} */}
              {props.data.tags
                ?.slice(0, props?.data?.tags.length < 2 ? props?.data?.tags.length : 2)
                ?.map((e, i) => (
                  <span
                    key={i}
                    className={` rounded-full px-2 py-1`}
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {e}
                  </span>
                ))}
              {props?.data?.tags?.length > 2 && (
                <span className={` rounded-full px-2 py-1`}>
                  +
                  {props?.data?.tags?.length - 2
                    ? 1
                    : 2}{" "}
                  more
                </span>
              )}


            </div>
          )}

          {
            props?.data?.one_liner_description &&
            <div className=" text-sm text-[#6E757A] line-clamp-3 text-[14px] py-2">
              {props.data.one_liner_description}
            </div>
          }
          {/* 
        <div className="flex gap-2 flex-col  mt-2 text-[14px] text-gray-800">
         
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
        </div> */}

          <div className="flex flex-row items-center justify-between py-1">
            {props.data?.pricing?.total_price ? (
              <div className="flex gap-1">
                <div className="text-text-charcolblack text-lg font-700 leading-2xl-md max-ph:mb-sm">
                  <span>₹</span>
                  {getIndianPrice(Math.round(props.data.pricing.total_price))}
                </div>
                <div className="text-[14px] mt-[10px]">
                  for {props.data.pricing.total_pax} people*
                </div>
              </div>
            ) : null}
          </div>

          {props?.data?.added_in_itinerary?.selected ? (
            <div className="whitespace-nowrap font-semibold">
              <TransparentButton>
                <MdDoneAll
                  style={{
                    display: "inline",
                    marginRight: "0.35rem",
                  }}
                />
                Added
                {props?.data?.added_in_itinerary?.added_on
                  ? ` on ${convertDateFormat(
                    props?.data?.added_in_itinerary?.added_on
                  )}`
                  : null}
              </TransparentButton>
            </div>
          ) : (
            <div className="w-full flex justify-end">
               <button onClick={() => handleClick(props.data?.id)} className="ttw-btn-secondary max-ph:w-full">
                  Details
                </button>
            </div>
            // <div
            //   className="h-full text-blue underline cursor-pointer"
            //   onClick={() => handleClick(props.data?.id)}
            // >
            //   View Details
            // </div>
          )}
        </div>
      }
      <ActivityDetailsDrawer
        itineraryDrawer
        date={props.date}
        show={showDetails.show}
        setShowDetails={setShowDetails}
        activityId={props.data?.id}
        handleCloseDrawer={handleCloseDrawer}
        Topheading={"Select Our Activity"}
        getAccommodationAndActivitiesHandler={
          props.getAccommodationAndActivitiesHandler
        }
        cityId={props?.cityId}
        itinerary_city_id={props?.itinerary_city_id}
        setActivities={props?.setActivities}
        activities={props?.activities}
        setItinerary={props?.setItinerary}
        activityBookings={props.activityBookings}
        setActivityBookings={props.setActivityBookings}
        setShowLoginModal={props?.setLoginModal}
        pax={props?.pax}
        setShowDrawer={props?.setShowDrawer}
      />
      {props.data?.is_recommended && (
        <div > {/* <RecommendedBadge /> */}
          <div className=" bg-tag-grass text-white absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-xl left-xl">

            <span>Recommended</span>
          </div>
        </div>
      )}
    </div>
  );
}
