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
import { Pax } from "./Pax";
import BackArrow from "../../ui/BackArrow";
import Button from "../../../components/ui/button/Index";
const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

export default function ActivityDetails(props) {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [stars, setStars] = useState([]);
  const [inclusiveCost, setInclusiveCost] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [boolDetails, setBoolDetail] = useState({
    generalGuidelines: false,
    thingsToBring: false,
    notSuitableFor: false,
    tipsTricks: false,
    Amenities: false,
  });
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
      props?.setShowLoginModal(true);
      return;
    }
    props.updatedActivityBooking(e).then(() => {
      setLoading(false);
      props?.handleCloseDrawer(e);
    });
  };

  const handleAmenityChange = async (index, included) => {
    let amenities = props.data?.amenities.filter(
      (amenity, i) => i !== index && amenity.included
    );

    if (included) {
      amenities.push(props.data?.amenities[index]);
    }

    const res = await props.fetchData({
      amenities: amenities.map((amenity) => amenity?.id),
    });
  };

  return (
    <div className="h-[100vh] overflow-y-auto px-4">
      <div className="flex flex-col gap-4  mb-[100px]">
        <div className="z-1 flex flex-row items-center gap-2 pt-4 bg-white">
          <BackArrow handleClick={(e) => props.handleCloseDrawer(e)} />
        </div>
        {/* <div className="flex justify-between">
          <div className="text-[24px] font-semibold">Activity Details</div>
        </div> */}
        {props.updateAmenities && (
          <div className="fixed top-[65%] left-[50%] -translate-x-[50%] z-50 flex flex-row items-center gap-2">
            Updating
            <div className="w-5 h-5 border-2 rounded-full border-t-black animate-spin"></div>
          </div>
        )}

        <div
          className={`flex flex-col gap-4 ${
            props.updateAmenities && "opacity-50"
          }`}
        >
          <div className="h-[180px] md:h-[300px] relative">
            <div style={{ display: imageLoaded ? "initial" : "none" }}>
              <ImageLoader
                borderRadius="8px"
                marginTop="23px"
                widthMobile="100%"
                width="100%"
                height="100%"
                url={
                  props.data.image && !imageFail
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
                  setImageFail(true);
                  setImageLoaded(true);
                }}
                noLazy
              ></ImageLoader>

              {props.data?.ideal_duration_number ? (
                <div className="absolute bottom-1 left-2 bg-[#000000] text-white px-[16px] py-[2px] rounded-full flex flex-row items-center gap-2">
                  <div className="text-[14px]">Approx Time:</div>
                  <div className="text-[14px]">
                    {props.data.ideal_duration_number}{" "}
                    {props.data.ideal_duration_number > 1
                      ? props.data?.ideal_duration_unit?.toLowerCase()
                      : props.data?.ideal_duration_unit
                          ?.toLowerCase()
                          ?.slice(0, -1)}
                  </div>
                </div>
              ) : (
                <></>
              )}
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

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="text-[20px] font-[800]">{props.data.name}</div>
            </div>
            <Pax pax={props?.filterState} setPax={props?.setFilterState} />

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

          <div className="flex items-center gap-4 flex-wrap mt-2 text-[14px] text-gray-800">
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

          <div>
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

          {props.data?.amenities && props.data?.amenities?.length ? (
            <div className="flex flex-col gap-2  mb-[30px]">
              <div className="text-[20px] font-semibold">Add - Ons</div>
              <div className="border-b-[1px]"></div>
              <div className="flex flex-col gap-2">
                {props.data.amenities.map((amenity, index) => (
                  <div>
                    <Amenity
                      key={index}
                      index={index}
                      amenity={amenity}
                      handleAmenityChange={handleAmenityChange}
                      travelers={props.filterState?.number_of_travelers}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
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
      </div>
      <div
        className={`scroll-none border-t-2 fixed bottom-0 right-0 left-0  gap-1 py-[12px] px-[20px] bg-white shadow-md z-50 
        `}
      >
        <div className="flex justify-between items-center">
          <>
            {props.data?.prices?.total_price && (
              <div className="font-bold">
                <span className="text-[34px]">
                  ₹
                  {props.data?.prices?.total_price &&
                  props.data?.prices?.total_price > 0
                    ? getIndianPrice(Math.round(props.data.prices.total_price))
                    : props.data.prices.total_price}
                </span>
              </div>
            )}
          </>
          <Button
            onclick={handleUpdate}
            bgColor={"#F7E700"}
            borderRadius="8px"
            hoverBgColor="black"
            fontWeight="400"
            height={"full"}
            loading={loading}
          >
            <div>{props.data?.city && "Add to Itinerary"}</div>
          </Button>
        </div>
        <div className={`flex justify-between items-center`}>
          <span className="text-[12px] font-normal">
            {" "}
            for {props?.filterState.adults + props?.filterState?.children}{" "}
            people{" "}
          </span>
          <div className="text-[14px] sm:text-[16px]">
            on {dateFormat(props?.date)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Amenity = ({ index, amenity, handleAmenityChange, travelers }) => {
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
    console.log("here");
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

      {amenity.price == 0 ? (
        <div className=" text-md font-semibold  text-[#277004] ">
          Included for free
        </div>
      ) : (
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
      )}
    </div>
  );
};
