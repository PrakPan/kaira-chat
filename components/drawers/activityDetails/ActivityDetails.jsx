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
const colors = ["#d5f5d3", "#fadadd", "#F5F0FF", "#DDF4C5"];

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
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
  if (props.data?.prices?.length > 0) {
    setSelectedPackage(props.data.prices[0]);
  }
}, [props.data?.prices]);


  useEffect(() => {
  if (props.data?.prices?.length > 0) {
    setSelectedPackage(props.data.prices[0]);
  }
}, [props.data?.prices]);

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
    const bookingData = {
      ...e,
      result_index: selectedPackage?.result_index
    };

    props.updatedActivityBooking(bookingData).then(() => {
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
      <div className="flex flex-col gap-4  mb-[100px] pb-[20px]">
        <div className="mt-xl">
          <Image src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={(e) => props.handleCloseDrawer(e)} />
        </div>
        {props.updateAmenities && (
          <div className="fixed top-[65%] left-[50%] -translate-x-[50%] z-50 flex flex-row items-center gap-2">
            Updating
            <div className="w-5 h-5 border-2 rounded-full border-t-black animate-spin"></div>
          </div>
        )}

        <div
          className={`flex flex-col gap-4 ${props.updateAmenities && "opacity-50"
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
              <div className="text-md-lg leading-xl-sm font-600 mb-0">{props.data?.display_name || props.data.name}</div>
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

            {props.data?.tags && (
              <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap">
                {props.data.tags?.map((e, i) => (
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

            {props.data?.inclusions && props.data?.inclusions?.length > 0 && (
            <div className="flex flex-col gap-2 mb-[30px]">
              <div className="text-[20px] font-semibold text-green">Inclusions</div>
              <div className="border-b-[1px]"></div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.data.inclusions.map((inclusion, i) => (
                    <li key={i} className="mb-1">- {inclusion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Exclusions Section */}
          {props.data?.exclusions && props.data?.exclusions?.length > 0 && (
            <div className="flex flex-col gap-2 mb-[30px]">
              <div className="text-[20px] font-semibold text-red">Exclusions</div>
              <div className="border-b-[1px]"></div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.data.exclusions.map((exclusion, i) => (
                    <li key={i} className="mb-1">- {exclusion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          </div>
          {props?.hotel_pickup_included ? (
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

          <div className="flex items-center gap-4 flex-wraptext-[14px] text-gray-800">
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


          {/* Inclusions Section */}
         

       {props?.data?.prices && props?.data?.prices?.length && (
  <div className="mb-4">
    <h3 className="font-medium text-base mb-3">Package Options</h3>
    
    <div className="flex flex-col gap-3 w-full">
      {props.data.prices.map((packageItem, index) => (
        <div
          key={packageItem.result_index}
          className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
            selectedPackage?.result_index === packageItem.result_index
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => setSelectedPackage(packageItem)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex  flex-col gap-2 w-full">
              <div className="flex justify-between w-full items-start">
              <div className="flex items-center gap-3">
              <div 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPackage?.result_index === packageItem.result_index
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-gray-300'
                }`}
              >
                {selectedPackage?.result_index === packageItem.result_index && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="font-medium text-gray-900">
                  {props.data?.is_package ? packageItem?.title ? packageItem.title : '' : ''}
              </div>
              {!(packageItem?.description) && !packageItem?.title &&  <div className="text-sm text-gray-600">
                  For {packageItem.pax_details.adults + packageItem.pax_details.children} people
              </div>}
              </div>
              <div className="text-right">
              <div className="font-bold text-lg">
                ₹{getIndianPrice(Math.round(packageItem.total_price))}
              </div>
              {/* <div className="text-sm text-gray-600">
                per package
              </div> */}
              </div>

              </div>

              <div className="flex flex-col ">
                
                <div className="font-normal text-gray-900 text-sm">
                  {props.data?.is_package ? packageItem?.description ? packageItem.description : '' : ''}
                </div>
                {(packageItem?.description || packageItem?.title) && <div className="text-sm text-gray-600">
                  For {packageItem.pax_details.adults + packageItem.pax_details.children} people
                </div>}
              </div>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  </div>
)}
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
            {/* {props.data?.prices?.total_price && (
              <div className="font-bold">
                <span className="text-[34px]">
                  ₹
                  {props.data?.prices?.total_price &&
                  props.data?.prices?.total_price > 0
                    ? getIndianPrice(Math.round(props.data.prices.total_price))
                    : props.data.prices.total_price}
                </span>
              </div>
            )} */}
            {selectedPackage?.total_price && (
              <div className="font-bold">
                <span className="text-[34px]">
                  ₹
                  {selectedPackage?.total_price && selectedPackage?.total_price > 0
                    ? getIndianPrice(Math.round(selectedPackage.total_price))
                    : selectedPackage.total_price}
                </span>
              </div>
            )}
          </>

  
          <button onClick={handleUpdate} className="ttw-btn-fill-yellow">
            Add to Itinerary
          </button>
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
  const [isHovered, setIsHovered] = useState(false);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginTop: "5px",
    marginLeft: "5px",
  };

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
    <div
      key={index}
      className="relative gap-3  bg-[#FAFAFA] p-[10px] rounded-[4px]"
    >
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

          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              disabled={amenity.mandatory}
              onClick={handleSelect}
              className="flex flex-row items-center gap-1 cursor-pointer"
            >
              <CheckboxFormComponent checked={included} />
            </button>

            {amenity.mandatory && (
              <div
                style={popupStyle}
                className="z-[1600] absolute -right-3 top-full mt-2  text-sm text-center flex flex-col gap-2"
              >
                {/* Tooltip arrow */}
                <div className="relative">
                  <span className="absolute -top-5 right-0  w-0 h-0 border-[10px] border-solid border-transparent border-b-red"></span>
                  <span className="absolute -top-[21px] -right-0 w-0 h-0 border-[10px] border-solid border-transparent border-b-[#2b2b2a]"></span>
                  <div className="text-nowrap font-normal text-white text-sm bg-[#2b2b2a] px-2 py-1 rounded">
                    This add on cannot be removed
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
