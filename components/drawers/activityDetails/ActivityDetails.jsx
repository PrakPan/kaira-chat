import React, { useEffect, useRef } from "react";
import { useState } from "react";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import SkeletonCard from "../../ui/SkeletonCard";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { getHumanDate } from "../../../services/getHumanDate";
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
import { currencySymbols } from "../../../data/currencySymbols";
const colors = ["#d5f5d3", "#fadadd", "#F5F0FF", "#DDF4C5"];

export default function ActivityDetails(props) {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [stars, setStars] = useState([]);
  const [inclusiveCost, setInclusiveCost] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [boolDetails, setBoolDetail] = useState({
    generalGuidelines: true,
    thingsToBring: true,
    notSuitableFor: true,
    tipsTricks: true,
    Amenities: true,
  });
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const currency = useSelector((state) => state.currency);
  const itinerary = useSelector((state) => state.Itinerary);
  const isDraft = useSelector((state) => state.Itinerary.status) === "Draft";

  const pad = (n) => (n < 10 ? `0${n}` : n);

  const convertToISODate = (dateStr) => {
    if (!dateStr) return;
    const [day, month, year] = dateStr?.split("/");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };

  // Resolve effective start date — prefer prop.date, then city check_in,
  // then city start_date, then itinerary-level start_date as last resort, then today.
  // (When opened through chatkitpanel, city-level check_in should win over
  // itinerary.start_date so the default reflects the city the activity belongs to.)
  const resolveEffectiveDate = () => {
    if (props?.date) {
      const d = new Date(props.date);
      if (!isNaN(d.getTime())) return props.date;
    }
    const cityCheckIn =
      props?.check_in ||
      props?.city?.check_in ||
      props?.city?.checkIn ||
      null;
    if (cityCheckIn) {
      const d = new Date(cityCheckIn);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    if (props?.start_date) {
      const d = new Date(props.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    if (props?.city?.start_date) {
      const d = new Date(props.city.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    // Fall back to itinerary-level start_date only if nothing city-specific is available
    if (itinerary?.start_date) {
      const d = new Date(itinerary.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    const today = new Date();
    return `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;
  };

  const effectiveDate = resolveEffectiveDate();

  // Resolve city duration: prop → city object → derived from check_in/check_out
  // → itinerary Redux city lookup → 0. The extra fallbacks cover the chatkitpanel
  // entry point where props.duration / itinerary.cities may not be populated.
  const resolvedCityDuration = (() => {
    const direct = Number(props.duration);
    console.log("Direct duration from props:", direct, direct > 0);
    if (direct > 0) return direct;

    const fromCityObj = Number(
      props?.city?.duration ?? props?.city?.nights ?? props?.cityDuration,
    );
    if (fromCityObj > 0) return fromCityObj;

    const ci = props?.check_in || props?.city?.check_in || props?.city?.checkIn;
    const co = props?.check_out || props?.city?.check_out || props?.city?.checkOut;
    if (ci && co) {
      const d1 = new Date(ci);
      const d2 = new Date(co);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffDays = Math.round(
          (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays > 0) return diffDays;
      }
    }

    if (props?.itinerary_city_id && itinerary?.cities) {
      const match = itinerary.cities.find(
        (c) => String(c.id) === String(props.itinerary_city_id),
      );
      console.log("Matched itinerary city for duration:", match);
      if (match?.duration > 0) return Number(match.duration);
    }
    return 0;
  })();

  // Total day options available in the dropdown (Day 1..N+1). "N" is the
  // number of nights; the +1 accounts for the checkout day, so a 1-night stay
  // still surfaces two options (arrival + checkout) and a 3-night stay shows
  // four. The picker is always rendered — even a 1-day option is informational.
  const totalDayOptions = Math.max(0, resolvedCityDuration) + 1;

  // Currency-aware number formatting. INR uses Indian grouping (1,23,456);
  // other currencies use international grouping (123,456).
  const formatAmount = (amount) => {
    if (amount == null || isNaN(Number(amount))) return amount;
    const rounded = Math.round(Number(amount));
    const isIndian = !currency?.currency || currency.currency === "INR";
    return isIndian ? getIndianPrice(rounded) : rounded.toLocaleString("en-US");
  };

  const [startDate, setStartDate] = useState(effectiveDate);
  const [showCalender, setShowCalender] = useState(false);
  const calendarRef = useRef(null);
  // FIX: separate ref for the date box trigger so outside-click doesn't
  // immediately close the dropdown right after it opens
  const dateBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if the click is outside BOTH the dropdown AND the trigger box
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        dateBoxRef.current &&
        !dateBoxRef.current.contains(event.target)
      ) {
        setShowCalender(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Compute the selected day number (Day 1..N) from the startDate
  const selectedDayNumber = (() => {
    const cityStartRaw = props?.start_date || props?.date || null;
    const baseDateStr = props?.mercuryItinerary
      ? (cityStartRaw || itinerary?.start_date || null)
      : convertToISODate(cityStartRaw || itinerary?.start_date || null);
    const baseDate = baseDateStr ? new Date(baseDateStr) : null;
    if (!baseDate || isNaN(baseDate.getTime())) return 1;
    const [d, m, y] = (startDate || "").split("/");
    if (!d || !m || !y) return 1;
    const selected = new Date(`${y}-${m}-${d}`);
    if (isNaN(selected.getTime())) return 1;
    const diff = Math.round(
      (selected.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff >= 0 ? diff + 1 : 1;
  })();

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

  const handlePaxChange = (newPax) => {
    const updatedFilterState = {
      ...props.filterState,
      adults: newPax.adults,
      children: newPax.children,
      childAges: newPax.childAges || [],
      number_of_travelers: newPax.adults + newPax.children,
      children_ages: [
        ...(newPax.childAges || []),
      ],
    };
    props.setFilterState(updatedFilterState);
    props.fetchData({ _paxOverride: updatedFilterState });
  };

  const handleUpdate = (e) => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      props?.setShowLoginModal(true);
      return;
    }
    const bookingData = {
      ...e,
      result_index: selectedPackage?.result_index,
      date: startDate,
      start_date: convertToISODate(startDate),
      day: selectedDayNumber,
    };

    // Chat-opened flow: route the booking intent up to the orchestrator via
    // a widget action instead of calling the booking API directly. The chat
    // runtime has the session context (itinerary id, dates) the drawer does
    // not, so it's the correct place to actually book.
    if (typeof props?.onAddToItinerary === "function") {
      props.onAddToItinerary({
        activity_id: props?.data?.id,
        itinerary_city_id: props?.itinerary_city_id,
        result_index: selectedPackage?.result_index,
        start_date: convertToISODate(startDate),
        day: selectedDayNumber,
        number_of_adults: props?.filterState?.adults,
        number_of_children: props?.filterState?.children,
        children_ages: props?.filterState?.children_ages,
        amenities: (props?.data?.amenities ?? [])
          .filter((a) => a?.included)
          .map((a) => a?.id),
      });
      setLoading(false);
      props?.handleCloseDrawer(e);
      return;
    }

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

  // Shared day list content rendered inside both mobile and desktop dropdowns
  const DayListContent = () => (
    <>
      {/* <div className="font-medium text-[14px]">Select Days</div> */}
      {[...Array(Math.max(0, resolvedCityDuration) + 1)].map((_, i) => {
        const cityStartRaw = props?.start_date || props?.date || null;
        const baseDateStr = props?.mercuryItinerary
          ? cityStartRaw || itinerary?.start_date || null
          : convertToISODate(
              cityStartRaw || itinerary?.start_date || null,
            );

        const baseDate = new Date(baseDateStr);
        if (isNaN(baseDate.getTime())) return null;

        const currentDate = new Date(baseDate);
        currentDate.setDate(currentDate.getDate() + i);

        const year = currentDate.getFullYear();
        const month = pad(currentDate.getMonth() + 1);
        const day = pad(currentDate.getDate());
        const dateString = `${day}/${month}/${year}`;
        const displayDate = getHumanDate(dateString);

        return (
          <div
            key={i}
            className={`cursor-pointer ${
              startDate === dateString ? "text-black font-semibold" : "text-[#4a4a4a]"
            }`}
            onClick={() => {
              setStartDate(dateString);
              setShowCalender(false);
            }}
          >
            <span className="font-bold text-[14px]">
              {displayDate + " | "}
            </span>
            <span>Day {i + 1}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="h-[100vh] overflow-y-auto px-4">
      <div className="flex flex-col gap-4  mb-[100px] pb-[20px]">
        <div className="mt-xl">
          <Image
            src="/backarrow.svg"
            className="cursor-pointer"
            width={22}
            height={2}
            onClick={(e) => props.handleCloseDrawer(e)}
          />
        </div>
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
                  props.data?.image && !imageFail
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
              <div className="text-md-lg leading-xl-sm font-600 mb-0">
                {props.data?.display_name || props.data.name}
              </div>
            </div>

            <div className="flex gap-2">
              {!isDraft && (
                <Pax
                  pax={{
                    ...props?.filterState,
                    childAges: props?.filterState?.childAges || [],
                  }}
                  setPax={handlePaxChange}
                />
              )}

              {/* FIX: wrap trigger + dropdown in a relative container so
                  the desktop dropdown can be positioned with absolute top-full.
                  Always rendered — a 1-night stay still has 2 options (arrival
                  + checkout), and even a single-day option is informational. */}
              <div className="relative">
                {/* Date box trigger */}
                <div
                  ref={dateBoxRef}
                  className="flex items-center w-auto bg-[#F9F9F9] py-[0.7rem] px-4 rounded-lg justify-between cursor-pointer"
                  onClick={() => setShowCalender((prev) => !prev)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[14px]">
                      {getHumanDate(startDate) + " | "}
                    </span>
                    <span>Day {selectedDayNumber}</span>
                  </div>
                  <IoIosArrowDown
                    className={`transition-transform ml-2 ${
                      showCalender ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Desktop dropdown — positioned absolutely below the trigger */}
                {showCalender && (
                  <div
                    ref={calendarRef}
                    className="max-ph:hidden md:flex md:flex-col absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 shadow-lg rounded-lg p-4 gap-3 text-sm z-[1091] max-h-[300px] overflow-y-auto"
                  >
                    <DayListContent />
                  </div>
                )}
              </div>
            </div>

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
                    className={`rounded-full px-2 py-1`}
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
                <div className="text-[20px] font-semibold text-green">
                  Inclusions
                </div>
                <div className="border-b-[1px]"></div>
                <div className="text-[14px]">
                  <ul style={{ paddingLeft: "0.5rem" }}>
                    {props.data.inclusions.map((inclusion, i) => (
                      <li key={i} className="mb-1">
                        - {inclusion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {props.data?.exclusions && props.data?.exclusions?.length > 0 && (
              <div className="flex flex-col gap-2 mb-[30px]">
                <div className="text-[20px] font-semibold text-red">
                  Exclusions
                </div>
                <div className="border-b-[1px]"></div>
                <div className="text-[14px]">
                  <ul style={{ paddingLeft: "0.5rem" }}>
                    {props.data.exclusions.map((exclusion, i) => (
                      <li key={i} className="mb-1">
                        - {exclusion}
                      </li>
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
          </div>

          <div>
            {props.data?.general_guidelines?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>General guidelines</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
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
            ) : null}

            {props.data?.things_to_bring?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>Things to bring</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
                </div>
                {boolDetails?.thingsToBring && (
                  <div className="text-[14px]">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.things_to_bring?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {props.data?.not_suitable_for?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>Not suitable for</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
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
            ) : null}

            {props.data?.tips_tricks?.length ? (
              <div className="flex flex-col">
                <div className="text-[20px] font-semibold">
                  <div>Tips, Tricks and Cautions</div>
                  <div className="border-b-[1px] mt-2 mb-2"></div>
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
            ) : null}
          </div>

          {props.data?.amenities && props.data?.amenities?.length ? (
            <div className="flex flex-col gap-2  mb-[30px]">
              <div className="text-[20px] font-semibold">Add - Ons</div>
              <div className="border-b-[1px]"></div>
              <div className="flex flex-col gap-2">
                {props.data.amenities.map((amenity, index) => (
                  <div key={index}>
                    <Amenity
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

          {!isDraft && props?.data?.prices && props?.data?.prices?.length && (
            <div className="mb-4">
              <h3 className="font-medium text-base mb-3">Package Options</h3>

              <div className="flex flex-col gap-3 w-full">
                {props.data.prices.map((packageItem, index) => (
                  <div
                    key={packageItem.result_index}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedPackage?.result_index === packageItem.result_index
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPackage(packageItem)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex  flex-col gap-2 w-full">
                        <div className="flex justify-between w-full items-start">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedPackage?.result_index ===
                                packageItem.result_index
                                  ? "border-yellow-400 bg-yellow-400"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedPackage?.result_index ===
                                packageItem.result_index && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="font-medium text-gray-900">
                              {props.data?.is_package
                                ? packageItem?.title
                                  ? packageItem.title
                                  : ""
                                : ""}
                            </div>
                            {!(packageItem?.description) &&
                              !packageItem?.title &&
                              packageItem.pax_details?.adults && (
                                <div className="text-sm text-gray-600">
                                  For{" "}
                                  {packageItem.pax_details?.adults +
                                    packageItem.pax_details?.children}{" "}
                                  people
                                </div>
                              )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {`${
                                currency?.currency
                                  ? currencySymbols?.[currency?.currency]
                                  : "₹"
                              }`}
                              {formatAmount(packageItem.total_price)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col ">
                          <div className="font-normal text-gray-900 text-sm">
                            {props.data?.is_package
                              ? packageItem?.description
                                ? packageItem.description
                                : ""
                              : ""}
                          </div>
                          {(packageItem?.description || packageItem?.title) && (
                            <div className="text-sm text-gray-600">
                              For{" "}
                              {packageItem.pax_details.adults +
                                packageItem.pax_details.children}{" "}
                              people
                            </div>
                          )}
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

      {/* Mobile bottom sheet — hidden on md+ screens */}
      {showCalender && (
        <div
          className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-2xl drop-shadow-3xl p-[16px] rounded-t-xl space-y-5 text-sm z-[1091] max-h-[60vh] overflow-y-auto md:hidden"
          ref={calendarRef}
        >
          <DayListContent />
        </div>
      )}

      {(!isDraft || typeof props?.onAddToItinerary === "function") && <div className="scroll-none border-t-2 fixed bottom-0 right-0 left-0 gap-1 py-[12px] px-[20px] bg-white shadow-md z-50">
        <div className="flex justify-between items-center">
          <>
            {selectedPackage?.total_price && (
              <div className="font-bold">
                <span className="text-[34px]">
                  {`${
                    currency?.currency
                      ? currencySymbols?.[currency?.currency]
                      : "₹"
                  }`}
                  {selectedPackage?.total_price &&
                  selectedPackage?.total_price > 0
                    ? formatAmount(selectedPackage.total_price)
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
            for { (props?.filterState.adults + props?.filterState?.children) || (itinerary?.number_of_adults + itinerary?.number_of_children)}{" "}
            people{" "}
          </span>
          <div className="text-[14px] sm:text-[16px]">
            on {getHumanDate(startDate) || dateFormat(props?.date)}
          </div>
        </div>
      </div>}
    </div>
  );
}

export const Amenity = ({ index, amenity, handleAmenityChange, travelers }) => {
  const [included, setIncluded] = useState(amenity?.included);
  const [isHovered, setIsHovered] = useState(false);
  const currency = useSelector((state) => state.currency);
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
          {amenity.name}
        </div>
        <div className="text-[14px]">{amenity.description}</div>
        {travelers ? <div className="flex text-[12px] font-medium">
          <Image src="/ticket.svg" alt="ticket" width={13.33} height={10.67} />
          {travelers} tickets
        </div> : null}
      </div>

      {amenity.price == 0 ? (
        <div className=" text-md font-semibold  text-[#277004] ">
          Included for free
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[24px]">
            {`${
              currency?.currency ? currencySymbols?.[currency?.currency] : "₹"
            }`}
            {(() => {
              const rounded = Math.round(Number(amenity.price));
              const isIndian = !currency?.currency || currency.currency === "INR";
              return isIndian
                ? getIndianPrice(rounded)
                : rounded.toLocaleString("en-US");
            })()}{" "}
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