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

const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

export default function PoiDetails(props) {
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
  });

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

  const handleUpdate = () => {
    if (!token) {
      props.setShowLoginModal(true);
      console.log("showing login drawer");
      return;
    }
    props.updatedActivityBooking();
  };

  return (
    <div className="flex flex-col gap-4 pb-[100px] h-[100vh] overflow-y-auto">
      <div className="flex flex-col gap-4 px-[20px] pb-4">
        <div className="sticky top-0 z-1 flex flex-row items-center gap-2 mt-4 bg-white">
          <BackArrow handleClick={(e)=>props.handleCloseDrawer(e)}/>
        </div>

        <div className={`flex flex-col gap-4 `}>
          <div className="h-[180px] md:h-[300px]">
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
          {props.data?.city && (
            <div>
              <span className="font-bold pr-1 text-[14px] font-semibold text-[#01202B]">
                Address:
              </span>{" "}
              <span className="text-[14px] text-[#01202B]">
                {props.data.city}
              </span>
            </div>
          )}

          {/* <div className="flex flex-col gap-3 md:flex-row md:items-center justify-end">
          <Travelers
            travelers={props.filterState.pax.number_of_travelers}
            travelerAges={props.filterState.pax.traveler_ages}
            setFilterState={props.setFilterState}
          />
        </div> */}

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
                <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                  <div>General guidelines</div>
                  {!boolDetails?.generalGuidelines ? (
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
                  )}
                </div>
                {boolDetails?.generalGuidelines&&<div className="text-[14px]">
                  <ul style={{ paddingLeft: "0.5rem" }}>
                    {props.data.general_guidelines?.map((e, i) => (
                      <li key={i}>- {e}</li>
                    ))}
                  </ul>
                </div>}
              </div>
            ) : (
              <></>
            )}

            {props.data?.things_to_bring &&
            props.data?.things_to_bring?.length ? (
              <div className="flex flex-col">
                <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                  <div>Things to bring</div>
                  {!boolDetails?.thingsToBring ? (
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
                  )}
                </div>
                {!boolDetails?.thingsToBring&&<div className="text-[14px]">
                  <ul style={{ paddingLeft: "0.5rem" }}>
                    {props.data.things_to_bring?.map((e, i) => (
                      <li key={i}>- {e}</li>
                    ))}
                  </ul>
                </div>}
              </div>
            ) : (
              <></>
            )}

            {props.data?.not_suitable_for &&
            props.data?.not_suitable_for?.length ? (
              <div className="flex flex-col">
                <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                  <div>Not suitable for</div>
                  {boolDetails?.notSuitableFor ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          boolDetails: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          boolDetails: false,
                        }))
                      }
                    />
                  )}
                </div>
                {boolDetails?.notSuitableFor&&<div className="text-[14px]">
                  <ul style={{ paddingLeft: "0.5rem" }}>
                    {props.data.not_suitable_for?.map((e, i) => (
                      <li key={i}>- {e}</li>
                    ))}
                  </ul>
                </div>}
              </div>
            ) : (
              <></>
            )}

            {props.data?.tips_tricks && props.data?.tips_tricks?.length ? (
              <div className="flex flex-col">
                <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                  <div>Tips, Tricks and Cautions</div>
                  {!boolDetails?.tipsTricks ? (
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
                  )}
                </div>
                {boolDetails?.tipsTricks&&<div className="text-[14px]">
                  <ul style={{ paddingLeft: "0.5rem" }}>
                    {props.data.tips_tricks?.map((e, i) => (
                      <li key={i}>- {e}</li>
                    ))}
                  </ul>
                </div>}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="border-t-2 fixed bottom-0 right-0 left-0 flex justify-end gap-1 py-[12px] px-[20px] bg-white shadow-md z-50">
          <div className="flex flex-col gap-1">
          <button
            onClick={handleUpdate}
            className="bg-[#F7E700] py-2 px-4 border-2 border-black rounded-lg"
          >
            {props.data?.city && "Add to Itinerary"}
          </button>
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
