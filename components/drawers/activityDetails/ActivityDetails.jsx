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
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { IoFastFood, IoTicket } from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";
import Travelers from "../poiDetails/filters/Travelers";
import { color } from "framer-motion";
import Image from "next/image";
import { useSelector } from "react-redux";

const colors = ["#FFF4BF", "#FFE8DE", "#F5F0FF", "#DDF4C5"];

export default function ActivityDetails(props) {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [stars, setStars] = useState([]);
  const [inclusiveCost, setInclusiveCost] = useState([]);
  const token = useSelector((state) => state.auth.token);
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
      props?.setShowLoginModal(true);
      return;
    }
    props.updatedActivityBooking();
  };

  const handleAmenityChange = (index, included) => {
    let amenities = props.data?.amenities.filter(
      (amenity, i) => i !== index && amenity.included
    );

    if (included) {
      amenities.push(props.data?.amenities[index]);
    }

    props.fetchData({
      amenities: amenities.map((amenity) => amenity?.id).join(","),
    });
  };

  return (
    <div className="h-[100vh] overflow-y-auto">
    <div className="flex flex-col gap-4 px-4 pb-[100px]">
      <div className="sticky top-0 z-1 flex flex-row items-center gap-2 mt-4 bg-white">
        <IoMdClose
          className="hover-pointer"
          onClick={(e) => {
            props.handleCloseDrawer(e);
          }}
          style={{ fontSize: "2rem" }}
        ></IoMdClose>
      </div>
      <div className="text-[24px] font-semibold">Activity Details</div>

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
                    ? props.data?.ideal_duration_unit.toLowerCase()
                    : props.data?.ideal_duration_unit
                        .toLowerCase()
                        .slice(0, -1)}
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

        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-end">
          <Travelers
            travelers={props.filterState.pax.number_of_travelers}
            travelerAges={props.filterState.pax.traveler_ages}
            setFilterState={props.setFilterState}
          />
        </div>


        <div>
          {props.data?.general_guidelines &&
          props.data?.general_guidelines?.length ? (
            <div className="flex flex-col">
              <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                <div>General guidelines</div>
                <IoIosArrowDown />
              </div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.data.general_guidelines?.map((e, i) => (
                    <li key={i}>- {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}

          {props.data?.things_to_bring &&
          props.data?.things_to_bring?.length ? (
            <div className="flex flex-col">
              <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                <div>Things to bring</div>
                <IoIosArrowDown />
              </div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.data.things_to_bring?.map((e, i) => (
                    <li key={i}>- {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}

          {props.data?.not_suitable_for &&
          props.data?.not_suitable_for?.length ? (
            <div className="flex flex-col">
              <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                <div>Not suitable for</div>
                <IoIosArrowDown />
              </div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.data.not_suitable_for?.map((e, i) => (
                    <li key={i}>- {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}

          {props.data?.tips_tricks && props.data?.tips_tricks?.length ? (
            <div className="flex flex-col">
              <div className="text-[14px] font-medium bg-[#FAFAFA] px-[16px] py-[10px] flex justify-between rounded-[3px]">
                <div>Tips, Tricks and Cautions</div>
                <IoIosArrowDown />
              </div>
              <div className="text-[14px]">
                <ul style={{ paddingLeft: "0.5rem" }}>
                  {props.data.tips_tricks?.map((e, i) => (
                    <li key={i}>- {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {props.data?.amenities && props.data?.amenities?.length ? (
          <div className="flex flex-col gap-2 relative">
            <div className="text-[20px] font-semibold">Add - Ons</div>
            <div className="border-b-[1px]"></div>
            <div className="flex flex-col gap-2">
              {props.data.amenities.map((amenity, index) => (
                <Amenity
                  key={index}
                  index={index}
                  amenity={amenity}
                  handleAmenityChange={handleAmenityChange}
                  travelers={props.filterState.pax.number_of_travelers}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div> 
    </div>
    <div className="border-t-2 fixed bottom-0 right-0 left-0 flex justify-end gap-1 py-[12px] px-[20px] bg-white shadow-md z-50 flex justify-between items-center">
        <div className="font-bold">
          <span className="text-[24px]">₹</span>
          <span className="text-[34px]">
            {getIndianPrice(Math.round(props.data.prices.total_price))}
          </span>
          <div className="text-gray-500 font-semiBold text-[#01202B] text-[14px]">Total Cost</div>
        </div>
        <button
          onClick={handleUpdate}
          className="bg-[#F7E700] py-2 px-4 border-2 border-black rounded-lg h-[40px]"
        >
          {props.data?.city && "Add to Itinerary"}
        </button>
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
